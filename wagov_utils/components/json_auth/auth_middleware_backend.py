
from __future__ import annotations

import json
import threading
import os
from pathlib import Path
from typing import Optional, Dict, Any, Set, List

from django.conf import settings
from django.contrib.auth.hashers import check_password
from django.core.exceptions import ImproperlyConfigured


from wagov_utils.components.json_auth.auth_middleware_backend_json_user import SimpleJSONUser



class _JSONAuthStore:
    """
    Thread-safe loader with mtime-based caching of the JSON file.
    Provides fast lookups for users and groups without any database.
    """
    def __init__(self):
        # self._path = Path(path)
        self._lock = threading.RLock()
        self._cache_mtime: Optional[float] = None
        self._users_by_username: Dict[str, Dict[str, Any]] = {}
        self._groups: Dict[str, List[str]] = {}

    # def _load_if_changed(self):
    #     with self._lock:
    #         if not self._path.exists():
    #             raise FileNotFoundError(f"JSON auth file not found: {self._path}")
    #         mtime = self._path.stat().st_mtime
    #         if self._cache_mtime is not None and mtime == self._cache_mtime:
    #             return

    #         with self._path.open("r", encoding="utf-8") as fh:
    #             data = json.load(fh)

    #         # users = data.get("users", [])
    #         # by_username = {}
    #         # for u in users:
    #         #     uname = (u.get("email") or "").strip()
    #         #     if uname:
    #         #         by_username[uname] = u

    #         # self._users_by_username = by_username
    #         self._groups = data.get("groups", {}) or {}
    #         self._cache_mtime = mtime
    
    def get_user_json(self,username):
        dir1 = username[0]
        dir2 = username[1]
        data = {}
        self._users_by_username = None
        try:        
            file_path = Path(settings.JSON_AUTH_STORE_DB+"./users/{}/{}/{}.json".format(dir1,dir2,username))
            if file_path.exists():
                # Load JSON file into a variable
                with file_path.open("r", encoding="utf-8") as f:
                    data = json.load(f)  
                by_username={}
                by_username[username] = data
                self._users_by_username = by_username            
                return data                  
        except Exception as e:
            print (e)

        return data
        

    def get_user_record(self, username: str) -> Optional[Dict[str, Any]]:
        
        # self._load_if_changed()
        self.get_user_json(username)
        if self._users_by_username:
            return self._users_by_username.get(username)
        else:
            return None
    
    def create_update_user(self,email,password,is_active, first_name, last_name, is_staff, is_superuser,groups,permissions):
        dir1 = email[0]
        dir2 = email[1]
        data = {}

        try:
            BASE_DIR_PATH = Path(settings.JSON_AUTH_STORE_DB+"./users/{}/{}/".format(dir1,dir2))
            file_path = Path(str(BASE_DIR_PATH)+"/{}.json".format(email))            
            if file_path.exists():
                # Load JSON file into a variable
                with file_path.open("r", encoding="utf-8") as f:
                    data = json.load(f)                
                user = data
                if password is not None:
                    user['password']= password
                if is_active is not None:
                    user['is_active']= is_active
                if first_name is not None:
                    user['first_name'] = first_name
                if last_name is not None:
                    user['last_name'] = last_name
                if is_staff is not None:
                    user['is_staff'] = is_staff
                if is_superuser is not None:
                    user['is_superuser'] = is_superuser
                if groups is not None:
                    user['groups'] = groups
                if permissions is not None:   
                    user['permissions'] = permissions


            else:
                os.makedirs(BASE_DIR_PATH, exist_ok=True)
                user = {                                        
                    "password": password,
                    "is_active": is_active,
                    "email": email,
                    "first_name": first_name,
                    "last_name": last_name,
                    "is_staff": is_staff,
                    "is_superuser": is_superuser,
                    "groups": groups,
                    "permissions": permissions
                }                
            json_text = json.dumps(user, ensure_ascii=False, indent=2)
            with open(file_path, "w") as f:
                f.write(json_text)                
        except Exception as e:
            print (e)

        return data



    def get_group_permissions(self, group_names: List[str]) -> Set[str]:
        # self._load_if_changed()
        perms: Set[str] = set()
        for g in group_names or []:
            perms.update(self._groups.get(g, []))
        return perms


