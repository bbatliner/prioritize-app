'use strict';

module.exports = function(mandrill) {
	return new mandrill.Mandrill(process.env.MANDRILL_API_KEY);
};