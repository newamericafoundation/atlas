// Compiled from Marionette.Accountant

var Backbone = require('backbone'),
    _ = require('underscore'),
    $ = require('jquery');

exports.Model = Backbone.Model.extend({

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

    makeComposite: function() {
        var ChildModel, childModel, childrenKey, results;

        childrenKey = this._getChildrenKey();

        this.children = this.children || [];

        ChildModel = _.isFunction(this.model) ? this.model : Backbone.Model;

        if (childrenKey) {
            this.set('_childrenKey', childrenKey);
            let children = this.get(childrenKey);
            this.unset(childrenKey);
            results = [];
            children.forEach((child) => {
                var childModel = new ChildModel(child);
                childModel.parent = this;
                // Call makeComposite recursively.
                if (childModel.makeComposite) { childModel.makeComposite(); }
                this.children.push(childModel);
            });
        }

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