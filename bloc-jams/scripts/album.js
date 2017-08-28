
var songRows = document.getElementsByClassName('album-view-song-item');
var playButtonTemplate = '<a class="album-song-button"><i class="fa fa-caret-right fa-2x"></i></a>';
var pauseButtonTemplate = '<a class="song-pause-button"><i class="fa fa-pause" ></i></a>';
var songPlayingNumber = null;
var currentAlbum=null;

var createSongRow = function(songNumber, songName, songLength) {
    var template = '<tr class="album-view-song-item">' 
    +'   <td class="song-item-number" data-song-number="' + songNumber + '">' + songNumber + '</td>' 
    +'   <td class="song-item-title">' + songName + '</td>' 
    +'   <td class="song-item-duration">' + songLength + '</td>' 
    +'</tr>';

    var $row= $(template);

    var onHover= function(event)
    {
        var sin= $(this).find('.song-item-number');
        var sin_attr= sin.attr('data-song-number');

        if(songPlayingNumber!=sin_attr){
            sin.html(playButtonTemplate);
        }
    };
    var offHover= function(event)
    {
        var sin= $(this).find('.song-item-number');
        var sin_attr= sin.attr('data-song-number');

        if(songPlayingNumber!=sin_attr){
            sin.html(sin_attr);
        }
    };
    var clickHandler= function()
    {
        // var sin=$(this).find('.song-item-number');
        console.log($(this));
        var sin_attr= $(this).attr('data-song-number');
        console.log(sin_attr+' a')
        console.log(songPlayingNumber+ ' song#')
   
        if (songPlayingNumber == null) {
            //if user clicks play button on a new song.
            $(this).html(pauseButtonTemplate);
            songPlayingNumber = sin_attr;
        }
        else if (songPlayingNumber == sin_attr){
            //if user click pause button on the same song.
            $(this).html(playButtonTemplate);
            songPlayingNumber=null;
        }
        else if (songPlayingNumber !== null){
            // if user clicks play buttton on a different song while current song is playing.
            var currentsongPlayingNumberElement = $('.song-item-number[data-song-number="' + songPlayingNumber + '"]');
            currentsongPlayingNumberElement.html(songPlayingNumber);
            $(this).html(pauseButtonTemplate);
            songPlayingNumber=$(this).attr('data-song-number');
        }             

    };
 
    $row.find('.song-item-number').click(clickHandler);
    $row.hover(onHover, offHover);
    return $row;
};


var setCurrentAlbum = function(album) {
    currentAlbum=album;
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

var i = document.getElementsByClassName('album-cover-art')[0];
var a = [albumPicasso, albumMarconi, albumTesla],
    counter = 0;
i.addEventListener('click', function(event) {
    setCurrentAlbum(a[counter]);
    counter++;
    if (counter >= a.length) {
        counter = 0;
    }
});


$(document).ready(function()
{
    setCurrentAlbum(currentAlbum);
}); 
