/**
 * YatraNow - Seats Module
 * Handles seat layout generation and selection logic
 */

/**
 * Generate seat layout based on vehicle type
 * @param {string} vehicleType - Type of vehicle (seater, sleeper, semi-sleeper)
 * @param {number} totalSeats - Total number of seats
 * @returns {Array} Seat layout configuration
 */
function generateSeatLayoutConfig(vehicleType, totalSeats) {
    const configs = {
        'seater': {
            seatsPerRow: 4,
            layout: [1, 0, 2, 1] // 1 seat, aisle, 2 seats, 1 seat
        },
        'sleeper': {
            seatsPerRow: 4,
            layout: [1, 0, 2, 1]
        },
        'semi-sleeper': {
            seatsPerRow: 4,
            layout: [2, 0, 2, 0] // 2 seats, aisle, 2 seats
        }
    };

    return configs[vehicleType] || configs['seater'];
}

/**
 * Calculate booking price
 * @param {number} pricePerSeat - Price per seat
 * @param {Array} selectedSeats - Array of selected seat numbers
 * @returns {number} Total price
 */
function calculateBookingPrice(pricePerSeat, selectedSeats) {
    return pricePerSeat * selectedSeats.length;
}

/**
 * Validate seat selection
 * @param {Array} selectedSeats - Array of selected seat numbers
 * @param {number} maxSeats - Maximum allowed seats per booking
 * @returns {Object} Validation result
 */
function validateSeatSelection(selectedSeats, maxSeats = 3) {
    if (selectedSeats.length === 0) {
        return {
            valid: false,
            message: 'Please select at least one seat'
        };
    }

    if (selectedSeats.length > maxSeats) {
        return {
            valid: false,
            message: `You can only book up to ${maxSeats} seats at once`
        };
    }

    return {
        valid: true,
        message: 'Valid selection'
    };
}

/**
 * Export functions
 */
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        generateSeatLayoutConfig,
        calculateBookingPrice,
        validateSeatSelection
    };
}
