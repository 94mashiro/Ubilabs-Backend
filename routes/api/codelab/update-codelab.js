var keystone = require('keystone');
const Codelab = keystone.list('Codelab')

exports = module.exports = async (req, res) => {

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

	try {
		if (!req.body._id) {
			throw '请提供参数 _id。'
		} else {
			const { body, files } = req
			const { file } = files
			const { title, node, id } = body
			console.log(files, body)
			var item = await Codelab.model.findById(body._id).exec()
			if (item.author.toString() !== req.user._id.toString()) {
				return res.apiError(403, '你不是该Codelab的作者，无权使用该接口。')
			} else {
				item.getUpdateHandler(req, res).process(body, { fields: 'title, author, node, file', file: req.files.file }, (err) => {
					if (err) {
						throw err
					} else {
						console.log(item)
						onSuccess(item)
					}
				})
			}
		}
	} catch (err) {
		onError(err.message || err)
	}

}
