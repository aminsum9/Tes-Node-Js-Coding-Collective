import { Attendance, User } from '../models/index.js';
import fs from "fs";
import moment from "moment";
import {config} from 'dotenv';
import Shift from '../models/shift.js';
import { Op } from 'sequelize';

config();

const deleteFile = (path) => {
    if (fs.existsSync(path)) {
        fs.unlinkSync(path);
    } 
}


class AttendanceController {

    getAttendancesByUser = async (req, res) => {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = limit * ((page == 0 ? 1 : page) - 1);

        const totalData = await Attendance.count({
            where:{user_id: req.user.id}
        }); 

        const totalPage = Math.ceil(totalData / limit);

        var data = await Attendance.findAll({
            where: {user_id: req.user.id},
            offset: offset,
            limit: limit,
            order:[
                ['id', 'DESC']
            ]
        });

        if(data){
            res.send({
                success: true,
                message: 'Success get data user attendances',
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
                message: 'Failed get data user attendances!',
                data: {}
    
            });
        }
      
    };

    checkCheckIn = async (req, res) => {

        var shift_id = req.body.shift_id;
        var today = moment(new Date).format('YYYY-MM-DD');

        var checkCheckIn = await Attendance.findOne({where: {user_id: req.user.id, shift_id: shift_id, check_in_date: today}});

        if(checkCheckIn){
            res.send({
                success: true,
                message: 'User already check in',
                data: data
    
            });
        } else {
            res.send({
                success: false,
                message: 'User has not checked in!',
                data: {}
    
            });
        }
      
    };

    checkIn = async (req, res) => {

        var shift_id = req.body.shift_id;
        var date = req.body.date;
        var check_in = req.body.check_in;
        var location = req.body.location;
        var gmt = req.body.gmt;
        var longitude = req.body.longitude;
        var latitude = req.body.latitude;
        var desc = req.body.desc;

        // get client ip address
        const clientIP = req.ip;
        
        const forwarded = req.headers['x-forwarded-for'];
        const ipAddress = forwarded ? forwarded.split(',')[0] : clientIP;

        const ipv4 = ipAddress.includes('::ffff:') ? ipAddress.split('::ffff:')[1] : ipAddress;
        // 

        const photo = req.file;

        if (!shift_id) {
            deleteFile(photo.path);
            return res.status(500).json({
                success: false,
                message: 'shift_id required!',
                data: {}
            });
        }
        if (!date) {
            deleteFile(photo.path);
            return res.status(500).json({
                success: false,
                message: 'date required!',
                data: {}
            });
        }
        if (!check_in) {
            deleteFile(photo.path);
            return res.status(500).json({
                success: false,
                message: 'check_in required!',
                data: {}
            });
        }
        if (!photo) {
            deleteFile(photo.path);
            return res.status(500).json({
                success: false,
                message: 'photo required!',
                data: {}
            });
        }
        if (!location) {
            deleteFile(photo.path);
            return res.status(500).json({
                success: false,
                message: 'location required!',
                data: {}
            });
        }
        if (!gmt) {
            deleteFile(photo.path);
            return res.status(500).json({
                success: false,
                message: 'gmt required!',
                data: {}
            });
        }
        if (!longitude) {
            deleteFile(photo.path);
            return res.status(500).json({
                success: false,
                message: 'longitude required!',
                data: {}
            });
        }
        if (!latitude) {
            deleteFile(photo.path);
            return res.status(500).json({
                success: false,
                message: 'latitude required!',
                data: {}
            });
        }

        var findShift = await Shift.findOne({where: {id: shift_id}});

        if(!findShift)
        {
            deleteFile(photo.path);
            return res.status(500).json({
                success: false,
                message: 'Shift not found!',
                data: {}
            });
        }

        const checkInDate = moment(date).format('YYYY-MM-DD');

        // check checkInDate == today
        const today = moment(new Date).format('YYYY-MM-DD');

        if(checkInDate != today)
            {
                deleteFile(photo.path);
                return res.status(500).json({
                    success: false,
                    message: 'Your check in date must be today!',
                    data: {}
                });
            }
        
        // check user check in
        var checkCheckIn = await Attendance.findOne({where: {
            shift_id: shift_id, 
            user_id: req.user.id, 
            check_in_time: {
                [Op.ne]: null
            }, 
            check_in_date: new Date(checkInDate),
        }});

        if(checkCheckIn)
        {
            deleteFile(photo.path);
            return res.status(500).json({
                success: false,
                message: 'You already checked in!',
                data: {}
            });
        }

        var attendance = new Attendance();

        attendance.shift_id = shift_id;
        attendance.user_id = req.user.id;
        attendance.check_in_date = new Date(checkInDate);
        attendance.check_in_time = check_in;
        attendance.check_in_photo = photo.filename;
        attendance.check_in_location = location;
        attendance.check_in_gmt = gmt;
        attendance.check_in_longitude = longitude;
        attendance.check_in_latitude = latitude;
        attendance.check_in_desc = desc;
        attendance.check_in_ip_address = ipv4;

        if(await attendance.save())
        {
            res.status(200).json({
                success: true,
                message: 'Check in success!',
                data: attendance
            });
        } else {
            res.status(200).json({
                success: true,
                message: 'Check in failed!',
                data: { }
            });
        }

    };

