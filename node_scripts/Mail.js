'use strict';

var exports = module.exports = {};

var InputValidator = require(module.parent.scriptsDir + '/InputValidator.js');

exports.sendFeedback = function (req, res) {

	// Get inputs (SHOULD CLEAN THEM)
	var name = req.body.name;
	var email = req.body.email;
	var subject = req.body.subject;
	var message = req.body.message;

	// Validate inputs
	if (email.length !== 0) {
		if (InputValidator.ValidateEmail(email) === false) {
			return res.status(400).json({ status: 400, error: 'Invalid email.' });
		}
	}
	else {
		// If the email wasn't set by the user, use a default one
		email = 'prioritize.user@prioritize.com';
	}

	if (message.length === 0) {
		return res.status(400).json({ status: 400, error: 'Feedback cannot be empty.' });
	}

	// Perform the API function :P
	var status = sendEmailToAdmin(name, email, subject, message);

	// If the email fails to deliver, oh well, that's life
	return res.status(200).json({ status: 200 });
};

function sendEmailToAdmin( _name, _email, _subject, _message ) {	

	var message = {
	    'text': _message,
	    'subject': _subject,
	    'from_email': _email,
	    'from_name': _name,
	    'to': [{
	            'email': 'prioritize.app@gmail.com',
	            'name': 'PrioritizeAdmin',
	            'type': 'to'
	    }]
	};

    module.parent.mandrill_client.messages.send({ 'message': message, 'async': false },
    	function (result) {
    		console.log(result);
    	},
    	function (e) {
    		console.log('A mandrill error occurred: ' + e.name + ' - ' + e.message);
    	}
    );
}