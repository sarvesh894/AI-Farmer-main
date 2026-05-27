import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Logo from "./components/Logo";

const HERO_CROPS = ["Rice 🌾", "Wheat 🌿", "Maize 🌽", "Cotton 🌸", "Mango 🥭", "Tomato 🍅"];

const HELP_ITEMS = [
  {
    icon: "🌾",
    title: "Crop Recommendation",
    desc: "Enter your soil nutrients (N, P, K), temperature, humidity, pH, and rainfall. Our ML model instantly predicts the best crop for your field. You can also auto-fill values using your GPS location.",
    steps: ["Go to AI Tools → Crop Recommendation", "Click 'Auto-fill from Location' or enter values manually", "Click 'Get Crop Recommendation'", "View result with crop image and details"],
  },
  {
    icon: "💧",
    title: "Fertilizer Recommendation",
    desc: "Input your soil type, crop type, and nutrient levels. The AI suggests the optimal fertilizer to maximize yield and minimize waste.",
    steps: ["Go to AI Tools → Fertilizer", "Select your Soil Type and Crop Type", "Enter nutrient values or auto-fill", "Get your fertilizer recommendation"],
  },
  {
    icon: "🔬",
    title: "Disease Detection",
    desc: "Upload a clear photo of your plant's leaf. Our deep learning model identifies the disease and provides treatment suggestions.",
    steps: ["Go to AI Tools → Disease Detection", "Drag & drop or click to upload a leaf photo", "Click 'Detect Disease'", "View disease name, severity, and treatment"],
  },
  {
    icon: "📈",
    title: "Market Prices",
    desc: "View live indicative mandi prices for 20+ crops with 7-day trend charts. Filter by category and sort by price or trend.",
    steps: ["Go to Market from the navigation", "Search for a specific crop", "Filter by category (Cereal, Pulse, etc.)", "Check trend charts and top gainers/losers"],
  },
  {
    icon: "🔮",
    title: "Future Predictions",
    desc: "Enter your farm parameters to get AI forecasts for crop yield, price trends, soil degradation, and optimal planting time.",
    steps: ["Go to Farm Tools → Future Predictions", "Enter crop, area, and soil values", "Click 'Generate Predictions'", "Switch between Yield, Price, Soil, and Planting tabs"],
  },
  {
    icon: "🧮",
    title: "Soil Health Calculator",
    desc: "Enter your soil's N, P, K, pH, and moisture values to get a health score out of 100 with improvement tips.",
    steps: ["Go to Farm Tools → Soil Health", "Enter your soil parameters", "Click 'Calculate Soil Health'", "View score, grade, and improvement tips"],
  },
  {
    icon: "📅",
    title: "Crop Calendar",
    desc: "View the best planting and harvesting months for 12+ major crops. Current month is highlighted for quick reference.",
    steps: ["Go to Farm Tools → Crop Calendar", "Browse crops and their seasonal bars", "Click any crop card for detailed tips", "Check 'Plant Now' or 'Harvest Now' badges"],
  },
  {
    icon: "📊",
    title: "History",
    desc: "All your predictions are automatically saved. Filter by type, delete entries, or export a PDF report.",
    steps: ["Go to History from the navigation", "Filter by Crop, Fertilizer, or Disease", "Click 🗑️ to delete an entry", "Click 'Export PDF' to download your report"],
  },
];

const features = [
  { icon: "🌾", title: "Crop Recommendation",  desc: "ML-powered suggestions based on your soil nutrients, climate, and location data.", color: "from-green-400 to-emerald-500" },
  { icon: "💧", title: "Fertilizer Guidance",   desc: "Precise NPK recommendations to maximize yield and minimize waste.",               color: "from-teal-400 to-green-500"   },
  { icon: "🔬", title: "Disease Detection",     desc: "Upload a leaf photo — AI identifies diseases and suggests treatments instantly.",  color: "from-emerald-400 to-teal-500"  },
  { icon: "📈", title: "Market Intelligence",   desc: "Live mandi prices with trend charts to help you sell at the right time.",         color: "from-green-500 to-teal-600"   },
  { icon: "🔮", title: "Future Predictions",    desc: "Forecast crop yield, price trends, soil health, and optimal planting windows.",   color: "from-teal-500 to-emerald-600" },
  { icon: "🌤", title: "Smart Dashboard",      desc: "Real-time weather, 7-day forecast, history, and all tools in one place.",        color: "from-emerald-500 to-green-600"},
];

