from datetime import datetime, timedelta
from typing import Any, Dict, Optional

from fastapi import Depends
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from jose import JWTError, jwt
from passlib.context import CryptContext

from backend.config import settings
from backend.core.exceptions import AppException


pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
security = HTTPBearer(auto_error=False)


def hash_password(password: str) -> str:
    return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)


def create_access_token(payload: Dict[str, Any]) -> str:
    token_payload = dict(payload)
    expires_at = datetime.utcnow() + timedelta(hours=settings.access_token_expire_hours)
    token_payload.update({"exp": expires_at})
    return jwt.encode(token_payload, settings.secret_key, algorithm=settings.algorithm)


def get_current_user(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(security),
) -> Dict[str, Any]:
    # Bypass authentication for this hackathon
    return {"id": 1, "name": "Admin User", "email": "admin@technova.com", "role": "admin", "department_id": 1}


def require_role(*roles: str):
    def dependency(user: Dict[str, Any] = Depends(get_current_user)) -> Dict[str, Any]:
        if user.get("role") not in roles:
            raise AppException(403, "You don't have permission for this action", "FORBIDDEN")
        return user

    return dependency
