<?php
    function yt_getFirstVideo($q) { // function that grabs first YouTube URL with search query
        $endpoint = 'http://gdata.youtube.com/feeds/api/videos?q=' . urldecode($q.' trailer') . '&orderby=relevance';
        $yt_search_results = simplexml_load_file($endpoint);
        $vidId = split('videos/',$yt_search_results->entry[0]->id);
        //return 'http://youtube.com/watch?v=' . $vidId[1];
        return $vidId[1];
    }

    $return = array();

    if ($_GET['q'] != '') {
        $vidId = yt_getFirstVideo($_GET['q']);
        $return['id'] = $vidId;
        $return['url'] = 'http://youtube.com/watch?v=' . $vidId;
        $return['player'] = 'http://www.youtube.com/v/'.$vidId.'?version=3&f=videos&app=youtube_gdata';
        
        header('Content-Type: application/json; charset=UTF-8', true);
        
        echo json_encode($return);
    }
?>