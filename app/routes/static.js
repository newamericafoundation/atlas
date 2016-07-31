// Router handling static file management to and from the AWS S3 bucket.
// NOT YET FUNCTIONAL.
// TODO: finisha and test.

import express from 'express'
import AWS from 'aws-sdk'

var router = express.Router()

router.get('/list', (req, res) => {
	var s3 = new AWS.S3();
	s3.listObjects({ Bucket: 'static.atlas.newamerica.org' }, (err, data) => {
		if (err) {
			console.log(err)
			return res.json([])
		}
		res.json(data)
	})
})

var getImageRequest = (req) => {
	var key = req.params.file_name.replace(/--/g, '/')
}

router.get('/images/:file_name', (req, res) => {

	var s3 = new AWS.S3()
	var key = 'images/' + req.params.file_name.replace(/--/g, '/')
	var params = { Bucket: 'static.atlas.newamerica.org', Key: key }

	s3.getObject(params).createReadStream().pipe(res)

	// replace with AWS Lambda to handle file pre-processing steps such as image resizing.

})


router.post('/upload', (req, res) => {

	var s3 = new AWS.S3(),
	var params = {
		Bucket: 'static.atlas.newamerica.org',
		Key: 'uploads/' + req.body.Key,
		ContentType: req.body.ContentType,
		Body: req.body.Body
	}

	s3.upload(params, (err, data) => {
		if (err) { console.log('upload error'); return res.json({ message: 'error' }); }
		return res.json({ message: 'success' });
	})

})



export default router