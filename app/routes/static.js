import express from 'express';
import AWS from 'aws-sdk';

var router = express.Router();

router.get('/list', (req, res) => {
	var s3 = new AWS.S3();
	s3.listObjects({ Bucket: 'static.atlas.newamerica.org' }, (err, data) => {
		if (err) {
			console.log(err);
			return res.json([]);
		}
		res.json(data);
	});
});

var getImageRequest = (req) => {

	var key = req.params.file_name.replace(/--/g, '/');
	

};

router.get('/images/:file_name', (req, res) => {

	console.log(req.query);

	var s3 = new AWS.S3(),
		key = req.params.file_name.replace(/--/g, '/'),
		params = { Bucket: 'static.atlas.newamerica.org', Key: key };
	s3.getObject(params).createReadStream().pipe(res);

	// replace with AWS Lambda to handle file pre-processing steps such as image resizing.

});



export default router;