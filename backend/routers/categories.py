from fastapi import APIRouter, Depends

from backend.core.auth import require_role
from backend.schemas.categories import CategoryCreateRequest, CategoryUpdateRequest
from backend.schemas.common import ApiResponse
from backend.services import category_service


router = APIRouter(prefix="/api/categories", tags=["categories"])


@router.get("", response_model=ApiResponse, dependencies=[Depends(require_role("admin"))])
def list_categories():
    return ApiResponse(data=category_service.list_categories())


@router.get("/{category_id}", response_model=ApiResponse, dependencies=[Depends(require_role("admin"))])
def get_category(category_id: int):
    return ApiResponse(data=category_service.get_category(category_id))


@router.post("", response_model=ApiResponse, dependencies=[Depends(require_role("admin"))])
def create_category(payload: CategoryCreateRequest):
    return ApiResponse(message="Category created", data=category_service.create_category(payload.name, payload.description))


@router.patch("/{category_id}", response_model=ApiResponse, dependencies=[Depends(require_role("admin"))])
def update_category(category_id: int, payload: CategoryUpdateRequest):
    return ApiResponse(message="Category updated", data=category_service.update_category(category_id, payload.name, payload.description))


@router.delete("/{category_id}", response_model=ApiResponse, dependencies=[Depends(require_role("admin"))])
def delete_category(category_id: int):
    category_service.delete_category(category_id)
    return ApiResponse(message="Category deleted")
