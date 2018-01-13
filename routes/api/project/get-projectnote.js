const keystone = require('keystone')
const ProjectNote = keystone.list('ProjectNote')

exports = module.exports = async (req, res) => {
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
			message: err
		})
	}

	try {
		if (!urlQuery.project_id) {
			try {
				const query = ProjectNote.model.find()
					.populate([
						{
							path: 'author',
							select: 'name email description avatar'
						},
						'article'
					])
					.lean()
					.sort('-createdAt')
				const result = await query.exec()
				onSuccess(result)
			} catch (err) {
				onError(err.message || err)
			}
			
		} else {
			const query = ProjectNote.paginate({
				page: urlQuery.page || 1,
				perPage: 10
			})
				.where('project', urlQuery.project_id)	
				.populate([
					{
						path: 'author',
						select: 'name email description avatar'
					},
					'article'
				])
				.lean()
				.sort('-createdAt')
			query.exec((err, paginate) => {
				if (err) {
					onError(err.message)
				} else {
					onSuccess(paginate.results)
				}
			})
		}
	} catch (err) {
		onError(err.message || err)
	}
}