class JSONFileOnlyBackend:
    """
    A DB-free authentication backend:
      - Reads credentials and profile from a JSON file.
      - Returns a SimpleJSONUser (no database row).
      - Stores 'username' as session user_id.
      - Computes permissions as the union of user.permissions + group-based permissions (from JSON).
    Settings required:
        JSON_AUTH_FILE = BASE_DIR / "secrets" / "users.json"
    Optional:
        JSON_AUTH_USERNAME_FIELD = "username"  # for future-proofing
    """

    def __init__(self):        
        path = getattr(settings, "JSON_AUTH_FILE", None)
        if not path:
            raise ImproperlyConfigured("Missing settings.JSON_AU'HTTP_REMOTE_USER'TH_FILE")
        # self.store = _JSONAuthStore(Path(path))
        self.store = _JSONAuthStore()
        self.username_field = getattr(settings, "JSON_AUTH_USERNAME_FIELD", "username")

    # --- Auth API ---

    def authenticate(self, request, username: Optional[str] = None, password: Optional[str] = None, **kwargs):
        """
        Validate username/password against JSON and return a SimpleJSONUser on success.
        """        
        if username is None or password is None:
            # Some auth flows pass credentials under different keys:
            username = kwargs.get(self.username_field)
            password = kwargs.get("password")
            if username is None or password is None:
                return None

        try:
            rec = self.store.get_user_record(username)           
        except FileNotFoundError:
            return None
        if not rec:
            return None

        # Active flag (default True)
        is_active = bool(rec.get("is_active", True))
        if not is_active:
            return None

        stored = rec.get("password") or ""

        # 1) Try Django-compatible hash (pbkdf2, argon2, etc.)
        if stored and not stored.startswith("plain:"):
            if not check_password(password, stored):
                return None
        else:
            # 2) Dev-only plain text support
            if not stored.startswith("plain:") or stored[len("plain:"):] != password:
                return None

        # Build effective permission set (user perms + groups)
        user_perms = set(rec.get("permissions", []) or [])
        group_names = list(filter(None, rec.get("groups", []) or []))
        group_perms = self.store.get_group_permissions(group_names)
        effective_perms = set(user_perms) | set(group_perms)

        # Construct DB-free user object
        user = SimpleJSONUser(
            
            # user_id=rec.get("user_id",0),
            email=rec.get("email", "") or "",
            first_name=rec.get("first_name", "") or "",
            last_name=rec.get("last_name", "") or "",
            is_active=is_active,
            is_staff=bool(rec.get("is_staff", False)),
            is_superuser=bool(rec.get("is_superuser", False)),
            _permissions=effective_perms,
        )

        return user

    def get_user(self, username: str) -> Optional[SimpleJSONUser]:
        """
        Called by Django to re-hydrate a user from the session. We look the user up in the JSON again.
        """
        try:
            rec = self.store.get_user_record(username)
        except FileNotFoundError:
            return None
        if not rec:
            return None
        if not bool(rec.get("is_active", True)):
            return None

        user_perms = set(rec.get("permissions", []) or [])
        group_names = list(filter(None, rec.get("groups", []) or []))
        group_perms = self.store.get_group_permissions(group_names)
        effective_perms = set(user_perms) | set(group_perms)
        # username=rec.get("username"),
        return SimpleJSONUser(
            
            email=rec.get("email", "") or "",
            first_name=rec.get("first_name", "") or "",
            last_name=rec.get("last_name", "") or "",
            is_active=bool(rec.get("is_active", True)),
            is_staff=bool(rec.get("is_staff", False)),
            is_superuser=bool(rec.get("is_superuser", False)),
            _permissions=effective_perms,
        )

    # --- Permission hooks (so request.user.has_perm works via this backend) ---

    def get_user_permissions(self, user_obj, obj=None):
        return set(user_obj.get_all_permissions()) if user_obj and user_obj.is_authenticated else set()

    def get_group_permissions(self, user_obj, obj=None):
        # Permissions are already merged in SimpleJSONUser; return same set here.
        return set(user_obj.get_all_permissions()) if user_obj and user_obj.is_authenticated else set()

    def get_all_permissions(self, user_obj, obj=None):
        return set(user_obj.get_all_permissions()) if user_obj and user_obj.is_authenticated else set()

    def has_perm(self, user_obj, perm, obj=None):
        return bool(user_obj and user_obj.is_authenticated and user_obj.has_perm(perm, obj=obj))

    def has_module_perms(self, user_obj, app_label):
        return bool(user_obj and user_obj.is_authenticated and user_obj.has_module_perms(app_label))
