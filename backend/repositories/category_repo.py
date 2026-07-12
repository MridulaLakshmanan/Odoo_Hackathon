from typing import Optional

from backend.repositories.base import execute, fetch_all, fetch_one


def list_categories(cursor=None):
    return fetch_all("SELECT id, name, description FROM asset_categories ORDER BY name", cursor=cursor)


def get_category_by_id(category_id: int, cursor=None):
    return fetch_one(
        "SELECT id, name, description FROM asset_categories WHERE id = %s",
        (category_id,),
        cursor=cursor,
    )


def get_category_by_name(name: str, cursor=None):
    return fetch_one(
        "SELECT id, name, description FROM asset_categories WHERE LOWER(name) = LOWER(%s)",
        (name,),
        cursor=cursor,
    )


def create_category(name: str, description=None, cursor=None):
    return fetch_one(
        "INSERT INTO asset_categories (name, description) VALUES (%s, %s) RETURNING id, name, description",
        (name, description),
        cursor=cursor,
    )


def update_category(category_id: int, name: Optional[str], description=None, cursor=None):
    return fetch_one(
        "UPDATE asset_categories SET name = COALESCE(%s, name), description = COALESCE(%s, description) WHERE id = %s RETURNING id, name, description",
        (name, description, category_id),
        cursor=cursor,
    )


def delete_category(category_id: int, cursor=None):
    return execute("DELETE FROM asset_categories WHERE id = %s", (category_id,), cursor=cursor)
