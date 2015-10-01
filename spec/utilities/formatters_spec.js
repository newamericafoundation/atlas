var assert = require('assert'),
	_ = require('underscore'),
	formatters = require('./../../app/utilities/formatters.js');

describe('formatters', function() {

	describe('removeLineBreaks', function() {

		it('removes line break if it contains multiple lines', function() {
			assert.deepEqual(formatters.removeLineBreaks('nice\n basket'), 'nice basket');
		});

	});


	describe('removeSpaces', function() {

		it('removes spaces if it contains spaces', function() {
			assert.deepEqual(formatters.removeSpaces(' ni ce b ask et '), 'nicebasket');
		});

	});

});