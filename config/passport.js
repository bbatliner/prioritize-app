'use strict';

var validator      = require('validator');

var LocalStrategy  = require('passport-local').Strategy;
var User           = require(global.rootDir + '/app/models/user.js');


module.exports = function(passport) {

	passport.use('local-signup', new LocalStrategy({
		usernameField: 'email',
		passwordField: 'password',
		passReqToCallback: true
	},
	function(req, email, password, done) {
		// Get extra information not passable through the callback, but available in the request
		var firstName = req.body.firstName;
		var lastName = req.body.lastName;

		// firstName must exist
		if (firstName === undefined || firstName.length === 0) {
			return done('First name cannot be empty.');
		}
		// lastName must exist
		if (lastName === undefined || lastName.length === 0) {
			return done('Last name cannot be empty.');
		}
		// password must be at least 8 characters
		if (password === undefined || password.length < 8) {
			return done('Password must be at least 8 characters long.');
		}
		// Email must be valid
		if (email === undefined || !validator.isEmail(email)) {
			return done('Invalid email.');
		}

		// Email must be unique
		User.find({ 'email': email }, function(error, user) {
			// Handle errors/nonunique emails
			if (error) {
				return done(error);
			}
			else if (user.length != 0) {
				return done('Email already exists.');
			}
			// If email is unique, create the user
			else {
				var newUser = new User();
				newUser.firstName = firstName;
				newUser.lastName = lastName;
				newUser.email = email;
				newUser.password = newUser.hashPassword(password);
				newUser.role = 'user';

				newUser.save(function(err) {
					if (err) {
						return done('Unable to create new user.');
					}
					else {
						return done(null, newUser);
					}
				});
			}
		});
	}));
	
	passport.use('local-login', new LocalStrategy({
		usernameField: 'email',
		passwordField: 'password',
		passReqToCallback: true
	},
	function(req, email, password, done) {
		User.findOne({ 'email': email }, function(err, user) {
			// If error, return
			if (err) {
				return done(err);
			}
			// If user not found, return
			if (!user) {
				return done('Email is not associated with any accounts.', false);
			}
			// If password not valid, return
			if (!user.validPassword(password)) {
				return done('Incorrect password.', false);
			}

			// Otherwise return the logged in user
			return done(null, user);
		});
	}));

	passport.serializeUser(function(user, done) {
		done(null, user.id);
	});

	passport.deserializeUser(function(id, done) {
		User.findById(id, function (err, user) {
			done(err, user);
		});
	});
};
