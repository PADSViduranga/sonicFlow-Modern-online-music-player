
import { useState } from "react";
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
  const [currentSong, setCurrentSong] = useState(featuredSongs[0]);

  const handleSelectSong = (song) => {
    setCurrentSong(song);
  };

  return (
    <div className="app-layout">
      <Sidebar />

      <main className="main-content">
        <TopBar />

        <div className="dashboard-content">
          <section className="welcome-section">
            <p className="welcome-label">WELCOME BACK</p>
            <h1>Discover your<br />next <span>favorite sound.</span></h1>
            <p className="welcome-description">
              Find the perfect soundtrack for every moment.
            </p>
          </section>

          <section className="featured-section">
            <div className="section-heading">
              <h2>Featured Music</h2>
              <button className="see-all-button">See all →</button>
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

      <PlayerBar currentSong={currentSong} />
    </div>
  );
}

export default App;