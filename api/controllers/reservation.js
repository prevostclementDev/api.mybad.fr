let express = require('express');
let router = express.Router({ mergeParams: true });

const hal = require('../services/response/hal');
const CustomError = require("../services/response/CustomError");

const badmintonCourtModel = require("../models/badmintonCourtModel");
const reservationModel = require("../models/reservationModel");

const { courtIsAvailable, getSlotHours } = require('../services/helper');

// #############################################################################
//     GET ALL RESERVATION FOR COURT (admin) else only person reservation
// #############################################################################
router.get('/', async function (req, res, next) {

    if ( res.locals.user && req.params.id ) {

        let reservations;

        try {
            reservations = await reservationModel.findAll({ where : { id_court : req.params.id, id_user : res.locals.user.data.id } })
        } catch (e) {
            res.status(500).json(
                new CustomError("500",e)
                    .toHal()
                    .addDefaultLinks('get-all-reservations-by-court', true)
                    .addDefaultLinks('get-reservation-details')
                    .addDefaultLinks('create-reservation')
                    .render()
            ).end();
            return;
        }

        for (const reservation of reservations) {
            reservation.dataValues.aboutSlot = await getSlotHours( reservation.slot , new Date( reservation.date ) );
        }

        res.json(
            new hal()
                .addEmbedded('reservations' , reservations)
                .addGlobalProperty('count', reservations.length)
                .addDefaultLinks('get-all-reservations-by-court', true)
                .addDefaultLinks('get-reservation-details')
                .addDefaultLinks('create-reservation')
                .render()
        ).end();

    } else {

        res.status(422).json(
            new CustomError("422")
                .toHal()
                .addDefaultLinks('get-all-reservations-by-court', true)
                .addDefaultLinks('get-reservation-details')
                .addDefaultLinks('create-reservation')
                .render()
        ).end()

    }

});

// #################################################
//     GET SPECIFIC INFO ABOUT RESERVATION
// #################################################
router.get('/:id_reservation([0-9]+)', async function (req, res, next) {

    if ( res.locals.user && req.params.id && req.params.id_reservation ) {

        let reservation;

        try {
            reservation = await reservationModel.findByPk(req.params.id_reservation);
        } catch (e) {
            res.status(500).json(
                new CustomError("500")
                    .toHal()
                    .addDefaultLinks('get-reservation-details', true)
                    .addDefaultLinks('cancel-reservation')
                    .addDefaultLinks('create-reservation')
                    .render()
            ).end();
            return;
        }

        if ( reservation  && reservation.id_user == res.locals.user.data.id && reservation.id_court == req.params.id ) {

            reservation.dataValues.aboutSlot = await getSlotHours( reservation.slot , new Date( reservation.date ) );

            res.json(
                new hal()
                .addEmbedded('reservation',reservation)
                .addDefaultLinks('get-reservation-details', true)
                .addDefaultLinks('cancel-reservation')
                 .addDefaultLinks('create-reservation')
                .render()
            ).end();

        } else {

            res.status(404).json(
                new CustomError("404")
                    .toHal()
                    .addDefaultLinks('get-reservation-details', true)
                    .addDefaultLinks('cancel-reservation')
                    .addDefaultLinks('create-reservation')
                    .render()
            ).end();

        }

    } else {

        res.status(422).json( new CustomError("422")
            .toHal()
            .addDefaultLinks('get-reservation-details', true)
            .addDefaultLinks('cancel-reservation')
            .addDefaultLinks('create-reservation')
            .render()
        ).end()

    }

});

// #################################################
//     ADD RESERVATION FOR SPECIFIC COURT
// #################################################
router.post('/', async function (req, res, next) {

    if ( req.body.day && ! isNaN( new Date( req.body.day ) ) && req.body.slot && res.locals.user && req.params.id ) {

        let court;

        try {
            court = await badmintonCourtModel.findByPk( parseInt( req.params.id ) );
        } catch (e) {
            res.status(500).json(
                new CustomError("500")
                    .toHal()
                    .addDefaultLinks('create-reservation', true)
                    .addDefaultLinks('cancel-reservation')
                    .addDefaultLinks('get-reservation-details')
                    .render()
            ).end();
            return;
        }

        if ( court ) {

            if ( await courtIsAvailable( court.id , new Date( req.body.day ) , req.body.slot ) ) {

                try {

                    const newReservation = await reservationModel.create({
                        id_court : req.params.id,
                        slot : req.body.slot,
                        date : req.body.day+' 01:00:00',
                        id_user : res.locals.user.data.id
                    })

                    res.json(
                        new hal()
                            .addEmbedded('reservation',newReservation)
                            .addDefaultLinks('create-reservation', true)
                            .addDefaultLinks('cancel-reservation')
                            .addDefaultLinks('get-reservation-details')
                            .render()
                    ).end();
                    return;

                } catch (e) {
                    res.status(500).json(
                        new CustomError("500")
                            .toHal()
                            .addDefaultLinks('create-reservation', true)
                            .addDefaultLinks('cancel-reservation')
                            .addDefaultLinks('get-reservation-details')
                            .render()
                    ).end();
                    return;
                }

            }

        } else {

            res.status(404).json(
                new CustomError("404",'Le terrain que vous chercher n\'existe pas')
                    .toHal()
                    .addDefaultLinks('create-reservation', true)
                    .addDefaultLinks('cancel-reservation')
                    .addDefaultLinks('get-reservation-details')
                    .render()
            ).end();
            return;

        }

    }

    res.status(422).json(
        new CustomError('422')
            .toHal()
            .addDefaultLinks('create-reservation', true)
            .addDefaultLinks('cancel-reservation')
            .addDefaultLinks('get-reservation-details')
            .render()
    ).end();

});

// #################################################
//               REMOVE RESERVATION
// #################################################
router.delete('/:id_reservation([0-9]+)', async function (req, res, next) {

    if ( req.params.id && req.params.id_reservation && res.locals.user ) {

        let deleteReservation;

        try {
            deleteReservation = await reservationModel.destroy({ where :
                    {
                        id_user : res.locals.user.data.id ,
                        id_court : req.params.id ,
                        id : req.params.id_reservation
                    }
                }
            );
        } catch (e) {
            res.status(500).json(
                new CustomError('500')
                    .toHal()
                    .addDefaultLinks('cancel-reservation', true)
                    .addDefaultLinks('get-all-reservations')
                    .addDefaultLinks('get-reservation-details')
                    .render()
            ).end();
            return;
        }

        if ( deleteReservation > 0 ) {
            res.json(
                new hal()
                    .addEmbedded('status',true)
                    .addEmbedded('message','La reservation n°'+req.params.id_reservation+' à était annulé')
                    .addDefaultLinks('cancel-reservation', true)
                    .addDefaultLinks('get-all-reservations')
                    .addDefaultLinks('get-reservation-details')
                    .render()
            ).end();
        } else {
            res.status(404).json(
                new CustomError("404")
                    .toHal()
                    .addDefaultLinks('cancel-reservation', true)
                    .addDefaultLinks('get-all-reservations')
                    .addDefaultLinks('get-reservation-details')
                    .render()
            ).end();
        }

    } else {

        res.status(422).json(
            new CustomError("422")
                .toHal()
                .addDefaultLinks('cancel-reservation', true)
                .addDefaultLinks('get-all-reservations')
                .addDefaultLinks('get-reservation-details')
                .render()
        ).end();

    }

});

module.exports = router;
