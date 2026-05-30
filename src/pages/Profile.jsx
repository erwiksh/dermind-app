import React, { useState, useEffect } from 'react';

const Profile = () => {
  // STATE MANAGEMENT
  const [activeModal, setActiveModal] = useState(null); // 'edit', 'security', 'subscription'
  const [selectedArticle, setSelectedArticle] = useState(null); // Modal untuk baca artikel
  const [savedList, setSavedList] = useState([]);
  
  // State Data Pengguna (Simulasi)
  const [user] = useState({
    name: 'Anggia Maros',
    age: 26,
    weight: 72,
    blood: 'O+',
    id: 'DM-2899-041',
    isPremium: true
  });

  // LOAD DATA ARTIKEL
  useEffect(() => {
    const savedIds = JSON.parse(localStorage.getItem('savedArticles')) || [];
    
    // Data Master Artikel Simulasi
    const allArticles = [
      { 
        id: 1, 
        cat: 'Skincare', 
        title: 'Masa Depan Dermatologi: Bagaimana AI Mengubah Cara Kita Merawat Kulit', 
        image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=800',
        content: 'AI dalam dermatologi kini mampu mendeteksi kondisi kulit dengan akurasi tinggi. Di Dermind, kami menggabungkan data klinis dengan kenyamanan penggunaan di rumah untuk memastikan setiap individu mendapatkan perawatan yang personal.' 
      },
      { 
        id: 2, 
        cat: 'Mental', 
        title: 'Kesehatan Mental di Era Digital', 
        image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=400',
        content: 'Kesehatan mental di dunia digital memerlukan teknik grounding dan pembatasan waktu layar. Meditasi harian terbukti menurunkan kortisol dan meningkatkan fokus sepanjang hari.' 
      },
      { 
        id: 3, 
        cat: 'Nutrisi', 
        title: 'Superfood untuk Imunitas', 
        image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=400',
        content: 'Nutrisi seperti brokoli dan buah beri sangat kaya akan antioksidan untuk melawan radikal bebas dan memperbaiki barrier kulit dari dalam.' 
      },
      { 
        id: 4, 
        cat: 'Olahraga', 
        title: 'Membangun Kebiasaan Yoga', 
        image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=400',
        content: 'Yoga membantu memperbaiki postur tubuh dan melancarkan sirkulasi darah yang berdampak langsung pada kecerahan kulit wajah.' 
      }
    ];
    
    const filtered = allArticles.filter(art => savedIds.includes(art.id));
    setSavedList(filtered);
  }, []);

  //  HANDLER FUNCTIONS 
  const removeSavedArticle = (e, id) => {
    e.stopPropagation(); 
    const updatedIds = savedList.filter(item => item.id !== id).map(item => item.id);
    localStorage.setItem('savedArticles', JSON.stringify(updatedIds));
    setSavedList(savedList.filter(item => item.id !== id));
  };

  const activityLogs = [
    { id: 1, title: 'Deteksi Kulit AI Selesai', desc: 'Hasil: Normal. Tingkat Hidrasi 84%', time: 'Baru Saja', icon: 'biotech', color: 'text-primary bg-primary/10' },
    { id: 2, title: 'Sesi Konsultasi AI Mental', desc: 'Durasi: 15 Menit. Topik: Stress', time: 'Kemarin', icon: 'psychology', color: 'text-orange-500 bg-orange-100' }
  ];

  return (
    <div className="animate-in fade-in duration-700 pb-20 relative">
      
      {/* ===== MODAL: BACA ARTIKEL TERSIMPAN ===== */}
      {selectedArticle && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 md:p-10">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={() => setSelectedArticle(null)}></div>
          <div className="bg-white rounded-[40px] w-full max-w-3xl max-h-[85vh] overflow-y-auto relative z-10 animate-in zoom-in-95 duration-300 shadow-2xl custom-scrollbar">
            <img src={selectedArticle.image} className="w-full h-64 object-cover" alt="" />
            <div className="p-8 md:p-12">
              <span className="text-primary font-bold text-xs uppercase tracking-widest">{selectedArticle.cat}</span>
              <h3 className="text-3xl font-manrope font-bold text-on-surface mt-2 mb-6">{selectedArticle.title}</h3>
              <p className="text-on-surface-variant text-lg leading-relaxed font-inter">{selectedArticle.content}</p>
              <button onClick={() => setSelectedArticle(null)} className="mt-10 bg-slate-100 px-8 py-3 rounded-xl font-bold text-slate-500 hover:bg-slate-200 transition-all">Tutup</button>
            </div>
          </div>
        </div>
      )}

      {/* ===== MODAL: EDIT PROFIL ===== */}
      {activeModal === 'edit' && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setActiveModal(null)}></div>
          <div className="bg-white rounded-[40px] p-10 max-w-md w-full relative z-10 animate-in zoom-in-95 shadow-2xl">
            <h3 className="text-2xl font-bold mb-6 text-on-surface">Edit Profil</h3>
            <div className="space-y-4 mb-8">
              <input type="text" defaultValue={user.name} className="w-full bg-slate-50 border-none rounded-xl p-4" placeholder="Nama Lengkap" />
              <div className="grid grid-cols-2 gap-4">
                <input type="number" defaultValue={user.age} className="w-full bg-slate-50 border-none rounded-xl p-4" placeholder="Umur" />
                <input type="number" defaultValue={user.weight} className="w-full bg-slate-50 border-none rounded-xl p-4" placeholder="Berat" />
              </div>
            </div>
            <button onClick={() => setActiveModal(null)} className="w-full bg-primary text-white py-4 rounded-2xl font-bold">Simpan Perubahan</button>
          </div>
        </div>
      )}

      {/* ===== MODAL: KEAMANAN AKUN ===== */}
      {activeModal === 'security' && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setActiveModal(null)}></div>
          <div className="bg-white rounded-[40px] p-10 max-w-md w-full relative z-10 animate-in zoom-in-95 shadow-2xl">
            <h3 className="text-2xl font-bold mb-6 text-on-surface">Keamanan Akun</h3>
            <div className="space-y-4 mb-8">
               <div className="p-4 bg-slate-50 rounded-2xl flex justify-between items-center border border-slate-100">
                  <span className="font-bold text-sm">Ganti Password</span>
                  <span className="material-symbols-outlined text-slate-300">chevron_right</span>
               </div>
               <div className="p-4 bg-slate-50 rounded-2xl flex justify-between items-center border border-slate-100">
                  <div>
                    <p className="font-bold text-sm">Autentikasi 2 Faktor (2FA)</p>
                    <p className="text-[10px] text-green-500 font-bold uppercase">Aktif</p>
                  </div>
                  <div className="w-10 h-5 bg-primary rounded-full relative"><div className="w-4 h-4 bg-white rounded-full absolute right-0.5 top-0.5 shadow-sm"></div></div>
               </div>
            </div>
            <button onClick={() => setActiveModal(null)} className="w-full bg-slate-100 text-slate-500 py-4 rounded-2xl font-bold">Tutup</button>
          </div>
        </div>
      )}

      {/* ===== MODAL: PAKET LANGGANAN ===== */}
      {activeModal === 'subscription' && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setActiveModal(null)}></div>
          <div className="bg-white rounded-[40px] p-10 max-w-md w-full relative z-10 animate-in zoom-in-95 shadow-2xl text-center">
            <div className="w-20 h-20 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-4">
               <span className="material-symbols-outlined text-4xl">verified</span>
            </div>
            <h3 className="text-2xl font-bold mb-2">Status: Premium</h3>
            <p className="text-slate-400 text-xs mb-8">Aktif hingga 12 Des 2026</p>
            <div className="space-y-3 mb-8 text-left bg-slate-50 p-6 rounded-3xl">
               <p className="font-bold text-xs text-primary uppercase mb-2">Benefit Anda:</p>
               <div className="flex items-center gap-2 text-xs font-medium text-slate-600"><span className="material-symbols-outlined text-primary text-sm">check_circle</span> Unlimited AI Scan</div>
               <div className="flex items-center gap-2 text-xs font-medium text-slate-600"><span className="material-symbols-outlined text-primary text-sm">check_circle</span> Prioritas Konsultasi</div>
            </div>
          </div>
        </div>
      )}

      {/* GRID UTAMA */}
      <div className="grid grid-cols-12 gap-6 mb-8">
        {/* KIRI: Identitas */}
        <div className="col-span-12 lg:col-span-4 bg-white rounded-[40px] p-10 border border-slate-100 shadow-sm flex flex-col items-center text-center">
          <div className="relative mb-6">
            <img src="https://i.pravatar.cc/150?u=anggia" className="w-32 h-32 rounded-full border-4 border-primary-container p-1 object-cover" alt="" />
            <span className="absolute bottom-1 right-1 bg-primary text-white text-[9px] font-bold px-3 py-1 rounded-full border-4 border-white tracking-widest uppercase">Premium</span>
          </div>
          <h3 className="text-2xl font-manrope font-bold text-on-surface mb-1">{user.name}</h3>
          <p className="text-xs text-slate-400 font-bold mb-8 uppercase tracking-widest">ID: {user.id}</p>
          <div className="grid grid-cols-3 w-full gap-4 mb-8">
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 text-center"><p className="text-lg font-bold text-primary">{user.age}</p><p className="text-[9px] text-slate-400 font-bold uppercase">Umur</p></div>
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 text-center"><p className="text-lg font-bold text-primary">{user.weight}kg</p><p className="text-[9px] text-slate-400 font-bold uppercase">Berat</p></div>
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 text-center"><p className="text-lg font-bold text-primary">{user.blood}</p><p className="text-[9px] text-slate-400 font-bold uppercase">Darah</p></div>
          </div>
          <button onClick={() => setActiveModal('edit')} className="w-full bg-primary-container text-primary py-4 rounded-2xl font-bold text-sm hover:scale-[1.02] transition-transform">Edit Profil</button>
        </div>

        {/* KANAN: Analisis AI & Settings */}
        <div className="col-span-12 lg:col-span-8 space-y-6">
          <div className="bg-white rounded-[40px] p-8 border border-slate-100 shadow-sm">
            <h4 className="font-bold flex items-center gap-2 mb-8 text-on-surface"><span className="material-symbols-outlined text-primary">analytics</span> Ringkasan Kesehatan AI</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 bg-slate-50 rounded-[32px] border border-slate-100">
                <p className="text-[10px] font-bold text-slate-400 uppercase mb-2 tracking-widest">Skor Kesehatan Kulit</p>
                <div className="flex items-center justify-between"><h5 className="text-4xl font-bold text-primary">94%</h5><span className="material-symbols-outlined text-primary opacity-20 text-4xl">face</span></div>
              </div>
              <div className="p-6 bg-slate-50 rounded-[32px] border border-slate-100">
                <p className="text-[10px] font-bold text-slate-400 uppercase mb-2 tracking-widest">Status Mental</p>
                <div className="flex items-center justify-between"><h5 className="text-2xl font-bold text-orange-500">Sangat Baik</h5><span className="material-symbols-outlined text-orange-500 opacity-20 text-2xl">sentiment_very_satisfied</span></div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* KEAMANAN AKUN CARD */}
            <div onClick={() => setActiveModal('security')} className="bg-white rounded-[32px] p-6 border border-slate-100 shadow-sm flex items-center justify-between group cursor-pointer hover:border-primary transition-all">
              <div className="flex items-center gap-4"><div className="p-3 bg-surface rounded-2xl text-slate-400 group-hover:text-primary"><span className="material-symbols-outlined">security</span></div><p className="font-bold text-sm text-on-surface">Keamanan Akun</p></div>
              <span className="material-symbols-outlined text-slate-300">chevron_right</span>
            </div>
            {/* PAKET LANGGANAN CARD */}
            <div onClick={() => setActiveModal('subscription')} className="bg-white rounded-[32px] p-6 border border-slate-100 shadow-sm flex items-center justify-between group cursor-pointer hover:border-primary transition-all">
              <div className="flex items-center gap-4"><div className="p-3 bg-surface rounded-2xl text-slate-400 group-hover:text-primary"><span className="material-symbols-outlined">payments</span></div><p className="font-bold text-sm text-on-surface">Paket Langganan</p></div>
              <span className="material-symbols-outlined text-slate-300">chevron_right</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bagian: ARTIKEL TERSIMPAN */}
      <div className="bg-white rounded-[40px] p-10 border border-slate-100 shadow-sm mb-8 animate-in fade-in slide-in-from-bottom-4">
        <h4 className="font-bold text-xl mb-8 flex items-center gap-2 text-on-surface">
          <span className="material-symbols-outlined text-primary">collections_bookmark</span> Artikel Tersimpan
        </h4>
        {savedList.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {savedList.map(item => (
              <div 
                key={item.id} 
                onClick={() => setSelectedArticle(item)} 
                className="p-5 bg-slate-50 rounded-2xl border border-slate-100 flex justify-between items-center group cursor-pointer hover:border-primary transition-all"
              >
                <div className="flex-1">
                  <p className="text-[9px] font-bold text-primary uppercase mb-1 font-inter">{item.cat}</p>
                  <p className="text-sm font-bold text-on-surface group-hover:text-primary transition-colors font-manrope">{item.title}</p>
                </div>
                <button 
                  onClick={(e) => removeSavedArticle(e, item.id)} 
                  className="p-2 text-slate-300 hover:text-red-500 transition-colors"
                >
                  <span className="material-symbols-outlined text-xl">delete</span>
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-10 bg-slate-50 rounded-[32px] border border-dashed border-slate-200">
            <p className="text-slate-400 text-sm italic font-inter">Belum ada artikel yang kamu simpan.</p>
          </div>
        )}
      </div>

      {/* bagian: Log Aktivitas */}
      <div className="bg-white rounded-[40px] p-10 border border-slate-100 shadow-sm">
        <h4 className="font-bold text-xl mb-8 flex items-center gap-2 text-on-surface font-manrope"><span className="material-symbols-outlined">history</span> Log Aktivitas</h4>
        <div className="space-y-6">
          {activityLogs.map((log) => (
            <div key={log.id} className="flex flex-col md:flex-row items-center gap-6 p-4 rounded-[28px] hover:bg-slate-50 transition-all border border-transparent hover:border-slate-50 group">
              <div className={`p-4 rounded-2xl ${log.color}`}><span className="material-symbols-outlined">{log.icon}</span></div>
              <div className="flex-1 text-center md:text-left"><h5 className="font-bold text-on-surface group-hover:text-primary transition-colors">{log.title}</h5><p className="text-xs text-slate-400">{log.desc}</p></div>
              <div className="text-right text-sm font-bold text-on-surface">{log.time}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-12 text-center">
        <p className="text-[10px] text-slate-300 font-bold uppercase tracking-[0.3em] font-manrope">Dermind Advanced Healthcare Intelligence • 2026</p>
      </div>
    </div>
  );
};

export default Profile;