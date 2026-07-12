from typing import Optional
from pydantic import BaseModel

class LocationBase(BaseModel):
    name: str
    address: Optional[str] = None
    type: str = "Office"

class LocationCreate(LocationBase):
    pass

class LocationUpdate(BaseModel):
    name: Optional[str] = None
    address: Optional[str] = None
    type: Optional[str] = None

class LocationResponse(LocationBase):
    id: int

    class Config:
        orm_mode = True
