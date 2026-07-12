from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.config import settings
from backend.core.exceptions import register_exception_handlers
from backend.core.logger import logger
from backend.db import initialize_schema
from backend.routers.allocations import router as allocations_router
from backend.routers.assets import router as assets_router
from backend.routers.auth import router as auth_router
from backend.routers.bookings import router as bookings_router
from backend.routers.categories import router as categories_router
from backend.routers.dashboard import router as dashboard_router
from backend.routers.departments import router as departments_router
from backend.routers.employees import router as employees_router
from backend.routers.maintenance import router as maintenance_router
from backend.routers.notifications import router as notifications_router
from backend.routers.transfers import router as transfers_router
from backend.routers.locations import router as locations_router
from backend.routers.settings import router as settings_router


app = FastAPI(title="AssetFlow API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins,
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

register_exception_handlers(app)

app.include_router(auth_router)
app.include_router(departments_router)
app.include_router(categories_router)
app.include_router(employees_router)
app.include_router(assets_router)
app.include_router(allocations_router)
app.include_router(transfers_router)
app.include_router(bookings_router)
app.include_router(maintenance_router)
app.include_router(dashboard_router)
app.include_router(notifications_router)
app.include_router(locations_router)
app.include_router(settings_router)


@app.on_event("startup")
def startup_event() -> None:
    initialize_schema()
    logger.info("AssetFlow API started")


@app.get("/health")
def health_check():
    return {"status": "ok"}

