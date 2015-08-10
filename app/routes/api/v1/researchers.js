var router = require('express').Router();

router.get('/', function(req, res) {
	require('./base')(req, res, 'researchers');
});

module.exports = router;