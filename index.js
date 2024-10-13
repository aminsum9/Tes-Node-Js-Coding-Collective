

import express from 'express';
import "express-group-routes";
import bodyParser from "body-parser";
import multer from "multer";
import cors from "cors";
import { fileURLToPath, } from 'url';
import path, { dirname } from 'path';

import authController from "./controllers/user/authController.js";
import attendanceController from "./controllers/user/attendanceController.js";
import shiftController from "./controllers/user/shiftController.js";
import authMiddleware from './middleware/authMiddleware.js';

import authAdminController from "./controllers/admin/authController.js";
import attendanceAdminController from "./controllers/admin/attendanceController.js";
import shiftAdminController from "./controllers/admin/shiftController.js";
import reportController from "./controllers/admin/reportController.js";
import adminMiddleware from './middleware/adminMiddleware.js';

const app = express();

const port = process.env.PORT || 8000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use('/images/check_in', express.static(path.join(__dirname, '/images/check_in')));
app.use('/images/check_out', express.static(path.join(__dirname, '/images/check_out')));

app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.json());

app.use(cors())

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
        router.post('/register', new authController().register);
        router.post('/check-login', authMiddleware, new authController().checkLogin);
        router.post('/update', authMiddleware, new authController().update);
        router.post('/change-password', authMiddleware, new authController().changePassword);
        router.post('/logout', authMiddleware, new authController().logout);

        router.group('/admin', (router) => {
            router.post('/login', new authAdminController().login);
            router.post('/register', new authAdminController().register);
            router.post('/check-login', adminMiddleware, new authAdminController().checkLogin);
            router.post('/update', adminMiddleware, new authAdminController().update);
            router.post('/change-password', adminMiddleware, new authAdminController().changePassword);
            router.post('/logout', adminMiddleware, new authAdminController().logout);
        })
    });

    router.group('/attendance', (router) => {
        router.get('/', authMiddleware, new attendanceController().getAttendancesByUser);
        router.post('/check-attendance', authMiddleware, new attendanceController().checkAttendance);
        router.post('/check-in', authMiddleware, uploadCheckIn.single('photo'), new attendanceController().checkIn);
        router.post('/check-out', authMiddleware, uploadCheckOut.single('photo'), new attendanceController().checkOut);

        router.group('/admin', (router) => {
            router.get('/', adminMiddleware, new attendanceAdminController().getAttendances);
        })
    });

    router.group('/shift', (router) => {
        router.get('/', authMiddleware, new shiftController().getShifts);

        router.group('/admin', (router) => {
            router.get('/', adminMiddleware, new shiftAdminController().getShifts);
        })
    });

    router.group('/report', (router) => {
        router.get('/', adminMiddleware, new reportController().report);
        router.get('/download', new reportController().downloadPDF);
    });

});

app.listen(process.env.PORT || 8000, () => {
    console.log(`listen on port ${port}!`)
});