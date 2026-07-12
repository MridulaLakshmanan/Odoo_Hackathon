from typing import Optional

from pydantic import BaseModel, validator


class MaintenanceCreateRequest(BaseModel):
    asset_id: int
    issue: str
    priority: Optional[str] = "medium"

    @validator("issue")
    def issue_not_empty(cls, value: str) -> str:
        if not value.strip():
            raise ValueError("Maintenance issue cannot be empty")
        return value.strip()


class MaintenanceActionRequest(BaseModel):
    notes: Optional[str] = None


class MaintenanceResponse(BaseModel):
    id: int
    asset_id: int
    raised_by: int
    issue: str
    status: str
    priority: Optional[str] = None

