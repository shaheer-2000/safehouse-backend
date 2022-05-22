module.exports = async function (fastify, opts) {
	fastify.put('/:username', {
		onRequest: [fastify.verifyJWT],
		preValidation: [fastify.auth.hasRole([fastify.roles.ADMIN])]
	}, async function (req, res) {
		const { username } = req.params;

		if (!fastify.auth.hasHigherAuthority(req.user.role, username)) {
			res.forbidden();
		}

		const { email, profileImage, phoneNum, address } = req.body;
		const updateData = {};
		if (email) {
			updateData.email = email;
		}
		if (profileImage) {
			updateData.profileImage = profileImage;
		}
		if (phoneNum) {
			updateData.phoneNum = phoneNum;
		}
		if (address) {
			updateData.address = address;
		}

		const [updateErr, updatedUser] = await fastify.to(fastify.prisma.user.update({
			where: {
				username
			},
			data: {
				...updateData
			}
		}));

		if (updateErr) {
			res.badRequest();
		}

		return updatedUser;
	});


	fastify.delete('/:username', {
		onRequest: [fastify.verifyJWT],
		preValidation: [fastify.auth.hasRole([fastify.roles.ADMIN])]
	}, async function (req, res) {
		const { username } = req.params;

		if (!fastify.auth.hasHigherAuthority(req.user.role, username)) {
			res.forbidden();
		}

		const [err, result] = await fastify.to(fastify.prisma.user.delete({
			where: {
				username
			}
		}));

		if (err) {
			console.log(err);
			res.internalServerError();
		}

		return result;
	});
};
