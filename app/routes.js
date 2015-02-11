'use strict';

var Mail           = require(global.scriptsDir + '/Mail.js');
var validator      = require('validator');

var db             = require(global.rootDir + '/config/mongoose.js');
var User           = require(global.rootDir + '/app/models/user.js');


// Middleware auth function
var auth = function(req, res, next) {
	if (!req.isAuthenticated()) {
		res.sendStatus(401);
	}
	else {
		next();
	}
};

// Middleware admin auth function
var authAdmin = function(req, res, next) {
	if (!req.isAuthenticated() || req.user.role !== 'admin') {
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
		var returnableData = {
			firstName: req.user.firstName,
			lastName: req.user.lastName,
			email: req.user.email,
			createdAt: req.user.createdAt
		}
		res.send(returnableData);
	});

	// Logout
	app.post('/api/logout', function(req, res) {
		req.logOut();
		res.sendStatus(200);
	});

	// Signup (new user)
	app.post('/api/signup', passport.authenticate('local-signup'), function(req, res) {
		var returnableData = {
			firstName: req.user.firstName,
			lastName: req.user.lastName,
			email: req.user.email,
			createdAt: req.user.createdAt
		}
		res.send(returnableData);
	});

	// Save user todos
	app.post('/api/todos', auth, function(req, res) {
		var todos = JSON.parse(req.body.todos);
		var doneTodos = JSON.parse(req.body.doneTodos);

		// Validate todos
		if (todos === undefined || todos === null || todos.length === 0) {
			return res.status(400).json({ error: 'Todos cannot be empty.' });
		}
		else if (todos.categories === undefined || todos.categories === null || todos.categories.length === 0) {
			// return res.status(400).json({ error: 'Todos must have categories.' });
		}
		else {
			for (var i = 0; i < todos.categories.length; i++) {
				var currentCategory = todos.categories[i];
				if (currentCategory.todos === undefined || currentCategory.todos === null) {
					return res.status(400).json({ error: 'Categories must have `todos`.' });
				}
			}
		}
		// Validate done todos
		if (doneTodos === undefined || doneTodos === null || doneTodos.length === 0) {
			return res.status(400).json({ error: 'Done todos cannot be empty.' });
		}
		else if (doneTodos.categories === undefined || doneTodos.categories === null || doneTodos.categories.length === 0) {
			// return res.status(400).json({ error: 'Done todos must have categories.' });
		}
		else {
			for (var i = 0; i < doneTodos.categories.length; i++) {
				var currentCategory = doneTodos.categories[i];
				if (currentCategory.todos === undefined || currentCategory.todos === null) {
					return res.status(400).json({ error: 'Done todo categories must have `todos`.' });
				}
			}
		}

		// Clean todos
		for (var i = 0; i < todos.categories.length; i++) {
			delete todos.categories[i].$$hashKey;
		}
		// Clean done todos
		for (var i = 0; i < doneTodos.categories.length; i++) {
			delete doneTodos.categories[i].$$hashKey;
		}

		// Save todos to the logged-in user
		User.findById(req.user.id, function(error, user) {
			if (error) {
				console.log(error);
				return res.status(500).json({ error: 'User does not exist.' });
			}

			user.todos = todos;
			user.doneTodos = doneTodos;
			user.save(function(err) {
				if (err) {
					console.log(err);
					return res.status(500).json({ error: 'Unable to save todos.' });
				}
			});
		});

		res.sendStatus(200);
	})
	
	// Send feedback
	app.post('/api/send-feedback', Mail.sendFeedback);


	// GET ===========================

	// Check login status
	app.get('/api/loggedin', function(req, res) {
		if (req.isAuthenticated()) {
			var returnableData = {
				firstName: req.user.firstName,
				lastName: req.user.lastName,
				email: req.user.email,
				createdAt: req.user.createdAt
			}
			res.send(returnableData);
		}
		else {
			res.send('0');
		}
	});

	// Get all users (admins only)
	app.get('/api/users', authAdmin, function(req, res) {
		User.find({}, function(error, users) {
			if (error) {
				console.log(error);
				return res.sendStatus(500);
			}

			var userMap = {};

			users.forEach(function(user) {
				userMap[user._id] = user;
			});

			res.send(userMap);
		});
	});

	// Get user todos
	app.get('/api/todos', auth, function(req, res) {
		User.findById(req.user.id, function(error, user) {
			if (error) {
				console.log(error);
				return res.sendStatus(500);
			}

			if (user.todos) {
				res.send(user.todos);
			}
			else {
				res.send('');
			}
		});
	});

	// Get done todos
	app.get('/api/donetodos', auth, function(req, res) {
		User.findById(req.user.id, function(error, user) {
			if (error) {
				console.log(error);
				return res.sendStatus(500);
			}
			if (user.doneTodos) {
				res.send(user.doneTodos);
			}
			else {
				res.send('');
			}
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
