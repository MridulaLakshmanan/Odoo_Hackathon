from fastapi import APIRouter

from backend.schemas.auth import AuthTokenResponse, AuthUserResponse, LoginRequest, SignupRequest
from backend.schemas.common import ApiResponse
from backend.services import auth_service


router = APIRouter(prefix="/api/auth", tags=["auth"])


@router.post("/signup", response_model=ApiResponse)
def signup(payload: SignupRequest):
    user, token = auth_service.signup(payload.name, payload.email, payload.password, payload.department_id)
    public_user = AuthUserResponse(**user)
    return ApiResponse(
        message="Signup successful",
        data=AuthTokenResponse(access_token=token, user=public_user).dict(),
    )


@router.post("/login", response_model=ApiResponse)
def login(payload: LoginRequest):
    user, token = auth_service.login(payload.email, payload.password)
    public_user = AuthUserResponse(**user)
    return ApiResponse(
        message="Login successful",
        data=AuthTokenResponse(access_token=token, user=public_user).dict(),
    )
