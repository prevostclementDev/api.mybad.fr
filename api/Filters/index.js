const jwt = require('jsonwebtoken');
const CustomError = require('../services/response/CustomError');
require('dotenv').config();

const filters = [
    { url : '/badminton-court/:id([0-9]+)/reservations*', cb : UserIsAuth},
    { url : '/badminton-court/:id([0-9]+)/unavailability*', cb : UserIsAuth},
    { url : '/badminton-court/:id([0-9]+)/unavailability*', cb : UserAdminAuth},
    { url : '/badminton-court/unavailability*', cb : UserIsAuth},
    { url : '/badminton-court/unavailability*', cb : UserAdminAuth},
    { url : '/badminton-court/reservations*', cb : UserIsAuth},
]

function UserAdminAuth (req,res,next) {

    let auth = ( res.locals.user && res.locals.user.data.type === 'admin' );

    if (auth) {
        next();
    } else {
        res.json(new CustomError('403').toHal().render()).end();
    }

}

function UserIsAuth(req,res,next) {

    let auth = false;

    if ( req.headers.authorization ) {

        const token = req.headers.authorization.split(' ');

        try {
            let decoded = jwt.verify(token[1], process.env.API_SECRET);
            auth = true;
            res.locals.user = decoded;

        } catch(err) {
            console.log('invalid token ' + err);
        }

    }

    if ( auth ) {
        next();
    } else {
        res.json(new CustomError('403').toHal().render()).end();
    }
}

module.exports = filters;