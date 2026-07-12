from typing import Any, Iterable, List, Optional, Sequence

from backend.db import get_cursor


def fetch_one(query: str, params: Optional[Sequence[Any]] = None, cursor=None):
    if cursor is not None:
        cursor.execute(query, params)
        return cursor.fetchone()
    with get_cursor() as managed_cursor:
        managed_cursor.execute(query, params)
        return managed_cursor.fetchone()


def fetch_all(query: str, params: Optional[Sequence[Any]] = None, cursor=None):
    if cursor is not None:
        cursor.execute(query, params)
        return cursor.fetchall()
    with get_cursor() as managed_cursor:
        managed_cursor.execute(query, params)
        return managed_cursor.fetchall()


def execute(query: str, params: Optional[Sequence[Any]] = None, cursor=None):
    if cursor is not None:
        cursor.execute(query, params)
        return cursor.rowcount
    with get_cursor() as managed_cursor:
        managed_cursor.execute(query, params)
        return managed_cursor.rowcount

