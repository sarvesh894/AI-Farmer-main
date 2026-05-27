import { useNavigate } from "react-router-dom";

function Footer({ darkMode }) {
  const links = [
    { label: "Crop Recommendation", href: "/crop" },
    { label: "Fertilizer",          href: "/fertilizer" },
    { label: "Disease Detection",   href: "/disease" },
    { label: "Market Prices",       href: "/market" },
    { label: "Future Predictions",  href: "/future" },
    { label: "Soil Health",         href: "/soil" },
    { label: "Crop Calendar",       href: "/calendar" },
    { label: "History",             href: "/history" },
  ];

  const navigate = useNavigate();

  const handleNav = (href) => {
    navigate(href);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const socials = [
    { icon: "🐙", label: "GitHub",    href: "https://github.com/sarvesh894" },
    { icon: "💼", label: "LinkedIn",  href: "https://www.linkedin.com/in/sarvesh-mishra-b47a0b274/" },
    { icon: "💬", label: "WhatsApp",  href: "https://wa.me/919005429956" },
  ];

  return (
    <footer id="footer" className={`${darkMode ? "bg-gray-950 border-t border-green-900" : "bg-gradient-to-br from-green-900 via-emerald-900 to-green-950"} text-white`}>
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">

          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center text-xl shadow-lg">🌿</div>
              <span className="text-lg font-bold text-green-300">AI Farmer</span>
            </div>
            <p className="text-green-200/70 text-sm leading-relaxed mb-5">
              Empowering farmers with AI-driven crop recommendations, fertilizer guidance, and plant disease detection.
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-800/50 border border-green-700 text-green-300 text-xs font-medium mb-5">
              🌱 Sustainable Agriculture Initiative
            </div>
            <div className="flex gap-3">
              {socials.map((s, i) => (
                <a key={i} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label}
                  className="w-9 h-9 rounded-xl bg-green-800/50 hover:bg-green-700 border border-green-700 flex items-center justify-center text-base transition-all hover:-translate-y-1">
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-green-400 font-semibold text-sm uppercase tracking-wider mb-5">Quick Links</h4>
            <ul className="space-y-3">
              {links.map((l, i) => (
                <li key={i}>
                  <button onClick={() => handleNav(l.href)}
                    className="flex items-center gap-2 text-green-200/70 hover:text-green-300 text-sm transition-colors group bg-transparent border-none cursor-pointer p-0">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                    {l.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-green-400 font-semibold text-sm uppercase tracking-wider mb-5">Contact</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <span className="text-lg mt-0.5">✉️</span>
                <div>
                  <p className="text-green-400 text-xs font-semibold mb-0.5">Email</p>
                  <a href="mailto:sarveshmishra7617@gmail.com" className="text-green-200/70 hover:text-green-300 text-sm transition-colors">
                    sarveshmishra7617@gmail.com
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-lg mt-0.5">📞</span>
                <div>
                  <p className="text-green-400 text-xs font-semibold mb-0.5">Phone</p>
                  <a href="tel:+919005429956" className="text-green-200/70 hover:text-green-300 text-sm transition-colors">
                    +91 9005429956
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-lg mt-0.5">📍</span>
                <div>
                  <p className="text-green-400 text-xs font-semibold mb-0.5">Address</p>
                  <p className="text-green-200/70 text-sm">
                    Galgotia University<br />Noida, India
                  </p>
                </div>
              </li>
            </ul>
          </div>

          {/* Newsletter + Stats */}
          <div>
            <h4 className="text-green-400 font-semibold text-sm uppercase tracking-wider mb-5">Stay Updated</h4>
            <p className="text-green-200/70 text-sm mb-4">Get the latest updates on agricultural AI and farming insights.</p>
            <div className="flex flex-col gap-2 mb-6">
              <input type="email" placeholder="your@email.com"
                className="px-4 py-2.5 rounded-xl bg-green-800/40 border border-green-700 text-white placeholder-green-500 text-sm focus:outline-none focus:border-green-400 transition-colors" />
              <button className="btn-eco py-2.5 text-sm">🌾 Subscribe</button>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {[
                { value: "38+", label: "Diseases" },
                { value: "22+", label: "Crops" },
                { value: "95%+", label: "Accuracy" },
              ].map((s, i) => (
                <div key={i} className="text-center p-2 rounded-xl bg-green-800/30 border border-green-800">
                  <div className="text-green-300 font-bold text-sm">{s.value}</div>
                  <div className="text-green-500 text-xs">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-green-800/50">
        <div className="max-w-7xl mx-auto px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-green-500 text-xs">© 2026 AI Farmer. All rights reserved.</p>
          <p className="text-green-500 text-xs">
            Developed with 🌿 by{" "}
            <a href="https://github.com/sarvesh894" target="_blank" rel="noopener noreferrer"
              className="text-green-400 hover:text-green-300 transition-colors">
              Sarvesh Mish
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
