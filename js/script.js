month = Array("January","February","March","April","May","June","July","August","September","October","November","December");
var nextWeek = Boolean;
// on load
$(function () {
    nextWeek = (location.pathname.match('next_week') != null);
    $('.movie-poster[data-fallback]').each(function () {
        url = $(this).data('fallback');
        $(this).css('background-image', 'url(' + url + ')');
    });
    fixSizes();
    var page = document.location.hash.replace('#','');
    if (page != '')
        searchAndGet(page.replace(/-/g, ' '));
    else
        $('.nav-back').click();
});

window.addEventListener('hashchange', function () {
    var page = document.location.hash.replace('#','');
    if (page != '')
        searchAndGet(page.replace(/-/g, ' '));
    else
        $('.nav-back').click();
});

// back button when outside of home page
$('.nav-back').click(function () {
    $('.grid-movie').removeClass('blurred');
    $('.grid-movie-info').removeClass('blurred');
    $('.grid-movie-info').fadeOut();
    $('.movie-profile-tile').fadeOut();
    $('.trailer-mode').fadeOut();
    $('.search-mode').fadeOut();
    $('.grid-movie').delay(500).fadeIn();
    $('.nav-current-page').html('This week');
    if (nextWeek)
        $('.nav-current-page').html('Next week');
    $(this).fadeOut();
    document.location.hash = '';
    if (nextWeek)
        document.title = '#openingweek - Next Week | by Ken Lauguico';
    else
        document.title = '#openingweek | by Ken Lauguico';
});

// hover animation
$('.movie-tile').hover(function () {
    $(this).find('.movie-btns, .hover').addClass('onhover');
}, function () {
    $(this).find('.movie-btns, .hover').removeClass('onhover');
});
$(document).on('mouseenter','.actor-tile', function () {
    $(this).find('.actor-btns, .hover').addClass('onhover');
});
$(document).on('mouseleave','.actor-tile', function () {
    $(this).find('.actor-btns, .hover').removeClass('onhover');
});
$(document).on('mouseenter','.movie-profile-details', function () {
    $(this).find('.actor-btns, .hover').addClass('onhover');
});
$(document).on('mouseleave','.movie-profile-details', function () {
    $(this).find('.actor-btns, .hover').removeClass('onhover');
});


$(window).resize(function () {
    setTimeout(function () {
        fixSizes();
    }, 600);
});

// responsive algorithm
function fixSizes() {
    if ($(window).width() < 500) {
        $('.movie-profile-tile').css({ width: ($(window).width()-8)+"px" });
    } else if ($(window).width() < 700) {
        movieCols = 2;
        actorCols = 2;
        actSize = ($(window).width()/actorCols)-8;
    } else if ($(window).width() < 900) {
        movieCols = 3;
        actorCols = 2;
        actSize = (($(window).width()-500)/actorCols)-9;
    } else if ($(window).width() < 1100) {
        movieCols = 4;
        actorCols = 2;    
        actSize = (($(window).width()-500)/actorCols)-8;
    } else {
        movieCols = 6;
        actorCols = 4;
        actSize = (($(window).width()-500)/actorCols)-8;
    } 

    if ($(window).width() >= 496)
        $('.movie-profile-tile').css({ width: "500px" });

    // update movie tile size
    movWidth = ($(window).width()/movieCols)-6;
    movHeight = (movWidth)*1.456;
    $('.movie-tile').css({
        width: Math.round(movWidth)+"px",
        height: Math.round(movHeight)+"px"
    });
    
    // update actor tile size
    $('.actor-tile').css({
        width: Math.round(actSize)+"px",
        height: Math.round(actSize)+"px"
    });
}

// grab recent tweets, bigger poster, and change to profile view
$('a.movie-info').click(function () {
    index = $(this).index('.movie-info');
    movie = $(this).parent().data('movie-title');
    posterurl = $('.movie-profile-tile[data-movie-title="' + movie + '"] .movie-profile-poster').data('fallback');
    $('.movie-profile-tile[data-movie-title="' + movie + '"] .movie-profile-poster').css('background-image', 'url(' + posterurl + ')');

    $('.nav-current-page').html(movie);

    getSocial(movie);

    $('.grid-movie').fadeOut();
    $('.grid-movie-info').delay(500).fadeIn();
    $('.movie-profile-tile[data-movie-title="' + movie + '"]').delay(800).fadeIn();
    $('.nav-back').fadeIn();
});

