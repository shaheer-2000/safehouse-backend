const fp = require('fastify-plugin');
const { PrismaClient } = require('@prisma/client');

const prismaPlugin = fp(async (server, options) => {
	const prisma = new PrismaClient();

	await prisma.$connect();

	server.decorate('prisma', prisma);

	server.addHook('onClose', async (server) => {
		await server.prisma.$disconnect();
	})
});

module.exports = prismaPlugin;
