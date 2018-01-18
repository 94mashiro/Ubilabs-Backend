var keystone = require('keystone');
const User = keystone.list('User')
const async = require('async')
const fetch = require('node-fetch')
const uuid = require('uuid/v4')
const request = require('request');


exports = module.exports = function (req, res) {
	const { body } = req
	let newUser;
	let userData = {}
	const doSignIn = () => {
		const onSuccess = (user) => {
			return res.apiResponse({
				success: true,
				session: true,
				date: new Date().getTime(),
				userId: user.id
			})
		}
		const onFail = (err) => {
			return res.apiResponse({
				success: false,
				session: false,
				message: (err && err.message ? err.message : false) || 'Sorry, there was an issue signing you in, please try again.'
			})
		}
		keystone.session.signin(String(newUser._id), req, res, onSuccess, onFail)
	}
	async.series([
		(next) => {
			const query = User.model.findOne()
			query.where('email', body.email)
			query.exec((err, user) => {
				if (err) {
					return next({
						message: `Sorry, there was an error processing your information, please try again.`
					})
				}
				if (user) {
					return next({
						message: `There's already an account with that email address, please sign-in instead.`
					})
				}
				next()
			})
		},
		(next) => {
			userData = {
				name: body.username,
				password: body.password,
				email: body.email,
				isAdmin: false,
				gitlabId: '',
				gitlabToken: ''
			}
			const options = {
				method: 'POST',
				headers: {
					'PRIVATE-TOKEN': process.env.GITLAB_TOKEN,
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					email: userData.email,
					password: userData.password,
					username: uuid(),
					name: userData.name,
					skip_confirmation: true
				})
			}
			fetch(`${process.env.GITLAB_API_HOST}/users/`, options)
				.then((res) => {
					return res.json()
				}).then((json) => {
					userData.gitlabId = json.id
					next()
				}).catch((err) => {
					next(err)
				})
		},
		(next) => {
			const options = {
				method: 'POST',
				headers: {
					'PRIVATE-TOKEN': process.env.GITLAB_TOKEN,
					'Content-Type': 'multipart/form-data'
				},
				formData: {
					user_id: userData.gitlabId,
					expires_at: '2099-12-31',
					name: 'accesstoken',
					'scopes[]': 'api'
				}
			}
			request(`http://localhost:${process.env.GITLAB_PORT}/api/v4/users/${userData.gitlabId}/impersonation_tokens`, options, (err, res, body) => {
				if (!err) {
					userData.gitlabToken = JSON.parse(body).token
					next()
				} else {
					next(err)
				}
			})
		},
		(next) => {
			newUser = new User.model(userData)
			newUser.save((err) => {
				if (err) {
					return next({
						message: 'Sorry, there was an error processing your account, please try again.'
					});
				}
				return next()
			})
		},
		(next) => {
			return doSignIn()
		}
	], (err) => {
		if (err) {
			return res.apiResponse({
				success: false,
				message: (err && err.message ? err.message : false) || 'Sorry, there was an issue signing you in, please try again.'
			})
		}
	})
};
