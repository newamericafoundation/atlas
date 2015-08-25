var gulp = require('gulp'),
    gulpIf = require('gulp-if'),
    concat = require('gulp-concat'),
    del = require('del'),
    util = require('gulp-util'),
    insert = require('gulp-insert'),
    rename = require('gulp-rename'),
    gzip = require('gulp-gzip'),
    coffee = require('gulp-coffee'),
    uglify = require('gulp-uglify'),
    cjsx = require('gulp-cjsx'),
    rev = require('gulp-rev'),
    browserifyGlobalShim = require('browserify-global-shim'),
    browserify = require('browserify'),
    source = require('vinyl-source-stream'),
    babel = require('gulp-babel'),
    babelify = require('babelify');

var config = require('./config.js');

gulp.task('js-clean', function(next) {
    del([ 'public/assets/scripts/**/*' ], next);
});

// make server-side model definitions available on the client.
gulp.task('bundle-models', function() {
    var globalShim = browserifyGlobalShim.configure({
        'jquery': '$',
        'underscore': '_',
        'backbone': 'Backbone'
    });
    var b = browserify({ entries: [ './app/models/__client__.js' ] });
    b.transform(globalShim);
    b.transform(babelify);
    return b.bundle()
        .pipe(source('__auto__models.js'))
        .pipe(gulp.dest('./app/assets/scripts/atlas'));
});

// One-time task to copy asynchronously loaded library scripts from bower_components to ./public.
gulp.task('js-copy-vendor', function() {
    return gulp.src(config.source.js.vendorAsync)
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

gulp.task('js-build-source', [ 'js-clean' ], function() {
    return gulp.src(config.source.js.main)
        .pipe(gulpIf(/[.]coffee$/, coffee()))
        .pipe(concat('_source.js'))
        .pipe(gulp.dest('public/assets/scripts/partials'));
});

gulp.task('js-build-vendor', [ 'js-clean' ], function() {
    return gulp.src(config.source.js.vendor)
        .pipe(concat('_vendor.js'))
        .pipe(gulp.dest('public/assets/scripts/partials'));
});

/* Not needed. Move towards browserifying components. */
gulp.task('js-build-component', [ 'js-clean' ], function() {
    gulp.src(config.source.js.component)
        .pipe(gulpIf(/[.]cjsx$/, cjsx({ bare: true })))
        .pipe(gulpIf(/[.]jsx$/, babel()))
        .pipe(concat('_component.js'))
        .pipe(gulp.dest('public/assets/scripts/partials'));
});

gulp.task('js-build', [ 'bundle-models', 'js-build-source', 'js-build-vendor', 'js-build-component' ], function() {
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