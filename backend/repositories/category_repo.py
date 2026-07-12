from typing import Optional

from backend.repositories.base import execute, fetch_all, fetch_one


def list_categories(cursor=None):
    return fetch_all("SELECT id, name, custom_fields FROM asset_categories ORDER BY name", cursor=cursor)


def get_category_by_id(category_id: int, cursor=None):
    return fetch_one(
        "SELECT id, name, custom_fields FROM asset_categories WHERE id = %s",
        (category_id,),
        cursor=cursor,
    )


def get_category_by_name(name: str, cursor=None):
    return fetch_one(
        "SELECT id, name, custom_fields FROM asset_categories WHERE LOWER(name) = LOWER(%s)",
        (name,),
        cursor=cursor,
    )


def create_category(name: str, custom_fields=None, cursor=None):
    return fetch_one(
        "INSERT INTO asset_categories (name, custom_fields) VALUES (%s, %s) RETURNING id, name, custom_fields",
        (name, custom_fields),
        cursor=cursor,
    )


def update_category(category_id: int, name: Optional[str], custom_fields=None, cursor=None):
    return fetch_one(
        "UPDATE asset_categories SET name = COALESCE(%s, name), custom_fields = COALESCE(%s, custom_fields) WHERE id = %s RETURNING id, name, custom_fields",
        (name, custom_fields, category_id),
        cursor=cursor,
    )


def delete_category(category_id: int, cursor=None):
    return execute("DELETE FROM asset_categories WHERE id = %s", (category_id,), cursor=cursor)
