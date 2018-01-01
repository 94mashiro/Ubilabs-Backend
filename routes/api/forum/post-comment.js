var keystone = require('keystone');
const Comment = keystone.list('Comment')

exports = module.exports = (req, res) => {
	const { body } = req

	const onError = (err) => {
		return res.apiResponse({
			success: false,
			message: err
		})
	}

	const onSuccess = (comment) => {
		return res.apiResponse({
			success: true,
			date: new Date().getTime(),
			commentId: comment._id
		})
	}

	const comment = Comment.model({
		...body,
		author: req.user.id
	})

	comment.save((err, comment) => {
		if (err) {
			onError(err)
		} else {
			onSuccess(comment)
		}
	})
}
