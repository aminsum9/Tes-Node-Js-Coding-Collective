import { Attendance, User } from '../../models/index.js';
import fs from "fs";
import moment from "moment";
import { config } from 'dotenv';
import Shift from '../../models/shift.js';
import PDFDocument from 'pdfkit';
import { Op, Sequelize } from 'sequelize';
import pdf from 'html-pdf';

config();

class ReportController {

    report = async (req, res) => {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = limit * ((page == 0 ? 1 : page) - 1);

        const totalData = await Attendance.count({});

        const totalPage = Math.ceil(totalData / limit);

        var data = await User.findAll({
            where: { 
                role: {
                    [Op.ne]: "Admin"
                },
            },
            offset: offset,
            limit: limit,
            order: [
                ['id', 'DESC']
            ],
            attributes: {
                exclude: ["password", "token", "created_at", "updated_at",],
                include: ["id", "name", "email", "address", "is_verify", "role"],
            },
            include: [
                {
                    model: Attendance,
                    as: "attendances",
                    include: [
                        {
                            model: Shift,
                            as: "shift"
                        }
                    ]
                },
            ],
            group: ['user.id'],
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

    downloadPDF = async (req, res) => {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = limit * ((page == 0 ? 1 : page) - 1);

        const totalData = await Attendance.count({});

        const totalPage = Math.ceil(totalData / limit);

        var data = await User.findAll({
            where: {
                role: {
                    [Op.ne]: "Admin"
                }
            },
            offset: offset,
            limit: limit,
            order: [
                ['id', 'DESC']
            ],
            attributes: {
                exclude: ["password", "token", "created_at", "updated_at",],
                include: ["id", "name", "email", "address", "is_verify", "role"],
            },
            include: [
                {
                    model: Attendance,
                    as: "attendances",
                    include: [
                        {
                            model: Shift,
                            as: "shift"
                        }
                    ]
                },
            ],
            group: ['user.id'],
        });

        const doc = new PDFDocument();

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'inline; filename="view.pdf"');

        doc.pipe(res);

        doc.fontSize(25).text('test', 100, 100);

        doc.end();

    };

}

export default ReportController;

