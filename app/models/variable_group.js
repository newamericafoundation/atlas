import * as base from './base.js'
import formatters from './../utilities/formatters.js'


export class Model extends base.Model {

    /*
     * Parse spreadsheet data, lowercasing and underscore-joining all fields.
     *
     */
    parse(resp) {
        for(let key in resp) {
            let value = resp[key]
            let newKey = key.toLowerCase().replace(/ /g, '_')
            if (['variable group name', 'group name', 'name'].indexOf(key.toLowerCase()) > -1) { newKey = 'id' }
            if (key !== newKey) {
                resp[newKey] = value
                delete resp[key]
            }
        }
        return resp
    }

}



/*
 *
 *
 */
export class Collection extends base.Collection {

    get model() { return Model }

    /*
     *
     *
     */
    comparator(model1, model2) {
        const KEY = 'variable_group_order'
        return - (model1.get(KEY) - model2.get(KEY))
    }

}