
# your_app/auth/no_signal_login.py
from django.conf import settings
from django.contrib.auth import BACKEND_SESSION_KEY, HASH_SESSION_KEY, SESSION_KEY
from django.utils.crypto import constant_time_compare

def login_without_signal(request, user, backend_path: str):
    """
    DB-free login: equivalent to django.contrib.auth.login but DOES NOT send user_logged_in.
    """
    # Rotate session for security (same as auth.login)
    session_auth_hash = user.get_session_auth_hash() if hasattr(user, "get_session_auth_hash") else None

    if SESSION_KEY in request.session:
        if session_auth_hash and HASH_SESSION_KEY in request.session:
            if not constant_time_compare(
                request.session[HASH_SESSION_KEY],
                session_auth_hash,
            ):
                request.session.flush()
        else:
            request.session.flush()
    else:
        request.session.cycle_key()

    # Store user identity in session (same keys as auth.login)
    request.session[SESSION_KEY] = user._meta.pk.value_to_string(user)
    request.session[BACKEND_SESSION_KEY] = backend_path
    if session_auth_hash:
        request.session[HASH_SESSION_KEY] = session_auth_hash
    print ("LOGIN")
    print (user)
    # Attach user to request for this response cycle
    request.user = user
