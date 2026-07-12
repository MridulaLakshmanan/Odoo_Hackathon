-- ==========================================================
-- AssetFlow Database Seed Data
-- Odoo Hackathon
-- PostgreSQL 17
-- ==========================================================

BEGIN;
TRUNCATE TABLE notifications, maintenance_requests, bookings, transfer_requests, allocations, assets, settings, locations, asset_categories, employees, departments RESTART IDENTITY CASCADE;


INSERT INTO departments (name, code, status)
VALUES
('Information Technology', 'IT001', 'active'),
('Human Resources', 'HR001', 'active'),
('Finance', 'FIN001', 'active'),
('Operations', 'OPS001', 'active');

INSERT INTO employees
(name, email, password_hash, role, status, department_id)
VALUES
('Admin User','admin@technova.com','demo123hashed','admin','active',1),
('Pooja Prabu','pooja@technova.com','demo123hashed','asset_manager','active',1),
('Ravi Kumar','ravi@technova.com','demo123hashed','employee','active',1),
('Priya Sharma','priya@technova.com','demo123hashed','employee','active',2),
('Sneha Reddy','sneha@technova.com','demo123hashed','department_head','active',2),
('Arjun Patel','arjun@technova.com','demo123hashed','employee','active',3),
('Rahul Verma','rahul@technova.com','demo123hashed','employee','active',3),
('Ananya Singh','ananya@technova.com','demo123hashed','employee','active',4),
('Karthik Raj','karthik@technova.com','demo123hashed','employee','active',4),
('Meera Iyer','meera@technova.com','demo123hashed','employee','active',1);

INSERT INTO asset_categories (name, description)
VALUES
('Laptop','Company laptops for employees'),
('Desktop','Office desktop computers'),
('Printer','Network and office printers'),
('Projector','Meeting room projectors'),
('Vehicle','Company vehicles'),
('Furniture','Office furniture');

INSERT INTO locations (name, address, type)
VALUES
('HQ - Floor 1', '100 Enterprise Blvd', 'Office'),
('HQ - Floor 2', '100 Enterprise Blvd', 'Office'),
('HQ - Floor 3', '100 Enterprise Blvd', 'Office'),
('Data Center', '200 Server Lane', 'Data Center'),
('Warehouse', '300 Storage Ave', 'Warehouse'),
('Remote - East', 'Remote Location', 'Remote');

INSERT INTO settings (org_name) VALUES ('Acme Corporation');

INSERT INTO assets
(asset_tag,name,category_id,serial_number,purchase_date,cost,location_id,asset_condition,status,is_bookable)
VALUES
('AF-0001','Dell Latitude 5440',1,'DL5440001','2025-01-10',75000,1,'Excellent','Allocated',FALSE),
('AF-0002','HP EliteBook 840',1,'HP840001','2025-02-05',72000,1,'Good','Available',FALSE),
('AF-0003','Lenovo ThinkPad E14',1,'LNE14001','2025-03-01',69000,2,'Excellent','Allocated',FALSE),
('AF-0004','Dell OptiPlex 7010',2,'DO701001','2024-11-20',55000,3,'Good','Available',FALSE),
('AF-0005','HP LaserJet M404',3,'HPL40401','2024-10-15',28000,1,'Good','Available',FALSE),
('AF-0006','Epson EcoTank L3250',3,'EPS325001','2025-01-15',22000,2,'Average','Under Maintenance',FALSE),
('AF-0007','Sony Projector VPL',4,'SONY001','2025-02-01',95000,1,'Excellent','Available',TRUE),
('AF-0008','Epson Projector EB-X49',4,'EPX49001','2024-09-11',68000,2,'Good','Reserved',TRUE),
('AF-0009','Toyota Innova',5,'CAR001','2023-06-20',1850000,5,'Excellent','Available',TRUE),
('AF-0010','Mahindra Scorpio',5,'CAR002','2023-08-18',1950000,5,'Good','Allocated',TRUE),
('AF-0011','Executive Chair',6,'CHR001','2024-05-14',8500,1,'Good','Available',FALSE),
('AF-0012','Conference Table',6,'TAB001','2024-05-14',25000,1,'Excellent','Available',FALSE),
('AF-0013','Dell Latitude 7420',1,'DL742001','2024-12-12',76000,3,'Excellent','Allocated',FALSE),
('AF-0014','HP ProBook',1,'HPPRO001','2025-02-22',71000,1,'Good','Available',FALSE),
('AF-0015','Canon Printer',3,'CAN001','2025-01-08',24000,3,'Good','Available',FALSE),
('AF-0016','Meeting Room Display',4,'DSP001','2024-07-15',89000,2,'Excellent','Available',TRUE),
('AF-0017','MacBook Air M2',1,'MBA001','2025-04-10',115000,1,'Excellent','Allocated',FALSE),
('AF-0018','Dell Monitor 27"',6,'MON001','2025-02-18',18000,2,'Excellent','Available',FALSE),
('AF-0019','Office Sofa',6,'SOFA001','2023-10-10',42000,1,'Good','Available',FALSE),
('AF-0020','Company Van',5,'VAN001','2022-03-14',1500000,5,'Good','Available',TRUE);
INSERT INTO allocations
(asset_id, employee_id, department_id, expected_return_date, status)
VALUES
(1,2,1,'2026-08-15','active'),
(3,3,1,'2026-08-20','active'),
(10,8,4,'2026-08-10','active'),
(13,6,3,'2026-08-18','active'),
(17,10,1,'2026-08-25','active');

