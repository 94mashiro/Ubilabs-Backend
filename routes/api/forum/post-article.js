var keystone = require('keystone');
const Article = keystone.list('Article')

exports = module.exports = (req, res) => {
	const { body } = req

	const onError = (err) => {
		return res.apiResponse({
			success: false,
			message: err
		})
	}

	const onSuccess = (article) => {
		return res.apiResponse({
			success: true,
			date: new Date().getTime(),
			articleId: article._id
		})
	}

	const article = Article.model({
		...body,
		author: req.user.id
	})

	article.save((err, article) => {
		if (err) {
			onError(err)
		} else {
			onSuccess(article)
		}
	})
}
