'use strict';

var mongoose  = require('mongoose');
var bcrypt    = require('bcrypt-nodejs');


// Schema =============================

var userSchema = mongoose.Schema({
	firstName:       String,
	lastName:        String,
	email:           String,
	password:        String
});


// Methods ============================

// Hash password
userSchema.methods.hashPassword = function(password) {
	return bcrypt.hashSync(password, bcrypt.genSaltSync(8));
};

// Validate password
userSchema.methods.validPassword = function(password) {
	return bcrypt.compareSync(password, this.password);
};


// Expose model to application
module.exports = mongoose.model('User', userSchema);