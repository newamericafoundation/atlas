var assert = require('assert'),
	util = require('../../models/util');

describe('testing environment', function() {

	describe('adaptId', function() {

		it('adapts ID', function() {
			var raw = { _id: { $oid: 1 } },
				expected = { id: 1 },
				actual = util.adaptId(raw);
			assert.deepEqual(expected, actual);
		});

	});
	

	describe('findById', function() {

		it('finds by id', function() {

			var models = [ 
					{ id: 1, name: 'model1' },
					{ id: 2, name: 'model2' },
					{ id: 3, name: 'model3' }
				],
				expected = { id: 2, name: 'model2' };

			assert.deepEqual(util.findById(models, 2), expected);

		});

	});


	describe('isTagShared', function() {

		it('detects matching tags in comma-separated series', function() {
			assert.equal(util.isTagShared('tag1,tag2,tag3', 'tag6,tag2,tagx'), true);
		});

		it('does not match if one of the tag strings is empty', function() {
			assert.equal(util.isTagShared('', ','), false);
		});

	});

});