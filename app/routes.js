'use strict';

var Mail    = require(global.scriptsDir + '/Mail.js');

var db      = require(global.rootDir + '/config/mongoose.js');
var Models  = require(global.rootDir + '/config/models.js');


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

		var newUser = new Models.User();
		newUser.firstName = firstName;
		newUser.lastName = lastName;
		newUser.email = email;
		newUser.password = newUser.hashPassword(password);

		newUser.save(function(err) {
			if (err) {
				return res.status(500).json({ status: 500, error: 'Unable to create new user.' });
			}
		});

		return res.status(200).json({ status: 200 });
	});
	
	// Send feedback
	app.post('/api/send-feedback', Mail.sendFeedback);


	// ===============================
	// PAGE ROUTES ===================
	// ===============================

	// Serve index.html on /
	// Angular will handle the views from there
	app.get('/', function(req, res) {
		res.sendFile(global.serveDir + '/index.html');
	});

};
