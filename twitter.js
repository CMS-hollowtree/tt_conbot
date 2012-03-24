var https = require('https');
var OAuth= require('oauth').OAuth;
var keys = require('./keys');

//TWITTER
var twitterer = new OAuth(
		   "https://api.twitter.com/oauth/request_token",
		   "https://api.twitter.com/oauth/access_token",
		   keys.consumerKey,
		   keys.consumerSecret,
		   "1.0",
		   null,
		   "HMAC-SHA1"
		  );
//var tweets = require('./tweets.js');
  // url, oauth_token, oauth_token_secret, post_body, post_content_type, callback
exports.tweeter = function tweeter(body){
twitterer.post("http://api.twitter.com/1/statuses/update.json",
	       keys.token, keys.secret, {'status':body}, "application/json",
	       function (error, data, response) {
		       console.log('Twitter status updated.\n');
	       });
}
//END TWITTER


