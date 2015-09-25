var numeral = require('numeral'),
	marked = require('marked'),
	$ = require('jquery');

var formatters = {

	currency: function(v) {
	    var formatter;
	    if (!numeral) { return v; }
	    formatter = v > 999 ? '($0a)' : '($0)';
	    return numeral(v).format(formatter);
	},

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

	percent: function(v) {
	    return formatters.number(v) + '%';
	},

	percentage: function(v) {
		return formatters.percent(v);
	},

	html: function(html) {
	    var $html, newHtml;
	    $html = $(html);
	    $html.find('a').attr('target', '_blank');
	    newHtml = $('<div></div>').append($html.clone()).html();
	    return newHtml;
	},

	removeLineBreaks: function(string) {
	    string = String(string);
	    return string.replace(/(\r\n|\n|\r)/gm, '');
	},

	removeSpaces: function(string) {
	    string = String(string);
	    return string.replace(/\s+/g, '');
	},

	hyphenate: function(string) {
	    string = String(string);
	    return string.replace('ommunication', 'ommuni-cation');
	},

	markdown: function(string) {
	    var html;
	    if (string != null) {
	        html = marked(string);
	    }
	    return html;
	}

};

module.exports = formatters;