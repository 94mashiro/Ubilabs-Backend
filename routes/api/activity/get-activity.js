const keystone = require('keystone')
const Activity = keystone.list('Activity')
const async = require('async')


exports = module.exports = function (req, res) {
	const {query: urlQuery} = req
	const onSuccess = (activities) => {
		return res.apiResponse({
			success: true,
			activities
		})
	}

	const onError = (err) => {
		return res.apiResponse({
			success: false,
			message: (err && err.message ? err.message : false) || 'Sorry, there was an issue, please try again.'
		})
	}

	const queryActivities = () => {
		const query = Activity.paginate({
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
					activities: paginate.results
				})
			}
		})
	}

	const queryActivity = (activityId) => {
		const query = Activity.model
			.findOne()	
			.where('_id', activityId)
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
			query.exec((err, activity) => {
				if (err) {
					onError({
						message: err
					})
				} else {
					return res.apiResponse({
						success: true,
						activity
					})
				}
			})
	}

	if (!urlQuery.id) {
		queryActivities()
	} else {
		queryActivity(urlQuery.id)
	}

}