INSERT INTO transfer_requests
(asset_id, from_employee_id, to_employee_id, status)
VALUES
(1,2,3,'Requested'),
(3,3,4,'Approved'),
(10,8,2,'Rejected');

INSERT INTO bookings
(asset_id, employee_id, start_time, end_time, status)
VALUES
(7,4,'2026-07-13 09:00:00','2026-07-13 10:00:00','Upcoming'),
(8,2,'2026-07-13 11:00:00','2026-07-13 12:00:00','Upcoming'),
(9,6,'2026-07-14 14:00:00','2026-07-14 16:00:00','Upcoming'),
(16,1,'2026-07-15 10:00:00','2026-07-15 11:00:00','Upcoming'),
(20,7,'2026-07-16 09:00:00','2026-07-16 17:00:00','Upcoming');

INSERT INTO maintenance_requests
(asset_id, raised_by, approved_by, issue, priority, status)
VALUES
(6,2,1,'Printer paper feed issue','Medium','Approved'),
(8,4,1,'Projector bulb replacement','High','Pending'),
(15,7,1,'Printer toner replacement','Low','Resolved');

INSERT INTO notifications
(employee_id, message, notification_type)
VALUES
(2,'Laptop AF-0001 allocated successfully.','Allocation'),
(3,'Transfer request submitted.','Transfer'),
(4,'Meeting room booking confirmed.','Booking'),
(6,'Maintenance request approved.','Maintenance'),
(7,'Asset return due in 2 days.','Reminder'),
(8,'Vehicle booking confirmed.','Booking'),
(9,'Transfer request rejected.','Transfer'),
(10,'Laptop allocated successfully.','Allocation'),
(1,'New maintenance request received.','Maintenance'),
(5,'Reminder: Asset return due tomorrow.','Reminder');




-- seed_v2 data
INSERT INTO departments (name, code, status) VALUES
('Information Technology V2', 'IT002', 'active'),
('Human Resources V2', 'HR002', 'active'),
('Finance V2', 'FIN002', 'active'),
('Operations V2', 'OPS002', 'active'),
('Engineering', 'ENG001', 'active'),
('Sales & Marketing', 'SLS001', 'active'),
('Customer Support', 'CS001', 'active');

INSERT INTO employees (name, email, password_hash, role, status, department_id) VALUES
('Aditya Verma', 'aditya.verma@technova.com', 'demo123hashed', 'admin', 'active', 5),
('Kavita Nair', 'kavita.nair@technova.com', 'demo123hashed', 'asset_manager', 'active', 5),
('Rahul Sharma', 'rahul.sharma@technova.com', 'demo123hashed', 'employee', 'active', 9),
('Priya Desai', 'priya.desai@technova.com', 'demo123hashed', 'department_head', 'active', 6),
('Vikram Singh', 'vikram.singh@technova.com', 'demo123hashed', 'employee', 'active', 9),
('Sneha Patel', 'sneha.patel@technova.com', 'demo123hashed', 'employee', 'active', 7),
('Amit Kumar', 'amit.kumar@technova.com', 'demo123hashed', 'employee', 'active', 10),
('Neha Gupta', 'neha.gupta@technova.com', 'demo123hashed', 'department_head', 'active', 10),
('Rajesh Joshi', 'rajesh.joshi@technova.com', 'demo123hashed', 'employee', 'active', 8),
('Anita Menon', 'anita.menon@technova.com', 'demo123hashed', 'employee', 'active', 11),
('Suresh Pillai', 'suresh.pillai@technova.com', 'demo123hashed', 'employee', 'active', 11),
('Ritu Agarwal', 'ritu.agarwal@technova.com', 'demo123hashed', 'department_head', 'active', 9),
('Siddharth Rao', 'siddharth.rao@technova.com', 'demo123hashed', 'employee', 'active', 9),
('Meenakshi Iyer', 'meenakshi.iyer@technova.com', 'demo123hashed', 'employee', 'active', 5),
('Karan Malhotra', 'karan.malhotra@technova.com', 'demo123hashed', 'employee', 'active', 10);

