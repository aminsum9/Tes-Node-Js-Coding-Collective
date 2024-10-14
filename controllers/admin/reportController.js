import { Attendance, User } from '../../models/index.js';
import moment from "moment";
import { config } from 'dotenv';
import Shift from '../../models/shift.js';
import { Op } from 'sequelize';
import { DateTime } from 'luxon';
import pdf from 'html-pdf';

config();

class ReportController {

    report = async (req, res) => {
        var startDate = req.query.start_date;
        var endDate = req.query.end_date;
        var timezone = req.query.timezone || '';
        var convertTimezone = req.query.convertTimezone || '';

        var data = await User.findAll({
            where: {
                role: {
                    [Op.ne]: "Admin"
                }
            },
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
                    where: [{
                        check_in_date: {
                            [Op.between]: [startDate + " 00:00:00", endDate + " 23:59:59"]
                        }
                    },
                    timezone && { check_in_timezone: timezone }
                    ],
                    include: [
                        {
                            model: Shift,
                            as: "shift"
                        }
                    ]
                },
            ],
        });

        var resutlData = [];

        for (let i = 0; i < data.length; i++) {
            var e = data[i];

            var newDataAttendances = [];

            if (convertTimezone) {
                for (let j = 0; j < e.attendances.length; j++) {
                    var d = e.attendances[j];

                    const timeZone = convertTimezone;

                    if (d.check_in_date && d.check_in_time && d.check_in_timezone) {
                        // convert date
                        const checkInDate = new Date(d.check_in_date);
                        const checkInDateData = DateTime.utc(checkInDate.getFullYear(), checkInDate.getMonth(), checkInDate.getDate(), 0, 0, 0);
                        const checkInDateDataConverted = checkInDateData.setZone(timeZone);

                        // convert time
                        var timeStartSplit = d.check_in_time.split(':');
                        const checkInTimeData = DateTime.utc(checkInDate.getFullYear(), checkInDate.getMonth(), checkInDate.getDate(), parseInt(timeStartSplit[0]), parseInt(timeStartSplit[1]), parseInt(timeStartSplit[2]));


                        const checkInTimeDataConverted = checkInTimeData.setZone(timeZone);
                        const formattedTimeCheckInTime = checkInTimeDataConverted.toFormat('HH:mm:ss');

                        d.check_in_date = checkInDateDataConverted;
                        d.check_in_time = formattedTimeCheckInTime;
                        d.check_in_timezone = convertTimezone;
                    }


                    if (d.check_out_date && d.check_out_time && d.check_out_timezone) {
                        // convert date
                        const checkOutDate = new Date(d.check_out_date);
                        const checkOutDateData = DateTime.utc(checkOutDate.getFullYear(), checkOutDate.getMonth(), checkOutDate.getDate(), 0, 0, 0);
                        const checkOutDateDataConverted = checkOutDateData.setZone(timeZone);

                         // convert time
                        var timeEndSplit = d.check_out_time.split(':');
                        const checkOutTimeData = DateTime.utc(checkOutDate.getFullYear(), checkOutDate.getMonth(), checkOutDate.getDate(), parseInt(timeEndSplit[0]), parseInt(timeEndSplit[1]), parseInt(timeEndSplit[2]));
                        const checkOutTimeDataConverted = checkOutTimeData.setZone(timeZone);
                        const formattedTimeCheckOutTime = checkOutTimeDataConverted.toFormat('HH:mm:ss');

                        d.check_out_date = checkOutDateDataConverted;
                        d.check_out_time = formattedTimeCheckOutTime;
                        d.check_out_timezone = convertTimezone;
                    }

                    newDataAttendances.push(d)
                }
            }


            var newData = {
                id: e.id,
                name: e.name,
                email: e.email,
                address: e.address,
                is_verify: e.is_verify,
                role: e.role,
                totalAttendances: e.attendances.length,
                attendances: newDataAttendances.length > 0 ? newDataAttendances : e.attendances
            };

            resutlData.push(newData);
        }

        if (data) {
            res.send({
                success: true,
                message: 'Success get data attendances',
                data: {
                    data: resutlData,
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
        var startDate = req.query.start_date;
        var endDate = req.query.end_date;
        var timezone = req.query.timezone || '';
        var convertTimezone = req.query.convertTimezone || '';

        console.log("tes date: ", startDate + " 00:00:00")

        var data = await User.findAll({
            where: {
                role: {
                    [Op.ne]: "Admin"
                }
            },
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
                    where: [{
                        check_in_date: {
                            [Op.between]: [startDate + " 00:00:00", endDate + " 23:59:59"]
                        }
                    },
                    timezone && { check_in_timezone: timezone }
                    ],
                    include: [
                        {
                            model: Shift,
                            as: "shift"
                        }
                    ]
                },
            ],
        });

        var resutlData = [];

        for (let i = 0; i < data.length; i++) {
            var e = data[i];

            var newDataAttendances = [];

            if (convertTimezone) {
                for (let j = 0; j < e.attendances.length; j++) {
                    var d = e.attendances[j];

                    const timeZone = convertTimezone;

                    if (d.check_in_date && d.check_in_time && d.check_in_timezone) {
                        // convert date
                        const checkInDate = new Date(d.check_in_date);
                        const checkInDateData = DateTime.utc(checkInDate.getFullYear(), checkInDate.getMonth(), checkInDate.getDate(), 0, 0, 0);
                        const checkInDateDataConverted = checkInDateData.setZone(timeZone);

                        // convert time
                        var timeStartSplit = d.check_in_time.split(':');
                        const checkInTimeData = DateTime.utc(checkInDate.getFullYear(), checkInDate.getMonth(), checkInDate.getDate(), parseInt(timeStartSplit[0]), parseInt(timeStartSplit[1]), parseInt(timeStartSplit[2]));


                        const checkInTimeDataConverted = checkInTimeData.setZone(timeZone);
                        const formattedTimeCheckInTime = checkInTimeDataConverted.toFormat('HH:mm:ss');

                        d.check_in_date = checkInDateDataConverted;
                        d.check_in_time = formattedTimeCheckInTime;
                        d.check_in_timezone = convertTimezone;
                    }


                    if (d.check_out_date && d.check_out_time && d.check_out_timezone) {
                        // convert date
                        const checkOutDate = new Date(d.check_out_date);
                        const checkOutDateData = DateTime.utc(checkOutDate.getFullYear(), checkOutDate.getMonth(), checkOutDate.getDate(), 0, 0, 0);
                        const checkOutDateDataConverted = checkOutDateData.setZone(timeZone);

                         // convert time
                        var timeEndSplit = d.check_out_time.split(':');
                        const checkOutTimeData = DateTime.utc(checkOutDate.getFullYear(), checkOutDate.getMonth(), checkOutDate.getDate(), parseInt(timeEndSplit[0]), parseInt(timeEndSplit[1]), parseInt(timeEndSplit[2]));
                        const checkOutTimeDataConverted = checkOutTimeData.setZone(timeZone);
                        const formattedTimeCheckOutTime = checkOutTimeDataConverted.toFormat('HH:mm:ss');

                        d.check_out_date = checkOutDateDataConverted;
                        d.check_out_time = formattedTimeCheckOutTime;
                        d.check_out_timezone = convertTimezone;
                    }

                    newDataAttendances.push(d)
                }
            }

            var newData = {
                id: e.id,
                name: e.name,
                email: e.email,
                address: e.address,
                is_verify: e.is_verify,
                role: e.role,
                totalAttendances: e.attendances.length,
                attendances: newDataAttendances.length > 0 ? newDataAttendances : e.attendances
            };

            resutlData.push(newData);
        }


        var startDateData = moment(startDate).format('DD MMMM YYYY')
        var endDateData = moment(endDate).format('DD MMMM YYYY')

        var textPDF = '<html><body style="padding: 20px;" >';

        textPDF += '<h1>Report</h1> \n\n';
        textPDF += `<p>from: ${startDateData}</p>\n`;
        textPDF += `<p>to: ${endDateData}</p>\n`;
        if (timezone) {
            textPDF += `<p>Timezone: ${timezone}</p>\n`;
        }
        if (convertTimezone) {
            textPDF += `<p>Convert To Timezone: ${convertTimezone}</p>\n\n`;
        }

        textPDF += `<h2>Attendance</h2>\n`;

        for (let i = 0; i < resutlData.length; i++) {
            var e = resutlData[i];

            textPDF += `<div style="width: 100%; padding: 1px; padding-left: 10px; background-color: #4287f5;color: #ffffff;" >`;
            textPDF += `<h6 style="margin-bottom: 0px" >${e.name} (${e.email})</h6>\n`;
            textPDF += `<p style="font-size: 10px" >Total Attendances: ${e.totalAttendances}</p>\n`;
            textPDF += `</div>\n`;

            for (let j = 0; j < data[i].attendances.length; j++) {
                var e = data[i].attendances[j];
                textPDF += `<div>`;
                textPDF += `<p style="font-size: 10px; font-weight: bold" >${j + 1}. ${e.shift?.name} (${e.shift?.start_time} - ${e.shift?.end_time})</p>\n`;
                textPDF += `<p style="font-size: 10px">Check In: ${moment(e.check_in_date).format('dddd, DD MMMM YYYY')} at ${e.check_in_time} (${e.check_in_timezone})</p>\n`;
                textPDF += `<p style="font-size: 10px" >Check Out: ${moment(e.check_out_date).format('dddd, DD MMMM YYYY')} at ${e.check_out_time} (${e.check_out_timezone})</p>\n`;
                textPDF += `<p style="font-size: 10px" >Check In Location: ${e.check_in_location} (${e.check_in_latitude},${e.check_in_longitude})</p>\n`;
                textPDF += `<p style="font-size: 10px" >Check Out Location: ${e.check_out_location} (${e.check_out_latitude},${e.check_out_longitude})</p>\n`;
                textPDF += `</div>\n`;
            }
        }

        textPDF += '</body></html>';

        const options = { format: 'A4' };

        pdf.create(textPDF, options).toBuffer((err, buffer) => {
            if (err) {
                return res.status(500).send('Error generating PDF');
            }

            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', 'inline; filename="report.pdf"');

            res.send(buffer);
        });

    };

}

export default ReportController;

