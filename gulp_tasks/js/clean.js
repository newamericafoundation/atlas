import gulp from 'gulp';
import del from 'del';

// Clean js build folder.
gulp.task('js-clean-build', (next) => {
    del([ 'public/assets/scripts/build/**/*' ], next);
});