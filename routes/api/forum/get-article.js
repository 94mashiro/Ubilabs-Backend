const keystone = require('keystone')
const Article = keystone.list('Article')
const async = require('async')

exports = module.exports = function (req, res) {
	let result = {}
	const { query: urlQuery } = req
	const onSuccess = (article) => {
		return res.apiResponse({
			success: true,
			article
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
			message: '请提供参数id。'
		})
	} else {
		const query = Article.model.findOne().where('_id', urlQuery.id).populate('author', 'name email description avatar').lean()
		query.exec()
			.then(article => {
				onSuccess(article)
			}).catch(err => {
				onError({
					message: err
				})
			})
	}
}
