//creates song row, handles click, pause, & hover.
var createSongRow = function(songNumber, songName, songLength) {
  var template = '<tr class="album-view-song-item">' +
    '   <td class="song-item-number" data-song-number="' + songNumber + '">' + songNumber + '</td>' +
    '   <td class="song-item-title">' + songName + '</td>' +
    '   <td class="song-item-duration">' + filterTimeCode(songLength) + '</td>' +
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

    $('.volume .seek-bar .fill').width(currentVolume + '%');
    $('.volume .seek-bar .thumb').css({ left: currentVolume + '%' });


    // if user clicks play buttton on a different song while a song is already playing.
    if (currentSongPlayingNumber != null) {
      var currentSongPlayingNumberElement = getSongNumberCell(currentSongPlayingNumber);
      currentSongPlayingNumberElement.html(currentSongPlayingNumber);
    }

    //if user clicks play button on a new song. 
    if (currentSongPlayingNumber != songNumber) {
      setSong(songNumber);
      currentSoundFile.play();
      updateSeekBarWhileSongPlays();
      $(this).html(pauseButtonTemplate);
      updatePlayerBarSong();


      //if sound file is paused, play song again, revert to pause icon & player bar to pause button
    } else if (currentSongPlayingNumber == songNumber) {
      if (currentSoundFile.isPaused()) {
        $(this).html(pauseButtonTemplate);
        currentSoundFile.play();
        updateSeekBarWhileSongPlays();
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

//track index of the song that is getting played.
var trackIndex = function(album, song) {
  return album.songs.indexOf(song);
};

// retrieve attribute number of curretnly playing song.
var getSongNumberCell = function(number) {
  return $('.song-item-number[data-song-number="' + number + '"]');
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
  updateSeekBarWhileSongPlays();
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
  updateSeekBarWhileSongPlays();
  updatePlayerBarSong();

  var $prevSongNumberCell = $('.song-item-number[data-song-number="' + currentSongPlayingNumber + '"]');
  var $lastSongNumberCell = $('.song-item-number[data-song-number="' + lastSongNumber + '"]');

  $prevSongNumberCell.html(pauseButtonTemplate);
  $lastSongNumberCell.html(lastSongNumber);
};

// updating the song icon, song & player bar (Play -> pause -> play) from player bar
var togglePlayFromPlayerBar = function() {

  var firstSongNumberCell = $('.song-item-number').attr('data-song-number');
  var firstSongNumberCellElement = getSongNumberCell(firstSongNumberCell);
  var songNumberCellElement = getSongNumberCell(currentSongPlayingNumber);

  if (currentSoundFile) {
    if (currentSoundFile.isPaused()) {
      songNumberCellElement.html(pauseButtonTemplate);
      $(this).html(playerBarPauseButton);
      currentSoundFile.play();
      updateSeekBarWhileSongPlays();
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
    updateSeekBarWhileSongPlays();
  }
};

//updates player bar w/ html info
var updatePlayerBarSong = function(event) {
  $('.currently-playing .song-name').text(currentAlbumSong.title);
  $('.currently-playing .artist-name').text(currentAlbum.artist);
  $('.currently-playing .artist-song-mobile').text(currentAlbumSong.title + ' - ' + currentAlbum.artist);
  $('.main-controls .play-pause').html(playerBarPauseButton);
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

// sets current time
var seek = function(time) {
  if (currentSoundFile) {
    currentSoundFile.setTime(time);
  }
};

//setting volume from  var currentVolume 
var setVolume = function(volume) {
  if (currentSoundFile) {
    currentSoundFile.setVolume(volume);
  }
};

//switch album cover & song info when clicked on album cover art
var switchAlbumCoverArt = function() {
  counter++;
  if (counter >= albumList.length) {
    counter = 0;
  }
  setCurrentAlbum(albumList[counter]);
};

//method for determining ratio to fill seekbar and parameters for updateSeekPercentage function
var setupSeekBars = function() {
  var $seekBars = $('.player-bar .seek-bar');


  $seekBars.click(function(event) {

    var offsetX = event.pageX - $(this).offset().left;
    var barWidth = $(this).width();
    var seekBarFillRatio = offsetX / barWidth;

    // if ($(this).parent().attr('class') == 'seek-control') {
    //   seek(seekBarFillRatio * currentSoundFile.getDuration());
    // } else {
    //   setVolume(seekBarFillRatio * 100);
    // }

    if ($(this).parent().hasClass('volume')) {
      setVolume(seekBarFillRatio * 100);
    } else {
      seek(seekBarFillRatio * currentSoundFile.getDuration());
    }
    updateSeekPercentage($(this), seekBarFillRatio);
  });

  $seekBars.find('.thumb').mousedown(function(event) {
    var $seekBar = $(this).parent();

    $(document).bind('mousemove.thumb', function(event) {
      var offsetX = event.pageX - $seekBar.offset().left;
      var barWidth = $seekBar.width();
      var seekBarFillRatio = offsetX / barWidth;

      // if ($(this).parent().attr('class') == 'seek-control') {
      //   seek(seekBarFillRatio * currentSoundFile.getDuration());
      // } else {
      //   setVolume(seekBarFillRatio * 100);
      // }

      if ($(this).parent().hasClass('volume')) {
        setVolume(seekBarFillRatio*100);
      } else {
        seek(seekBarFillRatio * currentSoundFile.getDuration());
      }
      updateSeekPercentage($seekBar, seekBarFillRatio);
    });

    $(document).bind('mouseup.thumb', function() {
      $(document).unbind('mousemove.thumb');
      $(document).unbind('mouseup.thumb');
    });
  });
};

//update the seek bar when song plays
var updateSeekBarWhileSongPlays = function() {
  if (currentSoundFile) {
    currentSoundFile.bind('timeupdate', function(event) {
      var seekBarFillRatio = this.getTime() / this.getDuration();
      var $seekBar = $('.seek-control .seek-bar');
      updateSeekPercentage($seekBar, seekBarFillRatio);
      updateCurrentTimeOnPlayerBar();
      updateDurationOnPlayerBar();
      // updateCurrentTimeOnPlayerBar();
      // updateDurationOnPlayerBar();
    });
  }
};

//updates or writes in seekBar css fill (width) & thumb (left) values
var updateSeekPercentage = function($seekBar, seekBarFillRatio) {
  var offsetXPercent = seekBarFillRatio * 100;

  offsetXPercent = Math.max(0, offsetXPercent);
  offsetXPercent = Math.min(100, offsetXPercent);

  var percentageString = offsetXPercent + '%';

  $seekBar.find('.fill').width(percentageString);
  $seekBar.find('.thumb').css({ left: percentageString });
}

//this way doesn't work
var updateCurrentTimeOnPlayerBar = function() {
  var timer = buzz.toTimer(currentSoundFile.getTime());
  $('.currently-playing .current-time').text(timer);
};

var updateDurationOnPlayerBar = function() {
  var durationTime = buzz.toTimer(currentSoundFile.getDuration());
  // console.log(durationTime); //console shows duration Time.
  $('.total-time').text(durationTime);
};

// change seconds to minutes on duration text for each song row.
var filterTimeCode = function(songLengthString) {
  var songLengthNumber = parseFloat(songLengthString);
  var minutes = Math.floor(songLengthNumber / 60);
  var seconds = Math.floor(songLengthNumber % 60);

  if (seconds < 10) { seconds = "0" + seconds };
  return minutes + ':' + seconds;
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
var currentVolume = 100;
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