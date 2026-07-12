# AssetFlow Database

Database setup for the AssetFlow project built during the Odoo Hackathon.

---

## Database

- **Database:** PostgreSQL 17
- **Database Name:** `assetflow_db`

---

## Files

- `schema.sql` – Creates the PostgreSQL database schema, tables, constraints, ENUM types, and indexes.
- `seed.sql` – Inserts sample data for testing and development.

---

## Setup

### 1. Create a PostgreSQL database

```sql
CREATE DATABASE assetflow_db;
```

### 2. Open the database in pgAdmin

Select **assetflow_db** and open the **Query Tool**.

### 3. Run the schema

Execute:

```
schema.sql
```

This creates:

- ENUM types
- Tables
- Foreign key constraints
- Indexes

### 4. Run the seed data

Execute:

```
seed.sql
```

This inserts sample records into all tables.

---

## Tables

- departments
- employees
- asset_categories
- assets
- allocations
- transfer_requests
- bookings
- maintenance_requests
- notifications

---

## Verification

Run the following queries to verify that the seed data has been inserted successfully:

```sql
SELECT COUNT(*) FROM departments;
SELECT COUNT(*) FROM employees;
SELECT COUNT(*) FROM assets;
SELECT COUNT(*) FROM notifications;
```

Expected results:

| Table | Count |
|--------|------:|
| departments | 4 |
| employees | 10 |
| assets | 20 |
| notifications | 10 |

---

## Technologies

- PostgreSQL 17
- pgAdmin 4
