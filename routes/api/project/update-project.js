var keystone = require('keystone');
const Project = keystone.list('Project')

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
		Project.model.findOne().where('_id', body._id).exec((err, project) => {
			console.log(project)
			if (err) {
				throw err
			} else {
				for (let key in body) {
					project[key] = body[key]
				}
				project.save((err, project) => {
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
