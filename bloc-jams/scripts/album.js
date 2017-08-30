var albumPicasso = {
    title: 'The Colors',
    artist: 'Pablo Picasso',
    label: 'Cubism',
    year: '1881',
    albumArtUrl: 'assets/images/album_covers/01.png',
    songs: [{
            title: 'Blue',
            duration: '4:26'
        },
        {
            title: 'Green',
            duration: '3:14'
        },
        {
            title: 'Red',
            duration: '5:01'
        },
        {
            title: 'Pink',
            duration: '3:21'
        },
        {
            title: 'Magenta',
            duration: '2:15'
        }
    ]
};
var albumMarconi = {
    title: 'The Telephone',
    artist: 'Guglielmo Marconi',
    label: 'EM',
    year: '1909',
    albumArtUrl: 'assets/images/album_covers/20.png',
    songs: [{
            title: 'Hello, Operator?',
            duration: '1:01'
        },
        {
            title: 'Ring, ring, ring',
            duration: '5:01'
        },
        {
            title: 'Fits in your pocket',
            duration: '3:21'
        },
        {
            title: 'Can you hear me now?',
            duration: '3:14'
        },
        {
            title: 'Wrong phone number',
            duration: '2:15'
        }
    ]
};

var playButtonTemplate = '<a class="album-song-button"><i class="fa fa-caret-right fa-2x"></i></a>';
var pauseButtonTemplate = '<a class="song-pause-button"><i class="fa fa-pause" ></i></a>';
var songPlaying = null;

var createSongRow = function(songNumber, songName, songLength) {
    var template = '<tr class="album-view-song-item">'
    +'   <td class="song-item-number" data-song-number="' + songNumber + '">' + songNumber + '</td>'
    +'   <td class="song-item-title">' + songName + '</td>'
    +'   <td class="song-item-duration">' + songLength + '</td>'
    +'</tr>';

    var $row= $(template);

    var clickHandler= function()
    {
        var sin_attr= $(this).attr('data-song-number');

        if (songPlaying ===null) {
            $(this).html(pauseButtonTemplate);
            songPlaying = sin_attr;
        }
        else if (songPlaying === sin_attr){
            $(this).html(playButtonTemplate);
            songPlaying = null;
        }
        else if (songPlaying !== sin_attr){
            var currentSongPlayingElement = $(document).find('[data-song-number="' + songPlaying + '"]');
            currentSongPlayingElement.html(songPlaying);
            $(this).html(pauseButtonTemplate);
            songPlaying = sin_attr;
        }

    }

    var onHover= function(event)
    {
        var sin= $(this).find('.song-item-number');
        var sin_attr= sin.attr('data-song-number');

        if(songPlaying !== sin_attr){
            sin.html(playButtonTemplate);
        }
    };
    var offHover= function(event)
    {
        var sin= $(this).find('.song-item-number');
        var sin_attr= sin.attr('data-song-number');

        if(songPlaying !== sin_attr){
            sin.html(sin_attr);
        }
    };

    $row.find('.song-item-number').click(clickHandler);
    $row.hover(onHover, offHover);
    return $row;
};


var setCurrentAlbum = function(album) {
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


$(document).ready(function()
{
    setCurrentAlbum(albumPicasso);
});