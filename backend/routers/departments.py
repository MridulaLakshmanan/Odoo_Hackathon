from fastapi import APIRouter, Depends

from backend.core.auth import require_role
from backend.schemas.common import ApiResponse
from backend.schemas.departments import DepartmentCreateRequest, DepartmentUpdateRequest
from backend.services import department_service


router = APIRouter(prefix="/api/departments", tags=["departments"])


@router.get("", response_model=ApiResponse, dependencies=[Depends(require_role("admin"))])
def list_departments():
    return ApiResponse(data=department_service.list_departments())


@router.get("/{department_id}", response_model=ApiResponse, dependencies=[Depends(require_role("admin"))])
def get_department(department_id: int):
    return ApiResponse(data=department_service.get_department(department_id))


@router.post("", response_model=ApiResponse, dependencies=[Depends(require_role("admin"))])
def create_department(payload: DepartmentCreateRequest):
    return ApiResponse(message="Department created", data=department_service.create_department(payload.name))


@router.patch("/{department_id}", response_model=ApiResponse, dependencies=[Depends(require_role("admin"))])
def update_department(department_id: int, payload: DepartmentUpdateRequest):
    return ApiResponse(message="Department updated", data=department_service.update_department(department_id, payload.name))


@router.delete("/{department_id}", response_model=ApiResponse, dependencies=[Depends(require_role("admin"))])
def delete_department(department_id: int):
    department_service.delete_department(department_id)
    return ApiResponse(message="Department deleted")
