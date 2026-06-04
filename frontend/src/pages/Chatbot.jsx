import React, { useState, useEffect, useRef } from "react";
import api from "../services/api";

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  
  const messagesEndRef = useRef(null);

  const starterPrompts = [
    {
      text: "Bagaimana cara merawat kulit wajah yang berjerawat?",
      icon: "face",
      color: "text-emerald-500 bg-emerald-50",
    },
    {
      text: "Tips mengelola kecemasan di tempat kerja?",
      icon: "psychology",
      color: "text-orange-500 bg-orange-50",
    },
    {
      text: "Skincare rutin terbaik untuk pemula?",
      icon: "spa",
      color: "text-blue-500 bg-blue-50",
    },
  ];

  useEffect(() => {
    const userJson = localStorage.getItem("user");
    if (userJson) {
      setCurrentUser(JSON.parse(userJson));
    }
    fetchChatHistory();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const fetchChatHistory = async () => {
    try {
      const res = await api.get("/chatbot/history");
      if (res.data.success) {
        const historyData = res.data.data || [];
        const formatted = [];
        
        // Backend returns newest first (DESC), reverse to chronological (oldest first)
        const sorted = [...historyData].reverse();
        sorted.forEach((chat) => {
          formatted.push({
            id: `q-${chat.id}`,
            sender: "user",
            text: chat.question,
            time: chat.created_at,
          });
          formatted.push({
            id: `a-${chat.id}`,
            sender: "ai",
            text: chat.answer,
            time: chat.created_at,
          });
        });
        
        setMessages(formatted);
      }
    } catch (error) {
      console.error("Gagal mengambil riwayat chat:", error);
    }
  };

  const handleSendMessage = async (textToSend) => {
    const query = textToSend.trim();
    if (!query) return;

    // Append user message immediately
    const tempUserMsg = {
      id: `temp-u-${Date.now()}`,
      sender: "user",
      text: query,
      time: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, tempUserMsg]);
    setInputText("");
    setIsTyping(true);

    try {
      const res = await api.post("/chatbot/message", { message: query });
      if (res.data.success) {
        const aiAnswer = res.data.data.response || "Maaf, saya tidak dapat memproses permintaan Anda.";
        
        const tempAiMsg = {
          id: `temp-a-${Date.now()}`,
          sender: "ai",
          text: aiAnswer,
          time: new Date().toISOString(),
        };
        
        setMessages((prev) => [...prev, tempAiMsg]);
      }
    } catch (error) {
      console.error("Error sending chat:", error);
      const errorMsg = {
        id: `temp-err-${Date.now()}`,
        sender: "ai",
        text: "Koneksi terganggu. Gagal menghubungi AI Dermind. Coba lagi nanti.",
        time: new Date().toISOString(),
        isError: true,
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(inputText);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-180px)] max-h-[800px] bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden animate-in fade-in duration-500">
      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6 custom-scrollbar bg-slate-50/30">
        {messages.length === 0 && !isTyping ? (
          <div className="h-full flex flex-col justify-center items-center max-w-xl mx-auto text-center space-y-8 py-12">
            <div className="w-20 h-20 bg-primary/10 text-primary rounded-full flex items-center justify-center animate-bounce">
              <span className="material-symbols-outlined text-4xl">smart_toy</span>
            </div>
            
            <div>
              <h3 className="text-2xl font-bold text-on-surface font-manrope">Halo{currentUser ? `, ${currentUser.name}` : ""}!</h3>
              <p className="text-sm text-slate-400 mt-2">
                Saya adalah asisten kesehatan AI Dermind. Silakan tanyakan hal apa pun seputar kesehatan kulit, jerawat, kecemasan, stres, atau info kesehatan umum lainnya.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-3 w-full text-left">
              {starterPrompts.map((prompt, index) => (
                <button
                  key={index}
                  onClick={() => handleSendMessage(prompt.text)}
                  className="flex items-center gap-4 p-4 bg-white hover:bg-slate-50 border border-slate-100 rounded-2xl transition-all shadow-sm group hover:scale-[1.01]"
                >
                  <div className={`p-2.5 rounded-xl ${prompt.color} shrink-0`}>
                    <span className="material-symbols-outlined text-lg block">{prompt.icon}</span>
                  </div>
                  <span className="text-xs font-semibold text-slate-600 flex-1 leading-snug">{prompt.text}</span>
                  <span className="material-symbols-outlined text-slate-300 text-sm group-hover:text-primary transition-colors">
                    arrow_forward
                  </span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-6 max-w-4xl mx-auto">
            {messages.map((msg) => {
              const isAi = msg.sender === "ai";
              return (
                <div
                  key={msg.id}
                  className={`flex gap-4 items-start ${
                    isAi ? "justify-start" : "justify-end"
                  }`}
                >
                  {isAi && (
                    <div className="w-9 h-9 bg-primary/10 text-primary rounded-xl flex items-center justify-center shrink-0 border border-primary/5 shadow-sm">
                      <span className="material-symbols-outlined text-lg leading-none block">smart_toy</span>
                    </div>
                  )}
                  
                  <div className={`max-w-[75%] ${isAi ? "" : "text-right"}`}>
                    <div
                      className={`inline-block px-5 py-3.5 rounded-[24px] text-sm leading-relaxed text-left ${
                        isAi
                          ? msg.isError
                            ? "bg-red-50 text-red-600 border border-red-100 rounded-tl-sm"
                            : "bg-white text-on-surface border border-slate-100 shadow-sm rounded-tl-sm"
                          : "bg-primary text-white shadow-md shadow-primary/5 rounded-tr-sm"
                      }`}
                      style={{ whiteSpace: "pre-line" }}
                    >
                      {msg.text}
                    </div>
                    
                    <span className="block text-[10px] text-slate-300 font-bold uppercase mt-1 px-1">
                      {new Date(msg.time).toLocaleTimeString("id-ID", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>

                  {!isAi && (
                    <img
                      src={
                        currentUser?.avatar
                          ? currentUser.avatar.startsWith("http")
                            ? currentUser.avatar
                            : `${import.meta.env.VITE_API_URL || "http://localhost:5002"}${currentUser.avatar}`
                          : `https://i.pravatar.cc/100?u=${currentUser?.id || "user"}`
                      }
                      className="w-9 h-9 rounded-xl object-cover shrink-0 shadow-sm border border-slate-100"
                      alt="User avatar"
                    />
                  )}
                </div>
              );
            })}

            {isTyping && (
              <div className="flex gap-4 items-start justify-start">
                <div className="w-9 h-9 bg-primary/10 text-primary rounded-xl flex items-center justify-center shrink-0 border border-primary/5">
                  <span className="material-symbols-outlined text-lg leading-none block">smart_toy</span>
                </div>
                <div className="bg-white px-5 py-4 rounded-[24px] rounded-tl-sm border border-slate-100 shadow-sm">
                  <div className="flex gap-1.5 items-center">
                    <span className="w-2 h-2 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></span>
                    <span className="w-2 h-2 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></span>
                    <span className="w-2 h-2 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></span>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input Box */}
      <div className="p-4 md:p-6 bg-white border-t border-slate-100 flex items-center gap-4">
        <div className="flex-1 bg-slate-50 border-none rounded-2xl px-5 py-3.5 focus-within:ring-1 focus-within:ring-primary/40 transition-all flex items-center gap-3">
          <input
            type="text"
            placeholder="Tanyakan gejala kulit, stress, atau tips kesehatan..."
            className="w-full bg-transparent border-none p-0 focus:ring-0 text-sm font-medium text-on-surface placeholder-slate-400"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyPress}
            disabled={isTyping}
          />
        </div>
        <button
          onClick={() => handleSendMessage(inputText)}
          disabled={!inputText.trim() || isTyping}
          className={`h-12 w-12 rounded-2xl flex items-center justify-center shrink-0 transition-all ${
            inputText.trim() && !isTyping
              ? "bg-primary text-white shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95"
              : "bg-slate-100 text-slate-300 cursor-not-allowed"
          }`}
        >
          <span className="material-symbols-outlined text-lg leading-none block transform translate-x-0.5 -translate-y-0.5 rotate-45">
            send
          </span>
        </button>
      </div>
    </div>
  );
};

export default Chatbot;
