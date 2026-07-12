from backend.repositories.base import execute, fetch_all, fetch_one


def create_transfer(
    asset_id: int,
    from_employee_id: int,
    to_employee_id: int,
    cursor=None,
):
    return fetch_one(
        """
        INSERT INTO transfer_requests (asset_id, from_employee_id, to_employee_id)
        VALUES (%s, %s, %s)
        RETURNING id, asset_id, from_employee_id, to_employee_id, status
        """,
        (asset_id, from_employee_id, to_employee_id),
        cursor=cursor,
    )


def get_transfer_by_id(transfer_id: int, cursor=None):
    return fetch_one(
        """
        SELECT id, asset_id, from_employee_id, to_employee_id,
               status, requested_at, approved_at
        FROM transfer_requests
        WHERE id = %s
        """,
        (transfer_id,),
        cursor=cursor,
    )


def approve_transfer(transfer_id: int, approved_by_id: int, cursor=None):
    return fetch_one(
        """
        UPDATE transfer_requests
        SET status = 'approved',
            approved_at = NOW()
        WHERE id = %s
        RETURNING id, asset_id, from_employee_id, to_employee_id, status
        """,
        (transfer_id,),
        cursor=cursor,
    )


def reject_transfer(transfer_id: int, approved_by_id: int, cursor=None):
    return fetch_one(
        """
        UPDATE transfer_requests
        SET status = 'rejected',
            approved_at = NOW()
        WHERE id = %s
        RETURNING id, asset_id, from_employee_id, to_employee_id, status
        """,
        (transfer_id,),
        cursor=cursor,
    )


def list_transfers(cursor=None):
    return fetch_all(
        "SELECT id, asset_id, from_employee_id, to_employee_id, status, requested_at, approved_at FROM transfer_requests ORDER BY id DESC",
        cursor=cursor,
    )
