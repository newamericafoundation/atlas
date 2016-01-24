import 'babel-polyfill'

import { checkPin, checkUsState } from './../type_checker.js'

import assert from 'assert'


describe('checkPin', function() {

    it('returns true with no errors if both lat and long keys exist', function() {
        var parsedData = checkPin({
            id: 1,
            Latitude: 145.678,
            Longitude: 36.879
        });
        assert.deepEqual(parsedData._itemType, 'pin');
    })

    it('returns false if either lat or long key are not present', function() {
        var parsedData = checkPin({
            id: 1,
            Lat: 145.678
        });
        assert.deepEqual(parsedData._itemType, undefined);
    })

    it('returns false if neither lat or long key are present', function() {
        var parsedData = checkPin({
            id: 1
        });
        assert.deepEqual(parsedData._itemType, undefined);
    })

})


describe('checkUsState', function() {

    it('returns true if state name is validated', function() {
        var parsedData = checkUsState({
            name: 'Michigan'
        });
        assert.deepEqual(parsedData._itemType, 'us_state');
    })

    it('returns true with error message if state name is provided but not validated', function() {
        var parsedData = checkUsState({
            name: 'Michiga'
        });
        assert.deepEqual(parsedData._itemType, undefined);
    })

    it('returns false if state name is not provided', function() {
        var parsedData = checkUsState({
            id: 4,
            Lat: 56.78,
            Long: 83.45
        });
        assert.deepEqual(parsedData._itemType, undefined);
    })

})