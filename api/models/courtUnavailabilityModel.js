let databaseSequelize = require('../services/db');
const { DataTypes } = require('sequelize');

const courtUnavailabilityModel = databaseSequelize.define('badminton_court_unavailability', {
    id: { type: DataTypes.MEDIUMINT , unique: true, primaryKey: true, autoIncrement: true },
    id_court: { type: DataTypes.TINYINT },
    start_date_unavailability: { type: DataTypes.DATE },
    end_date_unavailability : { type: DataTypes.DATE },
},{
    paranoid: true,
    timestamps: true,
    createdAt: 'created_at',
    deletedAt: 'deleted_at',
    updatedAt: false,
    tableName: 'badminton_court_unavailability'
});

module.exports =  courtUnavailabilityModel;