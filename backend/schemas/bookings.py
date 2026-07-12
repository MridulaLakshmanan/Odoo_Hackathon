from datetime import datetime
from typing import Optional

from pydantic import BaseModel, validator


class BookingCreateRequest(BaseModel):
    resource_asset_id: int
    employee_id: int
    start_time: datetime
    end_time: datetime

    @validator("end_time")
    def end_must_follow_start(cls, value: datetime, values):
        start = values.get("start_time")
        if start is not None and value <= start:
            raise ValueError("End time must be after start time")
        return value


class BookingResponse(BaseModel):
    id: int
    resource_asset_id: int
    employee_id: int
    start_time: datetime
    end_time: datetime
    status: Optional[str] = None

