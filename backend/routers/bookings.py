from fastapi import APIRouter, Depends, Query

from backend.core.auth import get_current_user, require_role
from backend.core.exceptions import AppException
from backend.schemas.bookings import BookingCreateRequest
from backend.schemas.common import ApiResponse
from backend.services import booking_service


router = APIRouter(prefix="/api/bookings", tags=["bookings"])


@router.post("", response_model=ApiResponse, dependencies=[Depends(require_role("admin", "asset_manager", "employee"))])
def create_booking(payload: BookingCreateRequest, current_user=Depends(get_current_user)):
    return ApiResponse(
        message="Booking created",
        data=booking_service.create_booking(
            payload.resource_asset_id,
            payload.employee_id,
            payload.start_time,
            payload.end_time,
        ),
    )


@router.get("", response_model=ApiResponse)
def list_bookings(
    resource_asset_id: int | None = Query(default=None),
    current_user=Depends(get_current_user),
):
    employee_id = current_user["id"] if current_user.get("role") == "employee" else None
    return ApiResponse(data=booking_service.list_bookings(employee_id=employee_id, resource_asset_id=resource_asset_id))


@router.delete("/{booking_id}/cancel", response_model=ApiResponse, dependencies=[Depends(require_role("admin", "asset_manager", "employee"))])
def cancel_booking(booking_id: int):
    return ApiResponse(message="Booking cancelled", data=booking_service.cancel_booking(booking_id))
