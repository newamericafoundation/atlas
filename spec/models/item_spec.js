var assert = require('assert'),
	_ = require('underscore'),
	Backbone = require('backbone'),
	$ = require('jquery'),
	item = require('./../../app/models/item.js'),
	variable = require('./../../app/models/variable.js');

var indexOf = [].indexOf || function(item) {
	for (var i = 0, l = this.length; i < l; i++) {
		if (i in this && this[i] === item) return i;
	}
	return -1;
};

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


	describe('_checkPin', function() {

		it('returns true with no errors if both lat and long keys exist', function() {
			var parsedData = model._checkPin({ id: 1, Latitude: 145.678, Longitude: 36.879 });
			assert.deepEqual(parsedData._itemType, 'pin');
		});

		it('returns false if either lat or long key are not present', function() {
			var parsedData = model._checkPin({ id: 1, Lat: 145.678 });
			assert.deepEqual(parsedData._itemType, undefined);
		});

		it('returns false if neither lat or long key are present', function() {
			var parsedData = model._checkPin({ id: 1 });
			assert.deepEqual(parsedData._itemType, undefined);
		});

	});


	describe('_checkUsState', function() {

		it('returns true if state name is validated', function() {
			var parsedData = model._checkUsState({ name: 'Michigan' });
			assert.deepEqual(parsedData._itemType, 'us_state');
		});

		it('returns true with error message if state name is provided but not validated', function() {
			var parsedData = model._checkUsState({ name: 'Michiga' });
			assert.deepEqual(parsedData._itemType, undefined);
		});

		it('returns false if state name is not provided', function() {
			var parsedData = model._checkUsState({ id: 4, Lat:  56.78, Long: 83.45 });
			assert.deepEqual(parsedData._itemType, undefined);
		});

	});


	// Failing. Actual returns (this.get('image')), but not reaching second return to get and format name
	xdescribe('getImageName', function() {

		it('returns formatted image name from model object', function() {
			var im = new item.Model({ id: 2, image: { id: 111, name: 'Nice basket' }, title: 'C' });
			assert.equal(im.getImageName(), { name: 'nicebasket' });
		});

	});


	describe('toLatLongPoint', function() {
		
		it('creates single array with lat and long keys', function() {
			var im = new item.Model({ lat: 34.678, long: 167.98 });
			assert.deepEqual(im.toLatLongPoint(), [34.678, 167.98]);
		});

		it('creates array with default values if lat and long keys are null', function() {
			var im = new item.Model({ lat: null, long: null });
			assert.deepEqual(im.toLatLongPoint(), [-37.8602828, 145.0796161]);
		});

	});


	describe('toLongLatPoint', function() {

		it('creates single array with long and lat keys, reverses toLatLongPoint', function() {
			var im = new item.Model({ lat: 34.678, long: 167.98 });
			assert.deepEqual(im.toLongLatPoint(), [167.98, 34.678]);
		});

		it('creates array with default values if long and lat keys are null, reverses toLatLongPoint', function() {
			var im = new item.Model({ lat: null, long: null });
			assert.deepEqual(im.toLongLatPoint(), [145.0796161, -37.8602828]);
		});

	});


	// Failing. Can't access figure out how to access one specific key in geoJson to test.
	describe('toRichGeoJsonFeature', function() {

		it('returns geoJson object created from current model', function() {
			var im = new item.Model({ id: 2, title: 'C', lat: 34.5, long: 123.4 });
			assert.deepEqual(im.toRichGeoJsonFeature(), { _model: im, type: 'Feature', geometry: { type: 'Point', coordinates: [123.4, 34.5] } });
		});

	});


	describe('getDisplayState', function() {

		it('returns inactive if search term is not matched', function() {
			var im = new item.Model({ id: 2, name: 'Name' });
			assert.equal(im.getDisplayState({ test: function() { return true; } }, 'xs'), 'inactive');
		});

	});


	describe('matchesSearchTerm', function() {

		it('returns true if search term matches model name', function() {
			var im = new item.Model({ name: 'alabama' });
			assert.equal(im.matchesSearchTerm('ALABAMA'), true);
		});

		it('returns false if search term does not match model name', function() {
			var im = new item.Model({ name: 'alabama' });
			assert.equal(im.matchesSearchTerm('Michigan'), false);
		});

		it('returns true if search term is an empty string', function() {
			var im = new item.Model({ name: "" });
			assert.equal(im.matchesSearchTerm(""), true);
		});

	});

});


describe('item.Collection', function() {
	

	var collection = new item.Collection();


	describe('getItemType', function() {

		var modelData1 = { id: 1, title: 'C', _itemType: 'explainer' };

		it('returns _itemType of the first indexed model in the collection', function(){
			var ic = new item.Collection([ modelData1 ]);
			assert.equal(ic.getItemType(), 'explainer');
		});

	});


	describe('getValueList', function() {

		var modelData1 = { id: 1, title: 'C' },
			modelData2 = { id: 2, title: 'B' },
			modelData3 = { id: 3, title: 'A' };

		it('gets value list', function() {
			var ic = new item.Collection([ modelData1, modelData2, modelData3 ]);
			assert.deepEqual(ic.getValueList(new Backbone.Model({ id: 'title'})), [ 'C', 'B', 'A' ]);
		});

		// extra whitespaces are introduced in value_order to test trim

		it('sorts value list if a value_order array is present on the variable', function() {
			var ic = new item.Collection([ modelData1, modelData2, modelData3 ]),
				variable = new variable.Model({ id: 'title', 'value_order': 'A |B|C' });
			assert.deepEqual(ic.getValueList(variable), [ 'A', 'B', 'C' ]);
		});

		it('if a value is missing from the value order array, place it at the end', function() {
			var ic = new item.Collection([ modelData1, modelData2, modelData3 ]),
				variable = new Backbone.Model({ id: 'title', 'value_order': 'B|  C' });
			assert.deepEqual(ic.getValueList(variable), [ 'B', 'C', 'A' ]);
		});

	});


	describe('getLatLongBounds', function() {

		var modelData1 = { id: 1, title: 'C', lat: 34.56, long: 198.76 },
			modelData2 = { id: 2, title: 'B', lat: 45.67, long: 123.45 },
			modelData3 = { id: 3, title: 'A', lat: 43.21, long: 234.56 };

		it('creates array of arrays - [[min lat, min long], [max lat, max long]]', function() {
			var ic = new item.Collection([ modelData1, modelData2, modelData3 ]);
			assert.deepEqual(ic.getLatLongBounds(), [ [34.56, 123.45], [45.67, 234.56] ]);
		});

	});


	describe('toLatLongMultiPoint', function() {

		var modelData1 = { id: 1, title: 'C', lat: 34.56, long: 123.45 },
			modelData2 = { id: 2, title: 'B', lat: 45.67, long: 234.56 };

		it('creates array of arrays - [lat, long] of each model in collection', function() {
			var ic = new item.Collection([ modelData1, modelData2 ]);
			assert.deepEqual(ic.toLatLongMultiPoint(), [ [34.56, 123.45], [45.67, 234.56] ]);
		});

	});

});
