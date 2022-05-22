const fastify = require('fastify');
const autoload = require('@fastify/autoload');
const path = require('path');

const buildApp = async (fastifyOpts = {}, pluginOpts = {}) => {
	const app = fastify(fastifyOpts);

	// autoload plugins
	app.register(autoload, {
		dir: path.join(__dirname, 'plugins'),
		options: pluginOpts
	});

	// autoload routes
	app.register(autoload, {
		dir: path.join(__dirname, 'routes'),
		options: Object.assign({
			prefix: '/api'
		}, pluginOpts)
	});

	return app;
};

module.exports = buildApp;
