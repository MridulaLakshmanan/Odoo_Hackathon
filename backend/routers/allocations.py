from fastapi import APIRouter, Depends

from backend.core.auth import get_current_user, require_role
from backend.core.exceptions import AppException
from backend.schemas.allocations import AllocationCreateRequest, AllocationReturnRequest
from backend.schemas.common import ApiResponse
from backend.services import allocation_service


router = APIRouter(prefix="/api/allocations", tags=["allocations"])


@router.post("", response_model=ApiResponse, dependencies=[Depends(require_role("admin", "asset_manager"))])
def create_allocation(payload: AllocationCreateRequest, current_user=Depends(get_current_user)):
    return ApiResponse(
        message="Asset allocated",
        data=allocation_service.allocate_asset(
            payload.asset_id,
            payload.employee_id,
            payload.expected_return_date,
            assigned_by_id=current_user["id"],
        ),
    )


@router.post("/{allocation_id}/return", response_model=ApiResponse)
def return_allocation(allocation_id: int, payload: AllocationReturnRequest, current_user=Depends(get_current_user)):
    return ApiResponse(message="Asset returned", data=allocation_service.return_asset(allocation_id, payload.notes))


@router.get("/overdue", response_model=ApiResponse, dependencies=[Depends(require_role("admin", "asset_manager"))])
def overdue_allocations():
    return ApiResponse(data=allocation_service.list_overdue_allocations())


@router.get("", response_model=ApiResponse)
def list_allocations():
    return ApiResponse(data=allocation_service.list_allocations())
