var keystone = require('keystone');
const Milestone = keystone.list('Milestone')

exports = module.exports = async (req, res) => {
	const { body } = req

	const onError = (err) => {
		return res.apiResponse({
			success: false,
			message: err
		})
	}

	const onSuccess = () => {
		return res.apiResponse({
			success: true,
			date: new Date().getTime()
		})
	}

	try {
		if (!body.project || !body.name || !body.description || !body.deadline) {
			throw '请提供参数 project、name、description、deadline。'
		} else {
			const milestone = Milestone.model({
				...body
			})
			await milestone.save()
			onSuccess()
		}
	} catch (err) {
		console.log(err)
		onError(JSON.stringify(err))
	}
}
