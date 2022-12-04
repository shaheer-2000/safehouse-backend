const dotenv = require('dotenv');
dotenv.config();

const config = {
	PORT: parseInt(process.env.PORT, 10) || 3000,
	JWT_SECRET: process.env.JWT_SECRET,
	ROLES: {
		USER: 'USER',
		LISTER: 'LISTER',
		NGO: 'NGO',
		ADMIN: 'ADMIN'
	},
	SMTP_USERNAME: process.env.SMTP_USERNAME,
	SMTP_PASS: process.env.SMTP_PASS
};

module.exports = config;
