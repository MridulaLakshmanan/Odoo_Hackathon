from typing import Optional

from backend.repositories.base import execute, fetch_all, fetch_one


def get_active_allocation_for_asset(asset_id: int, cursor=None):
    return fetch_one(
        """
     SELECT al.id, al.asset_id, al.employee_id, al.department_id, e.name AS employee_name,
         al.expected_return_date, al.status, al.allocated_at, al.returned_at, al.condition_notes
        FROM allocations al
        JOIN employees e ON e.id = al.employee_id
     WHERE al.asset_id = %s AND al.status = 'active'
     ORDER BY al.allocated_at DESC
        LIMIT 1
        """,
        (asset_id,),
        cursor=cursor,
    )


def get_allocation_by_id(allocation_id: int, cursor=None):
    return fetch_one(
        """
         SELECT al.id, al.asset_id, al.employee_id, al.department_id, e.name AS employee_name,
             a.asset_tag, al.expected_return_date, al.status, al.allocated_at, al.returned_at, al.condition_notes
        FROM allocations al
        JOIN employees e ON e.id = al.employee_id
        JOIN assets a ON a.id = al.asset_id
        WHERE al.id = %s
        """,
        (allocation_id,),
        cursor=cursor,
    )


def create_allocation(
    asset_id: int,
    employee_id: int,
    expected_return_date,
    department_id: Optional[int] = None,
    assigned_by_id: Optional[int] = None,
    cursor=None,
):
    return fetch_one(
        """
        INSERT INTO allocations (asset_id, employee_id, department_id, expected_return_date, status, allocated_at)
        VALUES (%s, %s, %s, %s, 'active', NOW())
        RETURNING id, asset_id, employee_id, department_id, expected_return_date, status, allocated_at, returned_at, condition_notes
        """,
        (asset_id, employee_id, department_id, expected_return_date),
        cursor=cursor,
    )


def return_allocation(allocation_id: int, notes: Optional[str] = None, cursor=None):
    return fetch_one(
        """
        UPDATE allocations
        SET status = 'returned',
            returned_at = NOW(),
            condition_notes = COALESCE(%s, condition_notes)
        WHERE id = %s
        RETURNING id, asset_id, employee_id, department_id, expected_return_date, status, allocated_at, returned_at, condition_notes
        """,
        (notes, allocation_id),
        cursor=cursor,
    )


def list_overdue_allocations(cursor=None):
    return fetch_all(
        """
         SELECT al.id, al.asset_id, al.employee_id, al.department_id, e.name AS employee_name,
             a.asset_tag, al.expected_return_date, al.status, al.allocated_at
        FROM allocations al
        JOIN employees e ON e.id = al.employee_id
        JOIN assets a ON a.id = al.asset_id
         WHERE al.status = 'active' AND al.expected_return_date < CURRENT_DATE
         ORDER BY al.expected_return_date ASC
        """,
        cursor=cursor,
    )


def list_active_allocations_for_employee(employee_id: int, cursor=None):
    return fetch_all(
        """
         SELECT al.id, al.asset_id, al.employee_id, al.department_id, e.name AS employee_name,
             a.asset_tag, al.expected_return_date, al.status, al.allocated_at, al.returned_at
        FROM allocations al
        JOIN employees e ON e.id = al.employee_id
        JOIN assets a ON a.id = al.asset_id
         WHERE al.employee_id = %s AND al.status = 'active'
         ORDER BY al.allocated_at DESC
        """,
        (employee_id,),
        cursor=cursor,
    )
