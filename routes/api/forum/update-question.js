var keystone = require('keystone');
const Question = keystone.list('Question')

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
			const questionModel = await Question.model.findById(body._id).exec()
			if (questionModel.author.toString() !== req.user._id.toString()) {
				return res.apiError(403, '你不是该问题的作者，无权调用该接口。')
			}
			questionModel.title = body.title
			questionModel.content.md = body.content.md
			questionModel.node = body.node
			await questionModel.save()
			onSuccess()
		} catch (err) {
			onFail(err.message || err)
		}
	}
}	
