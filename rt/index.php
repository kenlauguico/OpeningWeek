<?php
    $apikey = 'raha5wksgk9fwzcquyaguvc3';
    {   // Rotten Tomatoes API
        // construct the query with our apikey and the query we want to make
        $endpoint = 'http://api.rottentomatoes.com/api/public/v1.0/movies.json?apikey=' . $apikey .'&q='. urlencode($_GET['q']) .'&page_limit=1';
        
        // setup curl to make a call to the endpoint
        $session = curl_init($endpoint);

        // indicates that we want the response back
        curl_setopt($session, CURLOPT_RETURNTRANSFER, true);

        // exec curl and get the data back
        $data = curl_exec($session);

        // remember to close the curl session once we are finished retrieveing the data
        curl_close($session);

        // decode the json data to make it easier to parse the php
        $search_results = json_decode($data, true);
        if ($search_results === NULL) die('Error parsing json');
    }
    $month_names = array("January","February","March","April","May","June","July","August","September","October","November","December");

    $return = array();

    if ($_GET['q'] != '') {
        $movie = $search_results["movies"][0];

        $return['title'] = $movie["title"];
        $return['release'] = $movie["release_dates"]["theater"];
        $return['synopsis'] = $movie["synopsis"];
        $return['poster']['medium'] = $movie["posters"]["detailed"];
        $return['poster']['big'] = $movie["posters"]["original"];
        $return['meter'] = $movie["ratings"]["critics_score"];
        if ($return['meter'] <= 0)
            $return['meter'] = '';
        else
            $return['meter'] = $return['meter'].'%';
        $return['url'] = $movie["links"]["alternate"];
        $return['cast'] = array();

        $releaseDate = split('-', $return['release']);
        $releaseMonth = $month_names[intval($releaseDate[1])-1];
        $releaseDay = intval($releaseDate[2]);
        $releaseYear = $releaseDate[0];
        $return['release'] = "$releaseMonth $releaseDay, $releaseYear";

        foreach($movie["abridged_cast"] as $actor) {
            array_push($return['cast'],str_replace('\'','',$actor["name"]));
        }
        $return['cast'] = json_encode($return['cast']);
		
		header('Content-Type: application/json; charset=UTF-8', true);
        echo json_encode($return);
    }
?>