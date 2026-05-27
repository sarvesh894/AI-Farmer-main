import { useNavigate } from "react-router-dom";
import Fertilizer from "../fertilizer";

function FertilizerPage({ darkMode, user }) {
  const navigate = useNavigate();
  return (
    <div className={`min-h-screen ${darkMode ? "bg-gray-950" : "bg-white"}`}>
      <div className="max-w-5xl mx-auto px-4 pt-8">
        <button onClick={() => navigate("/dashboard")} className={`flex items-center gap-2 text-sm font-medium mb-2 transition-colors ${darkMode ? "text-green-400 hover:text-green-300" : "text-green-700 hover:text-green-600"}`}>
          ← Back to Dashboard
        </button>
      </div>
      <Fertilizer darkMode={darkMode} user={user} />
    </div>
  );
}

export default FertilizerPage;
