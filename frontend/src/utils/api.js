// const API_BASE_URL = "http://localhost:5003/api"

// // Get auth token from localStorage
// const getAuthToken = () => {
//   return localStorage.getItem("token")
// }

// // Enhanced API request helper with better error handling
// const apiRequest = async (endpoint, options = {}) => {
//   const token = getAuthToken()

//   const config = {
//     headers: {
//       "Content-Type": "application/json",
//       ...(token && { Authorization: `Bearer ${token}` }),
//       ...options.headers,
//     },
//     ...options,
//   }

//   // Handle body serialization
//   if (config.body && typeof config.body === "object" && !(config.body instanceof FormData)) {
//     config.body = JSON.stringify(config.body)
//   }

//   try {
//     const response = await fetch(`${API_BASE_URL}${endpoint}`, config)

//     // Handle empty responses
//     if (response.status === 204) {
//       return { success: true }
//     }

//     const data = await response.json()

//     if (!response.ok) {
//       throw new Error(data.message || `HTTP error! status: ${response.status}`)
//     }

//     return data
//   } catch (error) {
//     console.error(`API Error [${endpoint}]:`, error)
//     throw error
//   }
// }

// // Auth API
// export const authAPI = {
//   login: (credentials) =>
//     apiRequest("/auth/login", {
//       method: "POST",
//       body: credentials,
//     }),

//   register: (userData) =>
//     apiRequest("/auth/register", {
//       method: "POST",
//       body: userData,
//     }),

//   signup: (userData) =>
//     apiRequest("/auth/signup", {
//       method: "POST",
//       body: userData,
//     }),

//   getProfile: () => apiRequest("/auth/me"),

//   logout: () => apiRequest("/auth/logout", { method: "POST" }),
// }

// // Products API - Enhanced with FreshTrack features
// export const productsAPI = {
//   getAll: (params = {}) => {
//     const queryString = new URLSearchParams(
//       Object.entries(params).filter(([_, value]) => value !== "" && value !== null && value !== undefined),
//     ).toString()
//     return apiRequest(`/products${queryString ? `?${queryString}` : ""}`)
//   },

//   getById: (id) => apiRequest(`/products/${id}`),

//   create: (productData) =>
//     apiRequest("/products", {
//       method: "POST",
//       body: productData,
//     }),

//   update: (id, productData) =>
//     apiRequest(`/products/${id}`, {
//       method: "PUT",
//       body: productData,
//     }),

//   delete: (id) =>
//     apiRequest(`/products/${id}`, {
//       method: "DELETE",
//     }),

//   applyDiscount: (id, percentage) =>
//     apiRequest(`/products/${id}/discount`, {
//       method: "POST",
//       body: { percentage },
//     }),

//   addFeedback: (id, feedback) =>
//     apiRequest(`/products/${id}/feedback`, {
//       method: "POST",
//       body: feedback,
//     }),

//   // Bulk operations
//   bulkUpdate: (updates) =>
//     apiRequest("/products/bulk-update", {
//       method: "PUT",
//       body: { updates },
//     }),

//   // Search with advanced filters
//   search: (searchParams) =>
//     apiRequest("/products/search", {
//       method: "POST",
//       body: searchParams,
//     }),
// }

// // ML API - Enhanced with FreshTrack capabilities
// export const mlAPI = {
//   predict: (productId) =>
//     apiRequest(`/ml/predict/${productId}`, {
//       method: "POST",
//     }),

//   batchPredict: (options = {}) =>
//     apiRequest("/ml/batch-predict", {
//       method: "POST",
//       body: options,
//     }),

//   getModelInfo: () => apiRequest("/ml/model-info"),

//   getFreshTrackInsights: () => apiRequest("/ml/freshtrack-insights"),

//   // Advanced prediction features
//   predictWithEnvironment: (productId, environmentData) =>
//     apiRequest(`/ml/predict/${productId}/environment`, {
//       method: "POST",
//       body: environmentData,
//     }),

//   getCategoryInsights: (category) => apiRequest(`/ml/category-insights/${category}`),

//   getStoreAnalytics: (storeId) => apiRequest(`/ml/store-analytics/${storeId}`),
// }

// // Alerts API - Complete implementation
// export const alertsAPI = {
//   getAll: (params = {}) => {
//     const queryString = new URLSearchParams(
//       Object.entries(params).filter(([_, value]) => value !== "" && value !== null && value !== undefined),
//     ).toString()
//     return apiRequest(`/alerts${queryString ? `?${queryString}` : ""}`)
//   },

//   getById: (id) => apiRequest(`/alerts/${id}`),

//   acknowledge: (id) =>
//     apiRequest(`/alerts/${id}/acknowledge`, {
//       method: "PUT",
//     }),

//   resolve: (id, resolution) =>
//     apiRequest(`/alerts/${id}/resolve`, {
//       method: "PUT",
//       body: { resolution },
//     }),

//   dismiss: (id) =>
//     apiRequest(`/alerts/${id}`, {
//       method: "DELETE",
//     }),

//   markAsRead: (id) =>
//     apiRequest(`/alerts/${id}/read`, {
//       method: "PUT",
//     }),

//   // Bulk operations
//   bulkAcknowledge: (alertIds) =>
//     apiRequest("/alerts/bulk-acknowledge", {
//       method: "PUT",
//       body: { alertIds },
//     }),

//   getStats: () => apiRequest("/alerts/stats"),
// }

// // Analytics API - Enhanced with real-time data
// export const analyticsAPI = {
//   getDashboard: (params = {}) => {
//     const queryString = new URLSearchParams(
//       Object.entries(params).filter(([_, value]) => value !== "" && value !== null && value !== undefined),
//     ).toString()
//     return apiRequest(`/analytics/dashboard${queryString ? `?${queryString}` : ""}`)
//   },

