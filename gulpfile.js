var path = require('path'),
    gulp = require('gulp'),
    util = require('gulp-util'),
    sass = require('gulp-sass'),
    minifyCss = require('gulp-minify-css'),
    eco = require('gulp-eco'),
    concat = require('gulp-concat'),
    coffee = require('gulp-coffee'),
    uglify = require('gulp-uglify'),
    insert = require('gulp-insert'),
    rev = require('gulp-rev'),
    rename = require('gulp-rename'),
    nodemon = require('gulp-nodemon'),
    del = require('del'),
    copy = require('gulp-copy'),
    gzip = require('gulp-gzip'),
    shell = require('gulp-shell'),
    mocha = require('gulp-mocha'),
    mochaPhantomJs = require('gulp-mocha-phantomjs'),
    cjsx = require('gulp-cjsx'),
    liveReload = require('gulp-livereload'),
    browserifyGlobalShim = require('browserify-global-shim'),
    browserify = require('browserify'),
    source = require('vinyl-source-stream');

var config = {
    production: !!util.env.production
};

var cssSource = './app/assets/styles/app.scss';

var jsSource = {

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

    source: [
        './app/assets/scripts/config/**/*.js.coffee',
        './app/assets/scripts/atlas/atlas.js.coffee',
        './app/assets/scripts/atlas/routes/**/*.js.coffee',
        './app/assets/scripts/atlas/base/**/*.js.coffee',
        './app/assets/scripts/atlas/util/**/*.js.coffee',
        './app/assets/scripts/atlas/__auto__models.js.coffee',
        './app/assets/scripts/atlas/entities/**/*.js.coffee',
        './app/assets/scripts/atlas/site/site.js.coffee',
        './app/assets/scripts/atlas/site/welcome/**/*.js.coffee',
        './app/assets/scripts/atlas/site/header/**/*.js.coffee',
        './app/assets/scripts/atlas/site/projects/**/*.js.coffee',
        './app/assets/scripts/atlas/site/about/**/*.js.coffee'
    ],

    component: [
        './app/assets/scripts/atlas/components/init.cjsx',
        './app/assets/scripts/atlas/components/site/about/**/*.cjsx',
        './app/assets/scripts/atlas/components/site/welcome/**/*.cjsx',
        './app/assets/scripts/atlas/components/site/projects/root.cjsx',
        './app/assets/scripts/atlas/components/site/projects/index/**/*.cjsx',
        './app/assets/scripts/atlas/components/site/projects/show/root.cjsx',
        './app/assets/scripts/atlas/components/site/projects/show/tilemap/**/*.cjsx',
        './app/assets/scripts/atlas/components/site/projects/show/explainer/**/*.cjsx'
    ],

    template: [
        './app/assets/scripts/**/*.jst.eco'
    ]

};

gulp.task('js-copy-vendor', function() {
    return gulp.src(jsSource.vendorAsync)
        .pipe(copy('public/assets/vendor', { prefix: 2 }))
        .pipe(gzip())
        .pipe(gulp.dest('public/assets/vendor'));
});

gulp.task('js-db-json', function() {
    return gulp.src('./db/seeds/core_data/**/*')
        .pipe(gzip())
        .pipe(gulp.dest('db/seeds/core_data'));
});

gulp.task('js-gzip-vendor', function() {
    return gulp.src('public/assets/vendor/*.js')
        .pipe(gzip())
        .pipe(gulp.dest('public/assets/vendor'));
});

gulp.task('css-clean', function(next) {
	return del([ 'public/assets/styles/**/*' ], next);
});

gulp.task('css-build', ['css-clean'], function() {
    return gulp.src(cssSource)
        .pipe(sass())
        .pipe(config.production ? minifyCss() : util.noop())
        .pipe(rename('app.css'))
        .pipe(gulp.dest('public/assets/styles/'))
        .pipe(rev())
        .pipe(gulp.dest('public/assets/styles'))
        .pipe(gzip())
        .pipe(gulp.dest('public/assets/styles'))
        .pipe(rev.manifest())
        .pipe(gulp.dest('public/assets/styles'));
});

gulp.task('js-clean', function(next) {
	del([ 'public/assets/scripts/**/*' ], next);
});

