from typing import Optional

from pydantic import BaseModel, validator


class AssetCreateRequest(BaseModel):
    name: str
    category_id: int
    department_id: Optional[int] = None
    location: Optional[str] = None
    serial_number: Optional[str] = None
    description: Optional[str] = None
    is_bookable: Optional[bool] = False

    @validator("name")
    def name_not_empty(cls, value: str) -> str:
        if not value.strip():
            raise ValueError("Asset name cannot be empty")
        return value.strip()


class AssetUpdateRequest(BaseModel):
    name: Optional[str] = None
    category_id: Optional[int] = None
    department_id: Optional[int] = None
    location: Optional[str] = None
    serial_number: Optional[str] = None
    description: Optional[str] = None
    is_bookable: Optional[bool] = None
    status: Optional[str] = None


class AssetResponse(BaseModel):
    id: int
    asset_tag: str
    name: str
    category_id: int
    department_id: Optional[int] = None
    location: Optional[str] = None
    serial_number: Optional[str] = None
    description: Optional[str] = None
    is_bookable: bool = False
    status: str

