const fp = require('fastify-plugin');
const nodemailer = require('nodemailer');
const config = require('../config');

module.exports = fp(async (fastify, opts, next) => {
	// const testAccount = await nodemailer.createTestAccount();

	const transporter = nodemailer.createTransport({
		host: 'smtp.ethereal.email',
		port: 587,
		auth: {
			user: config.SMTP_USERNAME,
			pass: config.SMTP_PASS
		}
	});

	fastify.decorate('mailer', {
		sendMail: async function(from, to, subject, text) {
			const [err, info] = await fastify.to(transporter.sendMail({
				from,
				to,
				subject,
				text
			}));

			if (err) {
				console.log(err);
				return null;
			}

			return info.messageId;
		},
		address: config.SMTP_USERNAME
	}, ['to']);

	next();
});