/**
 * YatraNow - Dashboard Module
 * Handles filtering, sorting, and rendering of routes
 */

/**
 * Initialize dashboard
 */
function initDashboard() {
    // Set default date to today
    const dateInput = document.getElementById('searchDate');
    if (dateInput) {
        const today = new Date().toISOString().split('T')[0];
        dateInput.value = today;
    }
}

// Call on page load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initDashboard);
} else {
    initDashboard();
}

/**
 * Export functions
 */
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initDashboard
    };
}
