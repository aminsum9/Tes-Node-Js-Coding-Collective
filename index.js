

import express from 'express';
import "express-group-routes";
import bodyParser from "body-parser";

import authController from "./controllers/authController.js";
import authMiddleware from './middleware/authMiddleware.js';

const app = express();

const port = process.env.PORT || 8000;

app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.json());

app.group('/api', (router) => {

	router.group('/auth', (router) => {
		router.post('/login', new authController().login);
		router.post('/register',new authController().register);
		router.post('/check-login',authMiddleware,new authController().checkLogin);
		router.post('/update',authMiddleware,new authController().update);
		router.post('/change-password',authMiddleware,new authController().changePassword);
    });
    
});

app.listen(process.env.PORT || 8000, () => {
	console.log(`listen on port ${port}!`)
});
