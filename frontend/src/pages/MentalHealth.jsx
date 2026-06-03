import React, {
  useState,
  useEffect
} from 'react';

import api from '../services/api';

const MentalHealth = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'ai',
      text: "Halo Erwi, saya AI Wellness Guide Anda. Berdasarkan aktivitas Anda hari ini, tingkat stres Anda terlihat sedikit meningkat. Apakah Anda ingin berbagi apa yang sedang Anda rasakan saat ini?",
      time: '14:02'
    },
    {
      id: 2,
      sender: 'user',
      text: "Iya, pekerjaan hari ini cukup menguras tenaga dan saya merasa agak cemas tentang deadline besok.",
      time: '14:05'
    }
  ]);

  const [inputText, setInputText] = useState('');

  const [loading, setLoading] =
  useState(false);

  const [history, setHistory] =
    useState([]);

  const handleSendMessage =
  async () => {

    if (!inputText.trim())
      return;

    try {

      setLoading(true);

      const userMessage = {
        id: Date.now(),
        sender: "user",
        text: inputText,
        time:
          new Date().toLocaleTimeString(
            [],
            {
              hour: "2-digit",
              minute:
                "2-digit",
            }
          ),
      };

      setMessages(prev => [
        ...prev,
        userMessage,
      ]);

      const token =
        localStorage.getItem(
          "token"
        );

      const response =
        await api.post(
          "/mental/analyze",
          {
            text: inputText,
          },
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );

     const result =
        response.data.data;

      const aiMessage = {
        id: Date.now() + 1,
        sender: "ai",
        text:
      `🧠 Hasil Analisis Mental

      Status Mental: ${result.status}

      Confidence: ${result.confidence}%

      Detail:
      • Normal: ${result.breakdown.Normal}%
      • Anxious: ${result.breakdown.Anxious}%
      • Depressed: ${result.breakdown.Depressed}%`,
        time:
          new Date().toLocaleTimeString(
            [],
            {
              hour: "2-digit",
              minute: "2-digit",
            }
          ),
      };

      setMessages(prev => [
        ...prev,
        aiMessage,
        
      ]);

      setInputText("");

      fetchHistory();

    } catch (error) {

      alert(
        error.response?.data
          ?.message ||
          "Analisis gagal"
      );

    } finally {

      setLoading(false);

    }
};

    useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const token =
        localStorage.getItem(
          "token"
        );

      const response =
        await api.get(
          "/mental/history",
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );

      setHistory(
        response.data.data
      );
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex gap-6 h-[calc(100vh-120px)] animate-in fade-in duration-700">
      
      {/* BAGIAN KIRI: Chat AI */}
      <div className="flex-1 bg-white rounded-[32px] border border-slate-100 shadow-sm flex flex-col overflow-hidden">
        {/* Header Chat */}
        <div className="p-6 border-b border-slate-50 flex justify-between items-center bg-white">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 p-2 rounded-xl text-primary">
              <span className="material-symbols-outlined">psychology_alt</span>
            </div>
            <div>
              <h3 className="font-bold text-on-surface">AI Mental Wellness Guide</h3>
              <p className="text-[10px] text-green-500 font-bold flex items-center gap-1 uppercase tracking-widest">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span> AI Analysis Aktif
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <button className="p-2 text-slate-400 hover:text-primary transition-colors">
              <span className="material-symbols-outlined">videocam</span>
            </button>
            <button className="p-2 text-slate-400 hover:text-primary transition-colors">
              <span className="material-symbols-outlined">settings</span>
            </button>
          </div>
        </div>

        {/* Isi Chat */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/30">
          <p className="text-center text-[10px] text-slate-400 font-bold uppercase tracking-widest">Hari Ini</p>
          
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} items-end gap-2`}>
              {msg.sender === 'ai' && (
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white mb-4">
                  <span className="material-symbols-outlined text-sm">smart_toy</span>
                </div>
              )}
              <div className={`max-w-[70%] p-4 rounded-2xl text-sm leading-relaxed ${
                msg.sender === 'user' 
                ? 'bg-primary text-white rounded-br-none' 
                : 'bg-white border border-slate-100 text-on-surface shadow-sm rounded-bl-none'
              }`}>
                {msg.text}
                <p className={`text-[10px] mt-2 ${msg.sender === 'user' ? 'text-white/60' : 'text-slate-400'}`}>
                  {msg.time}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Input Area */}
        <div className="p-6 bg-white border-t border-slate-50 flex items-center gap-4">
          <button className="text-slate-400"><span className="material-symbols-outlined">add_circle</span></button>
          <input 
            type="text" 
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Ceritakan perasaanmu..." 
            className="flex-1 border-none bg-slate-50 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20"
          />
          <button className="text-slate-400"><span className="material-symbols-outlined">sentiment_satisfied</span></button>
          <button
            onClick={
              handleSendMessage
            }
            disabled={loading}
            className="bg-primary text-white px-6 py-2 rounded-xl font-bold text-sm hover:opacity-90 transition-all">
            {loading
              ? "Analisis..."
              : "Kirim"}
          </button>
        </div>
      </div>

      {/* BAGIAN KANAN*/}
      <div className="w-[320px] flex flex-col gap-6 overflow-y-auto pr-2 custom-scrollbar">
        
        {/* Mood Tracker */}
        <div className="bg-white rounded-[32px] p-6 border border-slate-100 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h4 className="font-bold text-on-surface">Mood Tracker</h4>
            <span className="text-[9px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-bold uppercase">Live AI</span>
          </div>
          {/* Bar Chart */}
          <div className="flex items-end gap-2 h-20 mb-4">
            {[40, 60, 45, 50, 90, 70, 50].map((h, i) => (
              <div key={i} className={`flex-1 rounded-t-md ${i === 4 ? 'bg-primary' : 'bg-slate-100'}`} style={{height: `${h}%`}}></div>
            ))}
          </div>
          <p className="text-xs font-bold mb-1">Status: Cemas Ringan</p>
          <p className="text-[10px] text-slate-400 leading-relaxed">Puncak stres terdeteksi pada pukul 10:45 selama rapat kerja.</p>
        </div>

        {/* AI Health Insights */}
        <div className="bg-white rounded-[32px] p-6 border border-slate-100 shadow-sm">
          <h4 className="font-bold text-on-surface mb-4">AI Health Insights</h4>
          <div className="space-y-4">
            <div className="flex gap-3 items-start p-3 bg-orange-50 rounded-2xl border border-orange-100">
              <span className="material-symbols-outlined text-orange-500 text-sm">dark_mode</span>
              <div>
                <p className="text-[11px] font-bold">Tidur Kurang Optimal</p>
                <p className="text-[10px] text-slate-500">Hanya 5.5 jam semalam. Cobalah tidur sebelum jam 22:00.</p>
              </div>
            </div>
            <div className="flex gap-3 items-start p-3 bg-primary/5 rounded-2xl border border-primary/10">
              <span className="material-symbols-outlined text-primary text-sm">monitor_heart</span>
              <div>
                <p className="text-[11px] font-bold">Analisis HRV</p>
                <p className="text-[10px] text-slate-500">Variabilitas detak jantung Anda rendah hari ini. Perlu istirahat.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Jurnal Harian */}
        <div className="bg-white rounded-[32px] p-6 border border-slate-100 shadow-sm flex-1">
          <h4 className="font-bold text-on-surface mb-2">Jurnal Harian</h4>
          <p className="text-[10px] text-slate-400 mb-4">Simpan satu hal yang kamu syukuri hari ini untuk meningkatkan serotonin.</p>
          <textarea 
            className="w-full h-32 bg-slate-50 border-none rounded-2xl p-4 text-xs focus:ring-2 focus:ring-primary/20 resize-none" 
            placeholder="Tulis di sini..."
          ></textarea>
        </div>

        <div className="bg-white rounded-[32px] p-6 border border-slate-100 shadow-sm">
        <h4 className="font-bold mb-4">
          Riwayat Mental
        </h4>

        <div className="space-y-3">
          {history.map(item => (
            <div
              key={item.id}
              className="p-3 rounded-xl bg-slate-50"
            >
              <p className="text-xs font-semibold">
                {item.prediction}
              </p>

              <p className="text-[10px] text-slate-500 mt-1">
                {item.input_text}
              </p>

              <p className="text-[10px] text-primary mt-1">
                Score:
                {" "}
                {item.score}%
              </p>
            </div>
          ))}
        </div>
      </div>

        {/* Emergency Card */}
        <div className="bg-red-50 p-6 rounded-[32px] border border-red-100">
          <div className="flex items-center gap-2 text-red-600 mb-2">
            <span className="material-symbols-outlined text-sm">emergency</span>
            <p className="text-[11px] font-bold uppercase tracking-wider">Butuh bantuan segera?</p>
          </div>
          <button className="w-full bg-red-600 text-white py-3 rounded-xl text-xs font-bold shadow-md shadow-red-200">
            Hubungi 119 Ext 8
          </button>
        </div>

      </div>
    </div>
  );
};

export default MentalHealth;