import 'babel-polyfill'

import assert from 'assert'
import Backbone from 'backbone'
import _ from 'underscore'
import $ from 'jquery'

import * as item from './../item/index.js'
import * as variable from './../variable.js'

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
			var ic = new item.Collection([ modelData1, modelData2, modelData3 ]),
				vari = new variable.Model({ id: 'title'});
			assert.deepEqual(ic.getValueList(vari), [ 'C', 'B', 'A' ]);
		});

		// extra whitespaces are introduced in value_order to test trim
		it('sorts value list if a value_order array is present on the variable', function() {
			var ic = new item.Collection([ modelData1, modelData2, modelData3 ]),
				vari = new variable.Model({ id: 'title', 'value_order': 'A |B|C' });
			assert.deepEqual(ic.getValueList(vari), [ 'A', 'B', 'C' ]);
		});

		it('if a value is missing from the value order array, place it at the end', function() {
			var ic = new item.Collection([ modelData1, modelData2, modelData3 ]),
				vari = new Backbone.Model({ id: 'title', 'value_order': 'B|  C' });
			assert.deepEqual(ic.getValueList(vari), [ 'B', 'C', 'A' ]);
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
