from backend.core.exceptions import AppException
from backend.core.logger import logger
from backend.db import get_cursor
from backend.repositories import allocation_repo, asset_repo, employee_repo, transfer_repo
from backend.services import notification_service


def create_transfer(asset_id: int, from_employee_id: int, to_employee_id: int):
    asset = asset_repo.get_asset_by_id(asset_id)
    if not asset:
        raise AppException(404, "Asset not found", "ASSET_NOT_FOUND")
    from_employee = employee_repo.get_employee_by_id(from_employee_id)
    to_employee = employee_repo.get_employee_by_id(to_employee_id)
    if not from_employee or not to_employee:
        raise AppException(404, "Employee not found", "EMPLOYEE_NOT_FOUND")

    return transfer_repo.create_transfer(asset_id, from_employee_id, to_employee_id)


def approve_transfer(transfer_id: int, approved_by_id: int):
    transfer = transfer_repo.get_transfer_by_id(transfer_id)
    if not transfer:
        raise AppException(404, "Transfer not found", "TRANSFER_NOT_FOUND")
    if transfer["status"] != "pending":
        raise AppException(409, "Transfer is not pending", "INVALID_TRANSFER_STATE")

    active = allocation_repo.get_active_allocation_for_asset(transfer["asset_id"])
    if not active or active["employee_id"] != transfer["from_employee_id"]:
        raise AppException(409, "No matching active allocation found", "TRANSFER_CONFLICT")

    with get_cursor() as cursor:
        allocation_repo.return_allocation(active["id"], notes="Transfer approved", cursor=cursor)
        allocation_repo.create_allocation(
            transfer["asset_id"],
            transfer["to_employee_id"],
            expected_return_date=active["expected_return_date"],
            department_id=employee_repo.get_employee_by_id(transfer["to_employee_id"])["department_id"],
            assigned_by_id=approved_by_id,
            cursor=cursor,
        )
        asset_repo.update_status(transfer["asset_id"], "allocated", cursor=cursor)
        approved = transfer_repo.approve_transfer(transfer_id, approved_by_id, cursor=cursor)
        notification_service.notify(
            transfer["from_employee_id"],
            "Your asset has been transferred",
            "transfer",
            cursor=cursor,
        )
        notification_service.notify(
            transfer["to_employee_id"],
            "An asset has been transferred to you",
            "transfer",
            cursor=cursor,
        )

    logger.info("transfer approved transfer_id=%s", transfer_id)
    return approved


def list_transfers():
    return transfer_repo.list_transfers()

