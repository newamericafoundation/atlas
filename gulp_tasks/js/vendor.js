import gulp from 'gulp';
import concat from 'gulp-concat';
import config from './../config.js';

// Build vendor.
gulp.task('js-build-vendor', () => {
    return gulp.src(config.source.js.vendor)
        .pipe(concat('vendor.js'))
        .pipe(gulp.dest('public/assets/scripts/partials'));
});