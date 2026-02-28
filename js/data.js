/**
 * YatraNow - Data & API Integration
 * Connects frontend to Spring Boot backend APIs
 * Falls back to dummy data if backend is unavailable
 */

// Configuration flag - set to true to use backend API, false for dummy data
const USE_BACKEND_API = true;

// Dummy data for fallback/testing - NOW EMPTY as per request
const dummyData = {
    routes: [],
    users: [],
    owners: [],
    bookings: [
        {
            id: 101,
            routeId: 1,
            routeName: 'Mumbai to Pune Express',
            fromLocation: 'Mumbai',
            toLocation: 'Pune',
            scheduleDate: '2026-02-20',
            departureTime: '06:00',
            arrivalTime: '10:30',
            seatNumbers: [15],
            totalPrice: 375,
            status: 'CONFIRMED',
            bookingTime: '2026-02-17T10:30:00'
        },
        {
            id: 102,
            routeId: 1,
            routeName: 'Mumbai to Pune Express',
            fromLocation: 'Mumbai',
            toLocation: 'Pune',
            scheduleDate: '2026-02-22',
            departureTime: '06:00',
            arrivalTime: '10:30',
            seatNumbers: [18],
            totalPrice: 375,
            status: 'CONFIRMED',
            bookingTime: '2026-02-17T14:15:00'
        }
    ],
    complaints: [],
    bookedSeats: {},
    feedbacks: []
};

const seatConfigurations = {
    'seater': {
        rows: 10,
        columns: 4,
        layout: [1, 0, 2, 1]
    },
    'sleeper': {
        rows: 8,
        columns: 4,
        layout: [1, 0, 2, 1]
    },
    'semi-sleeper': {
        rows: 9,
        columns: 4,
        layout: [2, 0, 2, 0]
    }
};

/**
 * Get high-rated testimonials (4 stars and above)
 */
async function getTestimonials() {
    // In a real app, this would be an API call to fetch approved/high-rated feedbacks
    if (!USE_BACKEND_API) {
        return dummyData.feedbacks.filter(f => f.rating >= 4);
    }

    try {
        // Mocking API call for now since backend might not have this endpoint yet
        // const response = await apiGet('/feedbacks/testimonials');
        // return response.data || response;
        return dummyData.feedbacks.filter(f => f.rating >= 4);
    } catch (error) {
        console.warn('Failed to fetch testimonials, using dummy data:', error);
        return dummyData.feedbacks.filter(f => f.rating >= 4);
    }
}

/**
 * Get all routes from backend or dummy data
 */
/**
 * Map backend SearchResponse to frontend route model
 * Backend returns: scheduleId, vehicleId, vehicleName, vehicleNumber, vehicleType,
 *                  busType, fromLocation, toLocation, scheduleDate, departureTime,
 *                  arrivalTime, price, availableSeats, ownerId, ownerName, agencyName
 */
function mapBackendRouteToFrontend(backendRoute) {
    if (!backendRoute) return null;

    const duration = calculateDuration(backendRoute.departureTime || '09:00', backendRoute.arrivalTime || '17:00');

    return {
        id: backendRoute.scheduleId || backendRoute.id,
        vehicleId: backendRoute.vehicleId,
        scheduleId: backendRoute.scheduleId || backendRoute.id,
        from: backendRoute.fromLocation || backendRoute.from || 'Unknown',
        to: backendRoute.toLocation || backendRoute.to || 'Unknown',
        type: (backendRoute.vehicleType || backendRoute.type || 'bus').toLowerCase(),
        name: backendRoute.vehicleName || backendRoute.name || 'Express Service',
        vehicleNumber: backendRoute.vehicleNumber || '',
        busType: backendRoute.busType || '',
        departureTime: backendRoute.departureTime || '09:00',
        arrivalTime: backendRoute.arrivalTime || '17:00',
        duration: duration,
        scheduleDate: backendRoute.scheduleDate || '',
        price: backendRoute.price || 0,
        availableSeats: backendRoute.availableSeats || 0,
        totalSeats: backendRoute.totalSeats || (seatConfigurations[(backendRoute.vehicleType || backendRoute.type || 'bus').toLowerCase()] ? seatConfigurations[(backendRoute.vehicleType || backendRoute.type || 'bus').toLowerCase()].rows * seatConfigurations[(backendRoute.vehicleType || backendRoute.type || 'bus').toLowerCase()].columns : 40),
        ownerName: backendRoute.ownerName || '',
        agencyName: backendRoute.agencyName || ''
    };
}

/**
 * Helper to calculate duration between two time strings (HH:mm or HH:mm:ss)
 */
function calculateDuration(startTime, endTime) {
    try {
        const start = parseTime(startTime);
        const end = parseTime(endTime);

        let diffMinutes = end - start;
        if (diffMinutes < 0) {
            diffMinutes += 24 * 60; // Handle overnight trips
        }

        const hours = Math.floor(diffMinutes / 60);
        const minutes = diffMinutes % 60;

        return `${hours}h ${minutes}m`;
    } catch (e) {
        return 'N/A';
    }
}

