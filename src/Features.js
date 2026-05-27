import { useNavigate } from "react-router-dom";

const features = [
  {
    icon: "🌾",
    tag: "AI Model 1",
    title: "Crop Recommendation",
    desc: "Input soil nutrients (N, P, K), temperature, humidity, pH, and rainfall to get the most suitable crop for your field using our trained ML model.",
    path: "/crop",
    gradient: "from-green-400 to-emerald-500",
    bg: { light: "from-green-50 to-emerald-100", dark: "from-green-900/40 to-emerald-900/30" },
    border: { light: "border-green-200", dark: "border-green-800" },
  },
  {
    icon: "💧",
    tag: "AI Model 2",
    title: "Fertilizer Recommendation",
    desc: "Provide soil type, crop type, and nutrient levels to receive precise fertilizer recommendations that maximize yield and minimize waste.",
    path: "/fertilizer",
    gradient: "from-teal-400 to-green-500",
    bg: { light: "from-teal-50 to-green-100", dark: "from-teal-900/40 to-green-900/30" },
    border: { light: "border-teal-200", dark: "border-teal-800" },
  },
  {
    icon: "🔬",
    tag: "AI Model 3",
    title: "Disease Detection",
    desc: "Upload a photo of your plant leaf and our deep learning model will identify diseases and suggest the right treatment instantly.",
    path: "/disease",
    gradient: "from-emerald-400 to-teal-500",
    bg: { light: "from-emerald-50 to-teal-100", dark: "from-emerald-900/40 to-teal-900/30" },
    border: { light: "border-emerald-200", dark: "border-emerald-800" },
  },
];

function Features({ darkMode }) {
  const navigate = useNavigate();

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
      {/* Header */}
      <div className="text-center mb-14">
        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium mb-4 ${
          darkMode ? "bg-green-900/50 text-green-300" : "bg-green-100 text-green-700"
        }`}>
          🤖 Powered by Machine Learning
        </div>
        <h2 className="section-title mb-3">Our AI Features</h2>
        <p className={`max-w-xl mx-auto text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
          Three intelligent models working together to give farmers the best data-driven advice for sustainable agriculture.
        </p>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {features.map((f, i) => (
          <div
            key={i}
            onClick={() => navigate(f.path)}
            className={`group relative rounded-2xl border p-7 bg-gradient-to-br cursor-pointer
              ${darkMode ? `${f.bg.dark} ${f.border.dark}` : `${f.bg.light} ${f.border.light}`}
              hover:shadow-xl transition-all duration-300 hover:-translate-y-2 flex flex-col`}
          >
            {/* Icon */}
            <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${f.gradient} flex items-center justify-center text-2xl mb-5 shadow-md group-hover:scale-110 transition-transform duration-300`}>
              {f.icon}
            </div>

            <span className={`text-xs font-semibold mb-2 ${darkMode ? "text-green-400" : "text-green-600"}`}>
              {f.tag}
            </span>
            <h3 className={`text-xl font-bold mb-3 ${darkMode ? "text-green-200" : "text-gray-800"}`}>
              {f.title}
            </h3>
            <p className={`text-sm leading-relaxed flex-1 mb-6 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
              {f.desc}
            </p>

            {/* CTA */}
            <div className={`flex items-center gap-2 text-sm font-semibold ${darkMode ? "text-green-400" : "text-green-600"} group-hover:gap-3 transition-all`}>
              Try Now
              <span className="text-lg">→</span>
            </div>

            {/* Hover glow */}
            <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${f.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default Features;
