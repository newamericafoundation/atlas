import gulp from 'gulp';
import mocha from 'gulp-mocha';

gulp.task('spec', () => {
    return gulp.src('spec/**/*.js')
        .pipe(mocha({ reporter: 'spec' }));
});