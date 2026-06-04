import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [showConsultModal, setShowConsultModal] = useState(false); 
  
  const [user] = useState(() => {
    const userJson = localStorage.getItem("user");
    return userJson ? JSON.parse(userJson) : null;
  });

  const menu = [
    { name: 'Dashboard', path: '/dashboard', icon: 'dashboard' },
    { name: 'Articles', path: '/articles', icon: 'article' },
    { name: 'Community', path: '/community', icon: 'groups' },
    { name: 'AI Mental Health', path: '/mental', icon: 'psychology' },
    { name: 'AI Skin Detection', path: '/skin', icon: 'biotech' },
    { name: 'AI Chatbot', path: '/chatbot', icon: 'smart_toy' },
    { name: 'Events', path: '/events', icon: 'calendar_month' },
    { name: 'Profile', path: '/profile', icon: 'person' },
  ];

  if (user && user.role === 'admin') {
    menu.push({ name: 'Admin Panel', path: '/admin', icon: 'admin_panel_settings' });
  }

  const startConsult = (path) => {
    setShowConsultModal(false);
    navigate(path);
  };

  return (
    <>
      {/* ===== MODAL KONSULTASI ===== */}
      {showConsultModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
          {/* Backdrop Blur */}
          <div 
            className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300" 
            onClick={() => setShowConsultModal(false)}
          ></div>
          
          {/* Box Modal */}
          <div className="bg-white rounded-[40px] p-10 max-w-md w-full relative z-10 animate-in zoom-in-95 duration-300 shadow-2xl text-center">
            <button 
              onClick={() => setShowConsultModal(false)}
              className="absolute top-6 right-6 text-slate-300 hover:text-primary transition-colors"
            >
              <span className="material-symbols-outlined">close</span>
            </button>

            <div className="w-20 h-20 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="material-symbols-outlined text-4xl">medical_services</span>
            </div>
            
            <h3 className="text-2xl font-manrope font-bold text-on-surface mb-2">Mulai Konsultasi</h3>
            <p className="text-slate-400 text-sm mb-8">Pilih jenis bantuan medis yang Anda butuhkan saat ini.</p>

            <div className="space-y-4">
              <button 
                onClick={() => startConsult('/skin')}
                className="w-full flex items-center gap-4 p-5 bg-slate-50 rounded-[24px] border border-slate-100 hover:border-primary transition-all group"
              >
                <div className="bg-white p-3 rounded-2xl shadow-sm text-primary group-hover:bg-primary group-hover:text-white transition-all">
                  <span className="material-symbols-outlined">biotech</span>
                </div>
                <div className="text-left">
                  <p className="font-bold text-sm text-on-surface">Konsultasi Kulit</p>
                  <p className="text-[10px] text-slate-400">Analisis jerawat & kesehatan wajah</p>
                </div>
              </button>

              <button 
                onClick={() => startConsult('/mental')}
                className="w-full flex items-center gap-4 p-5 bg-slate-50 rounded-[24px] border border-slate-100 hover:border-primary transition-all group"
              >
                <div className="bg-white p-3 rounded-2xl shadow-sm text-orange-500 group-hover:bg-orange-500 group-hover:text-white transition-all">
                  <span className="material-symbols-outlined">psychology</span>
                </div>
                <div className="text-left">
                  <p className="font-bold text-sm text-on-surface">Konsultasi Mental</p>
                  <p className="text-[10px] text-slate-400">Kelola stress & kesehatan mental</p>
                </div>
              </button>
            </div>

            <p className="mt-8 text-[10px] text-slate-300 font-bold uppercase tracking-widest">
              Dermind Professional Support
            </p>
          </div>
        </div>
      )}

      {/* ===== SIDEBAR UTAMA ===== */}
      <aside className="fixed left-0 top-0 h-full w-[260px] bg-surface-dim flex flex-col py-8 border-r border-slate-200 z-50">
        {/* Bagian Logo */}
        <div className="px-8 mb-12">
          <h1 className="text-3xl font-manrope font-bold text-primary tracking-tight">Dermind</h1>
          <p className="text-[10px] uppercase tracking-[0.2em] text-primary-container font-bold mt-1 font-manrope">Premium Wellness</p>
        </div>

        {/* Bagian Navigasi */}
        <nav className="flex-1 px-4 space-y-1 overflow-y-auto pb-10 custom-scrollbar font-inter">
          {menu.map((item) => (
            <Link 
              key={item.path} 
              to={item.path} 
              className={`flex items-center gap-4 px-6 py-3.5 rounded-2xl transition-all group ${
                location.pathname === item.path 
                ? 'bg-primary text-white shadow-md' 
                : 'text-on-surface-variant hover:bg-white hover:text-primary'
              }`}
            >
              <span className={`material-symbols-outlined text-2xl ${location.pathname === item.path ? 'text-white' : 'text-slate-400 group-hover:text-primary'}`}>
                {item.icon}
              </span>
              <span className="font-semibold text-[15px]">{item.name}</span>
            </Link>
          ))}
        </nav>

        {/* Bagian tombol konsultasi */}
        <div className="px-6 mt-auto pt-6 border-t border-slate-200/50">
          <button 
            onClick={() => setShowConsultModal(true)}
            className="w-full bg-primary-container text-primary py-4 rounded-2xl font-bold text-sm shadow-sm hover:scale-[1.02] active:scale-95 transition-transform flex items-center justify-center gap-2 mb-2 font-manrope"
          >
            <span className="material-symbols-outlined text-xl">medical_services</span>
            Konsultasi Sekarang
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;