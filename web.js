var serveDir = __dirname + '/dist';
var scriptsDir = __dirname + '/node_scripts';

var gzippo = require('gzippo');
var express = require('express');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var mandrill = require('mandrill-api/mandrill');
var mandrill_client = new mandrill.Mandrill(process.env.MANDRILL_API_KEY);
var InputValidator = require(scriptsDir + '/InputValidator.js');

/**
	function sendEmailToAdmin()
	param _name: The name of the sender
	param _email: The email of the sender
	param _subject: The subject of the email
	param _message: The message (plain text) of the email

	returns the status of the email send:
	'sent' - message sent to Mandrill successfully (does not guarantee delivery)
	'invalid email' - email is invalid

	will console.log the Mandrill API response when received
	example response json:
	{
        'email': 'recipient.email@example.com',
        'status': 'sent',
        'reject_reason': 'hard-bounce',
        '_id': 'abc123abc123abc123abc123abc123'
    }
    example error json:
    {
	    'status': 'error',
	    'code': 12,
	    'name': 'Unknown_Subaccount',
	    'message': 'No subaccount exists with the id 'customer-123''
	}
*/
function sendEmailToAdmin ( _name, _email, _subject, _message ) {	

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

    mandrill_client.messages.send({ 'message': message, 'async': false },
    	function (result) {
    		console.log(result);
    	},
    	function (e) {
    		console.log('A mandrill error occurred: ' + e.name + ' - ' + e.message);
    	}
    );
}

var app = express();
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.post( '/api/send-feedback' , function(req, res) {

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
});



app.use(morgan('dev'));
app.use(gzippo.staticGzip('' + serveDir));
app.listen(process.env.PORT || 5000);

app.get('/', function(req, res) {
	res.sendFile(serveDir + '/index.html');
});
