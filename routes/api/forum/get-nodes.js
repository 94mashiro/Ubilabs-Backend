const keystone = require('keystone')
const Node = keystone.list('Node')

exports = module.exports = function (req, res) {
	const onSuccess = (result) => {
		return res.apiResponse({
			success: true,
			result
		})
	}

	const onError = (err) => {
		console.log(err)
		return res.apiResponse({
			success: false,
			message: err
		})
	}
	Node.model.find().exec((err, nodes) => {
		if (err) {
			onError(err)
		} else {
			onSuccess(nodes)
		}
	})
}
