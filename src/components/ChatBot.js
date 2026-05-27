import { useState, useRef, useEffect } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";

const GEMINI_KEY = process.env.REACT_APP_GEMINI_API_KEY || "AIzaSyBcjeMPLmK8zA8iuGNj1C2toTVytV-IS7M";

const SYSTEM_PROMPT = `You are an expert AI farming assistant for the "AI Farmer" platform.
Help farmers with crop recommendations, fertilizer advice, plant disease identification,
soil health, irrigation, market prices, and sustainable farming practices.
Keep responses concise, practical, and farmer-friendly. Use emojis.
Focus on Indian agriculture context. Suggest using the platform's AI tools when relevant.
If asked about non-farming topics, politely redirect to farming.`;

// Fallback knowledge base when no API key
function getFallbackResponse(msg) {
  const m = msg.toLowerCase();
  if (m.match(/hi|hello|hey|namaste/)) return "👋 Hello! I'm your AI Farming Assistant. Ask me about crops, fertilizers, diseases, soil, or market prices!";
  if (m.match(/rice|paddy|dhan/)) return "🌾 Rice needs: N:60-120, P:30-60, K:30-60, Temp:22-35°C, Humidity:75-90%, Rainfall:150-300mm, pH:5.5-7.0. Plant in June-July (Kharif season).";
  if (m.match(/wheat|gehun/)) return "🌿 Wheat needs: N:60-120, P:30-60, K:30-60, Temp:10-25°C, Humidity:40-70%, Rainfall:50-150mm, pH:6.0-7.5. Plant in Oct-Nov (Rabi season).";
  if (m.match(/fertilizer|urea|dap|npk|khad/)) return "💧 Fertilizer guide:\n- Low N → Urea\n- Low N+P → DAP\n- Low K → MOP\n- Balanced → NPK 17-17-17\n- Organic → Compost/Vermicompost\nAlways do a soil test first!";
  if (m.match(/disease|blight|rust|fungus|spot|rot/)) return "🔬 Common diseases:\n- Early Blight → Chlorothalonil\n- Late Blight → Mancozeb\n- Powdery Mildew → Neem oil\n- Rust → Azoxystrobin\nUpload a photo in Disease Detection for AI diagnosis!";
  if (m.match(/soil|ph|nitrogen|phosphorus|potassium/)) return "🧪 Soil tips:\n- Ideal pH: 6-7\n- Low N → Urea/compost\n- Low P → DAP/SSP\n- Low K → MOP\n- Acidic → Add lime\n- Alkaline → Add sulfur\nUse our Soil Health Calculator!";
  if (m.match(/water|irrigation|drip|sprinkler/)) return "💧 Irrigation:\n- Drip → 40-60% water saving\n- Sprinkler → Wheat, vegetables\n- Flood → Rice\nWater in early morning. Overwatering causes root rot.";
  if (m.match(/price|market|mandi|sell|rate/)) return "📈 Market tips:\n- Check live prices in Market section\n- Sell after harvest when supply is low\n- Rice peaks Jan-Feb\n- Wheat peaks May-June\n- Store properly for better prices";
  if (m.match(/bye|thanks|thank/)) return "🌿 Happy farming! Come back anytime. Good luck! 🌾";
  return "🌱 Ask me about crops, fertilizers, diseases, soil health, irrigation, or market prices. Or use our AI tools for precise predictions!";
}

