import gulp from 'gulp';
import download from 'gulp-download';
import unzip from 'gulp-unzip';
import copy from 'gulp-copy';
import shell from 'gulp-shell';
import del from 'del';

import shapeFile from './../app/models/shape_file.js';

// Clean js build folder.
gulp.task('geo-clean', (next) => {
    del([ 'temp/topojson/**/*', 'temp/shp/**/*' ], next);
});

var shps = new shapeFile.Collection(),
	shp = shps.models[1];

var urls = shps.map((shp) => {
	return shp.get('url');
});

gulp.task('geo-download', [ 'geo-clean' ], () => {
	return download(urls)
		.pipe(unzip())
		.pipe(gulp.dest('./temp/shp'));
});

var shellTasks = shps.map((shp) => {
	return `topojson -o temp/topojson/${shp.get('name')}.json -p ${shp.getRenameParam()} -q 1e6 -s 1e-8 temp/shp/${shp.get('fileName')}.shp`;
});

gulp.task('geo-convert-to-topojson', /* [ 'geo-download' ], */ shell.task(shellTasks));

var tempFiles = shps.map((shp) => {
	return `./temp/topojson/${shp.get('name')}.json`;
});

gulp.task('geo', [ 'geo-convert-to-topojson' ], () => {
	return gulp.src(tempFiles)
		.pipe(copy('./public/data', { prefix: 2 }));
});