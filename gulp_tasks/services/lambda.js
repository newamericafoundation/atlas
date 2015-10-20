import gulp from 'gulp';
import zip from 'gulp-zip';
import AWS from 'aws-sdk';
import copy from 'gulp-copy';
import install from 'gulp-install';

gulp.task('lbd-copy', () => {

	return gulp.src('./services/lambda/src/hello_lambda/**/*')
		.pipe(copy('./services/lambda/dist/hello_lambda', { prefix: 4 }));

});