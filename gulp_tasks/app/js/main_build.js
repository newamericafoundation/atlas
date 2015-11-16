import gulp from 'gulp';
import concat from 'gulp-concat';
import uglify from 'gulp-uglify';
import gzip from 'gulp-gzip';
import util from 'gulp-util';
import rev from 'gulp-rev';

import config from './../../config.js';

// Main js build task. Concatenates partial builds, compresses and gzips in production mode.
gulp.task('js', [ 'bundle' ], () => {
    return gulp.src([ 'public/assets/scripts/bundle.js' ])
        .pipe(config.production ? uglify().on('error', util.log) : util.noop())
        .pipe(rev())
        .pipe(config.production ? gzip() : util.noop())
        .pipe(gulp.dest('public/assets/scripts'))
        .pipe(rev.manifest())
        .pipe(gulp.dest('public/assets/scripts'));
});