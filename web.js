// Define directory constants (as module vars)
module.serveDir = __dirname + '/dist';
module.scriptsDir = __dirname + '/node_scripts';

// Require server dependencies
var gzippo = require('gzippo');
var express = require('express');
var morgan = require('morgan');
var bodyParser = require('body-parser');

// Setup module variables
module.mandrill = require('mandrill-api/mandrill');
module.mandrill_client = new module.mandrill.Mandrill(process.env.MANDRILL_API_KEY);

// Setup server
var app = express();
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

// Require modules
var Mail = require(module.scriptsDir + '/Mail.js');

// Define API endpoints
app.post('/api/send-feedback' , Mail.sendFeedback);

// Serve index.html
app.use(morgan('dev'));
app.use(gzippo.staticGzip('' + module.serveDir));
app.listen(process.env.PORT || 5000);

app.get('/', function(req, res) {
	res.sendFile(module.serveDir + '/index.html');
});
