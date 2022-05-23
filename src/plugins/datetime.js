const fp = require('fastify-plugin');
const { dateTime } = require('../utils');

module.exports = fp(async (fastify, opts, next) => {
	fastify.decorate('dateTime', {
		toUTCString: dateTime.toUTCString,
		toLocaleTimeString: dateTime.toLocaleTimeString,
		getDateUnits: dateTime.getDateUnits
	});

	next();
});

