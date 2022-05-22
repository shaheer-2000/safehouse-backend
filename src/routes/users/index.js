const users = [
	{
		name: 'shaheer ahmed',
		username: 'shaheer@safehouse.io',
		role: 'admin'
	}
];

module.exports = async function (fastify, opts) {
  fastify.get('/', {
	  onRequest: [fastify.verifyJWT],
	  preValidation: [fastify.auth.hasRole([fastify.roles.USER, fastify.roles.LISTER, fastify.roles.ADMIN])]
  }, async function (req, res) {
    return req.user
  });
}
