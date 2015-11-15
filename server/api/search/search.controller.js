'use strict';
var _ = require('lodash');
var config = require('../../config/environment');

var yelp = require('yelp').createClient({
	consumer_key: config.YELP.YELP_CONSUMER_KEY,
	consumer_secret: config.YELP.YELP_CONSUMER_SECRET,
	token: config.YELP.YELP_TOKEN,
	token_secret: config.YELP.YELP_TOKEN_SECRET
});



exports.index = function(req, res) {
	return res.status(200).json({"message": "You need to search for a location"});
};

exports.search = function(req, res) {
	var location = req.params.location;

	yelp.search({term: "bars", location: location}, function(err, data) {
		if (err)
			return res.status(500).send(err);
		return res.status(200).json(data);
	});
};