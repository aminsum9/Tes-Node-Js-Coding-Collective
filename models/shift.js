"use strict";

import { DataTypes, Model } from 'sequelize';
import Sequelize from 'sequelize';

import sequelize from '../config/db.js';

class Shift extends Model {}

Shift.sequelize = sequelize;
Shift.Sequelize = Sequelize;


Shift.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: DataTypes.STRING
    },
    start_time: {
        type: DataTypes.TIME
    },
    end_time: {
        type: DataTypes.TIME
    },
    location: {
        type: DataTypes.STRING
    },
    gmt: {
        type: DataTypes.STRING
    },
    longitude: {
        type: DataTypes.STRING
    },
    latitude: {
        type: DataTypes.STRING
    },
    desc: {
        type: DataTypes.TEXT
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
    modelName: 'Shift',
    tableName: 'shifts',
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    timestamps: true 
});

Shift.associate = async (models) => {
    var Attendance = await import('./attendance.js');
    Shift.hasMany(Attendance.default, {
        as: "attendances",
        foreignKey: 'shift_id',
        sourceKey: 'id',
    })
}

export default Shift;