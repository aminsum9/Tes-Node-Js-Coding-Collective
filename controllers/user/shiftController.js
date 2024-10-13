import { Attendance, User } from '../../models/index.js';
import fs from "fs";
import moment from "moment";
import {config} from 'dotenv';
import Shift from '../../models/shift.js';
import { Op } from 'sequelize';

config();

class ShiftController {

    getShifts = async (req, res) => {
        var data = await Shift.findAll();

        if(data){
            res.send({
                success: true,
                message: 'Success get data shifts',
                data: data
    
            });
        } else {
            res.send({
                success: false,
                message: 'Failed get data shifts!',
                data: {}
    
            });
        }
      
    };

}

export default ShiftController;

