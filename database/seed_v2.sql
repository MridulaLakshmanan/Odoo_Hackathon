BEGIN;

TRUNCATE TABLE notifications, maintenance_requests, bookings, transfer_requests, allocations, assets, settings, locations, asset_categories, employees, departments RESTART IDENTITY CASCADE;

INSERT INTO departments (name, code, status) VALUES
('Information Technology', 'IT001', 'active'),
('Human Resources', 'HR001', 'active'),
('Finance', 'FIN001', 'active'),
('Operations', 'OPS001', 'active'),
('Engineering', 'ENG001', 'active'),
('Sales & Marketing', 'SLS001', 'active'),
('Customer Support', 'CS001', 'active');

INSERT INTO employees (name, email, password_hash, role, status, department_id) VALUES
('Aditya Verma', 'aditya.verma@technova.com', 'demo123hashed', 'admin', 'active', 1),
('Kavita Nair', 'kavita.nair@technova.com', 'demo123hashed', 'asset_manager', 'active', 1),
('Rahul Sharma', 'rahul.sharma@technova.com', 'demo123hashed', 'employee', 'active', 5),
('Priya Desai', 'priya.desai@technova.com', 'demo123hashed', 'department_head', 'active', 2),
('Vikram Singh', 'vikram.singh@technova.com', 'demo123hashed', 'employee', 'active', 5),
('Sneha Patel', 'sneha.patel@technova.com', 'demo123hashed', 'employee', 'active', 3),
('Amit Kumar', 'amit.kumar@technova.com', 'demo123hashed', 'employee', 'active', 6),
('Neha Gupta', 'neha.gupta@technova.com', 'demo123hashed', 'department_head', 'active', 6),
('Rajesh Joshi', 'rajesh.joshi@technova.com', 'demo123hashed', 'employee', 'active', 4),
('Anita Menon', 'anita.menon@technova.com', 'demo123hashed', 'employee', 'active', 7),
('Suresh Pillai', 'suresh.pillai@technova.com', 'demo123hashed', 'employee', 'active', 7),
('Ritu Agarwal', 'ritu.agarwal@technova.com', 'demo123hashed', 'department_head', 'active', 5),
('Siddharth Rao', 'siddharth.rao@technova.com', 'demo123hashed', 'employee', 'active', 5),
('Meenakshi Iyer', 'meenakshi.iyer@technova.com', 'demo123hashed', 'employee', 'active', 1),
('Karan Malhotra', 'karan.malhotra@technova.com', 'demo123hashed', 'employee', 'active', 6);

INSERT INTO asset_categories (name, description) VALUES
('Laptop', 'Work laptops for employees'),
('Monitor', 'External displays and monitors'),
('Mobile Device', 'Company issued smartphones and tablets'),
('Network Equipment', 'Routers, switches, and firewalls'),
('Office Furniture', 'Desks, chairs, and cabinets'),
('Vehicle', 'Company fleet vehicles'),
('Printer & Scanner', 'Office multi-function printers'),
('Audio/Visual', 'Projectors, conference cams, microphones');

INSERT INTO locations (name, address, type) VALUES
('Bengaluru Tech Hub', 'Electronic City, Bengaluru, Karnataka', 'Office'),
('Mumbai HQ', 'Bandra Kurla Complex, Mumbai, Maharashtra', 'Office'),
('Delhi NCR Branch', 'Cyber City, Gurugram, Haryana', 'Office'),
('Pune R&D Center', 'Hinjewadi, Pune, Maharashtra', 'Office'),
('Chennai Warehouse', 'Ambattur Industrial Estate, Chennai, Tamil Nadu', 'Warehouse');

INSERT INTO settings (org_name, timezone, currency) VALUES ('TechNova Solutions India', 'Asia/Kolkata', 'INR');

