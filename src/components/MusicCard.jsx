function MusicCard({
  song,
  onSelect,
  isFavorite,
  onToggleFavorite,
  onAddToPlaylist,
}) {
  return (
    <article className="music-card">
      <div className="music-cover-wrapper">
        <img
          src={song.cover}
          alt={`${song.title} cover`}
          className="music-cover"
        />

        <button
          className="card-favorite-button"
          onClick={() => onToggleFavorite(song.id)}
          aria-label={
            isFavorite
              ? `Remove ${song.title} from favorites`
              : `Add ${song.title} to favorites`
          }
        >
          {isFavorite ? "♥" : "♡"}
        </button>

        <button
          className="card-play-button"
          onClick={() => onSelect(song)}
          aria-label={`Play ${song.title}`}
        >
          ▶
        </button>
      </div>

      <div className="music-card-info">
        <h3 title={song.title}>{song.title}</h3>
        <p title={song.artist}>{song.artist}</p>
      </div>

      <button
        className="add-to-playlist-button"
        onClick={() => onAddToPlaylist(song)}
      >
        + Add to Playlist
      </button>
    </article>
  );
}

export default MusicCard;