
function Sidebar({ activeSection, onSectionChange }) {
  return (
    <aside className="sidebar">
      <h1 className="logo">SonicFlow</h1>

      <nav className="sidebar-navigation">
        <p className="navigation-title">Menu</p>

        <button
          className={`navigation-item ${
            activeSection === "home" ? "active" : ""
          }`}
          onClick={() => onSectionChange("home")}
        >
          <span>⌂</span>
          Home
        </button>

        <button
          className={`navigation-item ${
            activeSection === "search" ? "active" : ""
          }`}
          onClick={() => onSectionChange("search")}
        >
          <span>⌕</span>
          Search
        </button>

        <button
          className={`navigation-item ${
            activeSection === "library" ? "active" : ""
          }`}
          onClick={() => onSectionChange("library")}
        >
          <span>♫</span>
          Your Library
        </button>

        <p className="navigation-title">Your Music</p>

        <button
          className={`navigation-item ${
            activeSection === "favorites" ? "active" : ""
          }`}
          onClick={() => onSectionChange("favorites")}
        >
          <span>♡</span>
          Favorites
        </button>

        <button
          className={`navigation-item ${
            activeSection === "playlists" ? "active" : ""
          }`}
          onClick={() => onSectionChange("playlists")}
        >
          <span>▤</span>
          Playlists
        </button>
      </nav>
    </aside>
  );
}

export default Sidebar;