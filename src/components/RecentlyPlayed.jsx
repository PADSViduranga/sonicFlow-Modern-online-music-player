
function RecentlyPlayed({ songs, onSelect }) {
  return (
    <section className="recent-section">
      <div className="section-heading">
        <h2>Recently Played</h2>
        <button className="see-all-button">See all →</button>
      </div>

      <div className="recent-list">
        {songs.map((song) => (
          <button
            className="recent-item"
            key={song.id}
            onClick={() => onSelect(song)}
          >
            <img src={song.cover} alt="" className="recent-cover" />

            <span className="recent-details">
              <strong>{song.title}</strong>
              <small>{song.artist}</small>
            </span>

            <span className="recent-play">▶</span>
          </button>
        ))}
      </div>
    </section>
  );
}

export default RecentlyPlayed;