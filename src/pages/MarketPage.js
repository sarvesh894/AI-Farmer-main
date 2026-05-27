import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// Simulated market data with realistic Indian mandi prices (₹/quintal)
const BASE_PRICES = {
  "Rice":        { price: 2183, unit: "₹/quintal", category: "Cereal",     icon: "🌾", trend: 2.3  },
  "Wheat":       { price: 2275, unit: "₹/quintal", category: "Cereal",     icon: "🌿", trend: 1.1  },
  "Maize":       { price: 1962, unit: "₹/quintal", category: "Cereal",     icon: "🌽", trend: -0.8 },
  "Soybean":     { price: 4300, unit: "₹/quintal", category: "Oilseed",    icon: "🫘", trend: 3.2  },
  "Mustard":     { price: 5200, unit: "₹/quintal", category: "Oilseed",    icon: "🌼", trend: -1.5 },
  "Cotton":      { price: 6620, unit: "₹/quintal", category: "Fiber",      icon: "🌸", trend: 0.5  },
  "Sugarcane":   { price: 315,  unit: "₹/quintal", category: "Cash Crop",  icon: "🎋", trend: 1.8  },
  "Tomato":      { price: 1800, unit: "₹/quintal", category: "Vegetable",  icon: "🍅", trend: -5.2 },
  "Onion":       { price: 1200, unit: "₹/quintal", category: "Vegetable",  icon: "🧅", trend: 8.4  },
  "Potato":      { price: 900,  unit: "₹/quintal", category: "Vegetable",  icon: "🥔", trend: -2.1 },
  "Chickpea":    { price: 5440, unit: "₹/quintal", category: "Pulse",      icon: "🫘", trend: 0.9  },
  "Lentil":      { price: 6000, unit: "₹/quintal", category: "Pulse",      icon: "🌱", trend: 2.7  },
  "Mung Bean":   { price: 7500, unit: "₹/quintal", category: "Pulse",      icon: "🟢", trend: 1.4  },
  "Groundnut":   { price: 5550, unit: "₹/quintal", category: "Oilseed",    icon: "🥜", trend: -0.3 },
  "Banana":      { price: 1500, unit: "₹/quintal", category: "Fruit",      icon: "🍌", trend: 3.6  },
  "Mango":       { price: 4000, unit: "₹/quintal", category: "Fruit",      icon: "🥭", trend: 5.1  },
  "Apple":       { price: 8000, unit: "₹/quintal", category: "Fruit",      icon: "🍎", trend: -1.2 },
  "Grapes":      { price: 6500, unit: "₹/quintal", category: "Fruit",      icon: "🍇", trend: 2.0  },
  "Turmeric":    { price: 7200, unit: "₹/quintal", category: "Spice",      icon: "🟡", trend: 4.5  },
  "Chilli":      { price: 8500, unit: "₹/quintal", category: "Spice",      icon: "🌶️", trend: -3.8 },
};

const CATEGORIES = ["All", "Cereal", "Pulse", "Oilseed", "Vegetable", "Fruit", "Spice", "Cash Crop", "Fiber"];

function PriceTrend({ trend, darkMode }) {
  const up = trend >= 0;
  return (
    <span className={`flex items-center gap-0.5 text-xs font-semibold ${up ? "text-green-500" : "text-red-500"}`}>
      {up ? "▲" : "▼"} {Math.abs(trend)}%
    </span>
  );
}

