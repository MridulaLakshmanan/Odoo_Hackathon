from typing import Optional

from backend.repositories.base import execute, fetch_all, fetch_one


def list_departments(cursor=None):
    return fetch_all(
        "SELECT id, name, head_employee_id, parent_dept_id, status FROM departments ORDER BY name",
        cursor=cursor,
    )


def get_department_by_id(department_id: int, cursor=None):
    return fetch_one(
        "SELECT id, name, head_employee_id, parent_dept_id, status FROM departments WHERE id = %s",
        (department_id,),
        cursor=cursor,
    )


def get_department_by_name(name: str, cursor=None):
    return fetch_one(
        "SELECT id, name, head_employee_id, parent_dept_id, status FROM departments WHERE LOWER(name) = LOWER(%s)",
        (name,),
        cursor=cursor,
    )


def create_department(name: str, head_employee_id: Optional[int] = None, parent_dept_id: Optional[int] = None, status: str = "active", cursor=None):
    return fetch_one(
        """
        INSERT INTO departments (name, head_employee_id, parent_dept_id, status)
        VALUES (%s, %s, %s, %s)
        RETURNING id, name, head_employee_id, parent_dept_id, status
        """,
        (name, head_employee_id, parent_dept_id, status),
        cursor=cursor,
    )


def update_department(
    department_id: int,
    name: Optional[str] = None,
    head_employee_id: Optional[int] = None,
    parent_dept_id: Optional[int] = None,
    status: Optional[str] = None,
    cursor=None,
):
    return fetch_one(
        """
        UPDATE departments
        SET name = COALESCE(%s, name),
            head_employee_id = COALESCE(%s, head_employee_id),
            parent_dept_id = COALESCE(%s, parent_dept_id),
            status = COALESCE(%s, status)
        WHERE id = %s
        RETURNING id, name, head_employee_id, parent_dept_id, status
        """,
        (name, head_employee_id, parent_dept_id, status, department_id),
        cursor=cursor,
    )


def delete_department(department_id: int, cursor=None):
    return execute("DELETE FROM departments WHERE id = %s", (department_id,), cursor=cursor)
