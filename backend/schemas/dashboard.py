from typing import List

from pydantic import Field
from pydantic import BaseModel

from backend.schemas.allocations import AllocationResponse


class DashboardResponse(BaseModel):
    total_assets: int
    available_assets: int
    allocated_assets: int
    under_maintenance_assets: int
    active_allocations: int
    overdue_allocations: int
    pending_maintenance: int
    upcoming_bookings: int
    overdue_returns: List[AllocationResponse] = Field(default_factory=list)