INSERT INTO asset_categories (name, description) VALUES
('Laptop V2', 'Work laptops for employees'),
('Monitor V2', 'External displays and monitors'),
('Mobile Device V2', 'Company issued smartphones and tablets'),
('Network Equipment V2', 'Routers, switches, and firewalls'),
('Office Furniture V2', 'Desks, chairs, and cabinets'),
('Vehicle V2', 'Company fleet vehicles'),
('Printer & Scanner V2', 'Office multi-function printers'),
('Audio/Visual V2', 'Projectors, conference cams, microphones');

INSERT INTO locations (name, address, type) VALUES
('Bengaluru Tech Hub', 'Electronic City, Bengaluru, Karnataka', 'Office'),
('Mumbai HQ', 'Bandra Kurla Complex, Mumbai, Maharashtra', 'Office'),
('Delhi NCR Branch', 'Cyber City, Gurugram, Haryana', 'Office'),
('Pune R&D Center', 'Hinjewadi, Pune, Maharashtra', 'Office'),
('Chennai Warehouse', 'Ambattur Industrial Estate, Chennai, Tamil Nadu', 'Warehouse');

INSERT INTO settings (org_name, timezone, currency) VALUES ('TechNova Solutions India', 'Asia/Kolkata', 'INR');

INSERT INTO assets (asset_tag, name, category_id, serial_number, purchase_date, cost, location_id, department_id, asset_condition, status, is_bookable, description) VALUES
('TN-LPT-001', 'Apple MacBook Pro M3 14"', 7, 'C02F314ABCD', '2025-01-15', 185000, 7, 9, 'Excellent', 'Allocated', FALSE, 'Standard engineering laptop'),
('TN-LPT-002', 'Apple MacBook Pro M3 14"', 7, 'C02F314ABCE', '2025-01-15', 185000, 7, 9, 'Excellent', 'Allocated', FALSE, 'Standard engineering laptop'),
('TN-LPT-003', 'Lenovo ThinkPad X1 Carbon Gen 11', 7, 'PF3J9XYZ', '2024-11-10', 145000, 8, 10, 'Good', 'Allocated', FALSE, 'Sales team laptop'),
('TN-LPT-004', 'Lenovo ThinkPad X1 Carbon Gen 11', 7, 'PF3J9XYA', '2024-11-10', 145000, 8, 5, 'Good', 'Allocated', FALSE, 'IT admin laptop'),
('TN-LPT-005', 'Dell Latitude 7440', 7, 'DL7440001', '2024-08-20', 110000, 9, 11, 'Good', 'Allocated', FALSE, 'Support team laptop'),
('TN-LPT-006', 'Dell Latitude 7440', 7, 'DL7440002', '2024-08-20', 110000, 9, 6, 'Average', 'Available', FALSE, 'Spare laptop'),
('TN-LPT-007', 'Apple MacBook Air M2', 7, 'MBA002', '2025-02-10', 95000, 7, 7, 'Excellent', 'Allocated', FALSE, 'Finance team laptop'),
('TN-MON-001', 'Dell UltraSharp 27" 4K Monitor', 8, 'DLUS274K01', '2024-12-05', 45000, 7, 9, 'Excellent', 'Allocated', FALSE, 'Engineering monitor'),
('TN-MON-002', 'Dell UltraSharp 27" 4K Monitor', 8, 'DLUS274K02', '2024-12-05', 45000, 7, 9, 'Excellent', 'Allocated', FALSE, 'Engineering monitor'),
('TN-MON-003', 'LG 34" Ultrawide Monitor', 8, 'LG34UW001', '2023-11-15', 55000, 8, 10, 'Good', 'Available', FALSE, 'Marketing monitor'),
('TN-MOB-001', 'Apple iPhone 15 Pro', 9, 'IP15P001', '2025-01-20', 135000, 8, 10, 'Excellent', 'Allocated', FALSE, 'Sales field phone'),
('TN-MOB-002', 'Samsung Galaxy S24 Ultra', 9, 'SGS24U001', '2025-03-01', 130000, 7, 5, 'Excellent', 'Available', FALSE, 'Testing device'),
('TN-NET-001', 'Cisco Meraki MS120-48 Switch', 10, 'CM120001', '2023-06-10', 250000, 7, 5, 'Good', 'Available', FALSE, 'Core office switch'),
('TN-NET-002', 'Fortinet FortiGate 80F Firewall', 10, 'FG80F001', '2024-02-28', 120000, 8, 5, 'Excellent', 'Under Maintenance', FALSE, 'Gateway firewall'),
('TN-FUR-001', 'Herman Miller Aeron Chair', 11, 'HMA001', '2023-09-15', 115000, 7, NULL, 'Good', 'Allocated', FALSE, 'Ergonomic office chair'),
('TN-FUR-002', 'Herman Miller Aeron Chair', 11, 'HMA002', '2023-09-15', 115000, 7, NULL, 'Good', 'Allocated', FALSE, 'Ergonomic office chair'),
('TN-FUR-003', 'Godrej Interio Conference Table', 11, 'GICT001', '2022-10-10', 85000, 8, NULL, 'Average', 'Available', FALSE, 'Boardroom table'),
('TN-VEH-001', 'Toyota Innova Crysta', 12, 'MH01AB1234', '2022-04-20', 2200000, 8, NULL, 'Good', 'Available', TRUE, 'Client transport vehicle'),
('TN-VEH-002', 'Tata Nexon EV', 12, 'KA53CD5678', '2024-01-10', 1650000, 7, NULL, 'Excellent', 'Reserved', TRUE, 'Pool car for meetings'),
('TN-PRN-001', 'HP Color LaserJet Enterprise M555dn', 13, 'HPM555001', '2023-11-20', 75000, 7, NULL, 'Good', 'Available', FALSE, 'Floor 1 central printer'),
('TN-PRN-002', 'Epson EcoTank L15150', 13, 'EPL15001', '2024-05-15', 55000, 8, NULL, 'Excellent', 'Available', FALSE, 'Admin block printer'),
('TN-AV-001', 'Sony VPL-PHZ51 Laser Projector', 14, 'SYVPL001', '2024-08-05', 180000, 7, NULL, 'Excellent', 'Available', TRUE, 'Main boardroom projector'),
('TN-AV-002', 'Logitech Rally Bar', 14, 'LOGIRB001', '2024-10-10', 310000, 8, NULL, 'Excellent', 'Available', TRUE, 'Video conferencing system');

