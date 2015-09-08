import gulp from 'gulp';
import concat from 'gulp-concat';
import uglify from 'gulp-uglify';
import gzip from 'gulp-gzip';
import util from 'gulp-util';
import rev from 'gulp-rev';

import config from './../config.js';

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