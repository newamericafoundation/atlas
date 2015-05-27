var gulp = require('gulp'),
    util = require('gulp-util'),
    sass = require('gulp-sass'),
    minifyCss = require('gulp-minify-css'),
    eco = require('gulp-eco'),
    concat = require('gulp-concat'),
    coffee = require('gulp-coffee'),
    uglify = require('gulp-uglify'),
    rev = require('gulp-rev'),
    rename = require('gulp-rename'),
    nodemon = require('nodemon'),
    watch = require('gulp-watch'),
    del = require('del'),
    copy = require('gulp-copy'),
    gzip = require('gulp-gzip'),
    watch = require('gulp-watch');

var config = {
    production: !!util.env.production
};

var cssSource = './site/styles/app.scss';

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
        './bower_components/topojson/topojson.js',
        './bower_components/chartist/dist/chartist.js',
        './bower_components/chartist-html/build/chartist-html.js',
        './bower_components/moment/moment.js',
        './bower_components/numeral/numeral.js',
        './bower_components/accountant/dist/marionette.accountant.js',
        './site/scripts/vendor/**/*.js'
    ],

    source: [
        './site/scripts/config/**/*.js.coffee',
        './site/scripts/atlas/atlas.js.coffee',
        './site/scripts/atlas/routes/**/*.js.coffee',
        './site/scripts/atlas/base/**/*.js.coffee',
        './site/scripts/atlas/util/**/*.js.coffee',
        './site/scripts/atlas/components/**/*.js.coffee',
        './site/scripts/atlas/entities/**/*.js.coffee',
        './site/scripts/atlas/site/site.js.coffee',
        './site/scripts/atlas/site/welcome/**/*.js.coffee',
        './site/scripts/atlas/site/header/**/*.js.coffee',
        './site/scripts/atlas/site/projects/**/*.js.coffee',
        './site/scripts/atlas/site/about/**/*.js.coffee'
    ],

    template: [
        './site/scripts/**/*.jst.eco'
    ]

};

gulp.task('js-copy-vendor', function() {
    return gulp.src(jsSource.vendorAsync)
        .pipe(copy('public/assets/vendor', { prefix: 2 }))
        .pipe(gzip())
        .pipe(gulp.dest('public/assets/vendor'));
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
        .pipe(minifyCss())
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
            basePath: 'site/scripts',
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

gulp.task('js-build', ['js-build-template', 'js-build-source', 'js-build-vendor'], function() {
    return gulp.src(['public/assets/scripts/partials/_template.js', 'public/assets/scripts/partials/_vendor.js', 'public/assets/scripts/partials/_source.js'])
        .pipe(concat('app.js'))
        .pipe(config.production ? uglify() : util.noop())
        .pipe(rev())
        .pipe(config.production ? gzip() : util.noop())
        .pipe(gulp.dest('public/assets/scripts'))
        .pipe(rev.manifest())
        .pipe(gulp.dest('public/assets/scripts'));
});

gulp.task('watch', function() {
    gulp.watch([ '**/*.coffee', '**/*.scss', '**/*.eco' ], [ 'default' ]);
});

gulp.task('default', ['js-build', 'css-build']);

gulp.task('dev', function() {
    nodemon({
        script: './app.js',
        ext: 'js css gz jade scss coffee',
        tasks: [ 'default' ]
    })
    .on('restart', function() {
        console.log('Server restarted.');
    });
});