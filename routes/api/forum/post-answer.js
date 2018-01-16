var keystone = require('keystone');
const Answer = keystone.list('Answer')
const Question = keystone.list('Question')

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

	answer.save(async (err, answer) => {
		if (err) {
			onError(err)
		} else {
			const questionModel = await Question.model.findOne().where('_id', body.question).exec()
			questionModel.answer.push(answer)
			await questionModel.save()
			onSuccess(answer)
		}
	})
}
