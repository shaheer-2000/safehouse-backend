module.exports = async function (fastify, opts) {
	fastify.get('/', {
		onRequest: [fastify.verifyJWT],
		preValidation: [fastify.auth.hasRole([fastify.roles.ADMIN, fastify.roles.NGO])]
	}, async function (req, res) {
		const searchData = {};

		// ngo can only get their users/listers
		if (req.user.role === fastify.roles.NGO) {
			searchData = {
				orgUsername: req.user.username
			}
		}

		const [err, users] = await fastify.to(fastify.prisma.user.findMany({
			where: {
				...searchData
			},
			include: {
				OrgLogin: {
					select: {
						org: true,
					}
				}
			}
		}));

		if (err) {
			return res.badRequest();
		}
			
		return users.map((u) => {
			const { OrgLogin, dateOfBirth, ...user } = u;

			return {
				...user,
				dateOfBirth: fastify.dateTime.toLocaleTimeString(dateOfBirth),
				org: {
					...(OrgLogin.org)
				}
			}
		});
	});
};
