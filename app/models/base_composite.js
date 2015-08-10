// Compiled from Marionette.Accountant

var Backbone = require('backbone'),
    _ = require('underscore'),
    $ = require('jquery');

exports.Model = Backbone.Model.extend({

    constructor: function() {
        Backbone.Model.apply(this, arguments);
        this.children = [];
        this.doAccounting();
    },

    /*
     * Find key that holds array values within model.
     *
     */
    _getChildrenKey: function() {
        var key, ref, value;
        ref = this.attributes;
        for (key in ref) {
            value = ref[key];
            if (_.isArray(value)) {
                return key;
            }
        }
    },

    doAccounting: function() {
        var ChildModelConstructor, child, childModel, children, childrenKey, i, j, len, max, results;
        childrenKey = this._getChildrenKey();
        ChildModelConstructor = _.isFunction(this.childModel) ? this.childModel : Backbone.Model;
        if (childrenKey) {
            this.set('_childrenKey', childrenKey);
            children = this.get(childrenKey);
            this.unset(childrenKey);
            max = children.length;
            results = [];
            for (i = j = 0, len = children.length; j < len; i = ++j) {
                child = children[i];
                childModel = new ChildModelConstructor(child);
                childModel.parent = this;
                childModel.set('_index', i);
                results.push(this.children.push(childModel));
            }
            return results;
        }
    },

    /*
     * Separate 
     */
    createModelTree: function() {
        var self = this,
            ChildModelConstructor, 
            childModel, 
            children, 
            childrenKey;
        childrenKey = this._getChildrenKey();
        ChildModelConstructor = _.isFunction(this.childModel) ? this.childModel : Backbone.Model;
        if (childrenKey) {
            this.set('_childrenKey', childrenKey);
            children = this.get(childrenKey);
            this.unset(childrenKey);
            children.forEach(function(child, i) {
                var childModel = new ChildModelConstructor(child);
                childModel.parent = self;
                childModel.set('_index', i);
                self.children.push(childModel);
            });
        }
    },

    toJSON: function() {
        return Backbone.Model.prototype.toJSON.apply(this);
    },

    toNestedJSON: function() {
        var child, childrenKey, j, json, len, nestedJson, ref;
        json = this.toJSON();
        if (typeof json['_index'] !== 'undefined') {
            delete json['_index'];
        }
        if (this.children) {
            childrenKey = this.get('_childrenKey');
            json[childrenKey] = [];
            ref = this.children;
            for (j = 0, len = ref.length; j < len; j++) {
                child = ref[j];
                nestedJson = child.toNestedJSON != null ? child.toNestedJSON() : child.toJSON();
                delete nestedJson['_index'];
                json[childrenKey].push(nestedJson);
            }
            delete json['_childrenKey'];
        }
        return json;
    },

    getChildIndex: function() {
        if (this.parent) {
            return this.parent.children.indexOf(this);
        }
        return -1;
    },

    getSiblingCount: function() {
        if (this.parent) {
            return this.parent.children.length;
        }
        return -1;
    },

    getNextSibling: function() {
        var ci, sc;
        ci = this.getChildIndex();
        sc = this.getSiblingCount();
        if ((ci !== -1) && (sc !== -1) && (ci < sc)) {
            return this.parent.children[ci + 1];
        }
    },

    getPreviousSibling: function() {
        var ci, sc;
        ci = this.getChildIndex();
        sc = this.getSiblingCount();
        if ((ci !== -1) && (sc !== -1) && (ci > 0)) {
            return this.parent.children[ci - 1];
        }
    }

});