const stats = [
  { value: "22+",  label: "Crop Varieties",    icon: "🌾" },
  { value: "38+",  label: "Diseases Detected", icon: "🔬" },
  { value: "95%+", label: "AI Accuracy",       icon: "🎯" },
  { value: "Free", label: "Always",            icon: "💚" },
];

const steps = [
  { n: "1", icon: "📝", title: "Sign Up Free",       desc: "Create your account in 30 seconds." },
  { n: "2", icon: "�", title: "Share Your Location", desc: "Auto-filll soil and weather data."   },
  { n: "3", icon: "🤖", title: "Get AI Insights",    desc: "Instant ML-powered recommendations." },
  { n: "4", icon: "🚀", title: "Grow Smarter",       desc: "Apply insights, maximize yield."     },
];

export default function Landing({ darkMode, onContactClick }) {
  const navigate = useNavigate();
  const [cropIdx, setCropIdx] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setCropIdx(i => (i + 1) % HERO_CROPS.length), 2000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className={darkMode ? "bg-gray-950" : "bg-white"}>

      {/* Hero */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img src="https://images.pexels.com/photos/974314/pexels-photo-974314.jpeg?w=1600" alt="Farm" className="w-full h-full object-cover" />
          <div className={`absolute inset-0 ${darkMode ? "bg-gradient-to-r from-gray-950/95 via-gray-950/80 to-gray-950/40" : "bg-gradient-to-r from-green-950/90 via-green-900/70 to-green-800/30"}`} />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8 py-24 grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/20 border border-green-500/30 text-green-300 text-sm font-medium mb-8">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              AI-Powered Agriculture Platform
            </div>
            <h1 className="text-5xl lg:text-6xl font-bold text-white leading-tight mb-4">
              Grow Smarter<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-300">with AI Farmer</span>
            </h1>
            <div className="flex items-center gap-3 mb-6 flex-wrap">
              <span className="text-green-300 text-base">Best crop today:</span>
              <span key={cropIdx} className="text-white text-lg font-bold px-3 py-1 rounded-lg bg-green-500/30 border border-green-500/40">
                {HERO_CROPS[cropIdx]}
              </span>
            </div>
            <p className="text-green-100/80 text-lg leading-relaxed mb-10 max-w-lg">
              The all-in-one platform for Indian farmers — crop recommendations, fertilizer guidance, disease detection, market prices, and AI predictions.
            </p>
            <div className="flex flex-wrap gap-4">
              <button onClick={() => navigate("/signup")} className="px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold rounded-2xl hover:shadow-lg hover:shadow-green-500/30 transition-all hover:-translate-y-0.5 text-base">
                🌱 Start for Free
              </button>
              <button onClick={() => navigate("/signin")} className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-semibold rounded-2xl border border-white/20 hover:bg-white/20 transition-all text-base">
                Sign In →
              </button>
            </div>
          </div>

          <div className="hidden lg:flex justify-end">
            <div className="bg-white/10 backdrop-blur-md rounded-3xl border border-white/20 p-6 w-80">
              <div className="flex items-center gap-3 mb-5">
                <Logo size={36} />
                <div>
                  <p className="text-white font-bold">AI Farmer</p>
                  <p className="text-green-300 text-xs">Smart Farming Platform</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {stats.map((s, i) => (
                  <div key={i} className="bg-white/10 rounded-2xl p-3 text-center">
                    <div className="text-2xl mb-1">{s.icon}</div>
                    <div className="text-white font-bold text-lg">{s.value}</div>
                    <div className="text-green-300 text-xs">{s.label}</div>
                  </div>
                ))}
              </div>
              <div className="mt-4 p-3 bg-green-500/20 rounded-2xl border border-green-500/30">
                <p className="text-green-200 text-xs text-center">🌿 Trusted by farmers across India</p>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 animate-bounce">
          <div className="w-6 h-10 rounded-full border-2 border-white/30 flex items-start justify-center pt-1.5">
            <div className="w-1 h-2 bg-white/60 rounded-full" />
          </div>
        </div>
      </section>

      {/* About */}
      <section id="about" className={`py-20 ${darkMode ? "bg-gray-950" : "bg-white"}`}>
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className={`inline-block px-4 py-1.5 rounded-full text-xs font-semibold mb-4 ${darkMode ? "bg-green-900/50 text-green-300" : "bg-green-100 text-green-700"}`}>
                About AI Farmer
              </span>
              <h2 className={`text-4xl font-bold mb-5 ${darkMode ? "text-white" : "text-gray-900"}`}>
                Smart Farming for a<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-emerald-600">Greener Tomorrow</span>
              </h2>
              <p className={`text-base leading-relaxed mb-6 ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                AI Farmer is an integrated platform combining three powerful ML models to assist farmers, hobbyists, and agriculture enthusiasts with data-driven decisions. Built with React and powered by machine learning, it brings cutting-edge technology to every farmer's fingertips.
              </p>
              <div className="space-y-4">
                {[
                  { icon: "🌾", title: "Crop Recommendation", desc: "ML model trained on 2200+ crop samples across 22 varieties." },
                  { icon: "💧", title: "Fertilizer Guidance",  desc: "Precise NPK recommendations based on soil and crop type." },
                  { icon: "🔬", title: "Disease Detection",    desc: "Deep learning model trained on 87,000+ plant images." },
                ].map((f, i) => (
                  <div key={i} className={`flex gap-4 p-4 rounded-2xl ${darkMode ? "bg-gray-800/50" : "bg-green-50"}`}>
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0 ${darkMode ? "bg-green-900/50" : "bg-green-100"}`}>{f.icon}</div>
                    <div>
                      <h4 className={`font-semibold text-sm mb-0.5 ${darkMode ? "text-green-300" : "text-green-800"}`}>{f.title}</h4>
                      <p className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}>{f.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-green-400 to-emerald-600 rounded-3xl transform rotate-3 opacity-20" />
              <img
                src="https://images.pexels.com/photos/1382102/pexels-photo-1382102.jpeg?w=600"
                alt="Smart farming"
                className="relative rounded-3xl w-full object-cover shadow-2xl"
                style={{ maxHeight: "480px" }}
              />
              <div className={`absolute -bottom-4 -left-4 px-5 py-3 rounded-2xl flex items-center gap-3 shadow-xl ${darkMode ? "bg-gray-800" : "bg-white"}`}>
                <span className="text-2xl">🌱</span>
                <div>
                  <p className={`text-xs font-bold ${darkMode ? "text-green-400" : "text-green-700"}`}>Eco-Friendly</p>
                  <p className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Sustainable Farming</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className={`py-24 ${darkMode ? "bg-gray-900" : "bg-gray-50"}`}>
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className={`inline-block px-4 py-1.5 rounded-full text-xs font-semibold mb-4 ${darkMode ? "bg-green-900/50 text-green-300" : "bg-green-100 text-green-700"}`}>
              6 Powerful AI Features
            </span>
            <h2 className={`text-4xl font-bold mb-4 ${darkMode ? "text-white" : "text-gray-900"}`}>Everything a Smart Farmer Needs</h2>
            <p className={`max-w-xl mx-auto text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
              Sign in to unlock all features. Each tool is powered by machine learning trained on real agricultural data.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f, i) => (
              <div key={i} onClick={() => navigate("/signup")}
                className={`group relative rounded-3xl p-6 cursor-pointer transition-all duration-300 hover:-translate-y-2 overflow-hidden ${darkMode ? "bg-gray-800" : "bg-white"}`}
                style={{ boxShadow: darkMode ? "none" : "0 2px 20px rgba(0,0,0,0.06)" }}
              >
                <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${f.color} opacity-0 group-hover:opacity-100 transition-opacity`} />
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${f.color} flex items-center justify-center text-2xl mb-4 shadow-md`}>{f.icon}</div>
                <h3 className={`text-base font-bold mb-2 ${darkMode ? "text-white" : "text-gray-800"}`}>{f.title}</h3>
                <p className={`text-sm leading-relaxed mb-4 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>{f.desc}</p>
                <div className={`flex items-center gap-1 text-xs font-semibold ${darkMode ? "text-green-400" : "text-green-600"} group-hover:gap-2 transition-all`}>
                  Try it free <span>→</span>
                </div>
                <div className="absolute top-4 right-4 text-xs px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-700">🔒</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className={`py-12 relative overflow-hidden ${darkMode ? "bg-gray-950" : "bg-white"}`}>
        <div className="absolute inset-0 pointer-events-none">
          <div className={`absolute top-0 left-1/4 w-96 h-96 rounded-full blur-3xl opacity-10 ${darkMode ? "bg-green-500" : "bg-green-300"}`} />
        </div>
        <div className="relative mx-auto max-w-5xl px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className={`inline-block px-4 py-1.5 rounded-full text-xs font-semibold mb-4 ${darkMode ? "bg-green-900/50 text-green-300" : "bg-green-100 text-green-700"}`}>
              Simple Process
            </span>
            <h2 className={`text-4xl font-bold ${darkMode ? "text-white" : "text-gray-900"}`}>Up and Running in Minutes</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((s, i) => (
              <div key={i} className="relative text-center">
                {i < steps.length - 1 && (
                  <div className={`hidden lg:block absolute top-8 left-[65%] w-full h-px border-t-2 border-dashed ${darkMode ? "border-green-900" : "border-green-200"}`} />
                )}
                <div className={`relative w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4 ${darkMode ? "bg-green-900/40" : "bg-green-50"}`}>
                  {s.icon}
                  <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center text-white bg-gradient-to-br from-green-500 to-emerald-600">
                    {s.n}
                  </span>
                </div>
                <h3 className={`text-sm font-bold mb-1 ${darkMode ? "text-green-200" : "text-gray-800"}`}>{s.title}</h3>
                <p className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Help */}
      <section id="help" className={`py-20 ${darkMode ? "bg-gray-900" : "bg-gray-50"}`}>
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className={`inline-block px-4 py-1.5 rounded-full text-xs font-semibold mb-4 ${darkMode ? "bg-green-900/50 text-green-300" : "bg-green-100 text-green-700"}`}>
              Help Center
            </span>
            <h2 className={`text-4xl font-bold mb-3 ${darkMode ? "text-white" : "text-gray-900"}`}>How to Use Each Feature</h2>
            <p className={`max-w-xl mx-auto text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
              Step-by-step guide for every tool in AI Farmer.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {HELP_ITEMS.map((h, i) => (
              <div key={i} className={`rounded-2xl p-6 border ${darkMode ? "bg-gray-800/60 border-green-900" : "bg-white border-green-100"}`}
                style={{ boxShadow: darkMode ? "none" : "0 2px 12px rgba(0,0,0,0.05)" }}>
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl ${darkMode ? "bg-green-900/50" : "bg-green-100"}`}>{h.icon}</div>
                  <h3 className={`font-bold text-base ${darkMode ? "text-green-200" : "text-gray-800"}`}>{h.title}</h3>
                </div>
                <p className={`text-sm leading-relaxed mb-4 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>{h.desc}</p>
                <div className="space-y-1.5">
                  {h.steps.map((step, j) => (
                    <div key={j} className="flex items-start gap-2">
                      <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5 ${darkMode ? "bg-green-900 text-green-400" : "bg-green-100 text-green-700"}`}>{j + 1}</span>
                      <span className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-600"}`}>{step}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className={`py-16 ${darkMode ? "bg-gray-900" : "bg-green-50"}`}>
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className={`inline-block px-4 py-1.5 rounded-full text-xs font-semibold mb-4 ${darkMode ? "bg-green-900/50 text-green-300" : "bg-green-100 text-green-700"}`}>
              What Farmers Say
            </span>
            <h2 className={`text-3xl font-bold ${darkMode ? "text-white" : "text-gray-900"}`}>Trusted by Farmers Across India</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              { name: "Rajesh Kumar",    location: "Punjab",       avatar: "👨‍🌾", rating: 5, text: "AI Farmer helped me choose the right crop for my soil. My wheat yield increased by 30% this season. The auto-fill feature is amazing!" },
              { name: "Priya Sharma",    location: "Maharashtra",  avatar: "👩‍🌾", rating: 5, text: "The disease detection feature saved my tomato crop. I uploaded a photo and got the exact treatment within seconds. Highly recommended!" },
              { name: "Suresh Patel",    location: "Gujarat",      avatar: "👨‍🌾", rating: 5, text: "Market prices section helps me decide when to sell. I sold my cotton at the peak price this year thanks to the trend charts." },
              { name: "Anita Devi",      location: "Uttar Pradesh",avatar: "👩‍🌾", rating: 5, text: "The fertilizer recommendation was spot on. I saved money by using exactly the right amount of NPK for my paddy fields." },
              { name: "Mohan Singh",     location: "Haryana",      avatar: "👨‍🌾", rating: 5, text: "Future predictions helped me plan my crop rotation for the entire year. The soil health calculator is very useful too." },
              { name: "Kavitha Reddy",   location: "Andhra Pradesh",avatar: "👩‍🌾", rating: 5, text: "Simple to use and very accurate. The chatbot answered all my questions about rice cultivation in my local language context." },
            ].map((t, i) => (
              <div key={i} className={`rounded-2xl p-5 border ${darkMode ? "bg-gray-800/60 border-green-900" : "bg-white border-green-100"}`}
                style={{ boxShadow: darkMode ? "none" : "0 2px 12px rgba(0,0,0,0.05)" }}>
                <div className="flex gap-0.5 mb-3">
                  {Array(t.rating).fill("⭐").map((s, j) => <span key={j} className="text-sm">{s}</span>)}
                </div>
                <p className={`text-sm leading-relaxed mb-4 italic ${darkMode ? "text-gray-300" : "text-gray-600"}`}>"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{t.avatar}</span>
                  <div>
                    <p className={`text-sm font-semibold ${darkMode ? "text-green-300" : "text-green-700"}`}>{t.name}</p>
                    <p className={`text-xs ${darkMode ? "text-gray-500" : "text-gray-400"}`}>📍 {t.location}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 relative overflow-hidden">
        <div className="absolute inset-0">
          <img src="https://images.pexels.com/photos/2132250/pexels-photo-2132250.jpeg?w=1600" alt="Farm" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-br from-green-900/95 to-emerald-900/90" />
        </div>
        <div className="relative z-10 mx-auto max-w-3xl px-6 text-center">
          <div className="text-6xl mb-6">🌿</div>
          <h2 className="text-4xl font-bold text-white mb-4">Ready to Farm Smarter?</h2>
          <p className="text-green-100 text-lg mb-10 max-w-xl mx-auto">
            Join farmers across India using AI to maximize yield, reduce costs, and grow sustainably.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button onClick={() => navigate("/signup")} className="px-10 py-4 bg-white text-green-800 font-bold rounded-2xl hover:bg-green-50 transition-all hover:shadow-xl text-base">
              🌱 Get Started Free
            </button>
            <button onClick={() => navigate("/signin")} className="px-10 py-4 bg-transparent border-2 border-white/50 text-white font-semibold rounded-2xl hover:bg-white/10 transition-all text-base">
              Sign In
            </button>
          </div>
        </div>
      </section>

    </div>
  );
}
