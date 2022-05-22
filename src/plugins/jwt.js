const fp = require('fastify-plugin');
const config = require('../config');

const jwtPlugin = fp(async function(fastify, opts) {
	fastify.register(require('@fastify/jwt'), {
		secret: config.JWT_SECRET,
		sign: {
			algorithm: 'HS256',
			iss: 'safehouse.io',
			expiresIn: '120m'
		},
		verify: {
			allowedIss: 'safehouse.io'
		},
		formatUser: function (user) {
			console.log(user);
			return {
				username: user.username,
				role: user.role
			}
		}
	});

	fastify.decorate('verifyJWT', async function (req, res) {
		try {
			await req.jwtVerify();

			const user = req.user;
			if (typeof user.role === 'undefined') {
				throw Error();
			}
		} catch (e) {
			res.unauthorized();
		}
	});
});

module.exports = jwtPlugin;
