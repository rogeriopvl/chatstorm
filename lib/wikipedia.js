var sys = require('sys');
var http = require('http');

module.exports = function aux(params){
	var results = getWikipedia(params);
	return results;
};

function newWikiCall(text){	
	var url = "/wiki/Banana";
	var host = "en.wikipedia.org";
  	var refer = "http://en.wikipedia.org";
  	var userAgent = "Mozilla/5.0 (Windows; U; Windows NT 6.1; en-GB; rv:1.9.2) Gecko/20100115 Firefox/3.6";
	
	var wiki_client = http.createClient(80, host);
    var request = wiki_client.request("GET", url, {"Host": host, "Referer": refer, "User-Agent": userAgent });
	
	request.addListener("response", function(response){
		var body = "";
		response.addListener("data", function(data){
			body += data;
			sys.puts("data obtained from get: " + body);
			
			var wiki_data = JSON.parse(data);
			if(wiki_data.length > 0){
				sys.puts("wiki call success");
				var text = wiki_data.parse.text["*"].substr(wiki_data.parse.text["*"].indexOf('<p>'));
			    text = text.replace(/((<(.|\n)+?>)|(\((.*?)\) )|(\[(.*?)\]))/g, "");
				return text.substr(0, ( length || 140 )) + " ...";
			}
		});
	});  
	request.close();
}
