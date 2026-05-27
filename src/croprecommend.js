import { useState } from "react";
import { saveHistory } from "./utils/saveHistory";
import { predictCrop } from "./utils/cropPredictor";
import { autoFillFromLocation, autoFillFromCityName } from "./utils/autoFill";

const inputFields = [
  { name: "Nitrogen",    label: "Nitrogen (N)",      placeholder: "e.g. 90",  step: "1",    icon: "🧪" },
  { name: "Phosporus",   label: "Phosphorus (P)",     placeholder: "e.g. 42",  step: "1",    icon: "🧫" },
  { name: "Potassium",   label: "Potassium (K)",      placeholder: "e.g. 43",  step: "1",    icon: "⚗️" },
  { name: "Temperature", label: "Temperature (°C)",   placeholder: "e.g. 25.5",step: "0.01", icon: "🌡️" },
  { name: "Humidity",    label: "Humidity (%)",        placeholder: "e.g. 80",  step: "0.01", icon: "💧" },
  { name: "Ph",          label: "pH Value",            placeholder: "e.g. 6.5", step: "0.01", icon: "🔬" },
  { name: "Rainfall",    label: "Rainfall (mm)",       placeholder: "e.g. 200", step: "0.01", icon: "🌧️" },
];

function CropForm({ onSubmit, darkMode }) {
  const [formValues, setFormValues] = useState({
    N: "", P: "", K: "", temperature: "", humidity: "", ph: "", rainfall: "",
  });
  const [loading, setLoading]         = useState(false);
  const [autoLoading, setAutoLoading] = useState(false);
  const [autoMsg, setAutoMsg]         = useState("");
  const [manualCity, setManualCity]   = useState("");
  const [showManual, setShowManual]   = useState(false);

  const keyMap = {
    Nitrogen: "N", Phosporus: "P", Potassium: "K",
    Temperature: "temperature", Humidity: "humidity", Ph: "ph", Rainfall: "rainfall",
  };

  const handleChange = (e) => {
    const key = keyMap[e.target.name];
    setFormValues({ ...formValues, [key]: e.target.value });
  };

  const handleAutoFill = async () => {
    setAutoLoading(true);
    setAutoMsg("");
    try {
      const data = await autoFillFromLocation();
      setFormValues({
        N: data.N, P: data.P, K: data.K,
        temperature: data.temperature, humidity: data.humidity,
        ph: data.ph, rainfall: data.rainfall,
      });
      setAutoMsg(`✅ Auto-filled from ${data.city || "your location"}!`);
    } catch {
      setAutoMsg("⚠️ Could not detect location. Please allow location access.");
    } finally { setAutoLoading(false); }
  };

  const handleManualCity = async () => {
    if (!manualCity.trim()) return;
    setAutoLoading(true);
    setAutoMsg("");
    try {
      const data = await autoFillFromCityName(manualCity);
      setFormValues({
        N: data.N, P: data.P, K: data.K,
        temperature: data.temperature, humidity: data.humidity,
        ph: data.ph, rainfall: data.rainfall,
      });
      setAutoMsg(`✅ Auto-filled from ${data.city || manualCity}!`);
      setShowManual(false);
    } catch {
      setAutoMsg("⚠️ Location not found. Try a different city name.");
    } finally { setAutoLoading(false); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await onSubmit(formValues);
    setLoading(false);
  };

  // Map state keys back to input field names for value binding
  const valueMap = {
    Nitrogen: "N", Phosporus: "P", Potassium: "K",
    Temperature: "temperature", Humidity: "humidity", Ph: "ph", Rainfall: "rainfall",
  };

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
            <input
              type="text" value={manualCity} onChange={(e) => setManualCity(e.target.value)}
              placeholder="e.g. Phagwara, Punjab"
              onKeyDown={(e) => e.key === "Enter" && handleManualCity()}
              className="eco-input flex-1 text-sm py-1.5"
            />
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
        {inputFields.map((f) => (
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
              value={formValues[valueMap[f.name]] ?? ""}
              onChange={handleChange}
              className="eco-input"
            />
          </div>
        ))}
      </div>
      <div className="text-center">
        <button type="submit" className="btn-eco px-10 py-3 text-base" disabled={loading}>
          {loading ? "🌱 Analyzing... (may take ~30s on first use)" : "🌾 Get Crop Recommendation"}
        </button>
      </div>
    </form>
  );
}

