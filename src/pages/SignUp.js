import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "../firebase";
import Logo from "../components/Logo";

function SignUp({ darkMode }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (form.password !== form.confirm) { setError("Passwords do not match."); return; }
    if (form.password.length < 6) { setError("Password must be at least 6 characters."); return; }
    setLoading(true);
    try {
      const cred = await createUserWithEmailAndPassword(auth, form.email, form.password);
      await updateProfile(cred.user, { displayName: form.name });
      navigate("/dashboard");
    } catch (err) {
      console.error("Sign up error:", err.code, err.message);
      switch (err.code) {
        case "auth/email-already-in-use": setError("An account with this email already exists."); break;
        case "auth/invalid-email":        setError("Invalid email address."); break;
        case "auth/weak-password":        setError("Password is too weak."); break;
        default: setError(`Sign up failed: ${err.code || err.message}`);
      }
    } finally { setLoading(false); }
  };

  return (
    <div className={`min-h-screen flex ${darkMode ? "bg-gray-950" : "bg-gradient-to-br from-green-50 via-white to-emerald-50"}`}>

      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-emerald-600 via-green-600 to-teal-700 flex-col justify-between p-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white opacity-5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white opacity-5 rounded-full translate-y-1/2 -translate-x-1/2" />

        <div className="flex items-center gap-3 relative z-10">
          <Logo size={40} />
          <span className="text-white text-xl font-bold">AI Farmer</span>
        </div>

        <div className="relative z-10">
          <h2 className="text-4xl font-bold text-white mb-4 leading-tight">
            Join Thousands of<br />Smart Farmers 🌱
          </h2>
          <p className="text-green-100 text-base leading-relaxed mb-8">
            Create your free account and start making data-driven farming decisions powered by AI and machine learning.
          </p>
          <div className="space-y-4">
            {[
              { icon: "🆓", title: "100% Free", desc: "No credit card required" },
              { icon: "🔒", title: "Secure", desc: "Firebase authentication" },
              { icon: "📱", title: "Works Everywhere", desc: "Desktop and mobile" },
            ].map((f, i) => (
              <div key={i} className="flex items-center gap-4 p-3 rounded-2xl bg-white/10 backdrop-blur-sm">
                <span className="text-2xl">{f.icon}</span>
                <div>
                  <p className="text-white text-sm font-semibold">{f.title}</p>
                  <p className="text-green-200 text-xs">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className={`p-4 rounded-2xl bg-white/10 backdrop-blur-sm relative z-10`}>
          <p className="text-green-100 text-sm italic">
            "AI Farmer helped me increase my crop yield by 30% in just one season."
          </p>
          <p className="text-green-300 text-xs mt-2">— Farmer, Punjab</p>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <Logo size={32} />
            <span className={`text-lg font-bold ${darkMode ? "text-green-400" : "text-green-700"}`}>AI Farmer</span>
          </div>

          <div className="mb-8">
            <h1 className={`text-3xl font-bold mb-2 ${darkMode ? "text-green-100" : "text-gray-900"}`}>
              Create account 🌿
            </h1>
            <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
              Start your smart farming journey today
            </p>
          </div>

          {error && (
            <div className={`mb-5 p-3 rounded-xl text-sm flex items-center gap-2 ${
              darkMode ? "bg-red-900/40 text-red-300" : "bg-red-50 text-red-600 border border-red-100"
            }`}>
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className={`block text-xs font-semibold mb-1.5 ${darkMode ? "text-green-300" : "text-green-800"}`}>Full Name</label>
              <input type="text" name="name" placeholder="John Doe" required
                value={form.name} onChange={handleChange}
                className={`eco-input ${darkMode ? "bg-gray-800/60" : ""}`} />
            </div>
            <div>
              <label className={`block text-xs font-semibold mb-1.5 ${darkMode ? "text-green-300" : "text-green-800"}`}>Email Address</label>
              <input type="email" name="email" placeholder="you@example.com" required
                value={form.email} onChange={handleChange}
                className={`eco-input ${darkMode ? "bg-gray-800/60" : ""}`} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={`block text-xs font-semibold mb-1.5 ${darkMode ? "text-green-300" : "text-green-800"}`}>Password</label>
                <div className="relative">
                  <input type={showPass ? "text" : "password"} name="password" placeholder="Min. 6 chars" required
                    value={form.password} onChange={handleChange}
                    className={`eco-input pr-8 ${darkMode ? "bg-gray-800/60" : ""}`} />
                  <button type="button" onClick={() => setShowPass(!showPass)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-xs">
                    {showPass ? "🙈" : "👁️"}
                  </button>
                </div>
              </div>
              <div>
                <label className={`block text-xs font-semibold mb-1.5 ${darkMode ? "text-green-300" : "text-green-800"}`}>Confirm</label>
                <input type="password" name="confirm" placeholder="Re-enter" required
                  value={form.confirm} onChange={handleChange}
                  className={`eco-input ${darkMode ? "bg-gray-800/60" : ""}`} />
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="btn-eco w-full py-3 text-sm font-semibold mt-2 disabled:opacity-60">
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Creating account...
                </span>
              ) : "Create Account →"}
            </button>
          </form>

          <div className="flex items-center gap-3 my-6">
            <div className={`flex-1 h-px ${darkMode ? "bg-gray-700" : "bg-gray-200"}`} />
            <span className={`text-xs ${darkMode ? "text-gray-500" : "text-gray-400"}`}>Already have an account?</span>
            <div className={`flex-1 h-px ${darkMode ? "bg-gray-700" : "bg-gray-200"}`} />
          </div>

          <Link to="/signin"
            className={`block w-full py-3 text-sm font-semibold text-center rounded-full border-2 transition-all no-underline ${
              darkMode ? "border-green-700 text-green-400 hover:bg-green-900/30" : "border-green-500 text-green-600 hover:bg-green-50"
            }`}>
            Sign In instead
          </Link>

          <p className="text-center mt-4">
            <Link to="/" className={`text-xs ${darkMode ? "text-gray-500 hover:text-gray-400" : "text-gray-400 hover:text-gray-500"}`}>
              ← Back to Home
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
