import { useNavigate, useLocation } from "react-router-dom";
import { useState, useRef } from "react";
import Logo from "./components/Logo";

const navItems = [
  { label: "Dashboard", path: "/dashboard", icon: "🏠" },
  {
    label: "AI Tools",
    icon: "🤖",
    children: [
      { label: "Crop Recommendation", path: "/crop", icon: "🌾" },
      { label: "Fertilizer", path: "/fertilizer", icon: "💧" },
      { label: "Disease Detection", path: "/disease", icon: "🔬" },
    ],
  },
  {
    label: "Farm Tools",
    icon: "🌱",
    children: [
      { label: "Soil Health", path: "/soil", icon: "🧮" },
      { label: "Crop Calendar", path: "/calendar", icon: "📅" },
      { label: "Future Predictions", path: "/future", icon: "🔮" },
    ],
  },
  { label: "History", path: "/history", icon: "📊" },
  { label: "Market",  path: "/market",  icon: "📈" },
  { label: "Contact", path: "#footer",  icon: "✉️", isAnchor: true },
];

function DropdownMenu({ items, darkMode, navigate, onClose }) {
  return (
    <div className={`absolute top-full left-0 mt-1 w-52 rounded-2xl shadow-xl border py-2 z-50 ${
      darkMode ? "bg-gray-800 border-green-900" : "bg-white border-green-100"
    }`}>
      {items.map((item, i) => (
        <button
          key={i}
          onClick={() => { navigate(item.path); onClose(); }}
          className={`w-full text-left px-4 py-2.5 flex items-center gap-3 text-sm transition-colors ${
            darkMode ? "text-green-200 hover:bg-gray-700" : "text-gray-700 hover:bg-green-50"
          }`}
        >
          <span>{item.icon}</span>
          {item.label}
        </button>
      ))}
    </div>
  );
}

