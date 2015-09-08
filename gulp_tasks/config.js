import * as util from 'gulp-util';

module.exports = {

    production: !!util.env.production,

    source: {

    	js: {

    		// Vendor scripts that are lazy-loaded when needed, then kept on the window.
			vendorAsyncSingleScript: [
		        './bower_components/d3/d3.min.js', 
		        './bower_components/mapbox.js/mapbox.js'
		    ],

		    vendorAsyncFolder: [
		    	'./bower_components/ckeditor/**/*'
		    ],

		    // bower scripts
		    vendor: [
		        './bower_components/jquery/dist/jquery.js',
		        './bower_components/jquery-mousewheel/jquery.mousewheel.js',
		        './bower_components/selectize/dist/js/standalone/selectize.js',
		        './bower_components/underscore/underscore.js',
		        './bower_components/backbone/backbone.js',
		        './bower_components/marionette/lib/backbone.marionette.js',
		        './bower_components/topojson/topojson.js',
		        './bower_components/chartist/dist/chartist.js',
		        './bower_components/numeral/numeral.js',
		        './bower_components/chartist-html/build/chartist-html.js',
		        './bower_components/jszip/dist/jszip.js',
		        './bower_components/js-xlsx/dist/xlsx.js',
		        './app/assets/scripts/vendor/**/*'
		    ],

		    // main application code
		    source: [
		        './app/assets/scripts/config/**/*',
		        './app/assets/scripts/atlas/atlas.js',
		        './app/assets/scripts/atlas/site/map/**/*.js.coffee'
		    ]

    	}

    }

};