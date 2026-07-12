from backend.repositories.base import execute, fetch_all, fetch_one


def find_overlap(asset_id: int, start_time, end_time, cursor=None):
    return fetch_one(
        """
        SELECT id, asset_id, employee_id, start_time, end_time, status
        FROM bookings
        WHERE asset_id = %s
          AND status IN ('upcoming', 'ongoing')
          AND NOT (end_time <= %s OR start_time >= %s)
        ORDER BY start_time ASC
        LIMIT 1
        """,
        (asset_id, start_time, end_time),
        cursor=cursor,
    )


def create_booking(asset_id: int, employee_id: int, start_time, end_time, cursor=None):
    return fetch_one(
        """
        INSERT INTO bookings (asset_id, employee_id, start_time, end_time, status)
        VALUES (%s, %s, %s, %s, 'upcoming')
        RETURNING id, asset_id, employee_id, start_time, end_time, status
        """,
        (asset_id, employee_id, start_time, end_time),
        cursor=cursor,
    )


def list_bookings(cursor=None):
    return fetch_all(
        "SELECT id, asset_id, employee_id, start_time, end_time, status FROM bookings ORDER BY start_time DESC",
        cursor=cursor,
    )


def list_bookings_for_employee(employee_id: int, cursor=None):
    return fetch_all(
        "SELECT id, asset_id, employee_id, start_time, end_time, status FROM bookings WHERE employee_id = %s ORDER BY start_time DESC",
        (employee_id,),
        cursor=cursor,
    )


def list_bookings_for_resource(asset_id: int, cursor=None):
    return fetch_all(
        "SELECT id, asset_id, employee_id, start_time, end_time, status FROM bookings WHERE asset_id = %s ORDER BY start_time DESC",
        (asset_id,),
        cursor=cursor,
    )


def cancel_booking(booking_id: int, cursor=None):
    return fetch_one(
        "UPDATE bookings SET status = 'cancelled' WHERE id = %s RETURNING id, asset_id, employee_id, start_time, end_time, status",
        (booking_id,),
        cursor=cursor,
    )
