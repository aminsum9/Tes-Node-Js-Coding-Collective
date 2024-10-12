import jwt from "jsonwebtoken";
import { config } from 'dotenv';
import { User } from "../models/index.js";

config();

const authMiddleware = (req, res, next) => {
    let authHeader = req.headers["authorization"];

    if (!authHeader) {
        return res.status(401).json({
            success: false,
            message: 'Header Authorization required!',
            data: {}
        });
    }
    let token = authHeader.split("Bearer ")[1];

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
            where: { id: userId }, attributes: {
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
            res.status(403).send({
                success: false,
                message: "User not found!",
                data: {}
            });
        }

    });
};

export default authMiddleware;