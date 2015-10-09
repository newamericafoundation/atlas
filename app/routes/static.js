import express from 'express';
import AWS from 'aws-sdk';

var router = express.Router();

router.get('/:file_url', (req, res) => {

	var s3 = new AWS.S3(),
		params = { Bucket: 'static.atlas.newamerica.org', Key: req.params.file_url };
	s3.getObject(params).createReadStream().pipe(res);

	// replace with AWS Lambda to handle file pre-processing steps such as image resizing.

});

export default router;