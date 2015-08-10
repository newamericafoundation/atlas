var util = require('gulp-util');

module.exports = {

    production: !!util.env.production,

    source: {

    	js: {

			vendorAsync: [
		        './bower_components/d3/d3.min.js', 
		        './bower_components/mapbox.js/mapbox.js'
		    ],

		    vendor: [
		        './bower_components/jquery/dist/jquery.js',
		        './bower_components/marked/lib/marked.js',
		        './bower_components/jquery-mousewheel/jquery.mousewheel.js',
		        './bower_components/lodash/lodash.js',
		        './bower_components/backbone/backbone.js',
		        './bower_components/marionette/lib/backbone.marionette.js',
		        './bower_components/react/react.js',
		        './bower_components/topojson/topojson.js',
		        './bower_components/chartist/dist/chartist.js',
		        './bower_components/chartist-html/build/chartist-html.js',
		        './bower_components/moment/moment.js',
		        './bower_components/numeral/numeral.js',
		        './bower_components/accountant/dist/marionette.accountant.js',
		        './app/assets/scripts/vendor/**/*.js'
		    ],

		    main: [
		        './app/assets/scripts/config/**/*.js.coffee',
		        './app/assets/scripts/atlas/atlas.js.coffee',
		        './app/assets/scripts/atlas/routes/**/*.js.coffee',
		        './app/assets/scripts/atlas/base/**/*.js.coffee',
		        './app/assets/scripts/atlas/util/**/*.js.coffee',
		        './app/assets/scripts/atlas/__auto__models.js',
		        './app/assets/scripts/atlas/entities/**/*.js.coffee',
		        './app/assets/scripts/atlas/site/site.js.coffee',
		        './app/assets/scripts/atlas/site/tilemap/**/*.js.coffee'
		    ],

		    component: [
		        './app/assets/scripts/atlas/components/init.cjsx',
		        './app/assets/scripts/atlas/components/non_routable/loading.cjsx',
		        './app/assets/scripts/atlas/components/non_routable/setup.cjsx',
		        './app/assets/scripts/atlas/components/non_routable/icons/**/*.cjsx',
		        './app/assets/scripts/atlas/components/non_routable/layout.cjsx',
		        './app/assets/scripts/atlas/components/non_routable/header.cjsx',
		        './app/assets/scripts/atlas/components/non_routable/side_bar.cjsx',
		        './app/assets/scripts/atlas/components/non_routable/intranet/**/*.cjsx',
		        './app/assets/scripts/atlas/components/routable/about/**/*.cjsx',
		        './app/assets/scripts/atlas/components/routable/welcome/**/*.cjsx',
		        './app/assets/scripts/atlas/components/routable/projects/root.cjsx',
		        './app/assets/scripts/atlas/components/routable/projects/index/root.cjsx',
		        './app/assets/scripts/atlas/components/routable/projects/index/subcomponents/**/*.cjsx',
		        './app/assets/scripts/atlas/components/routable/projects/show/root.cjsx',
		        './app/assets/scripts/atlas/components/routable/projects/show/tilemap/root.cjsx',
		        './app/assets/scripts/atlas/components/routable/projects/show/tilemap/subcomponents/**/*.cjsx',
		        './app/assets/scripts/atlas/components/routable/projects/show/explainer/root.cjsx',
		        './app/assets/scripts/atlas/components/routable/projects/show/explainer/subcomponents/**/*.cjsx'
		    ],

		    template: [
		        './app/assets/scripts/**/*.jst.eco'
		    ]

    	}

    },

    destination: {

    }

};