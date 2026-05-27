import { useState } from "react";
import { saveHistory } from "./utils/saveHistory";
import { predictFertilizer } from "./utils/fertilizerPredictor";
import { autoFillFromLocation, autoFillFromCityName } from "./utils/autoFill";

const soilTypes = ["Loamy", "Sandy", "Clayey", "Black", "Red"];
const cropTypes = ["Sugarcane", "Cotton", "Millets", "Paddy", "Pulses", "Wheat", "Tobacco", "Barley", "Oil seeds", "Ground Nuts", "Maize"];

const numFields = [
  { name: "Temparature",  label: "Temperature (°C)", placeholder: "e.g. 26", step: "0.1", icon: "🌡️" },
  { name: "Humidity",     label: "Humidity (%)",      placeholder: "e.g. 52", step: "1",   icon: "💧" },
  { name: "Moisture",     label: "Moisture",           placeholder: "e.g. 38", step: "1",   icon: "🌊" },
  { name: "Nitrogen",     label: "Nitrogen (N)",       placeholder: "e.g. 37", step: "1",   icon: "🧪" },
  { name: "Potassium",    label: "Potassium (K)",      placeholder: "e.g. 0",  step: "1",   icon: "⚗️" },
  { name: "Phosphorous",  label: "Phosphorous (P)",    placeholder: "e.g. 0",  step: "1",   icon: "🧫" },
];

