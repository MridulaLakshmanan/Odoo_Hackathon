import type {
  Asset, Employee, Department, AssetCategory, Location,
  Allocation, Booking, MaintenanceRequest, Notification
} from './types';

export const departments: Department[] = [
  { id: 'd1', name: 'Engineering', headCount: 42, manager: 'Sarah Chen' },
  { id: 'd2', name: 'Marketing', headCount: 18, manager: 'James Okafor' },
  { id: 'd3', name: 'Finance', headCount: 12, manager: 'Linda Park' },
  { id: 'd4', name: 'Human Resources', headCount: 8, manager: 'Michael Torres' },
  { id: 'd5', name: 'Operations', headCount: 25, manager: 'Priya Nair' },
  { id: 'd6', name: 'Sales', headCount: 30, manager: 'David Walsh' },
];

export const employees: Employee[] = [
  { id: 'e1', name: 'Sarah Chen', email: 'sarah.chen@assetflow.io', departmentId: 'd1', role: 'Engineering Manager' },
  { id: 'e2', name: 'James Okafor', email: 'james.okafor@assetflow.io', departmentId: 'd2', role: 'Marketing Director' },
  { id: 'e3', name: 'Linda Park', email: 'linda.park@assetflow.io', departmentId: 'd3', role: 'CFO' },
  { id: 'e4', name: 'Michael Torres', email: 'michael.torres@assetflow.io', departmentId: 'd4', role: 'HR Manager' },
  { id: 'e5', name: 'Priya Nair', email: 'priya.nair@assetflow.io', departmentId: 'd5', role: 'Operations Lead' },
  { id: 'e6', name: 'David Walsh', email: 'david.walsh@assetflow.io', departmentId: 'd6', role: 'Sales Director' },
  { id: 'e7', name: 'Emily Zhang', email: 'emily.zhang@assetflow.io', departmentId: 'd1', role: 'Senior Developer' },
  { id: 'e8', name: 'Carlos Rivera', email: 'carlos.rivera@assetflow.io', departmentId: 'd5', role: 'System Administrator' },
  { id: 'e9', name: 'Aisha Patel', email: 'aisha.patel@assetflow.io', departmentId: 'd2', role: 'Brand Designer' },
  { id: 'e10', name: 'Tom Henderson', email: 'tom.henderson@assetflow.io', departmentId: 'd6', role: 'Account Executive' },
];

export const categories: AssetCategory[] = [
  { id: 'c1', name: 'Laptops', description: 'Portable computing devices', assetCount: 45 },
  { id: 'c2', name: 'Monitors', description: 'Display screens and monitors', assetCount: 60 },
  { id: 'c3', name: 'Mobile Devices', description: 'Phones and tablets', assetCount: 38 },
  { id: 'c4', name: 'Networking', description: 'Routers, switches, and cables', assetCount: 22 },
  { id: 'c5', name: 'Peripherals', description: 'Keyboards, mice, and accessories', assetCount: 85 },
  { id: 'c6', name: 'Servers', description: 'Server hardware and rack equipment', assetCount: 12 },
  { id: 'c7', name: 'Printers', description: 'Printing and scanning equipment', assetCount: 18 },
  { id: 'c8', name: 'Furniture', description: 'Office chairs, desks, and ergonomic equipment', assetCount: 110 },
];

export const locations: Location[] = [
  { id: 'l1', name: 'HQ - Floor 1', address: '100 Enterprise Blvd, Suite 100', type: 'Office' },
  { id: 'l2', name: 'HQ - Floor 2', address: '100 Enterprise Blvd, Suite 200', type: 'Office' },
  { id: 'l3', name: 'HQ - Floor 3', address: '100 Enterprise Blvd, Suite 300', type: 'Office' },
  { id: 'l4', name: 'Data Center', address: '200 Server Lane, DC-01', type: 'Data Center' },
  { id: 'l5', name: 'Warehouse', address: '300 Storage Ave, WH-A', type: 'Warehouse' },
  { id: 'l6', name: 'Remote - East', address: 'Remote Location', type: 'Remote' },
];

