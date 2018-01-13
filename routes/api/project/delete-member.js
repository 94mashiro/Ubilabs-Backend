var keystone = require('keystone');
const Project = keystone.list('Project')
const User = keystone.list('User')
const fetch = require('node-fetch')

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

	const revokeMemberInGit = (projectModel, memberModel, leaderModel) => {
		const { gitId } = projectModel
		const { gitlabId } = memberModel
		const { gitlabToken } = leaderModel
		const options = {
			method: 'DELETE',
			headers: {
				'PRIVATE-TOKEN': gitlabToken
			}
		}
		return fetch(`${process.env.GITLAB_API_HOST}/projects/${gitId}/members/${gitlabId}`, options)
			.then(res => {
				return res.text()
			})
			.catch(err => {
				throw err
			})
	}

	try {
		if (!query.memberId || !query.projectId) {
			throw '请填写参数 memberId、projectId。'
		} else {
			const projectModel = await Project.model.findOne().where('_id', query.projectId).exec()
			if (projectModel.leader.toString() != req.user._id) {
				return res.apiError(403, '你不是该项目的负责人，无权使用该接口。')
			} else {
				const memberModel = await User.model.findOne().where('_id', query.memberId).exec()
				const leaderModel = await User.model.findOne().where('_id', req.user._id).exec()
				console.log(projectModel.member)
				projectModel.member.splice(projectModel.member.indexOf(query.memberId), 1)
				console.log(projectModel.member)
				const body = await revokeMemberInGit(projectModel, memberModel, leaderModel)
				projectModel.save((err, project) => {
					if (err) {
						throw err
					} else {
						onSuccess()
					}
				})
			}
		}
	} catch (err) {
		onFail(err.message || err)
	}
}
