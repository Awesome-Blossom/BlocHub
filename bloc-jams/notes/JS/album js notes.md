##### nextSong
- Find index of current song, save the last song number.
- increase the index of the current song to match the song playing number
- if the index of the song > length of album, index of song wraps around
  - so for ex. if length of album=5, and index of song is at 5, then it will song index =0
- if clicked on the next button, songplaying number will increase by 1
    - so from last ex. if song index=0, SongPlayingNumber will =1, thus pointing to the first song.
- update the song from the album.
- updates player bar
- Put the previous song number back to the previous song after clicking the next button
- Apply pause button template onto the current song
    - On the current song, put the current song number attribute onto the data attribute of song-item number
    - On the last song that was clicked, put the previous song number onto the song-item-number icon, instead of the pause button.

##### prevSong
- Same thing as nextSong function
- Decrease index of current song 
- if index of current song < 0, 
    - currentSongIndex = length of album songs - 1. 