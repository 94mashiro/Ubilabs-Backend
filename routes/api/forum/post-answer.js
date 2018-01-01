var keystone = require('keystone');
const Answer = keystone.list('Answer')

exports = module.exports = (req, res) => {
	const { body } = req

	const onError = (err) => {
		return res.apiResponse({
			success: false,
			message: err
		})
	}

	const onSuccess = (answer) => {
		return res.apiResponse({
			success: true,
			date: new Date().getTime(),
			answerId: answer._id
		})
	}

	const answer = Answer.model({
		...body,
		author: req.user.id
	})

	answer.save((err, answer) => {
		if (err) {
			onError(err)
		} else {
			onSuccess(answer)
		}
	})
}
