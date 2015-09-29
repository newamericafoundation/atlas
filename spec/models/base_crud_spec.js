var assert = require('assert'),
	Backbone = require('backbone'),
	_ = require('underscore'),
	$ = require('jquery'),
	baseCrud = require('./../../app/models/base_crud.js');


describe('baseCrud.Collection', function() {

	describe('buildQueryString', function() {

		it('builds empty query string', function() {
			var coll = new baseCrud.Collection();
			assert.equal(coll.buildQueryString({}), null);
		});

		it('builds query string from single query', function() {
			var coll = new baseCrud.Collection();
			assert.equal(coll.buildQueryString({ a: 'b' }), 'a=b');
		});

		it('builds query string from multiple queries', function() {
			var coll = new baseCrud.Collection();
			assert.equal(coll.buildQueryString({ a: 'b', c: 'd' }), 'a=b&c=d');
		});

	});

	describe('buildFieldString', function() {

		it('builds empty field string', function() {
			var coll = new baseCrud.Collection();
			assert.equal(coll.buildFieldString({}), null);
		});

		it('builds field string from single field', function() {
			var coll = new baseCrud.Collection();
			assert.equal(coll.buildFieldString({ a: 1 }), 'fields=a');
		});

		it('builds field string from multiple fields', function() {
			var coll = new baseCrud.Collection();
			assert.equal(coll.buildFieldString({ a: 1, b: 0 }), 'fields=a,-b');
		});

	});

});