from typing import Any, Dict, List, Optional, Sequence

from backend.repositories.base import execute, fetch_all, fetch_one


def generate_asset_tag(cursor=None) -> str:
    row = fetch_one(
        "SELECT COALESCE(MAX(CAST(SUBSTRING(asset_tag FROM 4) AS INTEGER)), 0) AS max_value FROM assets WHERE asset_tag ~ '^AF-[0-9]+$'",
        cursor=cursor,
    )
    next_number = int(row["max_value"]) + 1 if row else 1
    return f"AF-{next_number:04d}"


def create_asset(
    asset_tag: str,
    name: str,
    category_id: int,
    department_id: Optional[int],
    location_id: Optional[int],
    serial_number: Optional[str],
    description: Optional[str],
    is_bookable: bool = False,
    status: str = "available",
    cursor=None,
):
    return fetch_one(
        """
        INSERT INTO assets (
            asset_tag, name, category_id, department_id, location_id, serial_number, description, is_bookable, status
        )
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
        RETURNING id, asset_tag, name, category_id, department_id, location_id, serial_number, description, is_bookable, status
        """,
        (asset_tag, name, category_id, department_id, location_id, serial_number, description, is_bookable, status),
        cursor=cursor,
    )


def list_assets(filters: Optional[Dict[str, Any]] = None, cursor=None):
    filters = filters or {}
    clauses: List[str] = []
    params: List[Any] = []

    if filters.get("status"):
        clauses.append("a.status = %s")
        params.append(filters["status"])
    if filters.get("category_id"):
        clauses.append("a.category_id = %s")
        params.append(filters["category_id"])
    if filters.get("department_id"):
        clauses.append("a.department_id = %s")
        params.append(filters["department_id"])
    if filters.get("location_id"):
        clauses.append("a.location_id = %s")
        params.append(filters["location_id"])
    if filters.get("is_bookable") is not None:
        clauses.append("a.is_bookable = %s")
        params.append(filters["is_bookable"])

    where_sql = f"WHERE {' AND '.join(clauses)}" if clauses else ""
    query = f"""
        SELECT a.id, a.asset_tag, a.name, a.category_id, a.department_id, a.location_id,
               a.serial_number, a.description, a.is_bookable, a.status,
               c.name AS category_name, d.name AS department_name
        FROM assets a
        JOIN asset_categories c ON c.id = a.category_id
        LEFT JOIN departments d ON d.id = a.department_id
        {where_sql}
        ORDER BY a.id DESC
    """
    return fetch_all(query, tuple(params), cursor=cursor)


def get_asset_by_id(asset_id: int, cursor=None):
    return fetch_one(
        """
     SELECT a.id, a.asset_tag, a.name, a.category_id, a.department_id, a.location_id,
         a.serial_number, a.description, a.is_bookable, a.status,
         c.name AS category_name, d.name AS department_name
        FROM assets a
     JOIN asset_categories c ON c.id = a.category_id
        LEFT JOIN departments d ON d.id = a.department_id
        WHERE a.id = %s
        """,
        (asset_id,),
        cursor=cursor,
    )


def get_asset_allocations(asset_id: int, cursor=None):
    return fetch_all(
        """
        SELECT al.id, al.asset_id, al.employee_id, e.name AS employee_name,
               al.department_id, al.expected_return_date, al.status, al.allocated_at, al.returned_at, al.condition_notes
        FROM allocations al
        JOIN employees e ON e.id = al.employee_id
        WHERE al.asset_id = %s
        ORDER BY al.allocated_at DESC
        """,
        (asset_id,),
        cursor=cursor,
    )


def get_asset_maintenance(asset_id: int, cursor=None):
    return fetch_all(
        """
        SELECT mr.id, mr.asset_id, mr.raised_by, mr.issue, mr.priority,
             mr.status, mr.created_at, mr.approved_at, mr.resolved_at
        FROM maintenance_requests mr
        WHERE mr.asset_id = %s
        ORDER BY mr.id DESC
        """,
        (asset_id,),
        cursor=cursor,
    )


def update_asset(
    asset_id: int,
    name: Optional[str] = None,
    category_id: Optional[int] = None,
    department_id: Optional[int] = None,
    location_id: Optional[int] = None,
    serial_number: Optional[str] = None,
    description: Optional[str] = None,
    is_bookable: Optional[bool] = None,
    status: Optional[str] = None,
    cursor=None,
):
    return fetch_one(
        """
        UPDATE assets
        SET name = COALESCE(%s, name),
            category_id = COALESCE(%s, category_id),
            department_id = COALESCE(%s, department_id),
            location_id = COALESCE(%s, location_id),
            serial_number = COALESCE(%s, serial_number),
            description = COALESCE(%s, description),
            is_bookable = COALESCE(%s, is_bookable),
            status = COALESCE(%s, status)
        WHERE id = %s
        RETURNING id, asset_tag, name, category_id, department_id, location_id, serial_number, description, is_bookable, status
        """,
        (name, category_id, department_id, location_id, serial_number, description, is_bookable, status, asset_id),
        cursor=cursor,
    )


def update_status(asset_id: int, status: str, cursor=None):
    return fetch_one(
        "UPDATE assets SET status = %s WHERE id = %s RETURNING id, asset_tag, name, category_id, department_id, location_id, serial_number, description, is_bookable, status",
        (status, asset_id),
        cursor=cursor,
    )


def delete_asset(asset_id: int, cursor=None):
    return execute("DELETE FROM assets WHERE id = %s", (asset_id,), cursor=cursor)