function FertForm({ onSubmit, darkMode }) {
  const [formValues, setFormValues] = useState({
    Temparature: "", Humidity: "", Moisture: "",
    Nitrogen: "", Potassium: "", Phosphorous: "",
    Soil_Type: "Loamy", Crop_Type: "Sugarcane",
  });
  const [loading, setLoading]         = useState(false);
  const [autoLoading, setAutoLoading] = useState(false);
  const [autoMsg, setAutoMsg]         = useState("");
  const [manualCity, setManualCity]   = useState("");
  const [showManual, setShowManual]   = useState(false);

  const handleChange = (e) => setFormValues({ ...formValues, [e.target.name]: e.target.value });

  const handleAutoFill = async () => {
    setAutoLoading(true); setAutoMsg("");
    try {
      const data = await autoFillFromLocation();
      setFormValues(prev => ({ ...prev, Temparature: data.temperature, Humidity: data.humidity, Moisture: data.moisture, Nitrogen: data.N, Potassium: data.K, Phosphorous: data.P }));
      setAutoMsg(`✅ Auto-filled from ${data.city || "your location"}!`);
    } catch { setAutoMsg("⚠️ Could not detect location. Please allow location access."); }
    finally { setAutoLoading(false); }
  };

  const handleManualCity = async () => {
    if (!manualCity.trim()) return;
    setAutoLoading(true); setAutoMsg("");
    try {
      const data = await autoFillFromCityName(manualCity);
      setFormValues(prev => ({ ...prev, Temparature: data.temperature, Humidity: data.humidity, Moisture: data.moisture, Nitrogen: data.N, Potassium: data.K, Phosphorous: data.P }));
      setAutoMsg(`✅ Auto-filled from ${data.city || manualCity}!`);
      setShowManual(false);
    } catch { setAutoMsg("⚠️ Location not found. Try a different city name."); }
    finally { setAutoLoading(false); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await onSubmit(formValues);
    setLoading(false);
  };

  const selectClass = `eco-input appearance-none cursor-pointer`;

  return (
    <form onSubmit={handleSubmit}>
      {/* Location bar */}
      <div className={`flex flex-col gap-2 mb-4 p-3 rounded-xl border ${darkMode ? "bg-gray-700/30 border-green-900" : "bg-green-50 border-green-100"}`}>
        <div className="flex items-center justify-between">
          <p className={`text-xs font-medium ${darkMode ? "text-green-400" : "text-green-700"}`}>
            {autoMsg.startsWith("✅") ? `📍 ${autoMsg.replace("✅ Auto-filled from ", "").replace("!", "")}` : "📍 Fill from location"}
          </p>
          <div className="flex gap-2">
            <button type="button" onClick={() => setShowManual(!showManual)}
              className={`text-xs px-3 py-1 rounded-lg border transition-all ${darkMode ? "border-green-800 text-green-400 hover:bg-green-900/40" : "border-green-200 text-green-700 hover:bg-green-100"}`}>
              ✏️ Enter City
            </button>
            <button type="button" onClick={handleAutoFill} disabled={autoLoading}
              className={`text-xs px-3 py-1 rounded-lg transition-all ${darkMode ? "bg-green-900/50 text-green-300 hover:bg-green-900" : "bg-green-500 text-white hover:bg-green-600"} disabled:opacity-50`}>
              {autoLoading ? "⏳" : "📍 Auto-detect"}
            </button>
          </div>
        </div>
        {showManual && (
          <div className="flex gap-2">
            <input type="text" value={manualCity} onChange={(e) => setManualCity(e.target.value)}
              placeholder="e.g. Phagwara, Punjab"
              onKeyDown={(e) => e.key === "Enter" && handleManualCity()}
              className="eco-input flex-1 text-sm py-1.5" />
            <button type="button" onClick={handleManualCity} disabled={autoLoading}
              className="btn-eco text-xs px-4 py-1.5 disabled:opacity-50">
              {autoLoading ? "..." : "Fill"}
            </button>
          </div>
        )}
        {autoMsg && !autoMsg.startsWith("✅") && (
          <p className={`text-xs ${darkMode ? "text-yellow-400" : "text-yellow-600"}`}>{autoMsg}</p>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {numFields.map((f) => (
          <div key={f.name}>
            <label className={`block text-sm font-semibold mb-1 ${darkMode ? "text-green-300" : "text-green-800"}`}>
              {f.icon} {f.label}
            </label>
            <input
              type="number"
              name={f.name}
              placeholder={f.placeholder}
              step={f.step}
              required
              value={formValues[f.name] ?? ""}
              onChange={handleChange}
              className="eco-input"
            />
          </div>
        ))}

        <div>
          <label className={`block text-sm font-semibold mb-1 ${darkMode ? "text-green-300" : "text-green-800"}`}>
            🌍 Soil Type
          </label>
          <select name="Soil_Type" required onChange={handleChange} className={selectClass}>
            {soilTypes.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        <div>
          <label className={`block text-sm font-semibold mb-1 ${darkMode ? "text-green-300" : "text-green-800"}`}>
            🌾 Crop Type
          </label>
          <select name="Crop_Type" required onChange={handleChange} className={selectClass}>
            {cropTypes.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>

      <div className="text-center">
        <button type="submit" className="btn-eco px-10 py-3 text-base" disabled={loading}>
          {loading ? "🌱 Analyzing..." : "💧 Get Fertilizer Recommendation"}
        </button>
      </div>
    </form>
  );
}

function FertResult({ result, onBack, darkMode }) {
  const fertName = result?.split(" is")[0] || "fertilizer";

  const fertImages = {
    "urea":      "https://images.pexels.com/photos/5029859/pexels-photo-5029859.jpeg?w=400",
    "dap":       "https://images.pexels.com/photos/974314/pexels-photo-974314.jpeg?w=400",
    "mop":       "https://images.pexels.com/photos/1382102/pexels-photo-1382102.jpeg?w=400",
    "npk":       "https://images.pexels.com/photos/1382102/pexels-photo-1382102.jpeg?w=400",
    "ssp":       "https://images.pexels.com/photos/974314/pexels-photo-974314.jpeg?w=400",
    "compost":   "https://images.pexels.com/photos/4503273/pexels-photo-4503273.jpeg?w=400",
    "potassium": "https://images.pexels.com/photos/1382102/pexels-photo-1382102.jpeg?w=400",
    "gypsum":    "https://images.pexels.com/photos/974314/pexels-photo-974314.jpeg?w=400",
  };

  const key = Object.keys(fertImages).find(k => fertName.toLowerCase().includes(k)) || "npk";
  const img = fertImages[key] || fertImages["npk"];

  return (
    <div className="flex flex-col md:flex-row gap-8 items-center">
      <div className="md:w-1/2">
        <img
          src={img}
          alt={fertName}
          className="rounded-2xl w-full object-cover shadow-lg bg-green-50"
          style={{ maxHeight: "340px", minHeight: "200px" }}
        />
      </div>
      <div className="md:w-1/2 text-center">
        <div className="text-6xl mb-4">💊</div>
        <p className={`text-sm font-medium mb-2 ${darkMode ? "text-green-400" : "text-green-600"}`}>Recommended Fertilizer</p>
        <h3 className={`text-4xl font-bold mb-4 capitalize ${darkMode ? "text-green-300" : "text-green-800"}`}>{result}</h3>
        <p className={`text-sm leading-relaxed mb-6 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
          This recommendation is based on your soil and crop data. Always consult a local agronomist before application.
        </p>
        <button onClick={onBack} className="btn-outline-eco">← Try Again</button>
      </div>
    </div>
  );
}

function Fertilizer({ darkMode, user }) {
  const [result, setResult] = useState(null);

  const handleSubmit = async (formValues) => {
    try {
      // Instant local prediction
      const localResult = predictFertilizer(formValues);
      setResult(localResult);
      if (user) await saveHistory(user.uid, "fertilizer", formValues, localResult);

      // Try API in background
      fetch("https://karthikfertapi.onrender.com/predict", {
        method: "POST",
        headers: { Accept: "application/json", "Content-Type": "application/json" },
        body: JSON.stringify(formValues),
      }).then((res) => res.json()).then((data) => {
        if (data.result) setResult(data.result);
      }).catch(() => {});
    } catch (err) {
      console.error("Error:", err);
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-16">
      {/* Section Header */}
      <div className="text-center mb-12">
        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium mb-4 ${
          darkMode ? "bg-green-900/50 text-green-300" : "bg-green-100 text-green-700"
        }`}>
          💧 AI Model 2
        </div>
        <h2 className="section-title mb-3">Fertilizer Recommendation</h2>
        <p className={`max-w-xl mx-auto text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
          Provide soil nutrients, moisture, and crop details to get the optimal fertilizer for your farm.
        </p>
      </div>

      <div className={`eco-card p-8 ${darkMode ? "bg-gray-800/60" : ""}`}>
        {result
          ? <FertResult result={result} onBack={() => setResult(null)} darkMode={darkMode} />
          : <FertForm onSubmit={handleSubmit} darkMode={darkMode} />
        }
      </div>
    </div>
  );
}

export default Fertilizer;