INSERT INTO allocations (asset_id, employee_id, department_id, allocated_at, expected_return_date, status) VALUES
(21, 13, 9, '2025-01-20', '2028-01-20', 'active'),
(22, 15, 9, '2025-01-20', '2028-01-20', 'active'),
(23, 18, 10, '2024-11-15', '2027-11-15', 'active'),
(24, 11, 5, '2024-11-15', '2027-11-15', 'active'),
(25, 20, 11, '2024-08-25', '2027-08-25', 'active'),
(27, 16, 7, '2025-02-15', '2028-02-15', 'active'),
(28, 13, 9, '2024-12-10', '2029-12-10', 'active'),
(29, 15, 9, '2024-12-10', '2029-12-10', 'active'),
(31, 25, 10, '2025-01-25', '2027-01-25', 'active'),
(35, 13, 9, '2023-09-20', '2033-09-20', 'active'),
(36, 15, 9, '2023-09-20', '2033-09-20', 'active');

INSERT INTO maintenance_requests (asset_id, raised_by, approved_by, issue, priority, status, created_at, resolved_at) VALUES
(34, 11, 11, 'Firewall firmware upgrade failure causing intermittent drops', 'High', 'Pending', NOW() - INTERVAL '2 days', NULL),
(25, 20, 12, 'Keyboard keys sticking, needs replacement', 'Medium', 'Approved', NOW() - INTERVAL '5 days', NULL),
(40, 12, 11, 'Toner replacement required for cyan and magenta', 'Low', 'Resolved', NOW() - INTERVAL '15 days', NOW() - INTERVAL '14 days'),
(37, 19, 12, 'Table leg slightly unstable, requires tightening', 'Low', 'Pending', NOW() - INTERVAL '1 day', NULL);

INSERT INTO bookings (asset_id, employee_id, start_time, end_time, status) VALUES
(38, 18, NOW() + INTERVAL '1 day', NOW() + INTERVAL '1 day' + INTERVAL '4 hours', 'Upcoming'),
(39, 13, NOW() + INTERVAL '2 days', NOW() + INTERVAL '2 days' + INTERVAL '2 hours', 'Upcoming'),
(42, 22, NOW() + INTERVAL '1 day', NOW() + INTERVAL '1 day' + INTERVAL '3 hours', 'Upcoming'),
(43, 14, NOW() + INTERVAL '3 days', NOW() + INTERVAL '3 days' + INTERVAL '1 hour', 'Upcoming');

INSERT INTO transfer_requests (asset_id, from_employee_id, to_employee_id, status) VALUES
(31, 25, 18, 'Requested'),
(23, 18, 25, 'Approved');

INSERT INTO notifications (employee_id, message, notification_type) VALUES
(20, 'Your maintenance request for Dell Latitude 7440 has been approved.', 'Maintenance'),
(18, 'Your booking for Toyota Innova Crysta is confirmed.', 'Booking'),
(11, 'New maintenance request for Fortinet FortiGate 80F Firewall requires approval.', 'Maintenance'),
(25, 'A transfer request for Apple iPhone 15 Pro has been initiated.', 'Transfer');

COMMIT;
