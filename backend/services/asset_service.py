from backend.core.exceptions import AppException
from backend.core.logger import logger
from backend.repositories import asset_repo, category_repo, department_repo


def create_asset(name, category_id, department_id=None, location=None, serial_number=None, description=None, is_bookable=False):
    if not category_repo.get_category_by_id(category_id):
        raise AppException(404, "Category not found", "CATEGORY_NOT_FOUND")
    if department_id and not department_repo.get_department_by_id(department_id):
        raise AppException(404, "Department not found", "DEPARTMENT_NOT_FOUND")
    asset_tag = asset_repo.generate_asset_tag()
    asset = asset_repo.create_asset(
        asset_tag,
        name,
        category_id,
        department_id,
        location,
        serial_number,
        description,
        is_bookable=is_bookable,
    )
    logger.info("asset created asset_id=%s asset_tag=%s", asset["id"], asset["asset_tag"])
    return asset


def list_assets(filters=None):
    return asset_repo.list_assets(filters)


def get_asset(asset_id: int):
    asset = asset_repo.get_asset_by_id(asset_id)
    if not asset:
        raise AppException(404, "Asset not found", "ASSET_NOT_FOUND")
    asset["allocations"] = asset_repo.get_asset_allocations(asset_id)
    asset["maintenance_history"] = asset_repo.get_asset_maintenance(asset_id)
    return asset


def update_asset(asset_id: int, **payload):
    if payload.get("category_id") and not category_repo.get_category_by_id(payload["category_id"]):
        raise AppException(404, "Category not found", "CATEGORY_NOT_FOUND")
    if payload.get("department_id") and not department_repo.get_department_by_id(payload["department_id"]):
        raise AppException(404, "Department not found", "DEPARTMENT_NOT_FOUND")
    asset = asset_repo.update_asset(asset_id, **payload)
    if not asset:
        raise AppException(404, "Asset not found", "ASSET_NOT_FOUND")
    return asset


def delete_asset(asset_id: int):
    deleted = asset_repo.delete_asset(asset_id)
    if not deleted:
        raise AppException(404, "Asset not found", "ASSET_NOT_FOUND")

