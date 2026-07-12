from psycopg2 import connect

from backend.config import settings
from backend.core.auth import hash_password
from backend.db import initialize_schema


def seed_demo_data() -> None:
    initialize_schema()
    connection = connect(settings.database_url)
    try:
        with connection.cursor() as cursor:
            cursor.execute(
                "INSERT INTO departments (name) VALUES (%s) ON CONFLICT (name) DO NOTHING",
                ("Operations",),
            )
            cursor.execute(
                "INSERT INTO departments (name) VALUES (%s) ON CONFLICT (name) DO NOTHING",
                ("IT",),
            )
            cursor.execute(
                "INSERT INTO asset_categories (name) VALUES (%s) ON CONFLICT (name) DO NOTHING",
                ("Laptop",),
            )
            cursor.execute(
                "INSERT INTO asset_categories (name) VALUES (%s) ON CONFLICT (name) DO NOTHING",
                ("Monitor",),
            )
            cursor.execute(
                """
                INSERT INTO employees (name, email, password_hash, role)
                VALUES (%s, %s, %s, %s)
                ON CONFLICT (email) DO NOTHING
                """,
                ("Admin", "admin@assetflow.com", hash_password("password123"), "admin"),
            )
            cursor.execute(
                """
                INSERT INTO employees (name, email, password_hash, role, department_id)
                VALUES (%s, %s, %s, %s, (SELECT id FROM departments WHERE name = %s LIMIT 1))
                ON CONFLICT (email) DO NOTHING
                """,
                ("Priya Sharma", "priya@assetflow.com", hash_password("password123"), "employee", "Operations"),
            )
            cursor.execute(
                """
                INSERT INTO employees (name, email, password_hash, role, department_id)
                VALUES (%s, %s, %s, %s, (SELECT id FROM departments WHERE name = %s LIMIT 1))
                ON CONFLICT (email) DO NOTHING
                """,
                ("Aman Verma", "aman@assetflow.com", hash_password("password123"), "asset_manager", "IT"),
            )
            cursor.execute(
                """
                INSERT INTO assets (asset_tag, name, category_id, serial_number, status, location, is_bookable)
                VALUES
                    ('AF-0001', 'MacBook Pro', (SELECT id FROM asset_categories WHERE name = 'Laptop' LIMIT 1), 'MBP-001', 'allocated', 'Mumbai', false),
                    ('AF-0002', 'Conference Room A', (SELECT id FROM asset_categories WHERE name = 'Monitor' LIMIT 1), 'ROOM-A', 'available', 'HQ', true),
                    ('AF-0003', 'Dell Monitor', (SELECT id FROM asset_categories WHERE name = 'Monitor' LIMIT 1), 'DEL-001', 'under_maintenance', 'Pune', false)
                ON CONFLICT (asset_tag) DO NOTHING
                """,
            )
            cursor.execute(
                """
                INSERT INTO allocations (asset_id, employee_id, department_id, expected_return_date, status)
                SELECT a.id, e.id, e.department_id, CURRENT_DATE + 7, 'active'
                FROM assets a
                JOIN employees e ON e.email = 'priya@assetflow.com'
                WHERE a.asset_tag = 'AF-0001'
                ON CONFLICT DO NOTHING
                """
            )
            cursor.execute(
                """
                INSERT INTO bookings (resource_asset_id, employee_id, start_time, end_time, status)
                SELECT a.id, e.id,
                       date_trunc('day', NOW()) + INTERVAL '9 hours',
                       date_trunc('day', NOW()) + INTERVAL '10 hours',
                       'upcoming'
                FROM assets a
                JOIN employees e ON e.email = 'aman@assetflow.com'
                WHERE a.asset_tag = 'AF-0002'
                ON CONFLICT DO NOTHING
                """
            )
            cursor.execute(
                """
                INSERT INTO maintenance_requests (asset_id, raised_by, issue, priority, status)
                SELECT a.id, e.id, 'Battery not holding charge', 'high', 'pending'
                FROM assets a
                JOIN employees e ON e.email = 'aman@assetflow.com'
                WHERE a.asset_tag = 'AF-0003'
                ON CONFLICT DO NOTHING
                """
            )
        connection.commit()
    finally:
        connection.close()


if __name__ == "__main__":
    seed_demo_data()
    print("Seed data inserted")
