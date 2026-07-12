from typing import Optional

from backend.repositories.base import execute, fetch_all, fetch_one


def list_employees(cursor=None):
    return fetch_all(
        "SELECT id, name, email, role, status, department_id, created_at FROM employees ORDER BY id DESC",
        cursor=cursor,
    )


def get_employee_by_id(employee_id: int, cursor=None):
    return fetch_one(
        "SELECT id, name, email, role, status, department_id, created_at, password_hash FROM employees WHERE id = %s",
        (employee_id,),
        cursor=cursor,
    )


def get_employee_by_email(email: str, cursor=None):
    return fetch_one(
        "SELECT id, name, email, role, status, department_id, created_at, password_hash FROM employees WHERE LOWER(email) = LOWER(%s)",
        (email,),
        cursor=cursor,
    )


def create_employee(
    name: str,
    email: str,
    password_hash: str,
    department_id: Optional[int] = None,
    role: str = "employee",
    status: str = "active",
    cursor=None,
):
    return fetch_one(
        """
        INSERT INTO employees (name, email, password_hash, role, status, department_id)
        VALUES (%s, %s, %s, %s, %s, %s)
        RETURNING id, name, email, role, status, department_id, created_at
        """,
        (name, email, password_hash, role, status, department_id),
        cursor=cursor,
    )


def update_employee(
    employee_id: int,
    name: Optional[str] = None,
    email: Optional[str] = None,
    department_id: Optional[int] = None,
    password_hash: Optional[str] = None,
    role: Optional[str] = None,
    status: Optional[str] = None,
    cursor=None,
):
    return fetch_one(
        """
        UPDATE employees
        SET name = COALESCE(%s, name),
            email = COALESCE(%s, email),
            department_id = COALESCE(%s, department_id),
            password_hash = COALESCE(%s, password_hash),
            role = COALESCE(%s, role),
            status = COALESCE(%s, status)
        WHERE id = %s
        RETURNING id, name, email, role, status, department_id, created_at
        """,
        (name, email, department_id, password_hash, role, status, employee_id),
        cursor=cursor,
    )


def update_employee_role(employee_id: int, role: str, cursor=None):
    return fetch_one(
        "UPDATE employees SET role = %s WHERE id = %s RETURNING id, name, email, role, status, department_id, created_at",
        (role, employee_id),
        cursor=cursor,
    )


def delete_employee(employee_id: int, cursor=None):
    return execute("DELETE FROM employees WHERE id = %s", (employee_id,), cursor=cursor)
