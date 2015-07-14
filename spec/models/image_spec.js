var assert = require('assert'),
	_ = require('underscore'),
	Backbone = require('backbone'),
	$ = require('jquery'),
	image = require('./../../app/models/image');


describe('image.Model', function() {

	// "cannot read property Model of undefined" error when running gulp spec-server
	// var image = new image.Model();


	// describe('url', function() {

	// 	it('creates url by concatenating name to root url', function() {
	// 		var urlRoot = '/api/v1/images';
	// 		im = new image.Model({ name: 'picture' });
	// 		assert.equal(im.url(), '/api/v1/images?name=picture');
	// 	});

	// });

});