//   getPredictions: (params = {}) => {
//     const queryString = new URLSearchParams(
//       Object.entries(params).filter(([_, value]) => value !== "" && value !== null && value !== undefined),
//     ).toString()
//     return apiRequest(`/analytics/predictions${queryString ? `?${queryString}` : ""}`)
//   },

//   getWasteReduction: (params = {}) => {
//     const queryString = new URLSearchParams(
//       Object.entries(params).filter(([_, value]) => value !== "" && value !== null && value !== undefined),
//     ).toString()
//     return apiRequest(`/analytics/waste-reduction${queryString ? `?${queryString}` : ""}`)
//   },

//   // FreshTrack specific analytics
//   getFreshTrackInsights: () => apiRequest("/analytics/freshtrack-insights"),

//   getCategoryBreakdown: (params = {}) => {
//     const queryString = new URLSearchParams(params).toString()
//     return apiRequest(`/analytics/category-breakdown${queryString ? `?${queryString}` : ""}`)
//   },

//   getEnvironmentalImpact: (params = {}) => {
//     const queryString = new URLSearchParams(params).toString()
//     return apiRequest(`/analytics/environmental-impact${queryString ? `?${queryString}` : ""}`)
//   },

//   getBusinessImpact: (params = {}) => {
//     const queryString = new URLSearchParams(params).toString()
//     return apiRequest(`/analytics/business-impact${queryString ? `?${queryString}` : ""}`)
//   },

//   // Real-time analytics
//   getRealTimeStats: () => apiRequest("/analytics/real-time"),

//   getStoreComparison: (storeIds) =>
//     apiRequest("/analytics/store-comparison", {
//       method: "POST",
//       body: { storeIds },
//     }),
// }

// // Donations API - Complete with FreshTrack optimization
// export const donationsAPI = {
//   getAll: (params = {}) => {
//     const queryString = new URLSearchParams(
//       Object.entries(params).filter(([_, value]) => value !== "" && value !== null && value !== undefined),
//     ).toString()
//     return apiRequest(`/donations${queryString ? `?${queryString}` : ""}`)
//   },

//   getById: (id) => apiRequest(`/donations/${id}`),

//   create: (donationData) =>
//     apiRequest("/donations", {
//       method: "POST",
//       body: donationData,
//     }),

//   // Quick donate for high-risk products
//   quickDonate: (productId, data = {}) =>
//     apiRequest(`/donations/quick-donate/${productId}`, {
//       method: "POST",
//       body: data,
//     }),

//   updateStatus: (id, statusData) =>
//     apiRequest(`/donations/${id}/status`, {
//       method: "PUT",
//       body: statusData,
//     }),

//   // Get available NGOs with FreshTrack compatibility
//   getNGOs: (params = {}) => {
//     const queryString = new URLSearchParams(
//       Object.entries(params).filter(([_, value]) => value !== "" && value !== null && value !== undefined),
//     ).toString()
//     return apiRequest(`/donations/ngos${queryString ? `?${queryString}` : ""}`)
//   },

//   // Get donation opportunities (products suitable for donation)
//   getOpportunities: (params = {}) => {
//     const queryString = new URLSearchParams(
//       Object.entries(params).filter(([_, value]) => value !== "" && value !== null && value !== undefined),
//     ).toString()
//     return apiRequest(`/donations/opportunities${queryString ? `?${queryString}` : ""}`)
//   },

//   // Schedule pickup
//   schedulePickup: (donationId, pickupData) =>
//     apiRequest(`/donations/${donationId}/schedule`, {
//       method: "POST",
//       body: pickupData,
//     }),

//   // Cancel donation
//   cancel: (id, reason) =>
//     apiRequest(`/donations/${id}/cancel`, {
//       method: "PUT",
//       body: { reason },
//     }),

//   // Get donation history
//   getHistory: (params = {}) => {
//     const queryString = new URLSearchParams(params).toString()
//     return apiRequest(`/donations/history${queryString ? `?${queryString}` : ""}`)
//   },

//   // Get donation impact
//   getImpact: (params = {}) => {
//     const queryString = new URLSearchParams(params).toString()
//     return apiRequest(`/donations/impact${queryString ? `?${queryString}` : ""}`)
//   },

//   // Bulk donation operations
//   bulkDonate: (donationRequests) =>
//     apiRequest("/donations/bulk", {
//       method: "POST",
//       body: { donations: donationRequests },
//     }),

//   // Get optimal donation matches
//   getOptimalMatches: (productId) => apiRequest(`/donations/optimal-matches/${productId}`),
// }

// // NGO API - For managing NGO partnerships
// export const ngoAPI = {
//   getAll: (params = {}) => {
//     const queryString = new URLSearchParams(params).toString()
//     return apiRequest(`/ngos${queryString ? `?${queryString}` : ""}`)
//   },

//   getById: (id) => apiRequest(`/ngos/${id}`),

//   create: (ngoData) =>
//     apiRequest("/ngos", {
//       method: "POST",
//       body: ngoData,
//     }),

//   update: (id, ngoData) =>
//     apiRequest(`/ngos/${id}`, {
//       method: "PUT",
//       body: ngoData,
//     }),

//   delete: (id) =>
//     apiRequest(`/ngos/${id}`, {
//       method: "DELETE",
//     }),

//   // Rate NGO
//   rate: (id, rating) =>
//     apiRequest(`/ngos/${id}/rate`, {
//       method: "POST",
//       body: { rating },
//     }),

//   // Get NGO performance
//   getPerformance: (id) => apiRequest(`/ngos/${id}/performance`),
// }

// // Store API - For multi-store management
// export const storeAPI = {
//   getAll: () => apiRequest("/stores"),

//   getById: (id) => apiRequest(`/stores/${id}`),

//   getCurrent: () => apiRequest("/stores/current"),

//   update: (id, storeData) =>
//     apiRequest(`/stores/${id}`, {
//       method: "PUT",
//       body: storeData,
//     }),

//   getStats: (id) => apiRequest(`/stores/${id}/stats`),

