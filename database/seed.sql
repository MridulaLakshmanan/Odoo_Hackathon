-- ==========================================================
-- AssetFlow Database Seed Data
-- Odoo Hackathon
-- PostgreSQL 17
-- ==========================================================

BEGIN;

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

COMMIT;