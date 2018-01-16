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
			message: err.message || err
		})
	}

	if (urlQuery.node_id) {
		query = Question
			.paginate({
				page: req.query.page || 1,
				perPage: 5,
				filters: {
					node: urlQuery.node_id
				}
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
			.lean()
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
			.lean()
			.sort('-createdAt')
	}

	try {
		query.exec(async (err, paginate) => {
			console.log(paginate.total)
			if (err) {
				throw err
			} else {
				if (paginate.total > 0) {
					for (let question of paginate.results) {
						console.log(question)
						question.url = `/forum/question/${question._id}`
					}
				}
				onSuccess(paginate)
			}
		})
	} catch (err) {
		onError(err.message || err)
	}

	// query.exec((err, paginate) => {
	// 	if (err) {
	// 		onError(err)
	// 	} else {
	// 		results = paginate.results
	// 		let counter = 0;
	// 		const forPromise = () => {
	// 			return new Promise((resolve, reject) => {
	// 				if (results.length !== 0) {
	// 					for (i in results) {
	// 						Answer.model.find().where('question', results[i]).exec((err, ans) => {
	// 							counter++
	// 							if (err) {
	// 								reject(err)
	// 							} else {
	// 								results[i]._doc.answers = ans.length
	// 								results[i]._doc.url = `/forum/question/${results[i]._id}`
	// 							}
	// 							if (counter === results.length) {
	// 								resolve(results)
	// 							}
	// 						})
	// 					}
	// 				} else {
	// 					resolve(results)
	// 				}
	// 			})
	// 		}
	// 		forPromise().then((results) => {
	// 			onSuccess(results)
	// 		}).catch((err) => {
	// 			onError(err)
	// 		})
	// 	}
	// })

}
