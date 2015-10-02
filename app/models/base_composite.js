// Compiled from Marionette.Accountant

import Backbone from 'backbone';
import _ from 'underscore';
import $ from 'jquery';

/*
 *
 *
 */
class Model extends Backbone.Model {

    /*
     * Find key that holds array values within model.
     *
     */
    getChildrenKey() {
        var key, ref, value;
        ref = this.attributes;
        for (key in ref) {
            value = ref[key];
            if (_.isArray(value)) {
                return key;
            }
        }
    }


    /*
     *
     *
     */
    makeComposite() {
        var ChildModel, childModel, childrenKey, results;

        childrenKey = this.getChildrenKey();

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

    }


    /*
     *
     *
     */
    getChildIndex() {
        if (this.parent) {
            return this.parent.children.indexOf(this);
        }
        return -1;
    }


    /*
     *
     *
     */
    getSiblingCount() {
        if (this.parent) {
            return this.parent.children.length;
        }
        return -1;
    }


    /*
     *
     *
     */
    getNextSibling() {
        var ci, sc;
        ci = this.getChildIndex();
        sc = this.getSiblingCount();
        if ((ci !== -1) && (sc !== -1) && (ci < sc)) {
            return this.parent.children[ci + 1];
        }
    }


    /*
     *
     *
     */
    getPreviousSibling() {
        var ci, sc;
        ci = this.getChildIndex();
        sc = this.getSiblingCount();
        if ((ci !== -1) && (sc !== -1) && (ci > 0)) {
            return this.parent.children[ci - 1];
        }
    }

}


export default {
    Model: Model
}