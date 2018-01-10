var keystone = require('keystone');
const ProjectNote = keystone.list('ProjectNote')

exports = module.exports = async (req, res) => {
	const { body } = req

	const onError = (err) => {
		return res.apiResponse({
			success: false,
			message: err
		})
	}

	const onSuccess = () => {
		return res.apiResponse({
			success: true,
			date: new Date().getTime()
		})
	}

	try {
		if (!body.projectId || !body.articleId) {
			throw '请提供参数 projectId、articleId。'
		} else {
			let projectNote = await ProjectNote.model.findOne().where('article', body.articleId).exec()
			if (projectNote) {
				throw '该文章已经被其他项目绑定，请尝试绑定其他文章。'
			} else {
				projectNote = ProjectNote.model({
					project: body.projectId,
					article: body.articleId,
					author: req.user._id
				})
				await projectNote.save()
				onSuccess()
			}
		}
	} catch (err) {
		console.log(err)
		onError(JSON.stringify(err))
	}
}
