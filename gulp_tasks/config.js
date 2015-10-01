import * as util from 'gulp-util';

module.exports = {

    production: !!util.env.production,

    boilerplate: [

    	'./app.js',

    	'./app/middleware/**/*',
    	'./app/assets/scripts/polyfills/**/*',
    	'./app/models/base_crud.js',

    	'./app/components/crud/**/*',
    	'./app/components/form/**/*',

    	'./db/connector.js',
    	'./db/batch_modifier',

    	'./public/assets/styles/app.css'

    ],

    source: {

    	js: {

    		// Vendor scripts that are lazy-loaded when needed, then kept on the window.
			vendorAsyncSingle: [
		        './bower_components/d3/d3.min.js', 
		        './bower_components/mapbox.js/mapbox.js'
		    ],

		    vendorAsyncCKEditor: [
		    	'./bower_components/ckeditor/**/*'
		    ],

		    vendorAsyncXlsxParser: [
		    	'./bower_components/js-xlsx/jszip.js',
		        './bower_components/js-xlsx/dist/xlsx.js'
		    ],

		    // bower scripts
		    vendor: [
		        './bower_components/jquery/dist/jquery.js',
		        // './bower_components/q/q.js',
		        // './bower_components/qajax/src/qajax.js',
		        './bower_components/selectize/dist/js/standalone/selectize.js',
		        './bower_components/underscore/underscore.js',
		        './bower_components/backbone/backbone.js',
		        './bower_components/marionette/lib/backbone.marionette.js',
		        './bower_components/topojson/topojson.js',
		        './bower_components/chartist/dist/chartist.js',
		        './bower_components/numeral/numeral.js',
		        './bower_components/chartist-html/build/chartist-html.js',
		        './app/assets/scripts/vendor/**/*'
		    ],

		    // main application code
		    source: [
		    	'./app/assets/scripts/polyfills/**/*',
		        './app/assets/scripts/config/**/*',
		        './app/assets/scripts/atlas/map/map.js',
		        './app/assets/scripts/atlas/map/map_control_helpers.js',
		        './app/assets/scripts/atlas/map/map_views.js.coffee',
		        './app/assets/scripts/atlas/map/overlay_views/base.js.coffee',
		        './app/assets/scripts/atlas/map/overlay_views/path.js.coffee',
		        './app/assets/scripts/atlas/map/overlay_views/pin.js.coffee'
		    ]

    	}

    }

};