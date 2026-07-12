from backend.core.exceptions import AppException
from backend.core.logger import logger
from backend.db import get_cursor
from backend.repositories import asset_repo, employee_repo, maintenance_repo
from backend.services import notification_service


def create_maintenance_request(asset_id: int, raised_by: int, issue: str, priority: str = "medium"):
    asset = asset_repo.get_asset_by_id(asset_id)
    if not asset:
        raise AppException(404, "Asset not found", "ASSET_NOT_FOUND")
    requester = employee_repo.get_employee_by_id(raised_by)
    if not requester:
        raise AppException(404, "Employee not found", "EMPLOYEE_NOT_FOUND")

    with get_cursor() as cursor:
        request = maintenance_repo.create_request(asset_id, raised_by, issue, priority, cursor=cursor)
        notification_service.notify(
            raised_by,
            "Your maintenance request has been logged",
            "maintenance",
            cursor=cursor,
        )

    logger.info("maintenance request created asset_id=%s", asset_id)
    return request


def approve_maintenance_request(maintenance_id: int, approved_by_id: int):
    request = maintenance_repo.get_request_by_id(maintenance_id)
    if not request:
        raise AppException(404, "Maintenance request not found", "MAINTENANCE_NOT_FOUND")
    if request["status"] != "pending":
        raise AppException(409, "Maintenance request is not pending", "INVALID_MAINTENANCE_STATE")

    with get_cursor() as cursor:
        approved = maintenance_repo.approve_request(maintenance_id, approved_by_id, cursor=cursor)
        asset_repo.update_status(request["asset_id"], "under_maintenance", cursor=cursor)
        notification_service.notify(
            request["raised_by"],
            "Your maintenance request has been approved",
            "maintenance",
            cursor=cursor,
        )

    logger.info("maintenance approved maintenance_id=%s", maintenance_id)
    return approved


def resolve_maintenance_request(maintenance_id: int, resolved_by_id: int):
    request = maintenance_repo.get_request_by_id(maintenance_id)
    if not request:
        raise AppException(404, "Maintenance request not found", "MAINTENANCE_NOT_FOUND")
    if request["status"] not in {"approved", "pending"}:
        raise AppException(409, "Maintenance request cannot be resolved", "INVALID_MAINTENANCE_STATE")

    with get_cursor() as cursor:
        resolved = maintenance_repo.resolve_request(maintenance_id, resolved_by_id, cursor=cursor)
        asset_repo.update_status(request["asset_id"], "available", cursor=cursor)
        notification_service.notify(
            request["raised_by"],
            "Your maintenance request has been resolved",
            "maintenance",
            cursor=cursor,
        )

    logger.info("maintenance resolved maintenance_id=%s", maintenance_id)
    return resolved


def list_maintenance_requests():
    return maintenance_repo.list_requests()


def reject_maintenance_request(maintenance_id: int, rejected_by_id: int):
    request = maintenance_repo.get_request_by_id(maintenance_id)
    if not request:
        raise AppException(404, "Maintenance request not found", "MAINTENANCE_NOT_FOUND")
    if request["status"] != "pending":
        raise AppException(409, "Maintenance request is not pending", "INVALID_MAINTENANCE_STATE")

    with get_cursor() as cursor:
        rejected = maintenance_repo.reject_request(maintenance_id, rejected_by_id, cursor=cursor)
        notification_service.notify(
            request["raised_by"],
            "Your maintenance request has been rejected",
            "maintenance",
            cursor=cursor,
        )

    logger.info("maintenance rejected maintenance_id=%s", maintenance_id)
    return rejected

