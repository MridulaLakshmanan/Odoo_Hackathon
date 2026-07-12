from fastapi import APIRouter, Depends

from backend.core.auth import get_current_user, require_role
from backend.schemas.common import ApiResponse
from backend.schemas.transfers import TransferCreateRequest
from backend.services import transfer_service


router = APIRouter(prefix="/api/transfers", tags=["transfers"])


@router.post("", response_model=ApiResponse, dependencies=[Depends(require_role("admin", "asset_manager", "employee"))])
def create_transfer(payload: TransferCreateRequest, current_user=Depends(get_current_user)):
    return ApiResponse(
        message="Transfer created",
        data=transfer_service.create_transfer(
            payload.asset_id,
            payload.from_employee_id,
            payload.to_employee_id,
        ),
    )


@router.patch("/{transfer_id}/approve", response_model=ApiResponse, dependencies=[Depends(require_role("admin", "asset_manager"))])
def approve_transfer(transfer_id: int, current_user=Depends(get_current_user)):
    return ApiResponse(message="Transfer approved", data=transfer_service.approve_transfer(transfer_id, current_user["id"]))


@router.get("", response_model=ApiResponse, dependencies=[Depends(require_role("admin", "asset_manager"))])
def list_transfers():
    return ApiResponse(data=transfer_service.list_transfers())
