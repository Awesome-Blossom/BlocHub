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
    // var sin_attr = sin.attr('data-song-number');

    if (currentSongPlayingNumber != songNumber) {
      sin.html(playButtonTemplate);
    }
  };

  var offHover = function(event) {
    var sin = $(this).find('.song-item-number');
    // var sin_attr = sin.attr('data-song-number');

    if (currentSongPlayingNumber != songNumber) {
      sin.html(songNumber);
    }
  };
  var clickHandler = function() {
    // var songNumber = $(this).attr('data-song-number');

    // if user clicks play buttton on a different song while a song is already playing.
    if (currentSongPlayingNumber != null) {
      var currentSongPlayingNumberElement = getSongNumberCell(currentSongPlayingNumber);
      currentSongPlayingNumberElement.html(currentSongPlayingNumber);
    }

    //if user clicks play button on a new song. 
    if (currentSongPlayingNumber != songNumber) {
      setSong(songNumber);
      currentSoundFile.play();
      $(this).html(pauseButtonTemplate);
      updatePlayerBarSong();
    } else if (currentSongPlayingNumber == songNumber) {
      //if sound file is paused, play song again, revert to pause icon & player bar to pause button
      if (currentSoundFile.isPaused()) {
        $(this).html(pauseButtonTemplate);
        currentSoundFile.play();
        updatePlayerBarSong();
      }
      //if sound file is not paused, pause song, songNumberCell has play icon & player bar has play button
      else {
        currentSoundFile.pause();
        $(this).html(playButtonTemplate);
        $('.main-controls .play-pause').html(playerBarPlayButton);
      }
    }
  };

  $row.find('.song-item-number').click(clickHandler);
  $row.hover(onHover, offHover);
  return $row;
};

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

//updating seekBar fill & thumb values
var updateSeekPercentage = function($seekBar, seekBarFillRatio){
    var offsetXPercent = seekBarFillRatio * 100;

    offsetXPercent = Math.max(0, offsetXPercent);
    offsetXPercent = Math.min(100, offsetXPercent);

    var percentageString = offsetXPercent + '%';
    $seekBar.find('.fill').width(percentageString);
    $seekBar.find('.thumb').css({left: percentageString});
}

//method for determining seekBarFillRatio for updateSeekPercentage function
var setupSeekBars = function(){
    var $seekBars = $('.player-bar .seek-bar');

    $seekBars.click(function(event){
        var offsetX = event.pageX - $(this).offset().left;
        console.log(event.pageX+'pageX');
        console.log($(this).offset().left + 'left');
        var barWidth = $(this).width();
        console.log(barWidth);
        var seekBarFillRatio = offsetX / barWidth;

        updateSeekPercentage($(this), seekBarFillRatio);
    });
};
//switch album cover & song info when clicked on album cover art\
var switchAlbumCoverArt = function() {
  counter++;
  if (counter >= albumList.length) {
    counter = 0;
  }
  setCurrentAlbum(albumList[counter]);
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
  setSong(currentSongIndex + 1);
  currentSoundFile.play();
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
  setSong(currentSongIndex + 1);
  currentSoundFile.play();
  updatePlayerBarSong();

  var $prevSongNumberCell = $('.song-item-number[data-song-number="' + currentSongPlayingNumber + '"]');
  var $lastSongNumberCell = $('.song-item-number[data-song-number="' + lastSongNumber + '"]');

  $prevSongNumberCell.html(pauseButtonTemplate);
  $lastSongNumberCell.html(lastSongNumber);
};

var togglePlayFromPlayerBar = function() {

  var firstSongNumberCell = $('.song-item-number').attr('data-song-number');
  var firstSongNumberCellElement = getSongNumberCell(firstSongNumberCell);

  var songNumberCellElement = getSongNumberCell(currentSongPlayingNumber);
  console.log(songNumberCellElement);

  if (currentSoundFile) {
    if (currentSoundFile.isPaused()) {
      songNumberCellElement.html(pauseButtonTemplate);
      $(this).html(playerBarPauseButton);
      currentSoundFile.play();
    } else {
      songNumberCellElement.html(playButtonTemplate);
      $(this).html(playerBarPlayButton);
      currentSoundFile.pause();
    }
  }
  //if page is loaded and no songs are chosen, first song will play 
  else {
    setSong(firstSongNumberCell);
    firstSongNumberCellElement.html(pauseButtonTemplate);
    $(this).html(playerBarPauseButton);
    currentSoundFile.play();
  }
};
//set Attribute number & album song number for currently playing song.
var setSong = function(songNumber) {
  if (currentSoundFile) {
    currentSoundFile.stop();
  }
  currentSongPlayingNumber = parseInt(songNumber);
  currentAlbumSong = currentAlbum.songs[songNumber - 1];
  currentSoundFile = new buzz.sound(currentAlbumSong.audioUrl, {
    formats: ["mp3"],
    preload: true
  });
  setVolume(currentVolume);
};

// retrieve attribute number of curretnly playing song.
var getSongNumberCell = function(number) {
  return $('.song-item-number[data-song-number="' + number + '"]');
};

var setVolume = function(volume) {
  if (currentSoundFile) {
    currentSoundFile.setVolume(volume);
  }
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
var currentSoundFile = null;
var currentVolume = 80;
var $nextButton = $('.main-controls .next');
var $prevButton = $('.main-controls .previous');
var $togglePlayFromPlayerBarButton = $('.main-controls .play-pause');

$(document).ready(function() {
  setCurrentAlbum(albumPicasso);
  $AlbumCoverArtImage.click(switchAlbumCoverArt);
  $nextButton.click(nextSong);
  $prevButton.click(prevSong);
  $togglePlayFromPlayerBarButton.click(togglePlayFromPlayerBar);
  setupSeekBars();
});