import gulp from 'gulp';
import copy from 'gulp-copy';
import config from './config.js';

gulp.task('extract-boilerplate', () => {
	return gulp.src(config.boilerplate)
		.pipe(copy('./../boilerplate/'), { prefix: 0 });
});