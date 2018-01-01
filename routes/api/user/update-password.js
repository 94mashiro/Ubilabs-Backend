var keystone = require('keystone');
const User = keystone.list('User')

exports = module.exports = function (req, res) {
	const { body } = req
	const onSuccess = (user, newPassword) => {
		user.password = newPassword
		user.save((err) => {
			if (err) {
				onFail(err)
			} else {
				return res.apiResponse({
					success: true
				})
			}
		})
	}

	const onFail = (err) => {
		return res.apiResponse({
			success: false,
			message: err
		})
	}

	User.model.findOne({ email: body.email }).exec((err, user) => {
		if (user) {
			user._.password.compare(body.oldPassword, (err, isMatch) => {
				if (!err && isMatch) {
					onSuccess(user, body.newPassword)
				} else {
					onFail(err || '旧密码输入错误，请检查后重试。')
				}
			})
		} else {
			onFail(err)
		}
	})
}	
