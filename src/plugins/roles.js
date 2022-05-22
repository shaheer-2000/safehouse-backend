const fp = require('fastify-plugin');
const roles = require('../config').ROLES;

const rolesPlugin = fp(async (fastify, opts, next) => {
	fastify.decorate('roles', {
		...roles
	});

	next();
});

module.exports = rolesPlugin;
