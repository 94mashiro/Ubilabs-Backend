var keystone = require('keystone');
const Codelab = keystone.list('Codelab')

exports = module.exports = (req, res) => {
	const { body, files } = req

	const { file } = files
	const { title, node } = body

	var item = new Codelab.model()

	item.getUpdateHandler(req).process(body, { file: req.files.file, author: req.user._id }, (err) => {
		if (err) {
			onError(err)
		} else {
			onSuccess(item)
		}
	})

	const onError = (err) => {
		return res.apiResponse({
			success: false,
			message: err
		})
	}

	const onSuccess = (codelab) => {
		return res.apiResponse({
			success: true,
			date: new Date().getTime(),
			codelabId: codelab._id
		})
	}
}
