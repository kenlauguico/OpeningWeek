<?php
    function getPoster ($q) {
        //$q = preg_replace(/[^a-zA-Z0-9]/,'_',$q);
        //$q = preg_replace(/_+/,'_',$q);
        // setup search and make connection
        $endpoint = 'http://sg.media-imdb.com/suggests/'.substr($q,0).'/'.$q.'.json';
        /*
        $curl = curl_init();
	    curl_setopt( $curl, CURLOPT_URL, $endpoint );
	    curl_setopt( $curl, CURLOPT_RETURNTRANSFER, 1 );
	    $data = curl_exec( $curl );
	    curl_close( $curl );
        // close connection and get content
        $poster = $data;
        if ($poster === NULL) die('Error parsing json');
        */
        $data = file_get_contents($endpoint);
        echo var_dump($data);     
    }

    header('Content-Type: application/json; charset=UTF-8', true);

    if ($_GET['q'] != '') {
        getPoster($_GET['q']);
    }

?>