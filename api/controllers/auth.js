let express = require('express');
let router = express.Router();

const hal = require('../services/response/hal');
const CustomError = require('../services/response/CustomError');
const userModel = require('../models/usersModel');

require('dotenv').config();

const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const salt = 10;

// ###################################
//               LOGIN
// ###################################
router.post('/login', async function (req, res, next) {

    if ( req.body.userName && req.body.userPassword ) {

        const user = await userModel.findOne({ where: { pseudo: req.body.userName } });

        let compare = false;

        if ( user ) {
            compare = await bcrypt.compare( req.body.userPassword , user.mdp );
        }

        if ( compare ) {

            const token = jwt.sign({ data: { id : user.id, pseudo : user.pseudo, type : user.type } }, process.env.API_SECRET, { expiresIn: '1h' });

            res.json(
                new hal()
                    .addEmbedded('token',token)
                    .addEmbedded('expiresIn',60*60)
                    .addEmbedded('expiresInUnit','seconds')
                    .addDefaultLinks('get-auth-token', true)
                    .addDefaultLinks('get-all-reservations')
                    .render()
            ).end();

        } else {
            res.status(401).json(
                new CustomError("401", 'Mot de passe ou non d\'utilisateur incorrect')
                    .toHal()
                    .addDefaultLinks('get-auth-token', true)
                    .addDefaultLinks('get-all-reservations')
                    .render()
            ).end();
        }

    } else {

        res.status(422).json(
            new CustomError("422")
                .toHal()
                .addDefaultLinks('get-auth-token', true)
                .addDefaultLinks('get-all-reservations')
                .render()
        ).end();

    }

});

// ###################################
//           CREATE ACCOUNT
// ###################################
router.post('/create-account', async function (req, res, next) {

    if ( req.body.userName && req.body.userPassword ) {

        bcrypt.hash(req.body.userPassword,salt, async function (err, hash) {

            if (err) return next(err);

            try {

                const newUser = await userModel.create({ pseudo : req.body.userName , mdp : hash , type : 'admin'  });
                res.json(
                    new hal()
                        .addEmbedded('user',newUser )
                        .addDefaultLinks('get-auth-token', true)
                        .addDefaultLinks('get-all-reservations')
                        .render()
                ).end();


            } catch (error) {
                res.status(500).json(
                    new CustomError('500' , error )
                        .toHal()
                        .addDefaultLinks('get-auth-token', true)
                        .addDefaultLinks('get-all-reservations')
                        .render()
                ).end();

            }

        })

    } else {

        res.status(422).json(
            new CustomError("422")
                .toHal()
                .addDefaultLinks('get-auth-token', true)
                .addDefaultLinks('get-all-reservations')
                .render()
        ).end();

    }

});

module.exports = router;
