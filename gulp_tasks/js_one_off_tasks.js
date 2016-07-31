// Compile lazy-loaded vendor scripts.

import gulp from 'gulp'
import copy from 'gulp-copy'
import concat from 'gulp-concat'
import gzip from 'gulp-gzip'

var jsSource = {

    vendorAsyncCKEditor: [
        './bower_components/ckeditor/**/*'
    ],

    vendorAsyncXlsxParser: [
        './bower_components/js-xlsx/jszip.js',
        './bower_components/js-xlsx/dist/xlsx.js'
    ]

}

// One-time task to copy vendor folders to ./public. These scripts require other scripts of their own
//   so the entire directory is needed.
gulp.task('js-vendor-async-ckeditor', () => {
    return gulp.src(jsSource.vendorAsyncCKEditor)
        .pipe(copy('public/assets/vendor', { prefix: 1 }));
})

// One-time task to copy vendor folders to ./public. These scripts require other scripts of their own
//   so the entire directory is needed.
gulp.task('js-vendor-async-xlsx-parser', () => {
    return gulp.src(jsSource.vendorAsyncXlsxParser)
        .pipe(concat('js-xlsx-standalone.js'))
        .pipe(gulp.dest('public/assets/vendor'))
        .pipe(gzip())
        .pipe(gulp.dest('public/assets/vendor'));
})

gulp.task('js-vendor-async', [ 
    'js-vendor-async-ckeditor',
    'js-vendor-async-xlsx-parser' 
])