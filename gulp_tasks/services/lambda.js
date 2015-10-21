import gulp from 'gulp';
import zip from 'gulp-zip';
import AWS from 'aws-sdk';
import copy from 'gulp-copy';
import install from 'gulp-install';
import fs from 'fs';

import config from './../config.js';

AWS.config.region = 'us-west-2';

var lambda = new AWS.Lambda();
var secretEnv = config.getLocalSecretEnv();

/*
 * Class that facilitates creating lambda functions.
 *
 */
class LambdaShipper {

	/*
	 *
	 *
	 */
	constructor(folderName, prefix) {
		this.folderName = folderName;
		this.prefix = prefix;
	}


	/*
	 *
	 *
	 */
	getFunctionName() {
		return 'Atlas' + this.folderName.split('_').map((fragment) => { return fragment.slice(0, 1).toUpperCase() + fragment.slice(1); }).join('');
	}


	/*
	 *
	 *
	 */
	readZipFile(next) {
		fs.readFile(`./services/lambda/dist/${folderName}.zip`, (err, data) => {
			if (err) { return next(err, null); }
			next(null, data);
		});
	}


	/*
	 *
	 *
	 */
	getCreateParams(next) {
		this.readZipFile((err, data) => {
			if (err) { return next(err, null); }
			next(null, {
				FunctionName: this.getFunctionName(),
				Handler: 'index.handler',
				Role: secretEnv['AWS_LAMBDA_BASIC_ROLE'],
				Runtime: 'nodejs',
				Code: {
					ZipFile: data
				}
			});
		});
	}


	/*
	 *
	 *
	 */
	getUpdateParams(next) {
		this.readZipFile((err, data) => {
			if (err) { return next(err, null); }
			return next(null, {
				FunctionName: this.getFunctionName(),
				ZipFile: data
			});
		});
	}

}

var folderName = 'hello_lambda_s3';
var lambdaShipper = new LambdaShipper(folderName, 'Atlas');



// Copy code to distribution folder.
gulp.task('lbd-copy', () => {
	return gulp.src(`./services/lambda/src/${folderName}/**/*`)
		.pipe(copy(`./services/lambda/dist/${folderName}`, { prefix: 4 }));
});


gulp.task('lbd-install', [ 'lbd-copy' ], () => {
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

