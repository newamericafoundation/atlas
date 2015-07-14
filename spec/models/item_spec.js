var assert = require('assert'),
	_ = require('underscore'),
	Backbone = require('backbone'),
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

		it('returns true with no errors if both lat and long keys exist', function() {
			var parsedData = model._checkPindrop({ id: 1, Latitude: 145.678, Longitude: 36.879 });
			assert.deepEqual(parsedData, { recognized: true, errors: [] });
		});

		it('returns true with error message if either lat or long key exist', function() {
			var parsedData = model._checkPindrop({ id: 1, Lat: 145.678 });
			assert.deepEqual(parsedData, { recognized: true, errors: ['Latitude or longitude not found.'] });
		});

		it('returns false if neither lat or long key exist', function() {
			var parsedData = model._checkPindrop({ id: 1 });
			assert.deepEqual(parsedData, { recognized: false });
		});

	});


	describe('_checkState', function() {

		it('returns true if state name is validated', function() {
			var parsedData = model._checkState({ name: 'Michigan' });
			assert.deepEqual(parsedData, { recognized: true, errors: [] });
		});

		it('returns true with error message if state name is provided but not validated', function() {
			var parsedData = model._checkState({ name: 'Michiga' });
			assert.deepEqual(parsedData, { recognized: true, errors: ['Michiga not recognized as a state. Possibly a typo.'] });
		});

		it('returns false if state name is not provided', function() {
			var parsedData = model._checkState({ id: 4, Lat:  56.78, Long: 83.45 });
			assert.deepEqual(parsedData, { recognized: false });
		});

	});


	// failing -- how to structure model and access image and name?
	describe('getImageName', function() {

		xit('finds and formats image name', function() {
			var im = new item.Model({ image: { name: 'Nice basket' } });
			assert.equal(im.getImageName(), 'nicebasket');
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


	describe('toRichGeoJsonFeature', function() {

		//Failing. What does geoJson object look like? 
		xit('creates geoJson object from current model and assigns Feature type', function() {
			var im = new item.Model({ id: 2 });
			im.toRichGeoJsonFeature();
			assert.equal(im.get('type'), 'Feature');
		});

	});


	xdescribe('getLayerClasses', function() {

		//specs here.

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

		it('returns false if model name is an empty string', function() {
			var im = new item.Model({ name: "" });
			assert.equal(im.matchesSearchTerm(""), false);
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

		it('creates array of values for specified key in collection of models', function() {
			var ic = new item.Collection([ modelData1, modelData2, modelData3 ]);
			assert.deepEqual(ic.getValueList('title'), [ 'C', 'B', 'A' ]);
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
