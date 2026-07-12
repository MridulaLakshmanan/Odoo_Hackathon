from backend.repositories import allocation_repo, dashboard_repo


def get_dashboard_summary():
    summary = dashboard_repo.get_dashboard_summary()
    summary["overdue_returns"] = allocation_repo.list_overdue_allocations()
    return summary

