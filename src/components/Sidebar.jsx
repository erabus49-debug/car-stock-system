function Sidebar({
  darkMode,
  setDarkMode,
}) {
  return (
    <div className="sidebar">
      <div>
        <h1 className="logo">
          🚗 CAR STOCK
        </h1>

        <button className="menu active">
          Dashboard
        </button>

        <button
          className="menu"
          onClick={() =>
            setDarkMode(
              !darkMode
            )
          }
        >
          {darkMode
            ? "☀️ Light Mode"
            : "🌙 Dark Mode"}
        </button>
      </div>

      <p className="copyright">
        © 2025 Car Stock
      </p>
    </div>
  );
}

export default Sidebar;