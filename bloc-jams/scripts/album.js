//setting Album info to html
var setCurrentAlbum = function(album) {
    currentAlbum = album;
    var $albumTitle = $('.album-view-title');
    var $albumArtist = $('.album-view-artist');
    var $albumReleaseInfo = $('.album-view-release-info');
    var $albumImage = $('.album-cover-art');
    var $albumSongList = $('.album-view-song-list');

    $albumTitle.text(album.title);
    $albumArtist.text(album.artist);
    $albumReleaseInfo.text(album.year + ' ' + album.label);;
    $albumImage.attr('src', album.albumArtUrl);

    $albumSongList.empty();

    for (var i = 0; i < album.songs.length; i++) {
        var $newRow = createSongRow(i + 1, album.songs[i].title, album.songs[i].duration);
        $albumSongList.append($newRow);
    }
};

//switch album cover & song info when clicked on album cover art\
var switchAlbumCoverArt = function() {
    counter++;
    if (counter >= albumList.length) {
        counter = 0;
    }
    setCurrentAlbum(albumList[counter]);
};

//creates song row, handles click, pause, & hover.
var createSongRow = function(songNumber, songName, songLength) {
    var template = '<tr class="album-view-song-item">' +
        '   <td class="song-item-number" data-song-number="' + songNumber + '">' + songNumber + '</td>' +
        '   <td class="song-item-title">' + songName + '</td>' +
        '   <td class="song-item-duration">' + songLength + '</td>' +
        '</tr>';

    var $row = $(template);
    //did not change songnumber to parseInt, instead, just did not do strict inequality
    var onHover = function(event) {
        var sin = $(this).find('.song-item-number');
        var sin_attr = sin.attr('data-song-number');

        if (currentSongPlayingNumber != sin_attr) {
            sin.html(playButtonTemplate);
        }
    };
    var offHover = function(event) {
        var sin = $(this).find('.song-item-number');
        var sin_attr = sin.attr('data-song-number');

        if (currentSongPlayingNumber != sin_attr) {
            sin.html(sin_attr);
        }
    };
    var clickHandler = function() {
        var sin_attr = $(this).attr('data-song-number');
        //if user clicks play button on a new song. 
        if (currentSongPlayingNumber == null) {
            $(this).html(pauseButtonTemplate);
            setSong(songNumber);
            updatePlayerBarSong();
        //if user click pause button on the same song.
        } else if (currentSongPlayingNumber == sin_attr) {
            $(this).html(playButtonTemplate);
            currentSongPlayingNumber = null;
            currentAlbumSong = null;
            $('.main-controls .play-pause').html(playerBarPlayButton);
            // if user clicks play buttton on a different song while a song is already playing.
        } else if (currentSongPlayingNumber != sin_attr) {
            var currentSongPlayingNumberElement = getSongNumberCell(currentSongPlayingNumber);
            currentSongPlayingNumberElement.html(currentSongPlayingNumber);
            $(this).html(pauseButtonTemplate);
            setSong(songNumber);
            // currentAlbumSong = currentAlbum.songs[sin_attr - 1]; //currentAlbumSong gets the switched song
            updatePlayerBarSong();
        }
    };

    $row.find('.song-item-number').click(clickHandler);
    $row.hover(onHover, offHover);
    return $row;
};

//updates player bar w/ html info
var updatePlayerBarSong = function(event) {
    $('.currently-playing .song-name').text(currentAlbumSong.title);
    $('.currently-playing .artist-name').text(currentAlbum.artist);
    $('.currently-playing .artist-song-mobile').text(currentAlbumSong.title + ' - ' + currentAlbum.artist);
    $('.main-controls .play-pause').html(playerBarPauseButton);
};

//track index of the song that is getting played.
var trackIndex = function(album, song) {
    return album.songs.indexOf(song);
};

//click "next button" on the player bar
var nextSong = function() {
    var currentSongIndex = trackIndex(currentAlbum, currentAlbumSong),
        lastSongNumber = currentSongPlayingNumber;

    currentSongIndex++;

    if (currentSongIndex >= currentAlbum.songs.length) {
        currentSongIndex = 0;
    }
    currentSongPlayingNumber = currentSongIndex + 1;
    currentAlbumSong = currentAlbum.songs[currentSongIndex];

    updatePlayerBarSong();

    var $nextSongNumberCell = $('.song-item-number[data-song-number="' + currentSongPlayingNumber + '"]');
    var $lastSongNumberCell = $('.song-item-number[data-song-number="' + lastSongNumber + '"]');

    $nextSongNumberCell.html(pauseButtonTemplate);
    $lastSongNumberCell.html(lastSongNumber);
};

//click "prev button" on the player bar
var prevSong = function() {
    var currentSongIndex = trackIndex(currentAlbum, currentAlbumSong),
        lastSongNumber = currentSongPlayingNumber;
    currentSongIndex--;

    if (currentSongIndex < 0) {
        currentSongIndex = currentAlbum.songs.length - 1;
    }
    currentSongPlayingNumber = currentSongIndex + 1;
    currentAlbumSong = currentAlbum.songs[currentSongIndex];

    updatePlayerBarSong();

    var $prevSongNumberCell = $('.song-item-number[data-song-number="' + currentSongPlayingNumber + '"]');
    var $lastSongNumberCell = $('.song-item-number[data-song-number="' + lastSongNumber + '"]');

    $prevSongNumberCell.html(pauseButtonTemplate);
    $lastSongNumberCell.html(lastSongNumber);
};
    
//set Attribute number & album song number for currently playing song.
var setSong = function(songNumber) {
    currentSongPlayingNumber = parseInt(songNumber);
    currentAlbumSong = currentAlbum.songs[songNumber - 1];
};

// retrieve attribute number of curretnly playing song.
var getSongNumberCell = function(number) {
    return $('.song-item-number[data-song-number="' + number + '"]');
};


var $AlbumCoverArtImage = $('.album-view .album-cover-art');
var albumList = [albumPicasso, albumMarconi],
    counter = 0;
var playButtonTemplate = '<a class="album-song-button"><i class="fa fa-caret-right fa-2x"></i></a>';
var pauseButtonTemplate = '<a class="song-pause-button"><i class="fa fa-pause" ></i></a>';
var playerBarPlayButton = '<i class="fa fa-play"></i>'
var playerBarPauseButton = '<i class="fa fa-pause"></i>'
var currentSongPlayingNumber = null;
var currentAlbum = null;
var currentAlbumSong = null;
var $nextButton = $('.main-controls .next');
var $prevButton = $('.main-controls .previous');

$(document).ready(function() {
    setCurrentAlbum(albumPicasso);
    $AlbumCoverArtImage.click(switchAlbumCoverArt);
    $nextButton.click(nextSong);
    $prevButton.click(prevSong);
});