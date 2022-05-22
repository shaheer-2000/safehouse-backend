const config = require('./src/config');
const buildApp = require('./src/app');

(async () => {
	const server = await buildApp({
		logger: {
			level: 'info',
			prettyPrint: true
		}
	});

	server.listen(config.PORT, () => console.log(`Listening on port: ${config.PORT}`));
})();