// get trailer
$(document).on('click', '.trailer-btn, .trailer-label', function () {
    movie = $(this).parentsUntil('.movie-tile').parent().data('movie-title');
    getTrailer(movie);
});
$(document).on('click', '.movie-underlay, .movie-profile-details, .movie-profile-poster', function () {
    movie = $(this).parent().data('movie-title');
    getTrailer(movie);
});

// search mode
$('.nav-search-btn').click(function () {
    $('.nav-current-page').html('Search');
    $('.search-input').val('');
    $('.grid-movie').addClass('blurred');
    $('.grid-movie-info').addClass('blurred');
    $('.movie-mode').fadeOut();
    window.open("about:blank", "player");
    $('.search-mode').fadeIn();
    $('.search-input').focus();
});

// search movie
$('.search-input').keypress(function (e) {
    if (e.which == 13) { // when enter is pressed
        movie = $(this).val();
        searchAndGet(movie);
    }
});

// exit movie mode
$('.movie-mode, .search-mode').click(function () {
    $('.nav-current-page').html('This week');
    if (nextWeek)
        $('.nav-current-page').html('Next week');
    $('.grid-movie').removeClass('blurred');
    $('.grid-movie-info').removeClass('blurred');
    $(this).fadeOut();
    window.open("about:blank", "player");
});

// search fn
function searchAndGet(movie) {
    $('.movie-profile-tile').hide();
    $('.actor-tile').remove();
    if ($('.movie-profile-tile[data-movie-title="' + movie + '"]').length === 0) {
        $.getJSON("rt", { q: movie.replace('& ', '') })
        .done(function (data) {
            if (data != '') {

                $('.movie-profile-tile[data-movie-title="' + data.title + '"]').remove(); // remove if already exists
                var movietile = '<div class="movie-profile-tile" data-movie-title="' + data.title + '"><img class="movie-profile-poster" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAFElEQVR4XgXAAQ0AAABAMP1L30IDCPwC/o5WcS4AAAAASUVORK5CYII=" data-fallback="' + data.poster.big + '" style="background-image: url(' + data.poster.big + ')"><div class="movie-profile-details" data-cast=\'' + data.cast + '\'><a href="' + data.url + '" class="rt-btn"><i class="icon-rt"></i><label class="rt-meter">' + data.meter + '</label></a><span class="movie-release hover">'+ data.release +'</span><span class="movie-profile-title">' + data.title + '</span><span class="trailer-label">Trailer</span><span class="movie-profile-synopsis">' + data.synopsis + '</span></div><div class="movie-profile-tweets"><ul class="tweet-list"></ul></div></div>';
                $('.grid-movie-info .grid-left').append(movietile);

                getSocial(data.title);

                $('.nav-current-page').html(data.title);
                $('.search-mode').fadeOut();
                $('.grid-movie').fadeOut();
                $('.grid-movie').removeClass('blurred');
                $('.grid-movie-info').removeClass('blurred');
                $('.grid-movie-info').delay(500).fadeIn();
                $('.movie-profile-tile[data-movie-title="' + data.title + '"]').delay(800).fadeIn();
                $('.nav-back').fadeIn();
            }
        });
    } else {
        $('.movie-tile[data-movie-title="' + movie + '"] a.movie-info').click();
    }
}

