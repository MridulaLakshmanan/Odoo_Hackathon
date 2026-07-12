import React, { createContext, useContext, useState, useCallback } from 'react';
import type { AppState, Page, Asset, Allocation, Booking, MaintenanceRequest, Notification as AppNotification, Employee, Department, AssetCategory, Location } from './types';
import {
  assets as initAssets,
  employees as initEmployees,
  departments as initDepartments,
  categories as initCategories,
  locations as initLocations,
  allocations as initAllocations,
  bookings as initBookings,
  maintenanceRequests as initMaintenance,
  notifications as initNotifications,
} from './mockData';

interface AppContextType extends AppState {
  navigate: (page: Page, assetId?: string) => void;
  login: () => void;
  logout: () => void;
  toggleSidebar: () => void;
  addAsset: (asset: Asset) => void;
  updateAsset: (asset: Asset) => void;
  deleteAsset: (id: string) => void;
  addAllocation: (alloc: Allocation) => void;
  addBooking: (booking: Booking) => void;
  updateBooking: (booking: Booking) => void;
  addMaintenance: (req: MaintenanceRequest) => void;
  updateMaintenance: (req: MaintenanceRequest) => void;
  addEmployee: (emp: Employee) => void;
  updateEmployee: (emp: Employee) => void;
  deleteEmployee: (id: string) => void;
  addDepartment: (dept: Department) => void;
  addCategory: (cat: AssetCategory) => void;
  addLocation: (loc: Location) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  addNotification: (notif: AppNotification) => void;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');
  const [selectedAssetId, setSelectedAssetId] = useState<string | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [assets, setAssets] = useState<Asset[]>(initAssets);
  const [employees, setEmpList] = useState<Employee[]>(initEmployees);
  const [departments, setDeptList] = useState<Department[]>(initDepartments);
  const [categories, setCatList] = useState<AssetCategory[]>(initCategories);
  const [locations, setLocList] = useState<Location[]>(initLocations);
  const [allocations, setAllocations] = useState<Allocation[]>(initAllocations);
  const [bookings, setBookings] = useState<Booking[]>(initBookings);
  const [maintenanceRequests, setMaintenanceRequests] = useState<MaintenanceRequest[]>(initMaintenance);
  const [notifications, setNotifications] = useState<AppNotification[]>(initNotifications);

  const navigate = useCallback((page: Page, assetId?: string) => {
    setCurrentPage(page);
    if (assetId) setSelectedAssetId(assetId);
  }, []);

  const login = useCallback(() => setIsLoggedIn(true), []);
  const logout = useCallback(() => { setIsLoggedIn(false); setCurrentPage('dashboard'); }, []);
  const toggleSidebar = useCallback(() => setSidebarCollapsed(p => !p), []);

  const addAsset = useCallback((asset: Asset) => setAssets(p => [asset, ...p]), []);
  const updateAsset = useCallback((asset: Asset) => setAssets(p => p.map(a => a.id === asset.id ? asset : a)), []);
  const deleteAsset = useCallback((id: string) => setAssets(p => p.filter(a => a.id !== id)), []);

  const addAllocation = useCallback((alloc: Allocation) => {
    setAllocations(p => [alloc, ...p]);
    setAssets(p => p.map(a => a.id === alloc.assetId ? { ...a, status: 'Allocated', assignedToId: alloc.employeeId } : a));
  }, []);

  const addBooking = useCallback((booking: Booking) => setBookings(p => [booking, ...p]), []);
  const updateBooking = useCallback((booking: Booking) => setBookings(p => p.map(b => b.id === booking.id ? booking : b)), []);

  const addMaintenance = useCallback((req: MaintenanceRequest) => {
    setMaintenanceRequests(p => [req, ...p]);
    setAssets(p => p.map(a => a.id === req.assetId ? { ...a, status: 'Maintenance' } : a));
  }, []);
  const updateMaintenance = useCallback((req: MaintenanceRequest) => setMaintenanceRequests(p => p.map(m => m.id === req.id ? req : m)), []);

  const addEmployee = useCallback((emp: Employee) => setEmpList(p => [emp, ...p]), []);
  const updateEmployee = useCallback((emp: Employee) => setEmpList(p => p.map(e => e.id === emp.id ? emp : e)), []);
  const deleteEmployee = useCallback((id: string) => setEmpList(p => p.filter(e => e.id !== id)), []);
  const addDepartment = useCallback((dept: Department) => setDeptList(p => [dept, ...p]), []);
  const addCategory = useCallback((cat: AssetCategory) => setCatList(p => [cat, ...p]), []);
  const addLocation = useCallback((loc: Location) => setLocList(p => [loc, ...p]), []);

  const markNotificationRead = useCallback((id: string) => setNotifications(p => p.map(n => n.id === id ? { ...n, read: true } : n)), []);
  const markAllNotificationsRead = useCallback(() => setNotifications(p => p.map(n => ({ ...n, read: true }))), []);
  const addNotification = useCallback((notif: AppNotification) => setNotifications(p => [notif, ...p]), []);

  return (
    <AppContext.Provider value={{
      isLoggedIn, currentPage, selectedAssetId, sidebarCollapsed,
      assets, employees, departments, categories, locations,
      allocations, bookings, maintenanceRequests, notifications,
      navigate, login, logout, toggleSidebar,
      addAsset, updateAsset, deleteAsset,
      addAllocation, addBooking, updateBooking,
      addMaintenance, updateMaintenance,
      addEmployee, updateEmployee, deleteEmployee,
      addDepartment, addCategory, addLocation,
      markNotificationRead, markAllNotificationsRead, addNotification,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
