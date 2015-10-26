import gulp from 'gulp';
import concat from 'gulp-concat';
import babel from 'gulp-babel';
import config from './../../config.js';

// Build vendor.
gulp.task('js-vendor', () => {
    return gulp.src(config.source.js.vendor)
        .pipe(concat('_vendor.js', { newLine: ';' }))
        //.pipe(babel())
        .pipe(gulp.dest('public/assets/scripts/partials'));
});