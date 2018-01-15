var keystone = require('keystone');
const Milestone = keystone.list('Milestone')
const Project = keystone.list('Project')

exports = module.exports = async (req, res) => {
	const { query } = req

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

	try {
		if (!query.milestone_id) {
			throw '请填写参数 milestone_id。'
		} else {
			const milestoneModel = await Milestone.model.findById(query.milestone_id).exec()
			const projectModel = await Project.model.findById(milestoneModel.project).exec()
			console.log(req.user._id, projectModel.leader)
			if (req.user._id != projectModel.leader.toString()) {
				return res.apiError(403, '你不是该项目的负责人，无权调用该接口。')
			} else {
				await milestoneModel.remove()
				onSuccess()
			}
		}
	} catch (err) {
		onFail(err.message || err)
	}
}
