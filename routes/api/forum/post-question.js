var keystone = require('keystone');
const Question = keystone.list('Question')

exports = module.exports = (req, res) => {
	const { body } = req

	const onError = (err) => {
		return res.apiResponse({
			success: false,
			message: err
		})
	}

	const onSuccess = (question) => {
		return res.apiResponse({
			success: true,
			date: new Date().getTime(),
			questionId: question._id
		})
	}

	const question = Question.model({
		...body,
		author: req.user.id
	})

	question.save((err, question) => {
		if (err) {
			onError(err)
		} else {
			onSuccess(question)
		}
	})
}
