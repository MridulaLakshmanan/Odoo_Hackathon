from fastapi import APIRouter, Depends, HTTPException, status
from backend.db import get_cursor
from backend.schemas.settings import SettingsResponse, SettingsUpdate
import psycopg2

router = APIRouter(prefix="/api/settings", tags=["settings"])

@router.get("", response_model=SettingsResponse)
@router.get("/", response_model=SettingsResponse)
def get_settings():
    with get_cursor() as cursor:
        cursor.execute("SELECT * FROM settings ORDER BY id LIMIT 1")
        settings = cursor.fetchone()
        if not settings:
            cursor.execute("INSERT INTO settings (org_name) VALUES ('Acme Corporation') RETURNING *")
            settings = cursor.fetchone()
        return settings

@router.put("", response_model=SettingsResponse)
@router.put("/", response_model=SettingsResponse)
def update_settings(settings_data: SettingsUpdate):
    with get_cursor() as cursor:
        cursor.execute("SELECT id FROM settings ORDER BY id LIMIT 1")
        row = cursor.fetchone()
        if not row:
            raise HTTPException(status_code=404, detail="Settings not found")
            
        settings_id = row['id']
        update_fields = []
        values = []
        for key, value in settings_data.dict(exclude_unset=True).items():
            update_fields.append(f"{key} = %s")
            values.append(value)
        
        if not update_fields:
            cursor.execute("SELECT * FROM settings WHERE id = %s", (settings_id,))
            return cursor.fetchone()
            
        values.append(settings_id)
        query = f"UPDATE settings SET {', '.join(update_fields)} WHERE id = %s RETURNING *"
        cursor.execute(query, tuple(values))
        return cursor.fetchone()
