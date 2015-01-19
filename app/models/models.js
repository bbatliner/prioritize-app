'use strict';

var mongoose = require('mongoose');

module.exports = function() {
	var module = {};

	module.User = require('user.js')(mongoose);

	return module;
};