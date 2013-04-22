<?php
    function getTweets($q) { // retieves the latest 5 tweets about a movie
        $hash = preg_replace('/\s/', '', $q);
        $q = "\"%23$hash\"%20OR%20\"".urlencode($q)."\"%20movie%20OR%20film";
        $endpoint = "http://search.twitter.com/search.json?q=$q&rpp=3";
        $curl = curl_init();
	    curl_setopt( $curl, CURLOPT_URL, $endpoint );
	    curl_setopt( $curl, CURLOPT_RETURNTRANSFER, 1 );
	    $result = curl_exec( $curl );
	    curl_close( $curl );
        $tweet_results = json_decode($result, true);
        return $tweet_results['results'];
    }

    $return = array();
    $i = 0;
    if ($_GET['q'] != '') {
        foreach(getTweets($_GET['q']) as $tweet) {
            $return[$i]['user'] = $tweet["from_user"];
            $return[$i]['text'] = $tweet["text"];
            $return[$i]['created_at'] = $tweet["created_at"];
            $return[$i]['photo'] = $tweet["profile_image_url"];
            $i++;
        }
        header('Content-Type: application/json; charset=UTF-8', true);
        echo json_encode($return);
    }
?>