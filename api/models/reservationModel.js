let databaseSequelize = require('../services/db');
const { DataTypes } = require('sequelize');

const reservationModel = databaseSequelize.define('badminton_reservations', {
    id: { type: DataTypes.MEDIUMINT , unique: true, primaryKey: true, autoIncrement: true },
    id_court: { type: DataTypes.TINYINT},
    slot: { type: DataTypes.TINYINT },
    date : { type: DataTypes.DATE },
    id_user : { type: DataTypes.MEDIUMINT },
},{
    paranoid: true,
    timestamps: true,
    createdAt: 'created_at',
    deletedAt: 'deleted_at',
    updatedAt: false
});

module.exports =  reservationModel;