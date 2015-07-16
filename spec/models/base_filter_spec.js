var assert = require('assert'),
	_ = require('underscore'),
	Backbone = require('backbone'),
	$ = require('jquery'),
	indexOf = [].indexOf || function(item) {
		for (var i = 0, l = this.length; i < l; i++) {
			if (i in this && this[i] === item) return i;
		}
		return -1;
	},
	baseFilter = require('./../../app/models/base_filter');


describe('baseFilter.Model', function() {


	var model = new baseFilter.Model();


	describe('_activate', function() {

		it('returns true when model is activated', function() {
			var bfm = new baseFilter.Model({ id: 2, title: 'C' });
			assert.equal(bfm._activate().get('_isActive'), true );
		});

	});


	describe('_deactivate', function() {

		it('returns false when model is deactivated', function() {
			var bfm = new baseFilter.Model({ id: 2, title: 'C' });
			assert.equal(bfm._deactivate().get('_isActive'), false );
		});

	});


	describe('isActive', function() {

		it('returns true if the model is actived', function() {
			var bfm = new baseFilter.Model({ id: 2, title: 'C' })._activate();
			assert.equal(bfm.isActive(), true);
		});

		it('returns false if the model is deactivated', function() {
			var bfm = new baseFilter.Model({ id: 2, title: 'C' })._deactivate();
			assert.equal(bfm.isActive(), false);
		});

	});


	describe('test', function() {

		it('returns false if model is deactivated', function() {
			var bfm = new baseFilter.Model({ id: 2, title: 'C', user_id: 'A' }, 'user')._deactivate();
			assert.equal(bfm.test(), false);
		});

	});

});