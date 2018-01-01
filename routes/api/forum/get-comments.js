const keystone = require('keystone')
const Comment = keystone.list('Comment')
const async = require('async')

exports = module.exports = function (req, res) {
	const { query: urlQuery } = req
	const onSuccess = (results) => {
		return res.apiResponse({
			success: true,
			comments: results
		})
	}

	const onError = (err) => {
		return res.apiResponse({
			success: false,
			message: (err && err.message ? err.message : false) || 'Sorry, there was an issue, please try again.'
		})
	}

	if (!urlQuery.id) {
		onError({
			message: '请输入正确的参数。'
		})
	} else {
		const query = Comment.model.find().or([{ 'answer': urlQuery.id }, { 'article': urlQuery.id }, { 'activity': urlQuery.id }]).populate('author', 'name email description avatar')
		query.exec((err, comments) => {
			if (err) {
				onError({
					message: err
				})
			} else {
				onSuccess(comments)
			}
		})
	}
}
