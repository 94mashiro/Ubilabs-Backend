const keystone = require('keystone')
const User = keystone.list('User')
const async = require('async')


exports = module.exports = async function (req, res) {
	const onSuccess = (result) => {
		return res.apiResponse({
			success: true,
			result
		})
	}

	const onError = (err) => {
		return res.apiResponse({
			message: err,
			success: false,
		})
	}

	const { query: urlQuery } = req
	if (urlQuery.email === '') {
		onError('请提供参数email。')
	} else {
		try {
			const user = await User.model.findOne().where('email', urlQuery.email).lean().exec()
			if (user) {
				onSuccess({
					"_id": user._id,
					"name": user.name,
					"email": user.email,
					"gitlabId": user.gitlabId,
					"avatar": user.avatar,
					"description": user.description
				})
			} else {
				onError('查询不到该用户，请核对是否输入正确。')
			}
		} catch (err) {
			onError(err)
		}
	}
}
