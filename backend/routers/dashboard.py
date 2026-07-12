from fastapi import APIRouter, Depends

from backend.core.auth import require_role
from backend.schemas.common import ApiResponse
from backend.services import dashboard_service


router = APIRouter(prefix="/api/dashboard", tags=["dashboard"])


@router.get("", response_model=ApiResponse, dependencies=[Depends(require_role("admin", "asset_manager", "employee"))])
def get_dashboard():
    return ApiResponse(data=dashboard_service.get_dashboard_summary())
