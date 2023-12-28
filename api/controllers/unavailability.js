let express = require('express');
let router = express.Router({ mergeParams : true });

const CustomError = require('../services/response/CustomError');
const hal = require('../services/response/hal');

const unavailabilityModel = require('../models/courtUnavailabilityModel');

// ###################################
//     GET UNAVAILABILITY BY COURT
// ###################################
router.get('/', async function (req, res, next) {

    if ( req.params.id ) {

        let unavailability;

        try {
            unavailability = await unavailabilityModel.findAll( { where :  { id_court : req.params.id } } );
        } catch (e) {
            res.status(500).json(
                new CustomError("500")
                    .toHal()
                    .addDefaultLinks('get-all-unavailability-by-court', true)
                    .addDefaultLinks('add-unavailability')
                    .addDefaultLinks('get-all-unavailability')
                    .render()
            ).end();
            return;
        }

        if ( unavailability.length > 0 ) {
            res.json(
                new hal()
                    .addEmbedded('unavailability',unavailability)
                    .addDefaultLinks('get-all-unavailability-by-court', true)
                    .addDefaultLinks('add-unavailability')
                    .addDefaultLinks('get-all-unavailability')
                    .render()
            ).end();
        } else {
            res.status(404).json(
                new CustomError('404')
                    .toHal()
                    .addDefaultLinks('get-all-unavailability-by-court', true)
                    .addDefaultLinks('add-unavailability')
                    .addDefaultLinks('get-all-unavailability')
                    .render()
            );
        }

    } else {

        res.status(422).json(
            new CustomError('422')
                .toHal()
                .addDefaultLinks('get-all-unavailability-by-court', true)
                .addDefaultLinks('add-unavailability')
                .addDefaultLinks('get-all-unavailability')
                .render()
        );

    }

});

// ###################################
//   CREATE UNAVAILABILITY FOR COURT
// ###################################
router.post('/', async function (req, res, next) {

    if ( req.params.id && req.body.start_date && req.body.end_date ) {

        let unavailability;

        try {
            unavailability = await unavailabilityModel.findOne( {
                where : {
                    id_court: req.params.id,
                    start_date_unavailability : new Date( req.body.start_date ),
                    end_date_unavailability : new Date( req.body.end_date )
                }
            } )
        } catch (e) {
            res.status(500).json(
                new CustomError("500")
                    .toHal()
                    .addDefaultLinks('add-unavailability', true)
                    .addDefaultLinks('remove-unavailability')
                    .addDefaultLinks('get-all-unavailability')
                    .render()
            ).end();
            return;
        }


        if( unavailability !== null ) {
            res.status(409).json(
                new CustomError("409")
                    .toHal()
                    .addDefaultLinks('add-unavailability', true)
                    .addDefaultLinks('remove-unavailability')
                    .addDefaultLinks('get-all-unavailability')
                    .render()
            ).end();
            return;
        }

        try {
            unavailability = await unavailabilityModel.create({
                id_court: req.params.id,
                start_date_unavailability : req.body.start_date,
                end_date_unavailability : req.body.end_date
            });
        } catch (e) {
            res.status(500).json(
                new CustomError("500")
                    .toHal()
                    .addDefaultLinks('add-unavailability', true)
                    .addDefaultLinks('remove-unavailability')
                    .addDefaultLinks('get-all-unavailability')
                    .render()
            ).end();
            return;
        }

        res.json(
            new hal()
                .addEmbedded('unavailability',unavailability)
                .addDefaultLinks('add-unavailability', true)
                .addDefaultLinks('remove-unavailability')
                .addDefaultLinks('get-all-unavailability')
                .render()
        ).end();
        return;

    }

    res.status(422).json(
        new CustomError("422")
            .toHal()
            .addDefaultLinks('add-unavailability', true)
            .addDefaultLinks('remove-unavailability')
            .addDefaultLinks('get-all-unavailability')
            .render()
    ).end();

});

// ###################################
//   DELETE UNAVAILABILITY BY COURT
// ###################################
router.delete('/:id_unavailability([0-9]+)', async function (req, res, next) {

    if ( req.params.id && req.params.id_unavailability ) {

        let deleteUnavailability;

        try {
            deleteUnavailability = await unavailabilityModel.destroy({ where : {
                    id_court : req.params.id ,
                    id : req.params.id_unavailability
                }
            })
        } catch (e) {
            res.status(500).json(
                new CustomError("500")
                    .toHal()
                    .addDefaultLinks('remove-unavailability', true)
                    .addDefaultLinks('add-unavailability')
                    .addDefaultLinks('get-all-unavailability')
                    .render()
            ).end();
            return;
        }

        if( deleteUnavailability > 0 ) {
            res.json(
                new hal()
                    .addEmbedded('status',true)
                    .addEmbedded('message','L\'invalidité du terrain n°'+req.params.id+' à était annulé')
                    .addDefaultLinks('remove-unavailability', true)
                    .addDefaultLinks('add-unavailability')
                    .addDefaultLinks('get-all-unavailability')
                    .render()
            ).end();
        } else {
            res.status(404).json(
                new CustomError("404")
                    .toHal()
                    .addDefaultLinks('remove-unavailability', true)
                    .addDefaultLinks('add-unavailability')
                    .addDefaultLinks('get-all-unavailability')
                    .render()
            ).end();
        }

    } else {

        res.status(422).json(
            new CustomError("422")
                .toHal()
                .addDefaultLinks('remove-unavailability', true)
                .addDefaultLinks('add-unavailability')
                .addDefaultLinks('get-all-unavailability')
                .render()
        ).end();

    }

});

module.exports = router;
