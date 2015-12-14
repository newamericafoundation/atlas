// Compile lazy-loaded vendor scripts.

import gulp from 'gulp';
import copy from 'gulp-copy';
import concat from 'gulp-concat';
import gzip from 'gulp-gzip';
import * as config from './config.js';

// One-time task to copy asynchronously loaded library scripts from bower_components to ./public.
gulp.task('js-vendor-async-single', () => {
    return gulp.src(config.source.js.vendorAsyncSingle)
        .pipe(gulp.dest('public/assets/vendor'))
        .pipe(gzip())
        .pipe(gulp.dest('public/assets/vendor'));
});

// One-time task to copy vendor folders to ./public. These scripts require other scripts of their own
//   so the entire directory is needed.
gulp.task('js-vendor-async-ckeditor', () => {
    return gulp.src(config.source.js.vendorAsyncCKEditor)
        .pipe(copy('public/assets/vendor', { prefix: 1 }));
});

// One-time task to copy vendor folders to ./public. These scripts require other scripts of their own
//   so the entire directory is needed.
gulp.task('js-vendor-async-xlsx-parser', () => {
    return gulp.src(config.source.js.vendorAsyncXlsxParser)
        .pipe(concat('js-xlsx-standalone.js'))
        .pipe(gulp.dest('public/assets/vendor'))
        .pipe(gzip())
        .pipe(gulp.dest('public/assets/vendor'));
});

gulp.task('js-vendor-async', [ 
    'js-vendor-async-single', 
    'js-vendor-async-ckeditor',
    'js-vendor-async-xlsx-parser' 
]);