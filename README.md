# Odoo Hackathon

## 1. Project Overview

This project is an asset management platform built for a hackathon demo. It includes a Vite-based frontend and a FastAPI backend backed by PostgreSQL.

## 2. Features

- Asset allocation and tracking
- Department and employee management
- Booking and maintenance workflows
- Transfer requests
- Notifications and dashboard views
- Seeded demo data for quick testing

## 3. Tech Stack

- Frontend: React, Vite, TypeScript
- Backend: FastAPI, Python
- Database: PostgreSQL
- Styling/UI: Tailwind CSS, Radix UI, MUI, Emotion

## 4. System Architecture

```mermaid
flowchart LR
	U[User Browser] --> F[Frontend: Vite React App]
	F --> B[Backend: FastAPI]
	B --> D[(PostgreSQL)]
```

## 5. Installation

### Frontend

```powershell
Set-Location .\frontend
npm ci
node .\node_modules\vite\bin\vite.js --host 127.0.0.1
```

### Backend

```powershell
Set-Location .
py -3.13 -m pip install -r requirements.txt
py -3.13 -m pip install email-validator
uvicorn main:app --host 127.0.0.1 --port 8000
```

## 6. Environment Variables

The backend reads these variables from the environment or a `.env` file:

| Variable | Default | Purpose |
| --- | --- | --- |
| `DATABASE_URL` | `postgresql://postgres:postgres@localhost:5432/assetflow` | PostgreSQL connection string |
| `SECRET_KEY` | `change-me-in-production` | JWT signing key |
| `JWT_ALGORITHM` | `HS256` | JWT algorithm |
| `ACCESS_TOKEN_EXPIRE_HOURS` | `8` | Token lifetime |
| `CORS_ORIGINS` | `*` | Allowed frontend origins |
| `AUTO_INIT_SCHEMA` | `true` | Auto-create tables on startup |
| `LOG_LEVEL` | `INFO` | Backend logging level |

Example `.env`:

```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/assetflow
SECRET_KEY=change-me-in-production
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_HOURS=8
CORS_ORIGINS=*
AUTO_INIT_SCHEMA=true
LOG_LEVEL=INFO
```

## 7. Database Setup

1. Start PostgreSQL locally.
2. Create a database named `assetflow`.
3. Run the backend once, or execute the schema manually from [backend/sql/schema.sql](backend/sql/schema.sql).
4. The startup path calls `initialize_schema()` automatically when `AUTO_INIT_SCHEMA=true`.

If you want to skip automatic schema creation temporarily, set:

```powershell
$env:AUTO_INIT_SCHEMA = "false"
```

## 8. Seed Data

The repo includes demo seed logic in [backend/seed.py](backend/seed.py).

To load the demo records:

```powershell
Set-Location .
py -3.13 backend\seed.py
```

This inserts sample departments, employees, assets, allocations, bookings, and maintenance requests.

## 9. Demo Credentials

Seeded demo logins:

- Admin: `admin@assetflow.com` / `password123`
- Employee: `priya@assetflow.com` / `password123`
- Asset Manager: `aman@assetflow.com` / `password123`

Note: the current auth helper also contains a hackathon bypass that returns a fixed admin user in [backend/core/auth.py](backend/core/auth.py).

## 10. Folder Structure

```text
.
├── backend/
│   ├── core/
│   ├── routers/
│   ├── schemas/
│   ├── sql/
│   ├── seed.py
│   ├── db.py
│   └── main.py
├── database/
├── documentation/
├── frontend/
│   ├── src/
│   ├── package.json
│   └── vite.config.ts
├── main.py
├── seed.py
└── requirements.txt
```

## 11. Link to Documentation

See the project documentation in [documentation](documentation/).
