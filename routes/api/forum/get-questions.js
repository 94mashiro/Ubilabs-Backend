const keystone = require('keystone')
const Question = keystone.list('Question')
const Answer = keystone.list('Answer')
const async = require('async')

exports = module.exports = function (req, res) {
	let results = []
	const { query: urlQuery } = req
	let query
	const onSuccess = (questions) => {
		return res.apiResponse({
			success: true,
			questions
		})
	}

	const onError = (err) => {
		return res.apiResponse({
			success: false,
			message: (err && err.message ? err.message : false) || 'Sorry, there was an issue, please try again.'
		})
	}

	if (urlQuery.node_id) {
		query = Question
			.paginate({
				page: req.query.page || 1,
				perPage: 5
			})
			.where('node', urlQuery.node_id)
			.populate([
				{
					path: 'author',
					selected: 'name email description avatar'
				},
				{
					path: 'node',
					selected: 'name description'
				}
			])
			.sort('-createdAt')
	} else {
		query = Question
			.paginate({
				page: req.query.page || 1,
				perPage: 5
			})
			.populate([
				{
					path: 'author',
					select: 'name email description avatar _id'
				},
				{
					path: 'node',
					select: 'name description _id'
				}
			])
			.sort('-createdAt')
	}

	query.exec((err, paginate) => {
		if (err) {
			onError({
				message: `Sorry, there was an error processing your information, please try again.`
			})
		} else {
			results = paginate.results
			let counter = 0;
			const forPromise = () => {
				return new Promise((resolve, reject) => {
					if (results.length !== 0) {
						for (i in results) {
							Answer.model.find().where('question', results[i]).exec((err, ans) => {
								counter++
								if (err) {
									reject(err)
								} else {
									results[i]._doc.answers = ans.length
									results[i]._doc.url = `/forum/question/${results[i]._id}`
								}
								if (counter === results.length) {
									resolve(results)
								}
							})
						}
					} else {
						resolve(results)
					}
				})
			}
			forPromise().then((results) => {
				onSuccess(results)
			}).catch((err) => {
				onError(err)
			})
		}
	})

}
