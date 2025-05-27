// API service for MAGEN application
// This file provides functions to interact with the backend API

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

// MOCK DATA MODE (set to true to use mock data)
const USE_MOCK = false;

// Mock data
const mockBreaches = [
  {
    id: '1',
    source: 'HaveIBeenPwned',
    date_detected: '2024-05-01',
    description: 'Email found in public breach database.'
  },
  {
    id: '2',
    source: 'DarkWeb Forum',
    date_detected: '2024-04-15',
    description: 'Password found on dark web.'
  }
];
const mockAlerts = [
  {
    id: 'a1',
    message: 'New breach detected for your email!',
    date: '2024-05-10',
    status: 'unread'
  },
  {
    id: 'a2',
    message: 'Password found in a recent leak.',
    date: '2024-04-20',
    status: 'read'
  }
];
const mockStats = {
  totalBreaches: 2,
  breachesChange: 1,
  activeAlerts: 1,
  alertsChange: 1,
  riskScore: 72,
  riskScoreLabel: 'Moderate',
  resolvedBreaches: 1,
  resolvedChange: 1,
  lastBreach: '2024-05-01',
  monthlyBreaches: [
    { month: '2024-03', count: 0 },
    { month: '2024-04', count: 1 },
    { month: '2024-05', count: 2 },
  ],
};
const mockChart = {
  dates: ['2024-04-01', '2024-04-15', '2024-05-01'],
  breachCounts: [0, 1, 2]
};

// Helper function for making authenticated API requests
async function fetchWithAuth(endpoint: string, options: RequestInit = {}) {
  // Get the JWT token from localStorage
  const token = typeof window !== "undefined" ? localStorage.getItem("magen_token") : null;
  console.log("Token used for API request:", token); // Debugging token retrieval

  if (token) {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      console.log("Token expiration time (exp):", payload.exp);
      console.log("Current time:", Math.floor(Date.now() / 1000));
    } catch (e) {
      console.error("Failed to decode token payload:", e);
    }
  }

  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `API error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("API request failed:", error);
    throw error;
  }
}

// Registration (call backend directly)
export async function registerUser({ name, email, password }: { name: string; email: string; password: string }) {
  const res = await fetch(`${API_BASE_URL}/api/auth/register`, { // Ensure correct endpoint
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Registration failed");
  return data;
}

// Login (call backend directly)
export async function loginUser({ email, password }: { email: string; password: string }) {
  const res = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Login failed");
  return data;
}

export async function logout() {
  localStorage.removeItem("magen_token")
}

// User data
export async function getUserProfile() {
  return fetchWithAuth("/api/users/profile")
}

export async function updateUserProfile(userData: any) {
  return fetchWithAuth("/api/users/profile", {
    method: "PUT",
    body: JSON.stringify(userData),
  })
}

// Breaches
export async function getBreaches() {
  if (USE_MOCK) {
    // Add status and affectedData to mock breaches for UI compatibility
    return Promise.resolve(
      mockBreaches.map((b, i) => ({
        ...b,
        status: i === 0 ? "New" : "Resolved",
        affectedData: ["Email", "Password"],
        date: b.date_detected,
      }))
    );
  }
  const responseData = await fetchWithAuth("/api/breaches");
  console.log("Response from /api/breaches:", responseData); // Debugging response data
  return responseData;
}

export async function getBreachById(id: string) {
  return fetchWithAuth(`/api/breaches/${id}`)
}

export async function markBreachAsResolved(id: string) {
  return fetchWithAuth(`/api/breaches/${id}/resolve`, {
    method: "PUT",
  })
}

export async function getBreachStats() {
  if (USE_MOCK) return Promise.resolve(mockStats);
  return fetchWithAuth("/api/breaches/stats");
}

// Alerts
export async function getAlerts() {
  if (USE_MOCK) return Promise.resolve(mockAlerts);
  return fetchWithAuth("/api/alerts");
}

export async function markAlertAsRead(id: string) {
  return fetchWithAuth(`/alerts/${id}/read`, {
    method: "PUT",
  })
}

// Onboarding
export async function saveOnboardingPreferences(preferences: any) {
  return fetchWithAuth("/user/onboarding", {
    method: "POST",
    body: JSON.stringify(preferences),
  })
}

// Chart
export async function getChart() {
  if (USE_MOCK) return Promise.resolve(mockStats.monthlyBreaches);
  // The backend endpoint is /api/breaches/stats, not /breaches/stats
  return fetchWithAuth("/api/breaches/stats");
}

// Scan Breaches
export async function scanBreaches(email: string) {
  return fetchWithAuth("/api/breaches/scan", {
    method: "POST",
    body: JSON.stringify({ email }),
  });
}

// Search Breaches by Email and User ID
export async function searchBreachesByEmail(userId: string, email: string) {
  if (USE_MOCK) {
    return Promise.resolve(mockBreaches);
  }
  return fetchWithAuth("/api/breaches/scan", {
    method: "POST",
    body: JSON.stringify({ userId, email }),
  });
}
