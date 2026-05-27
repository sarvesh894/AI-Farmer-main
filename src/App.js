import "./App.css";
import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "./firebase";
import Header from "./header";
import Footer from "./footer";
import Landing from "./landing";
import CropPage from "./pages/CropPage";
import FertilizerPage from "./pages/FertilizerPage";
import DiseasePage from "./pages/DiseasePage";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Dashboard from "./pages/Dashboard";
import HistoryPage from "./pages/HistoryPage";
import SoilHealth from "./pages/SoilHealth";
import CropCalendar from "./pages/CropCalendar";
import Settings from "./pages/Settings";
import MarketPage from "./pages/MarketPage";
import FuturePredictions from "./pages/FuturePredictions";
import { Analytics } from "@vercel/analytics/react";
import ChatBot from "./components/ChatBot";

export const DarkModeContext = React.createContext();

// Public landing page — visible to everyone
function PublicHome({ darkMode, user }) {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = React.useState(false);

  return (
    <>
      {/* Public header */}
      <header className={`sticky top-0 z-50 backdrop-blur-md border-b ${
        darkMode ? "bg-gray-900/95 border-green-900" : "bg-white/95 border-green-100"
      }`}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center text-base shadow-md">🌿</div>
              <span className={`text-base font-bold tracking-tight ${darkMode ? "text-green-400" : "text-green-700"}`}>AI Farmer</span>
            </div>

            {/* Desktop nav */}
            <nav className="hidden md:flex items-center gap-1">
              {[
                { label: "Home",         href: "#"         },
                { label: "About",        href: "#about"    },
                { label: "Features",     href: "#features" },
                { label: "How it Works", href: "#how"      },
                { label: "Help",         href: "#help"     },
                { label: "Contact",      href: "#footer"   },
              ].map((l, i) => (
                <a key={i} href={l.href}
                  className={`px-3 py-2 rounded-xl text-sm font-medium transition-colors no-underline ${
                    darkMode ? "text-gray-300 hover:bg-gray-800 hover:text-green-300" : "text-gray-600 hover:bg-green-50 hover:text-green-700"
                  }`}>
                  {l.label}
                </a>
              ))}
              {/* no contact button */}
            </nav>

            {/* CTA buttons */}
            <div className="flex items-center gap-3">
              {user ? (
                <button onClick={() => navigate("/dashboard")} className="btn-eco text-sm px-4 py-2">
                  Dashboard →
                </button>
              ) : (
                <>
                  <button onClick={() => navigate("/signin")}
                    className={`hidden sm:block text-sm font-medium px-3 py-2 rounded-xl transition-colors ${
                      darkMode ? "text-green-400 hover:bg-gray-800" : "text-green-700 hover:bg-green-50"
                    }`}>
                    Sign In
                  </button>
                  <button onClick={() => navigate("/signup")} className="btn-eco text-sm px-4 py-2">
                    Get Started →
                  </button>
                </>
              )}
              {/* Mobile menu button */}
              <button onClick={() => setMobileOpen(!mobileOpen)}
                className={`md:hidden p-2 rounded-xl ${darkMode ? "text-gray-300 hover:bg-gray-700" : "text-gray-600 hover:bg-green-50"}`}>
                {mobileOpen ? "✕" : "☰"}
              </button>
            </div>
          </div>

          {/* Mobile menu */}
          {mobileOpen && (
            <div className={`md:hidden border-t py-3 ${darkMode ? "border-green-900" : "border-green-100"}`}>
              {[
                { label: "Home",         href: "#"         },
                { label: "About",        href: "#about"    },
                { label: "Features",     href: "#features" },
                { label: "How it Works", href: "#how"      },
                { label: "Help",         href: "#help"     },
                { label: "Contact",      href: "#footer"   },
              ].map((l, i) => (
                <a key={i} href={l.href} onClick={() => setMobileOpen(false)}
                  className={`block px-3 py-2 text-sm rounded-xl no-underline ${
                    darkMode ? "text-gray-300 hover:bg-gray-700" : "text-gray-600 hover:bg-green-50"
                  }`}>
                  {l.label}
                </a>
              ))}
              {!user && (
                <button onClick={() => navigate("/signin")}
                  className={`w-full text-left px-3 py-2 text-sm bg-transparent border-none cursor-pointer rounded-xl ${
                    darkMode ? "text-green-400 hover:bg-gray-700" : "text-green-700 hover:bg-green-50"
                  }`}>
                  Sign In
                </button>
              )}
            </div>
          )}
        </div>
      </header>

      <Landing darkMode={darkMode} />
      <Footer darkMode={darkMode} />
    </>
  );
}

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    document.body.classList.toggle("dark", darkMode);
  }, [darkMode]);

  const handleSignOut = () => signOut(auth);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-green-50">
        <div className="text-center">
          <div className="text-5xl mb-4 animate-bounce">🌿</div>
          <p className="text-green-700 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  // Protected layout — with header/footer
  const Protected = ({ children }) => user ? children : <SignIn darkMode={darkMode} />;

  return (
    <DarkModeContext.Provider value={{ darkMode, setDarkMode }}>
      <Analytics />
      <BrowserRouter>
        <div className={`flex min-h-screen flex-col leaf-bg ${darkMode ? "dark" : ""}`}>
          <Routes>
            {/* Public landing page */}
            <Route path="/" element={<PublicHome darkMode={darkMode} user={user} />} />

            {/* Auth pages */}
            <Route path="/signin" element={<SignIn darkMode={darkMode} />} />
            <Route path="/signup" element={<SignUp darkMode={darkMode} />} />

            {/* Protected pages — all wrapped with header/footer */}
            <Route path="/*" element={
              <Protected>
                <Header darkMode={darkMode} setDarkMode={setDarkMode} user={user} onSignOut={handleSignOut} />
                <main className="flex-1">
                  <Routes>
                    <Route path="/dashboard" element={<Dashboard darkMode={darkMode} user={user} />} />
                    <Route path="/crop"       element={<CropPage darkMode={darkMode} user={user} />} />
                    <Route path="/fertilizer" element={<FertilizerPage darkMode={darkMode} user={user} />} />
                    <Route path="/disease"    element={<DiseasePage darkMode={darkMode} user={user} />} />
                    <Route path="/history"    element={<HistoryPage darkMode={darkMode} user={user} />} />
                    <Route path="/soil"       element={<SoilHealth darkMode={darkMode} user={user} />} />
                    <Route path="/calendar"   element={<CropCalendar darkMode={darkMode} />} />
                    <Route path="/settings"   element={<Settings darkMode={darkMode} setDarkMode={setDarkMode} user={user} />} />
                    <Route path="/market"     element={<MarketPage darkMode={darkMode} />} />
                    <Route path="/future"     element={<FuturePredictions darkMode={darkMode} />} />
                  </Routes>
                </main>
                <Footer darkMode={darkMode} />
                <ChatBot darkMode={darkMode} />
              </Protected>
            } />
          </Routes>
        </div>
      </BrowserRouter>
    </DarkModeContext.Provider>
  );
}

export default App;
