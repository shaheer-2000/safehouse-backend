module.exports = async function (fastify, opts) {
	fastify.get('/:id', {
		onRequest: [fastify.verifyJWT],
		preValidation: [fastify.auth.hasRole([fastify.roles.ADMIN])],
	}, async (req, res) => {
		const { id } = req.params;

		const [err, orgRequest] = await fastify.to(fastify.prisma.orgRequest.findUnique({
			where: {
				id: parseInt(id, 10)
			},
		}));

		return orgRequest;
	});

	fastify.get('/', {
		onRequest: [fastify.verifyJWT],
		preValidation: [fastify.auth.hasRole([fastify.roles.ADMIN])],
	}, async (req, res) => {
		const [err, orgRequests] = await fastify.to(fastify.prisma.orgRequest.findMany({
			where: {},
		}));

		console.log(err);
		if (err) {
			return res.internalServerError();
		}

		return orgRequests
	});

	fastify.post('/', async (req, res) => {
		const { name, desc, website, email, address, phoneNum, logo, username } = req.body;
		
		const [err, orgRequest] = await fastify.to(fastify.prisma.orgRequest.create({
			data: {
				name,
				desc,
				website,
				email,
				address,
				phoneNum,
				logo,
				username
			}
		}));

		console.log(err, orgRequest);
		if (err) {
			return res.internalServerError();
		}

		return { ...orgRequest };
	});

	fastify.put('/:id', {
		onRequest: [fastify.verifyJWT],
		preValidation: [fastify.auth.hasRole([fastify.roles.ADMIN])],
	}, async (req, res) => {
		const { id } = req.params;
		const { markAs } = req.body;

		let accepted = markAs.toUpperCase().trim() === 'ACCEPTED';
		const [err, orgRequest] = await fastify.to(fastify.prisma.orgRequest.update({
			where: {
				id: parseInt(id, 10)
			},
			data: {
				status: accepted ? 'ACCEPTED' : 'REJECTED'
			}
		}));

		console.log(err);
		if (err) {
			return res.internalServerError();
		}

		if (!accepted) {
			return orgRequest;
		}

		const { id: _id, username, status, ...orgData } = orgRequest;

		// when accepted, then create org here
		// make transaction later
		const password = fastify.auth.genTempPassword();
		const [orgErr, org] = await fastify.to(fastify.prisma.login.create({
			data: {
				username,
				password: fastify.auth.hash(password),
				org: {
					create: {
						...orgData
					}
				},
				role: {
					create: {
						roleId: fastify.cachedRoleIds[fastify.roles.NGO]
					}
				}
			}
		}));

		console.log(orgErr, org);
		if (orgErr) {
			return res.internalServerError();
		}

		const mailResult = await fastify.mailer.sendMail(`"Safehouse.io" <${fastify.mailer.address}>`, orgRequest.email, 'Temporary Password For Login', `This is a randomly generated password for use within 48 hours: "${password}"`);
		if (!mailResult) {
			console.log('failed to send mail');
		}

		return orgRequest;
	});

	// fastify.delete('/:id', {
	// 	onRequest: [fastify.verifyJWT],
	// 	preValidation: [fastify.auth.hasRole([fastify.roles.LISTER])]
	// }, async (req, res) => {
	// 	const { id } = req.params;

	// 	const [err, orgRequest] = await fastify.to(fastify.prisma.orgRequest.delete({
	// 		where: {
	// 			id: parseInt(id, 10)
	// 		}
	// 	}));

	// 	console.log(err);
	// 	if (err) {
	// 		return res.internalServerError();
	// 	}

	// 	return { ...orgRequest };
	// })

	// fastify.delete('/', {
	// 	onRequest: [fastify.verifyJWT],
	// 	preValidation: [fastify.auth.hasRole([fastify.roles.LISTER])]
	// }, async (req, res) => {
	// 	const { ids } = req.body;

	// 	const deleteQueries = ids.map((id) => {
	// 		return fastify.to(fastify.prisma.orgRequest.delete({
	// 			where: {
	// 				id: parseInt(id, 10)
	// 			}
	// 		}));
	// 	});
	// 	const results = await Promise.all(deleteQueries);

	// 	for (const [err, _] of results) {
	// 		if (err) {
	// 			console.log(err);
	// 			return res.internalServerError();
	// 		}
	// 	}

	// 	return { success: true };
	// });
};
