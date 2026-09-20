
function PlayerBar({
  currentSong,
  isPlaying,
  currentTime,
  duration,
  volume,
  onTogglePlay,
  onNext,
  onPrevious,
  onSeek,
  onVolumeChange,
}) {
  const formatTime = (time) => {
    if (!Number.isFinite(time) || time < 0) {
      return "0:00";
    }

    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);

    return `${minutes}:${String(seconds).padStart(2, "0")}`;
  };

  const progress = duration > 0
    ? (currentTime / duration) * 100
    : 0;

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

          <button
            aria-label="Previous song"
            onClick={onPrevious}
          >
            ◀◀
          </button>

          <button
            className="main-play-button"
            aria-label={isPlaying ? "Pause" : "Play"}
            onClick={onTogglePlay}
          >
            {isPlaying ? "Ⅱ" : "▶"}
          </button>

          <button
            aria-label="Next song"
            onClick={onNext}
          >
            ▶▶
          </button>

          <button aria-label="Repeat">↻</button>
        </div>

        <div className="progress-container">
          <span>{formatTime(currentTime)}</span>

          <input
            type="range"
            min="0"
            max={duration || 0}
            step="0.1"
            value={Math.min(currentTime, duration || 0)}
            onChange={(event) => onSeek(Number(event.target.value))}
            className="progress-slider"
            aria-label="Seek through song"
          />

          <span>{formatTime(duration)}</span>
        </div>
      </div>

      <div className="player-volume">
        <span>♬</span>

        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={(event) =>
            onVolumeChange(Number(event.target.value))
          }
          className="volume-slider"
          aria-label="Volume"
        />
      </div>
    </footer>
  );
}

export default PlayerBar;