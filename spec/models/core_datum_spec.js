var assert = require('assert'),
	_ = require('underscore'),
	Backbone = require('backbone'),
	$ = require('jquery'),
	coreDatum = require('./../../app/models/core_datum');


describe('coreDatum.Model', function() {


	var model;


	describe('url', function() {

		it('creates url by concatenating name to root url', function() {
			model = new coreDatum.Model({ name: 'something' });
			assert.equal(model.url(), '/api/v1/core_data?name=something');
		});
		
	});

});