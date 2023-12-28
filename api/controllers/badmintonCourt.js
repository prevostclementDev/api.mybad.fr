let express = require('express');
let router = express.Router();

const badmintonCourtModel = require('../models/badmintonCourtModel');
const { getSlotsByCourt } = require('../services/helper');

const hal = require('../services/response/hal');
const CustomError = require('../services/response/CustomError');

// ###################################
//         LIST OF COURT
// ###################################
router.get('/', async function (req, res, next) {

    try {

        const badmintonCourt = await badmintonCourtModel.findAll();

        res.json(
            new hal()
                .addEmbedded('badmintonCourts',badmintonCourt)
                .addDefaultLinks('get-all-courts', true)
                .addDefaultLinks('get-one-court')
                .addGlobalProperty('count',badmintonCourt.length)
                .render()
        );

    } catch (e) {

        res.status(500).json(
          new CustomError("500")
              .toHal()
              .addDefaultLinks('get-all-courts', true)
              .addDefaultLinks('get-one-court')
              .render()
        );

    }

});

// ###################################
//    DATA OF ONE COURT WITH SLOT
// ###################################
router.get('/:id([0-9]+)', async function (req, res, next) {

    let court;

    try {
        court = await badmintonCourtModel.findByPk( parseInt( req.params.id ) );
    } catch (e) {
        res.status(500).json(
            new CustomError("500",e)
                .toHal()
                    .addDefaultLinks('get-one-court', true)
                    .addDefaultLinks('create-reservation')
                    .addDefaultLinks('get-auth-token')
                    .render()
        ).end();
        return;
    }

    if ( court ) {

        let now = (req.query.start_date_slot) ? new Date( req.query.start_date_slot ) : new Date();
        let addToNow = new Date( now );

        addToNow.setDate( now.getDate() + 5 )

        const slotForCourt = await getSlotsByCourt( court.id , now , ( req.query.end_date_slot ) ? new Date( req.query.end_date_slot ) : addToNow );

        res.json(
            new hal()
                .addEmbedded('court',court)
                .addEmbedded('slots',slotForCourt)
                .addDefaultLinks('get-one-court', true)
                .addDefaultLinks('create-reservation')
                .addDefaultLinks('get-auth-token')
                .render()
        ).end();

    } else {

        res.status(404).json(
            new CustomError("404")
            .toHal()
                .addDefaultLinks('get-one-court', true)
                .addDefaultLinks('create-reservation')
                .addDefaultLinks('get-auth-token')
                .render()
        ).end();

    }

});

module.exports = router;
