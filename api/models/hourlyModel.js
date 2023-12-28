let databaseSequelize = require('../services/db');
const { DataTypes } = require('sequelize');

const hourlyModel = databaseSequelize.define('badminton_hourly', {
    id: { type: DataTypes.MEDIUMINT , unique: true, primaryKey: true, autoIncrement: true },
    day: { type: DataTypes.STRING(3)},
    openTime: { type: DataTypes.TIME },
    closeTime: { type: DataTypes.TIME },
},{
    timestamps: false,
    tableName: 'badminton_hourly'
});

module.exports =  hourlyModel;