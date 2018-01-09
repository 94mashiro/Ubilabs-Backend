var keystone = require('keystone');
const Project = keystone.list('Project')
var User = keystone.list('User')
const fetch = require('node-fetch')


exports = module.exports = async (req, res) => {

	const createGitlabProject = async (projectModel) => {
		try {
			const { leader, gitTitle, description } = projectModel
			const leaderModel = await User.model.findOne({ '_id': leader }).exec()
			const options = {
				method: 'POST',
				headers: {
					'PRIVATE-TOKEN': leaderModel.gitlabToken,
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					name: gitTitle,
					visibility: 'public',
					description
				})
			}
			console.log('fetch')
			return fetch(`${process.env.GITLAB_API_HOST}/projects/`, options).then(res => {
				return res.json()
			}).catch(err => {
				throw new Error(err)
			})
		} catch (err) {
			 throw new Error(err)
		}
	}

	const onError = (err) => {
		return res.apiResponse({
			success: false,
			message: JSON.stringify(err)
		})
	}

	const onSuccess = (project) => {
		return res.apiResponse({
			success: true,
			date: new Date().getTime()
		})
	}

	const { body } = req
		const project = Project.model({
			...body,
			leader: req.user._id
		})
	try {
		const projectModel = await project.save()
		const { id, ssh_url_to_repo } = await createGitlabProject(projectModel)
		projectModel.gitId = id	
		projectModel.gitSSH = ssh_url_to_repo
		await projectModel.save()
		onSuccess(projectModel)
	} catch (err) {
		onError(err)
		console.log(err)
	}
}
