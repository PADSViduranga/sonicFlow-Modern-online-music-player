import { useEffect, useRef, useState } from "react";
import Sidebar from "./components/Sidebar";
import TopBar from "./components/TopBar";
import PlayerBar from "./components/PlayerBar";
import MusicCard from "./components/MusicCard";
import PlaylistSection from "./components/PlaylistSection";
import PlaylistModal from "./components/PlaylistModal";
import QueuePanel from "./components/QueuePanel";
import songs from "./data/songs";

function App() {
  const audioRef = useRef(null);
  const playlistQueueRef = useRef([]);
  const playlistModeRef = useRef(false);

  const [currentSong, setCurrentSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [isShuffleOn, setIsShuffleOn] = useState(false);
  const [repeatMode, setRepeatMode] = useState("off");

  const [searchQuery, setSearchQuery] = useState("");
  const [activeSection, setActiveSection] = useState("home");

  const [
    selectedSongForPlaylist,
    setSelectedSongForPlaylist,
  ] = useState(null);

  const [playlistQueue, setPlaylistQueue] = useState([]);

  const [favoriteSongs, setFavoriteSongs] = useState(() => {
    const saved = localStorage.getItem("sonicflow-favorites");

    if (!saved) {
      return [];
    }

    try {
      return JSON.parse(saved);
    } catch {
      return [];
    }
  });

  const [playlists, setPlaylists] = useState(() => {
    const saved = localStorage.getItem("sonicflow-playlists");

    if (!saved) {
      return [];
    }

    try {
      return JSON.parse(saved);
    } catch {
      return [];
    }
  });

  const [recentlyPlayed, setRecentlyPlayed] = useState(() => {
    const saved = localStorage.getItem(
      "sonicflow-recently-played"
    );

    if (!saved) {
      return [];
    }

    try {
      return JSON.parse(saved);
    } catch {
      return [];
    }
  });

  const recentlyPlayedSongs = recentlyPlayed
    .map((songId) =>
      songs.find((song) => song.id === songId)
    )
    .filter(Boolean);

  const filteredSongs = songs.filter((song) => {
    const query = searchQuery.trim().toLowerCase();

    if (!query) {
      return true;
    }

    return (
      song.title.toLowerCase().includes(query) ||
      song.artist.toLowerCase().includes(query) ||
      song.album.toLowerCase().includes(query) ||
      song.genre.toLowerCase().includes(query)
    );
  });

  const favoriteSongList = songs.filter((song) =>
    favoriteSongs.includes(song.id)
  );

  useEffect(() => {
    localStorage.setItem(
      "sonicflow-favorites",
      JSON.stringify(favoriteSongs)
    );
  }, [favoriteSongs]);

  useEffect(() => {
    localStorage.setItem(
      "sonicflow-playlists",
      JSON.stringify(playlists)
    );
  }, [playlists]);

  useEffect(() => {
    localStorage.setItem(
      "sonicflow-recently-played",
      JSON.stringify(recentlyPlayed)
    );
  }, [recentlyPlayed]);

  useEffect(() => {
    if (!currentSong) {
      return;
    }

    setRecentlyPlayed((previousHistory) => {
      const updated = [
        currentSong.id,
        ...previousHistory.filter(
          (id) => id !== currentSong.id
        ),
      ];

      return updated.slice(0, 10);
    });
  }, [currentSong]);

  useEffect(() => {
    const audio = new Audio();

    audioRef.current = audio;
    audio.volume = volume;

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleLoadedMetadata = () => {
      setDuration(
        Number.isFinite(audio.duration)
          ? audio.duration
          : 0
      );
    };

    const handlePlay = () => {
      setIsPlaying(true);
    };

    const handlePause = () => {
      setIsPlaying(false);
    };

    const handleEnded = () => {
      if (!currentSong) {
        return;
      }

      if (repeatMode === "one") {
        audio.currentTime = 0;

        audio
          .play()
          .catch((error) => {
            console.error(
              "Unable to replay song:",
              error
            );

            setIsPlaying(false);
          });

        return;
      }

      if (playlistModeRef.current) {
        const nextSong =
          playlistQueueRef.current[0];

        if (nextSong) {
          const updatedQueue =
            playlistQueueRef.current.slice(1);

          playlistQueueRef.current =
            updatedQueue;

          setPlaylistQueue(updatedQueue);
          setCurrentSong(nextSong);
          setIsPlaying(true);

          return;
        }

        if (repeatMode === "all") {
          const playlistSongs = [
            currentSong,
            ...playlistQueueRef.current,
          ];

          if (playlistSongs.length > 0) {
            const [nextSong, ...remainingSongs] =
              playlistSongs;

            playlistModeRef.current = true;

            playlistQueueRef.current =
              remainingSongs;

            setPlaylistQueue(
              remainingSongs
            );

            setCurrentSong(nextSong);
            setIsPlaying(true);

            return;
          }
        }

        playlistModeRef.current = false;

        playlistQueueRef.current = [];

        setPlaylistQueue([]);
        setCurrentSong(null);
        setIsPlaying(false);

        return;
      }

      if (isShuffleOn) {
        const availableSongs = songs.filter(
          (song) =>
            song.id !== currentSong.id
        );

        if (availableSongs.length === 0) {
          return;
        }

        const randomIndex = Math.floor(
          Math.random() *
            availableSongs.length
        );

        setCurrentSong(
          availableSongs[randomIndex]
        );

        return;
      }

      const currentIndex = songs.findIndex(
        (song) =>
          song.id === currentSong.id
      );

      if (
        currentIndex === -1 ||
        songs.length === 0
      ) {
        return;
      }

      const nextIndex = currentIndex + 1;

      if (
        nextIndex >= songs.length &&
        repeatMode === "off"
      ) {
        setIsPlaying(false);
        return;
      }

      const actualNextIndex =
        nextIndex % songs.length;

      setCurrentSong(
        songs[actualNextIndex]
      );
    };

    const handleError = () => {
      console.error(
        "Unable to load audio."
      );

      setIsPlaying(false);
    };

    audio.addEventListener(
      "timeupdate",
      handleTimeUpdate
    );

    audio.addEventListener(
      "loadedmetadata",
      handleLoadedMetadata
    );

    audio.addEventListener(
      "play",
      handlePlay
    );

    audio.addEventListener(
      "pause",
      handlePause
    );

    audio.addEventListener(
      "ended",
      handleEnded
    );

    audio.addEventListener(
      "error",
      handleError
    );

    return () => {
      audio.pause();

      audio.removeEventListener(
        "timeupdate",
        handleTimeUpdate
      );

      audio.removeEventListener(
        "loadedmetadata",
        handleLoadedMetadata
      );

      audio.removeEventListener(
        "play",
        handlePlay
      );

      audio.removeEventListener(
        "pause",
        handlePause
      );

      audio.removeEventListener(
        "ended",
        handleEnded
      );

      audio.removeEventListener(
        "error",
        handleError
      );

      audio.src = "";
    };
  }, [
    currentSong,
    isShuffleOn,
    repeatMode,
  ]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  useEffect(() => {
    const audio = audioRef.current;

    if (!audio || !currentSong) {
      return;
    }

    audio.src = currentSong.audio;
    audio.currentTime = 0;

    setCurrentTime(0);
    setDuration(0);

    audio.load();

    if (isPlaying) {
      audio.play().catch((error) => {
        console.error(
          "Playback failed:",
          error
        );

        setIsPlaying(false);
      });
    }
  }, [currentSong]);

  const clearPlaylistQueue = () => {
    playlistModeRef.current = false;

    playlistQueueRef.current = [];

    setPlaylistQueue([]);
  };

  const handleSelectSong = (song) => {
    if (!song) {
      return;
    }

    clearPlaylistQueue();

    setCurrentSong(song);
    setIsPlaying(true);
  };

  const handlePlayPause = () => {
    const audio = audioRef.current;

    if (!audio) {
      return;
    }

    if (!currentSong) {
      if (songs.length > 0) {
        setCurrentSong(songs[0]);
        setIsPlaying(true);
      }

      return;
    }

    if (audio.paused) {
      audio
        .play()
        .then(() => {
          setIsPlaying(true);
        })
        .catch((error) => {
          console.error(
            "Unable to play:",
            error
          );
        });
    } else {
      audio.pause();
      setIsPlaying(false);
    }
  };

  const handleNext = () => {
    if (!currentSong) {
      return;
    }

    if (playlistModeRef.current) {
      const nextSong =
        playlistQueueRef.current[0];

      if (nextSong) {
        const updatedQueue =
          playlistQueueRef.current.slice(1);

        playlistQueueRef.current =
          updatedQueue;

        setPlaylistQueue(updatedQueue);
        setCurrentSong(nextSong);
        setIsPlaying(true);

        return;
      }

      if (repeatMode === "all") {
        const currentIndex =
          songs.findIndex(
            (song) =>
              song.id === currentSong.id
          );

        if (currentIndex !== -1) {
          const nextSong =
            songs[
              (currentIndex + 1) %
                songs.length
            ];

          setCurrentSong(nextSong);
          setIsPlaying(true);

          return;
        }
      }

      clearPlaylistQueue();
    }

    if (repeatMode === "one") {
      const audio = audioRef.current;

      if (audio) {
        audio.currentTime = 0;

        audio
          .play()
          .catch((error) => {
            console.error(
              "Unable to replay song:",
              error
            );
          });
      }

      return;
    }

    if (isShuffleOn) {
      const availableSongs = songs.filter(
        (song) =>
          song.id !== currentSong.id
      );

      if (availableSongs.length === 0) {
        return;
      }

      const randomIndex = Math.floor(
        Math.random() *
          availableSongs.length
      );

      setCurrentSong(
        availableSongs[randomIndex]
      );

      setIsPlaying(true);

      return;
    }

    const currentIndex = songs.findIndex(
      (song) =>
        song.id === currentSong.id
    );

    if (currentIndex === -1) {
      return;
    }

    const nextIndex =
      currentIndex + 1;

    if (
      nextIndex >= songs.length &&
      repeatMode === "off"
    ) {
      return;
    }

    const actualNextIndex =
      nextIndex % songs.length;

    setCurrentSong(
      songs[actualNextIndex]
    );

    setIsPlaying(true);
  };

  const handlePrevious = () => {
    const audio = audioRef.current;

    if (!currentSong || !audio) {
      return;
    }

    if (audio.currentTime > 3) {
      audio.currentTime = 0;
      setCurrentTime(0);
      return;
    }

    clearPlaylistQueue();

    const currentIndex = songs.findIndex(
      (song) =>
        song.id === currentSong.id
    );

    if (currentIndex === -1) {
      return;
    }

    const previousIndex =
      (currentIndex - 1 + songs.length) %
      songs.length;

    setCurrentSong(
      songs[previousIndex]
    );

    setIsPlaying(true);
  };

  const handleSeek = (time) => {
    const audio = audioRef.current;

    if (!audio) {
      return;
    }

    audio.currentTime = time;
    setCurrentTime(time);
  };

  const handleVolumeChange = (
    newVolume
  ) => {
    const safeVolume = Math.max(
      0,
      Math.min(
        1,
        Number(newVolume)
      )
    );

    setVolume(safeVolume);
  };

  const handleToggleShuffle = () => {
    setIsShuffleOn(
      (previous) => !previous
    );
  };

  const handleToggleRepeat = () => {
    setRepeatMode((previousMode) => {
      if (previousMode === "off") {
        return "all";
      }

      if (previousMode === "all") {
        return "one";
      }

      return "off";
    });
  };

  const handleToggleFavorite = (
    songId
  ) => {
    setFavoriteSongs(
      (previousFavorites) => {
        if (
          previousFavorites.includes(
            songId
          )
        ) {
          return previousFavorites.filter(
            (id) => id !== songId
          );
        }

        return [
          ...previousFavorites,
          songId,
        ];
      }
    );
  };

  const handleCreatePlaylist = (
    name
  ) => {
    const trimmedName =
      String(name || "").trim();

    if (!trimmedName) {
      return;
    }

    const newPlaylist = {
      id: Date.now(),
      name: trimmedName,
      songs: [],
    };

    setPlaylists((previous) => [
      ...previous,
      newPlaylist,
    ]);
  };

  const handleAddSongToPlaylist = (
    playlistId,
    songId
  ) => {
    setPlaylists(
      (previousPlaylists) =>
        previousPlaylists.map(
          (playlist) => {
            if (
              playlist.id !==
              playlistId
            ) {
              return playlist;
            }

            if (
              playlist.songs.includes(
                songId
              )
            ) {
              return playlist;
            }

            return {
              ...playlist,
              songs: [
                ...playlist.songs,
                songId,
              ],
            };
          }
        )
    );

    setSelectedSongForPlaylist(null);
  };

  const handleDeletePlaylist = (
    playlistId
  ) => {
    setPlaylists((previous) =>
      previous.filter(
        (playlist) =>
          playlist.id !==
          playlistId
      )
    );
  };

  const handleRemoveSongFromPlaylist = (
    playlistId,
    songId
  ) => {
    setPlaylists(
      (previousPlaylists) =>
        previousPlaylists.map(
          (playlist) => {
            if (
              playlist.id !==
              playlistId
            ) {
              return playlist;
            }

            return {
              ...playlist,
              songs:
                playlist.songs.filter(
                  (id) =>
                    id !== songId
                ),
            };
          }
        )
    );
  };

  const handleRenamePlaylist = (
    playlistId,
    newName
  ) => {
    const trimmedName =
      String(newName || "").trim();

    if (!trimmedName) {
      return;
    }

    setPlaylists(
      (previousPlaylists) =>
        previousPlaylists.map(
          (playlist) => {
            if (
              playlist.id !==
              playlistId
            ) {
              return playlist;
            }

            return {
              ...playlist,
              name: trimmedName,
            };
          }
        )
    );
  };

  const handlePlayPlaylist = (
    playlistSongIds
  ) => {
    const playlistSongs =
      playlistSongIds
        .map((songId) =>
          songs.find(
            (song) =>
              song.id === songId
          )
        )
        .filter(Boolean);

    if (
      playlistSongs.length === 0
    ) {
      return;
    }

    const [
      firstSong,
      ...remainingSongs
    ] = playlistSongs;

    playlistModeRef.current = true;

    playlistQueueRef.current =
      remainingSongs;

    setPlaylistQueue(
      remainingSongs
    );

    setCurrentSong(firstSong);
    setIsPlaying(true);
  };

  const handleRemoveSongFromQueue = (
    songId
  ) => {
    const updatedQueue =
      playlistQueueRef.current.filter(
        (song) =>
          song.id !== songId
      );

    playlistQueueRef.current =
      updatedQueue;

    setPlaylistQueue(
      updatedQueue
    );
  };

  const handleClearQueue = () => {
    clearPlaylistQueue();
  };

  const handleSectionChange = (
    section
  ) => {
    const value = String(section)
      .trim()
      .toLowerCase()
      .replace(/[_-]+/g, " ")
      .replace(/\s+/g, " ");

    const sectionMap = {
      home: "home",

      favorites: "favorites",
      favorite: "favorites",
      "my favorites": "favorites",

      library: "library",
      "my library": "library",
      "your library": "library",
      music: "library",

      search: "search",

      playlists: "playlists",
      playlist: "playlists",
      "my playlists": "playlists",
    };

    const normalized =
      sectionMap[value] ||
      value;

    setActiveSection(normalized);

    if (
      normalized !== "search"
    ) {
      setSearchQuery("");
    }
  };

  const handleSearchChange = (
    value
  ) => {
    setSearchQuery(value);

    if (value.trim()) {
      setActiveSection("search");
    }
  };

  const musicCardProps = (song) => ({
    song,

    isPlaying:
      currentSong?.id ===
        song.id &&
      isPlaying,

    isFavorite:
      favoriteSongs.includes(
        song.id
      ),

    onSelect:
      handleSelectSong,

    onSelectSong:
      handleSelectSong,

    onToggleFavorite:
      handleToggleFavorite,

    onAddToPlaylist: () =>
      setSelectedSongForPlaylist(
        song
      ),
  });

  return (
    <div className="app">
      <Sidebar
        activeSection={
          activeSection
        }
        onSectionChange={
          handleSectionChange
        }
      />

      <div className="app-content">
        <TopBar
          searchQuery={
            searchQuery
          }
          onSearchChange={
            handleSearchChange
          }
        />

        <main className="main-content">
          {activeSection ===
            "home" && (
            <>
              <section className="hero-section">
                <div className="hero-content">
                  <p className="hero-label">
                    YOUR MUSIC
                  </p>

                  <h1>
                    Listen to what
                    <br />
                    moves you.
                  </h1>

                  <p className="hero-description">
                    Discover your
                    favorite tracks
                    and enjoy your
                    personal music
                    collection.
                  </p>

                  <button
                    type="button"
                    className="hero-button"
                    onClick={() => {
                      if (
                        currentSong
                      ) {
                        handlePlayPause();
                      } else if (
                        songs.length
                      ) {
                        handleSelectSong(
                          songs[0]
                        );
                      }
                    }}
                  >
                    {isPlaying
                      ? "Pause Music"
                      : "Start Listening"}
                  </button>
                </div>
              </section>

              <section className="music-section">
                <div className="section-header">
                  <div>
                    <p className="section-label">
                      DISCOVER
                    </p>

                    <h2>
                      Recently Played
                    </h2>
                  </div>
                </div>

                {recentlyPlayedSongs.length >
                0 ? (
                  <div className="music-grid">
                    {recentlyPlayedSongs
                      .slice(0, 4)
                      .map((song) => (
                        <MusicCard
                          key={song.id}
                          {...musicCardProps(
                            song
                          )}
                        />
                      ))}
                  </div>
                ) : (
                  <p className="empty-message">
                    Your recently
                    played songs
                    will appear
                    here.
                  </p>
                )}
              </section>

              <section className="music-section">
                <div className="section-header">
                  <div>
                    <p className="section-label">
                      EXPLORE
                    </p>

                    <h2>
                      All Music
                    </h2>
                  </div>
                </div>

                <div className="music-grid">
                  {songs.map(
                    (song) => (
                      <MusicCard
                        key={song.id}
                        {...musicCardProps(
                          song
                        )}
                      />
                    )
                  )}
                </div>
              </section>
            </>
          )}

          {activeSection ===
            "favorites" && (
            <section className="music-section">
              <div className="section-header">
                <div>
                  <p className="section-label">
                    YOUR MUSIC
                  </p>

                  <h2>
                    Favorites
                  </h2>
                </div>

                <span className="song-count">
                  {
                    favoriteSongList.length
                  }{" "}
                  songs
                </span>
              </div>

              {favoriteSongList.length >
              0 ? (
                <div className="music-grid">
                  {favoriteSongList.map(
                    (song) => (
                      <MusicCard
                        key={song.id}
                        {...musicCardProps(
                          song
                        )}
                      />
                    )
                  )}
                </div>
              ) : (
                <div className="empty-search-state">
                  <span className="empty-search-icon">
                    ♡
                  </span>

                  <h3>
                    No favorites yet
                  </h3>

                  <p>
                    Add songs to
                    your favorites
                    and they will
                    appear here.
                  </p>
                </div>
              )}
            </section>
          )}

          {activeSection ===
            "library" && (
            <section className="music-section">
              <div className="section-header">
                <div>
                  <p className="section-label">
                    YOUR LIBRARY
                  </p>

                  <h2>
                    Your Library
                  </h2>

                  <p className="search-description">
                    Browse all the
                    music in your
                    collection.
                  </p>
                </div>

                <span className="song-count">
                  {songs.length} songs
                </span>
              </div>

              {songs.length > 0 ? (
                <div className="music-grid">
                  {songs.map(
                    (song) => (
                      <MusicCard
                        key={song.id}
                        {...musicCardProps(
                          song
                        )}
                      />
                    )
                  )}
                </div>
              ) : (
                <div className="empty-search-state">
                  <span className="empty-search-icon">
                    ♫
                  </span>

                  <h3>
                    Your library is
                    empty
                  </h3>

                  <p>
                    There are no
                    songs in your
                    music collection.
                  </p>
                </div>
              )}
            </section>
          )}

          {activeSection ===
            "search" && (
            <section className="music-section">
              <div className="section-header">
                <div>
                  <p className="section-label">
                    DISCOVER
                  </p>

                  <h2>
                    Search Music
                  </h2>

                  <p className="search-description">
                    {searchQuery
                      ? `Results for "${searchQuery}"`
                      : "Find songs, artists, albums, and genres."}
                  </p>
                </div>

                <span className="song-count">
                  {
                    filteredSongs.length
                  }{" "}
                  songs
                </span>
              </div>

              {filteredSongs.length >
              0 ? (
                <div className="music-grid">
                  {filteredSongs.map(
                    (song) => (
                      <MusicCard
                        key={song.id}
                        {...musicCardProps(
                          song
                        )}
                      />
                    )
                  )}
                </div>
              ) : (
                <div className="empty-search-state">
                  <span className="empty-search-icon">
                    ⌕
                  </span>

                  <h3>
                    No music found
                  </h3>

                  <p>
                    Try another song,
                    artist, album,
                    or genre.
                  </p>
                </div>
              )}
            </section>
          )}

          {activeSection ===
            "playlists" && (
            <PlaylistSection
              playlists={playlists}
              songs={songs}
              onCreatePlaylist={
                handleCreatePlaylist
              }
              onSelectSong={
                handleSelectSong
              }
              onPlayPlaylist={
                handlePlayPlaylist
              }
              onDeletePlaylist={
                handleDeletePlaylist
              }
              onRemoveSongFromPlaylist={
                handleRemoveSongFromPlaylist
              }
              onRenamePlaylist={
                handleRenamePlaylist
              }
            />
          )}

          {playlistQueue.length >
            0 && (
            <QueuePanel
              currentSong={
                currentSong
              }
              playlistQueue={
                playlistQueue
              }
              onSelectSong={
                handleSelectSong
              }
              onRemoveSong={
                handleRemoveSongFromQueue
              }
              onClearQueue={
                handleClearQueue
              }
            />
          )}
        </main>
      </div>

      <PlayerBar
        currentSong={currentSong}
        isPlaying={isPlaying}
        currentTime={currentTime}
        duration={duration}
        volume={volume}
        isShuffleOn={
          isShuffleOn
        }
        repeatMode={repeatMode}
        onPlayPause={
          handlePlayPause
        }
        onTogglePlay={
          handlePlayPause
        }
        onNext={handleNext}
        onPrevious={
          handlePrevious
        }
        onSeek={handleSeek}
        onVolumeChange={
          handleVolumeChange
        }
        onToggleShuffle={
          handleToggleShuffle
        }
        onToggleRepeat={
          handleToggleRepeat
        }
      />

      {selectedSongForPlaylist && (
        <PlaylistModal
          song={
            selectedSongForPlaylist
          }
          playlists={playlists}
          onClose={() =>
            setSelectedSongForPlaylist(
              null
            )
          }
          onAddToPlaylist={
            handleAddSongToPlaylist
          }
          onCreatePlaylist={
            handleCreatePlaylist
          }
        />
      )}
    </div>
  );
}

export default App;