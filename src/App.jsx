import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom'; 
import { useState } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import SkinAnalysis from './pages/SkinAnalysis';
import MentalHealth from './pages/MentalHealth';
import Community from './pages/Community';
import Articles from './pages/Articles';
import Events from './pages/Events';
import Profile from './pages/Profile';
import SearchResults from './pages/SearchResults';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import './App.css';

function AppContent() {
  const [keyword, setKeyword] = useState('');
  const [showNotif, setShowNotif] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // HALAMAN PUBLIK
  const publicPaths = ['/landing', '/login', '/register'];
  const isPublicPage = publicPaths.includes(location.pathname);

  const pageConfig = {
    '/': { title: 'Selamat Pagi, Budi', sub: 'Berikut ringkasan kesehatan Anda hari ini.', search: false },
    '/profile': { title: 'Profil Pengguna', sub: 'Kelola profil dan preferensi akun Anda.', search: false },
    '/mental': { title: 'Mental Wellness', sub: 'Pantau kesehatan mental Anda dengan AI.', search: false },
    '/skin': { title: 'Skin Analysis', sub: 'Analisis kondisi kulit secara klinis.', search: false },
    '/articles': { search: true, placeholder: 'Cari artikel kesehatan...' },
    '/community': { search: true, placeholder: 'Cari diskusi komunitas...' },
    '/events': { search: true, placeholder: 'Cari event & berita terbaru...' },
    '/search': { title: 'Hasil Pencarian', sub: 'Menampilkan hasil yang relevan.', search: false },
  };

  const current = pageConfig[location.pathname] || { title: 'Dermind', search: false };

  const handleSearch = (e) => {
    if (e.key === 'Enter' && keyword.trim() !== '') {
      navigate(`/search?q=${keyword}`);
      setKeyword(''); 
    }
  };

  // HALAMAN PUBLIK (TANPA SIDEBAR)
  if (isPublicPage) {
    return (
      <Routes>
        <Route path="/landing" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    );
  }

  // HALAMAN DASHBOARD USER 
  return (
    <div className="flex min-h-screen bg-surface font-inter">
      <Sidebar />
      <main className="flex-1 ml-[260px] p-10">
        
        {/* HEADER GLOBAL */}
        <header className="flex justify-between items-center mb-10 h-16 relative">
          <div className="flex-1">
            {current.search ? (
              <div className="bg-white px-6 py-3 rounded-2xl shadow-sm flex items-center gap-3 w-[400px] border border-slate-100 focus-within:ring-2 focus-within:ring-primary/20 transition-all animate-in fade-in duration-300">
                <span className="material-symbols-outlined text-slate-400">search</span>
                <input 
                  type="text" 
                  placeholder={current.placeholder}
                  className="border-none focus:ring-0 text-sm w-full bg-transparent p-0 font-medium"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  onKeyDown={handleSearch}
                />
              </div>
            ) : (
              <div className="animate-in fade-in slide-in-from-left-4 duration-500">
                <h2 className="text-3xl font-manrope font-bold text-on-surface">{current.title}</h2>
                <p className="text-on-surface-variant text-sm mt-1">{current.sub}</p>
              </div>
            )}
          </div>

          <div className="flex items-center gap-4 relative">
            {/* NOTIFIKASI */}
            <div className="relative">
              <button onClick={() => {setShowNotif(!showNotif); setShowSettings(false)}} className={`p-3 rounded-2xl shadow-sm border transition-all ${showNotif ? 'bg-primary text-white' : 'bg-white text-slate-400 border-slate-100 hover:text-primary'}`}>
                <span className="material-symbols-outlined">notifications</span>
                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
              </button>
              {showNotif && (
                <div className="absolute right-0 mt-4 w-80 bg-white rounded-[28px] shadow-2xl border border-slate-100 z-[120] p-6 animate-in slide-in-from-top-5 duration-300">
                  <h4 className="font-bold text-on-surface mb-4">Notifikasi Terbaru</h4>
                  <div className="space-y-4">
                    <div className="flex gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-100">
                      <span className="material-symbols-outlined text-primary text-sm">auto_awesome</span>
                      <p className="text-[11px] text-on-surface-variant leading-tight">Analisis AI: Kulit Anda menunjukkan perbaikan.</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* SETTINGS */}
            <div className="relative">
              <button onClick={() => {setShowSettings(!showSettings); setShowNotif(false)}} className={`p-3 rounded-2xl shadow-sm border transition-all ${showSettings ? 'bg-primary text-white' : 'bg-white text-slate-400 border-slate-100 hover:text-primary'}`}>
                <span className="material-symbols-outlined">settings</span>
              </button>
              {showSettings && (
                <div className="absolute right-0 mt-4 w-64 bg-white rounded-[28px] shadow-2xl border border-slate-100 z-[120] p-6 animate-in slide-in-from-top-5 duration-300">
                  <h4 className="font-bold text-on-surface mb-4">Pengaturan</h4>
                  <button onClick={() => navigate('/landing')} className="w-full flex items-center gap-3 p-3 hover:bg-red-50 text-red-500 rounded-xl transition-all">
                    <span className="material-symbols-outlined text-sm">logout</span>
                    <span className="text-xs font-bold">Keluar Akun</span>
                  </button>
                </div>
              )}
            </div>

            <img 
              src="https://i.pravatar.cc/150?u=aditya" 
              alt="Avatar" 
              className="w-12 h-12 rounded-2xl border-2 border-primary-container object-cover cursor-pointer hover:scale-105 transition-transform"
              onClick={() => navigate('/profile')}
            />
          </div>
        </header>

        {/* Backdrop klik untuk menutup popup */}
        {(showNotif || showSettings) && (
          <div className="fixed inset-0 z-[110]" onClick={() => {setShowNotif(false); setShowSettings(false)}}></div>
        )}

        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/articles" element={<Articles />} />
          <Route path="/community" element={<Community />} />
          <Route path="/mental" element={<MentalHealth />} />
          <Route path="/skin" element={<SkinAnalysis />} />
          <Route path="/events" element={<Events />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/search" element={<SearchResults />} />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;