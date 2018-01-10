const keystone = require('keystone')
const Article = keystone.list('Article')
const async = require('async')

exports = module.exports = async function (req, res) {
	const { query: urlQuery } = req
	const onSuccess = (result) => {
		return res.apiResponse({
			success: true,
			result
		})
	}

	const onError = (err) => {
		return res.apiResponse({
			success: false,
			message: err
		})
	}

	try {
		if (urlQuery.user_id) {
			const results = await Article.model.find().where('author', urlQuery.user_id).populate('author', 'name email description avatar').lean().sort('-createdAt').exec()
			onSuccess(results)
		} else {
			const query = Article.paginate({
				page: urlQuery.page || 1,
				perPage: 10
			})
				.populate('author', 'name email description avatar')
				.sort('-createdAt')
				.lean()
			query.exec((err, paginate) => {
				if (err) {
					throw err
				} else {
					onSuccess(paginate.results)
				}
			})
		}
	} catch (err) {
		onError(err.message)
	}
}
