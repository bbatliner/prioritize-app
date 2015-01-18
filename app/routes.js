'use strict';

module.exports = function(app, Mail) {

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
