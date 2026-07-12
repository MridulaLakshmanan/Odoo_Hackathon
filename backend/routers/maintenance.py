from fastapi import APIRouter, Depends

from backend.core.auth import get_current_user, require_role
from backend.schemas.common import ApiResponse
from backend.schemas.maintenance import MaintenanceActionRequest, MaintenanceCreateRequest
from backend.services import maintenance_service


router = APIRouter(prefix="/api/maintenance", tags=["maintenance"])


@router.post("", response_model=ApiResponse)
def create_maintenance(payload: MaintenanceCreateRequest, current_user=Depends(get_current_user)):
    return ApiResponse(
        message="Maintenance request created",
        data=maintenance_service.create_maintenance_request(
            payload.asset_id,
            current_user["id"],
            payload.issue,
            payload.priority,
        ),
    )


@router.patch("/{maintenance_id}/approve", response_model=ApiResponse, dependencies=[Depends(require_role("asset_manager"))])
def approve_maintenance(maintenance_id: int, current_user=Depends(get_current_user)):
    return ApiResponse(message="Maintenance approved", data=maintenance_service.approve_maintenance_request(maintenance_id, current_user["id"]))


@router.patch("/{maintenance_id}/reject", response_model=ApiResponse, dependencies=[Depends(require_role("asset_manager"))])
def reject_maintenance(maintenance_id: int, current_user=Depends(get_current_user)):
    return ApiResponse(message="Maintenance rejected", data=maintenance_service.reject_maintenance_request(maintenance_id, current_user["id"]))


@router.patch("/{maintenance_id}/resolve", response_model=ApiResponse, dependencies=[Depends(require_role("asset_manager"))])
def resolve_maintenance(maintenance_id: int, current_user=Depends(get_current_user)):
    return ApiResponse(message="Maintenance resolved", data=maintenance_service.resolve_maintenance_request(maintenance_id, current_user["id"]))


@router.get("", response_model=ApiResponse)
def list_maintenance():
    return ApiResponse(data=maintenance_service.list_maintenance_requests())
