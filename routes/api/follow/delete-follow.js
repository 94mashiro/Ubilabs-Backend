var keystone = require('keystone');
const Follow = keystone.list('Follow')

exports = module.exports = async (req, res) => {
	const { query } = req

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
		if (!query.user_id) {
			throw '请填写参数 user_id'
		} else {
			const followModel = Follow.model.find({ follower: req.user._id, following: query.user_id })
			if (!followModel) {
				throw '你没有关注该用户。'
			} else {
				await followModel.remove()
				onSuccess()
			}
		}
	} catch (err) {
		onFail(err.message || err)
	}
}
