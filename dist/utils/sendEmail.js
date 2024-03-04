import nodemailer from 'nodemailer';
import logger from './logger.js';
import dotenv from 'dotenv';
dotenv.config();


export default async(from, to, subject, message) => {
	const transporter = nodemailer.createTransport({
		host: process.env.EMAIL_HOST,
		port: 587,
		secure: false,
		secureOptions:{
			ssl: 'TLSv1_2_method'
		},
		auth:{
			user: process.env.EMAIL_USER,
			pass: process.env.EMAIL_PASS
		},
		tls:{
			rejectUnauthorized: true
		}
	});


	await new Promise((resolve, reject) => {
		transporter.verify(function (error, success) {
			if (error) {
				logger.error(error);
				reject(error);
			} else {
				logger.info('Server is ready to take our messages');
				resolve(success);
			}
		});
	});


	const options = {
		from,
		to,
		subject,
		html: message
	};

	await new Promise((resolve, reject) => {
		transporter.sendMail(options, (err, info) => {
			if (err) {
				logger.error(err);
				reject(err);
			} else {
				logger.info(info);
				resolve(info);
			}
		});
	});
};