var _ = require('underscore'),
	Backbone = require('backbone'),
	base = require('./base.js'),
    formatters = require('./../utilities/formatters.js'),
	$ = require('jquery');


exports.Model = base.Model.extend({

	/*
     * Set a numerical filter, splitting up |10|20|30| type numerical divider strings into
     *   presentable and testable objects. See specs for example.
     * @param {function} formatter - Optional formatter function for values.
     */
    getNumericalFilter: function(formatter) {

        var i, len, numericalFilter, values,
            numericalDividers = this.get('numerical_filter_dividers');

        if (formatter == null) {
            formatter = formatters['number'];
        }

        values = _.map(numericalDividers.split('|'), function(member, index) {
            if (member === "") {
                if (index === 0) {
                    return -1000000000;
                }
                return +1000000000;
            }
            return parseInt(member, 10);
        });

        numericalFilter = [];

        for (i = 0, len = values.length; i < (len - 1); i += 1) {
            numericalFilter.push(
                this.getNumericalFilterValue(values[i], values[i + 1], formatter)
            );
        }

        return numericalFilter;

    },

    /*
     * Returns single numerical filter value.
     * @param {number} min - Minimum value.
     * @param {number} max - Maximum value.
     * @param {function} formatter - Formatter function.
     * @returns {object}
     */
    getNumericalFilterValue: function(min, max, formatter) {
        var filterValue, maxDisplay, minDisplay;
        filterValue = {
            min: min,
            max: max
        };
        minDisplay = min;
        maxDisplay = max;
        minDisplay = formatter(minDisplay);
        maxDisplay = formatter(maxDisplay);
        if (min === -1000000000) {
            filterValue.value = "Less than " + maxDisplay;
        } else if (max === +1000000000) {
            filterValue.value = "Greater than " + minDisplay;
        } else {
            filterValue.value = "Between " + minDisplay + " and " + maxDisplay;
        }
        return filterValue;
    }

});

exports.Collection = base.Collection.extend({

	model: exports.Model,

    getFilterVariables: function() {
        var models;
        models = this.filter(function(item) {
            return (item.get('filter_menu_order') != null);
        });
        models.sort(function(a, b) {
            return (a.get('filter_menu_order') - b.get('filter_menu_order'));
        });
        return models;
    }

});