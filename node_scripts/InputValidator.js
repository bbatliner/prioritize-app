'use strict';

var exports = module.exports = {};

exports.ValidateEmail = function(email) {
	var pattern = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
	return new RegExp(pattern).test(email);
};