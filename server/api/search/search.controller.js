'use strict';
var _ = require('lodash');
var config = require('../../config/environment');
var Venue = require('../venue/venue.model');

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

		//Make the results more readable.
		var results = data.businesses.map(function(business) {
			return {
				name: business.name,
				id: business.id,
				address: business.location.display_address[0],
				snippet_text: business.snippet_text,
				image_url: business.image_url,
				url: business.url
			};
		});


		//Now we need to find the businesses in the venue model so we can get people who are attending!
		//So we'll get all the bar ids first?
		var ids = results.map(function(business) {

			return business.id;
		});
		console.log("IDS: ", ids);

		//Now get them from the venue model.
		Venue.find({name: {$in: ids}}, function(err, venues) {
			if(err)
				return handleError(res,err);
			//Merge them into the results.
			venues.forEach(function(venue) {
				console.log("Checking venue: ", venue); 
				var idx = _.findIndex(results,{id: venue.name})
				if (venue.attendance.length > 0) {
					var i = _.findIndex(results, {'id': venue.id});
					_.assign(results[i], {attendance: venue.attendance});
				} else {
					var i = _.findIndex(results, {'id': venue.id});
					_.assign(results[i], {attendance: []});
				}
			});
		});
		console.log(results);
		return res.status(200).json(results);
	});
};

function handleError(res, err) {
  return res.status(500).send(err);
}