function Header({ darkMode, setDarkMode, user, onSignOut }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [openDropdown, setOpenDropdown] = useState(null);
  const [userDropdown, setUserDropdown] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const dropdownTimers = useRef({});

  const displayName = user?.displayName || user?.email?.split("@")[0] || "User";
  const initials = displayName.slice(0, 2).toUpperCase();
  const isActive = (path) => location.pathname === path;
  const closeAll = () => { setOpenDropdown(null); setUserDropdown(false); };

  // Hover handlers with delay to prevent flicker
  const handleMouseEnter = (key) => {
    clearTimeout(dropdownTimers.current[key]);
    setOpenDropdown(key);
  };

  const handleMouseLeave = (key) => {
    dropdownTimers.current[key] = setTimeout(() => {
      setOpenDropdown((prev) => (prev === key ? null : prev));
    }, 150);
  };

  const handleUserEnter = () => {
    clearTimeout(dropdownTimers.current["user"]);
    setUserDropdown(true);
  };

  const handleUserLeave = () => {
    dropdownTimers.current["user"] = setTimeout(() => {
      setUserDropdown(false);
    }, 150);
  };

  return (
    <header className={`sticky top-0 z-50 backdrop-blur-md border-b ${
      darkMode ? "bg-gray-900/95 border-green-900" : "bg-white/95 border-green-100"
    }`}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <button
            onClick={() => { navigate("/"); closeAll(); }}
            className="flex items-center gap-2 bg-transparent border-none cursor-pointer flex-shrink-0"
          >
            <Logo size={36} />
            <span className={`text-base font-bold tracking-tight hidden sm:block ${
              darkMode ? "text-green-400" : "text-green-700"
            }`}>
              AI Farmer
            </span>
          </button>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item, i) => (
              <div
                key={i}
                className="relative"
                onMouseEnter={() => item.children && handleMouseEnter(i)}
                onMouseLeave={() => item.children && handleMouseLeave(i)}
              >
                {item.children ? (
                  <>
                    <button
                      onClick={() => setOpenDropdown(openDropdown === i ? null : i)}
                      className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                        openDropdown === i
                          ? darkMode ? "bg-green-900/50 text-green-300" : "bg-green-100 text-green-700"
                          : darkMode ? "text-gray-300 hover:bg-gray-800 hover:text-green-300" : "text-gray-600 hover:bg-green-50 hover:text-green-700"
                      }`}
                    >
                      <span>{item.icon}</span>
                      {item.label}
                      <span className="text-xs opacity-60">▾</span>
                    </button>
                    {openDropdown === i && (
                      <DropdownMenu
                        items={item.children}
                        darkMode={darkMode}
                        navigate={navigate}
                        onClose={closeAll}
                      />
                    )}
                  </>
                ) : (
                  <button
                    onClick={() => {
                      if (item.isAnchor) {
                        document.getElementById("footer")?.scrollIntoView({ behavior: "smooth" });
                        closeAll();
                      } else {
                        navigate(item.path); closeAll();
                      }
                    }}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                      isActive(item.path)
                        ? darkMode ? "bg-green-900/50 text-green-300" : "bg-green-100 text-green-700"
                        : darkMode ? "text-gray-300 hover:bg-gray-800 hover:text-green-300" : "text-gray-600 hover:bg-green-50 hover:text-green-700"
                    }`}
                  >
                    <span>{item.icon}</span>
                    {item.label}
                  </button>
                )}
              </div>
            ))}
          </nav>

          {/* Right — User avatar with dropdown */}
          <div className="flex items-center gap-2">
            {user && (
              <div
                className="relative"
                onMouseEnter={handleUserEnter}
                onMouseLeave={handleUserLeave}
              >
                <button
                  onClick={() => setUserDropdown(!userDropdown)}
                  className={`flex items-center gap-2 px-2 py-1 rounded-xl transition-all ${
                    darkMode ? "hover:bg-gray-700" : "hover:bg-green-50"
                  }`}
                >
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center text-sm font-bold text-white shadow-md">
                    {initials}
                  </div>
                  <span className={`text-sm font-medium hidden md:block max-w-[90px] truncate ${
                    darkMode ? "text-green-300" : "text-green-700"
                  }`}>
                    {displayName}
                  </span>
                  <span className={`text-xs hidden md:block ${darkMode ? "text-gray-400" : "text-gray-400"}`}>▾</span>
                </button>

                {userDropdown && (
                  <div className={`absolute right-0 mt-1 w-56 rounded-2xl shadow-xl border py-2 z-50 ${
                    darkMode ? "bg-gray-800 border-green-900" : "bg-white border-green-100"
                  }`}>
                    {/* User info */}
                    <div className={`px-4 py-3 border-b ${darkMode ? "border-green-900" : "border-green-50"}`}>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center text-sm font-bold text-white">
                          {initials}
                        </div>
                        <div className="min-w-0">
                          <p className={`text-sm font-semibold truncate ${darkMode ? "text-green-300" : "text-green-700"}`}>{displayName}</p>
                          <p className={`text-xs truncate ${darkMode ? "text-gray-400" : "text-gray-400"}`}>{user.email}</p>
                        </div>
                      </div>
                    </div>

                    {/* Dark mode toggle */}
                    <div className={`flex items-center justify-between px-4 py-2.5 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                      <span className="text-sm flex items-center gap-2">
                        {darkMode ? "🌙" : "☀️"} {darkMode ? "Dark Mode" : "Light Mode"}
                      </span>
                      <button
                        className={`dark-toggle ${darkMode ? "active" : ""}`}
                        onClick={() => setDarkMode(!darkMode)}
                        aria-label="Toggle dark mode"
                      />
                    </div>

                    {/* Settings */}
                    <button
                      onClick={() => { navigate("/settings"); setUserDropdown(false); }}
                      className={`w-full text-left px-4 py-2.5 text-sm flex items-center gap-2 transition-colors ${
                        darkMode ? "text-gray-300 hover:bg-gray-700" : "text-gray-700 hover:bg-green-50"
                      }`}
                    >
                      ⚙️ Settings
                    </button>

                    <div className={`border-t my-1 ${darkMode ? "border-green-900" : "border-green-50"}`} />

                    {/* Sign out */}
                    <button
                      onClick={() => { setUserDropdown(false); onSignOut(); }}
                      className={`w-full text-left px-4 py-2.5 text-sm flex items-center gap-2 transition-colors ${
                        darkMode ? "text-red-400 hover:bg-gray-700" : "text-red-500 hover:bg-red-50"
                      }`}
                    >
                      🚪 Sign Out
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className={`lg:hidden p-2 rounded-xl ${darkMode ? "text-gray-300 hover:bg-gray-700" : "text-gray-600 hover:bg-green-50"}`}
            >
              {mobileOpen ? "✕" : "☰"}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className={`lg:hidden border-t py-3 ${darkMode ? "border-green-900" : "border-green-100"}`}>
            {navItems.map((item, i) => (
              <div key={i}>
                {item.children ? (
                  <>
                    <div className={`px-3 py-1.5 text-xs font-semibold uppercase tracking-wider ${darkMode ? "text-green-500" : "text-green-600"}`}>
                      {item.label}
                    </div>
                    {item.children.map((child, j) => (
                      <button
                        key={j}
                        onClick={() => { navigate(child.path); setMobileOpen(false); }}
                        className={`w-full text-left px-6 py-2 text-sm flex items-center gap-2 ${
                          darkMode ? "text-gray-300 hover:bg-gray-700" : "text-gray-600 hover:bg-green-50"
                        }`}
                      >
                        {child.icon} {child.label}
                      </button>
                    ))}
                  </>
                ) : (
                  <button
                    onClick={() => { navigate(item.path); setMobileOpen(false); }}
                    className={`w-full text-left px-3 py-2 text-sm flex items-center gap-2 rounded-xl ${
                      isActive(item.path)
                        ? darkMode ? "bg-green-900/50 text-green-300" : "bg-green-100 text-green-700"
                        : darkMode ? "text-gray-300 hover:bg-gray-700" : "text-gray-600 hover:bg-green-50"
                    }`}
                  >
                    {item.icon} {item.label}
                  </button>
                )}
              </div>
            ))}
            <button
              onClick={() => { navigate("/settings"); setMobileOpen(false); }}
              className={`w-full text-left px-3 py-2 text-sm flex items-center gap-2 bg-transparent border-none cursor-pointer ${
                darkMode ? "text-gray-300 hover:bg-gray-700" : "text-gray-600 hover:bg-green-50"
              }`}
            >
              ⚙️ Settings
            </button>
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;
