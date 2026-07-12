from typing import Optional

from pydantic import BaseModel, EmailStr, validator


class EmployeeCreateRequest(BaseModel):
    name: str
    email: EmailStr
    password: str
    department_id: Optional[int] = None

    @validator("name")
    def name_not_empty(cls, value: str) -> str:
        if not value.strip():
            raise ValueError("Employee name cannot be empty")
        return value.strip()

    @validator("password")
    def password_length(cls, value: str) -> str:
        if len(value) < 8:
            raise ValueError("Password must be at least 8 characters long")
        return value


class EmployeeUpdateRequest(BaseModel):
    name: Optional[str] = None
    email: Optional[EmailStr] = None
    department_id: Optional[int] = None
    password: Optional[str] = None


class EmployeeRoleUpdateRequest(BaseModel):
    role: str


class EmployeeResponse(BaseModel):
    id: int
    name: str
    email: EmailStr
    role: str
    department_id: Optional[int] = None

