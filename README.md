# wagov_utils

Shared Django utilities for WA Government web applications, developed by the Department of Biodiversity, Conservation and Attractions (DBCA).

## Installation

```bash
pip install git+https://github.com/dbca-wa/wagov_utils.git#egg=wagov_utils
```

To install a specific branch:

```bash
pip install git+https://github.com/dbca-wa/wagov_utils.git@<branch-name>#egg=wagov_utils
```

---

## Components

### `log_viewer`

A reusable Django component that provides a browser-based log file viewer with real-time polling.

#### Features

- Displays log files in the browser with auto-reload, line wrapping, and auto-scroll
- Supports multiple log files via a dropdown selector
- Secure: access is controlled by a configurable permission function
- Integrates with your project's existing base template

#### Setup

**1. Add to `INSTALLED_APPS`:**

```python
INSTALLED_APPS = [
    ...
    "wagov_utils.components.log_viewer",
]
```

**2. Add to `urls.py`:**

```python
from django.urls import include, path

urlpatterns = [
    ...
    path("", include("wagov_utils.components.log_viewer.urls")),
]
```

This exposes two endpoints:
- `GET /logfile/` — the log viewer page
- `GET /api/logcontents/` — JSON API used internally for polling

**3. Configure in `settings.py`:**

| Setting | Required | Default | Description |
|---|---|---|---|
| `LOG_VIEWER_LOG_DIR` | Yes | `<BASE_DIR>/logs` | Absolute path to the directory containing log files |
| `LOG_VIEWER_LOG_FILES` | Yes | `[]` | List of log file basenames to expose (e.g. `["app.log", "cron.log"]`) |
| `LOG_VIEWER_BASE_TEMPLATE` | No | `"base.html"` | Base template that the log viewer page extends |
| `LOG_VIEWER_FETCH_INTERVAL_MS` | No | `3000` | Polling interval in milliseconds |
| `LOG_VIEWER_PERMISSION_FUNC` | No | staff users only | Dotted path to a callable `(user) -> bool` that controls access |

**Example:**

```python
LOG_VIEWER_LOG_DIR = os.path.join(BASE_DIR, "logs")
LOG_VIEWER_LOG_FILES = ["app.log", "cron.log"]
LOG_VIEWER_BASE_TEMPLATE = "myapp/base.html"
LOG_VIEWER_FETCH_INTERVAL_MS = 5000
LOG_VIEWER_PERMISSION_FUNC = "myapp.utils.can_view_logs"
```

**Example permission function:**

```python
def can_view_logs(user):
    return user.is_authenticated and user.is_staff
```

---

### `proxy`

A view function for proxying HTTP requests to a remote URL.

```python
from wagov_utils.components.proxy.views import proxy_view

urlpatterns = [
    path("proxy/<path:url>", proxy_view),
]
```

---

### `middleware`

Authentication middleware for WA Government SSO (Auth2). Includes:

- `auth2_middleware.py` — Auth2 authentication middleware
- `auth2_session_middleware.py` — Auth2 session middleware
- `no_signal_login_middleware.py` — Login middleware that suppresses signals

---

### `json_auth`

Authentication backends for Auth2 SSO with JSON user support. Includes:

- `auth_middleware_backend.py`
- `auth_middleware_backend_json_user.py`
- `auth2_sso_middleware.py`
- `no_signal_login.py`

---

### `utils`

Shared email utilities:

- `email.py` — Email helper functions
- `email_backend.py` — Custom email backend

---

## License

BSD License. See [LICENSE](LICENSE) for details.