function Sparkline({ trend }) {
  const up = trend >= 0;
  const points = Array.from({ length: 7 }, (_, i) => {
    const noise = (Math.random() - 0.5) * 10;
    return 30 - (i * trend * 0.8) + noise;
  }).reverse();
  const min = Math.min(...points);
  const max = Math.max(...points);
  const norm = points.map(p => 30 - ((p - min) / (max - min + 1)) * 25);
  const path = norm.map((y, i) => `${i === 0 ? "M" : "L"} ${i * 10} ${y}`).join(" ");
  return (
    <svg width="60" height="32" viewBox="0 0 60 32">
      <path d={path} fill="none" stroke={up ? "#22c55e" : "#ef4444"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function MarketPage({ darkMode }) {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [sortBy, setSortBy] = useState("name");
  const [prices, setPrices] = useState({});
  const [lastUpdated, setLastUpdated] = useState("");

  useEffect(() => {
    // Simulate live price fluctuation
    const update = () => {
      const updated = {};
      Object.entries(BASE_PRICES).forEach(([crop, data]) => {
        const fluctuation = (Math.random() - 0.5) * 0.02; // ±1%
        updated[crop] = {
          ...data,
          price: Math.round(data.price * (1 + fluctuation)),
          trend: +(data.trend + (Math.random() - 0.5) * 0.2).toFixed(1),
        };
      });
      setPrices(updated);
      setLastUpdated(new Date().toLocaleTimeString());
    };
    update();
    const interval = setInterval(update, 30000); // refresh every 30s
    return () => clearInterval(interval);
  }, []);

  const filtered = Object.entries(prices)
    .filter(([name, data]) => {
      const matchSearch = name.toLowerCase().includes(search.toLowerCase());
      const matchCat = category === "All" || data.category === category;
      return matchSearch && matchCat;
    })
    .sort(([aName, aData], [bName, bData]) => {
      if (sortBy === "name")     return aName.localeCompare(bName);
      if (sortBy === "price")    return bData.price - aData.price;
      if (sortBy === "trend")    return bData.trend - aData.trend;
      return 0;
    });

  const topGainers = Object.entries(prices).sort((a, b) => b[1].trend - a[1].trend).slice(0, 3);
  const topLosers  = Object.entries(prices).sort((a, b) => a[1].trend - b[1].trend).slice(0, 3);

  const card = `eco-card p-5 ${darkMode ? "bg-gray-800/60" : ""}`;

  return (
    <div className={`min-h-screen ${darkMode ? "bg-gray-950" : "bg-green-50"}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <button onClick={() => navigate("/dashboard")} className={`text-sm font-medium mb-6 flex items-center gap-1 ${darkMode ? "text-green-400" : "text-green-700"}`}>
          ← Back to Dashboard
        </button>

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-8 gap-4">
          <div>
            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium mb-2 ${darkMode ? "bg-green-900/50 text-green-300" : "bg-green-100 text-green-700"}`}>
              📈 Live Market Data
            </div>
            <h2 className="section-title text-2xl mb-3">Crop Market Prices</h2>
            <div className="flex flex-wrap gap-3">
              <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-medium ${darkMode ? "bg-gray-800 text-gray-300 border border-green-900" : "bg-white text-gray-600 border border-green-100 shadow-sm"}`}>
                🕐 Updated: <span className={`font-semibold ${darkMode ? "text-green-400" : "text-green-600"}`}>{lastUpdated}</span>
              </div>
              <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-medium ${darkMode ? "bg-gray-800 text-gray-300 border border-green-900" : "bg-white text-gray-600 border border-green-100 shadow-sm"}`}>
                💰 Unit: <span className={`font-semibold ${darkMode ? "text-green-400" : "text-green-600"}`}>₹/quintal</span>
              </div>
              <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-medium ${darkMode ? "bg-gray-800 text-gray-300 border border-green-900" : "bg-white text-gray-600 border border-green-100 shadow-sm"}`}>
                📍 Market: <span className={`font-semibold ${darkMode ? "text-green-400" : "text-green-600"}`}>Indian Mandi</span>
              </div>
            </div>
          </div>
          <div className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium flex-shrink-0 ${darkMode ? "bg-green-900/30 text-green-400 border border-green-800" : "bg-green-100 text-green-700"}`}>
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            Live Prices
          </div>
        </div>

        {/* Top Gainers / Losers */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className={card}>
            <h3 className={`text-xs font-semibold mb-3 ${darkMode ? "text-green-400" : "text-green-700"}`}>🚀 Top Gainers</h3>
            <div className="space-y-2">
              {topGainers.map(([name, data]) => (
                <div key={name} className={`flex items-center justify-between p-2 rounded-xl ${darkMode ? "bg-green-900/20" : "bg-green-50"}`}>
                  <span className="text-sm">{data.icon} {name}</span>
                  <div className="flex items-center gap-3">
                    <span className={`text-sm font-bold ${darkMode ? "text-green-300" : "text-green-700"}`}>₹{data.price.toLocaleString()}</span>
                    <PriceTrend trend={data.trend} darkMode={darkMode} />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className={card}>
            <h3 className={`text-xs font-semibold mb-3 text-red-500`}>📉 Top Losers</h3>
            <div className="space-y-2">
              {topLosers.map(([name, data]) => (
                <div key={name} className={`flex items-center justify-between p-2 rounded-xl ${darkMode ? "bg-red-900/20" : "bg-red-50"}`}>
                  <span className="text-sm">{data.icon} {name}</span>
                  <div className="flex items-center gap-3">
                    <span className={`text-sm font-bold ${darkMode ? "text-red-300" : "text-red-600"}`}>₹{data.price.toLocaleString()}</span>
                    <PriceTrend trend={data.trend} darkMode={darkMode} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Search + Sort */}
        <div className={`flex gap-3 mb-6 items-center p-3 rounded-2xl border ${
          darkMode ? "bg-gray-800/60 border-green-900" : "bg-white border-green-100"
        } shadow-sm`}>
          <span className={`text-lg pl-1 ${darkMode ? "text-green-400" : "text-green-500"}`}>🔍</span>
          <input
            type="text"
            placeholder="Search crop name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={`flex-1 bg-transparent outline-none text-sm ${
              darkMode ? "text-green-100 placeholder-gray-500" : "text-gray-700 placeholder-gray-400"
            }`}
          />
          {search && (
            <button onClick={() => setSearch("")} className={`text-xs px-2 py-1 rounded-lg ${darkMode ? "text-gray-400 hover:bg-gray-700" : "text-gray-400 hover:bg-gray-100"}`}>
              ✕
            </button>
          )}
          <div className={`h-5 w-px ${darkMode ? "bg-gray-700" : "bg-gray-200"}`} />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className={`text-xs font-medium bg-transparent outline-none cursor-pointer pr-1 ${
              darkMode ? "text-green-400" : "text-green-700"
            }`}
          >
            <option value="name">A–Z</option>
            <option value="price">Price ↓</option>
            <option value="trend">Trend ↓</option>
          </select>
        </div>

        {/* Category tabs */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                category === cat
                  ? "bg-green-500 text-white shadow"
                  : darkMode ? "bg-gray-800 text-gray-400 hover:bg-gray-700" : "bg-white text-gray-500 hover:bg-green-50 border border-green-100"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Price table */}
        <div className={`eco-card overflow-hidden ${darkMode ? "bg-gray-800/60" : ""}`}>
          <div className={`grid grid-cols-5 px-5 py-3 text-xs font-semibold border-b ${
            darkMode ? "text-green-400 border-green-900" : "text-green-700 border-green-100"
          }`}>
            <span className="col-span-2">Crop</span>
            <span className="text-right">Price</span>
            <span className="text-right">Trend</span>
            <span className="text-right">7d Chart</span>
          </div>

          {filtered.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-4xl mb-2">🌾</div>
              <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>No crops found.</p>
            </div>
          ) : (
            filtered.map(([name, data], i) => (
              <div
                key={name}
                className={`grid grid-cols-5 px-5 py-3.5 items-center border-b last:border-0 transition-colors ${
                  darkMode
                    ? "border-green-900/30 hover:bg-gray-700/50"
                    : "border-green-50 hover:bg-green-50"
                }`}
              >
                <div className="col-span-2 flex items-center gap-3">
                  <span className="text-xl">{data.icon}</span>
                  <div>
                    <p className={`text-sm font-semibold ${darkMode ? "text-green-200" : "text-gray-800"}`}>{name}</p>
                    <p className={`text-xs ${darkMode ? "text-gray-500" : "text-gray-400"}`}>{data.category}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-bold ${darkMode ? "text-green-300" : "text-green-700"}`}>
                    ₹{data.price.toLocaleString()}
                  </p>
                  <p className={`text-xs ${darkMode ? "text-gray-500" : "text-gray-400"}`}>{data.unit}</p>
                </div>
                <div className="flex justify-end">
                  <PriceTrend trend={data.trend} darkMode={darkMode} />
                </div>
                <div className="flex justify-end">
                  <Sparkline trend={data.trend} />
                </div>
              </div>
            ))
          )}
        </div>

        <p className={`text-xs text-center mt-4 ${darkMode ? "text-gray-600" : "text-gray-400"}`}>
          * Prices are indicative based on average Indian mandi rates. Actual prices may vary by region and season.
        </p>
      </div>
    </div>
  );
}
