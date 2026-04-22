// ─── API Configuration ────────────────────────────────────────────────────────
// All base URLs and endpoint paths are managed here.
// To change the backend URL, update BASE_URL only.

// Switch between local and production backend:
// LOCAL:      'http://192.168.x.x:8080/api'  ← your PC's local IP (for physical device)
// LOCAL SIM:  'http://10.0.2.2:8080/api'     ← Android emulator
export const BASE_URL = 'http://10.224.220.44:8080/api'; // ← Updated with your PC's actual IPv4 Address
export const ENDPOINTS = {
  auth: {
    sendOtp:    `${BASE_URL}/auth/send-otp`,
    verifyOtp:  `${BASE_URL}/auth/verify-otp`,
    register:   `${BASE_URL}/auth/register`,
    login:      `${BASE_URL}/auth/login`,
    me:         `${BASE_URL}/auth/me`,
  },

  // Sales
  sales: {
    list:   `${BASE_URL}/sales`,
    create: `${BASE_URL}/sales/create`,
    detail: (id: string) => `${BASE_URL}/sales/${id}`,
  },

  // Inventory
  inventory: {
    list:   `${BASE_URL}/inventory`,
    create: `${BASE_URL}/inventory/create`,
    update: (id: string) => `${BASE_URL}/inventory/${id}`,
    delete: (id: string) => `${BASE_URL}/inventory/${id}`,
  },

  // Customers
  customers: {
    list:   `${BASE_URL}/customers`,
    create: `${BASE_URL}/customers/create`,
    detail: (id: string) => `${BASE_URL}/customers/${id}`,
  },
} as const;
