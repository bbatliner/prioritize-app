'use strict';

var Mail           = require(global.scriptsDir + '/Mail.js');
var validator      = require('validator');

var db             = require(global.rootDir + '/config/mongoose.js');
var User           = require(global.rootDir + '/app/models/user.js');


// Define middleware auth function
var auth = function(req, res, next) {
	if (!req.isAuthenticated()) {
		res.sendStatus(401);
	}
	else {
		next();
	}
};


module.exports = function(app, passport) {

	// ===============================
	// API Endpoints =================
	// ===============================

	// POST ==========================

	// Login (existing user)
	app.post('/api/login', passport.authenticate('local-login'), function(req, res) {
		res.send(req.user);
	});

	// Logout
	app.post('/api/logout', function(req, res) {
		req.logOut();
		res.sendStatus(200);
	});

	// Signup (new user)
	app.post('/api/signup', passport.authenticate('local-signup'), function(req, res) {
		res.send(req.user);
	});

	// Save user todos
	app.post('/api/savetodos', auth, function(req, res) {
		var todos = JSON.parse(req.body.todos);

		// Validate todos
		if (todos === undefined || todos === null || todos.length === 0) {
			return res.status(400).json({ status: 400, error: 'Todos cannot be empty.' });
		}
		else if (todos.categories === undefined || todos.categories === null || todos.categories.length === 0) {
			return res.status(400).json({ status: 400, error: 'Todos must have categories.' });
		}
		else {
			for (var i = 0; i < todos.categories.length; i++) {
				var currentCategory = todos.categories[i];
				if (currentCategory.todos === undefined || currentCategory.todos === null) {
					return res.status(400).json({ status: 400, error: 'Categories cannot be empty.' });
				}
			}
		}

		// Clean todos
		for (var i = 0; i < todos.categories.length; i++) {
			delete todos.categories[i].$$hashKey;
		}

		// Save todos to the logged-in user
		User.findById(req.user.id, function(error, user) {
			user.todos = todos;
			user.save(function(err) {
				if (err) {
					console.log(err);
				}
				// if the todos didn't save, we can't do anything about it,
				// so just log the error
			});
		});
		
		res.sendStatus(200);
	})
	
	// Send feedback
	app.post('/api/send-feedback', Mail.sendFeedback);


	// GET ===========================

	// Check login status
	app.get('/api/loggedin', function(req, res) {
		res.send(req.isAuthenticated() ? req.user : '0');
	});

	// Get all users
	app.get('/api/user', auth, function(req, res) {
		User.find({}, function(error, users) {
			var userMap = {};

			users.forEach(function(user) {
				userMap[user._id] = user;
			});

			res.send(userMap);
		});
	});


	// ===============================
	// PAGE ROUTES ===================
	// ===============================

	// Serve index.html on /
	// Angular will handle the views from there
	app.get('/', function(req, res) {
		res.sendFile(global.serveDir + '/index.html');
	});

};
