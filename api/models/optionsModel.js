let databaseSequelize = require('../services/db');
const { DataTypes } = require('sequelize');

const optionsModel = databaseSequelize.define('badminton_options', {
    id: { type: DataTypes.MEDIUMINT , unique: true, primaryKey: true, autoIncrement: true },
    opt_key: { type: DataTypes.STRING(255)},
    opt_value: { type: DataTypes.STRING }
},{
    timestamps: false
});

module.exports =  optionsModel;