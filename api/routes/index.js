const badmintonController = require('../controllers/badmintonCourt');
const reservationController = require('../controllers/reservation');
const unavailabilityController = require('../controllers/unavailability');
const authController = require('../controllers/auth');
const globalController = require('../controllers/global');

let express = require('express');
let router = express.Router({ mergeParams : true });

router.use('/badminton-court', badmintonController);
router.use('/badminton-court/:id([0-9]+)/reservations', reservationController);
router.use('/badminton-court/:id([0-9]+)/unavailability', unavailabilityController);
router.use('/auth', authController);
router.use('/badminton-court', globalController);

module.exports = router;