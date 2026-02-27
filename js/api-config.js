/**
 * YatraNow - API Configuration
 * Centralized API configuration and HTTP helper functions
 */

// API Base URL - Change this to match your backend
const API_BASE_URL = 'https://yatranow-backend.onrender.com/api';

// API Endpoints
const API_ENDPOINTS = {
    // Authentication
    LOGIN: '/auth/login',
    REGISTER_USER: '/auth/register/user',
    REGISTER_OWNER: '/auth/register/owner',
    LOGOUT: '/auth/logout',

    // Routes/Vehicles
    ROUTES: '/public/routes',
    ROUTES_SEARCH: '/public/search',
    ROUTE_BY_ID: (id) => `/public/routes/${id}`,
    PUBLIC_ROUTE_LIST: '/public/route-list',

    // Bookings
    BOOKINGS: '/user/bookings',
    BOOKING_BY_ID: (id) => `/user/bookings/${id}`,
    BOOKED_SEATS: (scheduleId) => `/public/seats/${scheduleId}`,

    // Admin
    ADMIN_USERS: '/admin/users',
    ADMIN_USER_BY_ID: (id) => `/admin/users/${id}`,
    ADMIN_TOGGLE_USER: (id) => `/admin/users/${id}/block`,
    ADMIN_OWNERS: '/admin/owners',
    ADMIN_OWNER_BY_ID: (id) => `/admin/owners/${id}`,
    ADMIN_TOGGLE_OWNER: (id) => `/admin/owners/${id}/block`,
    ADMIN_BOOKINGS: '/admin/bookings',

    // Owner
    OWNER_VEHICLES: '/owner/vehicles',
    OWNER_ROUTES: '/owner/routes',
    OWNER_SCHEDULES: '/owner/schedules',
    OWNER_BOOKINGS: '/owner/bookings',
    OWNER_COMPLAINTS: '/owner/complaints'
};

/**
 * Get authentication token from localStorage
 */
function getAuthToken() {
    // First try to get token from inside the user object
    const user = localStorage.getItem('yatraNowUser');
    if (user) {
        const userData = JSON.parse(user);
        if (userData.token) return userData.token;
    }
    // Fallback: check the separate token key
    return localStorage.getItem('yatraNowToken') || null;
}

/**
 * HTTP request helper function
 * @param {string} endpoint - API endpoint
 * @param {object} options - Fetch options
 * @returns {Promise} API response
 */
async function apiRequest(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;

    // Default headers
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers
    };

    // Add auth token if available
    const token = getAuthToken();
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    // Merge options
    const config = {
        ...options,
        headers
    };

    try {
        const response = await fetch(url, config);

        // Handle different response status codes
        if (response.status === 401) {
            // Unauthorized - clear local storage and redirect to login
            localStorage.removeItem('yatraNowUser');
            if (!window.location.pathname.includes('login.html')) {
                window.location.href = 'login.html';
            }
            throw new Error('Authentication required');
        }

        if (response.status === 403) {
            // Check if response is JSON, otherwise use generic error
            let msg = '403 Forbidden';
            try {
                const clone = response.clone();
                const data = await clone.json();
                msg = data.message || msg;
            } catch (e) {
                // Not JSON, stick with status text if available
                if (response.statusText) msg += ` (${response.statusText})`;
            }
            throw new Error(msg);
        }

        if (!response.ok) {
            let errorData = {};
            try {
                const clone = response.clone();
                errorData = await clone.json();
            } catch (e) {
                // Not JSON
            }

            // Handle Spring Boot Validation Errors
            let errorMessage = errorData.message || `HTTP error! status: ${response.status}`;

            if (errorData.errors && Array.isArray(errorData.errors)) {
                // Combine validation messages
                const validationMessages = errorData.errors
                    .map(err => err.defaultMessage || err.message)
                    .join(', ');
                if (validationMessages) {
                    errorMessage += `: ${validationMessages}`;
                }
            } else if (errorData.error) {
                // Fallback to error title if message is empty
                if (!errorData.message) errorMessage = errorData.error;
            } else if (!errorData.message && response.statusText) {
                errorMessage += ` (${response.statusText})`;
            }

            throw new Error(errorMessage);
        }

        // Parse JSON response
        const data = await response.json();
        return data;

    } catch (error) {
        console.error('API Request Error:', error);
        throw error;
    }
}

/**
 * HTTP GET request
 */
async function apiGet(endpoint) {
    return apiRequest(endpoint, { method: 'GET' });
}

/**
 * HTTP POST request
 */
async function apiPost(endpoint, data) {
    return apiRequest(endpoint, {
        method: 'POST',
        body: JSON.stringify(data)
    });
}

/**
 * HTTP PUT request
 */
async function apiPut(endpoint, data) {
    return apiRequest(endpoint, {
        method: 'PUT',
        body: JSON.stringify(data)
    });
}

/**
 * HTTP PATCH request
 */
async function apiPatch(endpoint, data = {}) {
    return apiRequest(endpoint, {
        method: 'PATCH',
        body: JSON.stringify(data)
    });
}

/**
 * HTTP DELETE request
 */
async function apiDelete(endpoint) {
    return apiRequest(endpoint, { method: 'DELETE' });
}

/**
 * Upload file with FormData
 */
async function apiUploadFile(endpoint, formData) {
    const url = `${API_BASE_URL}${endpoint}`;

    const headers = {};
    const token = getAuthToken();
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers,
            body: formData
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('File Upload Error:', error);
        throw error;
    }
}

/**
 * Export functions and constants
 */
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        API_BASE_URL,
        API_ENDPOINTS,
        apiGet,
        apiPost,
        apiPut,
        apiDelete,
        apiUploadFile,
        getAuthToken
    };
}
