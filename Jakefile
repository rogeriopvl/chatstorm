var sys = require("sys");
var exec = require("child_process").exec

task("default", [], function(){
	exec('jake --tasks', function(error, stdout, stderr){
		sys.puts(stdout);
	});
});

// not recomended to use yet, somehow the server output is missing...
desc('Starts chatstorm/node server')
task("server", [], function(params){
	exec('node server.js', function(error, stdout, stderr){
		sys.puts(stdout);
	});
});
