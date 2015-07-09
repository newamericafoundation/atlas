var assert = require('assert'),
	Backbone = require('backbone'),
	_ = require('underscore'),
	$ = require('jquery'),
	item = require('./../../app/models/item');


describe('item.Model', function() {

	var model = new item.Model();

	describe('_processValues', function() {

		it('splits values in string separated by | and converts into array', function() {
			var parsedData = model._processValues({ someKey: 'one|two|four' });
			assert.deepEqual(parsedData, { someKey: ['one', 'two', 'four'] });
		});

		it('does not split values or convert to array if there is a return character', function() {
			var parsedData = model._processValues({ someKey: 'hello\n goodbye' });
			assert.deepEqual(parsedData, { someKey: 'hello\n goodbye' });
		});

	});


	describe('_checkPindrop', function() {

	});

});
