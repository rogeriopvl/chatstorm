var sys = require('sys'),
	http = require('http'),
	url = require('url');

module.exports = function twitter(params, client){
	var results = getTweets(params, client) ;	
	return results;
};

/**
 * Search for the keyword on twitter search api
 * and send the results to all clients
 */
function getTweets(target, client){
	sys.puts("target: " + target);

	//http://search.twitter.com/search.json?q=@codebits
	var connection = http.createClient(80, "search.twitter.com");
    var request = connection.request('GET', "/search.json?q=%23" + target, {"host": "search.twitter.com", "User-Agent": "Chatstorm"});

    request.addListener("response", function(response)
	{
        var responseBody = "";
        response.setEncoding("utf8");
        response.addListener("data", function(chunk) { responseBody += chunk });

        response.addListener("end", function()
		{
            tweets = JSON.parse(responseBody);
            var results = tweets["results"],
                length = results.length;

			var stuff = { idea: [results,"twitter"] };
			client.json.send(stuff);
			client.json.broadcast.send(stuff);
        });
    });
    request.end();
};
