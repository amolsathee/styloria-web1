const express = require('express');
const router = express.Router();
const {
    createBooking,
    getAllBookings,
    getUserBookings,
    updateBookingStatus
} = require('../controllers/bookingController');

router.post('/', createBooking);
router.get('/', getAllBookings);
router.get('/user', getUserBookings);
router.patch('/:id/status', updateBookingStatus);

module.exports = router;
