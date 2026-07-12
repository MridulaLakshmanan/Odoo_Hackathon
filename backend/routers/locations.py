from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from backend.db import get_cursor
from backend.schemas.locations import LocationCreate, LocationResponse, LocationUpdate
import psycopg2

router = APIRouter(prefix="/api/locations", tags=["locations"])

@router.get("", response_model=List[LocationResponse])
@router.get("/", response_model=List[LocationResponse])
def get_locations():
    with get_cursor() as cursor:
        cursor.execute("SELECT * FROM locations ORDER BY id")
        return cursor.fetchall()

@router.post("", response_model=LocationResponse, status_code=status.HTTP_201_CREATED)
@router.post("/", response_model=LocationResponse, status_code=status.HTTP_201_CREATED)
def create_location(location: LocationCreate):
    with get_cursor() as cursor:
        cursor.execute(
            "INSERT INTO locations (name, address, type) VALUES (%s, %s, %s) RETURNING *",
            (location.name, location.address, location.type)
        )
        return cursor.fetchone()

@router.get("/{location_id}", response_model=LocationResponse)
def get_location(location_id: int):
    with get_cursor() as cursor:
        cursor.execute("SELECT * FROM locations WHERE id = %s", (location_id,))
        loc = cursor.fetchone()
        if not loc:
            raise HTTPException(status_code=404, detail="Location not found")
        return loc

@router.put("/{location_id}", response_model=LocationResponse)
def update_location(location_id: int, location: LocationUpdate):
    with get_cursor() as cursor:
        cursor.execute("SELECT * FROM locations WHERE id = %s", (location_id,))
        if not cursor.fetchone():
            raise HTTPException(status_code=404, detail="Location not found")

        update_fields = []
        values = []
        for key, value in location.dict(exclude_unset=True).items():
            update_fields.append(f"{key} = %s")
            values.append(value)
        
        if not update_fields:
            cursor.execute("SELECT * FROM locations WHERE id = %s", (location_id,))
            return cursor.fetchone()
        
        values.append(location_id)
        query = f"UPDATE locations SET {', '.join(update_fields)} WHERE id = %s RETURNING *"
        cursor.execute(query, tuple(values))
        return cursor.fetchone()

@router.delete("/{location_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_location(location_id: int):
    with get_cursor() as cursor:
        cursor.execute("SELECT * FROM locations WHERE id = %s", (location_id,))
        if not cursor.fetchone():
            raise HTTPException(status_code=404, detail="Location not found")
        cursor.execute("DELETE FROM locations WHERE id = %s", (location_id,))
