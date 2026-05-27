import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { updateProfile, updatePassword, deleteUser, EmailAuthProvider, reauthenticateWithCredential } from "firebase/auth";
import { auth } from "../firebase";

export default function Settings({ darkMode, setDarkMode, user }) {
  const navigate = useNavigate();
  const [name, setName] = useState(user?.displayName || "");
  const [newPassword, setNewPassword] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [msg, setMsg] = useState({ text: "", type: "" });
  const [loading, setLoading] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [deletePassword, setDeletePassword] = useState("");

  const notify = (text, type = "success") => {
    setMsg({ text, type });
    setTimeout(() => setMsg({ text: "", type: "" }), 3000);
  };

  const handleUpdateName = async () => {
    if (!name.trim()) return;
    setLoading(true);
    try {
      await updateProfile(auth.currentUser, { displayName: name });
      notify("✅ Name updated successfully!");
    } catch {
      notify("❌ Failed to update name.", "error");
    } finally { setLoading(false); }
  };

  const handleUpdatePassword = async () => {
    if (!currentPassword || !newPassword) return;
    if (newPassword.length < 6) { notify("❌ Password must be at least 6 characters.", "error"); return; }
    setLoading(true);
    try {
      const cred = EmailAuthProvider.credential(user.email, currentPassword);
      await reauthenticateWithCredential(auth.currentUser, cred);
      await updatePassword(auth.currentUser, newPassword);
      setCurrentPassword(""); setNewPassword("");
      notify("✅ Password updated successfully!");
    } catch (e) {
      notify(e.code === "auth/wrong-password" ? "❌ Current password is incorrect." : "❌ Failed to update password.", "error");
    } finally { setLoading(false); }
  };

  const handleDeleteAccount = async () => {
    if (!deletePassword) return;
    setLoading(true);
    try {
      const cred = EmailAuthProvider.credential(user.email, deletePassword);
      await reauthenticateWithCredential(auth.currentUser, cred);
      await deleteUser(auth.currentUser);
      navigate("/signin");
    } catch (e) {
      notify(e.code === "auth/wrong-password" ? "❌ Incorrect password." : "❌ Failed to delete account.", "error");
    } finally { setLoading(false); }
  };

  const [notifications, setNotifications] = useState({
    predictions: true,
    weather: true,
    seasonal: false,
  });

  const notificationItems = [
    { key: "predictions", label: "Prediction Results", desc: "Get notified when predictions complete" },
    { key: "weather",     label: "Weather Alerts",     desc: "Receive weather-based farming tips" },
    { key: "seasonal",    label: "Seasonal Reminders", desc: "Crop planting and harvesting reminders" },
  ];
  const card = `eco-card p-6 mb-4 ${darkMode ? "bg-gray-800/60" : ""}`;
  const label = `block text-xs font-semibold mb-1 ${darkMode ? "text-green-300" : "text-green-800"}`;

  return (
    <div className={`min-h-screen ${darkMode ? "bg-gray-950" : "bg-green-50"}`}>
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
        <button onClick={() => navigate("/dashboard")} className={`text-sm font-medium mb-6 flex items-center gap-1 ${darkMode ? "text-green-400" : "text-green-700"}`}>
          ← Back to Dashboard
        </button>

        <div className="text-center mb-8">
          <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium mb-3 ${darkMode ? "bg-green-900/50 text-green-300" : "bg-green-100 text-green-700"}`}>
            ⚙️ Account Settings
          </div>
          <h2 className="section-title text-2xl mb-1">Settings</h2>
          <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Manage your account and preferences</p>
        </div>

        {/* Notification */}
        {msg.text && (
          <div className={`mb-4 p-3 rounded-xl text-sm text-center ${
            msg.type === "error"
              ? darkMode ? "bg-red-900/40 text-red-300" : "bg-red-50 text-red-600"
              : darkMode ? "bg-green-900/40 text-green-300" : "bg-green-50 text-green-700"
          }`}>
            {msg.text}
          </div>
        )}

        {/* Profile */}
        <div className={card}>
          <h3 className={`text-sm font-bold mb-4 ${darkMode ? "text-green-300" : "text-green-700"}`}>👤 Profile</h3>
          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center text-xl font-bold text-white shadow-md">
              {(user?.displayName || user?.email || "U").slice(0, 2).toUpperCase()}
            </div>
            <div>
              <p className={`font-semibold ${darkMode ? "text-green-200" : "text-gray-800"}`}>{user?.displayName || "No name set"}</p>
              <p className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}>{user?.email}</p>
            </div>
          </div>
          <label className={label}>Display Name</label>
          <div className="flex gap-2">
            <input
              type="text" value={name} onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name" className="eco-input flex-1"
            />
            <button onClick={handleUpdateName} disabled={loading} className="btn-eco px-4 py-2 text-sm">
              Save
            </button>
          </div>
        </div>

        {/* Appearance */}
        <div className={card}>
          <h3 className={`text-sm font-bold mb-4 ${darkMode ? "text-green-300" : "text-green-700"}`}>🎨 Appearance</h3>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm font-medium ${darkMode ? "text-gray-200" : "text-gray-700"}`}>
                {darkMode ? "🌙 Dark Mode" : "☀️ Light Mode"}
              </p>
              <p className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                {darkMode ? "Switch to light theme" : "Switch to dark theme"}
              </p>
            </div>
            <button
              className={`dark-toggle ${darkMode ? "active" : ""}`}
              onClick={() => setDarkMode(!darkMode)}
              aria-label="Toggle dark mode"
            />
          </div>
        </div>

        {/* Notifications */}
        <div className={card}>
          <h3 className={`text-sm font-bold mb-4 ${darkMode ? "text-green-300" : "text-green-700"}`}>🔔 Notifications</h3>
          {notificationItems.map((n, i) => (
              <div key={i} className={`flex items-center justify-between py-2.5 border-b last:border-0 ${darkMode ? "border-green-900/50" : "border-green-50"}`}>
                <div>
                  <p className={`text-sm font-medium ${darkMode ? "text-gray-200" : "text-gray-700"}`}>{n.label}</p>
                  <p className={`text-xs ${darkMode ? "text-gray-500" : "text-gray-400"}`}>{n.desc}</p>
                </div>
                <button
                  className={`dark-toggle ${notifications[n.key] ? "active" : ""}`}
                  onClick={() => setNotifications(prev => ({ ...prev, [n.key]: !prev[n.key] }))}
                />
              </div>
            ))}
        </div>

        {/* Change Password */}
        <div className={card}>
          <h3 className={`text-sm font-bold mb-4 ${darkMode ? "text-green-300" : "text-green-700"}`}>🔒 Change Password</h3>
          <div className="space-y-3">
            <div>
              <label className={label}>Current Password</label>
              <input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Enter current password" className="eco-input" />
            </div>
            <div>
              <label className={label}>New Password</label>
              <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Min. 6 characters" className="eco-input" />
            </div>
            <button onClick={handleUpdatePassword} disabled={loading} className="btn-eco w-full py-2.5 text-sm">
              Update Password
            </button>
          </div>
        </div>

        {/* Danger Zone */}
        <div className={`eco-card p-6 border-red-200 ${darkMode ? "bg-gray-800/60 border-red-900/50" : ""}`}>
          <h3 className="text-sm font-bold mb-2 text-red-500">⚠️ Danger Zone</h3>
          <p className={`text-xs mb-4 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
            Deleting your account is permanent and cannot be undone.
          </p>
          {!showDelete ? (
            <button onClick={() => setShowDelete(true)} className="px-4 py-2 text-sm rounded-xl border border-red-400 text-red-500 hover:bg-red-50 transition-colors">
              Delete Account
            </button>
          ) : (
            <div className="space-y-3">
              <input type="password" value={deletePassword} onChange={(e) => setDeletePassword(e.target.value)}
                placeholder="Confirm your password" className="eco-input" />
              <div className="flex gap-2">
                <button onClick={handleDeleteAccount} disabled={loading}
                  className="px-4 py-2 text-sm rounded-xl bg-red-500 text-white hover:bg-red-600 transition-colors">
                  Confirm Delete
                </button>
                <button onClick={() => setShowDelete(false)} className="btn-outline-eco text-sm px-4 py-2">
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