//   // Environmental settings
//   updateEnvironment: (id, environmentData) =>
//     apiRequest(`/stores/${id}/environment`, {
//       method: "PUT",
//       body: environmentData,
//     }),
// }

// // Reports API - For generating detailed reports
// export const reportsAPI = {
//   generate: (reportType, params = {}) =>
//     apiRequest(`/reports/${reportType}`, {
//       method: "POST",
//       body: params,
//     }),

//   getAll: () => apiRequest("/reports"),

//   getById: (id) => apiRequest(`/reports/${id}`),

//   download: (id) => apiRequest(`/reports/${id}/download`),

//   // Specific report types
//   wasteReport: (params) => apiRequest("/reports/waste", { method: "POST", body: params }),

//   donationReport: (params) => apiRequest("/reports/donations", { method: "POST", body: params }),

//   environmentalReport: (params) => apiRequest("/reports/environmental", { method: "POST", body: params }),

//   businessReport: (params) => apiRequest("/reports/business", { method: "POST", body: params }),
// }

// // Settings API - For user and system settings
// export const settingsAPI = {
//   get: () => apiRequest("/settings"),

//   update: (settings) =>
//     apiRequest("/settings", {
//       method: "PUT",
//       body: settings,
//     }),

//   // Notification settings
//   getNotifications: () => apiRequest("/settings/notifications"),

//   updateNotifications: (notificationSettings) =>
//     apiRequest("/settings/notifications", {
//       method: "PUT",
//       body: notificationSettings,
//     }),

//   // ML model settings
//   getMLSettings: () => apiRequest("/settings/ml"),

//   updateMLSettings: (mlSettings) =>
//     apiRequest("/settings/ml", {
//       method: "PUT",
//       body: mlSettings,
//     }),
// }

// // Utility functions for common operations
// export const utilityAPI = {
//   // Health check
//   healthCheck: () => apiRequest("/health"),

//   // System status
//   getSystemStatus: () => apiRequest("/system/status"),

//   // Upload file
//   uploadFile: (file, type = "general") => {
//     const formData = new FormData()
//     formData.append("file", file)
//     formData.append("type", type)

//     return apiRequest("/upload", {
//       method: "POST",
//       body: formData,
//       headers: {}, // Let browser set Content-Type for FormData
//     })
//   },

//   // Export data
//   exportData: (type, params = {}) =>
//     apiRequest(`/export/${type}`, {
//       method: "POST",
//       body: params,
//     }),

//   // Import data
//   importData: (type, data) =>
//     apiRequest(`/import/${type}`, {
//       method: "POST",
//       body: data,
//     }),
// }

// // Default export with all APIs
// export default {
//   authAPI,
//   productsAPI,
//   mlAPI,
//   alertsAPI,
//   analyticsAPI,
//   donationsAPI,
//   ngoAPI,
//   storeAPI,
//   reportsAPI,
//   settingsAPI,
//   utilityAPI,
// }

// // Helper functions for common patterns
// export const apiHelpers = {
//   // Retry failed requests
//   retryRequest: async (requestFn, maxRetries = 3, delay = 1000) => {
//     for (let i = 0; i < maxRetries; i++) {
//       try {
//         return await requestFn()
//       } catch (error) {
//         if (i === maxRetries - 1) throw error
//         await new Promise((resolve) => setTimeout(resolve, delay * Math.pow(2, i)))
//       }
//     }
//   },

//   // Batch requests
//   batchRequests: async (requests, batchSize = 5) => {
//     const results = []
//     for (let i = 0; i < requests.length; i += batchSize) {
//       const batch = requests.slice(i, i + batchSize)
//       const batchResults = await Promise.allSettled(batch.map((req) => req()))
//       results.push(...batchResults)
//     }
//     return results
//   },

//   // Format error messages
//   formatError: (error) => {
//     if (typeof error === "string") return error
//     if (error.message) return error.message
//     if (error.error) return error.error
//     return "An unexpected error occurred"
//   },

//   // Check if user is authenticated
//   isAuthenticated: () => {
//     const token = getAuthToken()
//     if (!token) return false

//     try {
//       const payload = JSON.parse(atob(token.split(".")[1]))
//       return payload.exp > Date.now() / 1000
//     } catch {
//       return false
//     }
//   },

//   // Clear auth data
//   clearAuth: () => {
//     localStorage.removeItem("token")
//     localStorage.removeItem("user")
//   },
// }


// Use environment variable or fallback to localhost
// const API_BASE_URL =  "http://localhost:5003/api"

// // Get auth token from localStorage
// const getAuthToken = () => {
//   return localStorage.getItem("token")
// }

// // Enhanced API request helper with better error handling
// const apiRequest = async (endpoint, options = {}) => {
//   const token = getAuthToken()
//   const config = {
//     headers: {
//       "Content-Type": "application/json",
//       ...(token && { Authorization: `Bearer ${token}` }),
//       ...options.headers,
//     },
//     ...options,
//   }

//   // Handle body serialization
//   if (config.body && typeof config.body === "object" && !(config.body instanceof FormData)) {
//     config.body = JSON.stringify(config.body)
//   }

//   try {
//     const response = await fetch(`${API_BASE_URL}${endpoint}`, config)

//     // Handle empty responses
//     if (response.status === 204) {
//       return { success: true }
//     }

//     const data = await response.json()

//     if (!response.ok) {
//       throw new Error(data.message || `HTTP error! status: ${response.status}`)
//     }

//     return data
//   } catch (error) {
//     console.error(`API Error [${endpoint}]:`, error)
//     throw error
//   }
// }

// // Auth API
// export const authAPI = {
//   login: (credentials) =>
//     apiRequest("/auth/login", {
//       method: "POST",
//       body: credentials,
//     }),
//   register: (userData) =>
//     apiRequest("/auth/register", {
//       method: "POST",
//       body: userData,
//     }),
//   signup: (userData) =>
//     apiRequest("/auth/signup", {
//       method: "POST",
//       body: userData,
//     }),
//   getProfile: () => apiRequest("/auth/me"),
//   logout: () => apiRequest("/auth/logout", { method: "POST" }),
// }