export const assets: Asset[] = [
  { id: 'a1', name: 'Dell Latitude 7440', assetTag: 'AST-0001', categoryId: 'c1', serialNumber: 'DL7440-001', locationId: 'l1', departmentId: 'd1', status: 'Allocated', condition: 'Good', purchaseDate: '2023-03-15', purchaseValue: 1299, warrantyExpiry: '2026-03-15', assignedToId: 'e7' },
  { id: 'a2', name: 'MacBook Pro 14"', assetTag: 'AST-0002', categoryId: 'c1', serialNumber: 'MBP14-X42', locationId: 'l1', departmentId: 'd1', status: 'Allocated', condition: 'New', purchaseDate: '2024-01-10', purchaseValue: 2199, warrantyExpiry: '2027-01-10', assignedToId: 'e1' },
  { id: 'a3', name: 'LG UltraWide 34"', assetTag: 'AST-0003', categoryId: 'c2', serialNumber: 'LG34UW-77', locationId: 'l2', departmentId: 'd2', status: 'Available', condition: 'Good', purchaseDate: '2022-11-20', purchaseValue: 649, warrantyExpiry: '2025-11-20' },
  { id: 'a4', name: 'HP EliteBook 840', assetTag: 'AST-0004', categoryId: 'c1', serialNumber: 'HP840-XQ9', locationId: 'l2', departmentId: 'd3', status: 'Maintenance', condition: 'Fair', purchaseDate: '2022-06-01', purchaseValue: 1099, warrantyExpiry: '2025-06-01' },
  { id: 'a5', name: 'iPhone 15 Pro', assetTag: 'AST-0005', categoryId: 'c3', serialNumber: 'IP15P-982', locationId: 'l1', departmentId: 'd6', status: 'Allocated', condition: 'New', purchaseDate: '2024-02-28', purchaseValue: 999, warrantyExpiry: '2026-02-28', assignedToId: 'e10' },
  { id: 'a6', name: 'Cisco Switch 24P', assetTag: 'AST-0006', categoryId: 'c4', serialNumber: 'CS24P-447', locationId: 'l4', departmentId: 'd5', status: 'Available', condition: 'Good', purchaseDate: '2021-09-15', purchaseValue: 2450, warrantyExpiry: '2024-09-15' },
  { id: 'a7', name: 'ThinkPad T14s', assetTag: 'AST-0007', categoryId: 'c1', serialNumber: 'TPT14-665', locationId: 'l3', departmentId: 'd4', status: 'Available', condition: 'Good', purchaseDate: '2023-07-22', purchaseValue: 1149, warrantyExpiry: '2026-07-22' },
  { id: 'a8', name: 'Dell 27" 4K Monitor', assetTag: 'AST-0008', categoryId: 'c2', serialNumber: 'DL27-4K55', locationId: 'l1', departmentId: 'd1', status: 'Allocated', condition: 'Good', purchaseDate: '2023-05-10', purchaseValue: 549, warrantyExpiry: '2026-05-10', assignedToId: 'e7' },
  { id: 'a9', name: 'Samsung Galaxy S24', assetTag: 'AST-0009', categoryId: 'c3', serialNumber: 'SGS24-221', locationId: 'l2', departmentId: 'd2', status: 'Available', condition: 'New', purchaseDate: '2024-03-01', purchaseValue: 799, warrantyExpiry: '2026-03-01' },
  { id: 'a10', name: 'HP LaserJet Pro', assetTag: 'AST-0010', categoryId: 'c7', serialNumber: 'HPLJ-338', locationId: 'l2', departmentId: 'd3', status: 'Available', condition: 'Fair', purchaseDate: '2021-12-01', purchaseValue: 399, warrantyExpiry: '2024-12-01' },
  { id: 'a11', name: 'Dell PowerEdge R750', assetTag: 'AST-0011', categoryId: 'c6', serialNumber: 'DPE750-09', locationId: 'l4', departmentId: 'd5', status: 'Available', condition: 'Good', purchaseDate: '2022-08-15', purchaseValue: 8499, warrantyExpiry: '2025-08-15' },
  { id: 'a12', name: 'Logitech MX Keys', assetTag: 'AST-0012', categoryId: 'c5', serialNumber: 'LMXK-774', locationId: 'l1', departmentId: 'd1', status: 'Available', condition: 'New', purchaseDate: '2024-01-20', purchaseValue: 119, warrantyExpiry: '2026-01-20' },
  { id: 'a13', name: 'MacBook Air M2', assetTag: 'AST-0013', categoryId: 'c1', serialNumber: 'MBAM2-X55', locationId: 'l3', departmentId: 'd2', status: 'Allocated', condition: 'New', purchaseDate: '2023-10-15', purchaseValue: 1299, warrantyExpiry: '2026-10-15', assignedToId: 'e9' },
  { id: 'a14', name: 'Surface Pro 9', assetTag: 'AST-0014', categoryId: 'c1', serialNumber: 'SFP9-123', locationId: 'l1', departmentId: 'd6', status: 'Retired', condition: 'Poor', purchaseDate: '2020-06-01', purchaseValue: 1599, warrantyExpiry: '2023-06-01' },
  { id: 'a15', name: 'Ergotron Standing Desk', assetTag: 'AST-0015', categoryId: 'c8', serialNumber: 'ESD-991', locationId: 'l2', departmentId: 'd1', status: 'Allocated', condition: 'Good', purchaseDate: '2022-03-10', purchaseValue: 599, warrantyExpiry: '2027-03-10', assignedToId: 'e8' },
];

