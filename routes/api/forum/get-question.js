const keystone = require('keystone')
const Question = keystone.list('Question')
const async = require('async')

exports = module.exports = function (req, res) {
	let result = {}
	const { query:urlQuery } = req
	const onSuccess = (question) => {
		return res.apiResponse({
			success: true,
			question
		})
	}

	const onError = (err) => {
		return res.apiResponse({
			success: false,
			message: (err && err.message ? err.message : false) || 'Sorry, there was an issue, please try again.'
		})
	}

	// async.series([
	// 	(next) => {
	// 		if (!urlQuery.id) {
	// 			onError({
	// 				message: `Sorry, 请输入正确的参数.`
	// 			})
	// 			return
	// 		}
	// 		const query = Question.model.findOne().where('_id', urlQuery.id )
	// 		query.exec((err, question) => {
	// 			if (err) {
	// 				next({
	// 					message: `Sorry, 不能找到该id的问题.`
	// 				})
	// 			} else {
	// 				result = {
	// 					"id": question._id,
	// 					"title": question.title,
	// 					"content": question.content,
	// 					"node": question.node,
	// 					"author": question.author
	// 				}
	// 				next()
	// 			}
	// 		})
	// 	},
	// 	(next) => {
	// 		keystone.list('User').model.findOne()	
	// 		.where({ _id: result.author })
	// 		.exec((err, user) => {
	// 			if (err) {
	// 				next(err)
	// 			} else {
	// 				result.author = {
	// 					"id": user.id,
	// 					"email": user.email,
	// 					"name": user.name,
	// 					"description": user.description,
	// 					"avatar": user.avatar
	// 				}
	// 				// delete result['author']
	// 				next()
	// 			}
	// 		}, (err) => {
	// 			next(err)
	// 		})
	// 	},
	// 	(next) => {
	// 		onSuccess(result)
	// 	}
	// ], (err) => {
	// 	if (err) {
	// 		onError(err)
	// 	}
	// })

	if (!urlQuery.id) {
		onError({
			message: `Sorry, 请输入正确的参数.`
		})
	} else {
		const query = Question.model.findOne().where('_id', urlQuery.id).populate([{
			path: 'author',
			selected: 'name email description avatar'
		},{
			path: 'node',
			selected: 'name description'
		}])
		query.exec((err, question) => {
			if (err) {
				onError({
					message: err
				})
			} else {
				onSuccess(question)
			}
		}) 
	}



}
