import fs from 'fs';
import config from './../../config.js';
import AWS from 'aws-sdk';

var secretEnv = process.env;

var lambda = new AWS.Lambda();

/*
 * Class that facilitates creating lambda functions.
 *
 */
class LambdaShipper {

	/*
	 *
	 *
	 */
	constructor(folderName, prefix, awsRegion) {
		this.folderName = folderName;
		this.prefix = prefix;
		this.awsRegion = awsRegion;
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
		fs.readFile(`./services/lambda/dist/${this.folderName}.zip`, (err, data) => {
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
				Timeout: 15,
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


	// /*
	//  *
	//  *
	//  */
	// create() {
	// 	AWS.config.region = this.awsRegion;

	// 	this.getCreateParams((err, params) => {
	// 		if (err) { return console.dir(err); }
	// 		lambda.createFunction(params, (err, data) => {
	// 			if(err) { return console.log(err); }
	// 			console.log('success');
	// 		});
	// 	});
	// }


	// /*
	//  *
	//  *
	//  */
	// update() {
	// 	AWS.config.region = this.awsRegion;

	// 	this.getUpdateParams((err, params) => {
	// 		if (err) { return console.dir(err); }
	// 		lambda.updateFunctionCode(params, (err, data) => {
	// 			if(err) { return console.log(err); }
	// 			console.log('success');
	// 		});
	// 	});
	// }

}

export default LambdaShipper;