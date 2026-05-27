import { useState } from "react";
import { useNavigate } from "react-router-dom";

const CROPS = {
  Rice:        { plant: [5,6],    harvest: [9,10],   season: "Kharif",  icon: "🌾", tip: "Needs flooded fields and high humidity." },
  Wheat:       { plant: [10,11],  harvest: [3,4],    season: "Rabi",    icon: "🌿", tip: "Cool weather crop, needs well-drained soil." },
  Maize:       { plant: [6,7],    harvest: [9,10],   season: "Kharif",  icon: "🌽", tip: "Needs warm temperature and moderate rainfall." },
  Cotton:      { plant: [4,5],    harvest: [10,11],  season: "Kharif",  icon: "🌸", tip: "Requires long frost-free season." },
  Sugarcane:   { plant: [2,3],    harvest: [11,12],  season: "Annual",  icon: "🎋", tip: "Needs tropical climate and heavy rainfall." },
  Mango:       { plant: [7,8],    harvest: [4,5],    season: "Perennial",icon: "🥭", tip: "Thrives in tropical and subtropical regions." },
  Banana:      { plant: [3,4],    harvest: [9,10],   season: "Annual",  icon: "🍌", tip: "Needs warm humid climate and rich soil." },
  Tomato:      { plant: [11,12],  harvest: [2,3],    season: "Rabi",    icon: "🍅", tip: "Needs well-drained fertile soil." },
  Potato:      { plant: [10,11],  harvest: [1,2],    season: "Rabi",    icon: "🥔", tip: "Cool climate crop, avoid waterlogging." },
  Chickpea:    { plant: [10,11],  harvest: [2,3],    season: "Rabi",    icon: "🫘", tip: "Drought tolerant, needs well-drained soil." },
  Groundnut:   { plant: [6,7],    harvest: [10,11],  season: "Kharif",  icon: "🥜", tip: "Needs sandy loam soil and warm climate." },
  Soybean:     { plant: [6,7],    harvest: [10,11],  season: "Kharif",  icon: "🌱", tip: "Needs warm temperature and moderate rainfall." },
};

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

export default function CropCalendar({ darkMode }) {
  const navigate = useNavigate();
  const [selected, setSelected] = useState(null);
  const currentMonth = new Date().getMonth() + 1;

  const isPlanting = (crop) => CROPS[crop].plant.includes(currentMonth);
  const isHarvesting = (crop) => CROPS[crop].harvest.includes(currentMonth);

  return (
    <div className={`min-h-screen ${darkMode ? "bg-gray-950" : "bg-green-50"}`}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <button onClick={() => navigate("/dashboard")} className={`text-sm font-medium mb-6 flex items-center gap-1 ${darkMode ? "text-green-400" : "text-green-700"}`}>
          ← Back to Dashboard
        </button>

        <div className="text-center mb-10">
          <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium mb-4 ${darkMode ? "bg-green-900/50 text-green-300" : "bg-green-100 text-green-700"}`}>
            📅 Seasonal Guide
          </div>
          <h2 className="section-title mb-2">Crop Calendar</h2>
          <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
            Best planting and harvesting seasons for major crops. Current month: <span className="font-semibold text-green-600">{MONTHS[currentMonth-1]}</span>
          </p>
        </div>

        {/* Legend */}
        <div className="flex gap-4 mb-6 flex-wrap justify-center">
          {[
            { color: "bg-green-500", label: "Planting Season" },
            { color: "bg-yellow-500", label: "Harvesting Season" },
            { color: "bg-blue-400", label: "Current Month" },
          ].map((l, i) => (
            <div key={i} className="flex items-center gap-2 text-xs">
              <div className={`w-3 h-3 rounded-full ${l.color}`} />
              <span className={darkMode ? "text-gray-400" : "text-gray-600"}>{l.label}</span>
            </div>
          ))}
        </div>

        {/* Crop grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {Object.entries(CROPS).map(([name, data]) => (
            <div
              key={name}
              onClick={() => setSelected(selected === name ? null : name)}
              className={`eco-card p-4 cursor-pointer transition-all hover:-translate-y-1 ${
                darkMode ? "bg-gray-800/60" : ""
              } ${selected === name ? "ring-2 ring-green-500" : ""}`}
            >
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl">{data.icon}</span>
                <div>
                  <h3 className={`font-semibold text-sm ${darkMode ? "text-green-200" : "text-gray-800"}`}>{name}</h3>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${darkMode ? "bg-green-900/50 text-green-400" : "bg-green-100 text-green-700"}`}>
                    {data.season}
                  </span>
                </div>
                {isPlanting(name) && <span className="ml-auto text-xs bg-green-500 text-white px-2 py-0.5 rounded-full">🌱 Plant Now</span>}
                {isHarvesting(name) && <span className="ml-auto text-xs bg-yellow-500 text-white px-2 py-0.5 rounded-full">🌾 Harvest Now</span>}
              </div>

              {/* Month bar */}
              <div className="flex gap-0.5">
                {MONTHS.map((m, idx) => {
                  const mo = idx + 1;
                  const isPlant = data.plant.includes(mo);
                  const isHarvest = data.harvest.includes(mo);
                  const isCurrent = mo === currentMonth;
                  return (
                    <div
                      key={m}
                      title={m}
                      className={`flex-1 h-4 rounded-sm text-center transition-all ${
                        isCurrent ? "ring-1 ring-blue-400" : ""
                      } ${isPlant ? "bg-green-500" : isHarvest ? "bg-yellow-500" : darkMode ? "bg-gray-700" : "bg-gray-100"}`}
                    />
                  );
                })}
              </div>
              <div className="flex justify-between mt-1">
                <span className={`text-xs ${darkMode ? "text-gray-500" : "text-gray-400"}`}>Jan</span>
                <span className={`text-xs ${darkMode ? "text-gray-500" : "text-gray-400"}`}>Dec</span>
              </div>

              {/* Expanded tip */}
              {selected === name && (
                <div className={`mt-3 p-3 rounded-xl text-xs ${darkMode ? "bg-green-900/30 text-green-300" : "bg-green-50 text-green-800"}`}>
                  💡 {data.tip}
                  <div className="mt-2 flex gap-4">
                    <span>🌱 Plant: {data.plant.map(m => MONTHS[m-1]).join(", ")}</span>
                    <span>🌾 Harvest: {data.harvest.map(m => MONTHS[m-1]).join(", ")}</span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
