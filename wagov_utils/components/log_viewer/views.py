import os
import importlib
import logging

from django.conf import settings
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse, HttpResponseForbidden
from django.contrib.auth.views import redirect_to_login
from django.views import generic as base


logger = logging.getLogger(__name__)


# ---------------------------------------------------------------------------
# Settings helpers
# ---------------------------------------------------------------------------

def _get_permission_func():
    """
    Return the permission-check callable.

    Configure in settings.py:
        LOG_VIEWER_PERMISSION_FUNC = 'myapp.utils.can_view_logs'

    The callable must accept a single argument (the request.user) and return
    True/False.  Defaults to requiring staff status.
    """
    func_path = getattr(settings, 'LOG_VIEWER_PERMISSION_FUNC', None)
    if func_path is None:
        return lambda user: user.is_authenticated and user.is_staff
    module_path, func_name = func_path.rsplit('.', 1)
    module = importlib.import_module(module_path)
    return getattr(module, func_name)


def _get_log_dir():
    """
    Directory that contains the log files.

    Configure in settings.py:
        LOG_VIEWER_LOG_DIR = os.path.join(BASE_DIR, 'logs')
    """
    return getattr(settings, 'LOG_VIEWER_LOG_DIR', os.path.join(settings.BASE_DIR, 'logs'))


def _get_log_files():
    """
    List of log file names (basenames) to expose in the viewer.

    Configure in settings.py:
        LOG_VIEWER_LOG_FILES = ['app.log', 'cron.log']
    """
    return getattr(settings, 'LOG_VIEWER_LOG_FILES', [])


def _get_fetch_interval():
    """
    Polling interval in milliseconds.

    Configure in settings.py:
        LOG_VIEWER_FETCH_INTERVAL_MS = 3000
    """
    return getattr(settings, 'LOG_VIEWER_FETCH_INTERVAL_MS', 3000)


def _get_base_template():
    """
    The base template that logfile.html will extend.

    Configure in settings.py:
        LOG_VIEWER_BASE_TEMPLATE = 'govapp/base.html'
    """
    return getattr(settings, 'LOG_VIEWER_BASE_TEMPLATE', 'base.html')


# ---------------------------------------------------------------------------
# Utility
# ---------------------------------------------------------------------------

def tail_lines(file_path, lines=1000, block_size=1024):
    """
    Efficiently retrieves the last ``lines`` lines from ``file_path`` in
    binary mode.  Returns a list of decoded strings.
    """
    with open(file_path, 'rb') as f:
        f.seek(0, os.SEEK_END)
        file_size = f.tell()
        data = b""
        lines_to_find = lines + 1
        while file_size > 0 and data.count(b'\n') < lines_to_find:
            increment = min(block_size, file_size)
            file_size -= increment
            f.seek(file_size)
            data = f.read(increment) + data
        all_lines = data.splitlines(keepends=True)
        return [line.decode('utf-8', errors='replace') for line in all_lines[-lines:]]


# ---------------------------------------------------------------------------
# Views
# ---------------------------------------------------------------------------

class LogFileView(base.TemplateView):
    """
    Renders the real-time log viewer page.

    Required settings
    -----------------
    LOG_VIEWER_BASE_TEMPLATE  : base template to extend (e.g. 'govapp/base.html')
    LOG_VIEWER_LOG_FILES      : list of log filenames shown in the selector
    LOG_VIEWER_FETCH_INTERVAL_MS : polling interval in ms (default 3000)
    LOG_VIEWER_PERMISSION_FUNC   : dotted path to a callable (user) -> bool
    """
    template_name = 'log_viewer/logfile.html'

    def dispatch(self, request, *args, **kwargs):
        permission_func = _get_permission_func()
        if not permission_func(request.user):
            if not request.user.is_authenticated:
                return redirect_to_login(request.get_full_path())
            return HttpResponseForbidden("Permission denied.")
        return super().dispatch(request, *args, **kwargs)

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['log_files'] = sorted(_get_log_files())
        context['log_file_fetching_interval_ms'] = _get_fetch_interval()
        context['base_template'] = _get_base_template()
        return context


@login_required
def get_logs(request):
    """
    API endpoint that returns log updates based on the given offset.

    Query parameters
    ----------------
    log_file_name : str   – basename of the log file (must be in LOG_VIEWER_LOG_FILES)
    last_position : int   – byte offset from a previous response; omit for initial load
    lines_count   : int   – number of lines to return on initial load (default 1000)

    Returns
    -------
    On initial load::

        {"log_lines": [...], "current_position": <int>}

    On subsequent polls::

        {"new_lines": [...], "current_position": <int>}
    """
    permission_func = _get_permission_func()
    if not permission_func(request.user):
        return HttpResponseForbidden()

    log_dir = _get_log_dir()
    log_files = _get_log_files()
    default_log_file = log_files[0] if log_files else ''

    log_file_name = request.GET.get('log_file_name', default_log_file)

    # Security: only allow files listed in LOG_VIEWER_LOG_FILES
    if log_file_name not in log_files:
        return HttpResponseForbidden("Log file not allowed.")

    log_file_path = os.path.join(log_dir, log_file_name)
    last_position_param = request.GET.get('last_position', None)
    MAX_NUM_LINES_TO_READ = 10000

    try:
        lines_count = int(request.GET.get('lines_count', 1000))
        lines_count = min(lines_count, MAX_NUM_LINES_TO_READ)
    except (TypeError, ValueError):
        lines_count = 1000

    if last_position_param is not None:
        # Log is already displayed in the frontend – return only new lines.
        try:
            last_position = int(last_position_param)
        except ValueError:
            last_position = 0
        if last_position < 0:
            last_position = 0

        new_lines = []
        current_position = last_position

        if os.path.exists(log_file_path):
            with open(log_file_path, 'rb') as log:
                log.seek(last_position)
                new_lines = []
                for _ in range(MAX_NUM_LINES_TO_READ):
                    line = log.readline()
                    if not line:
                        break
                    new_lines.append(line.decode('utf-8', errors='replace'))
                current_position = log.tell()
        else:
            logger.warning(f"Log file '[{log_file_path}]' does not exist.")

        return JsonResponse({
            'new_lines': new_lines,
            'current_position': current_position,
        })

    else:
        # Initial load – return the last X lines.
        last_x_lines = []
        if os.path.exists(log_file_path):
            last_x_lines = tail_lines(log_file_path, lines=lines_count)
        else:
            logger.warning(f"Log file '[{log_file_path}]' does not exist.")

        current_position = os.path.getsize(log_file_path) if os.path.exists(log_file_path) else 0

        return JsonResponse({
            'log_lines': last_x_lines,
            'current_position': current_position,
        })
