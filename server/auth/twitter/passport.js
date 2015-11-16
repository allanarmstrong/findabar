var passport = require('passport');
var twitterStrategy = require('passport-twitter').Strategy;

exports.setup = function(User, config) {
	passport.use(new twitterStrategy({
		consumerKey: config.TWITTER.CONSUMER_KEY,
		consumerSecret: config.TWITTER.CONSUMER_SECRET,
		callbackURL: config.TWITTER.CALLBACK
	}, function(token, tokenSecret, profile, done) {
		User.findOne({'twitter.id_str': profile.id}, function(err, user) {
			if(err) {
				return done(err);
			} 

			if (!user) {
				var newAccount = new User({
					name: profile.displayName,
					username: profile.username,
					provider: 'twitter',
					twitter: profile._json
				});

				newAccount.save(function(err, user) {
					if (err)
						return done(err);
					done(err, user);
				});
			} else {
				return done(err, user);
			}
		});
	}));
}