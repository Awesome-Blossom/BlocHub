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
var albumTesla = {
    title: 'Wizard of the West',
    artist: 'Nikola Tesla',
    label: 'EM',
    year: '1882',
    albumArtUrl: 'assets/images/album_covers/23.png',
    songs: [{
            title: 'Inspiration in mind',
            duration: '1:01'
        },
        {
            title: 'Wireless Energy Transmission',
            duration: '5:01'
        },
        {
            title: 'Electromagnetism',
            duration: '3:21'
        },
        {
            title: 'Alternating Current',
            duration: '3:14'
        },
        {
            title: 'Three phase power',
            duration: '3:14'
        },
        {
            title: 'Tesla Coil',
            duration: '2:15'
        }
    ]
};

var createSongRow = function(songNumber, songName, songLength) {
    var template =
        '<tr class="album-view-song-item">' +
        '   <td class="song-item-number" data-song-number="' + songNumber + '">' + songNumber + '</td>' +
        '   <td class="song-item-title">' + songName + '</td>' +
        '   <td class="song-item-duration">' + songLength + '</td>' +
        '</tr>';

    return $(template);
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

var songRows = document.getElementsByClassName('album-view-song-item');
var playButtonTemplate = '<a class="album-song-button"><i class="fa fa-caret-right fa-2x"></i></a>';
var pauseButtonTemplate = '<a class="song-pause-button"><i class="fa fa-pause" ></i></a>';
var songPlaying = null;

window.onload = function() {
    setCurrentAlbum(albumPicasso);
    for (var i = 0; i < songRows.length; i++) {
        songRows[i].addEventListener('click', function(event) {
            if (songPlaying == null) {
                this.children[0].innerHTML = pauseButtonTemplate;
                songPlaying = this.children[0].getAttribute('data-song-number');
            } else if (songPlaying == this.children[0].getAttribute('data-song-number')) {
                this.children[0].innerHTML = playButtonTemplate;
                songPlaying = null;
            } else if (songPlaying !== this.children[0].getAttribute('data-song-number')) {
                var songPlayingElement = document.querySelector('[data-song-number="' + songPlaying + '"]')
                songPlayingElement.innerHTML = songPlaying;
                this.children[0].innerHTML = pauseButtonTemplate;
                songPlaying = this.children[0].getAttribute('data-song-number');
            }
        });

        songRows[i].addEventListener('mouseleave', function(event) {
            if (songPlaying !== this.children[0].getAttribute('data-song-number')) {
                this.children[0].innerHTML = this.children[0].getAttribute('data-song-number');
            }

        });

        songRows[i].addEventListener('mouseover', function(event) {
            if (songPlaying !== this.children[0].getAttribute('data-song-number')) {
                this.children[0].innerHTML = playButtonTemplate;
            }
        });
    }
};
