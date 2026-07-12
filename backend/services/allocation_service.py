from backend.core.exceptions import AppException
from backend.core.logger import logger
from backend.db import get_cursor
from backend.repositories import allocation_repo, asset_repo, employee_repo
from backend.services import notification_service


def allocate_asset(asset_id: int, employee_id: int, expected_return_date, department_id=None, assigned_by_id=None):
    asset = asset_repo.get_asset_by_id(asset_id)
    if not asset:
        raise AppException(404, "Asset not found", "ASSET_NOT_FOUND")
    employee = employee_repo.get_employee_by_id(employee_id)
    if not employee:
        raise AppException(404, "Employee not found", "EMPLOYEE_NOT_FOUND")
    existing = allocation_repo.get_active_allocation_for_asset(asset_id)
    if existing:
        raise AppException(
            409,
            f"Currently held by {existing['employee_name']}",
            "ASSET_ALREADY_ALLOCATED",
        )
    if asset["status"] != "available":
        raise AppException(409, "Asset is not available for allocation", "ASSET_NOT_AVAILABLE")

    with get_cursor() as cursor:
        allocation_department_id = department_id or employee.get("department_id")
        allocation = allocation_repo.create_allocation(
            asset_id,
            employee_id,
            expected_return_date,
            department_id=allocation_department_id,
            assigned_by_id=assigned_by_id,
            cursor=cursor,
        )
        asset_repo.update_status(asset_id, "allocated", cursor=cursor)
        notification_service.notify(
            employee_id,
            "Asset assigned to you",
            "allocation",
            cursor=cursor,
        )

    logger.info("allocation created asset_id=%s employee_id=%s", asset_id, employee_id)
    return allocation


def return_asset(allocation_id: int, notes=None):
    allocation = allocation_repo.get_allocation_by_id(allocation_id)
    if not allocation:
        raise AppException(404, "Allocation not found", "ALLOCATION_NOT_FOUND")
    if allocation["returned_at"] is not None:
        raise AppException(409, "Asset has already been returned", "ALLOCATION_ALREADY_RETURNED")

    with get_cursor() as cursor:
        updated = allocation_repo.return_allocation(allocation_id, notes=notes, cursor=cursor)
        asset_repo.update_status(allocation["asset_id"], "available", cursor=cursor)
        notification_service.notify(
            allocation["employee_id"],
            "Your asset return has been recorded",
            "allocation_return",
            cursor=cursor,
        )

    logger.info("allocation returned allocation_id=%s", allocation_id)
    return updated


def list_overdue_allocations():
    return allocation_repo.list_overdue_allocations()


def list_allocations():
    return allocation_repo.list_allocations()