export const allocations: Allocation[] = [
  { id: 'al1', assetId: 'a1', employeeId: 'e7', fromDate: '2024-01-15', status: 'Active', notes: 'Primary work laptop', allocatedBy: 'Carlos Rivera' },
  { id: 'al2', assetId: 'a2', employeeId: 'e1', fromDate: '2024-01-10', status: 'Active', allocatedBy: 'Carlos Rivera' },
  { id: 'al3', assetId: 'a5', employeeId: 'e10', fromDate: '2024-03-01', status: 'Active', notes: 'Client meetings', allocatedBy: 'Michael Torres' },
  { id: 'al4', assetId: 'a8', employeeId: 'e7', fromDate: '2023-05-10', status: 'Active', notes: 'Secondary monitor', allocatedBy: 'Carlos Rivera' },
  { id: 'al5', assetId: 'a13', employeeId: 'e9', fromDate: '2023-10-15', status: 'Active', allocatedBy: 'Michael Torres' },
  { id: 'al6', assetId: 'a15', employeeId: 'e8', fromDate: '2022-03-10', status: 'Active', allocatedBy: 'Priya Nair' },
  { id: 'al7', assetId: 'a3', employeeId: 'e2', fromDate: '2023-01-01', toDate: '2023-12-31', status: 'Returned', allocatedBy: 'Linda Park' },
  { id: 'al8', assetId: 'a12', employeeId: 'e3', fromDate: '2023-03-01', toDate: '2023-09-30', status: 'Returned', allocatedBy: 'Carlos Rivera' },
];

export const bookings: Booking[] = [
  { id: 'b1', assetId: 'a3', employeeId: 'e4', fromDate: '2026-07-20', toDate: '2026-07-25', status: 'Pending', purpose: 'Team presentation setup' },
  { id: 'b2', assetId: 'a9', employeeId: 'e5', fromDate: '2026-07-15', toDate: '2026-07-17', status: 'Approved', purpose: 'Field work documentation', approvedBy: 'Carlos Rivera' },
  { id: 'b3', assetId: 'a12', employeeId: 'e2', fromDate: '2026-07-22', toDate: '2026-07-24', status: 'Pending', purpose: 'Home office setup for offsite' },
  { id: 'b4', assetId: 'a7', employeeId: 'e6', fromDate: '2026-08-01', toDate: '2026-08-07', status: 'Approved', purpose: 'Client site visit', approvedBy: 'Michael Torres' },
  { id: 'b5', assetId: 'a10', employeeId: 'e1', fromDate: '2026-07-18', toDate: '2026-07-19', status: 'Cancelled', purpose: 'Offsite printing needs' },
  { id: 'b6', assetId: 'a3', employeeId: 'e9', fromDate: '2026-08-10', toDate: '2026-08-12', status: 'Pending', purpose: 'Design review session' },
];

