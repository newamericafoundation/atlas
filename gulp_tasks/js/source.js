import gulp from 'gulp';
import gulpIf from 'gulp-if';
import concat from 'gulp-concat';
import coffee from 'gulp-coffee';
import babel from 'gulp-babel';

import config from './../config.js';

// Build main application source.
gulp.task('js-build-source', () => {
    return gulp.src(config.source.js.source)
        .pipe(babel())
        .pipe(concat('source.js'))
        .pipe(gulp.dest('public/assets/scripts/partials'));
});