gulp.task('js-build-template', [ 'js-clean' ], function() {
    return gulp.src(jsSource.template)
        .pipe(eco({
            basePath: 'app/assets/scripts',
            namespace: 'JST_ATL'
        }))
        .pipe(concat('_template.js'))
        .pipe(gulp.dest('public/assets/scripts/partials'));
});

gulp.task('js-build-source', [ 'js-clean' ], function() {
    return gulp.src(jsSource.source)
        .pipe(coffee())
        .pipe(concat('_source.js'))
        .pipe(gulp.dest('public/assets/scripts/partials'));
});

gulp.task('js-build-vendor', [ 'js-clean' ], function() {
    return gulp.src(jsSource.vendor)
        .pipe(concat('_vendor.js'))
        .pipe(gulp.dest('public/assets/scripts/partials'));
});

gulp.task('js-build-component', [ 'js-clean' ], function() {
    gulp.src(jsSource.component)
        .pipe(concat('_component.cjsx'))
        .pipe(cjsx({ bare: true }))
        .pipe(gulp.dest('public/assets/scripts/partials'));
});

gulp.task('js-build', ['js-build-template', 'js-build-source', 'js-build-vendor', 'js-build-component'], function() {
    return gulp.src(['public/assets/scripts/partials/_template.js', 'public/assets/scripts/partials/_vendor.js', 'public/assets/scripts/partials/_component.js', 'public/assets/scripts/partials/_source.js'])
        .pipe(concat('app.js'))
        .pipe(config.production ? util.noop() : gulp.dest('public/assets/scripts'))
        .pipe(config.production ? uglify() : util.noop())
        .pipe(config.production ? util.noop() : gulp.dest('spec/site')) // copy client-side scripts to spec folder
        .pipe(rev())
        .pipe(config.production ? gzip() : util.noop())
        .pipe(gulp.dest('public/assets/scripts'))
        .pipe(rev.manifest())
        .pipe(gulp.dest('public/assets/scripts'));
});

gulp.task('default', ['js-build', 'css-build']);

gulp.task('dev', function() {
    liveReload.listen();
    nodemon({
        script: './app.js',
        ext: 'js css gz jade scss coffee eco cjsx',
        tasks: function(changedFiles) {
            return [ 'default' ];
        } 
    })
    .on('restart', function() { 
        gulp.src('./app.js')
            .pipe(liveReload());
    });
});

gulp.task('port-models', function() {
    return gulp.src([ './app/assets/scripts/atlas/models/**/*.js.coffee' ])
        .pipe(coffee({ bare: true }))
        .pipe(gulp.dest('./app/backbone-models'));
});

var globalShim = browserifyGlobalShim.configure({
    'jquery': '$',
    'underscore': '_',
    'backbone': 'Backbone' 
});

gulp.task('bundle-models', function() {
    var b = browserify({
        entries: [ './app/models/__client__.js' ]
    });
    b.transform(globalShim);
    return b.bundle()
        .pipe(source('__auto__models.js.coffee'))
        .pipe(insert.prepend('`\n'))
        .pipe(insert.append('\n`'))
        .pipe(gulp.dest('./app/assets/scripts/atlas'));
});

gulp.task('components', function() {
    return gulp.src('./app/assets/scripts/atlas/components/**/*.cjsx')
        .pipe(cjsx())
        .pipe(gulp.dest('./app/__auto__components'));
});

gulp.task('js-build-spec', function() {
    return gulp.src([ './spec/site/scripts/atlas/**/*.js.coffee', './spec/site/scripts/config/**/*.js.coffee' ])
        .pipe(coffee())
        .pipe(concat('all-spec.js'))
        .pipe(gulp.dest('./spec/site'));
});

gulp.task('js-build-fixtures', function() {
    return gulp.src([ './spec/site/scripts/fixtures/**/*.js.coffee' ])
        .pipe(coffee())
        .pipe(concat('all-fixtures.js'))
        .pipe(gulp.dest('./spec/site'));
});

gulp.task('spec', [ 'js-build', 'js-build-spec', 'js-build-fixtures' ], function() {
    return gulp.src('spec/site/runner.html')
        .pipe(mochaPhantomJs({ reporter: 'spec' }));
});

gulp.task('spec-server', function() {
    return gulp.src('spec/models/**/*.js')
        .pipe(mocha({ reporter: 'spec' }));
});

gulp.task('deploy', shell.task([
  'gulp --production',
  'git add -A',
  'git commit -m "fresh deploy"',
  'git push origin master',
  'eb deploy'
]));