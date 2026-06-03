import { Link, useNavigate } from 'react-router-dom';

const PublicNavbar = () => {
  const navigate = useNavigate();
  return (
    <nav className="flex justify-between items-center px-12 py-6 bg-white/80 backdrop-blur-md sticky top-0 z-[100] border-b border-slate-50">
      <div className="flex items-center gap-2">
        <h1 className="text-2xl font-manrope font-bold text-primary tracking-tighter">Dermind</h1>
      </div>
      <div className="hidden md:flex gap-8 text-sm font-bold text-slate-500 uppercase tracking-widest">
        <a href="#beranda" className="hover:text-primary transition-colors">Beranda</a>
        <a href="#layanan" className="hover:text-primary transition-colors">Layanan</a>
      </div>
      <div className="flex gap-4 items-center">
        <button onClick={() => navigate('/login')} className="text-sm font-bold text-primary px-6 py-2 hover:bg-primary/5 rounded-full transition-all">Masuk</button>
        <button onClick={() => navigate('/register')} className="bg-primary text-white px-6 py-2.5 rounded-full text-sm font-bold shadow-lg shadow-primary/20 hover:scale-105 transition-all">Mulai Sekarang</button>
      </div>
    </nav>
  );
};

export default PublicNavbar;