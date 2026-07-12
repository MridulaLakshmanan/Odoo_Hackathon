from typing import Optional

from pydantic import BaseModel, EmailStr, validator


class SignupRequest(BaseModel):
    name: str
    email: EmailStr
    password: str
    department_id: Optional[int] = None

    @validator("name")
    def name_not_empty(cls, value: str) -> str:
        if not value.strip():
            raise ValueError("Name cannot be empty")
        return value.strip()

    @validator("password")
    def password_length(cls, value: str) -> str:
        if len(value) < 8:
            raise ValueError("Password must be at least 8 characters long")
        return value


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class AuthUserResponse(BaseModel):
    id: int
    name: str
    email: EmailStr
    role: str
    department_id: Optional[int] = None


class AuthTokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: AuthUserResponse

