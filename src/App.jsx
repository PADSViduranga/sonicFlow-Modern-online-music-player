
import { useEffect, useRef, useState } from "react";
import Sidebar from "./components/Sidebar";
import TopBar from "./components/TopBar";
import PlayerBar from "./components/PlayerBar";
import MusicCard from "./components/MusicCard";
import songs from "./data/songs";

function App() {
  const audioRef = useRef(null);

  const [currentSong, setCurrentSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);

  const featuredSongs = songs.slice(0, 4);

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
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("play", handlePlay);
      audio.removeEventListener("pause", handlePause);
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("error", handleError);

      audio.src = "";
    };
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

  const handleSelectSong = (song) => {
    setCurrentSong(song);
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
    const audio = audioRef.current;

    setVolume(newVolume);

    if (audio) {
      audio.volume = newVolume;
    }
  };

  return (
    <div className="app">
      <Sidebar />

      <div className="app-content">
        <TopBar />

        <main className="main-content">
          <section className="welcome-section">
            <p className="section-label">YOUR MUSIC SPACE</p>

            <h1>Everything you love, in one place.</h1>

            <p className="welcome-description">
              Discover music, create playlists, and enjoy your favorite songs.
            </p>
          </section>

          <section className="featured-section">
            <div className="section-heading">
              <div>
                <p className="section-label">HANDPICKED FOR YOU</p>

                <h2>Featured Music</h2>
              </div>

              <button className="see-all-button">
                See all →
              </button>
            </div>

            <div className="music-grid">
              {featuredSongs.map((song) => (
                <MusicCard
                  key={song.id}
                  song={song}
                  onSelect={handleSelectSong}
                />
              ))}
            </div>
          </section>
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
    </div>
  );
}

export default App;