INSERT INTO assets (asset_tag, name, category_id, serial_number, purchase_date, cost, location_id, department_id, asset_condition, status, is_bookable, description) VALUES
('TN-LPT-001', 'Apple MacBook Pro M3 14"', 1, 'C02F314ABCD', '2025-01-15', 185000, 1, 5, 'Excellent', 'Allocated', FALSE, 'Standard engineering laptop'),
('TN-LPT-002', 'Apple MacBook Pro M3 14"', 1, 'C02F314ABCE', '2025-01-15', 185000, 1, 5, 'Excellent', 'Allocated', FALSE, 'Standard engineering laptop'),
('TN-LPT-003', 'Lenovo ThinkPad X1 Carbon Gen 11', 1, 'PF3J9XYZ', '2024-11-10', 145000, 2, 6, 'Good', 'Allocated', FALSE, 'Sales team laptop'),
('TN-LPT-004', 'Lenovo ThinkPad X1 Carbon Gen 11', 1, 'PF3J9XYA', '2024-11-10', 145000, 2, 1, 'Good', 'Allocated', FALSE, 'IT admin laptop'),
('TN-LPT-005', 'Dell Latitude 7440', 1, 'DL7440001', '2024-08-20', 110000, 3, 7, 'Good', 'Allocated', FALSE, 'Support team laptop'),
('TN-LPT-006', 'Dell Latitude 7440', 1, 'DL7440002', '2024-08-20', 110000, 3, 2, 'Average', 'Available', FALSE, 'Spare laptop'),
('TN-LPT-007', 'Apple MacBook Air M2', 1, 'MBA001', '2025-02-10', 95000, 1, 3, 'Excellent', 'Allocated', FALSE, 'Finance team laptop'),
('TN-MON-001', 'Dell UltraSharp 27" 4K Monitor', 2, 'DLUS274K01', '2024-12-05', 45000, 1, 5, 'Excellent', 'Allocated', FALSE, 'Engineering monitor'),
('TN-MON-002', 'Dell UltraSharp 27" 4K Monitor', 2, 'DLUS274K02', '2024-12-05', 45000, 1, 5, 'Excellent', 'Allocated', FALSE, 'Engineering monitor'),
('TN-MON-003', 'LG 34" Ultrawide Monitor', 2, 'LG34UW001', '2023-11-15', 55000, 2, 6, 'Good', 'Available', FALSE, 'Marketing monitor'),
('TN-MOB-001', 'Apple iPhone 15 Pro', 3, 'IP15P001', '2025-01-20', 135000, 2, 6, 'Excellent', 'Allocated', FALSE, 'Sales field phone'),
('TN-MOB-002', 'Samsung Galaxy S24 Ultra', 3, 'SGS24U001', '2025-03-01', 130000, 1, 1, 'Excellent', 'Available', FALSE, 'Testing device'),
('TN-NET-001', 'Cisco Meraki MS120-48 Switch', 4, 'CM120001', '2023-06-10', 250000, 1, 1, 'Good', 'Available', FALSE, 'Core office switch'),
('TN-NET-002', 'Fortinet FortiGate 80F Firewall', 4, 'FG80F001', '2024-02-28', 120000, 2, 1, 'Excellent', 'Under Maintenance', FALSE, 'Gateway firewall'),
('TN-FUR-001', 'Herman Miller Aeron Chair', 5, 'HMA001', '2023-09-15', 115000, 1, NULL, 'Good', 'Allocated', FALSE, 'Ergonomic office chair'),
('TN-FUR-002', 'Herman Miller Aeron Chair', 5, 'HMA002', '2023-09-15', 115000, 1, NULL, 'Good', 'Allocated', FALSE, 'Ergonomic office chair'),
('TN-FUR-003', 'Godrej Interio Conference Table', 5, 'GICT001', '2022-10-10', 85000, 2, NULL, 'Average', 'Available', FALSE, 'Boardroom table'),
('TN-VEH-001', 'Toyota Innova Crysta', 6, 'MH01AB1234', '2022-04-20', 2200000, 2, NULL, 'Good', 'Available', TRUE, 'Client transport vehicle'),
('TN-VEH-002', 'Tata Nexon EV', 6, 'KA53CD5678', '2024-01-10', 1650000, 1, NULL, 'Excellent', 'Reserved', TRUE, 'Pool car for meetings'),
('TN-PRN-001', 'HP Color LaserJet Enterprise M555dn', 7, 'HPM555001', '2023-11-20', 75000, 1, NULL, 'Good', 'Available', FALSE, 'Floor 1 central printer'),
('TN-PRN-002', 'Epson EcoTank L15150', 7, 'EPL15001', '2024-05-15', 55000, 2, NULL, 'Excellent', 'Available', FALSE, 'Admin block printer'),
('TN-AV-001', 'Sony VPL-PHZ51 Laser Projector', 8, 'SYVPL001', '2024-08-05', 180000, 1, NULL, 'Excellent', 'Available', TRUE, 'Main boardroom projector'),
('TN-AV-002', 'Logitech Rally Bar', 8, 'LOGIRB001', '2024-10-10', 310000, 2, NULL, 'Excellent', 'Available', TRUE, 'Video conferencing system');

