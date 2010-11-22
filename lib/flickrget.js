var sys = require('sys'),
	http = require('http'),
	url = require('url'),
	path = require('path'),
	events = require('events'),
	flickr = require('flickr-reflection');

module.exports = function flickrget(params,client){
	var results = getFlickr(params,client);
	return results;
};

function getFlickr(target,client){
	var options = {
	    key: 'cfef61da344dbcd7dd20a094389f9e74',
	    secret: 'f4c65971ee80aaee',
	    apis: ['contacts', 'photos'] // add the apis you'd like to use
	};		

	flickr.connect(options, function(err, api){
		if (err) throw err;

		api.photos.search({tags: target}, function(err, data){
			if (err) throw err;

			sys.puts(sys.inspect(data.photos.photo));
			//sys.puts(sys.inspect(data).photos.photo);
			
			//var stuff = { idea: results };
			//client.broadcast(stuff);
			//sys.puts("sending epic flickr shit!");
			
		});
	});
/*
	
	flickr.connect(options, function(err, api) {
	    if (err) throw err;

	    api.contacts.getList(function(err, data) {
	        if (err) throw err;

	        sys.puts(sys.inspect(data.contacts.contact));
	    });

	    api.photos.search({tags: 'beach,iceland'}, function(err, data) {
	        if (err) throw err;

	        sys.puts(sys.inspect(data.photos.photo));
	    });
	});
	*/

}

function getImages(target){
	var connection = http.createClient(80, "api.flickr.com");
	//var since = "2010-11-12";
	sys.puts("target: " + target);
    var request = connection.request('GET', "/services/feeds/photos_public.gne?id=" + target + "&lang=en-us&format=json&jsoncallback=?", {"host": "api.flickr.com", "User-Agent": "Chatstorm"});
    request.addListener("response", function(response){
        var responseBody = "";
        response.setEncoding("utf8");
        response.addListener("data", function(chunk) { responseBody += chunk });
        response.addListener("end", function(){
            tweets = JSON.parse(responseBody);
            var results = tweets["results"],
                length = results.length;

				sys.puts(results);
            for (var i = (length-1); i >= 0; i--){
                //if (results[i].id > since) {
                //  since = results[i].id;
                //}
                sys.puts("From " + results[i].from_user + " at: " +  results[i].created_at + " : " + results[i].text);
            }
        });
    });
    request.close();
};
