var player;
// setup
function onClientLoad() {
gapi.client.load('youtube', 'v3', onYouTubeApiLoad);
}

function onYouTubeApiLoad() {
gapi.client.setApiKey('AIzaSyDyQYCpkvDQ5oRisCQL9RJQ1jhmvKqGZ4E');
}
// create youtube player
var player;
function onYouTubePlayerAPIReady() {
	player = new YT.Player('player', {
		events: {
		    'onReady': onPlayerReady,
		    'onStateChange': onPlayerStateChange
		}
	});
}

// searching
function search(q) {
	var request = gapi.client.youtube.search.list({
		part: 'snippet',
		q: q
	});
	request.execute(onSearchResponse);
}
// load video
function onSearchResponse(response) {
	var vidId = response.items[0].id.videoId;
	player.loadVideoById(vidId, 0, "large");
}
// autoplay video
function onPlayerReady(event) {
	event.target.playVideo();
}
// event states
function onPlayerStateChange(event) {
	if (event.data === 0) { // when video is at end
		playNext();
	}
}

// create a trailer controller object
var trailer = trailer || {};
var trailer = {
	index: -1,
	playing: false,
	paused: false,
	playVideo: function () {
		// check if paused
		player.playVideo();
	},
	pauseVideo: function () {

	},
	playPrev: function () {
		// current index - 1, if >= 0, else stop
		search(/*movie title of index - 1 trailer*/); // load and play
	},
	playNext: function () {
		// current index + 1
		search(/*movie title of index + 1 trailer*/); // load and play
	},
	stop: function () { // exits trailer mode
		// close trailer mode, go back to current page
	}
};
// create movie object
var Movie = function (index, title, posterimg) {
	var index = index;
	this.title = title;
	this.posterimg = posterimg;
	this.twitter = "";
	this.director = {
		name: "",
		twitter: "",
		profileimg: ""
	};
	this.cast = [];
	this.addCast = function (name) {
		// add twitter api data here
		cast.push({ name: name, twitter: "", profileimg: "" })
	};
	this.synopsis = "";
	var tweets = [];
	function recentTweets() {
		var hash = title.replace(" ", "");
		var q = "\"%23" + hash + "\"%20OR%20\"" + encodeURI(title) + "\"%20movie%20OR%20film";
		var searchUrl = "http://search.twitter.com/search.json?q=" + q + "&rpp=5&callback=?";
		$.ajax({
		    url: searchUrl,
		    dataType: 'jsonp',
		    success: function (data) {
		        for (i in data['results']) {
		            twt = data['results'][i]['text'];
		            addTweet(twt);
		        }
		        loadTweets();
		    },
		    jsonpCallback: "myFunction"
		});
	}
	this.getTweets = function() {
		return tweets;
	}
	function addTweet(txt) {
		tweets.push(txt);
	}
	function loadTweets() {
		for (i in tweets) {
			$('#tweets:eq('+index+')').append("<li>"+tweets[i]+"</li>");
		}
	}
	recentTweets();
	$('#movie:eq('+index+')').append(title);
	$('#poster:eq('+index+')').append('<img src="' + posterimg + '">');
}

/*
function getVerifiedTwitter(name) {
var endpoint = "https://api.twitter.com/1.1/users/search.json?q=" + encodeURI(name) + "&page=1&count=1";
}
*/

// MOVIE PROFILE UI
function openMoviePorfile() {

}

// FUNCTIONALITY OF POSTER UI
window.onresize = function () {

};
function myFunction(r) { console.log(r); }

var movie = [];
movie.push(new Movie(0, "<?php echo $movieName; ?>", "<?php echo $moviePosterURL; ?>"));