function CropResult({ result, onBack, darkMode }) {
  const cropName = result?.split(" ")[0] || "farm";

  const cropImages = {
    rice:        "https://images.pexels.com/photos/2589457/pexels-photo-2589457.jpeg?w=400",
    maize:       "https://images.pexels.com/photos/547263/pexels-photo-547263.jpeg?w=400",
    chickpea:    "https://images.pexels.com/photos/6157049/pexels-photo-6157049.jpeg?w=400",
    kidneybeans: "https://images.pexels.com/photos/6157049/pexels-photo-6157049.jpeg?w=400",
    pigeonpeas:  "https://images.pexels.com/photos/6157049/pexels-photo-6157049.jpeg?w=400",
    mothbeans:   "https://images.pexels.com/photos/6157049/pexels-photo-6157049.jpeg?w=400",
    mungbean:    "https://images.pexels.com/photos/6157049/pexels-photo-6157049.jpeg?w=400",
    blackgram:   "https://images.pexels.com/photos/6157049/pexels-photo-6157049.jpeg?w=400",
    lentil:      "https://images.pexels.com/photos/6157049/pexels-photo-6157049.jpeg?w=400",
    pomegranate: "https://images.pexels.com/photos/1435735/pexels-photo-1435735.jpeg?w=400",
    banana:      "https://images.pexels.com/photos/1093038/pexels-photo-1093038.jpeg?w=400",
    mango:       "https://images.pexels.com/photos/918643/pexels-photo-918643.jpeg?w=400",
    grapes:      "https://images.pexels.com/photos/760281/pexels-photo-760281.jpeg?w=400",
    watermelon:  "https://images.pexels.com/photos/1313267/pexels-photo-1313267.jpeg?w=400",
    muskmelon:   "https://images.pexels.com/photos/2894205/pexels-photo-2894205.jpeg?w=400",
    apple:       "https://images.pexels.com/photos/1510392/pexels-photo-1510392.jpeg?w=400",
    orange:      "https://images.pexels.com/photos/327098/pexels-photo-327098.jpeg?w=400",
    papaya:      "https://images.pexels.com/photos/2363345/pexels-photo-2363345.jpeg?w=400",
    coconut:     "https://images.pexels.com/photos/1120970/pexels-photo-1120970.jpeg?w=400",
    cotton:      "https://images.pexels.com/photos/5029859/pexels-photo-5029859.jpeg?w=400",
    jute:        "https://images.pexels.com/photos/974314/pexels-photo-974314.jpeg?w=400",
    coffee:      "https://images.pexels.com/photos/894695/pexels-photo-894695.jpeg?w=400",
    wheat:       "https://images.pexels.com/photos/326082/pexels-photo-326082.jpeg?w=400",
    sugarcane:   "https://images.pexels.com/photos/5029859/pexels-photo-5029859.jpeg?w=400",
  };

  const key = cropName.toLowerCase().replace(/\s/g, "");
  const img = cropImages[key] || "https://images.pexels.com/photos/974314/pexels-photo-974314.jpeg?w=400";

  return (
    <div className="flex flex-col md:flex-row gap-8 items-center">
      <div className="md:w-1/2">
        <img
          src={img}
          alt={cropName}
          className="rounded-2xl w-full object-cover shadow-lg bg-green-50"
          style={{ maxHeight: "340px", minHeight: "200px" }}
        />
      </div>
      <div className="md:w-1/2 text-center">
        <div className={`text-6xl mb-4`}>🌾</div>
        <p className={`text-sm font-medium mb-2 ${darkMode ? "text-green-400" : "text-green-600"}`}>Recommended Crop</p>
        <h3 className={`text-4xl font-bold mb-4 capitalize ${darkMode ? "text-green-300" : "text-green-800"}`}>{result}</h3>
        <p className={`text-sm leading-relaxed mb-6 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
          This prediction is based on the soil and climate data you provided. Results may vary depending on local conditions.
        </p>
        <button onClick={onBack} className="btn-outline-eco">← Try Again</button>
      </div>
    </div>
  );
}

function Croprecommend({ darkMode, user }) {
  const [result, setResult] = useState(null);

  const handleSubmit = async (formValues) => {
    try {
      // Try the ML API first (accurate)
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 60000); // 60s timeout
      const res = await fetch("https://ai-farmer-crop-api.onrender.com/predict", {
        method: "POST",
        headers: { Accept: "application/json", "Content-Type": "application/json" },
        body: JSON.stringify(formValues),
        signal: controller.signal,
      });
      clearTimeout(timeout);
      const data = await res.json();
      if (data.result) {
        setResult(data.result);
        if (user) await saveHistory(user.uid, "crop", formValues, data.result);
        return;
      }
    } catch { /* API sleeping or timeout, fall back to local */ }

    // Fallback: use improved local predictor
    // Use annual average rainfall if current is 0 (dry day doesn't mean dry region)
    const adjustedRainfall = +formValues.rainfall < 5
      ? estimateAnnualRainfall(+formValues.humidity, +formValues.temperature)
      : +formValues.rainfall;

    const localResult = predictCrop({
      N: +formValues.N, P: +formValues.P, K: +formValues.K,
      temperature: +formValues.temperature,
      humidity: +formValues.humidity,
      ph: +formValues.ph,
      rainfall: adjustedRainfall,
    });
    setResult(localResult);
    if (user) await saveHistory(user.uid, "crop", formValues, localResult);
  };

  // Estimate annual rainfall from humidity and temperature when current rainfall is 0
  function estimateAnnualRainfall(humidity, temperature) {
    if (humidity > 75) return 180; // high humidity = high rainfall region
    if (humidity > 60) return 120;
    if (humidity > 45) return 80;
    if (temperature > 35) return 50; // hot + dry = arid
    return 100;
  }

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-16">
      {/* Section Header */}
      <div className="text-center mb-12">
        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium mb-4 ${
          darkMode ? "bg-green-900/50 text-green-300" : "bg-green-100 text-green-700"
        }`}>
          🌾 AI Model 1
        </div>
        <h2 className="section-title mb-3">Crop Recommendation</h2>
        <p className={`max-w-xl mx-auto text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
          Enter your soil nutrients and climate data to get the best crop recommendation for your field.
        </p>
      </div>

      <div className={`eco-card p-8 ${darkMode ? "bg-gray-800/60" : ""}`}>
        {result
          ? <CropResult result={result} onBack={() => setResult(null)} darkMode={darkMode} />
          : <CropForm onSubmit={handleSubmit} darkMode={darkMode} />
        }
      </div>
    </div>
  );
}

export default Croprecommend;
