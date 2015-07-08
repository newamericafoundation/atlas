var assert = require('assert'),
	Backbone = require('backbone'),
	_ = require('underscore'),
	$ = require('jquery'),
	base = require('./../../app/models/base');


describe('base.Model', function() {

	var model = new base.Model();

	describe('_adaptMongoId', function() {

		it('extracts mongo id', function() {
			var parsedData = model._adaptMongoId({ _id: { $oid: 2 } });
			assert.deepEqual(parsedData, { id: 2 });
		});
		
	});


	describe('_removeArrayWrapper', function() {

		it('removes array wrapper if it contains a single value', function() {
			var parsedData = model._removeArrayWrapper([ 2 ]);
			assert.equal(parsedData, 2);
		});
		
	});


	describe('_removeLineBreaks', function() {

		it('removes line break if it contains multiple lines', function() {
			var parsedData = model._removeLineBreaks([ 'nice\n basket' ], [0]);
			assert.deepEqual(parsedData, [ 'nice basket' ]);
		});

	});


	describe('_removeSpaces', function() {

		it('removes spaces if it contains spaces', function() {
			var parsedData = model._removeSpaces([ ' ni ce b ask et ' ], [0]);
			assert.deepEqual(parsedData, [ 'nicebasket' ]);
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
			var model = new base.Model({ id: 1, basket_ids: [ 2, 4] }),
				coll = new Backbone.Collection([ 
					{ id: 2, name: 'nice basket' },
					{ id: 4, name: 'very nice basket' }
				]);

			model.addForeignField('basket_ids', coll, 'name');
			assert.deepEqual(model.get('basket_names'), [ 'nice basket', 'very nice basket' ]);
		});

	});

});
