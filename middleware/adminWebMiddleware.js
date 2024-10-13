import jwt from "jsonwebtoken";
import { config } from 'dotenv';
import { User } from "../models/index.js";

config();

const adminWebMiddleware = (req, res, next) => {
    let token = req.query.token || '';

    jwt.verify(token, process.env.JWT_SCREET_KEY, async (err, decoded) => {
        if (err) {
            return res.status(403).send({
                success: false,
                message: "Your Token is Longer Valid",
                data: {}
            });
        }

        var userId = 0;

        userId = decoded.id;

        var checkUser = await User.findOne({
            where: { id: userId, token: token, role: "Admin" }, attributes: {
                exclude: ['token','password','user_id', 'created_at', 'updated_at'],
                include: [
                    'id',
                    'name',
                    'email',
                ],
            },
        })

        req.user = checkUser;

        if (checkUser) {
            next();
        } else {
            res.send({
                success: false,
                message: "User not found!",
                data: {}
            });
        }

    });
};

export default adminWebMiddleware;