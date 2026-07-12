CREATE TABLE IF NOT EXISTS departments (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    head_employee_id INT,
    parent_dept_id INT REFERENCES departments(id),
    status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active','inactive'))
);

CREATE TABLE IF NOT EXISTS employees (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    department_id INT REFERENCES departments(id),
    role VARCHAR(20) NOT NULL DEFAULT 'employee'
        CHECK (role IN ('employee','dept_head','asset_manager','admin')),
    status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active','inactive')),
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'fk_dept_head'
    ) THEN
        ALTER TABLE departments
            ADD CONSTRAINT fk_dept_head FOREIGN KEY (head_employee_id) REFERENCES employees(id);
    END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_employees_department ON employees(department_id);

CREATE TABLE IF NOT EXISTS asset_categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    custom_fields JSONB
);

CREATE TABLE IF NOT EXISTS assets (
    id SERIAL PRIMARY KEY,
    asset_tag VARCHAR(20) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    category_id INT NOT NULL REFERENCES asset_categories(id),
    serial_number VARCHAR(50),
    status VARCHAR(20) NOT NULL DEFAULT 'available'
        CHECK (status IN ('available','allocated','reserved','under_maintenance','lost','retired','disposed')),
    location VARCHAR(100),
    is_bookable BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_assets_status ON assets(status);
CREATE INDEX IF NOT EXISTS idx_assets_category ON assets(category_id);

CREATE TABLE IF NOT EXISTS allocations (
    id SERIAL PRIMARY KEY,
    asset_id INT NOT NULL REFERENCES assets(id),
    employee_id INT NOT NULL REFERENCES employees(id),
    department_id INT REFERENCES departments(id),
    expected_return_date DATE,
    status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active','returned')),
    allocated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    returned_at TIMESTAMP,
    condition_notes TEXT
);

CREATE UNIQUE INDEX IF NOT EXISTS one_active_allocation_per_asset
    ON allocations (asset_id) WHERE status = 'active';

CREATE INDEX IF NOT EXISTS idx_allocations_employee ON allocations(employee_id);
CREATE INDEX IF NOT EXISTS idx_allocations_overdue ON allocations(expected_return_date) WHERE status = 'active';

CREATE TABLE IF NOT EXISTS transfer_requests (
    id SERIAL PRIMARY KEY,
    asset_id INT NOT NULL REFERENCES assets(id),
    from_employee_id INT NOT NULL REFERENCES employees(id),
    to_employee_id INT NOT NULL REFERENCES employees(id),
    status VARCHAR(20) NOT NULL DEFAULT 'requested'
        CHECK (status IN ('requested','approved','rejected')),
    requested_at TIMESTAMP NOT NULL DEFAULT NOW(),
    approved_at TIMESTAMP
);

CREATE TABLE IF NOT EXISTS bookings (
    id SERIAL PRIMARY KEY,
    resource_asset_id INT NOT NULL REFERENCES assets(id),
    employee_id INT NOT NULL REFERENCES employees(id),
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'upcoming'
        CHECK (status IN ('upcoming','ongoing','completed','cancelled')),
    CHECK (end_time > start_time)
);

CREATE INDEX IF NOT EXISTS idx_bookings_resource_time ON bookings(resource_asset_id, start_time, end_time);

CREATE TABLE IF NOT EXISTS maintenance_requests (
    id SERIAL PRIMARY KEY,
    asset_id INT NOT NULL REFERENCES assets(id),
    raised_by INT NOT NULL REFERENCES employees(id),
    issue TEXT NOT NULL,
    priority VARCHAR(10) NOT NULL DEFAULT 'medium' CHECK (priority IN ('low','medium','high')),
    status VARCHAR(20) NOT NULL DEFAULT 'pending'
        CHECK (status IN ('pending','approved','rejected','in_progress','resolved')),
    approved_by INT REFERENCES employees(id),
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    resolved_at TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_maintenance_asset ON maintenance_requests(asset_id);
CREATE INDEX IF NOT EXISTS idx_maintenance_status ON maintenance_requests(status);

CREATE TABLE IF NOT EXISTS notifications (
    id SERIAL PRIMARY KEY,
    employee_id INT NOT NULL REFERENCES employees(id),
    message TEXT NOT NULL,
    type VARCHAR(50) NOT NULL,
    is_read BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_notifications_employee_unread ON notifications(employee_id) WHERE is_read = false;
