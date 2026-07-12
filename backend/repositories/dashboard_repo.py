from backend.repositories.base import fetch_one


def get_dashboard_summary(cursor=None):
    return fetch_one(
        """
        SELECT
            (SELECT COUNT(*) FROM assets) AS total_assets,
            (SELECT COUNT(*) FROM assets WHERE status = 'available') AS available_assets,
            (SELECT COUNT(*) FROM assets WHERE status = 'allocated') AS allocated_assets,
            (SELECT COUNT(*) FROM assets WHERE status = 'under_maintenance') AS under_maintenance_assets,
            (SELECT COUNT(*) FROM allocations WHERE status = 'active') AS active_allocations,
            (SELECT COUNT(*) FROM allocations WHERE status = 'active' AND expected_return_date < CURRENT_DATE) AS overdue_allocations,
            (SELECT COUNT(*) FROM maintenance_requests WHERE status = 'pending') AS pending_maintenance,
            (SELECT COUNT(*) FROM bookings WHERE status IN ('upcoming', 'ongoing')) AS upcoming_bookings
        """,
        cursor=cursor,
    )