export const maintenanceRequests: MaintenanceRequest[] = [
  { id: 'm1', assetId: 'a4', title: 'Battery replacement needed', description: 'Battery drains within 1 hour. Needs replacement urgently.', priority: 'High', status: 'In Progress', reportedBy: 'Linda Park', assignedTech: 'Carlos Rivera', reportedDate: '2026-07-01', cost: 120 },
  { id: 'm2', assetId: 'a1', title: 'Keyboard key stuck', description: 'The spacebar key is not registering presses consistently.', priority: 'Medium', status: 'Pending', reportedBy: 'Emily Zhang', reportedDate: '2026-07-08' },
  { id: 'm3', assetId: 'a6', title: 'Port not functioning', description: 'Port 14 on the switch shows no link activity.', priority: 'Critical', status: 'In Progress', reportedBy: 'Carlos Rivera', assignedTech: 'Carlos Rivera', reportedDate: '2026-07-05', cost: 0 },
  { id: 'm4', assetId: 'a11', title: 'Fan noise excessive', description: 'Server fan emitting loud grinding noise on startup.', priority: 'High', status: 'Pending', reportedBy: 'Priya Nair', reportedDate: '2026-07-10' },
  { id: 'm5', assetId: 'a10', title: 'Paper jam issue recurring', description: 'Printer jams every 3-4 prints. Rollers may need cleaning.', priority: 'Low', status: 'Completed', reportedBy: 'James Okafor', assignedTech: 'Carlos Rivera', reportedDate: '2026-06-20', completedDate: '2026-06-25', cost: 45 },
  { id: 'm6', assetId: 'a3', title: 'Screen flickering', description: 'Display occasionally flickers when connected via HDMI.', priority: 'Medium', status: 'Pending', reportedBy: 'Aisha Patel', reportedDate: '2026-07-11' },
];

export const notifications: Notification[] = [
  { id: 'n1', type: 'warning', title: 'Warranty Expiring Soon', message: 'Cisco Switch 24P (AST-0006) warranty expires in 30 days.', timestamp: '2026-07-12T09:00:00', read: false, actionPage: 'asset-details' },
  { id: 'n2', type: 'success', title: 'Allocation Completed', message: 'MacBook Pro 14" has been successfully allocated to Sarah Chen.', timestamp: '2026-07-12T08:45:00', read: false, actionPage: 'allocations' },
  { id: 'n3', type: 'error', title: 'Maintenance Overdue', message: 'HP EliteBook 840 maintenance request has been pending for 11 days.', timestamp: '2026-07-11T17:30:00', read: false, actionPage: 'maintenance' },
  { id: 'n4', type: 'info', title: 'Booking Request', message: 'Michael Torres requested LG UltraWide 34" from Jul 20–25.', timestamp: '2026-07-11T14:00:00', read: true, actionPage: 'bookings' },
  { id: 'n5', type: 'success', title: 'Return Processed', message: 'LG UltraWide 34" has been returned by James Okafor successfully.', timestamp: '2026-07-10T11:00:00', read: true, actionPage: 'allocations' },
  { id: 'n6', type: 'warning', title: 'Asset Overdue Return', message: 'iPhone 15 Pro allocated to Tom Henderson is past expected return.', timestamp: '2026-07-09T09:00:00', read: true, actionPage: 'allocations' },
  { id: 'n7', type: 'info', title: 'New Employee Onboarded', message: 'Aisha Patel has joined Marketing. Assets can now be allocated.', timestamp: '2026-07-08T10:30:00', read: true, actionPage: 'org-setup' },
];
