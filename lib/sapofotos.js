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

	var connection = http.createClient(80, "services.sapo.pt");
    var request = connection.request('GET', "/Photos/JSON?tag=" + target, {"host": "services.sapo.pt", "User-Agent": "Chatstorm"});

    request.addListener("response", function(response){
        var responseBody = "";
        response.setEncoding("utf8");
        response.addListener("data", function(chunk) { responseBody += chunk });
        response.addListener("end", function(){
            photos = JSON.parse(responseBody);

			if (photos["fault"]){ return; }
				
             var results = photos["rss"]["channel"];

			if (!results.item || results.item.length < 1){ return; }

			/*while (results.item[0].m18 == 'true' && results.item.length > 0) {
				results.item.shift(); // remove pr0n items
			}*/
			var stuff = { idea: [results.item.shift(),"foto"] };
			client.send(stuff);
			client.broadcast(stuff);
        });
    });
    request.close();
}
