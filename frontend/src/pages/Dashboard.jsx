import React, {
  useState,
  useEffect
} from 'react';

import api from '../services/api';
import { useNavigate } from 'react-router-dom'; 

const Dashboard = () => {
  const navigate = useNavigate(); 
  
  // Kontrol Popup
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [showSchedule, setShowSchedule] = useState(false);

  const [profile, setProfile] =
  useState(null);

  const [mentalLatest, setMentalLatest] =
    useState(null);

  const [skinLatest, setSkinLatest] =
    useState(null);

    useEffect(() => {
  loadDashboard();
}, []);

const loadDashboard = async () => {
  try {

    const token =
      localStorage.getItem("token");

    const headers = {
      Authorization:
        `Bearer ${token}`
    };

    const [
      profileRes,
      mentalRes,
      skinRes
    ] = await Promise.all([
      api.get(
        "/auth/profile",
        { headers }
      ),
      api.get(
        "/mental/history",
        { headers }
      ),
      api.get(
        "/skin/history",
        { headers }
      )
    ]);

    setProfile(
      profileRes.data.user
    );

    if (
      mentalRes.data.data?.length
    ) {
      setMentalLatest(
        mentalRes.data.data[0]
      );
    }

    if (
      skinRes.data.data?.length
    ) {
      setSkinLatest(
        skinRes.data.data[0]
      );
    }

  } catch (error) {

    console.log(error);

  }
};
  return (
  
    <div className="animate-in fade-in duration-700 relative">

        <p className="text-sm text-slate-400 mb-2">
          Selamat Datang,
        </p>

        <h2 className="text-2xl font-bold">
          {profile?.name || "User"}
        </h2>
     
      {/* ===== MODAL ANALISIS ===== */}
      {showAnalysis && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowAnalysis(false)}></div>
          <div className="bg-white rounded-[40px] p-10 max-w-2xl w-full relative z-10 animate-in zoom-in-95 duration-300 shadow-2xl">
            <button onClick={() => setShowAnalysis(false)} className="absolute top-8 right-8 text-slate-400 hover:text-primary">
              <span className="material-symbols-outlined">close</span>
            </button>
            <h3 className="text-2xl font-bold mb-6 flex items-center gap-2 text-primary">
              <span className="material-symbols-outlined text-3xl">analytics</span> Laporan Analisis Kulit
            </h3>
            <div className="space-y-6">
              <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 flex justify-between items-center">
                <div className="text-right">
                  
                </div>
              </div>
              <button onClick={() => navigate('/skin')} className="w-full bg-primary text-white py-4 rounded-2xl font-bold">Lakukan Scan Ulang</button>
            </div>
          </div>
        </div>
      )}

      {/* ===== MODAL JADWAL ===== */}
      {showSchedule && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowSchedule(false)}></div>
          <div className="bg-white rounded-[40px] p-10 max-w-xl w-full relative z-10 animate-in zoom-in-95 duration-300 shadow-2xl">
            <button onClick={() => setShowSchedule(false)} className="absolute top-8 right-8 text-slate-400 hover:text-primary">
              <span className="material-symbols-outlined">close</span>
            </button>
            <h3 className="text-2xl font-bold mb-8">Semua Jadwal Mendatang</h3>
            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
              {[
                { name: 'Dr. Malvita Zianka', spec: 'Dermatologi', date: 'Besok, 10:00 AM', img: 'doc1' },
                { name: 'Psikolog Febri Kurniasih', spec: 'Mental Health', date: '5 Jan, 02:00 PM', img: 'doc2' },
                { name: 'Psikolog Khalisya Azzahra', spec: 'Mental Care', date: '10 Jan, 09:00 AM', img: 'doc3' }
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100 group hover:border-primary transition-all">
                  <img src={`https://i.pravatar.cc/100?u=${item.img}`} className="w-12 h-12 rounded-xl object-cover" />
                  <div className="flex-1">
                    <p className="font-bold text-sm text-on-surface">{item.name}</p>
                    <p className="text-[10px] text-slate-400">{item.spec}</p>
                  </div>
                  <p className="text-[10px] font-bold text-primary uppercase">{item.date}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ===== ISI DASHBOARD UTAMA ===== */}
      <div className="grid grid-cols-12 gap-6">
        
        {/* Kolom Kiri: Skor */}
        <div className="col-span-12 lg:col-span-8 bg-white rounded-[32px] p-10 shadow-sm border border-slate-100 relative overflow-hidden">
          <div className="flex justify-between items-start mb-6 relative z-10">
            <div>
              <h3 className="text-lg font-bold text-on-surface-variant">Skor Kesehatan Kulit</h3>
              <div className="flex items-baseline gap-2 mt-4">
                <span className="text-8xl font-bold text-primary tracking-tighter">
                  {
                    skinLatest
                      ? Math.round(
                          skinLatest.confidence
                        )
                      : 0
                  }
                </span>
                <span className="text-3xl text-slate-300">/100</span>
              </div>
            </div>
            {/* BUTTON ANALISIS -> Aktifkan Modal */}
            <button
              onClick={() => navigate('/skin')}
              className="bg-primary/5 text-primary px-6 py-2 rounded-full text-xs font-bold border border-primary/10 hover:bg-primary/10 transition-all">
              Buka Skin Detection
            </button>
          </div>
          <p className="text-on-surface-variant max-w-md mb-8 relative z-10 leading-relaxed">
            Kondisi kulit Anda meningkat <span className="text-primary font-bold">12%</span> sejak minggu lalu. Terus gunakan pelembab yang direkomendasikan AI.
          </p>
          
          <div className="flex items-end gap-3 h-24 mt-4 relative z-10">
            {[30, 45, 35, 60, 50, 75, 90].map((h, i) => (
              <div key={i} className="flex-1 bg-primary-container/20 rounded-t-xl hover:bg-primary/30 transition-all cursor-help" style={{height: `${h}%`}}></div>
            ))}
          </div>
        </div>

        {/* Kolom Kanan: Status Mental & Scan AI */}
        <div className="col-span-12 lg:col-span-4 flex flex-col gap-6">
          <div className="bg-white rounded-[32px] p-8 shadow-sm border border-slate-100">
            <div className="flex justify-between items-center mb-6">
              <div className="bg-tertiary/10 p-3 rounded-2xl text-tertiary"><span className="material-symbols-outlined">psychology</span></div>
              <span className="text-[10px] font-bold text-primary bg-primary-container/20 px-3 py-1 rounded-full uppercase tracking-widest">Stabil</span>
            </div>
            <h4 className="text-xl font-bold text-on-surface mb-2">
              {mentalLatest?.prediction ||
                mentalLatest?.status ||
                "Belum Ada Data"}
            </h4>

            <p className="text-on-surface-variant text-sm leading-relaxed">
              Confidence:
              {" "}
              {
                mentalLatest?.score ||
                mentalLatest?.confidence ||
                0
              }
              %
            </p>
          </div>

          <div onClick={() => navigate('/skin')} className="bg-primary rounded-[32px] p-8 shadow-lg shadow-primary/20 flex items-center justify-between group cursor-pointer hover:scale-[1.02] transition-all">
            <div className="flex items-center gap-4 text-white">
              <div className="bg-white/20 p-3 rounded-2xl"><span className="material-symbols-outlined">center_focus_strong</span></div>
              <div>
                <h4 className="font-bold">Scan Kulit AI</h4>
                <p className="text-xs opacity-70">Deteksi dini masalah kulit</p>
              </div>
            </div>
            <span className="material-symbols-outlined text-white/50 group-hover:text-white transition-all">arrow_forward_ios</span>
          </div>
        </div>

        {/* Bagian tengah: 3 kartu */}
        <div className="col-span-12 md:col-span-4 bg-white rounded-[32px] p-6 shadow-sm border border-slate-100 flex gap-4 items-center">
            <div className="bg-yellow-50 p-4 rounded-2xl text-yellow-500"><span className="material-symbols-outlined">light_mode</span></div>
            <div><h4 className="font-bold text-sm">Gunakan Sunscreen</h4><p className="text-[11px] text-on-surface-variant">Indeks UV tinggi hari ini.</p></div>
        </div>
        <div className="col-span-12 md:col-span-4 bg-white rounded-[32px] p-6 shadow-sm border border-slate-100 flex gap-4 items-center">
            <div className="bg-blue-50 p-4 rounded-2xl text-blue-500"><span className="material-symbols-outlined">water_drop</span></div>
            <div><h4 className="font-bold text-sm">Hidrasi Cukup</h4><p className="text-[11px] text-on-surface-variant">Tinggal 800ml lagi untuk target.</p></div>
        </div>
        <div className="col-span-12 md:col-span-4 bg-white rounded-[32px] p-6 shadow-sm border border-slate-100 flex gap-4 items-center">
            <div className="bg-indigo-50 p-4 rounded-2xl text-indigo-500"><span className="material-symbols-outlined">dark_mode</span></div>
            <div><h4 className="font-bold text-sm">Tidur Berkualitas</h4><p className="text-[11px] text-on-surface-variant">Rata-rata tidur 7.5 jam.</p></div>
        </div>

        {/* Baris bawah: Jadwal mendatang */}
        <div className="col-span-12 lg:col-span-6 bg-white rounded-[32px] p-8 shadow-sm border border-slate-100">
          <div className="flex justify-between items-center mb-8">
            <h4 className="font-bold text-xl text-on-surface">Jadwal Mendatang</h4>
            {/* BUTTON LIHAT SEMUA -> Aktifkan Modal */}
            <button onClick={() => setShowSchedule(true)} className="text-primary text-xs font-bold hover:underline">Lihat Semua</button>
          </div>
          <div className="flex items-center gap-4 bg-surface rounded-2xl p-4 border border-slate-50">
            <img src="https://i.pravatar.cc/100?u=doc1" className="w-12 h-12 rounded-xl object-cover" />
            <div className="flex-1">
              <p className="font-bold text-on-surface">Dr. Sarah Wijaya</p>
              <p className="text-xs text-on-surface-variant">Spesialis Dermatologi</p>
            </div>
            <div className="text-right"><p className="text-sm font-bold text-primary">Besok</p><p className="text-[10px] text-slate-400 font-bold">10:00 AM</p></div>
          </div>
        </div>

        {/* Trending Komunitas */}
        <div className="col-span-12 lg:col-span-6 bg-white rounded-[32px] p-8 shadow-sm border border-slate-100">
          <h4 className="font-bold text-xl text-on-surface mb-8">Trending di Komunitas</h4>
          <div className="grid grid-cols-2 gap-4">
            <div className="h-40 bg-slate-100 rounded-[24px] overflow-hidden relative group cursor-pointer">
              <img src="https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&q=80&w=400" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent p-5 flex flex-col justify-end">
                <p className="text-[9px] text-primary-container font-bold uppercase mb-1">Skincare Tips</p>
                <p className="text-xs font-bold text-white leading-tight">5 Cara Menghilangkan Bekas Jerawat</p>
              </div>
            </div>
            <div className="h-40 bg-slate-100 rounded-[24px] overflow-hidden relative group cursor-pointer">
              <img src="https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=400" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent p-5 flex flex-col justify-end">
                <p className="text-[9px] text-primary-container font-bold uppercase mb-1">Mental Health</p>
                <p className="text-xs font-bold text-white leading-tight">Mengelola Burnout di Era Digital</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;