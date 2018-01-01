var keystone = require('keystone');

exports = module.exports = (req, res) => {
	const onSuccess = () => {
		res.apiResponse({
			success: true,
			date: new Date().getTime()
		})
	}
	const onFail = (err) => {
		res.apiResponse({
			success: false,
			message: (err && err.message ? err.message : false) || 'Sorry, there was an issue signing you out, please try again.'
		})
	}
	keystone.session.signout(req, res, onSuccess, onFail)
}
