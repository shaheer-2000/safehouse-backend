module.exports = async function (fastify, opts) {
	fastify.get('/:id', {
		onRequest: [fastify.verifyJWT],
	}, async (req, res) => {
		const { id } = req.params;

		const [err, job] = await fastify.to(fastify.prisma.job.findUnique({
			where: {
				id: parseInt(id, 10)
			},
			include: {
				Lister: true
			}
		}));

		return job;
	});

	fastify.get('/', {
		onRequest: [fastify.verifyJWT]
	}, async (req, res) => {
		const [err, jobs] = await fastify.to(fastify.prisma.job.findMany({
			where: {},
			include: {
				Lister: {
					select: {
						userLogin: {
							select: {
								firstname: true,
								lastname: true
							}
						}
					}
				}
			},
		}));

		console.log(err);
		if (err) {
			return res.internalServerError();
		}

		return jobs.map((job) => {
			const { Lister, ...data } = job;

			return {
				...data,
				listerName: `${Lister.userLogin.firstname} ${Lister.userLogin.lastname}`
			}
		});
	});

	fastify.post('/', {
		onRequest: [fastify.verifyJWT],
		preValidation: [fastify.auth.hasRole([fastify.roles.LISTER])]
	}, async (req, res) => {
		const { name, desc, employer, url } = req.body;
		
		const [err, job] = await fastify.to(fastify.prisma.job.create({
			data: {
				name,
				desc,
				employer,
				url,
				lister: req.user.username 
			}
		}));

		console.log(err, job);
		if (err) {
			return res.internalServerError();
		}

		return { ...job };
	});

	fastify.delete('/:id', {
		onRequest: [fastify.verifyJWT],
		preValidation: [fastify.auth.hasRole([fastify.roles.LISTER])]
	}, async (req, res) => {
		const { id } = req.params;

		const [err, job] = await fastify.to(fastify.prisma.job.delete({
			where: {
				id: parseInt(id, 10)
			}
		}));

		console.log(err);
		if (err) {
			return res.internalServerError();
		}

		return { ...job };
	})

	fastify.delete('/', {
		onRequest: [fastify.verifyJWT],
		preValidation: [fastify.auth.hasRole([fastify.roles.LISTER])]
	}, async (req, res) => {
		const { ids } = req.body;

		const deleteQueries = ids.map((id) => {
			return fastify.to(fastify.prisma.job.delete({
				where: {
					id: parseInt(id, 10)
				}
			}));
		});
		const results = await Promise.all(deleteQueries);

		for (const [err, _] of results) {
			if (err) {
				console.log(err);
				return res.internalServerError();
			}
		}

		return { success: true };
	});
};
