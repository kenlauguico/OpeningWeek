<?php
    include_once('../simple_html_dom.php');

    function getActor ($name) {
        global $actor;
        $name = rawurlencode($name);
        // setup search and make connection
        $endpoint = 'http://www.rottentomatoes.com/search/json/?q='.$name;
        $curl = curl_init();
	    curl_setopt( $curl, CURLOPT_URL, $endpoint );
	    curl_setopt( $curl, CURLOPT_RETURNTRANSFER, 1 );
	    $result = curl_exec( $curl );
	    curl_close( $curl );
        // close connection and get content
        $html = new simple_html_dom();
        $html->load($result);
        $actor = $html->find('li[actor] img',0);
        return $actor->alt != 'null';
    }

    header('Content-Type: application/json; charset=UTF-8', true);

    $return = array();
    if ($_GET['q'] != '') {
        if (getActor($_GET['q'])) {
            $url = $actor->src;
            $return['name'] = $actor->alt;
            $return['photo']['small'] = $url;
            $return['photo']['medium'] = str_replace('_tmb','_mob',$url);
            $return['photo']['large'] = str_replace('_tmb','_ori',$url);
        } else {
            $return['success'] = FALSE;
            $return['error'] = TRUE;
        }
        echo json_encode($return);
    }

?>