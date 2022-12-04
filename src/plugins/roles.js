const fp = require('fastify-plugin');
const roleConstants = require('../config').ROLES;

const rolesPlugin = fp(async (fastify, opts, next) => {
	fastify.decorate('roles', {
		...roleConstants
	});

	const [err, roles] = await fastify.to(fastify.prisma.role.findMany({
		where: {},
		select: {
			id: true,
			name: true
		}
	}));

	if (err) {
		throw Error('failed to register role ids');
	} else {
		const cachedRoles = {};
		for (const role of roles) {
			cachedRoles[role.name] = role.id;
		}

		fastify.decorate('cachedRoleIds', {
			...cachedRoles
		});
	}

	next();
});

module.exports = rolesPlugin;
