var gzippo = require('gzippo');
var express = require('express');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var mandrill = require('mandrill-api/mandrill');
var mandrill_client = new mandrill.Mandrill(process.env.MANDRILL_API_KEY);

/**
	function sendEmail()
	param _name
	param _email
	param _subject
	param _message

	returns a json object
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
function sendEmail ( _name, _email, _subject, _message ) {
	var message = {
	    'text': 'This is great feedback!',
	    'subject': 'Prioritize Feedback',
	    'from_email': 'feeback@prioritize.com',
	    'from_name': 'John Smith',
	    'to': [{
	            'email': 'prioritize.app@gmail.com',
	            'name': 'Prioritize Admin',
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
	var _name = req.body.name;
	var _email = req.body.email;
	var _subject = req.body.subject;
	var _message = req.body.message;

	sendEmail( _name, _email, _subject, _message );

	// If the email failed to send, oh well, that's life
	res.status(200).end();
});

var serveDir = __dirname + '/dist';

app.use(morgan('dev'));
app.use(gzippo.staticGzip('' + serveDir));
app.listen(process.env.PORT || 5000);

app.get('/', function(req, res) {
	res.sendFile(serveDir + '/index.html');
});
