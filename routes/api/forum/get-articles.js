const keystone = require('keystone')
const Article = keystone.list('Article')
const async = require('async')

exports = module.exports = function (req, res) {
	const results = []
	const onSuccess = (articles) => {
		return res.apiResponse({
			success: true,
			articles
		})
	}

	const onError = (err) => {
		return res.apiResponse({
			success: false,
			message: (err && err.message ? err.message : false) || 'Sorry, there was an issue, please try again.'
		})
	}

	const query = Article.paginate({
		page: req.query.page || 1,
		perPage: 10
	})
		.populate('author', 'name email description avatar')
		.lean()
		.sort('-createdAt')
	query.exec((err, paginate) => {
		if (err) {
			onError({
				message: err
			})
		} else {
			onSuccess(paginate.results)
		}
	})
}
