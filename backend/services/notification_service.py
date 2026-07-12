from backend.core.exceptions import AppException
from backend.core.logger import logger
from backend.repositories import notification_repo


def notify(employee_id: int, message: str, type: str, cursor=None):
    notification = notification_repo.create_notification(employee_id, message, type, cursor=cursor)
    logger.info("notification created employee_id=%s type=%s", employee_id, type)
    return notification


def mark_as_read(notification_id: int, employee_id: int):
    notification = notification_repo.mark_notification_read(notification_id, employee_id)
    if not notification:
        raise AppException(404, "Notification not found", "NOTIFICATION_NOT_FOUND")
    return notification

