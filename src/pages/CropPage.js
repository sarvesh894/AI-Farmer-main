import { useNavigate } from "react-router-dom";
import Croprecommend from "../croprecommend";

function CropPage({ darkMode, user }) {
  const navigate = useNavigate();
  return (
    <div className={`min-h-screen ${darkMode ? "bg-gray-900" : "bg-green-50"}`}>
      <div className="max-w-5xl mx-auto px-4 pt-8">
        <button onClick={() => navigate("/dashboard")} className={`flex items-center gap-2 text-sm font-medium mb-2 transition-colors ${darkMode ? "text-green-400 hover:text-green-300" : "text-green-700 hover:text-green-600"}`}>
          ← Back to Dashboard
        </button>
      </div>
      <Croprecommend darkMode={darkMode} user={user} />
    </div>
  );
}

export default CropPage;
