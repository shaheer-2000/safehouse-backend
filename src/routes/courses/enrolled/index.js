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

		const [err, enrollments] = await fastify.to(fastify.prisma.courseEnrolledIn.findMany({
			where: {
				username
			},
			include: {
				Course: true
			}
		}));

		if (err) {
			console.log(err);
			return res.internalServerError();
		}

		return enrollments;
	});

	fastify.post('/', {
		onRequest: [fastify.verifyJWT],
	}, async (req, res) => {
		const { courseId } = req.body;

		const [err, enrollment] = await fastify.to(fastify.prisma.courseEnrolledIn.create({
			data: {
				username: req.user.username,
				courseId: parseInt(courseId, 10)
			}
		}));

		if (err) {
			console.log(err);
			return res.internalServerError();
		}

		return enrollment;
	});

	fastify.put('/:courseId', {
		onRequest: [fastify.verifyJWT],
	}, async (req, res) => {
		const { courseId } = req.params;
		const { status } = req.body;

		const [err, enrollment] = await fastify.to(fastify.prisma.courseEnrolledIn.update({
			where: {
				username_courseId: {
					username: req.user.username,
					courseId: parseInt(courseId, 10)
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

		return enrollment;
	});
};
