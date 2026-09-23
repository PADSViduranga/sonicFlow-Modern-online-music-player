function PlayerBar({
  currentSong,
  isPlaying,
  onTogglePlay,
  onNext,
  onPrevious,
  currentTime,
  duration,
  onSeek,
  volume,
  onVolumeChange,
  isShuffleOn,
  onToggleShuffle,
  repeatMode,
  onToggleRepeat,
}) {
  const formatTime = (time) => {
    if (!Number.isFinite(time) || time < 0) {
      return "0:00";
    }

    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);

    return `${minutes}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  const progressPercentage =
    duration > 0
      ? (currentTime / duration) * 100
      : 0;

  const repeatLabel =
    repeatMode === "one"
      ? "Repeat One"
      : repeatMode === "all"
      ? "Repeat All"
      : "Repeat Off";

  return (
    <footer className="player-bar">
      <div className="player-song">
        {currentSong ? (
          <img
            src={currentSong.cover}
            alt={`${currentSong.title} cover`}
            className="player-cover"
          />
        ) : (
          <div className="player-cover"></div>
        )}

        <div className="player-song-details">
          <strong>
            {currentSong
              ? currentSong.title
              : "No song selected"}
          </strong>

          <span>
            {currentSong
              ? currentSong.artist
              : "Choose a song to start listening"}
          </span>
        </div>
      </div>

      <div className="player-center">
        <div className="player-controls">
          <button
            onClick={onPrevious}
            aria-label="Previous song"
            disabled={!currentSong}
            title="Previous"
          >
            |◀
          </button>

          <button
            className={`shuffle-button ${
              isShuffleOn ? "active" : ""
            }`}
            onClick={onToggleShuffle}
            aria-label={
              isShuffleOn
                ? "Disable shuffle"
                : "Enable shuffle"
            }
            aria-pressed={isShuffleOn}
            title={
              isShuffleOn
                ? "Shuffle On"
                : "Shuffle Off"
            }
          >
            🔀
          </button>

          <button
            className="main-play-button"
            onClick={onTogglePlay}
            aria-label={
              isPlaying
                ? "Pause song"
                : "Play song"
            }
            disabled={!currentSong}
          >
            {isPlaying ? "Ⅱ" : "▶"}
          </button>

          <button
            onClick={onNext}
            aria-label="Next song"
            disabled={!currentSong}
            title="Next"
          >
            ▶|
          </button>

          <button
            className={`repeat-button ${
              repeatMode !== "off"
                ? "active"
                : ""
            }`}
            onClick={onToggleRepeat}
            aria-label={repeatLabel}
            aria-pressed={
              repeatMode !== "off"
            }
            title={repeatLabel}
            disabled={!currentSong}
          >
            {repeatMode === "one"
              ? "🔂"
              : "🔁"}
          </button>
        </div>

        <div className="player-progress">
          <span>
            {formatTime(currentTime)}
          </span>

          <input
            type="range"
            min="0"
            max={duration || 0}
            step="0.1"
            value={currentTime}
            onChange={(event) =>
              onSeek(
                Number(event.target.value)
              )
            }
            style={{
              "--progress": `${progressPercentage}%`,
            }}
            disabled={
              !currentSong ||
              duration === 0
            }
            aria-label="Song progress"
          />

          <span>
            {formatTime(duration)}
          </span>
        </div>
      </div>

      <div className="player-volume">
        <span>
          {volume === 0
            ? "🔇"
            : "🔊"}
        </span>

        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={(event) =>
            onVolumeChange(
              Number(event.target.value)
            )
          }
          aria-label="Volume"
        />
      </div>
    </footer>
  );
}

export default PlayerBar;