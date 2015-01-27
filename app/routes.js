'use strict';

var Mail           = require(global.scriptsDir + '/Mail.js');
var validator      = require('validator');

var db             = require(global.rootDir + '/config/mongoose.js');
var Models         = require(global.rootDir + '/config/models.js');


module.exports = function(app) {

	// ===============================
	// API Endpoints =================
	// ===============================

	// POST ==========================

	// Signup (new user)
	app.post('/api/signup', function(req, res) {
		var firstName = req.body.firstName;
		var lastName = req.body.lastName;
		var email = req.body.email;
		var password = req.body.password;

		// firstName must exist
		if (firstName.length == 0) {
			return res.status(500).json({ status: 500, error: 'First name cannot be empty.' });
		}
		// lastName must exist
		if (lastName.length == 0) {
			return res.status(500).json({ status: 500, error: 'Last name cannot be empty.' });
		}
		// password must be at least 8 characters
		if (password.length < 8) {
			return res.status(500).json({ status: 500, error: 'Password must be at least 8 characters long.' });
		}
		// Email must be valid
		if (!validator.isEmail(email)) {
			return res.status(500).json({ status: 500, error: 'Invalid email.' });
		}

		// Email must be unique
		Models.User.find({ email: email }, function(error, user) {
			if (error) {
				return res.status(500).json({ status: 500, error: 'Unexpected error.' });
			}
			else if (user.length != 0) {
				return res.status(500).json({ status: 500, error: 'Email already exists.' });
			}
			
			// If email is unique, create the user
			else {
				var newUser = new Models.User();
				newUser.firstName = firstName;
				newUser.lastName = lastName;
				newUser.email = email;
				newUser.password = newUser.hashPassword(password);

				newUser.save(function(err) {
					if (err) {
						return res.status(500).json({ status: 500, error: 'Unable to create new user.' });
					}
					else {
						return res.status(200).json({ status: 200 });
					}
				});
			}
		});
	});
	
	// Send feedback
	app.post('/api/send-feedback', Mail.sendFeedback);


	// GET ===========================

	app.get('/api/user', function(req, res) {
		Models.User.find({}, function(error, users) {
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
