const dotenv = require('dotenv');
dotenv.config();

const config = {
	PORT: parseInt(process.env.PORT, 10) || 3000,
	JWT_SECRET: process.env.JWT_SECRET,
	ROLES: {
		USER: 'user',
		LISTER: 'lister',
		NGO: 'ngo',
		ADMIN: 'admin'
	}
};

module.exports = config;
