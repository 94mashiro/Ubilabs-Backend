const keystone = require('keystone')
const Node = keystone.list('Node')

exports = module.exports = function (req, res) {
	const onSuccess = (nodes) => {
		return res.apiResponse({
			success: true,
			nodes
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
