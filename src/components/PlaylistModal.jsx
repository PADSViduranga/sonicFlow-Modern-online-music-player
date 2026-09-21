
function PlaylistModal({
  song,
  playlists,
  onClose,
  onAddSong,
}) {
  if (!song) {
    return null;
  }

  return (
    <div className="playlist-modal-overlay" onClick={onClose}>
      <div
        className="playlist-modal"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="playlist-modal-header">
          <div>
            <p className="section-label">YOUR MUSIC</p>

            <h2>Add to Playlist</h2>

            <p className="playlist-modal-song">
              {song.title} — {song.artist}
            </p>
          </div>

          <button
            className="playlist-modal-close"
            onClick={onClose}
            aria-label="Close playlist popup"
          >
            ×
          </button>
        </div>

        {playlists.length > 0 ? (
          <div className="playlist-modal-list">
            {playlists.map((playlist) => {
              const isAlreadyAdded = playlist.songs.includes(song.id);

              return (
                <button
                  className="playlist-modal-item"
                  key={playlist.id}
                  onClick={() => onAddSong(playlist.id, song.id)}
                  disabled={isAlreadyAdded}
                >
                  <span className="playlist-modal-item-icon">
                    ♫
                  </span>

                  <span className="playlist-modal-item-details">
                    <strong>{playlist.name}</strong>

                    <small>
                      {playlist.songs.length} songs
                    </small>
                  </span>

                  <span className="playlist-modal-item-action">
                    {isAlreadyAdded ? "Added" : "+"}
                  </span>
                </button>
              );
            })}
          </div>
        ) : (
          <div className="playlist-modal-empty">
            <span>♫</span>

            <h3>No playlists available</h3>

            <p>Create a playlist first to add your music.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default PlaylistModal;