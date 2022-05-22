module.exports = async (fastify, opts) => {
	if (process.env.NODE_ENV === "development") {
		fastify.post('/', async (req, res) => {
			const { username: _username, password } = req.body;
			const username = _username.toLowerCase().trim();

			const [err, user] = await fastify.to(fastify.prisma.login.create({
				data: {
					username,
					password: fastify.auth.hash(password),
					role: {
						create: {
							roleId: fastify.cachedRoleIds[fastify.roles.ADMIN]
						}
					}
				},
			}));

			if (err) {
				console.log(err);
				res.internalServerError();
			} else {
				return user;
			}
		});
	}

	fastify.post('/admin', {
		onRequest: [fastify.verifyJWT],
		preValidation: [fastify.auth.hasRole([fastify.roles.ADMIN])]
	}, async (req, res) => {
		// signup NGOs here
		const { username: _username, password, ...orgData } = req.body;
		const username = _username.toLowerCase().trim();

		const [userErr, user] = await fastify.to(fastify.prisma.login.create({
			data: {
				username,
				password: fastify.auth.hash(password),
				org: {
					create: {
						...orgData
					}
				},
				role: {
					create: {
						roleId: fastify.cachedRoleIds[fastify.roles.NGO]
					}
				}
			}
		}));

		console.log(userErr, user);
		if (userErr) {
			res.internalServerError();
		} else {
			return user;
		}
	});

	fastify.post('/ngo', {
		onRequest: [fastify.verifyJWT],
		preValidation: [fastify.auth.hasRole([fastify.roles.NGO])]
	}, async (req, res) => {
		// signup listers and users here
		const { username: _username, password, dateOfBirth, role, ...userData } = req.body;
		const username = _username.toLowerCase().trim();

		const orgUsername = req.user.username;
		const assignableRoles = [fastify.roles.LISTER, fastify.roles.USER];
		
		const normalizedRole = role.toUpperCase().trim();
		if (!assignableRoles.includes(normalizedRole)) {
			return res.badRequest();
		}

		const [err, user] = await fastify.to(fastify.prisma.login.create({
			data: {
				username,
				password: fastify.auth.hash(password),
				userLogin: {
					create: {
						...userData,
						dateOfBirth: new Date(dateOfBirth),
						orgUsername
					}
				},
				role: {
					create: {
						roleId: fastify.cachedRoleIds[normalizedRole]
					}
				}
			}
		}));

		console.log(err, user);
		if (err) {
			res.internalServerError();
		} else {
			return user;
		}
	});
};
