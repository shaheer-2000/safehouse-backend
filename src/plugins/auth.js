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
		},
		hash: auth.hashPass,
		hasValidCredentials: async function (username, password) {
			const [err, user] = await fastify.to(fastify.prisma.login.findUnique({
				where: {
					username
				}
			}));
			console.log(err, user);

			if (err) {
				return false;
			}

			console.log(password, user.password);
			return auth.compPass(password, user.password);
		},
		hasPermission: async function (userRole, requiredRole) {
			const results = await Promise.all([
				fastify.to(fastify.prisma.role.findFirst({
					where: {
						name: userRole
					},
					select: {
						authLevel: true
					}
				})),
				fastify.to(fastify.prisma.role.findFirst({
					where: {
						name: requiredRole
					},
					select: {
						authLevel: true
					}
				}))
			]);

			const [userRoleData, requiredRoleData] = results;
			const [uRoleErr, uRole] = userRoleData;
			const [requiredRoleErr, targetRole] = requiredRoleData;

			console.log(results);
			if (uRoleErr || requiredRoleErr) {
				console.log(uRoleErr || requiredRoleErr);
				return false;
			}

			if (!uRole || !targetRole) {
				return false;
			}
	
			return uRole.authLevel >= targetRole.authLevel;
		},
		hasHigherAuthority: async function (userRole, targetUsername) {
			const results = await Promise.all([
				fastify.to(fastify.prisma.user.findFirst({
					where: {
						username: targetUsername
					},
					include: {
						UserLogin: {
							select: {
								role: {
									select: {
										Role: true
									}
								}
							}
						}
					}
				})),
				fastify.to(fastify.prisma.role.findFirst({
					where: {
						name: userRole
					}
				}))
			]);

			const [userData, roleData] = results;
			const [userErr, user] = userData;
			const [roleErr, role] = roleData;

			console.log(results);
			if (userErr || roleErr) {
				console.log(userErr || roleErr);
				return false;
			}

			if (!user || !role) {
				return false;
			}
	
			return role.authLevel > user.UserLogin.role.Role.authLevel;
		},
		isMemberOf: async function (orgUsername, targetUsername) {
			const [userErr, user] = await fastify.to(fastify.prisma.user.findUnique({
				where: {
					username: targetUsername
				},
				select: {
					orgUsername: true
				}
			}));

			if (userErr) {
				console.log(userErr);
				return false;
			}

			if (!user) {
				return false;
			}

			return orgUsername === user.orgUsername;
		},
		genTempPassword: function () {
			return auth.genTempPass();
		}
	}, ['to', 'prisma']);

	next();
});

module.exports = authPlugin;
