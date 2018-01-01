var keystone = require('keystone');
const User = keystone.list('User')

exports = module.exports = function (req, res) {
	const { body } = req

	const onSuccess = (user) => {
		return res.apiResponse({
			success: true,
			user
		})
	}

	const onFail = (err) => {
		return res.apiResponse({
			success: false,
			message: err
		})
	}

	User.model.findOne({ _id: body._id }).exec((err, user) => {
		if (user) {
			for (let key in body) {
				user[key] = body[key]
			}
			user.save((err, user) => {
				if (err) {
					onFail(err)
				} else {
					onSuccess(user)
				}
			})
		} else {
			onFail(err)
		}
	})
}	
