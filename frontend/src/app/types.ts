export type AssetStatus = 'Available' | 'Allocated' | 'Maintenance' | 'Retired';
export type AssetCondition = 'New' | 'Good' | 'Fair' | 'Poor';
export type BookingStatus = 'Pending' | 'Approved' | 'Cancelled' | 'Completed';
export type MaintenanceStatus = 'Pending' | 'In Progress' | 'Completed' | 'Cancelled';
export type MaintenancePriority = 'Critical' | 'High' | 'Medium' | 'Low';
export type AllocationStatus = 'Active' | 'Returned' | 'Overdue';
export type NotificationType = 'info' | 'success' | 'warning' | 'error';

export type Page =
  | 'dashboard'
  | 'assets'
  | 'asset-details'
  | 'allocations'
  | 'bookings'
  | 'maintenance'
  | 'org-setup'
  | 'notifications'
  | 'reports'
  | 'settings';

export interface Department {
  id: string;
  name: string;
  headCount: number;
  manager: string;
}

export interface Employee {
  id: string;
  name: string;
  email: string;
  departmentId: string;
  role: string;
  avatar?: string;
}

export interface AssetCategory {
  id: string;
  name: string;
  description: string;
  assetCount: number;
}

export interface Location {
  id: string;
  name: string;
  address: string;
  type: string;
}

export interface Asset {
  id: string;
  name: string;
  assetTag: string;
  categoryId: string;
  serialNumber: string;
  locationId: string;
  departmentId: string;
  status: AssetStatus;
  condition: AssetCondition;
  purchaseDate: string;
  purchaseValue: number;
  warrantyExpiry: string;
  notes?: string;
  assignedToId?: string;
}

export interface Allocation {
  id: string;
  assetId: string;
  employeeId: string;
  fromDate: string;
  toDate?: string;
  status: AllocationStatus;
  notes?: string;
  allocatedBy: string;
}

export interface Booking {
  id: string;
  assetId: string;
  employeeId: string;
  fromDate: string;
  toDate: string;
  status: BookingStatus;
  purpose: string;
  approvedBy?: string;
}

export interface MaintenanceRequest {
  id: string;
  assetId: string;
  title: string;
  description: string;
  priority: MaintenancePriority;
  status: MaintenanceStatus;
  reportedBy: string;
  assignedTech?: string;
  reportedDate: string;
  completedDate?: string;
  cost?: number;
}

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  actionPage?: Page;
}

export interface AppState {
  isLoggedIn: boolean;
  currentPage: Page;
  selectedAssetId: string | null;
  sidebarCollapsed: boolean;
  assets: Asset[];
  employees: Employee[];
  departments: Department[];
  categories: AssetCategory[];
  locations: Location[];
  allocations: Allocation[];
  bookings: Booking[];
  maintenanceRequests: MaintenanceRequest[];
  notifications: Notification[];
}
