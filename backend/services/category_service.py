from backend.core.exceptions import AppException
from backend.repositories import category_repo


def list_categories():
    return category_repo.list_categories()


def get_category(category_id: int):
    category = category_repo.get_category_by_id(category_id)
    if not category:
        raise AppException(404, "Category not found", "CATEGORY_NOT_FOUND")
    return category


def create_category(name: str, description: str = None):
    if category_repo.get_category_by_name(name):
        raise AppException(409, "Category already exists", "CATEGORY_EXISTS")
    return category_repo.create_category(name, description)


def update_category(category_id: int, name, description=None):
    if name and category_repo.get_category_by_name(name):
        raise AppException(409, "Category already exists", "CATEGORY_EXISTS")
    category = category_repo.update_category(category_id, name, description)
    if not category:
        raise AppException(404, "Category not found", "CATEGORY_NOT_FOUND")
    return category


def delete_category(category_id: int):
    deleted = category_repo.delete_category(category_id)
    if not deleted:
        raise AppException(404, "Category not found", "CATEGORY_NOT_FOUND")

