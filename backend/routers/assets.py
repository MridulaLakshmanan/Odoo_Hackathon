from typing import Optional

from fastapi import APIRouter, Depends, Query

from backend.core.auth import require_role
from backend.schemas.assets import AssetCreateRequest, AssetUpdateRequest
from backend.schemas.common import ApiResponse
from backend.services import asset_service


router = APIRouter(prefix="/api/assets", tags=["assets"])


@router.get("", response_model=ApiResponse)
def list_assets(
    status: Optional[str] = Query(default=None),
    category_id: Optional[int] = Query(default=None),
    department_id: Optional[int] = Query(default=None),
    location: Optional[str] = Query(default=None),
    _user=Depends(require_role("admin", "asset_manager", "employee")),
):
    return ApiResponse(
        data=asset_service.list_assets(
            {
                "status": status,
                "category_id": category_id,
                "department_id": department_id,
                "location": location,
            }
        )
    )


@router.get("/{asset_id}", response_model=ApiResponse, dependencies=[Depends(require_role("admin", "asset_manager", "employee"))])
def get_asset(asset_id: int):
    return ApiResponse(data=asset_service.get_asset(asset_id))


@router.post("", response_model=ApiResponse, dependencies=[Depends(require_role("admin", "asset_manager"))])
def create_asset(payload: AssetCreateRequest):
    return ApiResponse(message="Asset created", data=asset_service.create_asset(**payload.dict()))


@router.patch("/{asset_id}", response_model=ApiResponse, dependencies=[Depends(require_role("admin", "asset_manager"))])
def update_asset(asset_id: int, payload: AssetUpdateRequest):
    return ApiResponse(message="Asset updated", data=asset_service.update_asset(asset_id, **payload.dict(exclude_none=True)))


@router.delete("/{asset_id}", response_model=ApiResponse, dependencies=[Depends(require_role("admin", "asset_manager"))])
def delete_asset(asset_id: int):
    asset_service.delete_asset(asset_id)
    return ApiResponse(message="Asset deleted")
