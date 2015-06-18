var jsFp = require('../../public/assets/scripts/rev-manifest.json')['app.js'],
	cssFp = require('../../public/assets/styles/rev-manifest.json')['app.css'];

var deleteGzipExtension = function(fileName) {
	if (fileName.slice(-3) === '.gz') {
		return fileName.slice(0, -3);
	}
	return fileName;
};

var man = {
	js: deleteGzipExtension(jsFp),
	css: deleteGzipExtension(cssFp)
};

// console.dir(man);

module.exports = man;