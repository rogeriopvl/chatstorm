var http = require('http'), 
		url = require('url'),
		fs = require('fs'),
		io = require('socket.io'),
		sys = require('sys'),
		//wikipedia = require('./lib/wikipedia'),
		twitter = require("./lib/twitter"),
		sapofotos = require("./lib/sapofotos"),
		sapovideos = require("./lib/sapovideos"),
		
server = http.createServer(function(req, res){

	var path = url.parse(req.url).pathname;

	if (path == '/'){
		fs.readFile(__dirname +'/public/index.html', function(err, data){
			if (err) return send404(res);
			res.writeHead(200, {'Content-Type': 'text/html'})
			res.write(data, 'utf8');
			res.end();
		});
	}
	else if (path == '/chat'){
		fs.readFile(__dirname +'/public'+path+'.html', function(err, data){
			if (err) return send404(res);
			res.writeHead(200, {'Content-Type': 'text/html'})
			res.write(data, 'utf8');
			res.end();
		});
	}
	else if (path.match(/\.js$/)){
		// get the js files from the js directory
		// this must be evaluated for potential security issues
		fs.readFile(__dirname + '/public/js' + path, function(err, data){
			if (err) return send404(res);
			res.writeHead(200, {'Content-Type': 'text/javascript' })
			res.write(data, 'utf8');
			res.end();
		});
	}
	else if (path.match(/\.css$/)){
		fs.readFile(__dirname + '/public/css' + path, function(err, data){
			if (err) return send404(res);
			res.writeHead(200, {'Content-Type': 'text/css' })
			res.write(data, 'utf8');
			res.end();
		});
	}
	else if (path.match(/\.(jpg|jpeg|png|gif)$/)){
		fs.readFile(__dirname + '/public/imgs' + path, function(err, data){
			if (err) return send404(res);
			var tmpExt = path.substr(-3);
			if (tmpExt == 'jpg' || 'jpeg'){
				var extType = 'jpeg';
			}
			else if (tmpExt == 'gif'){
				var extType = 'gif'
			}
			else if (tmpExt == 'png'){
				var extType = 'png';
			}
			else{
				send404();
			}
			res.writeHead(200, {'Content-Type': 'image/'+extType })
			res.write(data, 'utf8');
			res.end();
		});
	}	
	else{
		send404(res);
	}
});

send404 = function(res){
	res.writeHead(404);
	res.write('404');
	res.end();
};

server.listen(8080, {
  transportOptions: {
    'xhr-polling': {
      closeTimeout: 1000 * 60 * 5
    }
  }
});
		
// socket.io, I choose you
// simplest chat application evar
var io = io.listen(server),
		buffer = [];
		
io.on('connection', function(client){
	client.send({ buffer: buffer });
	client.broadcast({ announcement: client.sessionId + ' connected' });

	client.on('message', function(message){

		var msg = { message: [client.sessionId, message] };
		buffer.push(msg);
		if (buffer.length > 15) buffer.shift();
		client.broadcast(msg);
			
		sys.puts("txt to search: " + message);	
		if (message){
			var aux = message.split(' ');
			var txtConcat = "";
			for (var i=0; i < aux.length ; i++){
				if (aux[i] && i!=aux.length-1){
					txtConcat += aux[i]+"%20";
				}
				else if (aux[i] && i==aux.length-1){
					txtConcat += aux[i];
				}
			}
			var txt = aux[aux.length-1];
			
			sys.puts("txt: " + txt);
			sys.puts("txtConcat: " + txtConcat);

			twitter(txt,client);
			sapofotos(txt,client);
			sapovideos(txt,client);
		}
	});

	client.on('disconnect', function(){
		client.broadcast({ announcement: client.sessionId + ' disconnected' });
	});
	
	client.on('draw', function(){
		client.broadcast({ announcement: client.sessionId + ' drawn something' });
	});
	
});
