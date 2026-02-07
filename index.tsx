
import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { GoogleGenAI, Type } from "@google/genai";
import { 
  Zap, 
  Palette, 
  Rocket, 
  Loader2, 
  Copy, 
  Check, 
  ArrowRight,
  RefreshCcw,
  Star,
  Shield,
  Layers
} from 'lucide-react';

// --- Types ---
interface BrandIdentity {
  name: string;
  tagline: string;
  colors: { hex: string; name: string }[];
  description: string;
  voice: string;
  keywords: string[];
}

// --- App Component ---
const App = () => {
  const [loading, setLoading] = useState(false);
  const [identity, setIdentity] = useState<BrandIdentity | null>(null);
  const [formData, setFormData] = useState({
    idea: '',
    industry: '',
    vibe: 'Modern & Professional'
  });
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const generateBrand = async () => {
    if (!formData.idea || !formData.industry) return;
    setLoading(true);
    
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `Create a high-impact brand identity for a startup or business with these details:
      Core Idea: ${formData.idea}
      Industry: ${formData.industry}
      Tone/Vibe: ${formData.vibe}
      
      You must return valid JSON in this exact structure:
      {
        "name": "One strong brand name",
        "tagline": "A short, punchy catchphrase",
        "colors": [{"hex": "#HEXCODE", "name": "Color Name"}], // Provide exactly 4 colors
        "description": "2-sentence mission statement",
        "voice": "Description of the brand's tone of voice",
        "keywords": ["5", "distinct", "brand", "attribute", "keywords"]
      }`;

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              tagline: { type: Type.STRING },
              colors: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    hex: { type: Type.STRING },
                    name: { type: Type.STRING }
                  },
                  required: ["hex", "name"]
                }
              },
              description: { type: Type.STRING },
              voice: { type: Type.STRING },
              keywords: { type: Type.ARRAY, items: { type: Type.STRING } }
            },
            required: ["name", "tagline", "colors", "description", "voice", "keywords"]
          }
        }
      });

      const data = JSON.parse(response.text);
      setIdentity(data);
    } catch (err) {
      console.error(err);
      alert("Failed to manifest brand. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="relative min-h-screen px-4 py-16 md:py-24 max-w-6xl mx-auto z-10">
      {/* Background Blobs */}
      <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/20 blur-[120px] rounded-full -z-20 animate-blob"></div>
      <div className="fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-pink-600/10 blur-[120px] rounded-full -z-20 animate-blob" style={{ animationDelay: '2s' }}></div>

      {/* Header */}
      <header className="text-center mb-16 space-y-4">
        <h1 className="text-6xl md:text-8xl font-black heading-font tracking-tighter text-white pt-8">
          Brand<span className="text-indigo-400">Craft</span>
        </h1>
        <p className="text-slate-400 text-lg md:text-xl max-w-xl mx-auto font-medium">
          Automating the first step of your journey. One prompt, one brand identity, zero friction.
        </p>
      </header>

      {/* Main Container */}
      {!identity ? (
        <div className="glass p-8 md:p-12 rounded-[2.5rem] max-w-2xl mx-auto shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 brand-gradient"></div>
          
          <div className="space-y-8">
            <div className="space-y-3">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Your Vision</label>
              <textarea 
                rows={2}
                placeholder="What are you building? (e.g. A privacy-focused smart home hub)"
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all text-white placeholder:text-slate-600 resize-none"
                value={formData.idea}
                onChange={e => setFormData({...formData, idea: e.target.value})}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Industry</label>
                <input 
                  type="text" 
                  placeholder="e.g. Fintech, Web3, Health"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all text-white placeholder:text-slate-600"
                  value={formData.industry}
                  onChange={e => setFormData({...formData, industry: e.target.value})}
                />
              </div>
              <div className="space-y-3">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Vibe</label>
                <select 
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all text-white appearance-none cursor-pointer"
                  value={formData.vibe}
                  onChange={e => setFormData({...formData, vibe: e.target.value})}
                >
                  <option className="bg-slate-900">Modern & Professional</option>
                  <option className="bg-slate-900">Aggressive & Disruptive</option>
                  <option className="bg-slate-900">Friendly & Approachable</option>
                  <option className="bg-slate-900">Luxurious & Elegant</option>
                  <option className="bg-slate-900">Experimental & Funky</option>
                </select>
              </div>
            </div>

            <button 
              onClick={generateBrand}
              disabled={loading || !formData.idea}
              className="w-full py-5 brand-gradient rounded-2xl font-black text-xl flex items-center justify-center gap-3 hover:brightness-110 active:scale-95 transition-all disabled:opacity-30 disabled:pointer-events-none shadow-2xl shadow-indigo-500/20"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" /> MANIFESTING...
                </>
              ) : (
                <>
                  CRAFT MY IDENTITY <Rocket size={20} />
                </>
              )}
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <button 
              onClick={() => setIdentity(null)}
              className="flex items-center gap-2 text-slate-500 hover:text-white transition-colors font-bold text-xs uppercase tracking-widest"
            >
              <RefreshCcw size={14} /> Back to Lab
            </button>
            <div className="flex items-center gap-3">
              {/* Removed AI-Generated Identity badge */}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Column: Visual Brand */}
            <div className="lg:col-span-8 space-y-8">
              <div className="glass rounded-[2.5rem] p-10 md:p-16 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 blur-[80px] rounded-full"></div>
                
                <div className="relative space-y-12">
                  <header className="space-y-4">
                    <h2 className="text-8xl md:text-[10rem] font-black heading-font tracking-tighter text-white leading-none">
                      {identity.name}
                    </h2>
                    <p className="text-2xl md:text-3xl font-medium text-gradient italic">
                      "{identity.tagline}"
                    </p>
                  </header>

                  <div className="grid md:grid-cols-2 gap-12 pt-8 border-t border-white/5">
                    <div className="space-y-4">
                      <h4 className="flex items-center gap-2 text-slate-500 font-bold uppercase tracking-widest text-xs">
                        <Shield size={14} /> Brand Mission
                      </h4>
                      <p className="text-xl text-slate-300 leading-relaxed">
                        {identity.description}
                      </p>
                    </div>
                    <div className="space-y-4">
                      <h4 className="flex items-center gap-2 text-slate-500 font-bold uppercase tracking-widest text-xs">
                        <Layers size={14} /> Voice & Tone
                      </h4>
                      <p className="text-xl text-slate-300 leading-relaxed">
                        {identity.voice}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tag Cloud */}
              <div className="flex flex-wrap gap-4">
                {identity.keywords.map(kw => (
                  <div key={kw} className="glass px-6 py-3 rounded-2xl text-slate-400 font-bold text-sm tracking-wide border-white/5">
                    #{kw.toLowerCase()}
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column: Assets */}
            <div className="lg:col-span-4 space-y-8">
              {/* Palette */}
              <div className="glass rounded-[2.5rem] p-8 shadow-xl">
                <h3 className="flex items-center gap-2 text-slate-500 font-bold uppercase tracking-widest text-xs mb-8">
                  <Palette size={16} /> Visual DNA
                </h3>
                <div className="space-y-4">
                  {identity.colors.map(color => (
                    <div 
                      key={color.hex} 
                      onClick={() => copyToClipboard(color.hex, color.hex)}
                      className="group flex items-center justify-between p-3 rounded-2xl hover:bg-white/5 transition-all cursor-pointer border border-transparent hover:border-white/10"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl shadow-2xl border border-white/10" style={{ background: color.hex }}></div>
                        <div>
                          <div className="text-sm font-bold text-white uppercase tracking-tight">{color.name}</div>
                          <div className="text-xs font-mono text-slate-500">{color.hex}</div>
                        </div>
                      </div>
                      <div className="text-slate-600 group-hover:text-indigo-400 transition-colors">
                        {copiedId === color.hex ? <Check size={18} /> : <Copy size={18} />}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Summary Card */}
              <div className="bg-indigo-600 rounded-[2.5rem] p-8 text-white shadow-2xl shadow-indigo-500/20">
                <h3 className="text-xl font-black heading-font mb-4">Ready to launch?</h3>
                <p className="text-indigo-100 mb-8 font-medium leading-relaxed">
                  Your brand identity is the foundation. Now, go build the future.
                </p>
                <button 
                  onClick={() => window.print()}
                  className="w-full py-4 bg-white text-indigo-600 rounded-2xl font-black text-lg hover:bg-slate-100 transition-all flex items-center justify-center gap-2 shadow-lg"
                >
                  EXPORT BOARD
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="mt-24 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-slate-600 text-xs font-bold uppercase tracking-widest">
        <div>© 2025 BrandCraft // Build Faster</div>
        <div className="flex items-center gap-6">
          <a href="#" className="hover:text-white transition-colors">Privacy</a>
          <a href="#" className="hover:text-white transition-colors">Documentation</a>
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
        </div>
      </footer>
    </div>
  );
};

// --- Render ---
const root = createRoot(document.getElementById('root')!);
root.render(<App />);
