from typing import Optional

from pydantic import BaseModel, validator


class DepartmentCreateRequest(BaseModel):
    name: str

    @validator("name")
    def name_not_empty(cls, value: str) -> str:
        if not value.strip():
            raise ValueError("Department name cannot be empty")
        return value.strip()


class DepartmentUpdateRequest(BaseModel):
    name: Optional[str] = None


class DepartmentResponse(BaseModel):
    id: int
    name: str

