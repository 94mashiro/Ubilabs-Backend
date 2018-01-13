const keystone = require('keystone')
const Milestone = keystone.list('Milestone')

exports = module.exports = async (req, res) => {
	const { query: urlQuery } = req
	const onSuccess = (result) => {
		return res.apiResponse({
			success: true,
			result
		})
	}

	const onError = (err) => {
		return res.apiResponse({
			success: false,
			message: err
		})
	}
	
	try {
		if (!urlQuery.project_id) {
			throw '请提供参数 project_id。'
		} else {
			const milestone = await Milestone.model.find().where('project', urlQuery.project_id).sort('deadline').lean().exec()
			onSuccess(milestone)
		}
	} catch (err) {
		console.log(err)
		onError(err.message || err)
	}

}
