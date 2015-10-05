import _ from 'underscore';
import Backbone from 'backbone';

import base from './base.js';
import formatters from './../utilities/formatters.js';


class Model extends base.Model {

    /*
     * Parse spreadsheet data, lowercasing and underscore-joining all fields.
     *
     */
    parse(resp) {
        for(let key in resp) {
            let value = resp[key];
            let newKey = key.toLowerCase().replace(/ /g, '_');
            if (['variable group name', 'group name'].indexOf(key.toLowerCase()) > -1) { newKey = 'id'; }
            if (key !== newKey) {
                resp[newKey] = value;
                delete resp[key];
            }
        }
        return resp;
    }

}



/*
 *
 *
 */
class Collection extends base.Collection {

    get model() { return Model; }

}



export default {
    Model: Model,
    Collection: Collection
}