from pydantic import BaseModel


class TransferCreateRequest(BaseModel):
    asset_id: int
    from_employee_id: int
    to_employee_id: int


class TransferResponse(BaseModel):
    id: int
    asset_id: int
    from_employee_id: int
    to_employee_id: int
    status: str

