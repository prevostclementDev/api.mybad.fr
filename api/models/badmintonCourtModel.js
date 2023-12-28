let databaseSequelize = require('../services/db');
const { DataTypes } = require('sequelize');

const badmintonCourtModel = databaseSequelize.define('badminton_courts', {
    name: { type: DataTypes.STRING(1) , unique: true  },
    id: { type: DataTypes.TINYINT , primaryKey: true, autoIncrement: true }
},{
    timestamps: false,
    createdAt: false,
    updatedAt: false
});

module.exports =  badmintonCourtModel;