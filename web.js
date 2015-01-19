// Define directory constants
global.rootDir     = __dirname;
global.serveDir    = __dirname + '/dist';
global.scriptsDir  = __dirname + '/my_node_modules';

// Require dependencies
var gzippo         = require('gzippo');
var express        = require('express');
var morgan         = require('morgan');
var bodyParser     = require('body-parser');

// Setup Express server
var app = express();
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(morgan('dev'));
app.use(gzippo.staticGzip('' + global.serveDir));

// Routes
require('./app/routes.js')(app);

// Launch server
app.listen(process.env.PORT || 5000);
