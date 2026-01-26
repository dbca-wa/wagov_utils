
# your_app/middleware.py
from django.contrib.auth.models import AnonymousUser
from django.utils.module_loading import import_string
from django.contrib.auth import BACKEND_SESSION_KEY, SESSION_KEY, HASH_SESSION_KEY

class JSONAuthMiddleware:
    """
    Minimal auth middleware that attaches `request.user` from session
    using your JSON-only backend. This is a DB-free variant of Django's
    AuthenticationMiddleware, with optional fallback backend path.
    """
    def __init__(self, get_response, backend_fallback=None):
        self.get_response = get_response
        self.backend_fallback = backend_fallback or \
            "wagov_utils.components.json_auth.auth_middleware_backend.JSONFileOnlyBackend"

    def __call__(self, request):

        user = None
        user_id = request.session.get(SESSION_KEY)
        backend_path = request.session.get(BACKEND_SESSION_KEY) or self.backend_fallback

        if user_id and backend_path:
            try:
                backend = import_string(backend_path)()
                user = backend.get_user(user_id)
            except Exception:
                # If anything blows up, fall through to AnonymousUser
                user = None

        request.user = user if user is not None else AnonymousUser()
        request.session.is_authenticated = request.user.is_authenticated
        request.session.user_obj = request.user
        return self.get_response(request)
