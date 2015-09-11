// Utility script parsing and compiling fingerprinting manifests for scripts and styles.

var jsFp = require('./../../../public/assets/scripts/build/rev-manifest.json')['app.js'],
	cssFp = require('./../../../public/assets/styles/rev-manifest.json')['app.css'];

// Delete GZip extension from the end of the filename.
var deleteGzipExtension = function(fileName) {
	if (fileName.slice(-3) === '.gz') {
		return fileName.slice(0, -3);
	}
	return fileName;
};

var allManifest = {
	js: deleteGzipExtension(jsFp),
	css: deleteGzipExtension(cssFp)
};

export default allManifest;