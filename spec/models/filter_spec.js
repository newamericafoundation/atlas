var assert = require('assert'),
    Backbone = require('backbone'),
    _ = require('underscore'),
    filter = require('./../../app/models/filter.js');

describe('filter tree', function() {

    var obj, filterTree;

    beforeEach(function() {

        obj = {
            variables: [{
                variable: new Backbone.Model({ id: 'origin' }),
                _isActive: true,
                options: [{
                    value: 'ethiopia',
                    _isActive: true
                }, {
                    value: 'indonesia',
                    _isActive: true
                }, {
                    value: 'nicaragua',
                    _isActive: true
                }]
            }, {
                variable: new Backbone.Model({ id: 'roast' }),
                _isActive: false,
                options: [{
                    value: 'dark',
                    _isActive: true
                }, {
                    value: 'light',
                    _isActive: true
                }]
            }]
        };

        filterTree = new filter.FilterTree(obj);
        filterTree.makeComposite();

    });

    describe('constructor', function() {

        it('builds nested structure', function() {
            assert.equal(filterTree.children[0].get('variable').get('id'), 'origin');
        });

        it('builds double nested structure', function() {
            assert.equal(filterTree.children[1].children[1].get('value'), 'light');
        });

    });

    describe('test grandchildren', function() {

        it('deactivates model', function() {
            var grandchild;
            grandchild = filterTree.children[0].children[0];
            assert.equal(grandchild.test({ 'origin': 'ethiopia' }), true);
            grandchild.deactivate();
            assert.equal(grandchild.test({ 'origin': 'ethiopia' }), false);
        });

    });

    describe('test children', function() {

        it('tests data that has tested data key', function() {
            var child;
            child = filterTree.children[0];
            assert.equal(child.test({ 'origin': 'ethiopia' }), true);
        });

        it('tests data that does not have tested data key', function() {
            var child;
            child = filterTree.children[0];
            assert.equal(child.test({ 'roast': 'light' }), false);
        });

    });

    describe('test main', function() {

        it('tests data that has tested data key', function() {
            assert.equal(filterTree.test({ 'origin': 'ethiopia' }), true);
        });

        it('tests data that does not have tested data key', function() {
            assert.equal(filterTree.test({ 'roast': 'light' }),false);
        });

    });

});