    checkOut = async (req, res) => {

        var attendance_id = req.body.attendance_id;
        var shift_id = req.body.shift_id;
        var date = req.body.date;
        var check_out = req.body.check_out;
        var location = req.body.location;
        var gmt = req.body.gmt;
        var longitude = req.body.longitude;
        var latitude = req.body.latitude;
        var desc = req.body.desc;

        // get client ip address
        const clientIP = req.ip;
        
        const forwarded = req.headers['x-forwarded-for'];
        const ipAddress = forwarded ? forwarded.split(',')[0] : clientIP;

        const ipv4 = ipAddress.includes('::ffff:') ? ipAddress.split('::ffff:')[1] : ipAddress;
        // 

        const photo = req.file;

        if (!attendance_id) {
            return res.status(500).json({
                success: false,
                message: 'attendance_id required!',
                data: {}
            });
        }
        if (!check_out) {
            return res.status(500).json({
                success: false,
                message: 'check_out required!',
                data: {}
            });
        }
        if (!shift_id) {
            deleteFile(photo.path);
            return res.status(500).json({
                success: false,
                message: 'shift_id required!',
                data: {}
            });
        }
        if (!date) {
            deleteFile(photo.path);
            return res.status(500).json({
                success: false,
                message: 'date required!',
                data: {}
            });
        }
        if (!check_out) {
            deleteFile(photo.path);
            return res.status(500).json({
                success: false,
                message: 'check_out required!',
                data: {}
            });
        }
        if (!photo) {
            deleteFile(photo.path);
            return res.status(500).json({
                success: false,
                message: 'photo required!',
                data: {}
            });
        }
        if (!location) {
            deleteFile(photo.path);
            return res.status(500).json({
                success: false,
                message: 'location required!',
                data: {}
            });
        }
        if (!gmt) {
            deleteFile(photo.path);
            return res.status(500).json({
                success: false,
                message: 'gmt required!',
                data: {}
            });
        }
        if (!longitude) {
            deleteFile(photo.path);
            return res.status(500).json({
                success: false,
                message: 'longitude required!',
                data: {}
            });
        }
        if (!latitude) {
            deleteFile(photo.path);
            return res.status(500).json({
                success: false,
                message: 'latitude required!',
                data: {}
            });
        }


        var findAttendance = await Attendance
            .findOne({
                where: {
                    id: attendance_id,
                },
                attributes: {
                    exclude: ['created_at', 'updated_at'],
                    include: [
                        'shift_id',
                        'user_id',
                        'check_in_date',
                        'check_in_time',
                        'check_out_time',
                        'check_in_location',
                        'check_in_longitude',
                        'check_in_latitude'
                    ],
                },
            });

        if (!findAttendance) {
            deleteFile(photo.path);
            return res.status(500).json({
                success: false,
                message: 'Data attendance not found!',
                data: {}
            });
        }

        var checkCheckOut = await Attendance
            .findOne({
                where: {
                    id: attendance_id,
                    check_out_time: {
                        [Op.eq]: null
                    }
                },
                attributes: {
                    exclude: ['created_at', 'updated_at'],
                    include: [
                        'shift_id',
                        'user_id',
                        'check_out_date',
                        'check_out_time',
                        'check_out_location',
                        'check_out_longitude',
                        'check_out_latitude'
                    ],
                },
            });

        if (!checkCheckOut) {
            deleteFile(photo.path);
            return res.status(500).json({
                success: false,
                message: 'User already check out!',
                data: {}
            });
        }

        var updateAttendance = await Attendance.update({ 
            check_out_date: date,
            check_out_photo: photo.filename,
            check_out_time: check_out,
            check_out_gmt: gmt,
            check_out_location: location,
            check_out_longitude: longitude,
            check_out_latitude: latitude,
            check_out_ip_address: ipv4,
            check_out_desc: desc
        }, 
            { where: { id: attendance_id } 
        });

        if(updateAttendance)
        {
            res.status(200).json({
                success: true,
                message: 'Check out success',
                data: findAttendance
            });
        } else {
            deleteFile(photo.path);
            res.status(200).json({
                success: false,
                message: 'Check out falied!',
                data: {}
            });
        }

    };

}

export default AttendanceController;

