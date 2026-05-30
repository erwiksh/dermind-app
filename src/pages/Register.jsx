import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const navigate = useNavigate();
  const [showSuccess, setShowSuccess] = useState(false); 
  const [showPassword, setShowPassword] = useState(false); 

  //  FUNGSI DAFTAR BIASA 
  const handleRegister = (e) => {
    e.preventDefault();
    setShowSuccess(true);
    
    // Otomatis pindah ke login setelah 3 detik
    setTimeout(() => {
      navigate('/login');
    }, 3000);
  };

  //  FUNGSI DAFTAR SOSIAL MEDIA
  const handleSocialRegister = (platform) => {
    alert(`Mencoba mendaftar menggunakan akun ${platform}...`);
    setShowSuccess(true);
    
    setTimeout(() => {
      navigate('/login');
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-6 font-inter relative">
      
      {/* ===== POP-UP BERHASIL ===== */}
      {showSuccess && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-md"></div>
          <div className="bg-white rounded-[40px] p-12 max-w-sm w-full relative z-10 animate-in zoom-in-95 duration-300 shadow-2xl text-center">
            <div className="w-20 h-20 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="material-symbols-outlined text-5xl animate-bounce">check_circle</span>
            </div>
            <h3 className="text-2xl font-bold text-on-surface mb-2 font-manrope">Pendaftaran Berhasil!</h3>
            <p className="text-slate-400 text-sm mb-8 leading-relaxed font-inter">Akun Anda sedang dimuat. Anda akan segera dialihkan ke halaman Login...</p>
            <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-primary animate-progress-loading"></div>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-[1100px] w-full grid grid-cols-1 lg:grid-cols-2 bg-white rounded-[40px] shadow-2xl overflow-hidden border border-slate-100 animate-in slide-in-from-bottom-10 duration-700">
        
        {/* KIRI */}
        <div className="bg-[#1a2b2b] p-16 text-white flex flex-col">
          <h2 className="text-4xl font-manrope font-bold mb-4 tracking-tighter">Dermind</h2>
          <p className="text-slate-400 text-sm leading-relaxed mb-12 font-inter">Mulai perjalanan kesehatan kulit dan mental Anda hari ini dengan teknologi AI tercanggih di Indonesia.</p>
          
          <div className="space-y-6 flex-1">
             <div className="bg-white/5 p-6 rounded-3xl border border-white/5">
                <div className="flex items-center gap-3 mb-2">
                  <span className="material-symbols-outlined text-[#4fbdba]">verified_user</span>
                  <p className="font-bold text-sm font-manrope">AI Analysis Aktif</p>
                </div>
                <p className="text-[10px] text-slate-500 font-inter uppercase tracking-widest font-bold">Nikmati deteksi kecemasan dan masalah kulit real-time.</p>
             </div>
             <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/5 p-6 rounded-3xl border border-white/5 text-center">
                  <p className="text-xl font-bold font-manrope">10k+</p>
                  <p className="text-[9px] text-slate-500 uppercase tracking-widest font-bold">Pengguna</p>
                </div>
                <div className="bg-white/5 p-6 rounded-3xl border border-white/5 text-center">
                  <p className="text-xl font-bold font-manrope">50+</p>
                  <p className="text-[9px] text-slate-500 uppercase tracking-widest font-bold">Pakar Medis</p>
                </div>
             </div>
          </div>
          
          <div className="mt-12 flex items-center gap-4 border-t border-white/5 pt-8 font-inter">
             <div className="flex -space-x-3">
                <img src="https://i.pravatar.cc/100?u=1" className="w-8 h-8 rounded-full border-2 border-[#1a2b2b]" alt="user" />
                <img src="https://i.pravatar.cc/100?u=2" className="w-8 h-8 rounded-full border-2 border-[#1a2b2b]" alt="user" />
             </div>
             <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest font-manrope">+400 Join Community</p>
          </div>
        </div>

        {/* KANAN */}
        <div className="p-12 md:p-16">
          <h3 className="text-3xl font-manrope font-bold text-on-surface mb-2 font-manrope">Buat Akun Baru</h3>
          <p className="text-slate-400 text-sm mb-10 font-inter">Lengkapi data di bawah ini untuk memulai profil kesehatan Anda.</p>
          
          <form className="space-y-6" onSubmit={handleRegister}>
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest font-manrope">Alamat Email</label>
              <input required type="email" placeholder="nama@email.com" className="w-full bg-slate-50 border-none rounded-2xl p-4 mt-2 focus:ring-1 focus:ring-primary text-sm font-inter" />
            </div>
            <div className="grid grid-cols-2 gap-4">
               <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest font-manrope">Nama Lengkap</label>
                <input required type="text" placeholder="Budi Santoso" className="w-full bg-slate-50 border-none rounded-2xl p-4 mt-2 focus:ring-1 focus:ring-primary text-sm font-inter" />
               </div>
               
               <div className="relative">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest font-manrope">Password</label>
                <div className="relative mt-2">
                    <input 
                        required 
                        type={showPassword ? "text" : "password"} 
                        placeholder="••••••••" 
                        className="w-full bg-slate-50 border-none rounded-2xl p-4 pr-12 focus:ring-1 focus:ring-primary text-sm font-inter" 
                    />
                    <button 
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-primary transition-all flex items-center"
                    >
                        <span className="material-symbols-outlined text-xl">
                            {showPassword ? 'visibility' : 'visibility_off'}
                        </span>
                    </button>
                </div>
               </div>
            </div>
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest font-manrope">Pekerjaan</label>
              <input required type="text" placeholder="Mahasiswa / Freelancer" className="w-full bg-slate-50 border-none rounded-2xl p-4 mt-2 focus:ring-1 focus:ring-primary text-sm font-inter" />
            </div>
            
            <button 
              type="submit" 
              className="w-full bg-primary text-white py-4 rounded-2xl font-bold shadow-xl shadow-primary/20 hover:scale-[1.02] transition-all font-manrope"
            >
              Daftar Sekarang
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-slate-50">
             <p className="text-center text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-4 font-manrope">Atau daftar dengan</p>
             <div className="flex gap-4">
                <button 
                  type="button"
                  onClick={() => handleSocialRegister('Google')}
                  className="flex-1 border border-slate-100 py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 hover:bg-slate-50 transition-all font-manrope"
                >
                  <img src="https://www.google.com/favicon.ico" className="w-4 h-4" alt="" /> Google
                </button>
                <button 
                  type="button"
                  onClick={() => handleSocialRegister('Facebook')}
                  className="flex-1 border border-slate-100 py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 hover:bg-slate-50 transition-all font-manrope"
                >
                  <img src="https://upload.wikimedia.org/wikipedia/commons/b/b8/2021_Facebook_icon.svg" className="w-4 h-4" alt="FB" /> Facebook
                </button>
             </div>
             <p className="mt-8 text-center text-xs text-slate-400 font-inter">Sudah punya akun? <span onClick={() => navigate('/login')} className="text-primary font-bold cursor-pointer hover:underline">Masuk Disini</span></p>
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes loadingProgress {
          0% { width: 0%; }
          100% { width: 100%; }
        }
        .animate-progress-loading {
          animation: loadingProgress 3s linear forwards;
        }
      `}} />
    </div>
  );
};

export default Register;