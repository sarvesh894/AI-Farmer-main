const bgImage = "https://images.pexels.com/photos/974314/pexels-photo-974314.jpeg?w=600";

function Des({ darkMode }) {
  const features = [
    {
      icon: "🌾",
      title: "Crop Recommendation",
      desc: "Input soil nutrients (N, P, K), temperature, humidity, and pH to get the most suitable crop variety for optimal yield.",
    },
    {
      icon: "🔬",
      title: "Plant Disease Detection",
      desc: "Upload plant images and our ML model instantly identifies diseases, helping farmers take timely protective action.",
    },
    {
      icon: "💧",
      title: "Fertilizer Recommender",
      desc: "Get precise fertilizer recommendations based on soil type, crop type, and detected deficiencies for maximum productivity.",
    },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
      <div className="flex flex-col lg:flex-row gap-12 items-center">
        {/* Image */}
        <div className="lg:w-1/2 w-full">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-green-400 to-emerald-600 rounded-3xl transform rotate-3 opacity-20" />
            <img
              alt="Eco farming"
              src={bgImage}
              className="relative rounded-3xl w-full object-cover shadow-2xl"
              style={{ maxHeight: "500px" }}
            />
            {/* Floating badge */}
            <div className={`absolute -bottom-4 -right-4 eco-card px-5 py-3 flex items-center gap-2 ${
              darkMode ? "bg-gray-800" : "bg-white"
            }`}>
              <span className="text-2xl">🌱</span>
              <div>
                <div className={`text-xs font-semibold ${darkMode ? "text-green-400" : "text-green-700"}`}>
                  Eco-Friendly
                </div>
                <div className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                  Sustainable Farming
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="lg:w-1/2 w-full">
          <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium mb-4 ${
            darkMode ? "bg-green-900/50 text-green-300" : "bg-green-100 text-green-700"
          }`}>
            🌿 Why Choose AI Farmer
          </div>

          <h2 className="section-title mb-4">
            Smart Farming for a Greener Tomorrow
          </h2>

          <p className={`text-base leading-relaxed mb-8 ${darkMode ? "text-green-300/80" : "text-gray-600"}`}>
            AI Farmer is an integrated platform combining three powerful ML models to assist farmers,
            hobbyists, and agriculture enthusiasts with data-driven decisions.
          </p>

          <div className="space-y-5">
            {features.map((f, i) => (
              <div key={i} className={`flex gap-4 p-4 rounded-2xl border ${
                darkMode
                  ? "bg-gray-800/50 border-green-900 hover:border-green-700"
                  : "bg-green-50/50 border-green-100 hover:border-green-300"
              } transition-all duration-200`}>
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0 ${
                  darkMode ? "bg-green-900/50" : "bg-green-100"
                }`}>
                  {f.icon}
                </div>
                <div>
                  <h4 className={`font-semibold mb-1 ${darkMode ? "text-green-300" : "text-green-800"}`}>
                    {f.title}
                  </h4>
                  <p className={`text-sm leading-relaxed ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                    {f.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Des;