function parseTime(timeStr) {
    const [time, modifier] = timeStr.split(' ');
    let [hours, minutes] = time.split(':');
    hours = parseInt(hours);
    minutes = parseInt(minutes);

    if (hours === 12 && modifier === 'AM') {
        hours = 0;
    }
    if (hours !== 12 && modifier === 'PM') {
        hours += 12;
    }

    return hours * 60 + minutes;
}


/**
 * Get all routes/schedules from backend
 */
async function getRoutes() {
    if (!USE_BACKEND_API) {
        return dummyData.routes;
    }

    try {
        const response = await apiGet(API_ENDPOINTS.ROUTES);
        const data = response.data || response;

        if (Array.isArray(data)) {
            return data.map(mapBackendRouteToFrontend);
        }
        return [];
    } catch (error) {
        console.error('Failed to fetch routes from API:', error);
        return [];
    }
}

/**
 * Filter routes by type
 */
async function filterRoutesByType(type) {
    if (!USE_BACKEND_API) return []; // No dummy data

    try {
        const response = await apiGet(`${API_ENDPOINTS.ROUTES}?type=${type}`);
        const data = response.data || response;
        if (Array.isArray(data)) {
            return data.map(mapBackendRouteToFrontend);
        }
        return [];
    } catch (error) {
        console.error('Failed to filter routes:', error);
        throw error;
    }
}

/**
 * Get a single route/schedule by its scheduleId
 * Tries direct endpoint first, falls back to scanning all routes
 */
async function getRouteById(id) {
    if (!id || id === 'undefined' || id === 'null') return null;

    // Backend doesn't support /public/routes/{id} directly, so fetch all schedules 
    // and filter locally. This is standard for this simple backend setup.
    if (!USE_BACKEND_API) {
        // Fallback for dummy data
        const allRoutes = await getRoutes();
        const found = allRoutes.find(r => String(r.scheduleId) === String(id) || String(r.id) === String(id));
        return found || null;
    }

    try {
        const allRoutes = await getRoutes();
        const found = allRoutes.find(r => String(r.scheduleId) === String(id) || String(r.id) === String(id));
        return found || null;
    } catch (error) {
        console.error('Failed to fetch route by ID:', error);
        throw error;
    }
}


// ... (skipping getBookedSeats/createBooking as they handle different data)

/**
 * Search routes (with filters)
 * Backend returns a Spring Page object: { content: [...], totalElements, totalPages, ... }
 */
async function searchRoutes(from, to, date, vehicleType) {
    if (!USE_BACKEND_API) {
        let results = filterRoutesLocally(dummyData.routes, from, to);
        // Filter by type if specified
        if (vehicleType && vehicleType !== 'all') {
            results = results.filter(r => (r.type || '').toLowerCase() === vehicleType.toLowerCase());
        }
        return results;
    }

    try {
        const params = new URLSearchParams();
        if (from) params.append('from', from.trim());
        if (to) params.append('to', to.trim());
        if (date) params.append('date', date);
        if (vehicleType && vehicleType !== 'all') params.append('type', vehicleType.toLowerCase());

        const endpoint = `${API_ENDPOINTS.ROUTES_SEARCH}?${params.toString()}`;
        const response = await apiGet(endpoint);

        // Spring Page response has a 'content' array with the actual results
        let data = [];
        if (response && Array.isArray(response.content)) {
            data = response.content;
        } else if (response && Array.isArray(response.data)) {
            data = response.data;
        } else if (Array.isArray(response)) {
            data = response;
        }

        // Map backend data to frontend model
        let results = data.map(mapBackendRouteToFrontend).filter(r => r !== null);

        // Client-side safety filter: ensure only the selected vehicle type is returned
        // (in case the backend does not support the 'type' query parameter yet)
        if (vehicleType && vehicleType !== 'all') {
            results = results.filter(r => (r.type || '').toLowerCase() === vehicleType.toLowerCase());
        }

        return results;
    } catch (error) {
        console.error('Failed to search routes API:', error);
        throw error;
    }
}

/**
 * Get booked seats for a schedule
 * Returns array of booked seat numbers (as integers)
 */
async function getBookedSeats(scheduleId) {
    if (!USE_BACKEND_API) return [];

    try {
        const response = await apiGet(API_ENDPOINTS.BOOKED_SEATS(scheduleId));
        const data = response.data || response;
        // Backend may return array of seat numbers or objects with seatNumber field
        if (Array.isArray(data)) {
            return data.map(s => typeof s === 'object' ? parseInt(s.seatNumber) : parseInt(s));
        }
        return [];
    } catch (error) {
        // If endpoint doesn't exist yet, return empty (no seats booked)
        console.warn('Could not fetch booked seats (endpoint may not exist):', error.message);
        return [];
    }
}

