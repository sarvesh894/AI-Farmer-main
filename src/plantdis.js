import React, { useState, useRef } from "react";
import { saveHistory } from "./utils/saveHistory";

const DISEASE_API = "http://127.0.0.1:8002"; // replace with your deployed URL

const severityConfig = {
  none:   { color: "text-green-600",  bg: "bg-green-100",  dark: "text-green-400",  darkBg: "bg-green-900/40",  label: "Healthy",  icon: "✅" },
  medium: { color: "text-yellow-600", bg: "bg-yellow-100", dark: "text-yellow-400", darkBg: "bg-yellow-900/40", label: "Moderate", icon: "⚠️" },
  high:   { color: "text-red-600",    bg: "bg-red-100",    dark: "text-red-400",    darkBg: "bg-red-900/40",    label: "Severe",   icon: "🚨" },
};

function Plantdis({ darkMode, user }) {
  const [image, setImage]       = useState(null);
  const [preview, setPreview]   = useState(null);
  const [result, setResult]     = useState(null);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState(null);
  const [dragging, setDragging] = useState(false);
  const fileRef = useRef();

  const handleFile = (file) => {
    if (!file || !file.type.startsWith("image/")) {
      setError("Please upload a valid image file.");
      return;
    }
    setError(null);
    setResult(null);
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    handleFile(e.dataTransfer.files[0]);
  };

  const handleSubmit = async () => {
    if (!image) return;
    setLoading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append("file", image);
      const res = await fetch(`${DISEASE_API}/predict`, {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error(`Server error: ${res.status}`);
      const data = await res.json();
      setResult(data);
      if (user) await saveHistory(user.uid, "disease", { filename: image.name }, data.result || data.display);
    } catch (err) {
      setError("Failed to connect to the disease detection API. Make sure the API is running.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setImage(null);
    setPreview(null);
    setResult(null);
    setError(null);
  };

  const sev = result ? (severityConfig[result.severity] || severityConfig.medium) : null;

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-16">
      {/* Section Header */}
      <div className="text-center mb-12">
        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium mb-4 ${
          darkMode ? "bg-green-900/50 text-green-300" : "bg-green-100 text-green-700"
        }`}>
          🔬 AI Model 3
        </div>
        <h2 className="section-title mb-3">Plant Disease Detection</h2>
        <p className={`max-w-xl mx-auto text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
          Upload a photo of your plant leaf and our AI will identify the disease and suggest the right treatment.
        </p>
      </div>

      <div className={`eco-card p-8 ${darkMode ? "bg-gray-800/60" : ""}`}>
        {!result ? (
          <>
            {/* Drop Zone */}
            <div
              onClick={() => fileRef.current.click()}
              onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onDrop={handleDrop}
              className={`relative border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all duration-200 mb-6 ${
                dragging
                  ? darkMode ? "border-green-400 bg-green-900/30" : "border-green-500 bg-green-50"
                  : darkMode ? "border-green-800 hover:border-green-600 hover:bg-green-900/20" : "border-green-200 hover:border-green-400 hover:bg-green-50"
              }`}
            >
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleFile(e.target.files[0])}
              />

              {preview ? (
                <div className="flex flex-col items-center gap-4">
                  <img
                    src={preview}
                    alt="Preview"
                    className="max-h-64 rounded-xl object-contain shadow-md"
                  />
                  <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                    {image?.name} — click to change
                  </p>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-3">
                  <div className="text-6xl">🌿</div>
                  <p className={`text-base font-semibold ${darkMode ? "text-green-300" : "text-green-700"}`}>
                    Drag & drop a plant image here
                  </p>
                  <p className={`text-sm ${darkMode ? "text-gray-500" : "text-gray-400"}`}>
                    or click to browse — JPG, PNG, WEBP supported
                  </p>
                </div>
              )}
            </div>

            {/* Error */}
            {error && (
              <div className={`mb-4 p-3 rounded-xl text-sm ${darkMode ? "bg-red-900/40 text-red-300" : "bg-red-50 text-red-600"}`}>
                ⚠️ {error}
              </div>
            )}

            {/* Submit */}
            <div className="text-center">
              <button
                onClick={handleSubmit}
                disabled={!image || loading}
                className="btn-eco px-10 py-3 text-base disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "🔬 Analyzing..." : "🔍 Detect Disease"}
              </button>
            </div>
          </>
        ) : (
          /* Result */
          <div className="flex flex-col md:flex-row gap-8 items-start">
            {/* Image */}
            <div className="md:w-2/5 flex-shrink-0">
              <img
                src={preview}
                alt="Analyzed plant"
                className="rounded-2xl w-full object-cover shadow-lg"
                style={{ maxHeight: "320px" }}
              />
            </div>

            {/* Result Details */}
            <div className="md:w-3/5">
              {/* Severity badge */}
              <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold mb-4 ${
                darkMode ? `${sev.darkBg} ${sev.dark}` : `${sev.bg} ${sev.color}`
              }`}>
                {sev.icon} {sev.label}
              </span>

              {/* Plant & Disease */}
              <h3 className={`text-2xl font-bold mb-1 ${darkMode ? "text-green-200" : "text-gray-800"}`}>
                {result.plant}
              </h3>
              <p className={`text-lg font-semibold mb-4 ${darkMode ? sev.dark : sev.color}`}>
                {result.disease}
              </p>

              {/* Confidence */}
              <div className={`flex items-center gap-3 mb-5`}>
                <span className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Confidence</span>
                <div className={`flex-1 h-2 rounded-full ${darkMode ? "bg-gray-700" : "bg-gray-200"}`}>
                  <div
                    className="h-2 rounded-full bg-gradient-to-r from-green-400 to-green-600 transition-all duration-700"
                    style={{ width: `${result.confidence}%` }}
                  />
                </div>
                <span className={`text-sm font-semibold ${darkMode ? "text-green-400" : "text-green-600"}`}>
                  {result.confidence}%
                </span>
              </div>

              {/* Treatment */}
              <div className={`p-4 rounded-xl mb-6 ${darkMode ? "bg-green-900/30 border border-green-800" : "bg-green-50 border border-green-100"}`}>
                <p className={`text-xs font-semibold mb-1 ${darkMode ? "text-green-400" : "text-green-700"}`}>
                  💊 Recommended Treatment
                </p>
                <p className={`text-sm leading-relaxed ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                  {result.treatment}
                </p>
              </div>

              <button onClick={reset} className="btn-outline-eco">
                ← Analyze Another Plant
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Plantdis;
