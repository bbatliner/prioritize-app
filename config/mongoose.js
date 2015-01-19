'use strict';

module.exports = function(mongoose) {
	mongoose.connect(process.env.MONGOLAB_URI);
	var db = mongoose.connection;
	db.on('error', console.error.bind(console, 'MongoDB connection error:'));
	db.once('open', function (data) {
		console.log("MongoDB connection successful.");
	});
	return db;
};