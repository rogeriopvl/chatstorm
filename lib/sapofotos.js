var sys = require('sys'),
	http = require('http'),
	url = require('url');

module.exports = function sapo(params, client){
	var results = getFotos(params, client);
	return results;
};

/**
 * Fetch fotos with given tag from Sapo Fotos open search
 */
function getFotos(target, client){
	sys.puts("target: " + target);

	var connection = http.createClient(80, "services.sapo.pt");
    var request = connection.request('GET', "/Photos/JSON?tag=" + target, {"host": "services.sapo.pt", "User-Agent": "Chatstorm"});

    request.addListener("response", function(response){
        var responseBody = "";
        response.setEncoding("utf8");
        response.addListener("data", function(chunk) { responseBody += chunk });
        response.addListener("end", function(){
            tweets = JSON.parse(responseBody);

			if (tweets["fault"]){ return; }
				
             var results = tweets["rss"]["channel"];
             var length = parseInt(results.elements);

			if (length > 0){
				var stuff = { idea: [results.item[0],"foto"] };
				client.send(stuff);
				client.broadcast(stuff);
			}
        });
    });
    request.close();
}
