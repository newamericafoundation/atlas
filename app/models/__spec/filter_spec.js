import 'babel-polyfill'

import assert from 'assert'
import Backbone from 'backbone'
import _ from 'underscore'
import $ from 'jquery'

import * as filter from './../filter.js'
import * as variableGroup from './../variable_group.js'

describe('filter tree', function() {

    var obj, filterTree;

    var { FilterTree } = filter

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

        filterTree = new FilterTree(obj);
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

    // TODO: fix specs
    xdescribe('group', function() {

        var filterTree = new FilterTree({
            variables: [
                {
                    id: 'var_1',
                    variable_group_id: 'grp_1'
                },
                {
                    id: 'var_2',
                    variable_group_id: 'grp_2'
                },
                {
                    id: 'var_3',
                    variable_group_id: 'grp_1'
                }
            ]}),
            varGrpCollection = new variableGroup.Collection([
                {
                    id: 'grp_1'
                },
                {
                    id: 'grp_2'
                }
            ]);

        it('groups with a specified variable group collection', function() {

            var varCollection = filterTree.get('variables')

            assert.deepEqual(filterTree.group(varGrpCollection), [
                {
                    variable_group: varGrpCollection[0],
                    variables: [ varCollection[0], varCollection[2] ]
                },
                {
                    variable_group: varGrpCollection[1],
                    variables: [ varCollection[1] ]
                }
            ]);

        });

        it('groups without a specified variable group collection', function() {

            var varCollection = filterTree.get('variables')

            assert.deepEqual(filterTree.group(), [
                {
                    variable_group: 'grp_1',
                    variables: [ varCollection[0], varCollection[2] ]
                },
                {
                    variable_group: 'grp_2',
                    variables: [ varCollection[1] ]
                }
            ]);

        });
        

    });

});