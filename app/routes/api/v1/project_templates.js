var express = require('express'),
	router = express.Router();

router.get('/', function(req, res) {
	require('./base')(req, res, 'project_templates');
});

module.exports = router;