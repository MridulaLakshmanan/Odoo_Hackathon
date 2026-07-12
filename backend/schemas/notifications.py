from datetime import datetime
from typing import Optional

from pydantic import BaseModel


class NotificationResponse(BaseModel):
    id: int
    employee_id: int
    type: str
    message: str
    read: bool
    timestamp: datetime

