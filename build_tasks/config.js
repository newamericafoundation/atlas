import * as util from 'gulp-util';

module.exports = {

    production: !!util.env.production,

    source: {

    	js: {

    		// Vendor scripts that are lazy-loaded when needed, then kept on the window.
			vendorAsync: [
		        './bower_components/d3/d3.min.js', 
		        './bower_components/mapbox.js/mapbox.js'
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

		        './bower_components/numeral/numeral.js'
		    ],

		    // main application code
		    source: [
		    	'./app/assets/scripts/vendor/**/*.js',
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
		        './app/components/general/**/*',
		        './app/components/form/root.jsx',
		        './app/components/form/subcomponents/**/*',
		        './app/components/route_handlers/about/**/*.cjsx',
		        './app/components/route_handlers/welcome/**/*',
		        './app/components/route_handlers/projects/index/root.cjsx',
		        './app/components/route_handlers/projects/index/subcomponents/**/*.cjsx',
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