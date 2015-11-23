import gulp from 'gulp';
import concat from 'gulp-concat';
import uglify from 'gulp-uglify';
import gzip from 'gulp-gzip';
import util from 'gulp-util';
import rev from 'gulp-rev';

import config from './../config.js';

// JS uglify and gzip task. Runs right after webpack build.
// TODO: integrate into webpack build.
gulp.task('js', () => {
    return gulp.src([ 'public/assets/scripts/bundle.js' ])
        .pipe(uglify().on('error', util.log))
        .pipe(rev())
        .pipe(gzip())
        .pipe(gulp.dest('public/assets/scripts'))
        .pipe(rev.manifest())
        .pipe(gulp.dest('public/assets/scripts'));
});