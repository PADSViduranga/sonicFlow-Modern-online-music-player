
import { useEffect, useRef, useState } from "react";

import Sidebar from "./components/Sidebar";
import TopBar from "./components/TopBar";
import MusicCard from "./components/MusicCard";
import RecentlyPlayed from "./components/RecentlyPlayed";
import PlayerBar from "./components/PlayerBar";

import {
  featuredSongs,
  recentlyPlayed,
} from "./data/songs";

function App() {
  const audioRef = useRef(null);

  const [currentSong, setCurrentSong] = useState(featuredSongs[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);

  useEffect(() => {
    const audio = new Audio();
    audioRef.current = audio;
    audio.volume = 0.7;

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
    };

    const handleEnded = () => {
      setIsPlaying(false);
    };

    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.pause();
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener(
        "loadedmetadata",
        handleLoadedMetadata
      );
      audio.removeEventListener("ended", handleEnded);
      audioRef.current = null;
    };
  }, []);

  useEffect(() => {
    const audio = audioRef.current;

    if (!audio || !currentSong?.audioUrl) {
      return;
    }

    audio.pause();
    audio.src = currentSong.audioUrl;
    audio.load();

    setCurrentTime(0);
    setDuration(0);
    setIsPlaying(false);
  }, [currentSong]);

  const handleSelectSong = (song) => {
    setCurrentSong(song);
  };

  const handleTogglePlay = async () => {
    const audio = audioRef.current;

    if (!audio || !currentSong?.audioUrl) {
      return;
    }

    try {
      if (audio.paused) {
        await audio.play();
        setIsPlaying(true);
      } else {
        audio.pause();
        setIsPlaying(false);
      }
    } catch (error) {
      console.error("Audio playback failed:", error);
      setIsPlaying(false);
    }
  };

  const handleNext = () => {
    const nextIndex =
      (featuredSongs.findIndex(
        (song) => song.id === currentSong.id
      ) + 1) % featuredSongs.length;

    setCurrentSong(featuredSongs[nextIndex]);
  };

  const handlePrevious = () => {
    const currentIndex = featuredSongs.findIndex(
      (song) => song.id === currentSong.id
    );

    const previousIndex =
      (currentIndex - 1 + featuredSongs.length) %
      featuredSongs.length;

    setCurrentSong(featuredSongs[previousIndex]);
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

    if (!audio) {
      return;
    }

    audio.volume = newVolume;
    setVolume(newVolume);
  };

  return (
    <div className="app-layout">
      <Sidebar />

      <main className="main-content">
        <TopBar />

        <div className="dashboard-content">
          <section className="welcome-section">
            <p className="welcome-label">WELCOME BACK</p>

            <h1>
              Discover your
              <br />
              next <span>favorite sound.</span>
            </h1>

            <p className="welcome-description">
              Find the perfect soundtrack for every moment.
            </p>
          </section>

          <section className="featured-section">
            <div className="section-heading">
              <h2>Featured Music</h2>
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

          <RecentlyPlayed
            songs={recentlyPlayed}
            onSelect={handleSelectSong}
          />
        </div>
      </main>

      <PlayerBar
        currentSong={currentSong}
        isPlaying={isPlaying}
        currentTime={currentTime}
        duration={duration}
        volume={volume}
        onTogglePlay={handleTogglePlay}
        onNext={handleNext}
        onPrevious={handlePrevious}
        onSeek={handleSeek}
        onVolumeChange={handleVolumeChange}
      />
    </div>
  );
}

export default App;