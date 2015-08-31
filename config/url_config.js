var port = process.env['PORT'] || 8081;

export default {
	'development': '127.0.0.1:' + port,
	'production': 'atlas.newamerica.org'
};