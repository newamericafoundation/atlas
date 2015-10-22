import gulp from 'gulp';
import zip from 'gulp-zip';
import AWS from 'aws-sdk';
import copy from 'gulp-copy';
import install from 'gulp-install';
import fs from 'fs';

import LambdaShipper from './shipper.js';

AWS.config.region = 'us-east-1';

var lambda = new AWS.Lambda();

var folderName = 'hello_lambda_rds';
var secretEnvPath = '../secrets/rds_connect.json';
var lambdaShipper = new LambdaShipper(folderName, 'Atlas', 'us-east-1');


// Copy code to distribution folder.
gulp.task('lbd-copy', () => {
	return gulp.src(`./services/lambda/src/${folderName}/**/*`)
		.pipe(copy(`./services/lambda/dist/${folderName}`, { prefix: 4 }));
});

gulp.task('lbd-copy-secret', () => {
	return gulp.src(secretEnvPath)
		.pipe(copy(`./services/lambda/dist/${folderName}`, { prefix: 4 }))
});

gulp.task('lbd-install', [ 'lbd-copy', 'lbd-copy-secret' ], () => {
	return gulp.src(`./services/lambda/dist/${folderName}/package.json`)
		.pipe(install())
});


// Zip code.
gulp.task('lbd-zip', [ 'lbd-copy' ], () => {
	return gulp.src(`./services/lambda/dist/${folderName}/**/*`)
		.pipe(zip(`${folderName}.zip`))
		.pipe(gulp.dest(`./services/lambda/dist`));
});


// Ship to Lambda
gulp.task('lbd-create', [ 'lbd-zip' ], () => {

	lambdaShipper.getCreateParams((err, params) => {
		if (err) { return console.dir(err); }
		lambda.createFunction(params, (err, data) => {
			if(err) { return console.log(err); }
			console.log('success');
		});
	});

});

// Update on Lambda
gulp.task('lbd-update', [ 'lbd-zip' ], () => {

	lambdaShipper.getUpdateParams((err, params) => {
		if (err) { return console.dir(err); }
		lambda.updateFunctionCode(params, (err, data) => {
			if(err) { return console.log(err); }
			console.log('success');
		});
	});

});

