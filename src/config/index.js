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
	}
};

module.exports = config;
