var keystone = require('keystone');
const User = keystone.list('User')


exports = module.exports = (req, res) => {
	const { body } = req
	const onSuccess = (user) => {
		return res.apiResponse({
			success: true,
			date: new Date().getTime(),
			id: user.id
		})
	}
	const onFail = (err) => {
		return res.apiResponse({
			success: false,
			message: (err && err.message ? err.message : false) || 'Sorry, there was an issue signing you in, please try again.'
		})
	}
	keystone.session.signin({email: body.email, password: body.password}, req, res, onSuccess, onFail)
}
