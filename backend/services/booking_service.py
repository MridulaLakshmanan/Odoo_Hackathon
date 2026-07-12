from backend.core.exceptions import AppException
from backend.core.logger import logger
from backend.db import get_cursor
from backend.repositories import asset_repo, booking_repo, employee_repo
from backend.services import notification_service


def create_booking(resource_asset_id: int, employee_id: int, start_time, end_time):
    if end_time <= start_time:
        raise AppException(422, "End time must be after start time", "INVALID_TIME_RANGE")
    asset = asset_repo.get_asset_by_id(resource_asset_id)
    if not asset:
        raise AppException(404, "Asset not found", "ASSET_NOT_FOUND")
    if not asset.get("is_bookable"):
        raise AppException(409, "This asset is not bookable", "ASSET_NOT_BOOKABLE")
    employee = employee_repo.get_employee_by_id(employee_id)
    if not employee:
        raise AppException(404, "Employee not found", "EMPLOYEE_NOT_FOUND")

    conflict = booking_repo.find_overlap(resource_asset_id, start_time, end_time)
    if conflict:
        raise AppException(409, "This slot overlaps an existing booking", "BOOKING_OVERLAP")

    with get_cursor() as cursor:
        booking = booking_repo.create_booking(resource_asset_id, employee_id, start_time, end_time, cursor=cursor)
        notification_service.notify(
            employee_id,
            f"Booking confirmed for {asset['asset_tag']}",
            "booking",
            cursor=cursor,
        )

    logger.info("booking created resource_asset_id=%s employee_id=%s", resource_asset_id, employee_id)
    return booking


def list_bookings(employee_id=None, resource_asset_id=None):
    if resource_asset_id is not None:
        return booking_repo.list_bookings_for_resource(resource_asset_id)
    if employee_id:
        return booking_repo.list_bookings_for_employee(employee_id)
    return booking_repo.list_bookings()


def cancel_booking(booking_id: int):
    booking = booking_repo.cancel_booking(booking_id)
    if not booking:
        raise AppException(404, "Booking not found", "BOOKING_NOT_FOUND")
    return booking

