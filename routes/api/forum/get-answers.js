const keystone = require('keystone')
const Answer = keystone.list('Answer')
const Comment = keystone.list('Comment')
const async = require('async')

exports = module.exports = function (req, res) {
	let results = []
	const { query: urlQuery } = req
	const onSuccess = (results) => {
		return res.apiResponse({
			success: true,
			answers: results
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
		const query = Answer.model.find().lean().where('question', urlQuery.id).populate('author', 'name email description avatar')
		query.exec((err, answers) => {
			if (err) {
				onError({
					message: err
				})
			} else {
				let counter = 0;
				const forPromise = () => {
					return new Promise((resolve, reject) => {
						if (answers.length === 0) {
							resolve(answers)
						} else {
							for (let idx in answers) {
								Comment.model.find().where('answer', answers[idx]._id).exec((err, comments) => {
									if (err) {
										console.log('err')
										reject(err)
									} else {
										answers[idx]['comments'] = comments.length
										counter++
										if (counter === answers.length) {
											resolve(answers)
										}
									}
								})
							}
						}
					})
				}
				forPromise().then(answers => {
					onSuccess(answers)
				}).catch(err => {
					console.log(err)
					onError(err)
				})
			}
		})
	}
}
