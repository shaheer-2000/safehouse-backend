module.exports = async function (fastify, opts) {
	fastify.get('/:id', {
		onRequest: [fastify.verifyJWT],
	}, async (req, res) => {
		const { id } = req.params;

		const [err, course] = await fastify.to(fastify.prisma.course.findUnique({
			where: {
				id: parseInt(id, 10)
			},
			include: {
				Lister: true
			}
		}));

		return course;
	});

	fastify.get('/', {
		onRequest: [fastify.verifyJWT]
	}, async (req, res) => {
		const [err, courses] = await fastify.to(fastify.prisma.course.findMany({
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

		return courses.map((course) => {
			const { Lister, ...data } = course;

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
		const { name, desc, instructor, url } = req.body;
		
		const [err, course] = await fastify.to(fastify.prisma.course.create({
			data: {
				name,
				desc,
				instructor,
				url,
				lister: req.user.username 
			}
		}));

		console.log(err, course);
		if (err) {
			return res.internalServerError();
		}

		return { ...course };
	});

	fastify.delete('/:id', {
		onRequest: [fastify.verifyJWT],
		preValidation: [fastify.auth.hasRole([fastify.roles.LISTER])]
	}, async (req, res) => {
		const { id } = req.params;

		const [err, course] = await fastify.to(fastify.prisma.course.delete({
			where: {
				id: parseInt(id, 10)
			}
		}));

		console.log(err);
		if (err) {
			return res.internalServerError();
		}

		return { ...course };
	})

	fastify.delete('/', {
		onRequest: [fastify.verifyJWT],
		preValidation: [fastify.auth.hasRole([fastify.roles.LISTER])]
	}, async (req, res) => {
		const { ids } = req.body;

		const deleteQueries = ids.map((id) => {
			return fastify.to(fastify.prisma.course.delete({
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
