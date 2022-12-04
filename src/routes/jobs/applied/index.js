module.exports = async function (fastify, opts) {
	fastify.get('/:username', {
		onRequest: [fastify.verifyJWT],
	}, async (req, res) => {
		let { username } = req.params;
		username = username.toLowerCase().trim();
		
		const isSelf = username === req.user.username;
		if (!isSelf && req.user.role !== fastify.roles.ADMIN) {
			return res.forbidden();
		}

		const [err, applications] = await fastify.to(fastify.prisma.jobAppliedFor.findMany({
			where: {
				username
			},
			include: {
				Job: true
			}
		}));

		if (err) {
			console.log(err);
			return res.internalServerError();
		}

		return applications;
	});

	fastify.post('/', {
		onRequest: [fastify.verifyJWT],
	}, async (req, res) => {
		const { jobId } = req.body;

		const [err, application] = await fastify.to(fastify.prisma.jobAppliedFor.create({
			data: {
				username: req.user.username,
				jobId: parseInt(jobId, 10)
			}
		}));

		if (err) {
			console.log(err);
			return res.internalServerError();
		}

		return application;
	});

	fastify.put('/:jobId', {
		onRequest: [fastify.verifyJWT],
	}, async (req, res) => {
		const { jobId } = req.params;
		const { status } = req.body;

		const [err, application] = await fastify.to(fastify.prisma.jobAppliedFor.update({
			where: {
				username_jobId: {
					username: req.user.username,
					jobId: parseInt(jobId, 10)
				}
			},
			data: {
				status: status.toUpperCase().trim(),
				updatedAt: fastify.dateTime.toUTCString(Date.now())
			}
		}));

		if (err) {
			console.log(err);
			return res.internalServerError();
		}

		return application;
	});
};
