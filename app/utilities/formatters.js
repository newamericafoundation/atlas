var numeral = require('numeral'),
	marked = require('marked'),
	$ = require('jquery');

var formatters = {

	/*
	 *
	 *
	 */
	currency: function(v) {
	    var formatter;
	    if (!numeral) { return v; }
	    formatter = v > 999 ? '($0a)' : '($0)';
	    return numeral(v).format(formatter);
	},


	/*
	 *
	 *
	 */
	number: function(v) {
	    var formatter;
	    if (!numeral) { return v; }
	    if (v === parseInt(v, 10)) {
	    	formatter = v > 99999 ? '0a' : '0';
	    } else {
		    formatter = v > 99999 ? '0.0a' : '0.0';
		}
	    return numeral(v).format(formatter);
	},


	/*
	 *
	 *
	 */
	percent: function(v) {
	    return formatters.number(v) + '%';
	},


	/*
	 *
	 *
	 */
	percentage: function(v) {
		return formatters.percent(v);
	},


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
	    string = String(string);
	    return string.replace(/(\r\n|\n|\r)/gm, '');
	},


	/*
	 *
	 *
	 */
	removeSpaces: function(string) {
	    string = String(string);
	    return string.replace(/\s+/g, '');
	},


	/*
	 * This method tailors to a single specific hyphenation need. Customize later if necessary.
	 *
	 */
	hyphenate: function(string) {
	    string = String(string);
	    return string.replace('ommunication', 'ommuni-cation');
	},


	/*
	 * 
	 *
	 */
	htmlWithToc: function(html) {
		
	},


	/*
	 * 
	 *
	 */
	markdown: function(md) {
		if (!md) { return; }
		return marked(md);
	}

};

module.exports = formatters;