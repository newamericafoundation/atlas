var fs = require('fs'),
	css = "",
	colors = { 'off-white': '#fffaef', 'black': '#000' },
	path = '../site/images/icons/svg/',
	crap = [
		//'<?xml version="1.0" encoding="utf-8"?>',
		'<!-- Generator: Adobe Illustrator 18.0.0, SVG Export Plug-In . SVG Version: 6.00 Build 0)  -->',
		'id="Layer_1"',
		'<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">'
		//'version="1.1"  xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"'
	];

var writeFile = function(css) {
	fs.writeFile('../site/styles/base/_bg-img.scss', css, 'utf8', function(err) {
		if(err) { return console.log(err); }
		console.log('saved successfully!')
	});
};

var eraseCrap = function(data) {
	crap.forEach(function(crp){
		data = data.replace(crp, '');
	});
	return data;
};

fs.readdir(path, function(err, files) {

	if (err) { return console.log(err); }
	var fileCount = files.length,
		currentFileIndex = 0,
		css = "";

	files.forEach(function(file) {
		fs.readFile(path + file, 'utf8', function(err, data) {
			if (err) { return console.log(err); }

			var encoded, svg, url,
				base = file.slice(6, -4),
				hex, newData;

			for (color in colors) {
				hex = colors[color];
				newData = eraseCrap(data);
				newData = newData.replace(/fill=\"#231[fF]20\"/g, 'fill="' + hex + '"');
				encoded = new Buffer(newData).toString('base64');
				svg = 'data:image/svg+xml;base64,' + encoded;
				url = "url('" + svg + "')";
				css += '.bg-img-' + base + '--' + color + ' { background-image: ' + url + '; }\n';
			}

			currentFileIndex += 1;
			if (currentFileIndex === fileCount) { writeFile(css); }

		});
	});

});