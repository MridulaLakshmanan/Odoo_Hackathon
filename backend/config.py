import os

from dotenv import load_dotenv


load_dotenv()


class Settings:
    def __init__(self) -> None:
        self.database_url = os.getenv(
            "DATABASE_URL",
            "postgresql://postgres:postgres@localhost:5432/assetflow",
        )
        self.secret_key = os.getenv("SECRET_KEY", "change-me-in-production")
        self.algorithm = os.getenv("JWT_ALGORITHM", "HS256")
        self.access_token_expire_hours = int(os.getenv("ACCESS_TOKEN_EXPIRE_HOURS", "8"))
        self.allowed_origins = [
            origin.strip()
            for origin in os.getenv("CORS_ORIGINS", "*").split(",")
            if origin.strip()
        ]
        self.auto_init_schema = os.getenv("AUTO_INIT_SCHEMA", "true").lower() in {
            "1",
            "true",
            "yes",
            "on",
        }
        self.log_level = os.getenv("LOG_LEVEL", "INFO").upper()


settings = Settings()
