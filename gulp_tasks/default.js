import gulp from 'gulp';

// Run this task on the command line by simply typing 'gulp'.
gulp.task('default', [ 'js-build', 'css-build' ]);
gulp.task('default-intranet', [ 'css-build-intranet' ]);

gulp.task('null', [], function() { return true; });