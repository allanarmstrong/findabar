var passport = require('passport');
var twitterStrategy = require('passport-twitter').Strategy;

exports.setup = function(User, config) {
	passport.use(new twitterStrategy({
		consumerKey: config.TWITTER.CONSUMER_KEY,
		consumerSecret: config.TWITTER.CONSUMER_SECRET,
		callbackURL: config.TWITTER.CALLBACK
	}, function(token, tokenSecret, profile, done) {
		User.findOrCreate({'twitter.id': profile.id}, function(err, user) {
			if(err) {
				return done(err);
			} else if (!user) {
				user = new User({
					name: profile.displayName,
					username: profile.username,
					role: 'user',
				});
			} else {
				return done(err, user);
			}
		});
	}));
}