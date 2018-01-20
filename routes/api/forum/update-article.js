var keystone = require('keystone');
const Article = keystone.list('Article')

exports = module.exports = async function (req, res) {
	const { body } = req

	const onSuccess = () => {
		return res.apiResponse({
			success: true
		})
	}

	const onFail = (err) => {
		return res.apiResponse({
			success: false,
			message: err
		})
	}

	if (!body._id) {
		onFail('请提供参数 _id。')
	} else {
		try {
			const articleModel = await Article.model.findById(body._id).exec()
			if (articleModel.author.toString() !== req.user._id.toString()) {
				return res.apiError(403, '你不是该文章的作者，无权调用该接口。')
			}
			articleModel.title = body.title
			articleModel.content.md = body.content.md
			await articleModel.save()
			onSuccess()
		} catch (err) {
			onFail(err.message || err)
		}
	}
}	
