module.exports = async function (fastify, opts) {
	fastify.put('/:username', {
		onRequest: [fastify.verifyJWT]
	}, async function (req, res) {
		const { username } = req.params;
		const isSelfUpdate = req.user.username === username;

		// user has higher authority than target
		// hasHigherAuthority for admin trying to update another admin check
		if (!isSelfUpdate && (!req.user.role !== fastify.roles.ADMIN || !fastify.auth.hasHigherAuthority(req.user.role, username))) {
			return res.forbidden();
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
			console.log(updateErr);
			return res.badRequest();
		}

		return updatedUser;
	});


	fastify.delete('/:username', {
		onRequest: [fastify.verifyJWT],
		preValidation: [fastify.auth.hasRole([fastify.roles.ADMIN, fastify.roles.NGO])]
	}, async function (req, res) {
		const { username } = req.params;

		if (!fastify.auth.hasHigherAuthority(req.user.role, username)) {
			return res.forbidden();
		}

		// ngo, but user/lister belongs to another ngo
		if (req.user.role === fastify.roles.NGO && !fastify.auth.isMemberOf(req.user.username, username)) {
			return res.forbidden();
		}

		const [err, result] = await fastify.to(fastify.prisma.user.delete({
			where: {
				username
			}
		}));

		if (err) {
			console.log(err);
			return res.internalServerError();
		}

		return result;
	});
};
