var assert = require('assert'),
    Backbone = require('backbone'),
    _ = require('underscore'),
    variable = require('./../../app/models/variable.js');

describe('variable.Model', function() {

    var Model = variable.Model,
        model = new Model();

    describe('getNumericalFilter', function() {

        it('builds filter including +/- infinity values if leading and trailing delimiter marks are present', function() {
            model.set('numerical_filter_dividers', '|100|200|300|');
            assert.deepEqual(model.getNumericalFilter(), [{
                min: -1000000000,
                max: 100,
                value: 'Less than 100'
            }, {
                min: 100,
                max: 200,
                value: 'Between 100 and 200'
            }, {
                min: 200,
                max: 300,
                value: 'Between 200 and 300'
            }, {
                min: 300,
                max: +1000000000,
                value: 'Greater than 300'
            }]);
        });

        it('builds filter including - infinity values if only leading delimiter mark is present', function() {
            model.set('numerical_filter_dividers', '|100|200|300');
            assert.deepEqual(model.getNumericalFilter(), [{
                min: -1000000000,
                max: 100,
                value: 'Less than 100'
            }, {
                min: 100,
                max: 200,
                value: 'Between 100 and 200'
            }, {
                min: 200,
                max: 300,
                value: 'Between 200 and 300'
            }]);
        });

        it('builds filter including + infinity values if only trailing delimiter mark is present', function() {
            model.set('numerical_filter_dividers', '100|200|300|');
            assert.deepEqual(model.getNumericalFilter(), [{
                min: 100,
                max: 200,
                value: 'Between 100 and 200'
            }, {
                min: 200,
                max: 300,
                value: 'Between 200 and 300'
            }, {
                min: 300,
                max: +1000000000,
                value: 'Greater than 300'
            }]);
        });

    });
});