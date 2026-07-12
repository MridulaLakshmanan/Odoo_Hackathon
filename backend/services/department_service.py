from backend.core.exceptions import AppException
from backend.repositories import department_repo


def list_departments():
    return department_repo.list_departments()


def get_department(department_id: int):
    department = department_repo.get_department_by_id(department_id)
    if not department:
        raise AppException(404, "Department not found", "DEPARTMENT_NOT_FOUND")
    return department


def create_department(name: str):
    if department_repo.get_department_by_name(name):
        raise AppException(409, "Department already exists", "DEPARTMENT_EXISTS")
    return department_repo.create_department(name)


def update_department(department_id: int, name):
    if name and department_repo.get_department_by_name(name):
        raise AppException(409, "Department already exists", "DEPARTMENT_EXISTS")
    department = department_repo.update_department(department_id, name)
    if not department:
        raise AppException(404, "Department not found", "DEPARTMENT_NOT_FOUND")
    return department


def delete_department(department_id: int):
    deleted = department_repo.delete_department(department_id)
    if not deleted:
        raise AppException(404, "Department not found", "DEPARTMENT_NOT_FOUND")

