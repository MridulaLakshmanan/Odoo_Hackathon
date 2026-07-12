from typing import Optional

from pydantic import BaseModel, validator


class CategoryCreateRequest(BaseModel):
    name: str
    description: Optional[str] = None

    @validator("name")
    def name_not_empty(cls, value: str) -> str:
        if not value.strip():
            raise ValueError("Category name cannot be empty")
        return value.strip()


class CategoryUpdateRequest(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None


class CategoryResponse(BaseModel):
    id: int
    name: str
    description: Optional[str] = None

