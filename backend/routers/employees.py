from fastapi import APIRouter, Depends

from backend.core.auth import require_role
from backend.schemas.common import ApiResponse
from backend.schemas.employees import EmployeeCreateRequest, EmployeeRoleUpdateRequest, EmployeeUpdateRequest
from backend.schemas.auth import AuthUserResponse
from backend.services import employee_service


router = APIRouter(prefix="/api/employees", tags=["employees"])


@router.get("", response_model=ApiResponse, dependencies=[Depends(require_role("admin"))])
def list_employees():
    return ApiResponse(data=employee_service.list_employees())


@router.get("/{employee_id}", response_model=ApiResponse, dependencies=[Depends(require_role("admin"))])
def get_employee(employee_id: int):
    employee = employee_service.get_employee(employee_id)
    public_user = AuthUserResponse(**employee)
    return ApiResponse(data=public_user.dict())


@router.post("", response_model=ApiResponse, dependencies=[Depends(require_role("admin"))])
def create_employee(payload: EmployeeCreateRequest):
    employee = employee_service.create_employee(
        payload.name,
        payload.email,
        payload.password,
        payload.department_id,
    )
    return ApiResponse(message="Employee created", data=employee)


@router.patch("/{employee_id}", response_model=ApiResponse, dependencies=[Depends(require_role("admin"))])
def update_employee(employee_id: int, payload: EmployeeUpdateRequest):
    employee = employee_service.update_employee(
        employee_id,
        name=payload.name,
        email=payload.email,
        department_id=payload.department_id,
        password=payload.password,
    )
    return ApiResponse(message="Employee updated", data=employee)


@router.patch("/{employee_id}/role", response_model=ApiResponse, dependencies=[Depends(require_role("admin"))])
def update_employee_role(employee_id: int, payload: EmployeeRoleUpdateRequest):
    return ApiResponse(message="Employee role updated", data=employee_service.update_role(employee_id, payload.role))


@router.delete("/{employee_id}", response_model=ApiResponse, dependencies=[Depends(require_role("admin"))])
def delete_employee(employee_id: int):
    employee_service.delete_employee(employee_id)
    return ApiResponse(message="Employee deleted")
