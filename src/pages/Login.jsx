import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false); 

  const handleSocialLogin = (platform) => {
    alert(`Berhasil masuk menggunakan akun ${platform}!`);
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-6 font-inter">
      <div className="max-w-[1000px] w-full grid grid-cols-1 lg:grid-cols-2 bg-white rounded-[40px] shadow-2xl overflow-hidden border border-slate-100 animate-in zoom-in-95 duration-500">
        
        {/* KIRI */}
        <div className="hidden lg:block bg-primary p-16 relative text-white">
          <h2 className="text-4xl font-manrope font-bold text-white mb-6 leading-tight">
            Masa Depan Kesehatan Kulit Berbasis <span className="text-[#cfdaf1]">Kecerdasan Buatan.</span>
          </h2>
          <p className="text-white/60 text-sm leading-relaxed mb-12">Masuk ke akun Anda untuk melanjutkan perjalanan wellness dan mendapatkan rekomendasi personal dari AI.</p>
          <div className="w-full aspect-square bg-white/10 rounded-3xl border border-white/20 p-8">
             <img src="https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=400" className="w-full h-full object-cover rounded-xl grayscale opacity-80" alt="Login Art" />
          </div>
        </div>
        
        {/* KANAN: Form Login */}
        <div className="p-12 md:p-20 flex flex-col justify-center">
          <h3 className="text-3xl font-manrope font-bold text-on-surface mb-2">Selamat Datang</h3>
          <p className="text-slate-400 text-sm mb-10">Silakan masuk untuk mengakses fitur kesehatan cerdas Anda.</p>
          
          <form className="space-y-6">
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Email</label>
              <input type="email" placeholder="nama@email.com" className="w-full bg-slate-50 border-none rounded-2xl p-4 mt-2 focus:ring-1 focus:ring-primary text-sm" />
            </div>

            <div>
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Password</label>
                <a href="#" className="text-[10px] font-bold text-primary uppercase">Lupa Password?</a>
              </div>
              <div className="relative mt-2">
                <input 
                    type={showPassword ? "text" : "password"} 
                    placeholder="••••••••" 
                    className="w-full bg-slate-50 border-none rounded-2xl p-4 pr-12 focus:ring-1 focus:ring-primary text-sm" 
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

            <button 
              type="button" 
              onClick={() => navigate('/')}
              className="w-full bg-primary text-white py-4 rounded-2xl font-bold shadow-xl shadow-primary/20 hover:scale-[1.02] transition-all"
            >
              Masuk Sekarang
            </button>
          </form>

          <div className="mt-10 text-center">
            <p className="text-slate-400 text-[10px] uppercase font-bold tracking-widest">Atau masuk dengan</p>
            <div className="flex gap-4 mt-6">
               {/* TOMBOL GOOGLE */}
               <button 
                type="button"
                onClick={() => handleSocialLogin('Google')}
                className="flex-1 border border-slate-100 py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-slate-50 transition-all font-bold text-xs"
               >
                 <img src="https://www.google.com/favicon.ico" className="w-4 h-4" alt="Google" /> Google
               </button>

               {/* TOMBOL FACEBOOK */}
               <button 
                type="button"
                onClick={() => handleSocialLogin('Facebook')}
                className="flex-1 border border-slate-100 py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-slate-50 transition-all font-bold text-xs"
               >
                 <img src="https://upload.wikimedia.org/wikipedia/commons/b/b8/2021_Facebook_icon.svg" className="w-4 h-4" alt="Facebook" /> Facebook
               </button>
            </div>
            <p className="mt-10 text-xs text-slate-400">Belum punya akun? <span onClick={() => navigate('/register')} className="text-primary font-bold cursor-pointer hover:underline">Daftar Sekarang</span></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;