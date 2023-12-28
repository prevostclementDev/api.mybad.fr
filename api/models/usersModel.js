let databaseSequelize = require('../services/db');
const { DataTypes } = require('sequelize');

const usersModel = databaseSequelize.define('badminton_users', {
    id: { type: DataTypes.MEDIUMINT , unique: true, primaryKey: true, autoIncrement: true },
    pseudo: { type: DataTypes.STRING(255), unique : true },
    mdp: { type: DataTypes.STRING(500) },
    type: { type: DataTypes.ENUM('user','admin') },
},{
    paranoid: true,
    timestamps: true,
    createdAt: 'created_at',
    deletedAt: 'deleted_at',
    updatedAt: false
});

module.exports =  usersModel;