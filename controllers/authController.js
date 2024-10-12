import { User } from '../models/index.js';
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import {config} from 'dotenv';

config();

class AuthController {

    login = async (req, res) => {

        var email = req.body.email;
        var password = req.body.password;

        if (!email) {
            return res.status(500).json({
                success: false,
                message: 'Email required!',
                data: {}
            });
        }
        if (!password) {
            return res.status(500).json({
                success: false,
                message: 'Password required!',
                data: {}
            });
        }


        var findUser = await User
            .findOne({
                where: {
                    email: email,
                },
                attributes: {
                    exclude: ['user_id', 'created_at', 'updated_at'],
                    include: [
                        'id',
                        'name',
                        'email',
                        'password'
                    ],
                },
            });

        if (!findUser) {
            return res.status(500).json({
                success: false,
                message: 'User not found!',
                data: {}
            });
        }

        var checkPassword = await bcrypt.compare(password, findUser.password);

        if (!checkPassword) {
            return res.status(500).json({
                success: false,
                message: 'Your password is incorrect!',
                data: {}
            });
        }

        const newToken = jwt.sign({ id: findUser.id }, process.env.JWT_SCREET_KEY);

        User.update({ token: newToken }, { where: { id: findUser.id } });

        res.status(200).json({
            success: true,
            message: 'Login success',
            data: {
                token: newToken,
                user: findUser
            }
        });
    };

    register = async (req, res) => {

        var name = req.body.name;
        var email = req.body.email;
        var address = req.body.address;
        var password = req.body.password;

        if (!name) {
            return res.send({
                success: false,
                message: 'Name required!',
                data: {}
            });
        }
        if (!email) {
            return res.send({
                success: false,
                message: 'Email required!',
                data: {}
            });
        }
        if (!address) {
            return res.send({
                success: false,
                message: 'Address required!',
                data: {}
            });
        }
        if (!password) {
            return res.send({
                success: false,
                message: 'Password required!',
                data: {}
            });
        }

        var findUser = await User
            .findOne({
                where: {
                    email: email,
                },
                attributes: {
                    exclude: ['user_id', 'created_at', 'updated_at'],
                    include: [
                        'id',
                        'name',
                        'email',
                    ],
                },
            });

        if (findUser) {
            return res.status(500).json({
                success: false,
                message: 'Email was used, please using another email!',
                data: {}
            });
        }

        var user = new User();

        user.name = name;
        user.email = email;
        user.address = address;

        const newToken = jwt.sign({ id: user.id }, process.env.JWT_SCREET_KEY);

        user.token = newToken;

        var salt = await bcrypt.genSalt(10);
        var hashingPassword = await bcrypt.hash(password, salt);

        user.password = hashingPassword;
        user.is_verify = true;

        if (await user.save()) {
            var newUser = await User.findOne({
                where: { email: email }, 
                attributes: {
                    exclude: ['user_id','password','created_at', 'updated_at'],
                    include: [
                        'id',
                        'name',
                        'email',
                    ],
                },
            });

            res.send({
                success: true,
                message: 'Registration success',
                data: {
                    token: newToken,
                    data: newUser
                }
            });
        } else {
            res.status(500).json({
                success: false,
                message: 'Registration failed!',
                data: {}
            });
        }
    };

    checkLogin = async (req, res) => {

        let authHeader = req.headers["authorization"];
        let token = authHeader.split("Bearer ")[1];

        const newToken = jwt.sign({ id: req.user.id }, process.env.JWT_SCREET_KEY);

        User.update({token: newToken},{where: {id: req.user.id}});

        res.send({
            success: true,
            message: 'User logged in',
            data: {
                token: newToken,
                data: req.user
            }
        });
    };

    update = async (req, res) => {

        var name = req.body.name;
        var email = req.body.email;
        var address = req.body.address;

        if (!name) {
            return res.send({
                success: false,
                message: 'Name required!',
                data: {}
            });
        }
        if (!email) {
            return res.send({
                success: false,
                message: 'Email required!',
                data: {}
            });
        }
        if (!address) {
            return res.send({
                success: false,
                message: 'Address required!',
                data: {}
            });
        }

        var findUser = await User
            .findOne({
                where: {
                    email: email,
                },
                attributes: {
                    exclude: ['user_id', 'created_at', 'updated_at'],
                    include: [
                        'id',
                        'name',
                        'email',
                    ],
                },
            });

        if (!findUser) {
            return res.status(500).json({
                success: false,
                message: 'User not found!',
                data: {}
            });
        }

        var updateUser = await User.update({
            name: name,
            email: email,
            address: address
        },
        {
            where: {id: findUser.id}
        });

        if (updateUser) {
            var updatedUser = await User.findOne({
                where: { email: email }, 
                attributes: {
                    exclude: ['user_id','password','created_at', 'updated_at'],
                    include: [
                        'id',
                        'name',
                        'email',
                    ],
                },
            });

            res.send({
                success: true,
                message: 'Success update user',
                data:  updatedUser
            });
        } else {
            res.status(500).json({
                success: false,
                message: 'Failed update user!',
                data: {}
            });
        }
    };

    changePassword = async (req, res) => {

        var oldPassword = req.body.oldPassword;
        var newPassword = req.body.newPassword;
        var confPassword = req.body.confPassword;

        if (!oldPassword) {
            return res.send({
                success: false,
                message: 'oldPassword required!',
                data: {}
            });
        }
        if (!newPassword) {
            return res.send({
                success: false,
                message: 'newPassword required!',
                data: {}
            });
        }
        if (!confPassword) {
            return res.send({
                success: false,
                message: 'confPassword required!',
                data: {}
            });
        }

        var findUser = await User
            .findOne({
                where: {
                    id: req.user.id,
                },
                attributes: {
                    exclude: ['user_id', 'created_at', 'updated_at'],
                    include: [
                        'id',
                        'name',
                        'email',
                        'password'
                    ],
                },
            });

        if (!findUser) {
            return res.status(500).json({
                success: false,
                message: 'User not found!',
                data: {}
            });
        }

        // check old password 
        var checkPassword = await bcrypt.compare(oldPassword, findUser.password);

        if (!checkPassword) {
            return res.status(500).json({
                success: false,
                message: 'Your oldPassword is incorrect!',
                data: {}
            });
        }

        // check password == password conf
        if(newPassword != confPassword)
        {
            return res.status(500).json({
                success: false,
                message: "Your new password doesn't match with conf password!",
                data: {}
            });
        }

        var salt = await bcrypt.genSalt(10);
        var hashingPassword = await bcrypt.hash(newPassword, salt);

        var updateUser = await User.update({
            password: hashingPassword,
        },
        {
            where: {id: findUser.id}
        });
        
        if (updateUser) {

            res.send({
                success: true,
                message: 'Success update user password',
                data:  {}
            });
        } else {
            res.status(500).json({
                success: false,
                message: 'Failed update user password!',
                data: {}
            });
        }
    };

}

export default AuthController;

