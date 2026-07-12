from typing import Optional
from pydantic import BaseModel

class SettingsBase(BaseModel):
    org_name: str
    timezone: str
    currency: str
    notif_email: bool
    notif_browser: bool
    notif_warranty: bool
    notif_overdue: bool
    notif_maintenance: bool
    two_fa: bool
    session_timeout: str

class SettingsUpdate(BaseModel):
    org_name: Optional[str] = None
    timezone: Optional[str] = None
    currency: Optional[str] = None
    notif_email: Optional[bool] = None
    notif_browser: Optional[bool] = None
    notif_warranty: Optional[bool] = None
    notif_overdue: Optional[bool] = None
    notif_maintenance: Optional[bool] = None
    two_fa: Optional[bool] = None
    session_timeout: Optional[str] = None

class SettingsResponse(SettingsBase):
    id: int

    class Config:
        orm_mode = True