// // Products API - Enhanced with FreshTrack features
// export const productsAPI = {
//   getAll: (params = {}) => {
//     const queryString = new URLSearchParams(
//       Object.entries(params).filter(([_, value]) => value !== "" && value !== null && value !== undefined),
//     ).toString()
//     return apiRequest(`/products${queryString ? `?${queryString}` : ""}`)
//   },
//   getById: (id) => apiRequest(`/products/${id}`),
//   create: (productData) =>
//     apiRequest("/products", {
//       method: "POST",
//       body: productData,
//     }),
//   update: (id, productData) =>
//     apiRequest(`/products/${id}`, {
//       method: "PUT",
//       body: productData,
//     }),
//   delete: (id) =>
//     apiRequest(`/products/${id}`, {
//       method: "DELETE",
//     }),
//   applyDiscount: (id, percentage) =>
//     apiRequest(`/products/${id}/discount`, {
//       method: "POST",
//       body: { percentage },
//     }),
//   addFeedback: (id, feedback) =>
//     apiRequest(`/products/${id}/feedback`, {
//       method: "POST",
//       body: feedback,
//     }),
//   // Bulk operations
//   bulkUpdate: (updates) =>
//     apiRequest("/products/bulk-update", {
//       method: "PUT",
//       body: { updates },
//     }),
//   // Search with advanced filters
//   search: (searchParams) =>
//     apiRequest("/products/search", {
//       method: "POST",
//       body: searchParams,
//     }),
// }

// // ML API - Enhanced with FreshTrack capabilities
// export const mlAPI = {
//   predict: (productId) =>
//     apiRequest(`/ml/predict/${productId}`, {
//       method: "POST",
//     }),
//   batchPredict: (options = {}) =>
//     apiRequest("/ml/batch-predict", {
//       method: "POST",
//       body: options,
//     }),
//   getModelInfo: () => apiRequest("/ml/model-info"),
//   getFreshTrackInsights: () => apiRequest("/ml/freshtrack-insights"),
//   // Advanced prediction features
//   predictWithEnvironment: (productId, environmentData) =>
//     apiRequest(`/ml/predict/${productId}/environment`, {
//       method: "POST",
//       body: environmentData,
//     }),
//   getCategoryInsights: (category) => apiRequest(`/ml/category-insights/${category}`),
//   getStoreAnalytics: (storeId) => apiRequest(`/ml/store-analytics/${storeId}`),
// }

// // Alerts API - Complete implementation
// export const alertsAPI = {
//   getAll: (params = {}) => {
//     const queryString = new URLSearchParams(
//       Object.entries(params).filter(([_, value]) => value !== "" && value !== null && value !== undefined),
//     ).toString()
//     return apiRequest(`/alerts${queryString ? `?${queryString}` : ""}`)
//   },
//   getById: (id) => apiRequest(`/alerts/${id}`),
//   acknowledge: (id) =>
//     apiRequest(`/alerts/${id}/acknowledge`, {
//       method: "PUT",
//     }),
//   resolve: (id, resolution) =>
//     apiRequest(`/alerts/${id}/resolve`, {
//       method: "PUT",
//       body: { resolution },
//     }),
//   dismiss: (id) =>
//     apiRequest(`/alerts/${id}`, {
//       method: "DELETE",
//     }),
//   markAsRead: (id) =>
//     apiRequest(`/alerts/${id}/read`, {
//       method: "PUT",
//     }),
//   // Bulk operations
//   bulkAcknowledge: (alertIds) =>
//     apiRequest("/alerts/bulk-acknowledge", {
//       method: "PUT",
//       body: { alertIds },
//     }),
//   getStats: () => apiRequest("/alerts/stats"),
// }

// // Analytics API - Enhanced with real-time data
// export const analyticsAPI = {
//   getDashboard: (params = {}) => {
//     const queryString = new URLSearchParams(
//       Object.entries(params).filter(([_, value]) => value !== "" && value !== null && value !== undefined),
//     ).toString()
//     return apiRequest(`/analytics/dashboard${queryString ? `?${queryString}` : ""}`)
//   },
//   getPredictions: (params = {}) => {
//     const queryString = new URLSearchParams(
//       Object.entries(params).filter(([_, value]) => value !== "" && value !== null && value !== undefined),
//     ).toString()
//     return apiRequest(`/analytics/predictions${queryString ? `?${queryString}` : ""}`)
//   },
//   getWasteReduction: (params = {}) => {
//     const queryString = new URLSearchParams(
//       Object.entries(params).filter(([_, value]) => value !== "" && value !== null && value !== undefined),
//     ).toString()
//     return apiRequest(`/analytics/waste-reduction${queryString ? `?${queryString}` : ""}`)
//   },
//   // FreshTrack specific analytics
//   getFreshTrackInsights: () => apiRequest("/analytics/freshtrack-insights"),
//   getCategoryBreakdown: (params = {}) => {
//     const queryString = new URLSearchParams(params).toString()
//     return apiRequest(`/analytics/category-breakdown${queryString ? `?${queryString}` : ""}`)
//   },
//   getEnvironmentalImpact: (params = {}) => {
//     const queryString = new URLSearchParams(params).toString()
//     return apiRequest(`/analytics/environmental-impact${queryString ? `?${queryString}` : ""}`)
//   },
//   getBusinessImpact: (params = {}) => {
//     const queryString = new URLSearchParams(params).toString()
//     return apiRequest(`/analytics/business-impact${queryString ? `?${queryString}` : ""}`)
//   },
//   // Real-time analytics
//   getRealTimeStats: () => apiRequest("/analytics/real-time"),
//   getStoreComparison: (storeIds) =>
//     apiRequest("/analytics/store-comparison", {
//       method: "POST",
//       body: { storeIds },
//     }),
// }

