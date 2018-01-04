const keystone = require('keystone')
const Codelab = keystone.list('Codelab')


exports = module.exports = function (req, res) {
	const { query: urlQuery } = req
	
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

	const queryCodelabs = () => {
		const query = Codelab.paginate({
			page: req.query.page || 1,
			perPage: 10
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
				onError(err)
			} else {
				onSuccess(paginate.results)
			}
		})
	}

	const queryCodelab = (codelabId) => {
		const query = Codelab.model
			.findOne()	
			.where('_id', codelabId)
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
			query.exec((err, codelab) => {
				if (err) {
					onError(err)
				} else {
					onSuccess(codelab)
				}
			})
	}

	if (!urlQuery.id) {
		queryCodelabs()
	} else {
		queryCodelab(urlQuery.id)
	}

}
