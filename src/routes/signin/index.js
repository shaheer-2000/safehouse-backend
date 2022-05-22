const signinRoutes = async (fastify, opts) => {
	fastify.post('/', async (req, res) => {
		const { username: _username, password } = req.body;
		const username = _username.toLowerCase().trim();

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
				},
			}
		}));
		console.log(err, user);

		const payload = {
			username,
			role: user.role.Role.name,
		};
		const token = fastify.jwt.sign({
			...payload
		});

		if (payload.role === fastify.roles.ADMIN) {
			return { ...payload, token };
		}

		const isOrg = user.role.Role.name === fastify.roles.NGO;
		let userSearchData = {};

		if (!isOrg) {
			userSearchData = {
				userLogin: {
					select: {
						firstname: true,
						lastname: true,
						email: true,
						phoneNum: true,
						profileImage: true,
						OrgLogin: {
							select: {
								org: {
									select: {
										name: true
									}
								}
							}
						}
					}
				},
			};
		} else {
			userSearchData = {
				org: {
					select: {
						name: true,
						email: true,
						website: true,
						phoneNum: true,
						logo: true
					}
				}
			};
		}

		const [userErr, userData] = await fastify.to(fastify.prisma.login.findUnique({
			where: {
				username
			},
			select: {
				...userSearchData
			}
		}));
		console.log(userErr, userData);

		const _resBody = {
			username,
			role: user.role.Role.name,
			name: !isOrg ? `${userData.userLogin.firstname} ${userData.userLogin.lastname}` : userData.org.name,
			email: !isOrg ? userData.userLogin.email : userData.org.email,
			phoneNum: !isOrg ? userData.userLogin.phoneNum : userData.org.phoneNum,
			profileImage: !isOrg ? userData.userLogin.profileImage : userData.org.logo,
		};

		const resBody = !isOrg ? Object.assign({
			affiliatedOrg: userData.userLogin.OrgLogin.org.name
		}, { ..._resBody }) : 
		Object.assign({
			website: userData.org.website
		}, { ..._resBody });

		return { ...resBody, token };
	});
};

module.exports = signinRoutes;