// // Donations API - Complete with FreshTrack optimization
// export const donationsAPI = {
//   getAll: (params = {}) => {
//     const queryString = new URLSearchParams(
//       Object.entries(params).filter(([_, value]) => value !== "" && value !== null && value !== undefined),
//     ).toString()
//     return apiRequest(`/donations${queryString ? `?${queryString}` : ""}`)
//   },
//   getById: (id) => apiRequest(`/donations/${id}`),
//   create: (donationData) =>
//     apiRequest("/donations", {
//       method: "POST",
//       body: donationData,
//     }),
//   // Quick donate for high-risk products
//   quickDonate: (productId, data = {}) =>
//     apiRequest(`/donations/quick-donate/${productId}`, {
//       method: "POST",
//       body: data,
//     }),
//   updateStatus: (id, statusData) =>
//     apiRequest(`/donations/${id}/status`, {
//       method: "PUT",
//       body: statusData,
//     }),
//   // Get available NGOs with FreshTrack compatibility
//   getNGOs: (params = {}) => {
//     const queryString = new URLSearchParams(
//       Object.entries(params).filter(([_, value]) => value !== "" && value !== null && value !== undefined),
//     ).toString()
//     return apiRequest(`/donations/ngos${queryString ? `?${queryString}` : ""}`)
//   },
//   // Get donation opportunities (products suitable for donation)
//   getOpportunities: (params = {}) => {
//     const queryString = new URLSearchParams(
//       Object.entries(params).filter(([_, value]) => value !== "" && value !== null && value !== undefined),
//     ).toString()
//     return apiRequest(`/donations/opportunities${queryString ? `?${queryString}` : ""}`)
//   },
//   // Schedule pickup
//   schedulePickup: (donationId, pickupData) =>
//     apiRequest(`/donations/${donationId}/schedule`, {
//       method: "POST",
//       body: pickupData,
//     }),
//   // Cancel donation
//   cancel: (id, reason) =>
//     apiRequest(`/donations/${id}/cancel`, {
//       method: "PUT",
//       body: { reason },
//     }),
//   // Get donation history
//   getHistory: (params = {}) => {
//     const queryString = new URLSearchParams(params).toString()
//     return apiRequest(`/donations/history${queryString ? `?${queryString}` : ""}`)
//   },
//   // Get donation impact
//   getImpact: (params = {}) => {
//     const queryString = new URLSearchParams(params).toString()
//     return apiRequest(`/donations/impact${queryString ? `?${queryString}` : ""}`)
//   },
//   // Bulk donation operations
//   bulkDonate: (donationRequests) =>
//     apiRequest("/donations/bulk", {
//       method: "POST",
//       body: { donations: donationRequests },
//     }),
//   // Get optimal donation matches
//   getOptimalMatches: (productId) => apiRequest(`/donations/optimal-matches/${productId}`),
// }

// // NGO API - For managing NGO partnerships
// export const ngoAPI = {
//   getAll: (params = {}) => {
//     const queryString = new URLSearchParams(params).toString()
//     return apiRequest(`/ngos${queryString ? `?${queryString}` : ""}`)
//   },
//   getById: (id) => apiRequest(`/ngos/${id}`),
//   create: (ngoData) =>
//     apiRequest("/ngos", {
//       method: "POST",
//       body: ngoData,
//     }),
//   update: (id, ngoData) =>
//     apiRequest(`/ngos/${id}`, {
//       method: "PUT",
//       body: ngoData,
//     }),
//   delete: (id) =>
//     apiRequest(`/ngos/${id}`, {
//       method: "DELETE",
//     }),
//   // Rate NGO
//   rate: (id, rating) =>
//     apiRequest(`/ngos/${id}/rate`, {
//       method: "POST",
//       body: { rating },
//     }),
//   // Get NGO performance
//   getPerformance: (id) => apiRequest(`/ngos/${id}/performance`),
// }

// // Store API - For multi-store management
// export const storeAPI = {
//   getAll: () => apiRequest("/stores"),
//   getById: (id) => apiRequest(`/stores/${id}`),
//   getCurrent: () => apiRequest("/stores/current"),
//   update: (id, storeData) =>
//     apiRequest(`/stores/${id}`, {
//       method: "PUT",
//       body: storeData,
//     }),
//   getStats: (id) => apiRequest(`/stores/${id}/stats`),
//   // Environmental settings
//   updateEnvironment: (id, environmentData) =>
//     apiRequest(`/stores/${id}/environment`, {
//       method: "PUT",
//       body: environmentData,
//     }),
// }

// // Reports API - For generating detailed reports
// export const reportsAPI = {
//   generate: (reportType, params = {}) =>
//     apiRequest(`/reports/${reportType}`, {
//       method: "POST",
//       body: params,
//     }),
//   getAll: () => apiRequest("/reports"),
//   getById: (id) => apiRequest(`/reports/${id}`),
//   download: (id) => apiRequest(`/reports/${id}/download`),
//   // Specific report types
//   wasteReport: (params) => apiRequest("/reports/waste", { method: "POST", body: params }),
//   donationReport: (params) => apiRequest("/reports/donations", { method: "POST", body: params }),
//   environmentalReport: (params) => apiRequest("/reports/environmental", { method: "POST", body: params }),
//   businessReport: (params) => apiRequest("/reports/business", { method: "POST", body: params }),
// }

// // Settings API - For user and system settings
// export const settingsAPI = {
//   get: () => apiRequest("/settings"),
//   update: (settings) =>
//     apiRequest("/settings", {
//       method: "PUT",
//       body: settings,
//     }),
//   // Notification settings
//   getNotifications: () => apiRequest("/settings/notifications"),
//   updateNotifications: (notificationSettings) =>
//     apiRequest("/settings/notifications", {
//       method: "PUT",
//       body: notificationSettings,
//     }),
//   // ML model settings
//   getMLSettings: () => apiRequest("/settings/ml"),
//   updateMLSettings: (mlSettings) =>
//     apiRequest("/settings/ml", {
//       method: "PUT",
//       body: mlSettings,
//     }),
// }

