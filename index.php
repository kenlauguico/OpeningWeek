<?php
    $apikey = 'raha5wksgk9fwzcquyaguvc3';
    {   // Rotten Tomatoes API
        // construct the query with our apikey and the query we want to make
        $endpoint = 'http://api.rottentomatoes.com/api/public/v1.0/lists/movies/opening.json?apikey=' . $apikey . '&limit=12';
        
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

    class Movie { // create Movie class to better organize and store data
        public $title = "";
        public $synopsis = "";
        public $cast = array();
        public $poster = "";
    }
?>
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="utf-8" />
        <title>#openingweek | by Ken Lauguico</title>
        <link href='http://fonts.googleapis.com/css?family=Lato:400,900' rel='stylesheet' type='text/css'>
        <link href="css/style.css" rel="stylesheet">
    </head>
    <body>
        <div class="top-nav-bar"><span class="nav-back">back</span><div style="margin: auto; font-size: 30px; font-weight: 900; color: white; text-align: center;">#openingweek</div>
        </div>
        <div class="content">
        <div class="grid-movie">
        <?php
            //$mv = array();
            $i = 0;
            foreach($search_results["movies"] as $movie) {
                $mv[$i] = new Movie();
                $mv[$i]->title = $movie["title"];
                $mv[$i]->synopsis = $movie["synopsis"];
                $mv[$i]->poster = $movie["posters"]["original"];
                foreach($movie["abridged_cast"] as $actor) {
                    $actor = $actor["name"];
                    array_push($mv[$i]->cast,$actor);
                }

                $synopsis = $movie["synopsis"];
                $movieName = $movie["title"];
                $moviePosterURL = $movie["posters"]["detailed"];
                $RTscore = $movie["ratings"]["critics_score"];
                if ($RTscore < 0)
                    $RTscore = 0;

                echo <<<MOVIE_TILE
<div class="movie-tile animate" data-movie-title="{$movieName}">
            <a class="movie-underlay hover"></a>
            <img class="movie-poster" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAFElEQVR4XgXAAQ0AAABAMP1L30IDCPwC/o5WcS4AAAAASUVORK5CYII=" data-fallback="{$moviePosterURL}">
            <div class="movie-btns hover">
                <a href="{$movie['links']['alternate']}" class="rt-btn"><label class="rt-meter">{$RTscore}%</label></a>
                <a class="trailer-btn"><i class="icon-play"></i></a>
            </div>
            <a class="movie-info">
                <span class="movie-title">{$movieName}</span>
                <span class="movie-more hover">MORE INFO</span>
            </a>
</div>
MOVIE_TILE;

                /*
                echo '<div class="movie-poster" data-movie-title="'.$movieName.'" data-cast=\'[';
                foreach($movie["abridged_cast"] as $actor) {
                    $actor = $actor["name"];
                    echo '"'.$actor.'",';
                    //array_push($mv[$i]->cast,$actor);
                }
                echo '""]\'>';
                echo '<span class="movie-title">'.$movieName.'</span>';
                echo '<img src="'.$moviePosterURL.'">';
                echo '<span class="twitter"></span>';
                echo '<div class="synopsis" style="display: none;">'.$synopsis.'</div>';
                echo '<ul id="tweets">';
                echo "</ul>";
                echo "</div>";*/
                $i++;
            }
        ?>
        </div>
        <div class="grid-movie-info">
            <div class="grid-left" style="display: table-cell;">
            <?php
                foreach($mv as $movie) {
                    $title = $movie->title;
                    $synopsis = $movie->synopsis;
                    $cast = json_encode($movie->cast);
                    $poster = $movie->poster;
                    echo <<<MOVIEINFO_TILE
<div class="movie-profile-tile" data-movie-title="{$title}">
                <img class="movie-profile-poster" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAFElEQVR4XgXAAQ0AAABAMP1L30IDCPwC/o5WcS4AAAAASUVORK5CYII=" data-fallback="{$poster}">
                <div class="movie-profile-details"
MOVIEINFO_TILE;
                 echo "data-cast='$cast'>";
                 echo <<<MOVIEINFO_TILE
<span class="movie-profile-title">{$title}</span>
                    <span>Trailer</span>
                    <span class="movie-profile-synopsis">{$synopsis}</span>
                </div>
                <div class="movie-profile-tweets">
                    <ul class="tweet-list"></ul>
                </div>
            </div>
MOVIEINFO_TILE;
                }

            ?>
        </div>
        <div class="grid-right" style="display: table-cell; vertical-align: top;"></div>
        </div>
        </div>
        <div class="footer">Created by <a href="http://kenlauguico.com">Ken Lauguico</a> in 36 hours.</div>
        <div class="movie-mode">
            <iframe class="youtube-player" type="text/html" src="" frameborder="0" name="player"></iframe>
        </div>
        <script src="//ajax.googleapis.com/ajax/libs/jquery/2.0.0/jquery.min.js"></script>
        <script src="js/script.js" type="text/javascript"></script>
    </body>
</html>