import { useState } from "react";

function PlaylistSection({
  playlists,
  songs,
  onCreatePlaylist,
  onSelectSong,
  onPlayPlaylist,
  onDeletePlaylist,
  onRemoveSongFromPlaylist,
  onRenamePlaylist,
}) {
  const [playlistName, setPlaylistName] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [selectedPlaylistId, setSelectedPlaylistId] = useState(null);

  const selectedPlaylist = playlists.find(
    (playlist) => playlist.id === selectedPlaylistId
  );

  const playlistSongs = selectedPlaylist
    ? selectedPlaylist.songs
        .map((songId) => songs.find((song) => song.id === songId))
        .filter(Boolean)
    : [];

  const handleSubmit = (event) => {
    event.preventDefault();

    const trimmedName = playlistName.trim();

    if (!trimmedName) {
      return;
    }

    onCreatePlaylist(trimmedName);
    setPlaylistName("");
    setShowForm(false);
  };

  const handleDeletePlaylist = (playlistId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this playlist?"
    );

    if (!confirmed) {
      return;
    }

    onDeletePlaylist(playlistId);
    setSelectedPlaylistId(null);
  };

  const handleRenamePlaylist = (playlist) => {
    const newName = window.prompt(
      "Enter a new playlist name:",
      playlist.name
    );

    if (newName === null) {
      return;
    }

    const trimmedName = newName.trim();

    if (!trimmedName) {
      return;
    }

    onRenamePlaylist(playlist.id, trimmedName);
  };

  const handleRemoveSong = (playlistId, songId) => {
    const confirmed = window.confirm(
      "Remove this song from the playlist?"
    );

    if (!confirmed) {
      return;
    }

    onRemoveSongFromPlaylist(playlistId, songId);
  };

  const handlePlayAll = () => {
    if (playlistSongs.length === 0) {
      return;
    }

    const validSongIds = playlistSongs.map(
      (song) => song.id
    );

    onPlayPlaylist(validSongIds);
  };

  if (selectedPlaylist) {
    return (
      <section className="playlist-section">
        <div className="playlist-header">
          <div>
            <button
              type="button"
              className="back-button"
              onClick={() => setSelectedPlaylistId(null)}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                marginBottom: "18px",
                padding: "9px 14px",
                border: "1px solid rgba(139, 92, 246, 0.35)",
                borderRadius: "10px",
                background: "rgba(139, 92, 246, 0.08)",
                color: "#c4b5fd",
                fontSize: "14px",
                fontWeight: "600",
                cursor: "pointer",
              }}
            >
              ← Back to Playlists
            </button>

            <div>
              <span className="section-label">
                YOUR COLLECTION
              </span>

              <h2 className="section-title">
                {selectedPlaylist.name}
              </h2>

              <p className="playlist-description">
                {playlistSongs.length}{" "}
                {playlistSongs.length === 1 ? "song" : "songs"} in
                this playlist
              </p>
            </div>
          </div>

          <div className="playlist-header-actions">
            <button
              type="button"
              className="playlist-action-button"
              onClick={handlePlayAll}
              disabled={playlistSongs.length === 0}
            >
              ▶ Play All
            </button>

            <button
              type="button"
              className="playlist-rename-button"
              onClick={() =>
                handleRenamePlaylist(selectedPlaylist)
              }
            >
              Rename
            </button>

            <button
              type="button"
              className="playlist-delete-button"
              onClick={() =>
                handleDeletePlaylist(selectedPlaylist.id)
              }
            >
              Delete
            </button>
          </div>
        </div>

        {playlistSongs.length > 0 ? (
          <div className="playlist-song-list">
            {playlistSongs.map((song) => (
              <div
                className="playlist-song-item"
                key={song.id}
              >
                <img
                  className="playlist-song-cover"
                  src={song.cover}
                  alt={song.title}
                />

                <div className="playlist-song-info">
                  <h3>{song.title}</h3>
                  <p>{song.artist}</p>
                </div>

                <div className="playlist-song-actions">
                  <button
                    type="button"
                    className="playlist-song-play-button"
                    onClick={() => onSelectSong(song)}
                    aria-label={`Play ${song.title}`}
                  >
                    ▶
                  </button>

                  <button
                    type="button"
                    className="playlist-song-remove-button"
                    onClick={() =>
                      handleRemoveSong(
                        selectedPlaylist.id,
                        song.id
                      )
                    }
                    aria-label={`Remove ${song.title}`}
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="playlist-empty-state">
            <div className="playlist-empty-icon">♫</div>

            <h3>This playlist is empty</h3>

            <p>
              Add songs from your music library to start listening.
            </p>
          </div>
        )}
      </section>
    );
  }

  return (
    <section className="playlist-section">
      <div className="playlist-header">
        <div>
          <span className="section-label">
            YOUR COLLECTION
          </span>

          <h2 className="section-title">
            Your Playlists
          </h2>

          <p className="playlist-description">
            Organize your favorite music into custom playlists.
          </p>
        </div>

        <button
          type="button"
          className="create-playlist-button"
          onClick={() =>
            setShowForm((previous) => !previous)
          }
        >
          {showForm ? "Cancel" : "+ Create Playlist"}
        </button>
      </div>

      {showForm && (
        <form
          className="playlist-form"
          onSubmit={handleSubmit}
        >
          <input
            type="text"
            value={playlistName}
            onChange={(event) =>
              setPlaylistName(event.target.value)
            }
            placeholder="Enter playlist name..."
            maxLength={60}
            autoFocus
          />

          <button type="submit">
            Create
          </button>
        </form>
      )}

      {playlists.length > 0 ? (
        <div className="playlist-grid">
          {playlists.map((playlist) => {
            const playlistCoverSongs = playlist.songs
              .map((songId) =>
                songs.find(
                  (song) => song.id === songId
                )
              )
              .filter(Boolean)
              .slice(0, 4);

            return (
              <div
                className="playlist-card-wrapper"
                key={playlist.id}
              >
                <button
                  type="button"
                  className="playlist-card"
                  onClick={() =>
                    setSelectedPlaylistId(
                      playlist.id
                    )
                  }
                >
                  {playlistCoverSongs.length > 0 ? (
                    <div className="playlist-cover-grid">
                      {playlistCoverSongs.map(
                        (song) => (
                          <img
                            className="playlist-cover-image"
                            key={song.id}
                            src={song.cover}
                            alt={song.title}
                          />
                        )
                      )}
                    </div>
                  ) : (
                    <div className="playlist-card-icon">
                      ♫
                    </div>
                  )}

                  <div className="playlist-card-info">
                    <h3>{playlist.name}</h3>

                    <p>
                      {playlist.songs.length}{" "}
                      {playlist.songs.length === 1
                        ? "song"
                        : "songs"}
                    </p>
                  </div>
                </button>

                <div className="playlist-card-actions">
                  <button
                    type="button"
                    className="playlist-rename-button"
                    onClick={() =>
                      handleRenamePlaylist(playlist)
                    }
                  >
                    Rename
                  </button>

                  <button
                    type="button"
                    className="playlist-delete-button"
                    onClick={() =>
                      handleDeletePlaylist(
                        playlist.id
                      )
                    }
                  >
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="playlist-empty-state">
          <div className="playlist-empty-icon">
            ♫
          </div>

          <h3>No playlists yet</h3>

          <p>
            Create your first playlist and start
            building your music collection.
          </p>
        </div>
      )}
    </section>
  );
}

export default PlaylistSection;