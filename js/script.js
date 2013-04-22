$(function () {
    $('.movie-poster[data-fallback]').each(function () {
        url = $(this).data('fallback');
        $(this).css('background-image', 'url(' + url + ')');
    });
    fixSizes();
});

$('.top-nav-bar').click(function() {
    $('.grid-movie-info').fadeOut();
    $('.movie-profile-tile').fadeOut();
    $('.grid-movie').delay(500).fadeIn();
});

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

$(window).resize(function () {
    fixSizes();
});

function fixSizes() {
    // update movie tile size
    movWidth = ($(window).width()/4)-5;
    movHeight = (movWidth)*1.456;
    $('.movie-tile').css({
        width: movWidth+"px",
        height: movHeight+"px"
    });
    
    // update actor tile size
    actSize = (($(window).width()-500)/4)-6;
    $('.actor-tile').css({
        width: actSize+"px",
        height: actSize+"px"
    });
}

// grab recent tweets, bigger poster, and change to profile view
$('a.movie-info').click(function () {
    index = $(this).index('.movie-info');
    movie = $(this).parent().data('movie-title');
    posterurl = $('.movie-profile-tile[data-movie-title="' + movie + '"] .movie-profile-poster').data('fallback');
    $('.movie-profile-tile[data-movie-title="' + movie + '"] .movie-profile-poster').css('background-image', 'url(' + posterurl + ')');

    // empty out tweets before getting new ones
    $('.movie-profile-tile[data-movie-title="' + movie + '"] .tweet-list').empty();
    $.getJSON("t/movie.php", { q: movie })
    .done(function (data) {
        if (data != '') {
            for (i in data) {
                var tweet = hashUrl(atUrl(makeUrl(data[i].text)));
                var tweetli = '<li><div class="tweet-left"><a href="http://twitter.com/' + data[i].user + '"><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAFElEQVR4XgXAAQ0AAABAMP1L30IDCPwC/o5WcS4AAAAASUVORK5CYII=" style="background-image: url(' + data[i].photo + ');"></a></div><div class="tweet-right"><span class="user-tweet">' + tweet + '</span><span class="tweet-time">just now</span></div></li>';
                $('.movie-profile-tile[data-movie-title="' + movie + '"] .tweet-list').append(tweetli);
            }
        }
    });

    // empty out cast objects before getting new ones
    $('.actor-tile').remove();
    cast = $('.movie-profile-tile[data-movie-title="' + movie + '"] .movie-profile-details').data('cast');
    for (i in cast) { // if twitter accounts are verified
        $.getJSON("t/users.php", { q: cast[i], verify: 0 })
            .done(function (data) {
                var actortile = '<div class="actor-tile" data-actor-name="' + data.name + '"><a class="actor-underlay hover"></a><img class="actor-photo" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAFElEQVR4XgXAAQ0AAABAMP1L30IDCPwC/o5WcS4AAAAASUVORK5CYII=" data-fallback="" style="background-image: url(' + data.photo.orig + ');"><div class="actor-btns hover"><a href="' + data.url + '" class="add-btn"><i class="icon-twitter"></i></a></div><a class="actor-info"><span class="actor-name">' + data.name + '</span><span class="actor-twitter hover">@' + data.username + '</span></a></div>';
                $('.grid-movie-info .grid-right').append(actortile);
                fixSizes();
            })
            .fail(function () {
                //fallbackImages();
            });
    }

    $('.grid-movie').fadeOut();
    $('.grid-movie-info').delay(500).fadeIn();
    $('.movie-profile-tile[data-movie-title="' + movie + '"]').delay(800).fadeIn();
});

// grab cast twitter data
$('.movie-poster #tweets').click(function () {
    index = $(this).index('.movie-poster #tweets');
    movie = $(this).parent().attr('data-movie-title');
    cast = $('.movie-profile-tile[data-movie-title="'+movie+'" .movie-profile-details').data('cast');
    for (i in cast) { // if twitter accounts are verified
        $.getJSON("t/users.php", { q: cast[i], verify: 1 })
            .done(function (data) {
                var twitterLink = '<a href="' + data.url + '"><img src="' + data.photo.medium + '">' + data.name + '</a> ';
                var actortile = '<div class="actor-tile" data-actor-name="'+data.name+'"><a class="actor-underlay hover"></a><img class="actor-photo" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAFElEQVR4XgXAAQ0AAABAMP1L30IDCPwC/o5WcS4AAAAASUVORK5CYII=" data-fallback="" style="background-image: url('+data.photo.orig+');"><div class="actor-btns hover"><a href="'+data.url+'" class="add-btn">+</a></div><a class="actor-info"><span class="actor-name">'+data.name+'</span><span class="actor-twitter hover">'+data.username+'</span></a></div>';
                $('.grid-movie-info').append(actortile);
            })
            .fail(function () {
                //fallbackImages();
            });
    }
    /*for (i in cast) {
        function fallbackImages() {
            if ($('[data-actor="' + d.name + '"]').length == 0) {
                $.getJSON("rt/actor.php", { q: d.name })
            .done(function (data) {
                var display = '<img src="' + data.photo.small + '">' + data.name + ' ';
                $('.movie-poster:eq(' + index + ') .twitter').append("<div data-actor='" + data.name + "'>" + display + "</div>");
            });
            }
        }
    }*/
});

// get trailer
$('.movie-underlay, .trailer-btn, .movie-profile-details').click(function () {
    movie = $(this).parent().data('movie-title');
    $('.grid-movie').addClass('blurred');
    $('.grid-movie-info').addClass('blurred');
    $('.movie-mode').fadeIn();
    $.getJSON("yt/trailer.php", { q: movie })
        .done(function (data) {
            if (data != '') {
                window.open("http://www.youtube.com/embed/"+data.id+"?autohide=1&autoplay=1&hd=1&iv_load_policy=3","player");
            }
        });
});

$('.movie-mode') .click(function() {
    $('.grid-movie').removeClass('blurred');
    $('.grid-movie-info').removeClass('blurred');
    $('.movie-mode').fadeOut();
    window.open("about:blank","player");
})

function makeUrl(str) {
    return str.replace(/(?:^|[^"'])((ftp|http|https|file):\/\/[\S]+(\b|$))/gim, '<a href="$1">$1</a>');
}           
function hashUrl(str) { // converts hashtags to urls
    return str.replace(/#((\w+))/gim, "<a href='http://twitter.com/search?q=%23$1&src=hash'>#$1</a>");
}
function atUrl(str) { // converts @usernames to clickable urls
    return str.replace(/@((\w+))/gim, "@<a href='http://twitter.com/$1'>$1</a>");
}


