function RecentlyPlayed({ songs, onSelect, onAddToQueue }) {
  return (
    <section className="recent-section">
      <div className="section-heading">
        <h2>Recently Played</h2>
        <button className="see-all-button">See all →</button>
      </div>

      <div className="recent-list">
        {songs.map((song) => (
          <div className="recent-item-wrapper" key={song.id}>
            <button
              className="recent-item"
              onClick={() => onSelect(song)}
            >
              <img src={song.cover} alt="" className="recent-cover" />

              <span className="recent-details">
                <strong>{song.title}</strong>
                <small>{song.artist}</small>
              </span>

              <span className="recent-play">▶</span>
            </button>

            <button
              className="recent-add-queue-button"
              onClick={() => onAddToQueue(song)}
              aria-label={`Add ${song.title} to queue`}
            >
              +
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}

export default RecentlyPlayed;