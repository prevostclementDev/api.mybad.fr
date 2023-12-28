const optionsModel = require('../models/optionsModel');
const hourlyModel = require('../models/hourlyModel');
const badmintonCourtModel = require('../models/badmintonCourtModel');
const reservationModel = require('../models/reservationModel');
const unavailabilityModel = require('../models/courtUnavailabilityModel');
const { Op } = require("sequelize");

// get all slot available for a court
// court : id of a court
// startDay : object Date
// endDay : Object Date
exports.getSlotsByCourt = async function ( court, startDay , endDay ) {

    let result = [];
    let loop = new Date(startDay);
    let dayData = [];

    while(loop <= endDay){

        const hoursForThisDay = await exports.getHoursDay( new Date(loop) );
        const nbSlot = await exports.getNumberSlot( hoursForThisDay.openTime , hoursForThisDay.closeTime );

        dayData.push( {hoursData : hoursForThisDay, nbSlot:nbSlot} );

        result.push(
            await exports.getSlotForDay( new Date(loop) , hoursForThisDay )
        )

        let newDate = loop.setDate(loop.getDate() + 1);
        loop = new Date(newDate);

    }

    result = await helper_manage_result_getSlotsByCourt( result, court, dayData );

    return result;

}

// Helper function for set result of exports.getSlotsByCourt
async function helper_manage_result_getSlotsByCourt ( result, court, dayData ) {

    for ( let key in result ) {

        if ( ! result[key].slots ) {
            result[key].slots = null;
            continue;
        }

        for ( let keySlot in result[key].slots ) {

            if ( ! await exports.courtIsAvailable( court , result[key].slotDay.toISOString().split('T')[0]  , result[key].slots[keySlot].slot_id , dayData[key].hoursData , dayData[key].nbSlot ) ) {

                delete result[key].slots[keySlot];

            }

        }

    }

    return result;

}

// get all slot for a day
// day : Object Date
exports.getSlotForDay = async function ( day , hoursDay = false ) {

    const {openTime, closeTime} = ( hoursDay !== false ) ? hoursDay : await exports.getHoursDay( day ) ;

    let slotReturn = { slotDay : day, slots : [] };

    if ( openTime &&  closeTime ) {

        // split open time
        const splitOpenTime = openTime.split(':');

        const minSession = await exports.getSessionTime();

        const slotNumber = await exports.getNumberSlot(openTime,closeTime);

        day.setHours(splitOpenTime[0], splitOpenTime[1], splitOpenTime[2]);

        for (let i = 0; i < slotNumber; i++) {

            let timeStart = day.toLocaleString('fr-fr');
            day.setMinutes(day.getMinutes() + minSession);

            slotReturn.slots.push(
                {
                    slot_id: i + 1,
                    timeStart: timeStart,
                    timeEnd: day.toLocaleString('fr-fr'),
                }
            )
        }

    } else {

        slotReturn.slots = false;

    }

    return slotReturn;
}

// get format hours for a slot (start , end)
// day : Object date
// slot : number
exports.getSlotHours = async function ( slot_id , day ) {

    const daySlot = await exports.getSlotForDay( day );

    let slotHours = null;

    daySlot.slots.forEach(slot => {

        if ( slot.slot_id === slot_id ) {
            slotHours = slot;
        }

    })

    return slotHours;

}

// get nb slot for a day
exports.getNumberSlot = async function ( openTime,closeTime ) {

    const minSession = await exports.getSessionTime();

    return (((new Date("01/01/2001 " + closeTime).getTime() - new Date("01/01/2001 " + openTime).getTime()) / 1000) / 60) / minSession;
}

// get minute duration of a reservation session
exports.getSessionTime = async function () {
    const {opt_value} = await optionsModel.findOne({where: {opt_key: 'reservationTime'}});
    const splitReservationTime = opt_value.split(':');
    return ( parseInt(splitReservationTime[0]) * 60 ) + parseInt(splitReservationTime[1]);
}

// get openHours and close hours of a day
exports.getHoursDay = async function ( day ) {
    return await hourlyModel.findOne( { where: { day: day.toLocaleString('en-us', {weekday: "short"}) } } );
}

// Check if court is available for a specific slot
exports.courtIsAvailable = async function ( court_id, day, slot, hoursDay = false, numberSlot = false ) {

    const {openTime,closeTime} = ( hoursDay !== false ) ? hoursDay : await exports.getHoursDay( day ) ;
    const maxSlot = ( numberSlot !== false ) ? numberSlot : await exports.getNumberSlot( openTime , closeTime  ) ;

    if ( slot > maxSlot || slot <= 0 ) {
        return false;
    }

    let unavialability;

    try {
        unavialability = await unavailabilityModel.findOne({
            where : {
                start_date_unavailability : {
                    [Op.lte] : new Date( day )
                },
                end_date_unavailability : {
                    [Op.gte] : new Date( day )
                },
                id_court : court_id
            }
        })
    } catch (e) {
        return false;
    }

    if ( unavialability !== null ) {
        return false;
    }

    let court;

    try {
        court = await badmintonCourtModel.findByPk(court_id);
    } catch (e) {
        return false;
    }

    let reservations;

    try {
        reservations = await reservationModel.findOne({ where : { id_court : court_id , date : new Date( day ) , slot : slot } })
    } catch (e) {
        return false;
    }

    return reservations === null;

}
