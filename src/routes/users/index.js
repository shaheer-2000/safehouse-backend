module.exports = async function (fastify, opts) {
	fastify.get('/', {
		onRequest: [fastify.verifyJWT],
		preValidation: [fastify.auth.hasRole([fastify.roles.ADMIN])]
	}, async function (req, res) {
		const [err, users] = await fastify.to(fastify.prisma.user.findMany({
			where: {},
			include: {
				OrgLogin: {
					select: {
						org: true,
					}
				}
			}
		}))

		if (err) {
			res.badRequest();
		} else {
			return users;
		}
	});
};
