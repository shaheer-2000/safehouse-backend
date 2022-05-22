const signinRoutes = async (fastify, opts) => {
	fastify.post('/', async (req, res) => {
		const { username, password } = req.body;
		const validCredentials = fastify.auth.hasValidCredentials(username, password);
		
		if (!validCredentials) {
			return res.badRequest();
		}

		const [err, user] = await fastify.to(fastify.prisma.login.findUnique({
			where: {
				username
			},
			select: {
				username: true,
				role: {
					select: {
						Role: {
							select: {
								name: true
							}
						}
					}
				}
			}
		}));
		console.log(err, user);
		const payload = {
			username,
			role: user.role.Role.name
		};
		const token = fastify.jwt.sign({
			...payload
		});

		return { ...payload, token }
	});
};

module.exports = signinRoutes;
