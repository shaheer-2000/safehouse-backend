const signinRoutes = async (fastify, opts) => {
	fastify.post('/', async (req, res) => {
		const token = fastify.jwt.sign(req.body);

		return { token }
	});
};

module.exports = signinRoutes;
