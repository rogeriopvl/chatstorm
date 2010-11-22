function lastFMcall(artist){
    //popcorn.VideoCommand.call(this, name, params, text, videoManager);
    // Setup a default, hidden div to hold the images

	var id="caixa2";
	var paramstarget="lastfmdiv";
	
	//var artist = "Nirvana";

    var target = document.createElement('div');
    target.setAttribute('id', id);
    document.getElementById(paramstarget).appendChild(target);
    // Div is hidden by default
    target.setAttribute('style', 'display:inline');
	var htmlString = '';

    // This uses jquery
	$.getJSON("http://ws.audioscrobbler.com/2.0/?method=artist.getinfo&artist="+ artist +"&api_key=30ac38340e8be75f9268727cb4526b3d&format=json&callback=?",
		function(data){
		    htmlString += '<h3>'+data.artist.name+'</h3>';
	      htmlString += '<a href="'+data.artist.url+'" target="_blank" style="float:left;margin:0 10px 0 0;"><img src="'+ data.artist.image[2]['#text'] +'" alt=""></a>';
		    htmlString += '<p>'+ data.artist.bio.summary +'</p>';
		    htmlString += '<hr /><p><h4>Tags</h4><ul>';
		    $.each(data.artist.tags.tag, function(i,val) {
		      htmlString += '<li><a href="'+ this.url +'">'+ this.name +'</a></li>';
		    });
		    htmlString += '</ul></p>';
		    htmlString += '<hr /><p><h4>Similar</h4><ul>';
		    $.each(data.artist.similar.artist, function(i,val) {
		      htmlString += '<li><a href="'+ this.url +'">'+ this.name +'</a></li>';
		    });
		    htmlString += '</ul></p>';
	      target.innerHTML = htmlString;
	    }
	  );
}
