/**
 * This file is where you define your application routes and controllers.
 *
 * Start by including the middleware you want to run for every request;
 * you can attach middleware to the pre('routes') and pre('render') events.
 *
 * For simplicity, the default setup for route controllers is for each to be
 * in its own file, and we import all the files in the /routes/views directory.
 *
 * Each of these files is a route controller, and is responsible for all the
 * processing that needs to happen for the route (e.g. loading data, handling
 * form submissions, rendering the view template, etc).
 *
 * Bind each route pattern your application should respond to in the function
 * that is exported from this module, following the examples below.
 *
 * See the Express application routing documentation for more information:
 * http://expressjs.com/api.html#app.VERB
 */

var keystone = require('keystone');
var middleware = require('./middleware');
var importRoutes = keystone.importer(__dirname);

// Common Middleware
keystone.pre('routes', middleware.initLocals);
keystone.pre('render', middleware.flashMessages);

// Import Route Controllers
var routes = {
	views: importRoutes('./views'),
	auth: importRoutes('./auth'),
	api: importRoutes('./api')
};

// Setup Route Bindings
exports = module.exports = function (app) {

	if (process.env.NODE_ENV !== 'production') {
		app.all('*', (req, res, next) => {
			res.header('Access-Control-Allow-Origin', '*');
			res.header('Access-Control-Allow-Methods', 'GET, POST');
			res.header('Access-Control-Allow-Headers', 'Content-Type');
			next();
		})
	}

	// Views
	app.get('/', routes.views.index);

	// auth
	app.all('/auth*', [keystone.middleware.api, keystone.middleware.cors])
	app.post('/auth/register', routes.auth['user-register'])
	app.post('/auth/login', routes.auth['user-login'])
	app.get('/auth/logout', routes.auth['user-logout'])

	// apis
	app.all('/api*', [keystone.middleware.api, keystone.middleware.cors, middleware.mockTime]);

	// user
	app.get('/api/user/checkSession', middleware.checkAuth, routes.api['user']['check-session'])
	app.get('/api/user/profile', routes.api['user']['get-profile'])
	app.patch('/api/user/updatePassword', middleware.checkAuth, routes.api['user']['update-password'])
	app.patch('/api/user/updateProfile', middleware.checkAuth, routes.api['user']['update-profile'])

// forum
	app.get('/api/forum/getNodes', routes.api['forum']['get-nodes'])
	app.get('/api/forum/getQuestions', routes.api['forum']['get-questions'])
	app.get('/api/forum/getQuestion', routes.api['forum']['get-question'])
	app.get('/api/forum/articles', routes.api['forum']['get-articles'])
	app.get('/api/forum/article', routes.api['forum']['get-article'])
	app.get('/api/forum/getAnswers', routes.api['forum']['get-answers'])
	app.get('/api/forum/comments', routes.api['forum']['get-comments'])
	app.post('/api/forum/postQuestion', middleware.checkAuth, routes.api['forum']['post-question'])
	app.post('/api/forum/postArticle', middleware.checkAuth, routes.api['forum']['post-article'])
	app.post('/api/forum/postAnswer', middleware.checkAuth, routes.api['forum']['post-answer'])
	app.post('/api/forum/comment', middleware.checkAuth, routes.api['forum']['post-comment']),
	app.patch('/api/forum/answer', middleware.checkAuth, routes.api['forum']['update-answer'])
	
// activity
	app.get('/api/activity', routes.api['activity']['get-activity'])
	app.post('/api/activity', middleware.checkAuth, routes.api['activity']['post-activity'])

// codelabs
	app.post('/api/codelabs', middleware.checkAuth, routes.api['codelab']['post-codelab'])
	app.get('/api/codelabs', routes.api['codelab']['get-codelab'])

	// project
	app.post('/api/project', middleware.checkAuth, routes.api['project']['post-project'])
	app.get('/api/project', routes.api['project']['get-project'])
	app.post('/api/project/member', middleware.checkAuth, routes.api['project']['post-member'])
	app.post('/api/project/note', middleware.checkAuth, routes.api['project']['post-projectnote'])
	app.get('/api/project/note', routes.api['project']['get-projectnote'])

// system
	app.post('/api/system/postPicture', middleware.checkAuth, routes.api['system']['post-picture'])	

};
