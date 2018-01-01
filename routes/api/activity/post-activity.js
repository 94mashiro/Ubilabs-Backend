var keystone = require('keystone');
const Activity = keystone.list('Activity')

exports = module.exports = (req, res) => {
	const { body } = req

	const onError = (err) => {
		return res.apiResponse({
			success: false,
			message: err
		})
	}

	const onSuccess = (activity) => {
		return res.apiResponse({
			success: true,
			date: new Date().getTime(),
			activityId: activity._id
		})
	}

	const activity = Activity.model({
		...body,
		author: req.user.id
	})

	activity.save((err, activity) => {
		if (err) {
			onError(err)
		} else {
			onSuccess(activity)
		}
	})
}
