// Creates base64 encoded styles from the icons folder
//   containing single svg icons.

var fs = require('fs'),
	css = "",
	colors = { 'off-white': '#fffaef', 'black': '#000' },
	path = '../images/icons/svg/',
	crap = [
		//'<?xml version="1.0" encoding="utf-8"?>',
		'<!-- Generator: Adobe Illustrator 18.0.0, SVG Export Plug-In . SVG Version: 6.00 Build 0)  -->',
		'id="Layer_1"',
		'<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">'
		//'version="1.1"  xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"'
	];

var writeFile = function(dest, content) {
	fs.writeFile(dest, content, 'utf8', function(err) {
		if(err) { return console.log(err); }
		console.log('saved successfully!'); 
	});
};

var eraseCrap = function(data) {
	crap.forEach(function(crp){
		data = data.replace(crp, '');
	});
	return data;
};

/*
 * Get Base64 encoded url for an svg.
 * @param {string} svg
 * @returns {string} url - E.g. url(data:image/svg+xml;base64,...)
 */
var getEncodedUrl = function(svg) {
	var encoded = new Buffer(svg).toString('base64'),
		urlInner = 'data:image/svg+xml;base64,' + encoded,
		url = "url('" + urlInner + "')";
	return url;
};

/*
 * Get CSS data for file.
 * Background image placeholder classes and real classes are prefixed with bg-img.
 * @param {string} fileName
 * @param {string} data - File contents.
 * @returns {string} css
 */
var getFileCssData = function(fileName, data) {

	var encoded, svg, url,
		base = fileName.slice(6, -4),
		hex, css = '';

	for (color in colors) {
		hex = colors[color];
		console.log(hex);
		newData = data.replace(/fill=\"#231[fF]20\"/g, 'fill="' + hex + '"');
		className = 'bg-img-' + base + '--' + color;
		css += '%' + className + ' { background-image: ' + getEncodedUrl(newData) + '; }\n';
		css += '.' + className + ' { @extend %' + className + '; }\n';
	}

	return css;

};

var getFileReactData = function(fileName, data) {
	var base = fileName.slice(6, -4),
		react = '';

	react += 'Comp.Icons.' + base + ' = React.createClass';
	react += '\n\trender: ->\n\t\t';

	data = data.replace(/\n/g, '\n\t\t');
	data = data.replace(/fill=\"#231[fF]20\"/g, 'fill={this.props.color}');

	react += data;

	react += '\n';

	return react;

};

// Main entry.
fs.readdir(path, function(err, files) {
	if (err) { return console.log(err); }
	var fileCount = files.length,
		currentFileIndex = 0,
		css = "",
		react = "";

	files.forEach(function(file) {
		fs.readFile(path + file, 'utf8', function(err, data) {
			if (err) { return console.log(err); }
			data = eraseCrap(data);
			if (file[0] !== '.') { 
				css += getFileCssData(file, data);
				react += getFileReactData(file, data); 
			}
			currentFileIndex += 1;
			if (currentFileIndex === fileCount) { 
				writeFile('../styles/base/_bg-img.scss', css);
				// writeFile('../scripts/atlas/components/site/icons/illustrator.cjsx', react);
			}
		});
	});
});