from datetime import date, datetime
from typing import Optional

from pydantic import BaseModel, validator


class AllocationCreateRequest(BaseModel):
    asset_id: int
    employee_id: int
    department_id: Optional[int] = None
    expected_return_date: date

    @validator("expected_return_date")
    def return_date_must_be_future(cls, value: date) -> date:
        if value < date.today():
            raise ValueError("Expected return date cannot be in the past")
        return value


class AllocationReturnRequest(BaseModel):
    notes: Optional[str] = None


class AllocationResponse(BaseModel):
    id: int
    asset_id: int
    employee_id: int
    department_id: Optional[int] = None
    employee_name: Optional[str] = None
    asset_tag: Optional[str] = None
    expected_return_date: date
    status: Optional[str] = None
    allocated_at: Optional[datetime] = None
    returned_at: Optional[datetime] = None
    condition_notes: Optional[str] = None

