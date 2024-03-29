import 'babel-polyfill'

import assert from 'assert'
import Backbone from 'backbone'
import _ from 'underscore'
import $ from 'jquery'

import * as baseFilter from './../base_filter.js'

var indexOf = [].indexOf || function(item) {
	for (var i = 0, l = this.length; i < l; i++) {
		if (i in this && this[i] === item) return i;
	}
	return -1;
};

describe('baseFilter.Model', function() {


	var model = new baseFilter.Model();


	describe('activate', function() {

		it('returns true when model is activated', function() {
			var bfm = new baseFilter.Model({ id: 2, title: 'C' });
			assert.equal(bfm.activate().get('_isActive'), true );
		});

	});


	describe('deactivate', function() {

		it('returns false when model is deactivated', function() {
			var bfm = new baseFilter.Model({ id: 2, title: 'C' });
			assert.equal(bfm.deactivate().get('_isActive'), false );
		});

	});


	describe('isActive', function() {

		it('returns true if the model is actived', function() {
			var bfm = new baseFilter.Model({ id: 2, title: 'C' }).activate();
			assert.equal(bfm.isActive(), true);
		});

		it('returns false if the model is deactivated', function() {
			var bfm = new baseFilter.Model({ id: 2, title: 'C' }).deactivate();
			assert.equal(bfm.isActive(), false);
		});

	});


	describe('test', function() {

		it('returns false if model is deactivated', function() {
			var bfm = new baseFilter.Model({ id: 2, title: 'C', user_id: 'A' }, 'user').deactivate();
			assert.equal(bfm.test(), false);
		});

	});

});