// // Utility functions for common operations
// export const utilityAPI = {
//   // Health check
//   healthCheck: () => apiRequest("/health"),
//   // System status
//   getSystemStatus: () => apiRequest("/system/status"),
//   // Upload file
//   uploadFile: (file, type = "general") => {
//     const formData = new FormData()
//     formData.append("file", file)
//     formData.append("type", type)
//     return apiRequest("/upload", {
//       method: "POST",
//       body: formData,
//       headers: {}, // Let browser set Content-Type for FormData
//     })
//   },
//   // Export data
//   exportData: (type, params = {}) =>
//     apiRequest(`/export/${type}`, {
//       method: "POST",
//       body: params,
//     }),
//   // Import data
//   importData: (type, data) =>
//     apiRequest(`/import/${type}`, {
//       method: "POST",
//       body: data,
//     }),
// }





// // Default export with all APIs
// export default {
//   authAPI,
//   productsAPI,
//   mlAPI,
//   alertsAPI,
//   analyticsAPI,
//   donationsAPI,
//   ngoAPI,
//   storeAPI,
//   reportsAPI,
//   settingsAPI,
//   utilityAPI,
// }

// // Helper functions for common patterns
// export const apiHelpers = {
//   // Retry failed requests
//   retryRequest: async (requestFn, maxRetries = 3, delay = 1000) => {
//     for (let i = 0; i < maxRetries; i++) {
//       try {
//         return await requestFn()
//       } catch (error) {
//         if (i === maxRetries - 1) throw error
//         await new Promise((resolve) => setTimeout(resolve, delay * Math.pow(2, i)))
//       }
//     }
//   },
//   // Batch requests
//   batchRequests: async (requests, batchSize = 5) => {
//     const results = []
//     for (let i = 0; i < requests.length; i += batchSize) {
//       const batch = requests.slice(i, i + batchSize)
//       const batchResults = await Promise.allSettled(batch.map((req) => req()))
//       results.push(...batchResults)
//     }
//     return results
//   },
//   // Format error messages
//   formatError: (error) => {
//     if (typeof error === "string") return error
//     if (error.message) return error.message
//     if (error.error) return error.error
//     return "An unexpected error occurred"
//   },
//   // Check if user is authenticated
//   isAuthenticated: () => {
//     const token = getAuthToken()
//     if (!token) return false
//     try {
//       const payload = JSON.parse(atob(token.split(".")[1]))
//       return payload.exp > Date.now() / 1000
//     } catch {
//       return false
//     }
//   },
//   // Clear auth data
//   clearAuth: () => {
//     localStorage.removeItem("token")
//     localStorage.removeItem("user")
//   },
// }


// Use environment variable or fallback to localhost
const API_BASE_URL = "http://localhost:5003/api"

// Get auth token from localStorage
const getAuthToken = () => {
  return localStorage.getItem("token")
}

// Enhanced API request helper with better error handling
const apiRequest = async (endpoint, options = {}) => {
  const token = getAuthToken()
  const config = {
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  }

  // Handle body serialization
  if (config.body && typeof config.body === "object" && !(config.body instanceof FormData)) {
    config.body = JSON.stringify(config.body)
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config)

    // Handle empty responses
    if (response.status === 204) {
      return { success: true }
    }

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || `HTTP error! status: ${response.status}`)
    }

    return data
  } catch (error) {
    console.error(`API Error [${endpoint}]:`, error)
    throw error
  }
}

// Auth API
export const authAPI = {
  login: (credentials) =>
    apiRequest("/auth/login", {
      method: "POST",
      body: credentials,
    }),
  register: (userData) =>
    apiRequest("/auth/register", {
      method: "POST",
      body: userData,
    }),
  signup: (userData) =>
    apiRequest("/auth/signup", {
      method: "POST",
      body: userData,
    }),
  getProfile: () => apiRequest("/auth/me"),
  logout: () => apiRequest("/auth/logout", { method: "POST" }),
}

// Products API - Enhanced with FreshTrack features
export const productsAPI = {
  getAll: (params = {}) => {
    const queryString = new URLSearchParams(
      Object.entries(params).filter(([_, value]) => value !== "" && value !== null && value !== undefined),
    ).toString()
    return apiRequest(`/products${queryString ? `?${queryString}` : ""}`)
  },
  getById: (id) => apiRequest(`/products/${id}`),
  create: (productData) =>
    apiRequest("/products", {
      method: "POST",
      body: productData,
    }),
  update: (id, productData) =>
    apiRequest(`/products/${id}`, {
      method: "PUT",
      body: productData,
    }),
  delete: (id) =>
    apiRequest(`/products/${id}`, {
      method: "DELETE",
    }),
  applyDiscount: (id, percentage) =>
    apiRequest(`/products/${id}/discount`, {
      method: "POST",
      body: { percentage },
    }),
  addFeedback: (id, feedback) =>
    apiRequest(`/products/${id}/feedback`, {
      method: "POST",
      body: feedback,
    }),
  getStats: () => apiRequest("/products/stats/overview"),
  // Bulk operations
  bulkUpdate: (updates) =>
    apiRequest("/products/bulk-update", {
      method: "PUT",
      body: { updates },
    }),
  // Search with advanced filters
  search: (searchParams) =>
    apiRequest("/products/search", {
      method: "POST",
      body: searchParams,
    }),
}

