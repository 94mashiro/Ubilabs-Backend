const keystone = require('keystone')
const User = keystone.list('User')
const Project = keystone.list('Project')
const Question = keystone.list('Question')
const Article = keystone.list('Article')
const async = require('async')


exports = module.exports = async function (req, res) {
	const onSuccess = (result) => {
		return res.apiResponse({
			success: true,
			result
		})
	}

	const onError = (err) => {
		return res.apiResponse({
			message: err,
			success: false,
		})
	}

	const { query: urlQuery } = req
	if (!urlQuery.email && !urlQuery.user_id) {
		onError('请提供参数email 或 user_id。')
	} else {
		try {
			const user = await User.model.findOne().or([{'email': urlQuery.email}, {'_id': urlQuery.user_id}]).lean().exec()
			if (user) {
				const projects = await Project.model.find().where('leader', user._id).exec()
				const questions = await Question.model.find().where('author', user._id).exec()
				const articles = await Article.model.find().where('author', user._id).exec()
				onSuccess({
					"_id": user._id,
					"name": user.name,
					"email": user.email,
					"gitlabId": user.gitlabId,
					"avatar": user.avatar,
					"description": user.description,
					"projectCount": projects.length,
					"questionCount": questions.length,
					"articleCount": articles.length
				})
			} else {
				onError('查询不到该用户，请核对是否输入正确。')
			}
		} catch (err) {
			console.log(err)
			onError(err)
		}
	}
}
