import gulp from 'gulp';

// Run this task on the command line by simply typing 'gulp'.
gulp.task('default', [ 'js', 'css' ]);

gulp.task('null', [], function() { return true; });