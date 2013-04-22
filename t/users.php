<?php
    include_once('../simple_html_dom.php');

    function twitterVerified($name) {
        global $tw_name, $tw_account, $tw_photo;
        if ($name == '')
            exit;
        // setup search and make connection
        $name = rawurlencode(urlencode($name));
        $endpoint = 'http://try.jsoup.org/fetch?url=https%3A%2F%2Ftwitter.com%2Fsearch%2Fusers%3Fq%3D'.$name.'&ua=Mozilla%2F5.0+(Windows+NT+6.2%3B+WOW64)+AppleWebKit%2F537.31+(KHTML%2C+like+Gecko)+Chrome%2F26.0.1410.64+Safari%2F537.31&parser=html&pretty=on&whitelist=disabled';
        $curl = curl_init();
	    curl_setopt( $curl, CURLOPT_URL, $endpoint );
	    curl_setopt( $curl, CURLOPT_RETURNTRANSFER, 1 );
	    $result = curl_exec( $curl );
	    curl_close( $curl );
        // close connection and get content
        $html = new simple_html_dom();
        $html->load(preg_replace('/\\\./','',$result));
        // give variables $tw_name and $tw_account
        $user = $html->find('.account-group',0);
        $tw_name = $user->find('.fullname',0)->plaintext;
        $tw_account = str_replace('/','',$user->href);
        $tw_photo = $user->find('img',0)->src;
        return $user->find('.visuallyhidden',0)->plaintext != '';
    }  

    $return = array();

    if ($_GET['verify'] == 1) {
        if(twitterVerified($_GET['q'])) {
            $return['name'] = $tw_name;
            $return['username'] = $tw_account;
            $return['url'] = "http://twitter.com/$tw_account";
            $return['photo']['small'] = $tw_photo;
            $return['photo']['medium'] = str_replace('_normal','_bigger',$tw_photo);
            $return['photo']['orig'] = str_replace('_normal','',$tw_photo);
        }
    } elseif ($_GET['verify'] == 0) {
        twitterVerified($_GET['q']); // just to load
        $return['name'] = $tw_name;
        $return['username'] = $tw_account;
        $return['url'] = "http://twitter.com/$tw_account";
        $return['photo']['small'] = $tw_photo;
        $return['photo']['medium'] = str_replace('_normal','_bigger',$tw_photo);
        $return['photo']['orig'] = str_replace('_normal','',$tw_photo);
    } else {
        $return['name'] = urldecode($_GET['q']);
        $return['success'] = FALSE;
        $return['error'] = TRUE;
    }

    header('Content-Type: application/json; charset=UTF-8', true);
    echo json_encode($return);
      
    /*
    foreach ($mv as $movie) {
        echo "<h2>The ".$movie->title." cast's twitters</h2>";
        foreach ($movie->cast as $actor) {
            if (twitterVerified($actor)) {
                array_push($movie->cast_twitter, $tw_account);
                echo "<a href='http://twitter.com/$tw_account'>$actor</a>, ";
            }
        }
    }*/
?>