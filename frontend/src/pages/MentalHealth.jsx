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

  const [journalText, setJournalText] = useState("");
  const [journalSaving, setJournalSaving] = useState(false);

  const handleSaveJournal = async () => {
    if (!journalText.trim()) return;

    try {
      setJournalSaving(true);
      const token = localStorage.getItem("token");
      const response = await api.post(
        "/mental/analyze",
        {
          text: journalText,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const result = response.data.data;

      const journalUserMessage = {
        id: Date.now(),
        sender: "user",
        text: `📝 Jurnal Harian: ${journalText}`,
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      const journalAiMessage = {
        id: Date.now() + 1,
        sender: "ai",
        text: `🧠 Hasil Analisis Jurnal Anda

Status Mental: ${result.status}
Confidence: ${result.confidence}%

Detail:
• Normal: ${result.breakdown.Normal}%
• Anxious: ${result.breakdown.Anxious}%
• Depressed: ${result.breakdown.Depressed}%`,
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      setMessages((prev) => [...prev, journalUserMessage, journalAiMessage]);
      setJournalText("");
      alert("Jurnal harian berhasil disimpan dan dianalisis!");
      fetchHistory();
    } catch (error) {
      alert(
        error.response?.data?.message || "Gagal menganalisis jurnal"
      );
    } finally {
      setJournalSaving(false);
    }
  };

  const latestMood = history.length > 0 ? history[0] : null;

  const defaultHeights = [40, 50, 45, 50, 60, 55, 60];
  const chartItems = history.length > 0
    ? [...history].slice(0, 7).reverse().map(item => {
        const score = parseFloat(item.score || 0);
        const height = isNaN(score) ? 50 : Math.max(10, Math.min(100, Math.round(score)));
        let colorClass = "bg-slate-200";
        if (item.prediction === "Normal") colorClass = "bg-primary";
        else if (item.prediction === "Anxious") colorClass = "bg-orange-400";
        else if (item.prediction === "Depressed") colorClass = "bg-red-500";
        return { height, colorClass, prediction: item.prediction, score };
      })
    : defaultHeights.map(h => ({ height: h, colorClass: "bg-slate-100", prediction: "Normal", score: h }));

  const moodStatusText = latestMood
    ? `Status: ${latestMood.prediction === 'Normal' ? 'Stabil / Normal' : latestMood.prediction === 'Anxious' ? 'Cemas' : 'Depresi'}`
    : "Status: Belum Ada Data";

  const moodDescText = latestMood
    ? `Tingkat keyakinan analisis terakhir sebesar ${latestMood.score}% terdeteksi sebagai ${latestMood.prediction}.`
    : "Tulis jurnal harian atau pesan obrolan pertama Anda untuk melacak mood.";

  const getInsights = () => {
    if (!latestMood) {
      return [
        {
          title: "Mulai Analisis",
          desc: "Tuliskan perasaanmu atau simpan jurnal hari ini agar AI dapat memberikan saran kesehatan mental.",
          icon: "info",
          bgClass: "bg-primary/5 border-primary/10",
          iconClass: "text-primary"
        },
        {
          title: "Tips Tidur Sehat",
          desc: "Tidur 7-8 jam per hari membantu menjaga keseimbangan emosi dan kesehatan mental.",
          icon: "dark_mode",
          bgClass: "bg-orange-50 border-orange-100",
          iconClass: "text-orange-500"
        }
      ];
    }
    
    if (latestMood.prediction === "Anxious") {
      return [
        {
          title: "Latihan Pernapasan (4-7-8)",
          desc: "Tarik napas 4 detik, tahan 7 detik, embuskan 8 detik untuk meredakan kecemasan dengan cepat.",
          icon: "air",
          bgClass: "bg-orange-50 border-orange-100",
          iconClass: "text-orange-500"
        },
        {
          title: "Hindari Kafein Berlebih",
          desc: "Kafein dapat memicu stimulasi saraf berlebih yang meningkatkan perasaan cemas/gelisah.",
          icon: "local_cafe",
          bgClass: "bg-red-50 border-red-100",
          iconClass: "text-red-500"
        }
      ];
    }
    
    if (latestMood.prediction === "Depressed") {
      return [
        {
          title: "Lakukan Aktivitas Fisik Ringan",
          desc: "Jalan santai 15 menit dapat menstimulasi pelepasan hormon endorfin dan serotonin.",
          icon: "directions_run",
          bgClass: "bg-red-50 border-red-100",
          iconClass: "text-red-500"
        },
        {
          title: "Bicarakan dengan Orang Terdekat",
          desc: "Menghubungi teman dekat atau keluarga terpercaya dapat mengurangi beban pikiran Anda.",
          icon: "group",
          bgClass: "bg-primary/5 border-primary/10",
          iconClass: "text-primary"
        }
      ];
    }
    
    return [
      {
        title: "Kondisi Mental Stabil",
        desc: "Kesehatan mental Anda tergolong stabil dan normal. Pertahankan kebiasaan berpikir positif!",
        icon: "sentiment_very_satisfied",
        bgClass: "bg-emerald-50 border-emerald-100",
        iconClass: "text-emerald-500"
      },
      {
        title: "Latih Mindfulness",
        desc: "Lakukan meditasi 5-10 menit per hari untuk melatih fokus dan ketenangan pikiran.",
        icon: "self_improvement",
        bgClass: "bg-primary/5 border-primary/10",
        iconClass: "text-primary"
      }
    ];
  };

  const insights = getInsights();

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
            {chartItems.map((item, i) => (
              <div 
                key={i} 
                className={`flex-1 rounded-t-md ${item.colorClass} transition-all duration-500`} 
                style={{ height: `${item.height}%` }}
                title={`${item.prediction}: ${item.score}%`}
              ></div>
            ))}
          </div>
          <p className="text-xs font-bold mb-1">{moodStatusText}</p>
          <p className="text-[10px] text-slate-400 leading-relaxed">{moodDescText}</p>
        </div>

        {/* AI Health Insights */}
        <div className="bg-white rounded-[32px] p-6 border border-slate-100 shadow-sm">
          <h4 className="font-bold text-on-surface mb-4">AI Health Insights</h4>
          <div className="space-y-4">
            {insights.map((insight, i) => (
              <div key={i} className={`flex gap-3 items-start p-3 rounded-2xl border ${insight.bgClass}`}>
                <span className={`material-symbols-outlined ${insight.iconClass} text-sm`}>{insight.icon}</span>
                <div>
                  <p className="text-[11px] font-bold">{insight.title}</p>
                  <p className="text-[10px] text-slate-500">{insight.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Jurnal Harian */}
        <div className="bg-white rounded-[32px] p-6 border border-slate-100 shadow-sm flex-1 flex flex-col">
          <h4 className="font-bold text-on-surface mb-2">Jurnal Harian</h4>
          <p className="text-[10px] text-slate-400 mb-4">Simpan satu hal yang kamu syukuri hari ini untuk meningkatkan serotonin.</p>
          <textarea 
            value={journalText}
            onChange={(e) => setJournalText(e.target.value)}
            className="w-full h-32 bg-slate-50 border-none rounded-2xl p-4 text-xs focus:ring-2 focus:ring-primary/20 resize-none" 
            placeholder="Tulis di sini..."
          ></textarea>
          <button
            onClick={handleSaveJournal}
            disabled={journalSaving || !journalText.trim()}
            className="w-full mt-4 bg-primary text-white py-3 rounded-2xl font-bold text-xs hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {journalSaving ? "Menganalisis..." : "Simpan & Analisis"}
          </button>
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