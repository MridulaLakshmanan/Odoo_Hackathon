-- ==========================================================
-- AssetFlow Database Schema
-- Odoo Hackathon
-- PostgreSQL 17
-- ==========================================================

DROP SCHEMA public CASCADE;
CREATE SCHEMA public;

-- ==========================================================
-- ENUM TYPES
-- ==========================================================

CREATE TYPE department_status AS ENUM ('active','inactive');

CREATE TYPE employee_role AS ENUM (
    'admin',
    'asset_manager',
    'department_head',
    'employee'
);

CREATE TYPE employee_status AS ENUM (
    'active',
    'inactive'
);

CREATE TYPE asset_condition_type AS ENUM (
    'Excellent',
    'Good',
    'Average',
    'Damaged'
);

CREATE TYPE asset_status AS ENUM (
    'Available',
    'Allocated',
    'Reserved',
    'Under Maintenance',
    'Lost',
    'Retired',
    'Disposed'
);

CREATE TYPE allocation_status AS ENUM (
    'active',
    'returned'
);

CREATE TYPE transfer_status AS ENUM (
    'Requested',
    'Approved',
    'Rejected'
);

CREATE TYPE booking_status AS ENUM (
    'Upcoming',
    'Ongoing',
    'Completed',
    'Cancelled'
);

CREATE TYPE maintenance_priority AS ENUM (
    'Low',
    'Medium',
    'High'
);

CREATE TYPE maintenance_status AS ENUM (
    'Pending',
    'Approved',
    'Rejected',
    'In Progress',
    'Resolved'
);

CREATE TYPE notification_type_enum AS ENUM (
    'Allocation',
    'Transfer',
    'Booking',
    'Maintenance',
    'Reminder'
);

-- ==========================================================
-- DEPARTMENTS
-- ==========================================================

CREATE TABLE departments (

    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

    name VARCHAR(100) NOT NULL,

    code VARCHAR(20) UNIQUE,

    status department_status DEFAULT 'active'

);

-- ==========================================================
-- EMPLOYEES
-- ==========================================================

CREATE TABLE employees (

    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

    name VARCHAR(100) NOT NULL,

    email VARCHAR(100) UNIQUE NOT NULL,

    password_hash VARCHAR(255) NOT NULL,

    role employee_role DEFAULT 'employee',

    status employee_status DEFAULT 'active',

    department_id INTEGER,

    CONSTRAINT fk_employee_department
        FOREIGN KEY (department_id)
        REFERENCES departments(id)

);

-- ==========================================================
-- ASSET CATEGORIES
-- ==========================================================

CREATE TABLE asset_categories (

    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

    name VARCHAR(100) UNIQUE NOT NULL,

    description TEXT

);

-- ==========================================================
-- ASSETS
-- ==========================================================

CREATE TABLE assets (

    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

    asset_tag VARCHAR(20) UNIQUE NOT NULL,

    name VARCHAR(100) NOT NULL,

    category_id INTEGER NOT NULL,

    serial_number VARCHAR(100) UNIQUE,

    purchase_date DATE,

    cost NUMERIC(10,2),

    location VARCHAR(100),

    asset_condition asset_condition_type
        DEFAULT 'Good',

    status asset_status
        DEFAULT 'Available',

    is_bookable BOOLEAN DEFAULT FALSE,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_asset_category
        FOREIGN KEY(category_id)
        REFERENCES asset_categories(id)

);


-- ==========================================================
-- ALLOCATIONS
-- ==========================================================

CREATE TABLE allocations (

    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

    asset_id INTEGER NOT NULL,

    employee_id INTEGER NOT NULL,

    department_id INTEGER,

    allocated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    expected_return_date DATE,

    returned_at TIMESTAMP,

    status allocation_status DEFAULT 'active',

    CONSTRAINT fk_allocation_asset
        FOREIGN KEY (asset_id)
        REFERENCES assets(id),

    CONSTRAINT fk_allocation_employee
        FOREIGN KEY (employee_id)
        REFERENCES employees(id),

    CONSTRAINT fk_allocation_department
        FOREIGN KEY (department_id)
        REFERENCES departments(id)

);

-- ==========================================================
-- TRANSFER REQUESTS
-- ==========================================================

CREATE TABLE transfer_requests (

    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

    asset_id INTEGER NOT NULL,

    from_employee_id INTEGER NOT NULL,

    to_employee_id INTEGER NOT NULL,

    status transfer_status DEFAULT 'Requested',

    request_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    approval_date TIMESTAMP,

    CONSTRAINT fk_transfer_asset
        FOREIGN KEY (asset_id)
        REFERENCES assets(id),

    CONSTRAINT fk_transfer_from_employee
        FOREIGN KEY (from_employee_id)
        REFERENCES employees(id),

    CONSTRAINT fk_transfer_to_employee
        FOREIGN KEY (to_employee_id)
        REFERENCES employees(id)

);

-- ==========================================================
-- BOOKINGS
-- ==========================================================

CREATE TABLE bookings (

    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

    asset_id INTEGER NOT NULL,

    employee_id INTEGER NOT NULL,

    start_time TIMESTAMP NOT NULL,

    end_time TIMESTAMP NOT NULL,

    status booking_status DEFAULT 'Upcoming',

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_booking_asset
        FOREIGN KEY (asset_id)
        REFERENCES assets(id),

    CONSTRAINT fk_booking_employee
        FOREIGN KEY (employee_id)
        REFERENCES employees(id)

);

-- ==========================================================
-- MAINTENANCE REQUESTS
-- ==========================================================

CREATE TABLE maintenance_requests (

    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

    asset_id INTEGER NOT NULL,

    raised_by INTEGER NOT NULL,

    approved_by INTEGER,

    issue TEXT NOT NULL,

    priority maintenance_priority DEFAULT 'Medium',

    status maintenance_status DEFAULT 'Pending',

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    resolved_at TIMESTAMP,

    CONSTRAINT fk_maintenance_asset
        FOREIGN KEY (asset_id)
        REFERENCES assets(id),

    CONSTRAINT fk_maintenance_raised_by
        FOREIGN KEY (raised_by)
        REFERENCES employees(id),

    CONSTRAINT fk_maintenance_approved_by
        FOREIGN KEY (approved_by)
        REFERENCES employees(id)

);

-- ==========================================================
-- NOTIFICATIONS
-- ==========================================================

CREATE TABLE notifications (

    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

    employee_id INTEGER NOT NULL,

    message TEXT NOT NULL,

    notification_type notification_type_enum NOT NULL,

    is_read BOOLEAN DEFAULT FALSE,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_notification_employee
        FOREIGN KEY (employee_id)
        REFERENCES employees(id)

);

CREATE INDEX idx_employee_department
ON employees(department_id);

CREATE INDEX idx_asset_category
ON assets(category_id);

CREATE INDEX idx_allocation_asset
ON allocations(asset_id);

CREATE INDEX idx_allocation_employee
ON allocations(employee_id);

CREATE INDEX idx_transfer_asset
ON transfer_requests(asset_id);

CREATE INDEX idx_booking_asset
ON bookings(asset_id);

CREATE INDEX idx_maintenance_asset
ON maintenance_requests(asset_id);

CREATE INDEX idx_notification_employee
ON notifications(employee_id);