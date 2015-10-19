import express from 'express';
import AWS from 'aws-sdk';

var router = express.Router();

router.get('/list', (req, res) => {

	var lambda = new AWS.Lambda();

	lambda.listFunctions((err, data) => {
		if (err) { console.log(err); return res.json([]); }
		res.json(data);
	});

});


router.get('/test', (req, res) => {

	var lambda = new AWS.Lambda();

	lambda.invoke({ FunctionName: 'ImageResizer', InvocationType: 'RequestResponse' }, (err, data) => {
		if (err) { console.log(err); return res.json([]); }
		res.json(data);
	});

});

export default router;