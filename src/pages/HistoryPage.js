import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { collection, query, where, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "../firebase";
import { generatePDF } from "../utils/generatePDF";

const typeConfig = {
  crop:       { icon: "🌾", label: "Crop Recommendation",    color: "text-green-600",  bg: "bg-green-100",  darkBg: "bg-green-900/40" },
  fertilizer: { icon: "💧", label: "Fertilizer Recommendation", color: "text-teal-600", bg: "bg-teal-100",   darkBg: "bg-teal-900/40" },
  disease:    { icon: "🔬", label: "Disease Detection",       color: "text-emerald-600", bg: "bg-emerald-100", darkBg: "bg-emerald-900/40" },
};

export default function HistoryPage({ darkMode, user }) {
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    const q = query(
      collection(db, "history"),
      where("userId", "==", user.uid)
    );
    getDocs(q).then((snap) => {
      const docs = snap.docs
        .map((d) => ({ id: d.id, ...d.data() }))
        .sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
      setHistory(docs);
    }).catch((e) => {
      console.error("Firestore error:", e);
    }).finally(() => setLoading(false));
  }, [user]);

  const handleDelete = async (id) => {
    await deleteDoc(doc(db, "history", id));
    setHistory((prev) => prev.filter((h) => h.id !== id));
  };

  const filtered = filter === "all" ? history : history.filter((h) => h.type === filter);

  return (
    <div className={`min-h-screen ${darkMode ? "bg-gray-950" : "bg-green-50"}`}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <button onClick={() => navigate("/dashboard")} className={`text-sm font-medium mb-6 flex items-center gap-1 ${darkMode ? "text-green-400" : "text-green-700"}`}>
          ← Back to Dashboard
        </button>

        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="section-title text-2xl mb-1">Prediction History</h1>
            <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>{history.length} total predictions</p>
          </div>
          {history.length > 0 && (
            <button onClick={() => generatePDF(filtered, user)} className="btn-eco text-sm px-4 py-2">
              📄 Export PDF
            </button>
          )}
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {["all", "crop", "fertilizer", "disease"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                filter === f
                  ? "bg-green-500 text-white shadow"
                  : darkMode ? "bg-gray-800 text-gray-400 hover:bg-gray-700" : "bg-white text-gray-500 hover:bg-green-50 border border-green-100"
              }`}
            >
              {f === "all" ? "All" : typeConfig[f]?.icon + " " + typeConfig[f]?.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-20">
            <div className="text-5xl mb-3 animate-bounce">🌿</div>
            <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Loading history...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className={`eco-card p-12 text-center ${darkMode ? "bg-gray-800/60" : ""}`}>
            <div className="text-5xl mb-3">📭</div>
            <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>No predictions found.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((h) => {
              const cfg = typeConfig[h.type] || typeConfig.crop;
              return (
                <div key={h.id} className={`eco-card p-5 flex items-start gap-4 ${darkMode ? "bg-gray-800/60" : ""}`}>
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0 ${
                    darkMode ? cfg.darkBg : cfg.bg
                  }`}>
                    {cfg.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-xs font-semibold ${darkMode ? "text-green-400" : cfg.color}`}>{cfg.label}</span>
                      <span className={`text-xs ${darkMode ? "text-gray-500" : "text-gray-400"}`}>
                        {h.createdAt?.toDate?.()?.toLocaleDateString() || ""}
                      </span>
                    </div>
                    <p className={`text-base font-semibold truncate ${darkMode ? "text-green-200" : "text-gray-800"}`}>
                      {h.result}
                    </p>
                    {h.inputs && (
                      <p className={`text-xs mt-1 truncate ${darkMode ? "text-gray-500" : "text-gray-400"}`}>
                        {Object.entries(h.inputs).slice(0, 4).map(([k, v]) => `${k}: ${v}`).join(" · ")}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => handleDelete(h.id)}
                    className={`text-xs px-3 py-1 rounded-lg transition-colors flex-shrink-0 ${
                      darkMode ? "text-red-400 hover:bg-red-900/30" : "text-red-400 hover:bg-red-50"
                    }`}
                  >
                    🗑️
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