INSERT INTO allocations (asset_id, employee_id, department_id, allocated_at, expected_return_date, status) VALUES
(1, 3, 5, '2025-01-20', '2028-01-20', 'active'),
(2, 5, 5, '2025-01-20', '2028-01-20', 'active'),
(3, 8, 6, '2024-11-15', '2027-11-15', 'active'),
(4, 1, 1, '2024-11-15', '2027-11-15', 'active'),
(5, 10, 7, '2024-08-25', '2027-08-25', 'active'),
(7, 6, 3, '2025-02-15', '2028-02-15', 'active'),
(8, 3, 5, '2024-12-10', '2029-12-10', 'active'),
(9, 5, 5, '2024-12-10', '2029-12-10', 'active'),
(11, 15, 6, '2025-01-25', '2027-01-25', 'active'),
(15, 3, 5, '2023-09-20', '2033-09-20', 'active'),
(16, 5, 5, '2023-09-20', '2033-09-20', 'active');

INSERT INTO maintenance_requests (asset_id, raised_by, approved_by, issue, priority, status, created_at, resolved_at) VALUES
(14, 1, 1, 'Firewall firmware upgrade failure causing intermittent drops', 'High', 'Pending', NOW() - INTERVAL '2 days', NULL),
(5, 10, 2, 'Keyboard keys sticking, needs replacement', 'Medium', 'Approved', NOW() - INTERVAL '5 days', NULL),
(20, 2, 1, 'Toner replacement required for cyan and magenta', 'Low', 'Resolved', NOW() - INTERVAL '15 days', NOW() - INTERVAL '14 days'),
(17, 9, 2, 'Table leg slightly unstable, requires tightening', 'Low', 'Pending', NOW() - INTERVAL '1 day', NULL);

INSERT INTO bookings (asset_id, employee_id, start_time, end_time, status) VALUES
(18, 8, NOW() + INTERVAL '1 day', NOW() + INTERVAL '1 day' + INTERVAL '4 hours', 'Upcoming'),
(19, 3, NOW() + INTERVAL '2 days', NOW() + INTERVAL '2 days' + INTERVAL '2 hours', 'Upcoming'),
(22, 12, NOW() + INTERVAL '1 day', NOW() + INTERVAL '1 day' + INTERVAL '3 hours', 'Upcoming'),
(23, 4, NOW() + INTERVAL '3 days', NOW() + INTERVAL '3 days' + INTERVAL '1 hour', 'Upcoming');

INSERT INTO transfer_requests (asset_id, from_employee_id, to_employee_id, status) VALUES
(11, 15, 8, 'Requested'),
(3, 8, 15, 'Approved');

INSERT INTO notifications (employee_id, message, notification_type) VALUES
(10, 'Your maintenance request for Dell Latitude 7440 has been approved.', 'Maintenance'),
(8, 'Your booking for Toyota Innova Crysta is confirmed.', 'Booking'),
(1, 'New maintenance request for Fortinet FortiGate 80F Firewall requires approval.', 'Maintenance'),
(15, 'A transfer request for Apple iPhone 15 Pro has been initiated.', 'Transfer');

COMMIT;
