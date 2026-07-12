from contextlib import contextmanager
from pathlib import Path
from typing import Generator, Optional

from psycopg2.extras import RealDictCursor
from psycopg2.pool import SimpleConnectionPool

from backend.config import settings


_pool: Optional[SimpleConnectionPool] = None


def get_pool() -> SimpleConnectionPool:
    global _pool
    if _pool is None:
        _pool = SimpleConnectionPool(1, 10, dsn=settings.database_url)
    return _pool


def close_pool() -> None:
    global _pool
    if _pool is not None:
        _pool.closeall()
        _pool = None


@contextmanager
def get_cursor() -> Generator[RealDictCursor, None, None]:
    pool = get_pool()
    connection = pool.getconn()
    try:
        with connection.cursor(cursor_factory=RealDictCursor) as cursor:
            yield cursor
        connection.commit()
    except Exception:
        connection.rollback()
        raise
    finally:
        pool.putconn(connection)


def initialize_schema() -> None:
    if not settings.auto_init_schema:
        return
    schema_path = Path(__file__).parent / "sql" / "schema.sql"
    if not schema_path.exists():
        return
    with get_cursor() as cursor:
        cursor.execute(schema_path.read_text())
