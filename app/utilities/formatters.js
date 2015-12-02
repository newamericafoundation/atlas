import numeral from 'numeral'
import marked from 'marked'
import _ from 'underscore'
import $ from 'jquery'

var formatters = {

	/*
	 * Main entry point to the module.
	 *
	 */
	format: function(v, formatKey) {
		if (!formatKey) { return v }
		var formatter = formatters[formatKey.toLowerCase()]
		if (!formatter) { return v }
		return formatter(v)
	},


	/*
	 *
	 *
	 */
	currency: function(v) {
	    var formatter;
	    formatter = v > 999 ? '($0a)' : '($0)';
	    return numeral(v).format(formatter);
	},


	/*
	 *
	 *
	 */
	number: function(v) {
	    var formatter;
	    if (v === parseInt(v, 10)) {
	    	formatter = v > 99999 ? '0a' : '0'
	    } else {
		    formatter = v > 99999 ? '0.0a' : '0.0'
		}
	    return numeral(v).format(formatter);
	},


	/*
	 *
	 *
	 */
	percent: function(v) {
	    return formatters.number(v * 100) + '%';
	},

	// Alias
	percentage: function(v) { return formatters['percent'](v) },


	/*
	 *
	 *
	 */
	 'percent-100': function(v) {
	 	return formatters.number(v) + '%'
	 },

	 // Alias
	 'percentage-100': function(v) { return formatters['percent-100'](v) },


	 /*
	 *
	 *
	 */
	 'percent-1': function(v) {
	 	return formatters.number(v * 100) + '%'
	 },

	 // Alias
	 'percentage-1': function(v) { return formatters['percent-1'](v) },


	/*
	 *
	 *
	 */
	html: function(html) {
	    var $html, newHtml;
	    $html = $(html);
	    $html.find('a').attr('target', '_blank');
	    newHtml = $('<div></div>').append($html.clone()).html();
	    return newHtml;
	},


	/*
	 *
	 *
	 */
	removeLineBreaks: function(string) {
		if (string == null) { return '' }
	    string = String(string)
	    return string.replace(/(\r\n|\n|\r)/gm, '');
	},


	/*
	 *
	 *
	 */
	removeSpaces: function(string) {
		if (string == null) { return '' }
	    string = String(string);
	    return string.replace(/\s+/g, '')
	},


	/*
	 * This method tailors to a single specific hyphenation need. Customize later if necessary.
	 *
	 */
	hyphenate: function(string) {
	    string = String(string);
	    string = String(string);
	    return string.replace('ommunication', 'ommuni-cation');
	},


	/*
	 * 
	 *
	 */
	markdown: function(md) {
		if (!md) { return }
		md = String(md)
		return marked(md, { sanitize: true })
	}

}

export default formatters