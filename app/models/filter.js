import _ from 'underscore'

import * as base from './base.js'
import formatters from './../utilities/formatters.js'
import * as baseComposite from './base_composite.js'

/*
 *
 *
 */
class LocalBaseModel extends baseComposite.Model {

    isActive() { return this.get('_isActive') }

    activate() { return this.set('_isActive', true) }

    deactivate() { return this.set('_isActive', false) }

    toggle() { return this.set('_isActive', !this.isActive()) }

    activateAllChildren() {
        this.children.forEach((child) => { child.activate() })
        return this
    }

    deactivateAllChildren() {
        this.children.forEach((child) => { child.deactivate() })
        return this
    }

    toggleAllChildren() {
        this.children.forEach((child) => { child.toggle() })
        return this
    }


    /*
     * Deactivate all siblings, not including self.
     *
     */
    deactivateSiblings() {
        if (!this.parent) { return }
        var siblingsIncludingSelf = this.parent.children
        siblingsIncludingSelf.forEach((sibling) => {
            if (sibling !== this) { sibling.deactivate() }
        })
    }


    /*
     * Get sibling index.
     *
     */
    getSiblingIndex() {
        var siblingsIncludingSelf = this.parent.children
        return siblingsIncludingSelf.indexOf(this)
    }


    /* 
     * If every sibling in order got integer indeces between 1 and n, interpolate for instance.
     * @param {number} n - Top friendly integer.
     * @returns {number}
     */
    getFriendlySiblingIndex(n) {
        var i = this.getSiblingIndex()
        var max = this.getSiblingCountIncludingSelf()
        if (max === 1) { return 1 }
        return Math.round(i * (n - 1) / (max - 1) + 1)
    }


    /*
     *
     *
     */
    getSiblingCountIncludingSelf() {
        return this.parent.children.length
    }

}



/*
 *
 *
 */
export class FilterValue extends LocalBaseModel {

    /*
     *
     *
     */
    test(d, options) {
        if (d == null) { return false; }
        if ((!this.get('_isActive')) && (!((options != null) && options.ignoreState))) {
            return false
        }
        var result = false
        var key = this.parent.get('variable').get('id')
        var value = d[key]
        var values = _.isArray(value) ? value : [ value ]
        for (let singleValue of values) {
            result = result || this.testValue(singleValue)
        }
        return result
    }


    /*
     *
     *
     */
    testValue(value) {
        var res = false
        if (this._isNumericFilter()) {
            if ((value < this.get('max')) && (value >= this.get('min'))) {
                res = true
            }
        } else {
            if (value === this.get('value')) {
                res = true
            }
        }
        return res
    }


    /*
     *
     *
     */
    _isNumericFilter() {
        return (this.get('min') != null) && (this.get('max') != null)
    }


    /*
     *
     *
     */
    isParentActive() {
        return this.parent === this.parent.parent.getActiveChild()
    }


    /*
     *
     *
     */
    handleClick() {
        var activeKeyIndex, keyIndex
        this.toggle()
        keyIndex = this.parent.get('_index')
        return activeKeyIndex = this.parent.parent.get('activeIndex')
    }

}



/*
 *
 *
 */
export class FilterKey extends LocalBaseModel {

    get model() { return FilterValue }

    /*
     * Toggle item as it were 'clicked on'. 
     * If the value is being activated, all its siblings need to be deactivated.
     *
     */
    clickToggle() {
        if (this.isActive()) {
            return;
        } else {
            this.deactivateSiblings()
            this.activate()
        }
    }


    /*
     * When deactivating, activate all children back.
     *
     */
    deactivate() {
        this.set('_isActive', false)
        this.children.forEach(function(childModel) {
            childModel.activate()
        })
        return this
    }


    /*
     *
     *
     */
    getValueIndeces(model) {
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
    }


    /*
     *
     *
     */
    getValue(index) {
        return this.children[index].get('value')
    }


    /*
     *
     *
     */
    test(data, options) {
        var child, result
        result = false
        for (let child of this.children) {
            if (child.test(data, options)) { result = true }
        }
        return result
    }

}



