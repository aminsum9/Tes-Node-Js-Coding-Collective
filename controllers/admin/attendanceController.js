import { Attendance, User } from '../../models/index.js';
import fs from "fs";
import moment from "moment";
import { config } from 'dotenv';
import Shift from '../../models/shift.js';
import { Op } from 'sequelize';

config();


class AttendanceController {

    getAttendances = async (req, res) => {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = limit * ((page == 0 ? 1 : page) - 1);

        const totalData = await Attendance.count({
            where: { user_id: req.user.id }
        });

        const totalPage = Math.ceil(totalData / limit);

        var data = await Attendance.findAll({
            offset: offset,
            limit: limit,
            order: [
                ['id', 'DESC']
            ],
            include: [
                {
                    model: Shift,
                    as: "shift"
                },
                {
                    model: User,
                    as: "user",
                    attributes: {
                        exclude: ["password", "token", "created_at", "updated_at",],
                        include: ["id", "name", "email", "address", "is_verify", "role"],
                    }
                }
            ]
        });

        if (data) {
            res.send({
                success: true,
                message: 'Success get data attendances',
                data: {
                    data: data,
                    page: page,
                    limit: limit,
                    totalData: totalData,
                    totalPage: totalPage
                }

            });
        } else {
            res.send({
                success: false,
                message: 'Failed get data attendances!',
                data: {}

            });
        }

    };

}

export default AttendanceController;

