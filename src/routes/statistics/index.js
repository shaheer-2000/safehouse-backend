module.exports = async (fastify, opts) => {
	fastify.get('/', {
		onRequest: [fastify.verifyJWT],
		preValidation: [fastify.auth.hasRole([fastify.roles.ADMIN])]
	}, async (req, res) => {
		const [err, statistics] = await fastify.to(fastify.prisma.statistics.findMany({
			where: {}
		}));

		if (err) {
			console.log(err);
			return res.internalServerError();
		}

		return statistics.map((statistic) => {
			const { id, month, year, ...stats } = statistic;
			
			return {
				month: fastify.dateTime.intToMonth(month).toUpperCase(),
				year: `${year}`,
				...stats
			};
		});
	});
};
