from backend.core.auth import hash_password
from backend.core.exceptions import AppException
from backend.repositories import employee_repo


def _public_employee(employee):
    return {
        "id": employee["id"],
        "name": employee["name"],
        "email": employee["email"],
        "role": employee["role"],
        "department_id": employee["department_id"],
    }


def list_employees():
    return employee_repo.list_employees()


def get_employee(employee_id: int):
    employee = employee_repo.get_employee_by_id(employee_id)
    if not employee:
        raise AppException(404, "Employee not found", "EMPLOYEE_NOT_FOUND")
    return _public_employee(employee)


def create_employee(name: str, email: str, password: str, department_id=None):
    if employee_repo.get_employee_by_email(email):
        raise AppException(409, "An account with this email already exists", "EMAIL_EXISTS")
    password_hash = hash_password(password)
    return employee_repo.create_employee(name, email.lower(), password_hash, department_id)


def update_employee(employee_id: int, name=None, email=None, department_id=None, password=None):
    current = employee_repo.get_employee_by_id(employee_id)
    if not current:
        raise AppException(404, "Employee not found", "EMPLOYEE_NOT_FOUND")
    if email:
        existing = employee_repo.get_employee_by_email(email)
        if existing and existing["id"] != employee_id:
            raise AppException(409, "An account with this email already exists", "EMAIL_EXISTS")
    password_hash = hash_password(password) if password else None
    updated = employee_repo.update_employee(
        employee_id,
        name=name,
        email=email.lower() if email else None,
        department_id=department_id,
        password_hash=password_hash,
    )
    return _public_employee(updated) if updated else updated


def update_role(employee_id: int, role: str):
    if role not in {"admin", "asset_manager", "dept_head", "employee"}:
        raise AppException(422, "Invalid role", "INVALID_ROLE")
    employee = employee_repo.update_employee_role(employee_id, role)
    if not employee:
        raise AppException(404, "Employee not found", "EMPLOYEE_NOT_FOUND")
    return _public_employee(employee)


def delete_employee(employee_id: int):
    deleted = employee_repo.delete_employee(employee_id)
    if not deleted:
        raise AppException(404, "Employee not found", "EMPLOYEE_NOT_FOUND")

