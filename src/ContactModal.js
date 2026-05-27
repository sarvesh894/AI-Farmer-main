import { useState } from "react";
import abiram from "./img/Awanit.jpg";

function ContactModal({ isOpen, onClose, darkMode }) {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [sent, setSent] = useState(false);
  const [focused, setFocused] = useState("");

  if (!isOpen) return null;

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    const mailto = `mailto:awanitsingh8873@gmail.com?subject=${encodeURIComponent(form.subject || `Message from ${form.name}`)}&body=${encodeURIComponent(form.message)}%0A%0AFrom: ${encodeURIComponent(form.name)}%0AEmail: ${encodeURIComponent(form.email)}`;
    window.location.href = mailto;
    setSent(true);
    setTimeout(() => { setSent(false); setForm({ name: "", email: "", subject: "", message: "" }); }, 3000);
  };

  const bg   = darkMode ? "bg-gray-900"   : "bg-white";
  const card = darkMode ? "bg-gray-800/80 border-green-900/60" : "bg-green-50/80 border-green-100";
  const text = darkMode ? "text-green-100" : "text-gray-800";
  const sub  = darkMode ? "text-gray-400"  : "text-gray-500";
  const inputBase = `w-full px-4 py-3 rounded-xl text-sm outline-none transition-all border ${
    darkMode ? "bg-gray-700/50 text-green-100 placeholder-gray-500" : "bg-white text-gray-700 placeholder-gray-400"
  }`;
  const inputFocus = (name) => focused === name
    ? "border-green-500 shadow-[0_0_0_3px_rgba(34,197,94,0.15)]"
    : darkMode ? "border-gray-700" : "border-green-100";

  const socials = [
    { label: "GitHub",    icon: "🐙", href: "https://github.com/awanitsingh",  color: darkMode ? "hover:bg-gray-700" : "hover:bg-gray-100" },
    { label: "LinkedIn",  icon: "💼", href: "#",                                color: darkMode ? "hover:bg-blue-900/40" : "hover:bg-blue-50" },
    { label: "WhatsApp",  icon: "💬", href: "https://wa.me/917061879429",       color: darkMode ? "hover:bg-green-900/40" : "hover:bg-green-50" },
    { label: "Email",     icon: "✉️", href: "mailto:awanitsingh8873@gmail.com", color: darkMode ? "hover:bg-yellow-900/40" : "hover:bg-yellow-50" },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.65)", backdropFilter: "blur(8px)" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className={`relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl ${bg}`}
        style={{ boxShadow: "0 25px 60px rgba(0,0,0,0.3)" }}>

        {/* Top gradient bar */}
        <div className="h-1.5 w-full rounded-t-3xl bg-gradient-to-r from-green-400 via-emerald-500 to-teal-400" />

        {/* Close */}
        <button onClick={onClose} aria-label="Close"
          className={`absolute top-4 right-4 z-10 w-8 h-8 rounded-full flex items-center justify-center text-sm transition-all ${
            darkMode ? "bg-gray-700 hover:bg-gray-600 text-gray-300" : "bg-gray-100 hover:bg-gray-200 text-gray-500"
          }`}>
          ✕
        </button>

        <div className="p-6 md:p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium mb-3 ${
              darkMode ? "bg-green-900/50 text-green-300" : "bg-green-100 text-green-700"
            }`}>
              🌿 Let's Connect
            </span>
            <h2 className={`text-2xl font-bold mb-1 ${text}`}>Get In Touch</h2>
            <p className={`text-sm ${sub}`}>Have a question or want to collaborate? I'd love to hear from you.</p>
          </div>

          <div className="grid md:grid-cols-5 gap-6">

            {/* Left — Profile (2 cols) */}
            <div className="md:col-span-2 flex flex-col gap-4">
              {/* Profile */}
              <div className={`rounded-2xl p-5 border flex flex-col items-center text-center ${card}`}>
                <div className="relative mb-3">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 blur-lg opacity-25 scale-110" />
                  <img src={abiram} alt="Awanit Kumar Singh"
                    className="relative w-20 h-20 rounded-full object-cover border-3 border-white shadow-lg" />
                  <span className="absolute bottom-0.5 right-0.5 w-4 h-4 bg-green-500 rounded-full border-2 border-white" />
                </div>
                <h3 className={`text-base font-bold mb-0.5 ${text}`}>Awanit Kumar Singh</h3>
                <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium mb-2 ${
                  darkMode ? "bg-green-900/50 text-green-300" : "bg-green-100 text-green-700"
                }`}>Full Stack Developer</span>
                <p className={`text-xs leading-relaxed ${sub}`}>
                  Final Year CSE @ LPU, Punjab. Passionate about AI & agricultural technology.
                </p>
              </div>

              {/* Contact info */}
              <div className={`rounded-2xl p-4 border space-y-2 ${card}`}>
                {[
                  { icon: "✉️", label: "awanitsingh8873@gmail.com", href: "mailto:awanitsingh8873@gmail.com" },
                  { icon: "📞", label: "+91 7061879429", href: "tel:+917061879429" },
                  { icon: "📍", label: "LPU, Punjab, India", href: null },
                ].map((item, i) => (
                  <div key={i} className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs ${
                    darkMode ? "bg-gray-700/40" : "bg-white"
                  }`}>
                    <span className="text-base">{item.icon}</span>
                    {item.href
                      ? <a href={item.href} className={`truncate hover:underline ${darkMode ? "text-green-300" : "text-green-700"}`}>{item.label}</a>
                      : <span className={`truncate ${sub}`}>{item.label}</span>
                    }
                  </div>
                ))}
              </div>

              {/* Socials */}
              <div className={`rounded-2xl p-4 border ${card}`}>
                <p className={`text-xs font-semibold mb-3 ${darkMode ? "text-green-400" : "text-green-700"}`}>🔗 Find me on</p>
                <div className="grid grid-cols-2 gap-2">
                  {socials.map((s, i) => (
                    <a key={i} href={s.href} target="_blank" rel="noopener noreferrer"
                      className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium transition-all ${s.color} ${text}`}>
                      <span className="text-base">{s.icon}</span>
                      {s.label}
                    </a>
                  ))}
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-2">
                {[
                  { icon: "⚡", title: "Response", desc: "< 24 hrs" },
                  { icon: "🤝", title: "Open For", desc: "Collab" },
                ].map((item, i) => (
                  <div key={i} className={`rounded-xl p-3 text-center border ${card}`}>
                    <div className="text-xl mb-1">{item.icon}</div>
                    <div className={`text-xs font-semibold ${darkMode ? "text-green-300" : "text-green-700"}`}>{item.title}</div>
                    <div className={`text-xs ${sub}`}>{item.desc}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — Form (3 cols) */}
            <div className="md:col-span-3">
              <div className={`rounded-2xl p-5 border h-full ${card}`}>
                <h3 className={`text-base font-bold mb-1 ${text}`}>Send a Message</h3>
                <p className={`text-xs mb-5 ${sub}`}>Fill the form — it'll open your mail client with everything prefilled.</p>

                {sent && (
                  <div className="mb-4 p-3 rounded-xl text-sm bg-green-100 text-green-700 text-center flex items-center justify-center gap-2">
                    ✅ Opening your mail client...
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className={`block text-xs font-semibold mb-1 ${darkMode ? "text-green-300" : "text-green-800"}`}>👤 Name</label>
                      <input type="text" name="name" placeholder="Your name" required
                        value={form.name} onChange={handleChange}
                        onFocus={() => setFocused("name")} onBlur={() => setFocused("")}
                        className={`${inputBase} ${inputFocus("name")}`} />
                    </div>
                    <div>
                      <label className={`block text-xs font-semibold mb-1 ${darkMode ? "text-green-300" : "text-green-800"}`}>✉️ Email</label>
                      <input type="email" name="email" placeholder="you@email.com" required
                        value={form.email} onChange={handleChange}
                        onFocus={() => setFocused("email")} onBlur={() => setFocused("")}
                        className={`${inputBase} ${inputFocus("email")}`} />
                    </div>
                  </div>

                  <div>
                    <label className={`block text-xs font-semibold mb-1 ${darkMode ? "text-green-300" : "text-green-800"}`}>📌 Subject</label>
                    <input type="text" name="subject" placeholder="What's this about?"
                      value={form.subject} onChange={handleChange}
                      onFocus={() => setFocused("subject")} onBlur={() => setFocused("")}
                      className={`${inputBase} ${inputFocus("subject")}`} />
                  </div>

                  <div>
                    <label className={`block text-xs font-semibold mb-1 ${darkMode ? "text-green-300" : "text-green-800"}`}>💬 Message</label>
                    <textarea name="message" rows={5} placeholder="Tell me how I can help..." required
                      value={form.message} onChange={handleChange}
                      onFocus={() => setFocused("message")} onBlur={() => setFocused("")}
                      className={`${inputBase} ${inputFocus("message")} resize-none`} />
                  </div>

                  <button type="submit" className="btn-eco w-full py-3 text-sm font-semibold">
                    🌿 Send Message
                  </button>
                </form>

                <div className="flex items-center gap-3 my-4">
                  <div className={`flex-1 h-px ${darkMode ? "bg-gray-700" : "bg-green-100"}`} />
                  <span className={`text-xs ${sub}`}>or email directly</span>
                  <div className={`flex-1 h-px ${darkMode ? "bg-gray-700" : "bg-green-100"}`} />
                </div>

                <a href="mailto:awanitsingh8873@gmail.com"
                  className="btn-outline-eco w-full py-2.5 text-sm text-center block">
                  ✉️ awanitsingh8873@gmail.com
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ContactModal;