function getSocial(m) {
    // update page before anything else
    document.location.hash = m.replace(/[^a-zA-Z0-9]/g,'-').replace(/-+/g,'-');
    document.title = m + ' | #openingweek';

    $.getJSON("t/movie.php", { q: m.replace('& ', '') })
    .done(function (data) {
        if (data != '') {
            // empty out tweets before appending new ones
            $('.movie-profile-tile[data-movie-title="' + m + '"] .tweet-list').empty();
            for (i in data) {
                var tweet = hashUrl(atUrl(makeUrl(data[i].text)));
                var tweetli = '<li><div class="tweet-left"><a href="http://twitter.com/' + data[i].user + '"><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAFElEQVR4XgXAAQ0AAABAMP1L30IDCPwC/o5WcS4AAAAASUVORK5CYII=" style="background-image: url(' + data[i].photo + ');"></a></div><div class="tweet-right"><span class="user-tweet">' + tweet + '</span><span class="tweet-time">just now</span></div></li>';
                $('.movie-profile-tile[data-movie-title="' + m + '"] .tweet-list').append(tweetli);
            }
        }
    });

    // empty out cast objects before getting new ones
    $('.actor-tile').remove();
    cast = $('.movie-profile-tile[data-movie-title="' + m + '"] .movie-profile-details').data('cast');
    for (i in cast) { // if twitter accounts are verified
        $.getJSON("t/users.php", { q: cast[i], verify: 1, id: i })
            .done(function (data) {
                $('.actor-tile[data-actor-name="' + data.name + '"]').remove();
                var actortile = '<div class="actor-tile animate" data-actor-name="' + data.name + '" data-id="' + data.id + '"><a href="' + data.url + '" class="actor-underlay hover"></a><img class="actor-photo" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAFElEQVR4XgXAAQ0AAABAMP1L30IDCPwC/o5WcS4AAAAASUVORK5CYII=" data-fallback="" style="background-image: url(' + data.photo.orig + ');"><div class="actor-btns hover"><div class="add-btn"><a href="' + data.url + '"><i class="icon-twitter"></i></a></div></div><a class="actor-info"><span class="actor-name">' + data.name + '</span><span class="actor-twitter hover">@' + data.username + '</span></a></div>';
                $('.grid-movie-info .grid-right').append(actortile);
                fixSizes();
            })
            .error(function () {
                if (t) clearTimeout(t);
                t = setTimeout(function () { remainingCast() }, 500);
            });
    }

    var t;
    actorId = [];
    remainingIds = cast;

    // get the remaining cast
    function remainingCast() {
        for (i in cast) {
            $.getJSON("rt/actor.php", { q: remainingIds[i], id: i })
            .done(function (data) {
                var actortile = '<div class="actor-tile animate" data-actor-name="' + data.name + '" data-id="' + data.id + '"><a href="' + data.url + '" class="actor-underlay hover"></a><img class="actor-photo" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAFElEQVR4XgXAAQ0AAABAMP1L30IDCPwC/o5WcS4AAAAASUVORK5CYII=" data-fallback="" style="background-image: url(' + data.photo.large + ');"><div class="actor-btns hover"><div class="add-btn"><a href="' + data.url + '"><i class="icon-rt"></i></a></div></div><a class="actor-info"><span class="actor-name">' + data.name + '</span></a></div>';
                if ($('.actor-tile[data-id="' + data.id + '"]').length > 0) {
                    $('.actor-tile[data-id="' + data.id + '"] .icon-rt').remove();
                    $('.actor-tile[data-id="' + data.id + '"] .add-btn').append('<a href="' + data.url + '"><i class="icon-rt"></i></a>');
                } else {
                    $('.grid-movie-info .grid-right').append(actortile);
                }
                fixSizes();
            });
        }
    }
}

function getTrailer(m) {
    $('.nav-current-page').html(m + ' - Trailer');
    $('.grid-movie').addClass('blurred');
    $('.grid-movie-info').addClass('blurred');
    $('.movie-mode').fadeIn();
    $.getJSON("yt/trailer.php", { q: m.replace('& ', '') })
        .done(function (data) {
            if (data != '') {
                window.open("http://www.youtube.com/embed/" + data.id + "?autohide=1&autoplay=1&hd=1&iv_load_policy=3", "player");
            }
        });
}

function makeUrl(str) {
    return str.replace(/(?:^|[^"'])((ftp|http|https|file):\/\/[\S]+(\b|$))/gim, '<a href="$1">$1</a>');
}           
function hashUrl(str) { // converts hashtags to urls
    return str.replace(/#((\S+))/gim, "<a href='http://twitter.com/search?q=%23$1&src=hash'>#$1</a>");
}
function atUrl(str) { // converts @usernames to clickable urls
    return str.replace(/@((\w+))/gim, "@<a href='http://twitter.com/$1'>$1</a>");
}

// search anywhere
$(document).on('keypress', function (e) {
    if (!$('.search-mode').is(":visible")) {
        $('.nav-search-btn').click();
    }   
});
