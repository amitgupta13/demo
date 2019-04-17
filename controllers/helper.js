const AWS = require('aws-sdk');

module.exports = {
	s3upload:s3upload
};

/*

upload image to s3 helper function
Author-Amit Gupta

*/
function s3upload(data) {

return new Promise(function (resolve, reject) {
		
	// make confige data.
	AWS.config.update({
	accessKeyId: 'AKIAJUBKB73X3DQPQ44A',
	secretAccessKey: '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'
	});
	// get instance of S3.
	const s3 = new AWS.S3();
	// set params data.
	const params = {
	// bucket name.
	Bucket: 'test',
	// image name
	Key: data.key,
	// image data (buffer of image).
	Body: data.body,
	// Public read
	ACL: 'public-read'
	};
	// define response data
	let responseData = {};
	
	s3.putObject(params, function (error, response) {
	if (error) {
	reject(error);
	} else {
	let params = this.request.params;
	let region = this.request.httpRequest.region;
	let bucket_path = 's3://' + params.Bucket + '/' + params.Key;
	let image_path = 'https://s3-' + region + '.amazonaws.com/' + params.Bucket + '/' + params.Key;
	// bucket path.
	responseData.bucket_path = bucket_path;
	// image path
	responseData.image_path = image_path;
	// return response data.
	resolve(image_path);
	}
	});
})
}