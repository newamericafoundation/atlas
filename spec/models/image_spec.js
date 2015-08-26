var assert = require('assert'),
	_ = require('underscore'),
	Backbone = require('backbone'),
	$ = require('jquery'),
	image = require('./../../app/models/image.js');


describe('image.Model', function() {

	var model;

	describe('url', function() {

		it('creates url by concatenating name to root url', function() {
			var urlRoot = '/api/v1/images';
			model = new image.Model({ name: 'picture' });
			assert.equal(model.url(), '/api/v1/images?name=picture');
		});

	});

});