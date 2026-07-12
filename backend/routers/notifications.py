from fastapi import APIRouter, Depends

from backend.core.auth import get_current_user
from backend.schemas.common import ApiResponse
from backend.repositories import notification_repo
from backend.services import notification_service


router = APIRouter(prefix="/api/notifications", tags=["notifications"])


@router.get("", response_model=ApiResponse)
def list_notifications(current_user=Depends(get_current_user)):
    return ApiResponse(data=notification_repo.list_notifications(current_user["id"]))


@router.patch("/{notification_id}/read", response_model=ApiResponse)
def mark_notification_read(notification_id: int, current_user=Depends(get_current_user)):
    return ApiResponse(message="Notification marked read", data=notification_service.mark_as_read(notification_id, current_user["id"]))