async function getGeminiResponse(userMessage, history) {
  if (!GEMINI_KEY) return getFallbackResponse(userMessage);
  try {
    const genAI = new GoogleGenerativeAI(GEMINI_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const chat = model.startChat({
      history: [
        { role: "user", parts: [{ text: SYSTEM_PROMPT }] },
        { role: "model", parts: [{ text: "I'm your AI Farming Assistant! Ready to help with crops, fertilizers, diseases, and more." }] },
        ...history.slice(-6).map(m => ({
          role: m.role === "user" ? "user" : "model",
          parts: [{ text: m.text }],
        })),
      ],
    });
    const result = await chat.sendMessage(userMessage);
    return result.response.text();
  } catch (e) {
    console.error("Gemini error:", e);
    return getFallbackResponse(userMessage);
  }
}

export default function ChatBot({ darkMode }) {
  const [open, setOpen]         = useState(false);
  const [messages, setMessages] = useState([
    { role: "bot", text: "👋 Hi! I'm your AI Farming Assistant powered by Gemini AI. Ask me anything about crops, fertilizers, diseases, or farming tips!" }
  ]);
  const [input, setInput]   = useState("");
  const [typing, setTyping] = useState(false);
  const bottomRef           = useRef();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  const send = async () => {
    if (!input.trim()) return;
    const userMsg = input.trim();
    setInput("");
    const newMessages = [...messages, { role: "user", text: userMsg }];
    setMessages(newMessages);
    setTyping(true);
    try {
      const response = await getGeminiResponse(userMsg, messages);
      setMessages(prev => [...prev, { role: "bot", text: response }]);
    } catch {
      setMessages(prev => [...prev, { role: "bot", text: "⚠️ Something went wrong. Please try again." }]);
    } finally {
      setTyping(false);
    }
  };

  const handleKey = (e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } };

  const suggestions = ["Best crop for Punjab?", "Fertilizer for wheat", "Rice disease treatment", "Soil pH tips"];

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        className={`fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full shadow-2xl flex items-center justify-center text-2xl transition-all hover:scale-110 ${
          open ? "bg-red-500 hover:bg-red-600" : "bg-gradient-to-br from-green-500 to-emerald-600 hover:shadow-green-500/40"
        }`}
        aria-label="Open farming assistant"
      >
        {open ? "✕" : "🌿"}
      </button>

      {open && (
        <div className={`fixed bottom-24 right-6 z-50 w-80 sm:w-96 rounded-3xl shadow-2xl flex flex-col overflow-hidden border ${
          darkMode ? "bg-gray-900 border-green-900" : "bg-white border-green-100"
        }`} style={{ height: "480px" }}>

          <div className="bg-gradient-to-r from-green-500 to-emerald-600 px-4 py-3 flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center text-xl">🌾</div>
            <div>
              <p className="text-white text-sm font-semibold">AI Farming Assistant</p>
              <p className="text-green-100 text-xs flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-green-300 animate-pulse" />
                {GEMINI_KEY ? "Powered by Gemini AI" : "Knowledge Base Mode"}
              </p>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                {m.role === "bot" && (
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center text-sm mr-2 flex-shrink-0 mt-0.5">🌿</div>
                )}
                <div className={`max-w-[80%] px-3 py-2 rounded-2xl text-xs leading-relaxed whitespace-pre-line ${
                  m.role === "user"
                    ? "bg-gradient-to-br from-green-500 to-emerald-600 text-white rounded-br-sm"
                    : darkMode ? "bg-gray-800 text-gray-200 rounded-bl-sm" : "bg-green-50 text-gray-700 rounded-bl-sm"
                }`}>
                  {m.text}
                </div>
              </div>
            ))}
            {typing && (
              <div className="flex justify-start">
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center text-sm mr-2">🌿</div>
                <div className={`px-3 py-2 rounded-2xl rounded-bl-sm ${darkMode ? "bg-gray-800" : "bg-green-50"}`}>
                  <div className="flex gap-1 items-center h-4">
                    {[0,1,2].map(i => (
                      <div key={i} className="w-1.5 h-1.5 rounded-full bg-green-500 animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
                    ))}
                  </div>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {messages.length <= 1 && (
            <div className="px-3 pb-2 flex gap-1.5 flex-wrap">
              {suggestions.map((s, i) => (
                <button key={i} onClick={() => setInput(s)}
                  className={`text-xs px-2.5 py-1 rounded-full border transition-all ${
                    darkMode ? "border-green-800 text-green-400 hover:bg-green-900/40" : "border-green-200 text-green-700 hover:bg-green-50"
                  }`}>
                  {s}
                </button>
              ))}
            </div>
          )}

          <div className={`p-3 border-t flex gap-2 ${darkMode ? "border-green-900" : "border-green-100"}`}>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder="Ask about crops, soil, diseases..."
              className={`flex-1 text-xs px-3 py-2 rounded-xl outline-none border transition-all ${
                darkMode ? "bg-gray-800 border-gray-700 text-gray-200 placeholder-gray-500 focus:border-green-600" : "bg-green-50 border-green-100 text-gray-700 placeholder-gray-400 focus:border-green-400"
              }`}
            />
            <button onClick={send} disabled={!input.trim() || typing}
              className="w-8 h-8 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white text-sm disabled:opacity-40 hover:shadow-md transition-all">
              ➤
            </button>
          </div>
        </div>
      )}
    </>
  );
}
