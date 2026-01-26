
from __future__ import annotations
from dataclasses import dataclass, field
from typing import Set, Optional
from datetime import datetime


class _PseudoPK:
    @staticmethod
    def value_to_string(user) -> str:
        return str(getattr(user, "pk", getattr(user, "email", "")))


class _PseudoMeta:
    pk = _PseudoPK()
    model_name = "simplejsonuser"
    app_label = "auth"


@dataclass
class SimpleJSONUser:
    """
    DB-free user object compatible with django.contrib.auth.login() and
    update_last_login signal (no-op save).
    """
    
    #username: str
    email: str = ""
    first_name: str = ""
    last_name: str = ""
    is_active: bool = True
    is_staff: bool = False
    is_superuser: bool = False
    _permissions: Set[str] = field(default_factory=set)

    # Fields used by Django's update_last_login signal
    last_login: Optional[datetime] = None

    # Model-like shim required by auth.login()
    _meta: _PseudoMeta = _PseudoMeta()

    # Expected by Django
    @property
    def is_authenticated(self) -> bool:
        return True

    @property
    def is_anonymous(self) -> bool:
        return False

    @property
    def pk(self) -> str:
        return self.email

    @property
    def id(self) -> str:
        return self.email

    def get_username(self) -> str:
        return self.email

    def get_all_permissions(self):
        return set(self._permissions)

    def has_perm(self, perm: str, obj=None) -> bool:
        if self.is_superuser:
            return True
        return perm in self._permissions

    def has_perms(self, perm_list) -> bool:
        if self.is_superuser:
            return True
        perms = self._permissions
        return all(p in perms for p in perm_list)

    def has_module_perms(self, app_label: str) -> bool:
        if self.is_superuser:
            return True
        prefix = f"{app_label}."
        return any(p.startswith(prefix) for p in self._permissions)

    # --- NEW: make Django's update_last_login happy (no-op) ---
    def save(self, *args, **kwargs):
        """
        No-op to satisfy django.contrib.auth.models.update_last_login, which does:
            user.last_login = timezone.now()
            user.save(update_fields=['last_login'])
        We don't persist anything (DB-free).
        """
        return
