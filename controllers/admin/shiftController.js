import { Shift } from '../../models/index.js';
class ShiftAdminController {

    getShifts = async (req, res) => {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = limit * ((page == 0 ? 1 : page) - 1);

        const totalData = await Shift.count();

        const totalPage = Math.ceil(totalData / limit);

        var data = await Shift.findAll({
            offset: offset,
            limit: limit,
            order: [
                ['id', 'DESC']
            ],
        });

        if(data){
            res.send({
                success: true,
                message: 'Success get data shifts',
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
                message: 'Failed get data shifts!',
                data: {}
    
            });
        }
      
    };

    addShift = async (req, res) => {

        var name = req.body.name;
        var start_time = req.body.start_time;
        var end_time = req.body.end_time;
        var location = req.body.location;
        var timezone = req.body.timezone;
        var longitude = req.body.longitude;
        var latitude = req.body.latitude;
        var desc = req.body.desc;

        if (!name) {
            return res.status(500).json({
                success: false,
                message: 'name required!',
                data: {}
            });
        }
        if (!start_time) {
          
            return res.status(500).json({
                success: false,
                message: 'date required!',
                data: {}
            });
        }
        if (!end_time) {
            return res.status(500).json({
                success: false,
                message: 'check_in required!',
                data: {}
            });
        }
        if (!location) {
            return res.status(500).json({
                success: false,
                message: 'location required!',
                data: {}
            });
        }
        if (!timezone) {
            return res.status(500).json({
                success: false,
                message: 'timezone required!',
                data: {}
            });
        }
        if (!longitude) {
            return res.status(500).json({
                success: false,
                message: 'longitude required!',
                data: {}
            });
        }
        if (!latitude) {
            return res.status(500).json({
                success: false,
                message: 'latitude required!',
                data: {}
            });
        }
        
        
        var shift = new Shift();

        shift.name = name;
        shift.start_time = start_time;
        shift.end_time = end_time;
        shift.location = location;
        shift.timezone = timezone;
        shift.longitude = longitude;
        shift.latitude = latitude;
        shift.desc = desc;

        if(await shift.save())
        {
            res.status(200).json({
                success: true,
                message: 'Success add shift!',
                data: shift
            });
        } else {
            res.status(200).json({
                success: true,
                message: 'Failed add shift!',
                data: { }
            });
        }

    };

}

export default ShiftAdminController;

