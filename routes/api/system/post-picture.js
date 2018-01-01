var keystone = require('keystone');
const fs = require('fs')
const request = require('request')
const qiniu = require('qiniu')

exports = module.exports = (req, res) => {
	const { body, files } = req

	const onError = (err) => {
		return res.apiResponse({
			success: false,
			message: err
		})
	}

	const onSuccess = (url) => {
		return res.apiResponse({
			success: true,
			date: new Date().getTime(),
			url
		})
	}
	

	const uploadImage = (path, filename) => {
		const accessKey = 'JHBdbDNfabhEGEu2seoVLVQDLctWYzT4SCdpu6hv'
		const secretKey = 'wCX2N2w-uoRoJtsvjhcyDtbRVYmBAVjQp5BY20ya'
		const mac = new qiniu.auth.digest.Mac(accessKey, secretKey)
		const options = {
			scope: 'ubilabs',
			expires: 360
		}
		const putPolicy = new qiniu.rs.PutPolicy(options)
		const uploadToken = putPolicy.uploadToken(mac)
		const config = new qiniu.conf.Config()
		const putExtra = new qiniu.form_up.PutExtra();
		const formUploader = new qiniu.form_up.FormUploader(config)
		formUploader.putFile(uploadToken, filename, path, putExtra, (err, body, info) => {
			if (err) {
				onError(err)
			} else if (info.statusCode === 200) {
				const fileUrl = `http://ozc9gczl1.bkt.clouddn.com/${body.key}`
				onSuccess(fileUrl)
			}
		})
	}

	uploadImage(files.file.path, files.file.name)

	// fs.readFile(files['file'].path, (err, file) => {
	// 	if (err) {
	// 		return onError(err)
	// 	} else {
	// 		uploadPicture(file)
	// 	}
	// })
}
