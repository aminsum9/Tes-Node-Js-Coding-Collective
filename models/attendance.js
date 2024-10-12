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
    check_in_date: {
        type: DataTypes.DATE
    },
    check_in_time: {
        type: DataTypes.TIME
    },
    check_in_photo: {
        type: DataTypes.STRING
    },
    check_in_ip_address: {
        type: DataTypes.STRING
    },
    check_in_location: {
        type: DataTypes.STRING
    },
    check_in_gmt: {
        type: DataTypes.STRING
    },
    check_in_longitude: {
        type: DataTypes.STRING
    },
    check_in_latitude: {
        type: DataTypes.STRING
    },
    check_in_desc: {
        type: DataTypes.TEXT
    },
    check_out_date: {
        type: DataTypes.DATE
    },
    check_out_time: {
        type: DataTypes.TIME
    },
    check_out_photo: {
        type: DataTypes.STRING
    },
    check_out_ip_address: {
        type: DataTypes.STRING
    },
    check_out_location: {
        type: DataTypes.STRING
    },
    check_out_gmt: {
        type: DataTypes.STRING
    },
    check_out_longitude: {
        type: DataTypes.STRING
    },
    check_out_latitude: {
        type: DataTypes.STRING
    },
    check_out_desc: {
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