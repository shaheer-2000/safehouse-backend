const fp = require('fastify-plugin');
const auth = require('../utils').auth;

const authPlugin = fp(async (fastify, opts, next) => {
	fastify.decorate('auth', {
		hasRole: function (allowedRoles) {
			return function (req, res, done) {
				const userAllowed = auth.hasRole(req.user.role, allowedRoles);
				if (!userAllowed) {
					res.unauthorized();
				}

				done();
			}
		}
	});

	next();
});

module.exports = authPlugin;
