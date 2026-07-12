from backend.repositories.base import execute, fetch_all, fetch_one


def create_notification(employee_id: int, message: str, type: str, cursor=None):
    return fetch_one(
        """
        INSERT INTO notifications (employee_id, message, type, is_read)
        VALUES (%s, %s, %s, false)
        RETURNING id, employee_id, type, message, is_read, created_at
        """,
        (employee_id, message, type),
        cursor=cursor,
    )


def list_notifications(employee_id: int, cursor=None):
    return fetch_all(
        "SELECT id, employee_id, type, message, is_read, created_at FROM notifications WHERE employee_id = %s ORDER BY id DESC",
        (employee_id,),
        cursor=cursor,
    )


def mark_notification_read(notification_id: int, employee_id: int, cursor=None):
    return fetch_one(
        "UPDATE notifications SET is_read = true WHERE id = %s AND employee_id = %s RETURNING id, employee_id, type, message, is_read, created_at",
        (notification_id, employee_id),
        cursor=cursor,
    )
