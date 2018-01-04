const keystone = require('keystone')
const Project = keystone.list('Project')
const async = require('async')


exports = module.exports = function (req, res) {
	const {query: urlQuery} = req
	const onSuccess = (projects) => {
		return res.apiResponse({
			success: true,
			projects
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
					path: 'author',
					select: 'name email description avatar'
				},
				{
					path: 'node',
					select: 'name description'
				}
			])
			.lean()
			.sort('-createdAt')
		query.exec((err, paginate) => {
			if (err) {
				onError({
					message: err
				})
			} else {
				return res.apiResponse({
					success: true,
					projects: paginate.results
				})
			}
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
				}
			])
			.lean()
			.sort('-createdAt')
			query.exec((err, project) => {
				if (err) {
					onError({
						message: err
					})
				} else {
					return res.apiResponse({
						success: true,
						project
					})
				}
			})
	}

	if (!urlQuery.id) {
		queryProjects()
	} else {
		queryProject(urlQuery.id)
	}

}
