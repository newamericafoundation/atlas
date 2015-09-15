var base = require('./base.js'),
    formatters = require('./../utilities/formatters.js'),
    baseComposite = require('./base_composite.js');

var LocalBaseModel = baseComposite.Model.extend({

    isActive: function() {
        return this.get('_isActive');
    },

    activate: function() {
        this.set('_isActive', true);
        return this;
    },

    deactivate: function() {
        this.set('_isActive', false);
        return this;
    },

    toggle: function() {
        this.set('_isActive', !this.isActive());
        return this;
    },

    activateAllChildren: function() {
        this.children.forEach(function(child) {
            child.activate();
        });
        return this;
    },

    deactivateAllChildren: function() {
        this.children.forEach(function(child) {
            child.deactivate();
        });
        return this;
    },

    toggleAllChildren: function() {
        this.children.forEach(function(child) {
            child.toggle();
        });
        return this;
    },

    /*
     * Deactivate all siblings, not including self.
     *
     */
    deactivateSiblings: function() {
        var self = this,
            siblingsIncludingSelf;
        if (this.parent == null) { return; }
        siblingsIncludingSelf = this.parent.children;
        siblingsIncludingSelf.forEach(function(sibling) {
            if (sibling !== self) {
                sibling.deactivate();
            }
        });
    },

    /*
     * Get sibling index.
     *
     */
    getSiblingIndex: function() {
        var siblingsIncludingSelf = this.parent.children;
        return siblingsIncludingSelf.indexOf(this);
    },

    /* 
     * If every sibling in order got integer indeces between 1 and n, interpolate for instance.
     * @param {number} n - Top friendly integer.
     * @returns {number}
     */
    getFriendlySiblingIndex: function(n) {
        var i = this.getSiblingIndex(),
            max = this.getSiblingCountIncludingSelf();
        return Math.round(i * (n - 1) / (max - 1) + 1);
    },

    getSiblingCountIncludingSelf: function() {
        return this.parent.children.length;
    }

});


// Copied from client.

exports.FilterValue = LocalBaseModel.extend({

    test: function(d, options) {
        var j, key, len, res, val, value;
        if (d == null) {
            return false;
        }
        if ((!this.get('_isActive')) && (!((options != null) && options.ignoreState))) {
            return false;
        }
        res = false;
        key = this.parent.get('variable').get('id');
        value = d[key];
        if (!_.isArray(value)) {
            value = [value];
        }
        for (j = 0, len = value.length; j < len; j++) {
            val = value[j];
            res = res || this.testValue(val);
        }
        return res;
    },

    testValue: function(value) {
        var res;
        res = false;
        if (this._isNumericFilter()) {
            if ((value < this.get('max')) && (value >= this.get('min'))) {
                res = true;
            }
        } else {
            if (value === this.get('value')) {
                res = true;
            }
        }
        return res;
    },

    _isNumericFilter: function() {
        return (this.get('min') != null) && (this.get('max') != null);
    },

    isParentActive: function() {
        return this.parent === this.parent.parent.getActiveChild();
    },

    handleClick: function() {
        var activeKeyIndex, keyIndex;
        this.toggle();
        keyIndex = this.parent.get('_index');
        return activeKeyIndex = this.parent.parent.get('activeIndex');
    }

});


exports.FilterKey = LocalBaseModel.extend({

    childModel: exports.FilterValue,

    /*
     * Toggle item as it were 'clicked on'. 
     * If the value is being activated, all its siblings need to be deactivated.
     *
     */
    clickToggle: function() {
        if (this.isActive()) {
            return;
        } else {
            this.deactivateSiblings();
            this.activate();
        }
    },

    /*
     * When deactivating, activate all children back.
     *
     */
    deactivate: function() {
        this.set('_isActive', false);
        this.children.forEach(function(childModel) {
            childModel.activate();
        });
        return this;
    },

    toggleOne: function(childIndex) {
        return this.children[childIndex].toggle();
    },

    getValueIndeces: function(model) {
        var child, data, dataIndeces, i, j, len, ref;
        data = (model != null) && _.isFunction(model.toJSON) ? model.toJSON() : model;
        dataIndeces = [];
        ref = this.children;
        for (i = j = 0, len = ref.length; j < len; i = ++j) {
            child = ref[i];
            if (child.test(data)) {
                dataIndeces.push(i);
            }
        }
        return dataIndeces;
    },

    getValue: function(index) {
        return this.children[index].get('value');
    },

    test: function(data, options) {
        var child, j, len, ref, result;
        result = false;
        ref = this.children;
        for (j = 0, len = ref.length; j < len; j++) {
            child = ref[j];
            if (child.test(data, options)) {
                result = true;
            }
        }
        return result;
    }

});


exports.FilterTree = LocalBaseModel.extend({

    childModel: exports.FilterKey,

    test: function(data) {
        return this.getActiveChild().test(data);
    },

    /*
     * Returns an array of children around the active child. Used to display a short list of filter keys.
     * E.g. if the active child is the third and countOnEitherSide = 1, return [ second, third, fourth ]
     */
    getActiveChildNeighborhood: function(countOnEitherSide) {
        var keys = this.children,
            activeKey = this.getActiveChild(),
            keysLength = keys.length,
            activeKeyIndex = keys.indexOf(activeKey),
            neighborhoodLength = (2 * countOnEitherSide + 1);

        if (neighborhoodLength > keysLength) { return keys; }

        if ((activeKeyIndex - countOnEitherSide) < 0) { return keys.slice(0, neighborhoodLength); } 
        if ((activeKeyIndex + countOnEitherSide > keysLength - 1)) { return keys.slice(keysLength - neighborhoodLength); }
        return keys.slice(activeKeyIndex - countOnEitherSide, activeKeyIndex + countOnEitherSide + 1);
    },

    /*
     * Return active child.
     *
     */
    getActiveChild: function() {
        var child, j, len, ref;
        ref = this.children;
        for (j = 0, len = ref.length; j < len; j++) {
            child = ref[j];
            if (child.isActive()) {
                return child;
            }
        }
    },

    /*
     * Get 
     *
     */
    getMatchingValue: function(model) {
        var ind;
        ind = this.getValueIndeces(model)[0];
        if (this.getActiveChild().children[ind] == null) { return; }
        return this.getActiveChild().children[ind].get('value');
    },

    /*
     *
     *
     */
    getValueCountOnActiveKey: function() {
        var activeChild = this.getActiveChild();
        if (!activeChild) { return 0; }
        return activeChild.children.length;
    },

    getValueIndeces: function(model) {
        var ach;
        ach = this.getActiveChild();
        if (!ach) { return []; }
        return ach.getValueIndeces(model);
    },

    /*
     * Get 'friendly', integer-formatted key and value indeces, used for coloring.
     *
     */
    getFriendlyIndeces: function(model, scaleMax) {
        var maxIndex, valueIndeces;
        valueIndeces = this.getValueIndeces(model);
        maxIndex = this.getValueCountOnActiveKey();
        return valueIndeces.map(function(valIndex) {
            var friendlyIndex;
            friendlyIndex = Math.round(valIndex * (scaleMax - 1) / (maxIndex - 1) + 1);
            return friendlyIndex;
        });
    }

});