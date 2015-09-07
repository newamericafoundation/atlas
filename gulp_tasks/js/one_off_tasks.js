import gulp from 'gulp';
import copy from 'gulp-copy';
import gzip from 'gulp-gzip';

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