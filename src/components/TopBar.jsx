
function TopBar({ searchQuery, onSearchChange }) {
  return (
    <header className="top-bar">
      <div className="top-bar-heading">
        <p className="page-label">Welcome back</p>
        <h2>Discover your music</h2>
      </div>

      <div className="top-bar-search">
        <span className="search-icon">⌕</span>

        <input
          type="text"
          placeholder="Search songs, artists..."
          value={searchQuery}
          onChange={(event) => onSearchChange(event.target.value)}
          aria-label="Search songs and artists"
        />
      </div>

      <div className="top-bar-actions">
        <button className="icon-button" aria-label="Notifications">
          ♧
        </button>

        <div className="profile">
          <div className="profile-avatar">S</div>

          <div className="profile-details">
            <strong>Sonic User</strong>
            <span>Music lover</span>
          </div>
        </div>
      </div>
    </header>
  );
}

export default TopBar;