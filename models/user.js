"use strict";

import { DataTypes, Model } from 'sequelize';
import Sequelize from 'sequelize';

import sequelize from '../config/db.js';

class User extends Model {}

User.sequelize = sequelize;
User.Sequelize = Sequelize;


User.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: DataTypes.STRING,
    },
    email: {
        type: DataTypes.STRING
    },
    password: {
        type: DataTypes.STRING
    },
    address: {
        type: DataTypes.STRING
    },
    is_verify: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    token: {
        type: DataTypes.TEXT,
        defaultValue: false
    },
    created_at: {
        type: DataTypes.DATE,
        defaultValue: new Date()
    },
    updated_at: {
        type: DataTypes.DATE,
        defaultValue: new Date()
    },
}, {
    sequelize,
    modelName: 'User',
    tableName: 'users',
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    timestamps: true 
});

User.associate = async (models) => {
    var Attendance = await import('./attendance.js');
    User.hasMany(Attendance.default, {
        as: "attendances",
        foreignKey: 'user_id',
        sourceKey: 'id',
    })
}

export default User;