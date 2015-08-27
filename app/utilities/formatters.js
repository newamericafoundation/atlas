var numeral = require('numeral'),
	marked = require('marked'),
	$ = require('jquery');

var formatters = {

	currency: function(v) {
	    var formatter;
	    if (typeof numeral === "undefined" || numeral === null) {
	        return v;
	    }
	    formatter = v > 999 ? '($0a)' : '($0)';
	    return numeral(v).format(formatter);
	},

	number: function(v) {
	    var formatter;
	    if (typeof numeral === "undefined" || numeral === null) {
	        return v;
	    }
	    formatter = v > 99999 ? '(0a)' : '(0)';
	    return numeral(v).format(formatter);
	},

	percent: function(v) {
	    return v + '%';
	},

	html: function(html) {
	    var $html, newHtml;
	    $html = $(html);
	    $html.find('a').attr('target', '_blank');
	    newHtml = $('<div></div>').append($html.clone()).html();
	    return newHtml;
	},

	atlasArray: function(atlasArray) {
	    var arr;
	    arr = atlasArray.split("|");
	    arr = _.map(arr, function(item) {
	        return item.trim();
	    });
	    return arr;
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
	},

	// deprecated
	mdToHtml: function(string) {
	    return this.markdown(string);
	}

};

module.exports = formatters;