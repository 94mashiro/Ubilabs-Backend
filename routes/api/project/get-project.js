const keystone = require('keystone')
const Project = keystone.list('Project')
const async = require('async')


exports = module.exports = function (req, res) {
	const {query: urlQuery} = req
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

	const queryProjects = () => {
		const query = Project.paginate({
			page: req.query.page || 1,
			perPage: 9
		})
			.populate([
				{
					path: 'leader',
					select: 'name email description avatar'
				},
				{
					path: 'member',
					select: 'name email description avatar'
				},
				{
					path: 'node',
					select: 'name description'
				},
				'codelab'
			])
			.lean()
			.sort('-createdAt')
		query.exec((err, paginate) => {
			if (err) {
				onError(err)
			} else {
				return onSuccess(paginate.results)
			}
		})
	}

	const queryProjectsByUserId = async (userId) => {
		const query = Project.paginate({
			page: req.query.page || 1,
			perPage: 10,
			filters: {
				$or: [
					{ 'leader': userId },
					{ 'member': userId }
				]
			}
		}).or([
			{ 'leader': userId },
			{ 'member': userId }
		]).populate([
			{
				path: 'leader',
				select: 'name email description avatar'
			},
			{
				path: 'member',
				select: 'name email description avatar'
			},
			{
				path: 'node',
				select: 'name description'
			},
			'codelab'
			])
			.lean()
			.sort('-createdAt')
		query.exec((err, paginate) => {
			if (paginate.total) {
				for (let project of paginate.results) {
					project.url = `/project/${project._id}`
				}
			}
			onSuccess(paginate)
		})

	}

	const queryProject = (projectId) => {
		const query = Project.model
			.findOne()	
			.where('_id', projectId)
			.populate([
				{
					path: 'leader',
					select: 'name email description avatar'
				},
				{
					path: 'member',
					select: 'name email description avatar'
				},
				{
					path: 'node',
					select: 'name description'
				},
				'codelab'
			])
			.lean()
			.sort('-createdAt')
			query.exec((err, project) => {
				if (err) {
					onError(err)
				} else {
					onSuccess(project)
				}
			})
	}

	// if (!urlQuery.id) {
	// 	queryProjects()
	// } else {
	// 	queryProject(urlQuery.id)
	// }
	if (urlQuery.id) {
		queryProject(urlQuery.id)
	} else if (urlQuery.user_id) {
		queryProjectsByUserId(urlQuery.user_id)
	} else {
		queryProjects()
	}

}
