function Sidebar() {
  return (
    <aside className="sidebar">
      <h1 className="logo">SonicFlow</h1>

      <nav className="sidebar-navigation">
        <p className="navigation-title">Menu</p>

        <button className="navigation-item active">
          <span>⌂</span>
          Home
        </button>

        <button className="navigation-item">
          <span>⌕</span>
          Search
        </button>

        <button className="navigation-item">
          <span>♫</span>
          Your Library
        </button>

        <p className="navigation-title">Your Music</p>

        <button className="navigation-item">
          <span>♡</span>
          Favorites
        </button>

        <button className="navigation-item">
          <span>▤</span>
          Playlists
        </button>
      </nav>
    </aside>
  );
}

export default Sidebar;