/*
 *
 *
 */
export class FilterTree extends LocalBaseModel {

    /*
     *
     *
     */
    get model() { return FilterKey }


    /*
     *
     *
     */
    test(data) {
        return this.getActiveChild().test(data)
    }


    /*
     * Returns an array of children around the active child. Used to display a short list of filter keys.
     * E.g. if the active child is the third and countOnEitherSide = 1, return [ second, third, fourth ]
     */
    getActiveChildNeighborhood(countOnEitherSide) {
        var keys = this.children
        var activeKey = this.getActiveChild()
        var keysLength = keys.length
        var activeKeyIndex = keys.indexOf(activeKey)
        var neighborhoodLength = (2 * countOnEitherSide + 1)

        if (neighborhoodLength > keysLength) { return keys }

        if ((activeKeyIndex - countOnEitherSide) < 0) { return keys.slice(0, neighborhoodLength); } 
        if ((activeKeyIndex + countOnEitherSide > keysLength - 1)) { return keys.slice(keysLength - neighborhoodLength); }
        return keys.slice(activeKeyIndex - countOnEitherSide, activeKeyIndex + countOnEitherSide + 1);
    }


    /*
     * Return active child.
     *
     */
    getActiveChild() {
        var child, j, len, ref;
        ref = this.children;
        for (j = 0, len = ref.length; j < len; j++) {
            child = ref[j];
            if (child.isActive()) {
                return child;
            }
        }
    }


    /*
     * Get 
     *
     */
    getMatchingValue(model) {
        var index = this.getValueIndeces(model)[0]
        if (this.getActiveChild().children[index] == null) { return }
        return this.getActiveChild().children[index].get('value')
    }


    /*
     *
     *
     */
    getValueCountOnActiveKey() {
        var activeChild = this.getActiveChild()
        if (!activeChild) { return 0 }
        return activeChild.children.length
    }


    /*
     *
     *
     */
    getValueIndeces(model) {
        var activeChild = this.getActiveChild()
        if (!activeChild) { return [] }
        return activeChild.getValueIndeces(model)
    }

    /*
     * Get 'friendly', integer-formatted key and value indeces, used for coloring.
     *
     */
    getFriendlyIndeces(model, scaleMax) {
        var maxIndex, valueIndeces;
        valueIndeces = this.getValueIndeces(model);
        maxIndex = this.getValueCountOnActiveKey();
        if (maxIndex === 1) { return [ 1 ]; }
        return valueIndeces.map(function(valIndex) {
            return Math.round(valIndex * (scaleMax - 1) / (maxIndex - 1) + 1);
        });
    }


    /*
     * Group filter keys by variable group model instances or group name strings.
     * Supports old group_name syntax.
     */
     group(variableGroupCollection) {

        var grpObj = _.groupBy(this.children, (child) => {
            var variable = child.get('variable')
            return variable.get('variable_group_id') || variable.get('group_name')
        });

        var groupArray = Object.keys(grpObj).map((groupId) => {

            var variable_group

            // If the group is found, return group instance. Otherwise, return groupId as string.
            if (variableGroupCollection) {
                variable_group = variableGroupCollection.findWhere({ id: groupId })
            }

            variable_group = variable_group || groupId

            return {
                variable_group: variable_group,
                filterKeys: grpObj[groupId]
            }

        })

        groupArray.sort(function(v1, v2) {

            const GROUP_KEY = 'variable_group'
            const GROUP_ORDER_KEY = 'variable_group_order'

            var vg1 = v1[GROUP_KEY]
            var vg2 = v2[GROUP_KEY]
            
            if (vg1 == null) { return 1 }
            if (vg2 == null) { return -1 }
            if (vg1.get == null) { return 1 }
            if (vg2.get == null) { return -1 }

            return + vg1.get(GROUP_ORDER_KEY) - vg2.get(GROUP_ORDER_KEY)

        })

        return groupArray

     }

}