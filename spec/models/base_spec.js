var assert = require('assert'),
	Backbone = require('backbone'),
	_ = require('underscore'),
	$ = require('jquery'),
	base = require('./../../app/backbone_models/base');


describe('base.Model', function() {

	var model = new base.Model();

	describe('_adaptMongoId', function() {

		it('extracts mongo id', function() {
			var parsedData = model._adaptMongoId({ _id: { $oid: 2 } });
			assert.deepEqual(parsedData, { id: 2 });
		});
		
	});


	describe('_removeArrayWrapper', function() {

		it('remove array wrapper if it contains a single value', function() {
			var parsedData = model._removeArrayWrapper([ 2 ]);
			assert.equal(parsedData, 2);
		});
		
	});

});
