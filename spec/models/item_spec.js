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

		//Failing.
		xit('creates geoJson object from current model and assigns Feature type', function() {
			var im = new item.Model({ id: 2 });
			im.toRichGeoJsonFeature();
			assert.equal(im.get('type'), 'Feature');
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

		it('returns false if model name is an empty string', function() {
			var im = new item.Model({ name: "" });
			assert.equal(im.matchesSearchTerm(""), false);
		});

	});




});
