function QueuePanel({
  currentSong,
  playlistQueue = [],
  onSelectSong,
  onClearQueue,
  onRemoveSong,
}) {
  const hasQueue = playlistQueue.length > 0;

  return (
    <section className="queue-panel">
      <div className="queue-panel-header">
        <div>
          <span className="section-label">
            NOW PLAYING
          </span>

          <h2 className="queue-panel-title">
            Playback Queue
          </h2>
        </div>

        {hasQueue && (
          <button
            type="button"
            className="queue-clear-button"
            onClick={onClearQueue}
          >
            Clear Queue
          </button>
        )}
      </div>

      {currentSong && (
        <div className="queue-current-song">
          <img
            src={currentSong.cover}
            alt={currentSong.title}
            className="queue-song-cover"
          />

          <div className="queue-song-info">
            <span className="queue-song-label">
              CURRENTLY PLAYING
            </span>

            <h3>{currentSong.title}</h3>

            <p>{currentSong.artist}</p>
          </div>

          <span className="queue-playing-icon">
            ♫
          </span>
        </div>
      )}

      <div className="queue-section-heading">
        <h3>Up Next</h3>

        <span>
          {playlistQueue.length}{" "}
          {playlistQueue.length === 1
            ? "song"
            : "songs"}
        </span>
      </div>

      {hasQueue ? (
        <div className="queue-song-list">
          {playlistQueue.map((song, index) => (
            <div
              className="queue-song-item"
              key={song.id}
            >
              <button
                type="button"
                className="queue-song-main"
                onClick={() =>
                  onSelectSong(song)
                }
              >
                <span className="queue-song-number">
                  {String(index + 1).padStart(
                    2,
                    "0"
                  )}
                </span>

                <img
                  src={song.cover}
                  alt={song.title}
                  className="queue-song-cover-small"
                />

                <div className="queue-song-info-small">
                  <h4>{song.title}</h4>

                  <p>{song.artist}</p>
                </div>

                <span className="queue-song-play-icon">
                  ▶
                </span>
              </button>

              <button
                type="button"
                className="queue-song-remove-button"
                onClick={() =>
                  onRemoveSong(song.id)
                }
                aria-label={`Remove ${song.title} from queue`}
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="queue-empty-state">
          <div className="queue-empty-icon">
            ♫
          </div>

          <h3>Your queue is empty</h3>

          <p>
            Play a playlist to see the upcoming
            songs here.
          </p>
        </div>
      )}
    </section>
  );
}

export default QueuePanel;