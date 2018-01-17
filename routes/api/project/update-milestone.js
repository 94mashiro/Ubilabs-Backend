var keystone = require('keystone');
const Milestone = keystone.list('Milestone')

exports = module.exports = (req, res) => {
	const { body } = req

	const onSuccess = () => {
		return res.apiResponse({
			success: true
		})
	}

	const onFail = (err) => {
		return res.apiResponse({
			success: false,
			message: err
		})
	}

	try {
		Milestone.model.findOne().where('_id', body._id).exec((err, milestone) => {
			if (err) {
				throw err
			} else {
				for (let key in body) {
					milestone[key] = body[key]
				}
				milestone.save((err, project) => {
					if (err) {
						throw err
					} else {
						onSuccess()
					}
				})
			}
		})
	} catch (err) {
		onFail(err.message || err)
	}
}
