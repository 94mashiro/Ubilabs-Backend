var keystone = require('keystone');
const Project = keystone.list('Project')
const Question = keystone.list('Question')
const Article = keystone.list('Article')

exports = module.exports = async function (req, res) {
	try {
		const userData = req.user._doc
		delete userData['password']
		const leaderProjects = await Project.model.find().where('leader', req.user._id).exec()
		const joinProjects = await Project.model.find().where('member').in([req.user._id]).exec()
		const questions = await Question.model.find().where('author', req.user._id).exec()
		const articles = await Article.model.find().where('author', req.user._id).exec()
		userData.projectCount = leaderProjects.length + joinProjects.length
		userData.questionCount = questions.length
		userData.articleCount = articles.length
		return res.apiResponse(userData)
	} catch (err) {
		console.error(err)
	}
}	
