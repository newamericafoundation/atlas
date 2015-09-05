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
    babelify = require('babelify');

var config = require('./config.js');

require('./js/one_off_tasks.js');
require('./js/bundle.js');


// Build main application source.
gulp.task('js-build-source', () => {
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

// Clean js build folder.
gulp.task('js-clean-build', (next) => {
    del([ 'public/assets/scripts/build/**/*' ], next);
});

// Main js build task. Concatenates partial builds, compresses and gzips in production mode.
gulp.task('js-build', [ 'js-clean-build', 'js-build-source' ], () => {
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