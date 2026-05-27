import { useState } from "react";
import { useNavigate } from "react-router-dom";

// ── Helpers ───────────────────────────────────────────────────────────────────
const rand = (min, max, dec = 0) => {
  const v = Math.random() * (max - min) + min;
  return dec ? +v.toFixed(dec) : Math.round(v);
};

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const today  = new Date();

// ── 1. Crop Yield Prediction ──────────────────────────────────────────────────
function predictYield({ crop, area, N, P, K, rainfall }) {
  const base = { Rice:4.5, Wheat:3.8, Maize:5.2, Cotton:2.1, Sugarcane:70, Soybean:2.8,
    Potato:25, Tomato:30, Chickpea:1.8, Groundnut:2.5 };
  const baseYield = base[crop] || 3.0;
  const nutrientFactor = Math.min(1.3, (N * 0.004 + P * 0.003 + K * 0.003) + 0.7);
  const rainFactor = rainfall > 200 ? 1.1 : rainfall > 100 ? 1.0 : 0.85;
  const yield_ = +(baseYield * nutrientFactor * rainFactor).toFixed(2);
  const total  = +(yield_ * area).toFixed(1);
  const grade  = yield_ >= baseYield * 1.1 ? "Excellent" : yield_ >= baseYield * 0.9 ? "Good" : "Below Average";
  const color  = grade === "Excellent" ? "text-green-500" : grade === "Good" ? "text-teal-500" : "text-yellow-500";
  return { yield_, total, grade, color, baseYield };
}

// ── 2. Price Forecast ─────────────────────────────────────────────────────────
function generatePriceForecast(crop) {
  const basePrices = { Rice:2183, Wheat:2275, Maize:1962, Cotton:6620, Sugarcane:315,
    Soybean:4300, Potato:900, Tomato:1800, Chickpea:5440, Groundnut:5550 };
  const base = basePrices[crop] || 3000;
  return Array.from({ length: 6 }, (_, i) => {
    const month = MONTHS[(today.getMonth() + i + 1) % 12];
    const trend = (Math.random() - 0.45) * 0.08;
    const price = Math.round(base * (1 + trend * (i + 1)));
    return { month, price };
  });
}

// ── 3. Soil Degradation Forecast ─────────────────────────────────────────────
function predictSoilDegradation({ N, P, K, ph, moisture, crop }) {
  const months = Array.from({ length: 6 }, (_, i) => {
    const m = MONTHS[(today.getMonth() + i + 1) % 12];
    const nDrain = crop === "Rice" ? 3 : crop === "Wheat" ? 2 : 1.5;
    const score  = Math.max(20, 100 - (i + 1) * nDrain - rand(0, 3));
    return { month: m, score };
  });
  const finalScore = months[months.length - 1].score;
  const status = finalScore > 75 ? { label: "Healthy", color: "text-green-500", tip: "Maintain current practices." }
    : finalScore > 55 ? { label: "Moderate", color: "text-yellow-500", tip: "Add organic compost after harvest." }
    : { label: "At Risk", color: "text-red-500", tip: "Urgent: apply lime and organic matter." };
  return { months, finalScore, status };
}

// ── 5. Best Planting Time ─────────────────────────────────────────────────────
const PLANTING_DATA = {
  Rice:        { best: [5,6],   avoid: [11,12,1], tip: "Plant after monsoon onset for best yield." },
  Wheat:       { best: [10,11], avoid: [4,5,6],   tip: "Sow in cool weather for optimal germination." },
  Maize:       { best: [6,7],   avoid: [11,12],   tip: "Needs warm soil temperature above 18°C." },
  Cotton:      { best: [4,5],   avoid: [11,12,1], tip: "Plant after last frost in warm soil." },
  Sugarcane:   { best: [2,3],   avoid: [7,8],     tip: "Spring planting gives best cane development." },
  Soybean:     { best: [6,7],   avoid: [11,12,1], tip: "Warm season crop, needs 25°C+ soil temp." },
  Potato:      { best: [10,11], avoid: [5,6,7],   tip: "Cool weather crop, avoid summer heat." },
  Tomato:      { best: [11,12], avoid: [6,7,8],   tip: "Start indoors 6-8 weeks before last frost." },
  Chickpea:    { best: [10,11], avoid: [5,6,7],   tip: "Drought tolerant, plant in cool dry season." },
  Groundnut:   { best: [6,7],   avoid: [11,12,1], tip: "Needs well-drained sandy loam soil." },
};

