from backend.repositories.base import execute, fetch_all, fetch_one


def create_request(asset_id: int, raised_by: int, issue: str, priority: str, cursor=None):
    return fetch_one(
        """
        INSERT INTO maintenance_requests (asset_id, raised_by, issue, priority, status)
        VALUES (%s, %s, %s, %s, 'pending')
        RETURNING id, asset_id, raised_by, issue, priority, status
        """,
        (asset_id, raised_by, issue, priority),
        cursor=cursor,
    )


def get_request_by_id(maintenance_id: int, cursor=None):
    return fetch_one(
        """
        SELECT id, asset_id, raised_by, approved_by, issue, priority, status, created_at, resolved_at
        FROM maintenance_requests
        WHERE id = %s
        """,
        (maintenance_id,),
        cursor=cursor,
    )


def approve_request(maintenance_id: int, approved_by_id: int, cursor=None):
    return fetch_one(
        """
        UPDATE maintenance_requests
        SET status = 'approved',
            approved_by = %s
        WHERE id = %s
        RETURNING id, asset_id, raised_by, issue, priority, status
        """,
        (approved_by_id, maintenance_id),
        cursor=cursor,
    )


def reject_request(maintenance_id: int, rejected_by_id: int, cursor=None):
    return fetch_one(
        """
        UPDATE maintenance_requests
        SET status = 'rejected',
            approved_by = COALESCE(approved_by, %s)
        WHERE id = %s
        RETURNING id, asset_id, raised_by, issue, priority, status
        """,
        (rejected_by_id, maintenance_id),
        cursor=cursor,
    )


def resolve_request(maintenance_id: int, resolved_by_id: int, cursor=None):
    return fetch_one(
        """
        UPDATE maintenance_requests
        SET status = 'resolved',
            approved_by = COALESCE(approved_by, %s),
            resolved_at = NOW()
        WHERE id = %s
        RETURNING id, asset_id, raised_by, issue, priority, status
        """,
        (resolved_by_id, maintenance_id),
        cursor=cursor,
    )


def list_requests(cursor=None):
    return fetch_all(
        "SELECT id, asset_id, raised_by, issue, priority, status, created_at FROM maintenance_requests ORDER BY id DESC",
        cursor=cursor,
    )


def list_pending_requests(cursor=None):
    return fetch_all(
        "SELECT id, asset_id, raised_by, issue, priority, status, created_at FROM maintenance_requests WHERE status = 'pending' ORDER BY id DESC",
        cursor=cursor,
    )