// ML API - Enhanced with FreshTrack capabilities
export const mlAPI = {
  predict: (productId) =>
    apiRequest(`/ml/predict/${productId}`, {
      method: "POST",
    }),
  batchPredict: (options = {}) =>
    apiRequest("/ml/batch-predict", {
      method: "POST",
      body: options,
    }),
  getModelInfo: () => apiRequest("/ml/model-info"),
  getFreshTrackInsights: () => apiRequest("/ml/freshtrack-insights"),
  // Advanced prediction features
  predictWithEnvironment: (productId, environmentData) =>
    apiRequest(`/ml/predict/${productId}/environment`, {
      method: "POST",
      body: environmentData,
    }),
  getCategoryInsights: (category) => apiRequest(`/ml/category-insights/${category}`),
  getStoreAnalytics: (storeId) => apiRequest(`/ml/store-analytics/${storeId}`),
}

// Alerts API - Complete implementation
export const alertsAPI = {
  getAll: (params = {}) => {
    const queryString = new URLSearchParams(
      Object.entries(params).filter(([_, value]) => value !== "" && value !== null && value !== undefined),
    ).toString()
    return apiRequest(`/alerts${queryString ? `?${queryString}` : ""}`)
  },
  getById: (id) => apiRequest(`/alerts/${id}`),
  acknowledge: (id) =>
    apiRequest(`/alerts/${id}/acknowledge`, {
      method: "PUT",
    }),
  resolve: (id, resolution) =>
    apiRequest(`/alerts/${id}/resolve`, {
      method: "PUT",
      body: { resolution },
    }),
  dismiss: (id) =>
    apiRequest(`/alerts/${id}`, {
      method: "DELETE",
    }),
  markAsRead: (id) =>
    apiRequest(`/alerts/${id}/read`, {
      method: "PUT",
    }),
  // Bulk operations
  bulkAcknowledge: (alertIds) =>
    apiRequest("/alerts/bulk-acknowledge", {
      method: "PUT",
      body: { alertIds },
    }),
  getStats: () => apiRequest("/alerts/stats"),
}

// Analytics API - Enhanced with real-time data
export const analyticsAPI = {
  getDashboard: (params = {}) => {
    const queryString = new URLSearchParams(
      Object.entries(params).filter(([_, value]) => value !== "" && value !== null && value !== undefined),
    ).toString()
    return apiRequest(`/analytics/dashboard${queryString ? `?${queryString}` : ""}`)
  },
  getPredictions: (params = {}) => {
    const queryString = new URLSearchParams(
      Object.entries(params).filter(([_, value]) => value !== "" && value !== null && value !== undefined),
    ).toString()
    return apiRequest(`/analytics/predictions${queryString ? `?${queryString}` : ""}`)
  },
  getWasteReduction: (params = {}) => {
    const queryString = new URLSearchParams(
      Object.entries(params).filter(([_, value]) => value !== "" && value !== null && value !== undefined),
    ).toString()
    return apiRequest(`/analytics/waste-reduction${queryString ? `?${queryString}` : ""}`)
  },
  // FreshTrack specific analytics
  getFreshTrackInsights: () => apiRequest("/analytics/freshtrack-insights"),
  getCategoryBreakdown: (params = {}) => {
    const queryString = new URLSearchParams(params).toString()
    return apiRequest(`/analytics/category-breakdown${queryString ? `?${queryString}` : ""}`)
  },
  getEnvironmentalImpact: (params = {}) => {
    const queryString = new URLSearchParams(params).toString()
    return apiRequest(`/analytics/environmental-impact${queryString ? `?${queryString}` : ""}`)
  },
  getBusinessImpact: (params = {}) => {
    const queryString = new URLSearchParams(params).toString()
    return apiRequest(`/analytics/business-impact${queryString ? `?${queryString}` : ""}`)
  },
  // Real-time analytics
  getRealTimeStats: () => apiRequest("/analytics/real-time"),
  getStoreComparison: (storeIds) =>
    apiRequest("/analytics/store-comparison", {
      method: "POST",
      body: { storeIds },
    }),
}

// Donations API - Complete with FreshTrack optimization
export const donationsAPI = {
  getAll: (params = {}) => {
    const queryString = new URLSearchParams(
      Object.entries(params).filter(([_, value]) => value !== "" && value !== null && value !== undefined),
    ).toString()
    return apiRequest(`/donations${queryString ? `?${queryString}` : ""}`)
  },
  getById: (id) => apiRequest(`/donations/${id}`),
  create: (donationData) =>
    apiRequest("/donations/create", {
      method: "POST",
      body: donationData,
    }),
  // Quick donate for high-risk products
  quickDonate: (productId, data = {}) =>
    apiRequest(`/donations/quick-donate/${productId}`, {
      method: "POST",
      body: data,
    }),
  updateStatus: (id, statusData) =>
    apiRequest(`/donations/${id}/status`, {
      method: "PUT",
      body: statusData,
    }),
  // Get available NGOs with FreshTrack compatibility
  getNGOs: (params = {}) => {
    const queryString = new URLSearchParams(
      Object.entries(params).filter(([_, value]) => value !== "" && value !== null && value !== undefined),
    ).toString()
    return apiRequest(`/donations/ngos${queryString ? `?${queryString}` : ""}`)
  },
  // Get donation opportunities (products suitable for donation)
  getOpportunities: (params = {}) => {
    const queryString = new URLSearchParams(
      Object.entries(params).filter(([_, value]) => value !== "" && value !== null && value !== undefined),
    ).toString()
    return apiRequest(`/donations/opportunities${queryString ? `?${queryString}` : ""}`)
  },
  // Schedule pickup
  schedulePickup: (donationId, pickupData) =>
    apiRequest(`/donations/${donationId}/schedule`, {
      method: "POST",
      body: pickupData,
    }),
  // Cancel donation
  cancel: (id, reason) =>
    apiRequest(`/donations/${id}/cancel`, {
      method: "PUT",
      body: { reason },
    }),
  // Get donation history
  getHistory: (params = {}) => {
    const queryString = new URLSearchParams(params).toString()
    return apiRequest(`/donations/history${queryString ? `?${queryString}` : ""}`)
  },
  // Get donation impact
  getImpact: (params = {}) => {
    const queryString = new URLSearchParams(params).toString()
    return apiRequest(`/donations/impact${queryString ? `?${queryString}` : ""}`)
  },
  // Bulk donation operations
  bulkDonate: (donationRequests) =>
    apiRequest("/donations/bulk", {
      method: "POST",
      body: { donations: donationRequests },
    }),
  // Get optimal donation matches
  getOptimalMatches: (productId) => apiRequest(`/donations/optimal-matches/${productId}`),
}

