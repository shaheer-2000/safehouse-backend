module.exports = async function (fastify, opts) {
	fastify.get('/', {
		onRequest: [fastify.verifyJWT],
		preValidation: [fastify.auth.hasRole([fastify.roles.ADMIN])]
	}, async function (req, res) {
		const [err, orgs] = await fastify.to(fastify.prisma.organization.findMany({
			where: {}
		}));

		if (err) {
			return res.badRequest();
		}
			
		return orgs;
	});
};
