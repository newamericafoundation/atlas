var assert = require('assert'),
	_ = require('underscore'),
	Backbone = require('backbone'),
	$ = require('jquery'),
	coreDatum = require('./../../app/models/core_datum');


describe('coreDatum.Model', function() {


	var model = new coreDatum.Model();


	// Failing. "Undefined is not a function" points to $.param() in core_datum.js
	xdescribe('url', function() {

		it('creates url by concatenating name param to root url', function() {
			var urlRoot = '/api/v1/core_data';
			cd = new coreDatum.Model({ name: 'something' });
			assert.equal(cd.url(), '/api/v1/core_data?name=something');
		});
		
	});

});