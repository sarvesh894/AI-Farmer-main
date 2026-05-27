import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import WeatherWidget from "../components/WeatherWidget";

export default function Dashboard({ darkMode, user }) {
  const navigate = useNavigate();
  const [recent, setRecent] = useState([]);

  useEffect(() => {
    if (!user) return;
    const q = query(
      collection(db, "history"),
      where("userId", "==", user.uid)
    );
    getDocs(q).then((snap) => {
      const docs = snap.docs
        .map((d) => ({ id: d.id, ...d.data() }))
        .sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0))
        .slice(0, 3);
      setRecent(docs);
    }).catch(() => {});
  }, [user]);

  const displayName = user?.displayName || user?.email?.split("@")[0] || "Farmer";

  const shortcuts = [
    { icon: "🌾", label: "Crop Recommendation", path: "/crop", color: "from-green-400 to-emerald-500" },
    { icon: "💧", label: "Fertilizer", path: "/fertilizer", color: "from-teal-400 to-green-500" },
    { icon: "🔬", label: "Disease Detection", path: "/disease", color: "from-emerald-400 to-teal-500" },
    { icon: "📊", label: "History", path: "/history", color: "from-green-500 to-teal-600" },
    { icon: "🧮", label: "Soil Health", path: "/soil", color: "from-yellow-500 to-green-500" },
    { icon: "📅", label: "Crop Calendar", path: "/calendar", color: "from-orange-400 to-green-500" },
    { icon: "📈", label: "Market Prices", path: "/market", color: "from-blue-400 to-green-500" },
    { icon: "🔮", label: "Future Predictions", path: "/future", color: "from-purple-400 to-green-500" },
  ];

  const typeIcon = { crop: "🌾", fertilizer: "💧", disease: "🔬" };

  return (
    <div className={`min-h-screen ${darkMode ? "bg-gray-950" : "bg-gradient-to-br from-green-50 via-white to-emerald-50"}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* Greeting */}
        <div className="mb-8">
          <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium mb-3 ${
            darkMode ? "bg-green-900/50 text-green-300" : "bg-green-100 text-green-700"
          }`}>
            🌿 Welcome back
          </div>
          <h1 className={`text-3xl font-bold ${darkMode ? "text-green-200" : "text-gray-800"}`}>
            Hello, {displayName} 👋
          </h1>
          <p className={`text-sm mt-1 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
            What would you like to do today?
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left — shortcuts + recent */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quick Actions */}
            <div className={`eco-card p-6 ${darkMode ? "bg-gray-800/60" : ""}`}>
              <h2 className={`text-sm font-semibold mb-4 ${darkMode ? "text-green-400" : "text-green-700"}`}>
                ⚡ Quick Actions
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {shortcuts.map((s, i) => (
                  <button
                    key={i}
                    onClick={() => navigate(s.path)}
                    className={`flex flex-col items-center gap-2 p-4 rounded-2xl border transition-all hover:-translate-y-1 hover:shadow-md ${
                      darkMode ? "bg-gray-700/50 border-green-900 hover:border-green-700" : "bg-green-50 border-green-100 hover:border-green-300"
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center text-xl shadow`}>
                      {s.icon}
                    </div>
                    <span className={`text-xs font-medium text-center ${darkMode ? "text-green-300" : "text-gray-700"}`}>
                      {s.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            <div className={`eco-card p-6 ${darkMode ? "bg-gray-800/60" : ""}`}>
              <div className="flex items-center justify-between mb-4">
                <h2 className={`text-sm font-semibold ${darkMode ? "text-green-400" : "text-green-700"}`}>
                  🕐 Recent Activity
                </h2>
                <button onClick={() => navigate("/history")} className={`text-xs ${darkMode ? "text-green-400" : "text-green-600"} hover:underline`}>
                  View All →
                </button>
              </div>
              {recent.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-4xl mb-2">🌱</div>
                  <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                    No predictions yet. Try a feature above!
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {recent.map((r) => (
                    <div key={r.id} className={`flex items-center gap-3 p-3 rounded-xl ${
                      darkMode ? "bg-gray-700/50" : "bg-green-50"
                    }`}>
                      <span className="text-2xl">{typeIcon[r.type] || "🌿"}</span>
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-medium truncate ${darkMode ? "text-green-300" : "text-gray-700"}`}>
                          {r.result}
                        </p>
                        <p className={`text-xs ${darkMode ? "text-gray-500" : "text-gray-400"}`}>
                          {r.type?.charAt(0).toUpperCase() + r.type?.slice(1)} prediction
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right — weather */}
          <div className="space-y-6">
            <WeatherWidget darkMode={darkMode} />
            {/* Stats */}
            <div className={`eco-card p-5 ${darkMode ? "bg-gray-800/60" : ""}`}>
              <h2 className={`text-sm font-semibold mb-4 ${darkMode ? "text-green-400" : "text-green-700"}`}>
                📊 Platform Stats
              </h2>
              {[
                { icon: "🌾", label: "Crop Types", value: "22+" },
                { icon: "🔬", label: "Diseases Detected", value: "38+" },
                { icon: "💊", label: "Fertilizer Types", value: "7+" },
                { icon: "🎯", label: "Model Accuracy", value: "99%" },
              ].map((s, i) => (
                <div key={i} className={`flex items-center justify-between py-2 border-b last:border-0 ${
                  darkMode ? "border-green-900/50" : "border-green-50"
                }`}>
                  <span className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>{s.icon} {s.label}</span>
                  <span className={`text-sm font-bold ${darkMode ? "text-green-400" : "text-green-600"}`}>{s.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
