
function PlayerBar({ currentSong }) {
  return (
    <footer className="player-bar">
      <div className="player-song">
        <img
          src={currentSong.cover}
          alt=""
          className="player-cover"
        />

        <div className="player-song-info">
          <strong>{currentSong.title}</strong>
          <span>{currentSong.artist}</span>
        </div>

        <button className="player-like" aria-label="Like song">
          ♡
        </button>
      </div>

      <div className="player-controls">
        <div className="control-buttons">
          <button aria-label="Shuffle">⤨</button>
          <button aria-label="Previous song">◀◀</button>
          <button className="main-play-button" aria-label="Play">
            ▶
          </button>
          <button aria-label="Next song">▶▶</button>
          <button aria-label="Repeat">↻</button>
        </div>

        <div className="progress-container">
          <span>0:00</span>
          <div className="progress-track">
            <div className="progress-fill"></div>
          </div>
          <span>0:00</span>
        </div>
      </div>

      <div className="player-volume">
        <span>♬</span>
        <div className="volume-track">
          <div className="volume-fill"></div>
        </div>
      </div>
    </footer>
  );
}

export default PlayerBar;