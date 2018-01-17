var keystone = require('keystone');
const Follow = keystone.list('Follow')

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
		if (!body.followId) {
			throw '请提供参数 followId。'
		} else {
			const follow = Follow.model({
				follower: req.user._id,
				following: body.followId
			})
			await follow.save()
			onSuccess()
		}
	} catch (err) {
		onError(JSON.stringify(err))
	}
}
