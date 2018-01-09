var keystone = require('keystone');
const fetch = require('node-fetch')
const Project = keystone.list('Project')
const User = keystone.list('User')

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

	const addMemberToGitProject = (projectModel, memberModel, leaderGitToken) => {
		const options = {
			method: 'POST',
			headers: {
				'PRIVATE-TOKEN': leaderGitToken,
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				"user_id": memberModel.gitlabId,
				"access_level": 30
			})
		}
		return fetch(`${process.env.GITLAB_API_HOST}/projects/${projectModel.gitId}/members`, options).then(res => {
			return res.json()
		}).then(body => {
			if (body.message) {
				throw body.message
			} else {
				return body
			}
		}).catch(err => {
			throw err
		})
	}

	if (!body.projectId || !body.memberId || !body.leaderGitToken) {
		onError('请提供参数 projectId, memberId, leaderGitToken。')
	} else {
		try {
			const project = await Project.model.findOne().where('_id', body.projectId).exec()
			if (req.user.id != project.leader) {
				onError('您无权添加项目成员，请检查是否为该项目的负责人。')
			} else {
				if (project.member.indexOf(body.memberId) !== -1) {
					onError('该成员已在此项目中，请勿重复添加。')
				} else {
					project.member.push(body.memberId)
					const member = await User.model.findOne().where('_id', body.memberId).exec()
					await addMemberToGitProject(project, member, body.leaderGitToken)
					await project.save()
					onSuccess()
				}
			}
		} catch (err) {
			onError(err.toString())
		}
	}
}
