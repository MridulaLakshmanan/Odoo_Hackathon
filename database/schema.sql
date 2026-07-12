-- ==========================================================
-- AssetFlow Database Schema
-- Odoo Hackathon
-- Database: MySQL 8.0
-- ==========================================================
DROP DATABASE IF EXISTS assetflow_db;

CREATE DATABASE assetflow_db;

USE assetflow_db;

CREATE TABLE departments (

    id INT AUTO_INCREMENT PRIMARY KEY,

    name VARCHAR(100) NOT NULL,

    code VARCHAR(20) UNIQUE,

    status ENUM('active','inactive')
    DEFAULT 'active'

);

CREATE TABLE employees (

    id INT AUTO_INCREMENT PRIMARY KEY,

    name VARCHAR(100) NOT NULL,

    email VARCHAR(100) UNIQUE NOT NULL,

    password_hash VARCHAR(255) NOT NULL,

    role ENUM(
        'admin',
        'asset_manager',
        'department_head',
        'employee'
    ) DEFAULT 'employee',

    status ENUM(
        'active',
        'inactive'
    ) DEFAULT 'active',

    department_id INT,

    FOREIGN KEY (department_id)
        REFERENCES departments(id)

);

CREATE TABLE asset_categories (

    id INT AUTO_INCREMENT PRIMARY KEY,

    name VARCHAR(100) UNIQUE NOT NULL,

    description TEXT

);

CREATE TABLE assets (

    id INT AUTO_INCREMENT PRIMARY KEY,

    asset_tag VARCHAR(20) UNIQUE NOT NULL,

    name VARCHAR(100) NOT NULL,

    category_id INT NOT NULL,

    serial_number VARCHAR(100) UNIQUE,

    purchase_date DATE,

    cost DECIMAL(10,2),

    location VARCHAR(100),

    asset_condition ENUM(
        'Excellent',
        'Good',
        'Average',
        'Damaged'
    ) DEFAULT 'Good',

    status ENUM(
        'Available',
        'Allocated',
        'Reserved',
        'Under Maintenance',
        'Lost',
        'Retired',
        'Disposed'
    ) DEFAULT 'Available',

    is_bookable BOOLEAN DEFAULT FALSE,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (category_id)
        REFERENCES asset_categories(id)

);

CREATE TABLE allocations (

    id INT AUTO_INCREMENT PRIMARY KEY,

    asset_id INT NOT NULL,

    employee_id INT NOT NULL,

    department_id INT,

    allocated_at DATETIME DEFAULT CURRENT_TIMESTAMP,

    expected_return_date DATE,

    returned_at DATETIME NULL,

    status ENUM(
        'active',
        'returned'
    ) DEFAULT 'active',

    FOREIGN KEY (asset_id)
        REFERENCES assets(id),

    FOREIGN KEY (employee_id)
        REFERENCES employees(id),

    FOREIGN KEY (department_id)
        REFERENCES departments(id)

);

CREATE TABLE transfer_requests (

    id INT AUTO_INCREMENT PRIMARY KEY,

    asset_id INT NOT NULL,

    from_employee_id INT NOT NULL,

    to_employee_id INT NOT NULL,

    status ENUM(
        'Requested',
        'Approved',
        'Rejected'
    ) DEFAULT 'Requested',

    request_date DATETIME DEFAULT CURRENT_TIMESTAMP,

    approval_date DATETIME NULL,

    FOREIGN KEY (asset_id)
        REFERENCES assets(id),

    FOREIGN KEY (from_employee_id)
        REFERENCES employees(id),

    FOREIGN KEY (to_employee_id)
        REFERENCES employees(id)

);

CREATE TABLE bookings (

    id INT AUTO_INCREMENT PRIMARY KEY,

    asset_id INT NOT NULL,

    employee_id INT NOT NULL,

    start_time DATETIME NOT NULL,

    end_time DATETIME NOT NULL,

    status ENUM(
        'Upcoming',
        'Ongoing',
        'Completed',
        'Cancelled'
    ) DEFAULT 'Upcoming',

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (asset_id)
        REFERENCES assets(id),

    FOREIGN KEY (employee_id)
        REFERENCES employees(id)

);


CREATE TABLE maintenance_requests (

    id INT AUTO_INCREMENT PRIMARY KEY,

    asset_id INT NOT NULL,

    raised_by INT NOT NULL,

    approved_by INT NULL,

    issue TEXT NOT NULL,

    priority ENUM(
        'Low',
        'Medium',
        'High'
    ) DEFAULT 'Medium',

    status ENUM(
        'Pending',
        'Approved',
        'Rejected',
        'In Progress',
        'Resolved'
    ) DEFAULT 'Pending',

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    resolved_at DATETIME NULL,

    FOREIGN KEY (asset_id)
        REFERENCES assets(id),

    FOREIGN KEY (raised_by)
        REFERENCES employees(id),

    FOREIGN KEY (approved_by)
        REFERENCES employees(id)

);


CREATE TABLE notifications (

    id INT AUTO_INCREMENT PRIMARY KEY,

    employee_id INT NOT NULL,

    message TEXT NOT NULL,

    notification_type ENUM(
        'Allocation',
        'Transfer',
        'Booking',
        'Maintenance',
        'Reminder'
    ) NOT NULL,

    is_read BOOLEAN DEFAULT FALSE,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (employee_id)
        REFERENCES employees(id)

);
