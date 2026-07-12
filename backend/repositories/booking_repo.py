from backend.repositories.base import execute, fetch_all, fetch_one


def find_overlap(resource_asset_id: int, start_time, end_time, cursor=None):
    return fetch_one(
        """
        SELECT id, resource_asset_id, employee_id, start_time, end_time, status
        FROM bookings
        WHERE resource_asset_id = %s
          AND status IN ('upcoming', 'ongoing')
          AND NOT (end_time <= %s OR start_time >= %s)
        ORDER BY start_time ASC
        LIMIT 1
        """,
        (resource_asset_id, start_time, end_time),
        cursor=cursor,
    )


def create_booking(resource_asset_id: int, employee_id: int, start_time, end_time, cursor=None):
    return fetch_one(
        """
        INSERT INTO bookings (resource_asset_id, employee_id, start_time, end_time, status)
        VALUES (%s, %s, %s, %s, 'upcoming')
        RETURNING id, resource_asset_id, employee_id, start_time, end_time, status
        """,
        (resource_asset_id, employee_id, start_time, end_time),
        cursor=cursor,
    )


def list_bookings(cursor=None):
    return fetch_all(
        "SELECT id, resource_asset_id, employee_id, start_time, end_time, status FROM bookings ORDER BY start_time DESC",
        cursor=cursor,
    )


def list_bookings_for_employee(employee_id: int, cursor=None):
    return fetch_all(
        "SELECT id, resource_asset_id, employee_id, start_time, end_time, status FROM bookings WHERE employee_id = %s ORDER BY start_time DESC",
        (employee_id,),
        cursor=cursor,
    )


def list_bookings_for_resource(resource_asset_id: int, cursor=None):
    return fetch_all(
        "SELECT id, resource_asset_id, employee_id, start_time, end_time, status FROM bookings WHERE resource_asset_id = %s ORDER BY start_time DESC",
        (resource_asset_id,),
        cursor=cursor,
    )


def cancel_booking(booking_id: int, cursor=None):
    return fetch_one(
        "UPDATE bookings SET status = 'cancelled' WHERE id = %s RETURNING id, resource_asset_id, employee_id, start_time, end_time, status",
        (booking_id,),
        cursor=cursor,
    )
