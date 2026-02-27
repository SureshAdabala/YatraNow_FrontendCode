/**
 * YatraNow - Authentication Module
 * Handles login, registration, and session management
 */

// Check if user is already logged in
function checkAuth() {
    const user = localStorage.getItem('yatraNowUser');
    return user ? JSON.parse(user) : null;
}

// Logout user
function logout() {
    localStorage.removeItem('yatraNowUser');
    window.location.href = '../index.html';
}

// Protect routes (redirect to login if not authenticated)
function requireAuth() {
    const user = checkAuth();
    if (!user) {
        window.location.href = 'login.html';
        return false;
    }
    return user;
}

// Require specific role
// Require specific role
function requireRole(requiredRole) {
    const user = requireAuth();
    if (!user) return false;

    const userRole = (user.role || '').toUpperCase().trim();
    const reqRole = requiredRole.toUpperCase().trim();

    // Check strict match or ROLE_ prefix match
    if (userRole !== reqRole && userRole !== `ROLE_${reqRole}`) {
        window.location.href = '../index.html';
        return false;
    }
    return user;
}

/**
 * Export functions
 */
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        checkAuth,
        logout,
        requireAuth,
        requireRole
    };
}
