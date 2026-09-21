
import { useEffect, useRef, useState } from "react";
import Sidebar from "./components/Sidebar";
import TopBar from "./components/TopBar";
import PlayerBar from "./components/PlayerBar";
import MusicCard from "./components/MusicCard";
import PlaylistSection from "./components/PlaylistSection";
import PlaylistModal from "./components/PlaylistModal";
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
  const [searchQuery, setSearchQuery] = useState("");
  const [activeSection, setActiveSection] = useState("home");
  const [playlistQueue, setPlaylistQueue] = useState([]);
  const [selectedSongForPlaylist, setSelectedSongForPlaylist] =
    useState(null);

  const [favoriteSongs, setFavoriteSongs] = useState(() => {
    const savedFavorites = localStorage.getItem("sonicflow-favorites");

    if (!savedFavorites) {
      return [];
    }

    try {
      return JSON.parse(savedFavorites);
    } catch (error) {
      console.error("Unable to load saved favorites:", error);
      return [];
    }
  });

  const [playlists, setPlaylists] = useState(() => {
    const savedPlaylists = localStorage.getItem("sonicflow-playlists");

    if (!savedPlaylists) {
      return [];
    }

    try {
      return JSON.parse(savedPlaylists);
    } catch (error) {
      console.error("Unable to load saved playlists:", error);
      return [];
    }
  });

  const filteredSongs = songs.filter((song) => {
    const query = searchQuery.toLowerCase().trim();

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
    const audio = new Audio();

    audioRef.current = audio;
    audio.volume = volume;

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
    };

    const handlePlay = () => {
      setIsPlaying(true);
    };

    const handlePause = () => {
      setIsPlaying(false);
    };

    const handleEnded = () => {
      setIsPlaying(false);

      if (playlistModeRef.current) {
        const remainingSongs = playlistQueueRef.current;

        if (remainingSongs.length > 0) {
          const nextSong = remainingSongs[0];
          const updatedQueue = remainingSongs.slice(1);

          playlistQueueRef.current = updatedQueue;
          setPlaylistQueue(updatedQueue);
          setCurrentSong(nextSong);

          return;
        }

        playlistModeRef.current = false;
        playlistQueueRef.current = [];
        setPlaylistQueue([]);
        setCurrentSong(null);

        return;
      }

      setCurrentSong((previousSong) => {
        if (!previousSong) {
          return null;
        }

        const currentIndex = songs.findIndex(
          (song) => song.id === previousSong.id
        );

        const nextIndex = (currentIndex + 1) % songs.length;

        return songs[nextIndex];
      });
    };

    const handleError = () => {
      console.error("Unable to load the selected audio.");
      setIsPlaying(false);
    };

    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("play", handlePlay);
    audio.addEventListener("pause", handlePause);
    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("error", handleError);

    return () => {
      audio.pause();

      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener(
        "loadedmetadata",
        handleLoadedMetadata
      );
      audio.removeEventListener("play", handlePlay);
      audio.removeEventListener("pause", handlePause);
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("error", handleError);

      audio.src = "";
    };
  }, []);

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

    audio
      .play()
      .then(() => {
        setIsPlaying(true);
      })
      .catch((error) => {
        console.error("Playback could not start:", error);
        setIsPlaying(false);
      });
  }, [currentSong]);

  const clearPlaylistQueue = () => {
    playlistModeRef.current = false;
    playlistQueueRef.current = [];
    setPlaylistQueue([]);
  };

  const handleSelectSong = (song) => {
    clearPlaylistQueue();
    setCurrentSong(song);
  };

  const handlePlayPlaylist = (playlistSongIds) => {
    const playlistSongList = playlistSongIds
      .map((songId) => songs.find((song) => song.id === songId))
      .filter(Boolean);

    if (playlistSongList.length === 0) {
      return;
    }

    const firstSong = playlistSongList[0];
    const remainingSongs = playlistSongList.slice(1);

    playlistModeRef.current = true;
    playlistQueueRef.current = remainingSongs;

    setPlaylistQueue(remainingSongs);
    setCurrentSong(firstSong);
  };

  const handleToggleFavorite = (songId) => {
    setFavoriteSongs((previousFavorites) => {
      if (previousFavorites.includes(songId)) {
        return previousFavorites.filter((id) => id !== songId);
      }

      return [...previousFavorites, songId];
    });
  };

  const handleCreatePlaylist = (playlistName) => {
    const newPlaylist = {
      id: Date.now(),
      name: playlistName,
      songs: [],
    };

    setPlaylists((previousPlaylists) => [
      ...previousPlaylists,
      newPlaylist,
    ]);
  };

  const handleDeletePlaylist = (playlistId) => {
    setPlaylists((previousPlaylists) =>
      previousPlaylists.filter((playlist) => playlist.id !== playlistId)
    );
  };

  const handleRenamePlaylist = (playlistId, newName) => {
    setPlaylists((previousPlaylists) =>
      previousPlaylists.map((playlist) => {
        if (playlist.id !== playlistId) {
          return playlist;
        }

        return {
          ...playlist,
          name: newName,
        };
      })
    );
  };

  const handleRemoveSongFromPlaylist = (playlistId, songId) => {
    setPlaylists((previousPlaylists) =>
      previousPlaylists.map((playlist) => {
        if (playlist.id !== playlistId) {
          return playlist;
        }

        return {
          ...playlist,
          songs: playlist.songs.filter((id) => id !== songId),
        };
      })
    );
  };

  const handleOpenPlaylistModal = (song) => {
    setSelectedSongForPlaylist(song);
  };

  const handleClosePlaylistModal = () => {
    setSelectedSongForPlaylist(null);
  };

  const handleAddSongToPlaylist = (playlistId, songId) => {
    setPlaylists((previousPlaylists) =>
      previousPlaylists.map((playlist) => {
        if (playlist.id !== playlistId) {
          return playlist;
        }

        if (playlist.songs.includes(songId)) {
          return playlist;
        }

        return {
          ...playlist,
          songs: [...playlist.songs, songId],
        };
      })
    );

    setSelectedSongForPlaylist(null);
  };

  const handleSectionChange = (section) => {
    setActiveSection(section);

    if (section === "search") {
      setSearchQuery("");
    }
  };

  const handleSearchChange = (value) => {
    setSearchQuery(value);

    if (value.trim()) {
      setActiveSection("search");
    }
  };

  const handleTogglePlay = () => {
    const audio = audioRef.current;

    if (!audio || !currentSong) {
      return;
    }

    if (audio.paused) {
      audio
        .play()
        .then(() => {
          setIsPlaying(true);
        })
        .catch((error) => {
          console.error("Playback could not start:", error);
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

    clearPlaylistQueue();

    const currentIndex = songs.findIndex(
      (song) => song.id === currentSong.id
    );

    const nextIndex = (currentIndex + 1) % songs.length;

    setCurrentSong(songs[nextIndex]);
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
      (song) => song.id === currentSong.id
    );

    const previousIndex =
      (currentIndex - 1 + songs.length) % songs.length;

    setCurrentSong(songs[previousIndex]);
  };

  const handleSeek = (time) => {
    const audio = audioRef.current;

    if (!audio) {
      return;
    }

    audio.currentTime = time;
    setCurrentTime(time);
  };

  const handleVolumeChange = (newVolume) => {
    setVolume(newVolume);
  };

  const getSectionContent = () => {
    if (activeSection === "favorites") {
      return {
        label: "YOUR MUSIC",
        title: "Favorites",
        description: "Your favorite songs in one place.",
        songs: favoriteSongList,
      };
    }

    if (activeSection === "library") {
      return {
        label: "YOUR LIBRARY",
        title: "Your Library",
        description: "Browse all the music in your collection.",
        songs: songs,
      };
    }

    if (activeSection === "search") {
      return {
        label: "DISCOVER",
        title: "Search Music",
        description: "Find songs, artists, albums, and genres.",
        songs: filteredSongs,
      };
    }

    return {
      label: "YOUR MUSIC SPACE",
      title: "Featured Music",
      description: "",
      songs: searchQuery.trim() ? filteredSongs : songs.slice(0, 4),
    };
  };

  const sectionContent = getSectionContent();

  return (
    <div className="app">
      <Sidebar
        activeSection={activeSection}
        onSectionChange={handleSectionChange}
      />

      <div className="app-content">
        <TopBar
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange}
        />

        <main className="main-content">
          {activeSection === "home" && (
            <section className="welcome-section">
              <p className="section-label">YOUR MUSIC SPACE</p>

              <h1>Everything you love, in one place.</h1>

              <p className="welcome-description">
                Discover music, create playlists, and enjoy your
                favorite songs.
              </p>
            </section>
          )}

          {activeSection === "playlists" ? (
            <PlaylistSection
              playlists={playlists}
              songs={songs}
              onCreatePlaylist={handleCreatePlaylist}
              onSelectSong={handleSelectSong}
              onPlayPlaylist={handlePlayPlaylist}
              onDeletePlaylist={handleDeletePlaylist}
              onRemoveSongFromPlaylist={
                handleRemoveSongFromPlaylist
              }
              onRenamePlaylist={handleRenamePlaylist}
            />
          ) : (
            <section className="featured-section">
              <div className="section-heading">
                <div>
                  <p className="section-label">
                    {sectionContent.label}
                  </p>

                  <h2>{sectionContent.title}</h2>

                  {sectionContent.description && (
                    <p className="welcome-description">
                      {sectionContent.description}
                    </p>
                  )}
                </div>

                <span className="song-count">
                  {sectionContent.songs.length} songs
                </span>
              </div>

              {sectionContent.songs.length > 0 ? (
                <div className="music-grid">
                  {sectionContent.songs.map((song) => (
                    <MusicCard
                      key={song.id}
                      song={song}
                      onSelect={handleSelectSong}
                      isFavorite={favoriteSongs.includes(song.id)}
                      onToggleFavorite={handleToggleFavorite}
                      onAddToPlaylist={handleOpenPlaylistModal}
                    />
                  ))}
                </div>
              ) : (
                <div className="empty-search-state">
                  <span className="empty-search-icon">
                    {activeSection === "favorites" ? "♡" : "⌕"}
                  </span>

                  <h3>
                    {activeSection === "favorites"
                      ? "No favorites yet"
                      : "No music found"}
                  </h3>

                  <p>
                    {activeSection === "favorites"
                      ? "Add songs to your favorites and they will appear here."
                      : "Try searching for a different song, artist, album, or genre."}
                  </p>
                </div>
              )}
            </section>
          )}
        </main>
      </div>

      <PlayerBar
        currentSong={currentSong}
        isPlaying={isPlaying}
        onTogglePlay={handleTogglePlay}
        onNext={handleNext}
        onPrevious={handlePrevious}
        currentTime={currentTime}
        duration={duration}
        onSeek={handleSeek}
        volume={volume}
        onVolumeChange={handleVolumeChange}
      />

      <PlaylistModal
        song={selectedSongForPlaylist}
        playlists={playlists}
        onClose={handleClosePlaylistModal}
        onAddSong={handleAddSongToPlaylist}
      />
    </div>
  );
}

export default App;