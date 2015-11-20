import _ from 'underscore'
import Backbone from 'backbone'

import * as base from './base.js'
import formatters from './../utilities/formatters.js'

const BIG_NUMBER = 100000000000

export class Model extends base.Model {

    /*
     * Parse spreadsheet data, lowercasing and underscore-joining all fields.
     *
     */
    parse(resp) {
        for(let key in resp) {
            let value = resp[key];
            let newKey = key.toLowerCase().replace(/ /g, '_');
            if (['variable name', 'name'].indexOf(key.toLowerCase()) > -1) { newKey = 'id'; }
            if (['variable group name', 'group name', 'group'].indexOf(key.toLowerCase()) > -1) { newKey = 'variable_group_id'; }
            if (key !== newKey) {
                resp[newKey] = value;
                delete resp[key];
            }
        }
        return resp;
    }


    /*
     * If the variable is a filter variable, extract its properties.
     *
     */
    extractFilter() {
        if (this.get('filter_menu_order') == null) { return undefined; }
        return {
            'variable_id': this.get('id'),
            'type': this.get('filter_type'),
            'menu_order': this.get('filter_menu_order'),
            'numerical_dividers': this.get('numerical_filter_dividers')
        };
    }


    /*
     * Return the field of an item corresponding to the variable, applying 
     * formatting as needed.
     * @param {object} item
     * @returns {string} formattedField
     */
    getFormattedField(item, defaultFormat) {
        var rawField = item.get(this.get('id')),
            format = this.get('format') || defaultFormat;
        if (_.isArray(rawField)) {
            return rawField.map((item) => { return formatters.format(item, format); }).join(', ');
        }
        return formatters.format(rawField, format);
    }


	/*
     * Set a numerical filter, splitting up |10|20|30| type numerical divider strings into
     *   presentable and testable objects. See specs for example.
     * @param {function} formatter - Optional formatter function for values.
     */
    getNumericalFilter(formatter) {

        var filterFloat = function (value) {
            if(/^(\-|\+)?([0-9]*(\.[0-9]+)?|Infinity)$/
              .test(value))
              return Number(value);
          return NaN;
        }

        var i, len, numericalFilter, values,
            numericalDividers = this.get('numerical_filter_dividers'),
            numericalAliases = this.get('numerical_filter_aliases');

        numericalAliases = numericalAliases ? numericalAliases.split('|') : [];

        if (formatter == null) {
            formatter = formatters['number'];
        }

        values = _.map(numericalDividers.split('|'), function(member, index) {
            member = member.trim();
            if (member === "") {
                if (index === 0) {
                    return -BIG_NUMBER;
                }
                return +BIG_NUMBER;
            }
            return filterFloat(member);
        });

        numericalFilter = [];

        for (i = 0, len = values.length; i < (len - 1); i += 1) {
            numericalFilter.push(
                this.getNumericalFilterValue(values[i], values[i + 1], formatter, numericalAliases[i])
            );
        }

        return numericalFilter;

    }


    /*
     * Returns single numerical filter value.
     * @param {number} min - Minimum value.
     * @param {number} max - Maximum value.
     * @param {function} formatter - Formatter function.
     * @returns {object}
     */
    getNumericalFilterValue(min, max, formatter, value) {
        var filterValue, maxDisplay, minDisplay;

        filterValue = { min: min, max: max };

        minDisplay = min;
        maxDisplay = max;
        minDisplay = formatter(minDisplay);
        maxDisplay = formatter(maxDisplay);

        if (value) {
            filterValue.value = value;
            return filterValue;
        }

        if (min === - BIG_NUMBER) {
            filterValue.value = "Less than " + maxDisplay;
        } else if (max === + BIG_NUMBER) {
            filterValue.value = "Greater than " + minDisplay;
        } else {
            filterValue.value = "Between " + minDisplay + " and " + maxDisplay;
        }

        return filterValue;
    }

}



/*
 *
 *
 */
export class Collection extends base.Collection {

	get model() { return Model; }


    /*
     *
     *
     */
    getInfoBoxVariableCount() {

        var count = 0;

        this.models.forEach((model) => {
            if (model.get('infobox_order')) {
                count += 1;
            }
        });

        return count;

    }


    /*
     *
     *
     */
    extractFilters() {

        var filters = [];

        this.models.forEach((model) => {
            var filter = model.extractFilter();
            if (filter) { filters.push(filter); }
        });

        return filters.sort((f1, f2) => { return (f1['filter_menu_order'] - f2['filter_menu_order']) });

    }


    /*
     *
     *
     */
    getFilterVariables() {
        var models;
        models = this.filter(function(item) {
            return (item.get('filter_menu_order') != null);
        });
        models.sort(function(a, b) {
            return (a.get('filter_menu_order') - b.get('filter_menu_order'));
        });
        return models;
    }

}