/**
 * Create a booking
 */
async function createBooking(routeId, seats) {
    if (!USE_BACKEND_API) throw new Error("Backend required");

    try {
        const bookingData = {
            routeId: routeId,
            seatNumbers: seats
        };
        const response = await apiPost(API_ENDPOINTS.BOOKINGS, bookingData);
        return {
            success: true,
            bookingId: response.id || response.bookingId,
            data: response,
            message: 'Booking confirmed'
        };
    } catch (error) {
        console.error('Failed to create booking:', error);
        throw error;
    }
}

/**
 * Get user bookings
 */
async function getUserBookings() {
    if (!USE_BACKEND_API) return dummyData.bookings;

    try {
        const response = await apiGet(API_ENDPOINTS.BOOKINGS);
        const data = response.data || response;

        if (Array.isArray(data)) {
            return data;
        }
        return [];
    } catch (error) {
        console.error('Failed to fetch bookings:', error);
        return [];
    }
}

/**
 * User/Owner Authentication
 */
async function login(email, password) {
    if (!USE_BACKEND_API) throw new Error("Backend required");

    try {
        const loginData = {
            email: email,
            password: password
        };
        const response = await apiPost(API_ENDPOINTS.LOGIN, loginData);

        return {
            success: true,
            user: {
                id: response.userId || response.id,
                name: response.name || response.userName,
                email: response.email || (response.user && response.user.email),
                // Try to find role in various places: top-level, inside user object, or authorities array
                role: response.role ||
                    (response.user && response.user.role) ||
                    (response.roles && response.roles[0]) ||
                    (response.authorities && response.authorities[0] && response.authorities[0].authority) ||
                    'user'
            },
            token: response.token || response.jwt
        };
    } catch (error) {
        console.error('Login failed:', error);
        throw error;
    }
}

/**
 * Register User
 */
async function registerUser(userData) {
    if (!USE_BACKEND_API) throw new Error("Backend required");

    try {
        const response = await apiPost(API_ENDPOINTS.REGISTER_USER, userData);
        return {
            success: true,
            data: response,
            message: 'User registered successfully'
        };
    } catch (error) {
        console.error('User registration failed:', error);
        throw error;
    }
}

/**
 * Register Owner (with image upload)
 */
async function registerOwner(ownerData, imageFile) {
    if (!USE_BACKEND_API) throw new Error("Backend required");

    try {
        const formData = new FormData();
        formData.append('ownerName', ownerData.ownerName);
        formData.append('name', ownerData.ownerName); // Alias: Backend might expect 'name'
        formData.append('agencyName', ownerData.agencyName);
        formData.append('agency', ownerData.agencyName); // Alias: Backend might expect 'agency'
        formData.append('email', ownerData.email);
        formData.append('phone', ownerData.phone); // Fix: Append missing phone number
        formData.append('password', ownerData.password);
        formData.append('role', 'OWNER'); // Fix: Append missing ROLE
        if (imageFile) {
            formData.append('image', imageFile);
        }

        const response = await apiUploadFile(API_ENDPOINTS.REGISTER_OWNER, formData);
        return {
            success: true,
            data: response,
            message: 'Owner registered successfully'
        };
    } catch (error) {
        console.error('Owner registration failed:', error);
        throw error;
    }
}

/**
 * Search routes (with filters)
 */
// Helper for strict local filtering
function filterRoutesLocally(routes, from, to) {
    const fromTerm = from ? from.toLowerCase().trim() : '';
    const toTerm = to ? to.toLowerCase().trim() : '';

    return routes.filter(route => {
        const routeFrom = route.from.toLowerCase().trim();
        const routeTo = route.to.toLowerCase().trim();

        // If search term exists, it must match strictly
        const matchFrom = !fromTerm || routeFrom === fromTerm;
        const matchTo = !toTerm || routeTo === toTerm;

        // Log for debugging (only if actively filtering)
        if (fromTerm || toTerm) {
            console.log(`Checking route ${route.id}: ${routeFrom}->${routeTo} vs Search: ${fromTerm}->${toTerm} => ${matchFrom && matchTo}`);
        }

        return matchFrom && matchTo;
    });
}



// Export everything
const dummyRoutes = dummyData.routes;
const dummyUsers = dummyData.users;
const dummyOwners = dummyData.owners;
const dummyBookings = dummyData.bookings;
const dummyComplaints = dummyData.complaints;
const bookedSeats = dummyData.bookedSeats;



if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        dummyRoutes,
        seatConfigurations,
        bookedSeats,
        dummyUsers,
        dummyOwners,
        dummyBookings,
        dummyComplaints,
        getRoutes,
        filterRoutesByType,
        getRouteById,
        getBookedSeats,
        createBooking,
        getUserBookings,
        login,
        registerUser,
        registerOwner,
        searchRoutes,
        getTestimonials
    };
}
