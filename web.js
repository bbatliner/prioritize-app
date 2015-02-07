// Define directory constants
global.rootDir     = __dirname;
global.serveDir    = __dirname + '/dist';
global.scriptsDir  = __dirname + '/my_node_modules';

// Require dependencies
var gzippo         = require('gzippo');
var express        = require('express');
var session        = require('express-session');
var morgan         = require('morgan');
var bodyParser     = require('body-parser');
var cookieParser   = require('cookie-parser');
var passport       = require('passport');

// Configure passport auth
require(global.rootDir + '/config/passport.js')(passport);

// Setup Express server
var app = express();

// Parsing
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(cookieParser());

// Auth/sessions
app.use(session({ 
	secret: process.env.SESSION_SECRET,
	resave: false, // don't force session to save UNTIL it has actually changed
	saveUninitialized: true // force an unmodified, new session to be saved
}));
app.use(passport.initialize());
app.use(passport.session());

// Misc
app.use(morgan('dev'));
app.use(gzippo.staticGzip('' + global.serveDir));

// Routes
require('./app/routes.js')(app, passport);

// Launch server
app.listen(process.env.PORT || 5000);
