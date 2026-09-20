
function TopBar() {
  return (
    <header className="top-bar">
      <div className="search-box">
        <span className="search-icon">⌕</span>
        <input
          type="text"
          placeholder="Search songs, artists, albums..."
        />
      </div>

      <div className="top-actions">
        <button className="icon-button" aria-label="Notifications">
          ♧
        </button>

        <div className="profile">
          <div className="profile-avatar">S</div>
          <div className="profile-info">
            <strong>Listener</strong>
            <span>Music Explorer</span>
          </div>
        </div>
      </div>
    </header>
  );
}

export default TopBar;