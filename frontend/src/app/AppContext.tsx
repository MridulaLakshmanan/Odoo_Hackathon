import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import type { AppState, Page, Asset, Allocation, Booking, MaintenanceRequest, Notification as AppNotification, Employee, Department, AssetCategory, Location } from './types';
import { api } from './api';

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
  const [assets, setAssets] = useState<Asset[]>([]);
  const [employees, setEmpList] = useState<Employee[]>([]);
  const [departments, setDeptList] = useState<Department[]>([]);
  const [categories, setCatList] = useState<AssetCategory[]>([]);
  const [locations, setLocList] = useState<Location[]>([]);
  const [allocations, setAllocations] = useState<Allocation[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [maintenanceRequests, setMaintenanceRequests] = useState<MaintenanceRequest[]>([]);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          assetsData, employeesData, deptsData, catsData,
          locsData, allocsData, booksData, maintsData, notifsData
        ] = await Promise.all([
          api.getAssets(),
          api.getEmployees(),
          api.getDepartments(),
          api.getCategories(),
          api.getLocations(),
          api.getAllocations(),
          api.getBookings(),
          api.getMaintenanceRequests(),
          api.getNotifications()
        ]);
        
        // Map backend IDs to string IDs for frontend compatibility
        const mapId = (item: any) => ({ ...item, id: String(item.id) });
        const mapIds = (items: any[]) => items.map(mapId);

        setAssets(assetsData.map((a: any) => ({
          ...a, id: String(a.id),
          purchaseValue: a.cost ?? 0,
          purchaseDate: a.purchaseDate ?? '',
          condition: a.assetCondition ?? 'Good'
        })));
        setEmpList(mapIds(employeesData));
        setDeptList(mapIds(deptsData));
        setCatList(mapIds(catsData));
        setLocList(mapIds(locsData));
        setAllocations(allocsData.map((a: any) => ({
          ...a, id: String(a.id),
          assetId: String(a.assetId),
          employeeId: String(a.employeeId),
          departmentId: a.departmentId ? String(a.departmentId) : undefined,
          fromDate: a.allocatedAt,
          toDate: a.expectedReturnDate,
          status: String(a.status).charAt(0).toUpperCase() + String(a.status).slice(1),
          notes: a.conditionNotes
        })));
        setBookings(booksData.map((b: any) => ({
          ...b, id: String(b.id),
          assetId: String(b.assetId),
          employeeId: String(b.employeeId),
          fromDate: b.startTime,
          toDate: b.endTime
        })));
        setMaintenanceRequests(maintsData.map((m: any) => ({
          ...m, id: String(m.id),
          assetId: String(m.assetId),
          title: m.issue,
          reportedBy: String(m.raisedBy),
          reportedDate: m.createdAt,
          completedDate: m.resolvedAt
        })));
        setNotifications(mapIds(notifsData));
      } catch (err) {
        console.error("Failed to fetch initial data", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const navigate = useCallback((page: Page, assetId?: string) => {
    setCurrentPage(page);
    if (assetId) setSelectedAssetId(assetId);
  }, []);

  const login = useCallback(() => setIsLoggedIn(true), []);
  const logout = useCallback(() => { setIsLoggedIn(false); setCurrentPage('dashboard'); }, []);
  const toggleSidebar = useCallback(() => setSidebarCollapsed(p => !p), []);

  const addAsset = useCallback(async (asset: Asset) => {
    try {
      const created = await api.createAsset(asset);
      setAssets(p => [{...created, id: String(created.id)}, ...p]);
    } catch (e) { console.error(e); }
  }, []);
  const updateAsset = useCallback(async (asset: Asset) => {
    try {
      const updated = await api.updateAsset(asset.id, asset);
      setAssets(p => p.map(a => String(a.id) === String(asset.id) ? {...updated, id: String(updated.id)} : a));
    } catch (e) { console.error(e); }
  }, []);
  const deleteAsset = useCallback(async (id: string) => {
    try {
      await api.deleteAsset(id);
      setAssets(p => p.filter(a => String(a.id) !== id));
    } catch (e) { console.error(e); }
  }, []);

  const addAllocation = useCallback(async (alloc: Allocation) => {
    try {
      const created = await api.createAllocation(alloc);
      setAllocations(p => [{...created, id: String(created.id)}, ...p]);
      setAssets(p => p.map(a => String(a.id) === String(alloc.assetId) ? { ...a, status: 'Allocated', assignedToId: alloc.employeeId } : a));
    } catch (e) { console.error(e); }
  }, []);

  const addBooking = useCallback(async (booking: Booking) => {
    try {
      const created = await api.createBooking(booking);
      setBookings(p => [{...created, id: String(created.id)}, ...p]);
    } catch (e) { console.error(e); }
  }, []);
  const updateBooking = useCallback(async (booking: Booking) => {
    try {
      const updated = await api.updateBooking(booking.id, booking);
      setBookings(p => p.map(b => String(b.id) === String(booking.id) ? {...updated, id: String(updated.id)} : b));
    } catch (e) { console.error(e); }
  }, []);

  const addMaintenance = useCallback(async (req: MaintenanceRequest) => {
    try {
      const created = await api.createMaintenanceRequest(req);
      setMaintenanceRequests(p => [{...created, id: String(created.id)}, ...p]);
      setAssets(p => p.map(a => String(a.id) === String(req.assetId) ? { ...a, status: 'Maintenance' } : a));
    } catch (e) { console.error(e); }
  }, []);
  const updateMaintenance = useCallback(async (req: MaintenanceRequest) => {
    try {
      const updated = await api.updateMaintenanceRequest(req.id, req);
      setMaintenanceRequests(p => p.map(m => String(m.id) === String(req.id) ? {...updated, id: String(updated.id)} : m));
    } catch (e) { console.error(e); }
  }, []);

  const addEmployee = useCallback((emp: Employee) => setEmpList(p => [emp, ...p]), []);
  const updateEmployee = useCallback((emp: Employee) => setEmpList(p => p.map(e => e.id === emp.id ? emp : e)), []);
  const deleteEmployee = useCallback((id: string) => setEmpList(p => p.filter(e => e.id !== id)), []);
  const addDepartment = useCallback((dept: Department) => setDeptList(p => [dept, ...p]), []);
  const addCategory = useCallback((cat: AssetCategory) => setCatList(p => [cat, ...p]), []);
  
  const addLocation = useCallback(async (loc: Location) => {
    try {
      const created = await api.createLocation(loc);
      setLocList(p => [{...created, id: String(created.id)}, ...p]);
    } catch (e) { console.error(e); }
  }, []);

  const markNotificationRead = useCallback(async (id: string) => {
    try {
      await api.updateNotification(id, { read: true });
      setNotifications(p => p.map(n => String(n.id) === id ? { ...n, read: true } : n));
    } catch (e) { console.error(e); }
  }, []);
  const markAllNotificationsRead = useCallback(() => {
    notifications.forEach(n => markNotificationRead(n.id));
  }, [notifications, markNotificationRead]);
  const addNotification = useCallback((notif: AppNotification) => setNotifications(p => [notif, ...p]), []);

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent"></div>
          <p className="text-gray-500 font-medium">Loading AssetFlow...</p>
        </div>
      </div>
    );
  }

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
