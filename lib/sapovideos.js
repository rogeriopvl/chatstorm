var sys = require('sys'),
	http = require('http'),
	url = require('url');

module.exports = function video(params, client){
	var results = getSapoVideo(params, client);
	return results;
};

function getSapoVideo(target, client){
	sys.puts("target: " + target);

	var connection = http.createClient(80, "services.sapo.pt");
    var request = connection.request('GET', "/Videos/JSON/Query?search=" + target + "&order=views&limit=10", {"host": "services.sapo.pt", "User-Agent": "Chatstorm"});

    request.addListener("response", function(response){
        var responseBody = "";
        response.setEncoding("utf8");
        response.addListener("data", function(chunk) { responseBody += chunk });
        response.addListener("end", function(){
            videos = JSON.parse(responseBody);

			if (videos["fault"]){ return; }
				
            var results = videos["rss"]["channel"];

			if (!results.item || results.item.length < 1){ return; }

			while (results.item[0].m18 == 'true' && results.item.length > 0) {
				results.item.shift(); // remove the pr0n entries
			}
			var stuff = { idea: [results.item.shift(),"video"] };
			client.send(stuff);
			client.broadcast(stuff);
		});
    });
    request.close();
}
