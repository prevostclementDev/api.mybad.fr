let express = require('express');
let router = express.Router();

const hal = require('../services/response/hal');
const CustomError = require('../services/response/CustomError');

const reservationModel = require('../models/reservationModel');
const unavailabilityModel = require('../models/courtUnavailabilityModel');

// ###################################
//        GET ALL RESERVATION
// ###################################
router.get('/reservations', async function (req, res, next) {

    if ( res.locals.user ) {

        let reservations;

        try {

            let options = {
                where :{
                    id_user : res.locals.user.data.id
                }
            }

            if ( res.locals.user.data.type == 'admin' ) {
                options = {};
            }

            reservations = await reservationModel.findAll(options);
        } catch (e) {

            res.status(500).json(
                new CustomError("500")
                    .toHal()
                    .addDefaultLinks('get-all-reservations',true)
                    .addDefaultLinks('get-all-reservations-by-court')
                    .addDefaultLinks('get-one-court')
                    .render()
            ).end();
            return;

        }

        res.json(
            new hal()
                .addEmbedded('reservations',reservations)
                .addDefaultLinks('get-all-reservations',true)
                .addDefaultLinks('get-all-reservations-by-court')
                .addDefaultLinks('get-one-court')
                .addGlobalProperty('count',reservations.length)
                .render()
        ).end();

    } else {

        res.status(500).json(
            new CustomError("500")
                .toHal()
                .addDefaultLinks('get-all-reservations',true)
                .addDefaultLinks('get-all-reservations-by-court')
                .addDefaultLinks('get-one-court')
                .render()
        ).end();

    }

});

// ###################################
//     GET ALL UNAVAILABILITY
// ###################################
router.get('/unavailability', async function (req, res, next) {

    if ( res.locals.user ) {

        let unavailability;

        try {
            unavailability = await unavailabilityModel.findAll();
        } catch (e) {

            res.status(500).json(
                new CustomError("500")
                    .toHal()
                    .addDefaultLinks('get-all-unavailability',true)
                    .addDefaultLinks('get-all-reservations-by-court')
                    .render()
            ).end();
            return;

        }

        res.json(
            new hal()
                .addEmbedded('unavailability',unavailability)
                .addDefaultLinks('get-all-unavailability',true)
                .addDefaultLinks('get-all-reservations-by-court')
                .addGlobalProperty('count',unavailability.length)
                .render()
        ).end();

    } else {

        res.status(500).json(
            new CustomError("500")
                .toHal()
                .addDefaultLinks('get-all-unavailability',true)
                .addDefaultLinks('get-all-reservations-by-court')
                .render()
        ).end();

    }

});

module.exports = router;