function getPlantingAdvice(crop) {
  const data = PLANTING_DATA[crop] || { best: [6,7], avoid: [12,1], tip: "Consult local agronomist." };
  const currentMonth = today.getMonth() + 1;
  const isBest   = data.best.includes(currentMonth);
  const isAvoid  = data.avoid.includes(currentMonth);
  const status   = isBest ? "✅ Perfect Time" : isAvoid ? "⛔ Avoid Now" : "⚠️ Suboptimal";
  const color    = isBest ? "text-green-500" : isAvoid ? "text-red-500" : "text-yellow-500";
  const nextBest = data.best.map(m => MONTHS[m - 1]).join(", ");
  return { status, color, nextBest, tip: data.tip };
}

// ── Mini Bar Chart ────────────────────────────────────────────────────────────
function BarChart({ data, valueKey, labelKey, color, darkMode }) {
  const max = Math.max(...data.map(d => d[valueKey]));
  return (
    <div className="flex items-end gap-1 h-20">
      {data.map((d, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-1">
          <div className="w-full rounded-t-md transition-all" style={{
            height: `${(d[valueKey] / max) * 64}px`,
            background: color,
            opacity: 0.7 + (i / data.length) * 0.3,
          }} />
          <span className={`text-xs ${darkMode ? "text-gray-500" : "text-gray-400"}`}>{d[labelKey]}</span>
        </div>
      ))}
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
const CROPS = ["Rice","Wheat","Maize","Cotton","Sugarcane","Soybean","Potato","Tomato","Chickpea","Groundnut"];

export default function FuturePredictions({ darkMode }) {
  const navigate = useNavigate();
  const [inputs, setInputs] = useState({ crop: "Rice", area: 2, N: 80, P: 40, K: 40, rainfall: 150, ph: 6.5, moisture: 50 });
  const [results, setResults] = useState(null);
  const [activeTab, setActiveTab] = useState("yield");

  const handleChange = (e) => setInputs({ ...inputs, [e.target.name]: e.target.value });

  const handlePredict = (e) => {
    e.preventDefault();
    const inp = { ...inputs, N: +inputs.N, P: +inputs.P, K: +inputs.K,
      rainfall: +inputs.rainfall, ph: +inputs.ph, moisture: +inputs.moisture, area: +inputs.area };
    setResults({
      yield:    predictYield(inp),
      price:    generatePriceForecast(inp.crop),
      soil:     predictSoilDegradation(inp),
      planting: getPlantingAdvice(inp.crop),
    });
    setActiveTab("yield");
  };

  const card = `eco-card p-5 ${darkMode ? "bg-gray-800/60" : ""}`;
  const label = `block text-xs font-semibold mb-1 ${darkMode ? "text-green-300" : "text-green-800"}`;
  const tabs = [
    { key: "yield",    icon: "🌾", label: "Yield" },
    { key: "price",    icon: "📈", label: "Price" },
    { key: "soil",     icon: "🧪", label: "Soil" },
    { key: "planting", icon: "📅", label: "Planting" },
  ];

  return (
    <div className={`min-h-screen ${darkMode ? "bg-gray-950" : "bg-green-50"}`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <button onClick={() => navigate("/dashboard")} className={`text-sm font-medium mb-6 flex items-center gap-1 ${darkMode ? "text-green-400" : "text-green-700"}`}>
          ← Back to Dashboard
        </button>

        {/* Header */}
        <div className="text-center mb-10">
          <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium mb-3 ${darkMode ? "bg-green-900/50 text-green-300" : "bg-green-100 text-green-700"}`}>
            🔮 AI Predictions
          </div>
          <h2 className="section-title text-2xl mb-2">Future Predictions</h2>
          <p className={`text-sm max-w-xl mx-auto ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
            Enter your farm details to get AI-powered forecasts for yield, prices, soil health, and optimal planting time.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Input Form */}
          <div className={`${card} lg:col-span-1`}>
            <h3 className={`text-sm font-bold mb-4 ${darkMode ? "text-green-300" : "text-green-700"}`}>⚙️ Farm Parameters</h3>
            <form onSubmit={handlePredict} className="space-y-3">
              <div>
                <label className={label}>🌾 Crop</label>
                <select name="crop" value={inputs.crop} onChange={handleChange} className="eco-input">
                  {CROPS.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className={label}>📐 Farm Area (acres)</label>
                <input type="number" name="area" value={inputs.area} onChange={handleChange} className="eco-input" min="0.1" step="0.1" />
              </div>
              <div className="grid grid-cols-3 gap-2">
                {["N","P","K"].map(n => (
                  <div key={n}>
                    <label className={label}>{n}</label>
                    <input type="number" name={n} value={inputs[n]} onChange={handleChange} className="eco-input" />
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className={label}>🌧️ Rainfall (mm)</label>
                  <input type="number" name="rainfall" value={inputs.rainfall} onChange={handleChange} className="eco-input" />
                </div>
                <div>
                  <label className={label}>🔬 pH</label>
                  <input type="number" name="ph" value={inputs.ph} onChange={handleChange} className="eco-input" step="0.1" />
                </div>
              </div>
              <div>
                <label className={label}>💧 Moisture (%)</label>
                <input type="number" name="moisture" value={inputs.moisture} onChange={handleChange} className="eco-input" />
              </div>
              <button type="submit" className="btn-eco w-full py-3 text-sm">
                🔮 Generate Predictions
              </button>
            </form>
          </div>

          {/* Results */}
          <div className="lg:col-span-2">
            {!results ? (
              <div className={`${card} h-full flex flex-col items-center justify-center py-20 text-center`}>
                <div className="text-6xl mb-4">🔮</div>
                <h3 className={`text-lg font-semibold mb-2 ${darkMode ? "text-green-300" : "text-green-700"}`}>Ready to Predict</h3>
                <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Fill in your farm parameters and click Generate Predictions</p>
              </div>
            ) : (
              <div>
                {/* Tabs */}
                <div className="flex gap-2 mb-4 flex-wrap">
                  {tabs.map(t => (
                    <button key={t.key} onClick={() => setActiveTab(t.key)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                        activeTab === t.key
                          ? "bg-green-500 text-white shadow"
                          : darkMode ? "bg-gray-800 text-gray-400 hover:bg-gray-700" : "bg-white text-gray-500 hover:bg-green-50 border border-green-100"
                      }`}>
                      {t.icon} {t.label}
                    </button>
                  ))}
                </div>

                {/* Yield Tab */}
                {activeTab === "yield" && (
                  <div className={card}>
                    <h3 className={`text-sm font-bold mb-4 ${darkMode ? "text-green-300" : "text-green-700"}`}>🌾 Crop Yield Prediction</h3>
                    <div className="grid grid-cols-3 gap-3 mb-5">
                      {[
                        { label: "Yield/Acre", value: `${results.yield.yield_} t`, icon: "📦" },
                        { label: "Total Yield", value: `${results.yield.total} t`, icon: "🏭" },
                        { label: "Grade", value: results.yield.grade, icon: "⭐" },
                      ].map((s, i) => (
                        <div key={i} className={`p-3 rounded-xl text-center ${darkMode ? "bg-gray-700/50" : "bg-green-50"}`}>
                          <div className="text-xl mb-1">{s.icon}</div>
                          <div className={`text-base font-bold ${i === 2 ? results.yield.color : darkMode ? "text-green-300" : "text-green-700"}`}>{s.value}</div>
                          <div className={`text-xs ${darkMode ? "text-gray-500" : "text-gray-400"}`}>{s.label}</div>
                        </div>
                      ))}
                    </div>
                    <div className={`p-3 rounded-xl text-sm ${darkMode ? "bg-green-900/30 text-green-300" : "bg-green-50 text-green-800"}`}>
                      💡 Expected yield is <strong>{results.yield.yield_} tonnes/acre</strong> vs average <strong>{results.yield.baseYield} t/acre</strong> for {inputs.crop}.
                      {results.yield.yield_ > results.yield.baseYield
                        ? " Your soil conditions are above average — great work!"
                        : " Consider improving soil nutrients for better yield."}
                    </div>
                  </div>
                )}

                {/* Price Tab */}
                {activeTab === "price" && (
                  <div className={card}>
                    <h3 className={`text-sm font-bold mb-4 ${darkMode ? "text-green-300" : "text-green-700"}`}>📈 6-Month Price Forecast — {inputs.crop}</h3>
                    <BarChart data={results.price} valueKey="price" labelKey="month" color="#22c55e" darkMode={darkMode} />
                    <div className="mt-4 space-y-2">
                      {results.price.map((p, i) => (
                        <div key={i} className={`flex items-center justify-between px-3 py-2 rounded-xl text-sm ${darkMode ? "bg-gray-700/50" : "bg-green-50"}`}>
                          <span className={darkMode ? "text-gray-300" : "text-gray-600"}>{p.month}</span>
                          <span className={`font-bold ${darkMode ? "text-green-300" : "text-green-700"}`}>₹{p.price.toLocaleString()}/q</span>
                          <span className={`text-xs ${p.price > results.price[0].price ? "text-green-500" : "text-red-500"}`}>
                            {p.price > results.price[0].price ? "▲" : "▼"}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Soil Tab */}
                {activeTab === "soil" && (
                  <div className={card}>
                    <h3 className={`text-sm font-bold mb-4 ${darkMode ? "text-green-300" : "text-green-700"}`}>🧪 6-Month Soil Health Forecast</h3>
                    <BarChart data={results.soil.months} valueKey="score" labelKey="month" color="#14b8a6" darkMode={darkMode} />
                    <div className="mt-4 grid grid-cols-2 gap-3">
                      <div className={`p-3 rounded-xl text-center ${darkMode ? "bg-gray-700/50" : "bg-green-50"}`}>
                        <div className="text-2xl mb-1">📉</div>
                        <div className={`text-lg font-bold ${results.soil.status.color}`}>{results.soil.finalScore}</div>
                        <div className={`text-xs ${darkMode ? "text-gray-500" : "text-gray-400"}`}>Projected Score</div>
                      </div>
                      <div className={`p-3 rounded-xl text-center ${darkMode ? "bg-gray-700/50" : "bg-green-50"}`}>
                        <div className="text-2xl mb-1">🏷️</div>
                        <div className={`text-lg font-bold ${results.soil.status.color}`}>{results.soil.status.label}</div>
                        <div className={`text-xs ${darkMode ? "text-gray-500" : "text-gray-400"}`}>Status</div>
                      </div>
                    </div>
                    <div className={`mt-3 p-3 rounded-xl text-sm ${darkMode ? "bg-yellow-900/30 text-yellow-300" : "bg-yellow-50 text-yellow-800"}`}>
                      💡 {results.soil.status.tip}
                    </div>
                  </div>
                )}

                {/* Planting Tab */}
                {activeTab === "planting" && (
                  <div className={card}>
                    <h3 className={`text-sm font-bold mb-4 ${darkMode ? "text-green-300" : "text-green-700"}`}>📅 Best Planting Time — {inputs.crop}</h3>
                    <div className={`text-center p-6 rounded-2xl mb-4 ${darkMode ? "bg-gray-700/50" : "bg-green-50"}`}>
                      <div className="text-5xl mb-3">
                        {results.planting.status.startsWith("✅") ? "🌱" : results.planting.status.startsWith("⛔") ? "🚫" : "⚠️"}
                      </div>
                      <h3 className={`text-2xl font-bold mb-1 ${results.planting.color}`}>{results.planting.status}</h3>
                      <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                        Current month: <strong>{MONTHS[today.getMonth()]}</strong>
                      </p>
                    </div>
                    <div className="space-y-3">
                      <div className={`flex items-start gap-3 p-3 rounded-xl ${darkMode ? "bg-green-900/30" : "bg-green-50"}`}>
                        <span className="text-lg">📆</span>
                        <div>
                          <p className={`text-xs font-semibold ${darkMode ? "text-green-400" : "text-green-700"}`}>Best Planting Months</p>
                          <p className={`text-sm ${darkMode ? "text-gray-300" : "text-gray-700"}`}>{results.planting.nextBest}</p>
                        </div>
                      </div>
                      <div className={`flex items-start gap-3 p-3 rounded-xl ${darkMode ? "bg-blue-900/30" : "bg-blue-50"}`}>
                        <span className="text-lg">💡</span>
                        <div>
                          <p className={`text-xs font-semibold ${darkMode ? "text-blue-400" : "text-blue-700"}`}>Expert Tip</p>
                          <p className={`text-sm ${darkMode ? "text-gray-300" : "text-gray-700"}`}>{results.planting.tip}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
