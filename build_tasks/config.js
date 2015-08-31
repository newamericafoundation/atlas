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
		        './bower_components/marked/lib/marked.js',
		        './bower_components/underscore/underscore.js',
		        './bower_components/backbone/backbone.js',
		        './bower_components/marionette/lib/backbone.marionette.js',
		        './bower_components/react/react.js',
		        './bower_components/react-router/umd/ReactRouter.js',
		        './bower_components/topojson/topojson.js',
		        './bower_components/chartist/dist/chartist.js',
		        './bower_components/chartist-html/build/chartist-html.js',
		        './bower_components/moment/moment.js',
		        './bower_components/jszip/dist/jszip.js',
		        './bower_components/js-xlsx/dist/xlsx.js',
		        './bower_components/numeral/numeral.js'
		    ],

		    // main application code
		    source: [
		    	// all vendor code not available through bower are stored here
		    	'./app/assets/scripts/vendor/chroma.js',
		    	'./app/assets/scripts/vendor/jquery-ui.js',
		    	'./app/assets/scripts/vendor/faisalman-simple-excel-js-3a2b9be/src/simple-excel.js',
		        './app/assets/scripts/config/**/*.js.coffee',
		        './app/assets/scripts/atlas/atlas.js.coffee',
		        './app/assets/scripts/atlas/routes/**/*',
		        './app/assets/scripts/atlas/base/**/*.js.coffee',
		        './app/assets/scripts/atlas/util/**/*.js.coffee',
		        './app/assets/scripts/atlas/__auto__models.js',
		        './app/assets/scripts/atlas/entities/**/*.js.coffee',
		        './app/assets/scripts/atlas/site/map/**/*.js.coffee'
		    ],

		    // view and controller code
		    component: [
		        './app/components/init.jsx',
		        './app/components/routes.jsx',
		        './app/components/general/**/*',
		        './app/components/form/root.jsx',
		        './app/components/form/subcomponents/**/*',
		        './app/components/route_handlers/welcome/**/*',
		        './app/components/route_handlers/projects/index/root.cjsx',
		        './app/components/route_handlers/projects/index/subcomponents/**/*',
		        './app/components/route_handlers/projects/new/root.jsx',
		        './app/components/route_handlers/projects/show/root.jsx',
		        './app/components/route_handlers/projects/show/tilemap/root.jsx',
		        './app/components/route_handlers/projects/show/tilemap/subcomponents/**/*',
		        './app/components/route_handlers/projects/show/explainer/root.cjsx',
		        './app/components/route_handlers/projects/show/explainer/subcomponents/**/*'
		    ]

    	}

    }

};