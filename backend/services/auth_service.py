from backend.core.auth import create_access_token, hash_password, verify_password
from backend.core.exceptions import AppException
from backend.repositories import employee_repo


def _public_user(user):
    return {
        "id": user["id"],
        "name": user["name"],
        "email": user["email"],
        "role": user["role"],
        "department_id": user["department_id"],
    }


def signup(name: str, email: str, password: str, department_id=None):
    existing = employee_repo.get_employee_by_email(email)
    if existing:
        raise AppException(409, "An account with this email already exists", "EMAIL_EXISTS")
    password_hash = hash_password(password)
    user = employee_repo.create_employee(name, email.lower(), password_hash, department_id, role="employee")
    token = create_access_token(
        {"id": user["id"], "role": user["role"], "department_id": user["department_id"]}
    )
    return _public_user(user), token


def login(email: str, password: str):
    user = employee_repo.get_employee_by_email(email)
    if not user or not verify_password(password, user["password_hash"]):
        raise AppException(401, "Invalid email or password", "INVALID_CREDENTIALS")
    token = create_access_token(
        {"id": user["id"], "role": user["role"], "department_id": user["department_id"]}
    )
    return _public_user(user), token

