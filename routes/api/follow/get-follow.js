const keystone = require('keystone')
const Follow = keystone.list('Follow')

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

	const queryByFollowingId = async (id) => { //查询此用户的关注者
		try {
			const result = await Follow.model.find()
				.where('following', id)
				.populate('follower', 'name email description avatar')
				.lean()
				.sort('-createdAt')
				.exec()
			onSuccess(result)
		} catch (err) {
			console.log(err)
			onError(err.message || err)
		}
	}

	const queryByFollowerId = async (id) => { //查询此用户关注了谁
		try {
			const result = await Follow.model.find()
				.where('follower', id)
				.populate('following', 'name email description avatar')
				.lean()
				.sort('-createdAt')
				.exec()
			onSuccess(result)
		} catch (err) {
			console.log(err)
			onError(err.message || err)
		}
	}
	
	try {
		if ((!urlQuery.following_id && !urlQuery.follower_id) || (urlQuery.follower_id && urlQuery.following_id)) {
			throw '请提供参数 following_id 或 follower_id。'
		} else {
			if (urlQuery.following_id) {
				queryByFollowingId(urlQuery.following_id)
			} else {
				queryByFollowerId(urlQuery.follower_id)
			}
		}
	} catch (err) {
		console.log(err)
		onError(err.message || err)
	}

}
