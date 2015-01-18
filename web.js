// Define directory constants
global.serveDir    = __dirname + '/dist';
global.scriptsDir  = __dirname + '/node_scripts';

// Require dependencies
var gzippo         = require('gzippo');
var express        = require('express');
var morgan         = require('morgan');
var bodyParser     = require('body-parser');
var mandrill       = require('mandrill-api/mandrill');
var InputValidator = require(global.scriptsDir + '/InputValidator.js');

// Configure dependencies
var MandrillClient = new mandrill.Mandrill(process.env.MANDRILL_API_KEY);
var Mail           = require(global.scriptsDir + '/Mail.js')(InputValidator, MandrillClient);

// Setup Express server
var app = express();
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(morgan('dev'));
app.use(gzippo.staticGzip('' + global.serveDir));

// Routes
require('./app/routes.js')(app, Mail);

// Launch server
app.listen(process.env.PORT || 5000);
