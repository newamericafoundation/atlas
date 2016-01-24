import 'babel-polyfill'

import assert from 'assert'

import standardizeKey from './../standardize_key.js'

describe('findAndReplaceKey', function() {

	it('returns true if data key is found and replaced by standard key', function() {
		var parsedData = standardizeKey({ id: 3, name: 'Michigan', Lat: 48.976 }, 'lat', ['latitude', 'Latitude', 'lat', 'Lat']);
		assert.equal(parsedData, true);
	})

	it('returns false if data key is not found in key format list', function() {
		var parsedData = standardizeKey({ id: 3, name: 'Michigan', Long: 131.657 }, 'lat', ['latitude', 'Latitude', 'lat', 'Lat']);
		assert.equal(parsedData, false);
	})

})