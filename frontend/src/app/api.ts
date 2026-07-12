const API_URL = 'http://localhost:8000/api';

function toCamelCase(str: string): string {
  return str.replace(/([-_][a-z])/ig, ($1) => {
    return $1.toUpperCase()
      .replace('-', '')
      .replace('_', '');
  });
}

function convertKeysToCamelCase(obj: any): any {
  if (Array.isArray(obj)) {
    return obj.map(v => convertKeysToCamelCase(v));
  } else if (obj !== null && obj.constructor === Object) {
    return Object.keys(obj).reduce(
      (result, key) => ({
        ...result,
        [toCamelCase(key)]: convertKeysToCamelCase(obj[key]),
      }),
      {},
    );
  }
  return obj;
}

function convertKeysToSnakeCase(obj: any): any {
  if (Array.isArray(obj)) {
    return obj.map(v => convertKeysToSnakeCase(v));
  } else if (obj !== null && obj.constructor === Object) {
    return Object.keys(obj).reduce(
      (result, key) => {
        const snakeKey = key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
        return {
          ...result,
          [snakeKey]: convertKeysToSnakeCase(obj[key]),
        };
      },
      {},
    );
  }
  return obj;
}


export async function fetchFromAPI(endpoint: string, options: RequestInit = {}) {
  const url = `${API_URL}${endpoint}`;
  
  if (options.body && typeof options.body === 'string') {
    const parsed = JSON.parse(options.body);
    options.body = JSON.stringify(convertKeysToSnakeCase(parsed));
  }
  
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`API error: ${response.status} - ${errorText}`);
  }

  // Handle 204 No Content
  if (response.status === 204) {
    return null;
  }

  const json = await response.json();
  const camelJson = convertKeysToCamelCase(json);
  
  if (camelJson && typeof camelJson === 'object' && 'data' in camelJson) {
    return camelJson.data;
  }
  return camelJson;
}

export const api = {
  getAssets: () => fetchFromAPI('/assets'),
  createAsset: (data: any) => fetchFromAPI('/assets', { method: 'POST', body: JSON.stringify(data) }),
  updateAsset: (id: number | string, data: any) => fetchFromAPI(`/assets/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteAsset: (id: number | string) => fetchFromAPI(`/assets/${id}`, { method: 'DELETE' }),

  getEmployees: () => fetchFromAPI('/employees'),
  getDepartments: () => fetchFromAPI('/departments'),
  getCategories: () => fetchFromAPI('/categories'),
  
  getLocations: () => fetchFromAPI('/locations'),
  createLocation: (data: any) => fetchFromAPI('/locations', { method: 'POST', body: JSON.stringify(data) }),
  
  getAllocations: () => fetchFromAPI('/allocations'),
  createAllocation: (data: any) => fetchFromAPI('/allocations', { method: 'POST', body: JSON.stringify(data) }),
  updateAllocation: (id: number | string, data: any) => fetchFromAPI(`/allocations/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  
  getBookings: () => fetchFromAPI('/bookings'),
  createBooking: (data: any) => fetchFromAPI('/bookings', { method: 'POST', body: JSON.stringify(data) }),
  updateBooking: (id: number | string, data: any) => fetchFromAPI(`/bookings/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  
  getMaintenanceRequests: () => fetchFromAPI('/maintenance'),
  createMaintenanceRequest: (data: any) => fetchFromAPI('/maintenance', { method: 'POST', body: JSON.stringify(data) }),
  updateMaintenanceRequest: (id: number | string, data: any) => fetchFromAPI(`/maintenance/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  
  getNotifications: () => fetchFromAPI('/notifications'),
  updateNotification: (id: number | string, data: any) => fetchFromAPI(`/notifications/${id}/read`, { method: 'PATCH' }),
  
  getSettings: () => fetchFromAPI('/settings'),
  updateSettings: (data: any) => fetchFromAPI('/settings', { method: 'PUT', body: JSON.stringify(data) }),
};
