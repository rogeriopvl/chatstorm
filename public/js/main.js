function message(obj){

	var messageValue = '';
	if ('announcement' in obj){
		messageValue = esc(obj.announcement);
	}
	else if ('message' in obj){
		messageValue = esc(obj.message[1]);
	}

	if ('announcement' in obj && obj.announcement.indexOf("connected") != -1){
		// don't show connect messages for now
		// it would be interesting do add a growl-like notification to let people now about new
		// connected clients
	}
	else{
		postIdea(messageValue);
	}
}

function suggestion(obj){
		var type = obj.idea[1];

		if (type == "twitter"){
			//exemplo twitter
			var messageValue = "<em>"+ obj.idea[0][0].from_user + "</em> : " + obj.idea[0][0].text;
			if ('idea' in obj && messageValue != undefined){
				$('#live_searchs').prepend('<div class="boxes"><div id="details">Source: Twitter - Like | Unlike | Preview</div><div class="boxes_content">'+ messageValue +'</div></div>');
			}
		}
		else if (type == "foto"){
			//exemplo acesso sapo
			var messageValue = obj.idea[0]['media:thumbnail'][1].url;
			var maxSizeFoto = obj.idea[0]['media:thumbnail'][0].url;
			if ('idea' in obj && messageValue != undefined){
				$('#live_searchs').prepend('<div class="boxes"><div id="details">Source: Sapo Fotos - Like | Unlike | Preview</div><div class="boxes_content_img"><a rel="shadowbox" href="'+ maxSizeFoto +'"><img src="'+ messageValue +'"/></a></div></div>');
			}
			Shadowbox.setup();
		}
		else if (type == "video"){
			//exemplo acesso video
			var thumbURL = obj.idea[0]['media:content'].url;
			var movURL = obj.idea[0].link+'/mov/1';
			if ('idea' in obj && messageValue != undefined){
				$('#live_searchs').prepend('<div class="boxes"><div id="details">Source: Sapo Videos - Like | Unlike | Preview</div><div class="boxes_content_img"><a rel="shadowbox" href="'+ movURL +'"><img src="'+ thumbURL +'"/></a></div></div>');
			}
			Shadowbox.setup();
		}
		
}

function send(){
	var val = document.getElementById('txtIn').value;
	if(val !== ""){
		console.log("sent val: "+ val);
		socket.send(val);
		postIdea(val, true);
		resetAvailableChar();
		$("#txtIn").val("");
	}
}
      
function esc(msg){
	return msg.replace(/</g, '&lt;').replace(/>/g, '&gt;');
};

/*********************
 Counting chars
 *********************/
var chars = 140;
var limit = 140;

function countChars(){
	chars = $('#txtIn').val().length;
	$('#charsLeft').html(limit - chars);
}

function resetAvailableChar(){
	chars = limit;
	countChars();	
}

/*********************
 Insert in storming area
 *********************/
var numPerRow = 0;
var MAX_PER_ROW = 3;

function postIdea(idea,owner){
	numPerRow++;

	var lastContainer = $(".row:last");
	if ( lastContainer.length == 0){
		$("#chat").append('<div class="row"></div>');
		lastContainer = $(".row:last");
	}

	if (numPerRow > MAX_PER_ROW){
		numPerRow = 1;
		lastContainer.after('<div class="row"></div>');
		lastContainer = $(".row:last");
	}

	if(owner){
		var ideaNode = $('<div class="my_idea flexible">'+ idea +'</div>');
	}
	else{
		var ideaNode = $('<div class="idea flexible">'+ idea +'</div>');
	}
	lastContainer.append(ideaNode);
	$("#chat").scrollTop(1000000);
}

/* Init SOCKET.IO connection */
var socket = new io.Socket(null, {port: 8080, rememberTransport: false});
socket.connect();
socket.on('message', function(obj){
	
	if ('buffer' in obj){
		document.getElementById('form').style.display='block';
		$('#chat').html('');

		for (var i in obj.buffer) message(obj.buffer[i]);
	} 
	else if ('message' in obj){
		message(obj);
	}
	else if ('announcement' in obj){
		message(obj);
	}
	else if ('idea' in obj){
		suggestion(obj);
	}
});

/*********************
 When DOM is ready...
 *********************/
$(document).ready(function(){

	/* Bind char counter events */
	$("#txtIn").keyup(function(){
		setTimeout(function(){},1);
		countChars();
	});
	
	$("#txtIn").keydown(function(event){
		if(document.getElementById('txtIn').value.length >= limit && (event.keyCode != '13')  && (event.keyCode != '8')){
			return false;
		}
		else if(document.getElementById('txtIn') == 8){
			send();
		}
	});
});
