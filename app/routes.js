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
