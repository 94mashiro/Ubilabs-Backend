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

	const queryArticlesByUserId = async (userId, paginate) => {
		try {
			if (paginate) {
				const query = Article.paginate({
					page: urlQuery.page || 1,
					perPage: 10
				}).where('author', userId)
					.populate('author', 'name email description avatar')
					.lean()
					.sort('-createdAt')
					.exec((err, paginate) => {
						if (err) {
							throw err
						} else {
							onSuccess(paginate)
						}
					})
			} else {
				const results = await Article
					.model
					.find()
					.where('author', userId)
					.populate('author', 'name email description avatar')
					.lean()
					.sort('-createdAt')
					.exec()
				onSuccess(results)
			}
		} catch (err) {
			onError(err.message || err)
		}
	}

	const queryArticles = () => {
		try {
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
					onSuccess(paginate)
				}
			})
		} catch (err) {
			onError(err.message || err)
		}
	}

	if (urlQuery.user_id) {
		queryArticlesByUserId(urlQuery.user_id, urlQuery.paginate)
	} else {
		queryArticles()
	}


}
