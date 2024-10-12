"use strict";

import { DataTypes, Model } from 'sequelize';
import Sequelize from 'sequelize';

import sequelize from '../config/db.js';

class Attendance extends Model {}

Attendance.sequelize = sequelize;
Attendance.Sequelize = Sequelize;


Attendance.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    shift_id: {
        type: DataTypes.INTEGER,
        references: {
          model: 'Shift',
          key: 'id'
        }
    },
    user_id: {
        type: DataTypes.INTEGER,
        references: {
          model: 'User',
          key: 'id'
        }
    },
    date: {
        type: DataTypes.DATE
    },
    check_in: {
        type: DataTypes.TIME
    },
    check_out: {
        type: DataTypes.TIME
    },
    photo: {
        type: DataTypes.STRING
    },
    ip_address: {
        type: DataTypes.STRING
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
    modelName: 'Attendance',
    tableName: 'attendances',
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    timestamps: true 
});

Attendance.associate = async (models) => {
    var User = await import('./user.js');
    var Shift = await import('./shift.js');

    Attendance.belongsTo(User.default, {
        as: "user",
        foreignKey: 'user_id',
        sourceKey: 'id',
    })
    Attendance.belongsTo(Shift.default, {
        as: "shift",
        foreignKey: 'shift_id',
        sourceKey: 'id',
    })
}

export default Attendance;