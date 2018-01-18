const keystone = require('keystone')
const Article = keystone.list('Article')
const Answer = keystone.list('Answer')
const Activity = keystone.list('Activity')
const Project = keystone.list('Project')
const Comment = keystone.list('Comment')
const Follow = keystone.list('Follow')
const Question = keystone.list('Question')

exports = module.exports = async function (req, res) {
	let result = {}
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
			message: (err && err.message ? err.message : false) || 'Sorry, there was an issue, please try again.'
		})
	}

	if (!urlQuery.user_id) {
		onError({
			message: '请提供参数 user_id。'
		})
	} else {
		const id = urlQuery.user_id
		let followingList = await Follow.model.find().where('follower', id).lean().exec()
		followingList = followingList.map(follow => {
			return follow.following
		})
		if (followingList.length) {
			const articleList = await Article.model.find().where('author').in(followingList).limit(3).populate('author', 'name').lean().sort('-createdAt').exec()
			const answerList = await Answer.model.find().where('author').in(followingList).limit(5).populate('author', 'name').populate('question', 'title').lean().sort('-createdAt').exec()
			const activityList = await Activity.model.find().where('author').in(followingList).limit(2).populate('author', 'name').lean().sort('-createdAt').exec()
			const projectList = await Project.model.find().where('leader').in(followingList).limit(2).populate('leader', 'name').lean().sort('-createdAt').exec()
			let commentList = await Comment.model.find().where('author').in(followingList).limit(5).populate('author', 'name').populate('article', 'title').lean().sort('-createdAt').exec()
			const questionList = await Question.model.find().where('author').in(followingList).limit(3).populate('author', 'name').lean().sort('-createdAt').exec()
			articleList.forEach(article => {
				article.rssType = 'article'
			})
			answerList.forEach(answer => {
				answer.rssType = 'answer'
			})
			activityList.forEach(activity => {
				activityList.rssType = 'activity'
			})
			projectList.forEach(project => {
				project.rssType = 'project'
			})
			commentList = commentList.filter(comment => comment.article)
			commentList.forEach(comment => {
				comment.rssType = 'comment'
			})
			questionList.forEach(question => {
				question.rssType = 'question'
			})
			const result = []
				.concat(articleList)
				.concat(answerList)
				.concat(activityList)
				.concat(projectList)
				.concat(commentList)
				.concat(questionList)
				.sort((a, b) => b.createdAt - a.createdAt)
				.slice(0, 5)
			return onSuccess(result)
		}
		onSuccess([])
	}
}
