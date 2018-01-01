var keystone = require('keystone');

exports = module.exports = function (req, res) {
	const userData = {}
	for (key in req.user._doc) {
		if (key !== 'password') {
			userData[key] = req.user._doc[key]
		}
	}
	return res.apiResponse(userData)
}	
