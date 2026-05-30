import React from 'react';
import { useNavigate } from 'react-router-dom';
import PublicNavbar from '../components/PublicNavbar';

const LandingPage = () => {
  const navigate = useNavigate();
  return (
    <div className="bg-surface min-h-screen font-inter">
      <PublicNavbar />
      
      {/* HERO SECTION */}
      <section id="beranda" className="px-12 py-20 grid grid-cols-12 gap-12 items-center max-w-[1400px] mx-auto">
        <div className="col-span-12 lg:col-span-6 animate-in slide-in-from-left-10 duration-1000">
          <span className="bg-primary/10 text-primary px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] mb-6 inline-block">AI Wellness & Healthcare</span>
          <h1 className="text-6xl font-manrope font-bold text-on-surface leading-[1.1] mb-6">
            Masa Depan <br /><span className="text-primary">Wellness Digital.</span>
          </h1>
          <p className="text-on-surface-variant text-lg leading-relaxed mb-10 max-w-lg font-inter">
            Dermind merupakan asisten kesehatan cerdas berbasis AI untuk memantau kesehatan kulit dan mental Anda secara personal, kapan pun dan di mana pun.
          </p>
          <div className="flex gap-4">
            <button onClick={() => navigate('/register')} className="bg-primary text-white px-10 py-4 rounded-2xl font-bold shadow-xl shadow-primary/20 hover:scale-105 transition-all">Mulai Sekarang</button>
            <button className="bg-white text-slate-500 border border-slate-200 px-10 py-4 rounded-2xl font-bold flex items-center gap-2 hover:bg-slate-50 transition-all">
              <span className="material-symbols-outlined">play_circle</span> Lihat Demo
            </button>
          </div>
        </div>
        <div className="col-span-12 lg:col-span-6 relative">
          <div className="w-full aspect-square bg-gradient-to-tr from-primary/20 to-primary-container/20 rounded-[60px] relative overflow-hidden animate-in zoom-in duration-1000">
            <img src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=800" className="w-full h-full object-cover mix-blend-overlay opacity-80" alt="AI Skin" />
            <div className="absolute bottom-8 left-8 bg-white/80 backdrop-blur-md p-6 rounded-3xl border border-white/50 shadow-2xl flex items-center gap-4 animate-bounce">
                <div className="bg-primary p-2 rounded-xl text-white"><span className="material-symbols-outlined">biotech</span></div>
                <div><p className="text-[10px] font-bold text-slate-400 uppercase">Deteksi Akurat</p><p className="font-bold text-on-surface text-sm">94.2% AI Accuracy</p></div>
            </div>
          </div>
        </div>
      </section>

      {/* STATS SECTION */}
      <section className="px-12 py-12 bg-white border-y border-slate-50">
        <div className="max-w-[1200px] mx-auto flex flex-wrap justify-between gap-10">
          {[
            { val: '10k+', label: 'Pengguna Aktif' },
            { val: '99%', label: 'Kepuasan User' },
            { val: '50+', label: 'Ahli Medis' },
            { val: '24/7', label: 'Dukungan AI' }
          ].map((s, i) => (
            <div key={i} className="text-center">
              <p className="text-4xl font-manrope font-bold text-primary mb-1">{s.val}</p>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* LAYANAN SECTION */}
      <section id="layanan" className="px-12 py-24 bg-surface">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-manrope font-bold mb-2">Layanan Premium Kami</h2>
          <p className="text-slate-400 text-sm">Sistem kesehatan terpadu menggunakan teknologi kecerdasan buatan terbaru.</p>
        </div>
        <div className="grid grid-cols-12 gap-6 max-w-[1200px] mx-auto">
            <div className="col-span-12 md:col-span-8 bg-white p-10 rounded-[40px] border border-slate-100 shadow-sm group hover:border-primary transition-all">
                <span className="material-symbols-outlined text-4xl text-primary mb-4">psychology</span>
                <h3 className="text-2xl font-bold mb-4">AI Mental Health</h3>
                <p className="text-slate-400 text-sm leading-relaxed mb-6">Pantau kondisi psikologis Anda melalui analisis teks dan mood tracker cerdas yang mendeteksi indikasi stres secara dini.</p>
                <button className="text-primary font-bold text-xs flex items-center gap-2">Pelajari Lebih Lanjut <span className="material-symbols-outlined text-sm">north_east</span></button>
            </div>
            <div className="col-span-12 md:col-span-4 bg-primary text-white p-10 rounded-[40px] shadow-xl shadow-primary/20 relative overflow-hidden">
                <h3 className="text-2xl font-bold mb-4">Skin Detection</h3>
                <p className="text-white/70 text-sm mb-10">Analisis kondisi kulit dengan foto smartphone untuk rekomendasi produk yang tepat.</p>
                <img src="https://images.unsplash.com/photo-1556228720-195a672e8a03?q=80&w=300" className="rounded-2xl w-full h-32 object-cover opacity-50" alt="" />
                <span className="material-symbols-outlined absolute -right-4 -bottom-4 text-8xl opacity-10">biotech</span>
            </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="px-12 py-10 bg-white border-t border-slate-100 text-center">
        <h2 className="text-2xl font-manrope font-bold text-primary mb-2">Dermind</h2>
        <p className="text-slate-400 text-[10px] uppercase font-bold tracking-[0.3em]">© 2026 Dermind Holistic Wellness. All Rights Reserved.</p>
      </footer>
    </div>
  );
};

export default LandingPage;