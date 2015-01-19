'use strict';

var Mail           = require(global.scriptsDir + '/Mail.js');

// var mongoose       = require('mongoose');
// var db             = require(global.rootDir + '/config/mongoose.js')(mongoose);
// var Models         = require(global.rootDir + '/app/models/models.js');


module.exports = function(app) {

	// ===============================
	// API Endpoints =================
	// ===============================

	// POST ==========================
	
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
