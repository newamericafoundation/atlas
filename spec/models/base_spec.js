var assert = require('assert'),
	Backbone = require('backbone'),
	_ = require('underscore'),
	$ = require('jquery'),
	base = require('./../../app/models/base.js');


describe('base.Model', function() {


	var model = new base.Model();


	describe('get', function() {

		it('gets an attribute by field without a suffix', function() {
			var model = new base.Model({ name: 'Peter' });
			assert.equal(model.get('name'), 'Peter');
		});

		it('gets an attribute by field with a suffix', function() {
			var model = new base.Model({ name_2012: 'Peter' });
			assert.equal(model.get('name', '2012'), 'Peter');
		});

	});


	describe('addForeignField', function() {

		it('adds single foreign field', function() {
			var model = new base.Model({ id: 1, basket_id: 2 }),
				coll = new Backbone.Collection([ 
					{ id: 2, name: 'nice basket' },
					{ id: 4, name: 'nice basket xxx' }
				]);

			model.addForeignField('basket_id', coll, 'name');
			assert.equal(model.get('basket_name'), 'nice basket');
		});

		it('adds multiple foreign fields', function() {
			var model = new base.Model({ id: 1, basket_ids: [2,4] }),
				coll = new Backbone.Collection([ 
					{ id: 2, name: 'nice basket' },
					{ id: 4, name: 'very nice basket' }
				]);

			model.addForeignField('basket_ids', coll, 'name');
			assert.deepEqual(model.get('basket_names'), [ 'nice basket', 'very nice basket' ]);
		});

	});


	describe('findAndReplaceKey', function() {

		it('returns true if data key is found and replaced by standard key', function() {
			var parsedData = model.findAndReplaceKey({ id: 3, name: 'Michigan', Lat: 48.976 }, 'lat', ['latitude', 'Latitude', 'lat', 'Lat']);
			assert.equal(parsedData, true);
		});

		it('returns false if data key is not found in key format list', function() {
			var parsedData = model.findAndReplaceKey({ id: 3, name: 'Michigan', Long: 131.657 }, 'lat', ['latitude', 'Latitude', 'lat', 'Lat']);
			assert.equal(parsedData, false);
		});

	});

});
