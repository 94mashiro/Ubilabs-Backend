var keystone = require('keystone');
const ProjectNote = keystone.list('ProjectNote')
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
		if (!query.note_id) {
			throw '请填写参数 note_id'
		} else {
			const noteModel = await ProjectNote.model.findById(query.note_id).exec()
			const projectModel = await Project.model.findById(noteModel.project).exec()
			if (req.user._id != projectModel.leader.toString()) {
				return res.apiError(403, '你不是该项目的负责人，无权调用该接口。')
			} else {
				await noteModel.remove()
				onSuccess()
			}
		}
	} catch (err) {
		onFail(err.message || err)
	}
}
