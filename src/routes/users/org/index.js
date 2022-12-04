module.exports = async function (fastify, opts) {
	fastify.put('/:username', {
		onRequest: [fastify.verifyJWT],
		preValidation: [fastify.auth.hasRole([fastify.roles.ADMIN, fastify.roles.NGO])]
	}, async function (req, res) {
		const { username } = req.params;
		const isSelfUpdate = req.user.username === username;

		// ngo can update themselves only
		// admins can update any ngo
		if (req.user.role !== fastify.roles.ADMIN && !isSelfUpdate) {
			return res.forbidden();
		}

		const { name, desc, website, email, address, phoneNum, logo } = req.body;
		const updateData = {};
		if (name) {
			updateData.name = name;
		}
		if (desc) {
			updateData.desc = desc;
		}
		if (website) {
			updateData.website = website;
		}
		if (logo) {
			updateData.logo = logo;
		}
		if (email) {
			updateData.email = email;
		}
		if (phoneNum) {
			updateData.phoneNum = phoneNum;
		}
		if (address) {
			updateData.address = address;
		}

		const [updateErr, updatedNGO] = await fastify.to(fastify.prisma.organization.update({
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

		return updatedNGO;
	});


	fastify.delete('/:username', {
		onRequest: [fastify.verifyJWT],
		preValidation: [fastify.auth.hasRole([fastify.roles.ADMIN])]
	}, async function (req, res) {
		const { username } = req.params;

		const [err, result] = await fastify.to(fastify.prisma.organization.delete({
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
