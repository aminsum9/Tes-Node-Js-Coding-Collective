

import express from 'express';
import "express-group-routes";
import bodyParser from "body-parser";
import multer from "multer";

import authController from "./controllers/authController.js";
import attendanceController from "./controllers/attendanceController.js";
import authMiddleware from './middleware/authMiddleware.js';

const app = express();

const port = process.env.PORT || 8000;

app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.json());

const storageCheckIn = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'images/check_in');
    },
    filename: (req, file, cb) => {
        const fileName = `check-in-${Date.now()}.jpg`;
        cb(null, fileName);
    }
});

const uploadCheckIn = multer({ storage: storageCheckIn });

const storageCheckOut = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'images/check_out');
    },
    filename: (req, file, cb) => {
        const fileName = `check-out-${Date.now()}.jpg`;
        cb(null, fileName);
    }
});

const uploadCheckOut = multer({ storage: storageCheckOut });

app.group('/api', (router) => {

	router.group('/auth', (router) => {
		router.post('/login', new authController().login);
		router.post('/register',new authController().register);
		router.post('/check-login',authMiddleware,new authController().checkLogin);
		router.post('/update',authMiddleware,new authController().update);
		router.post('/change-password',authMiddleware,new authController().changePassword);
    });
    
	router.group('/attendance', (router) => {
		router.post('/',authMiddleware,new attendanceController().getAttendancesByUser);
        router.post('/check-in', authMiddleware, uploadCheckIn.single('photo'), new attendanceController().checkIn);
		router.post('/check-out',authMiddleware, uploadCheckOut.single('photo'),new attendanceController().checkOut);
    });
    
});

app.listen(process.env.PORT || 8000, () => {
	console.log(`listen on port ${port}!`)
});