// NGO API - For managing NGO partnerships
export const ngoAPI = {
  getAll: (params = {}) => {
    const queryString = new URLSearchParams(params).toString()
    return apiRequest(`/ngos${queryString ? `?${queryString}` : ""}`)
  },
  getById: (id) => apiRequest(`/ngos/${id}`),
  create: (ngoData) =>
    apiRequest("/ngos", {
      method: "POST",
      body: ngoData,
    }),
  update: (id, ngoData) =>
    apiRequest(`/ngos/${id}`, {
      method: "PUT",
      body: ngoData,
    }),
  delete: (id) =>
    apiRequest(`/ngos/${id}`, {
      method: "DELETE",
    }),
  // Rate NGO
  rate: (id, rating) =>
    apiRequest(`/ngos/${id}/rate`, {
      method: "POST",
      body: { rating },
    }),
  // Get NGO performance
  getPerformance: (id) => apiRequest(`/ngos/${id}/performance`),
}

// Store API - For multi-store management
export const storeAPI = {
  getAll: () => apiRequest("/stores"),
  getById: (id) => apiRequest(`/stores/${id}`),
  getCurrent: () => apiRequest("/stores/current"),
  update: (id, storeData) =>
    apiRequest(`/stores/${id}`, {
      method: "PUT",
      body: storeData,
    }),
  getStats: (id) => apiRequest(`/stores/${id}/stats`),
  // Environmental settings
  updateEnvironment: (id, environmentData) =>
    apiRequest(`/stores/${id}/environment`, {
      method: "PUT",
      body: environmentData,
    }),
}

// Reports API - For generating detailed reports
export const reportsAPI = {
  generate: (reportType, params = {}) =>
    apiRequest(`/reports/${reportType}`, {
      method: "POST",
      body: params,
    }),
  getAll: () => apiRequest("/reports"),
  getById: (id) => apiRequest(`/reports/${id}`),
  download: (id) => apiRequest(`/reports/${id}/download`),
  // Specific report types
  wasteReport: (params) => apiRequest("/reports/waste", { method: "POST", body: params }),
  donationReport: (params) => apiRequest("/reports/donations", { method: "POST", body: params }),
  environmentalReport: (params) => apiRequest("/reports/environmental", { method: "POST", body: params }),
  businessReport: (params) => apiRequest("/reports/business", { method: "POST", body: params }),
}

// Settings API - For user and system settings
export const settingsAPI = {
  get: () => apiRequest("/settings"),
  update: (settings) =>
    apiRequest("/settings", {
      method: "PUT",
      body: settings,
    }),
  // Notification settings
  getNotifications: () => apiRequest("/settings/notifications"),
  updateNotifications: (notificationSettings) =>
    apiRequest("/settings/notifications", {
      method: "PUT",
      body: notificationSettings,
    }),
  // ML model settings
  getMLSettings: () => apiRequest("/settings/ml"),
  updateMLSettings: (mlSettings) =>
    apiRequest("/settings/ml", {
      method: "PUT",
      body: mlSettings,
    }),
}

// Utility functions for common operations
export const utilityAPI = {
  // Health check
  healthCheck: () => apiRequest("/health"),
  // System status
  getSystemStatus: () => apiRequest("/system/status"),
  // Upload file
  uploadFile: (file, type = "general") => {
    const formData = new FormData()
    formData.append("file", file)
    formData.append("type", type)
    return apiRequest("/upload", {
      method: "POST",
      body: formData,
      headers: {}, // Let browser set Content-Type for FormData
    })
  },
  // Export data
  exportData: (type, params = {}) =>
    apiRequest(`/export/${type}`, {
      method: "POST",
      body: params,
    }),
  // Import data
  importData: (type, data) =>
    apiRequest(`/import/${type}`, {
      method: "POST",
      body: data,
    }),
}

// Default export with all APIs
export default {
  authAPI,
  productsAPI,
  mlAPI,
  alertsAPI,
  analyticsAPI,
  donationsAPI,
  ngoAPI,
  storeAPI,
  reportsAPI,
  settingsAPI,
  utilityAPI,
}

// Helper functions for common patterns
export const apiHelpers = {
  // Retry failed requests
  retryRequest: async (requestFn, maxRetries = 3, delay = 1000) => {
    for (let i = 0; i < maxRetries; i++) {
      try {
        return await requestFn()
      } catch (error) {
        if (i === maxRetries - 1) throw error
        await new Promise((resolve) => setTimeout(resolve, delay * Math.pow(2, i)))
      }
    }
  },
  // Batch requests
  batchRequests: async (requests, batchSize = 5) => {
    const results = []
    for (let i = 0; i < requests.length; i += batchSize) {
      const batch = requests.slice(i, i + batchSize)
      const batchResults = await Promise.allSettled(batch.map((req) => req()))
      results.push(...batchResults)
    }
    return results
  },
  // Format error messages
  formatError: (error) => {
    if (typeof error === "string") return error
    if (error.message) return error.message
    if (error.error) return error.error
    return "An unexpected error occurred"
  },
  // Check if user is authenticated
  isAuthenticated: () => {
    const token = getAuthToken()
    if (!token) return false
    try {
      const payload = JSON.parse(atob(token.split(".")[1]))
      return payload.exp > Date.now() / 1000
    } catch {
      return false
    }
  },
  // Clear auth data
  clearAuth: () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
  },
}




