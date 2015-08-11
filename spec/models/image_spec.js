var assert = require('assert'),
	_ = require('underscore'),
	Backbone = require('backbone'),
	$ = require('jquery'),
	image = require('./../../app/models/image.js');


describe('image.Model', function() {


	var model = new image.Model();


	describe('url', function() {

		it('creates url by concatenating name to root url', function() {
			var urlRoot = '/api/v1/images';
			im = new image.Model({ name: 'picture' });
			assert.equal(im.url(), '/api/v1/images?name=picture');
		});

	});

});