var gulp = require('gulp'),
    gulpIf = require('gulp-if'),
    copy = require('gulp-copy'),
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
    jshint = require('gulp-jshint'),
    babelify = require('babelify');

var config = require('./config.js');

// make server-side model definitions available on the client.
gulp.task('bundle-models', () => {
    var globalShim = browserifyGlobalShim.configure({
        'jquery': '$',
        'underscore': '_',
        'backbone': 'Backbone',
        'mongodb': 'mongodb'
    });
    var b = browserify({ 
        entries: [ './app/models/__client__.js' ],
        noParse: [ 'jquery' ].map(require.resolve)
    });
    b.transform(babelify);
    b.transform(globalShim);
    return b.bundle()
        .pipe(source('__auto__models.js'))
        .pipe(gulp.dest('./app/assets/scripts/atlas'));
});

// One-time task to copy asynchronously loaded library scripts from bower_components to ./public.
gulp.task('js-copy-async-vendor-single-script', () => {
    return gulp.src(config.source.js.vendorAsyncSingleScript)
        .pipe(copy('public/assets/vendor', { prefix: 2 }))
        .pipe(gzip())
        .pipe(gulp.dest('public/assets/vendor'));
});

// One-time task to copy vendor folders to ./public. These scripts require other scripts of their own
//   so the entire directory is needed.
gulp.task('js-copy-async-vendor-folder', () => {
    return gulp.src(config.source.js.vendorAsyncFolder)
        .pipe(copy('public/assets/vendor', { prefix: 1 }));
});

// Gzip json.
gulp.task('js-db-json', () => {
    return gulp.src('./db/seeds/core_data/**/*')
        .pipe(gzip())
        .pipe(gulp.dest('db/seeds/core_data'));
});

// Gzip async vendor tasks.
gulp.task('js-gzip-async-vendor', () => {
    return gulp.src('public/assets/vendor/*.js')
        .pipe(gzip())
        .pipe(gulp.dest('public/assets/vendor'));
});

// Build main application source.
gulp.task('js-build-source', [ 'bundle-models' ], () => {
    return gulp.src(config.source.js.source)
        .pipe(gulpIf(/[.]coffee$/, coffee()))
        .pipe(concat('source.js'))
        .pipe(gulp.dest('public/assets/scripts/partials'));
});

// Build vendor.
gulp.task('js-build-vendor', () => {
    return gulp.src(config.source.js.vendor)
        .pipe(concat('vendor.js'))
        .pipe(gulp.dest('public/assets/scripts/partials'));
});

// Build components.
gulp.task('js-build-component', () => {
    gulp.src(config.source.js.component)
        .pipe(gulpIf(/[.]cjsx$/, cjsx({ bare: true })))
        .pipe(gulpIf(/[.]jsx$/, babel()))
        .pipe(concat('component.js'))
        // .pipe(jshint())
        // .pipe(jshint.reporter('default'))
        .pipe(gulp.dest('public/assets/scripts/partials'));
});

// Clean js build folder.
gulp.task('js-clean-build', (next) => {
    del([ 'public/assets/scripts/build/**/*' ], next);
});

// Main js build task. Concatenates partial builds, compresses and gzips in production mode.
gulp.task('js-build', [ 'js-clean-build', 'js-build-source', 'js-build-component' ], () => {
    return gulp.src([ 
            'public/assets/scripts/partials/vendor.js', 
            'public/assets/scripts/partials/source.js',
            'public/assets/scripts/partials/component.js'
        ])
        .pipe(concat('app.js'))
        .pipe(config.production ? util.noop() : gulp.dest('public/assets/scripts/build'))
        .pipe(config.production ? uglify() : util.noop())
        .pipe(config.production ? util.noop() : gulp.dest('spec/site')) // copy client-side scripts to spec folder
        .pipe(rev())
        .pipe(config.production ? gzip() : util.noop())
        .pipe(gulp.dest('public/assets/scripts/build'))
        .pipe(rev.manifest())
        .pipe(gulp.dest('public/assets/scripts/build'));
});