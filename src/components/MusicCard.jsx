
function MusicCard({ song, onSelect, isFavorite, onToggleFavorite }) {
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
        <h3>{song.title}</h3>
        <p>{song.artist}</p>
      </div>
    </article>
  );
}

export default MusicCard;