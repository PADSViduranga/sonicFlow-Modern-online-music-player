
import { useState } from "react";

function Sidebar() {
  const [activeItem, setActiveItem] = useState("Home");

  const mainMenu = [
    { name: "Home", icon: "⌂" },
    { name: "Discover", icon: "◈" },
    { name: "Library", icon: "▤" },
  ];

  const libraryMenu = [
    { name: "Liked Songs", icon: "♡" },
    { name: "My Playlists", icon: "☷" },
  ];

  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-icon">S</div>
        <span>Sonic<span>Flow</span></span>
      </div>

      <nav className="sidebar-nav">
        <p className="nav-label">MENU</p>

        {mainMenu.map((item) => (
          <button
            key={item.name}
            className={`nav-item ${
              activeItem === item.name ? "active" : ""
            }`}
            onClick={() => setActiveItem(item.name)}
          >
            <span className="nav-icon">{item.icon}</span>
            {item.name}
          </button>
        ))}

        <p className="nav-label">YOUR LIBRARY</p>

        {libraryMenu.map((item) => (
          <button
            key={item.name}
            className={`nav-item ${
              activeItem === item.name ? "active" : ""
            }`}
            onClick={() => setActiveItem(item.name)}
          >
            <span className="nav-icon">{item.icon}</span>
            {item.name}
          </button>
        ))}
      </nav>

      <div className="sidebar-bottom">
        <div className="sidebar-decoration">
          <span>✦</span>
          <p>Music for<br />every moment.</p>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;