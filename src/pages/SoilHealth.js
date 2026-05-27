import { useState } from "react";
import { useNavigate } from "react-router-dom";

function getSoilScore({ N, P, K, ph, moisture }) {
  let score = 0;
  const tips = [];

  // Nitrogen (ideal 40-80)
  if (N >= 40 && N <= 80) score += 20;
  else if (N < 40) { score += 10; tips.push("Low Nitrogen — add urea or compost."); }
  else { score += 12; tips.push("High Nitrogen — reduce nitrogen fertilizer."); }

  // Phosphorus (ideal 20-60)
  if (P >= 20 && P <= 60) score += 20;
  else if (P < 20) { score += 10; tips.push("Low Phosphorus — add superphosphate."); }
  else { score += 12; tips.push("High Phosphorus — avoid phosphate fertilizers."); }

  // Potassium (ideal 20-60)
  if (K >= 20 && K <= 60) score += 20;
  else if (K < 20) { score += 10; tips.push("Low Potassium — add potash fertilizer."); }
  else { score += 12; tips.push("High Potassium — reduce potash application."); }

  // pH (ideal 6.0-7.5)
  if (ph >= 6.0 && ph <= 7.5) score += 20;
  else if (ph < 6.0) { score += 8; tips.push("Acidic soil — add lime to raise pH."); }
  else { score += 8; tips.push("Alkaline soil — add sulfur to lower pH."); }

  // Moisture (ideal 40-70)
  if (moisture >= 40 && moisture <= 70) score += 20;
  else if (moisture < 40) { score += 10; tips.push("Low moisture — increase irrigation."); }
  else { score += 10; tips.push("High moisture — improve drainage."); }

  const grade = score >= 85 ? "Excellent" : score >= 70 ? "Good" : score >= 50 ? "Fair" : "Poor";
  const color = score >= 85 ? "text-green-600" : score >= 70 ? "text-teal-600" : score >= 50 ? "text-yellow-600" : "text-red-600";
  const bg = score >= 85 ? "bg-green-500" : score >= 70 ? "bg-teal-500" : score >= 50 ? "bg-yellow-500" : "bg-red-500";

  return { score, grade, color, bg, tips };
}

export default function SoilHealth({ darkMode }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({ N: "", P: "", K: "", ph: "", moisture: "" });
  const [result, setResult] = useState(null);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    setResult(getSoilScore({
      N: +form.N, P: +form.P, K: +form.K,
      ph: +form.ph, moisture: +form.moisture,
    }));
  };

  const fields = [
    { name: "N", label: "Nitrogen (N)", icon: "🧪", placeholder: "0-140" },
    { name: "P", label: "Phosphorus (P)", icon: "🧫", placeholder: "0-145" },
    { name: "K", label: "Potassium (K)", icon: "⚗️", placeholder: "0-205" },
    { name: "ph", label: "pH Value", icon: "🔬", placeholder: "0-14" },
    { name: "moisture", label: "Moisture (%)", icon: "💧", placeholder: "0-100" },
  ];

  return (
    <div className={`min-h-screen ${darkMode ? "bg-gray-950" : "bg-green-50"}`}>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <button onClick={() => navigate("/dashboard")} className={`text-sm font-medium mb-6 flex items-center gap-1 ${darkMode ? "text-green-400" : "text-green-700"}`}>
          ← Back to Dashboard
        </button>

        <div className="text-center mb-10">
          <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium mb-4 ${darkMode ? "bg-green-900/50 text-green-300" : "bg-green-100 text-green-700"}`}>
            🧮 Soil Analysis Tool
          </div>
          <h2 className="section-title mb-2">Soil Health Calculator</h2>
          <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
            Enter your soil parameters to get a health score and improvement tips.
          </p>
        </div>

        <div className={`eco-card p-8 ${darkMode ? "bg-gray-800/60" : ""}`}>
          {!result ? (
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                {fields.map((f) => (
                  <div key={f.name}>
                    <label className={`block text-xs font-semibold mb-1 ${darkMode ? "text-green-300" : "text-green-800"}`}>
                      {f.icon} {f.label}
                    </label>
                    <input
                      type="number" name={f.name} placeholder={f.placeholder}
                      required value={form[f.name]} onChange={handleChange}
                      className="eco-input" step="0.01"
                    />
                  </div>
                ))}
              </div>
              <div className="text-center">
                <button type="submit" className="btn-eco px-10 py-3">🧮 Calculate Soil Health</button>
              </div>
            </form>
          ) : (
            <div>
              {/* Score circle */}
              <div className="text-center mb-8">
                <div className="relative inline-flex items-center justify-center w-36 h-36 mb-4">
                  <svg className="w-36 h-36 -rotate-90" viewBox="0 0 120 120">
                    <circle cx="60" cy="60" r="50" fill="none" stroke={darkMode ? "#1f2937" : "#dcfce7"} strokeWidth="12" />
                    <circle cx="60" cy="60" r="50" fill="none" stroke="#22c55e" strokeWidth="12"
                      strokeDasharray={`${(result.score / 100) * 314} 314`}
                      strokeLinecap="round" />
                  </svg>
                  <div className="absolute text-center">
                    <div className={`text-3xl font-bold ${darkMode ? "text-green-300" : "text-green-700"}`}>{result.score}</div>
                    <div className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}>/ 100</div>
                  </div>
                </div>
                <h3 className={`text-2xl font-bold ${result.color}`}>{result.grade} Soil</h3>
              </div>

              {/* Tips */}
              {result.tips.length > 0 && (
                <div className="space-y-2 mb-6">
                  <p className={`text-xs font-semibold mb-2 ${darkMode ? "text-green-400" : "text-green-700"}`}>💡 Improvement Tips</p>
                  {result.tips.map((t, i) => (
                    <div key={i} className={`flex items-start gap-2 p-3 rounded-xl text-sm ${darkMode ? "bg-yellow-900/30 text-yellow-300" : "bg-yellow-50 text-yellow-800"}`}>
                      <span>⚠️</span> {t}
                    </div>
                  ))}
                </div>
              )}
              {result.tips.length === 0 && (
                <div className={`p-4 rounded-xl text-center text-sm mb-6 ${darkMode ? "bg-green-900/30 text-green-300" : "bg-green-50 text-green-700"}`}>
                  ✅ Your soil is in excellent condition! Keep maintaining current practices.
                </div>
              )}

              <div className="text-center">
                <button onClick={() => setResult(null)} className="btn-outline-eco">← Recalculate</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
