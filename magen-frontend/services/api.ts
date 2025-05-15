// API service for MAGEN application
// This file provides functions to interact with the backend API

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api"

// Helper function for making authenticated API requests
async function fetchWithAuth(endpoint: string, options: RequestInit = {}) {
  // Get the JWT token from localStorage
  const token = typeof window !== "undefined" ? localStorage.getItem("magen_token") : null

  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.message || `API error: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error("API request failed:", error)
    throw error
  }
}

// Authentication
export async function login(email: string, password: string) {
  const response = await fetchWithAuth("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  })

  if (response.token) {
    localStorage.setItem("magen_token", response.token)
  }

  return response
}

export async function register(name: string, email: string, password: string) {
  return fetchWithAuth("/auth/register", {
    method: "POST",
    body: JSON.stringify({ name, email, password }),
  })
}

export async function logout() {
  localStorage.removeItem("magen_token")
}

// User data
export async function getUserProfile() {
  return fetchWithAuth("/user/profile")
}

export async function updateUserProfile(userData: any) {
  return fetchWithAuth("/user/profile", {
    method: "PUT",
    body: JSON.stringify(userData),
  })
}

// Breaches
export async function getBreaches() {
  return fetchWithAuth("/breaches")
}

export async function getBreachById(id: string) {
  return fetchWithAuth(`/breaches/${id}`)
}

export async function markBreachAsResolved(id: string) {
  return fetchWithAuth(`/breaches/${id}/resolve`, {
    method: "PUT",
  })
}

export async function getBreachStats() {
  return fetchWithAuth("/breaches/stats")
}

// Alerts
export async function getAlerts() {
  return fetchWithAuth("/alerts")
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
