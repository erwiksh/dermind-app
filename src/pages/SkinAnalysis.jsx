import React, { useState } from 'react';

const SkinAnalysis = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [image, setImage] = useState(null);
  const [showResult, setShowResult] = useState(false);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));
      setShowResult(false);
    }
  };

  const startAnalysis = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      setShowResult(true);
    }, 3000);
  };

  return (
    <div className="animate-in fade-in duration-700 pb-20">
      {/* Header Section */}
      <div className="flex justify-between items-start mb-10">
        <div className="max-w-2xl">
          <h2 className="text-4xl font-manrope font-bold text-on-surface mb-3">AI Skin Detection</h2>
          <p className="text-on-surface-variant leading-relaxed">
            Deteksi kondisi kulit Anda secara instan menggunakan kecerdasan buatan medis tercanggih. 
            Dapatkan analisis detail dan rekomendasi perawatan personal dalam hitungan detik.
          </p>
        </div>
        <div className="flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full border border-primary/20">
          <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
          <span className="text-[10px] font-bold text-primary uppercase tracking-widest">AI Engine Active</span>
        </div>
      </div>

      {/* Main Analysis Area */}
      <div className="grid grid-cols-12 gap-6 mb-10">
        
        {/* CENTER: Area Unggah */}
        <div className="col-span-12 lg:col-span-7 bg-white rounded-[32px] p-8 border border-slate-100 shadow-sm flex flex-col items-center justify-center relative overflow-hidden group">
          <div className="w-full relative aspect-square max-w-[450px] rounded-[24px] bg-slate-50 border-2 border-dashed border-slate-200 overflow-hidden flex items-center justify-center">
            {image ? (
              <>
                <img src={image} className="w-full h-full object-cover" alt="Skin target" />
                {isScanning && (
                  <div className="absolute inset-0 z-20">
                    <div className="w-full h-1 bg-primary shadow-[0_0_20px_#4fbdba] absolute top-0 animate-scan"></div>
                    <div className="absolute inset-0 bg-primary/10 animate-pulse"></div>
                  </div>
                )}
                {/* Fokus Target AI Overlay */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-40 h-40 border-2 border-primary/40 rounded-xl relative">
                    <div className="absolute top-0 left-0 w-4 h-4 border-t-4 border-l-4 border-primary"></div>
                    <div className="absolute top-0 right-0 w-4 h-4 border-t-4 border-r-4 border-primary"></div>
                    <div className="absolute bottom-0 left-0 w-4 h-4 border-b-4 border-l-4 border-primary"></div>
                    <div className="absolute bottom-0 right-0 w-4 h-4 border-b-4 border-r-4 border-primary"></div>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center p-10">
                <span className="material-symbols-outlined text-7xl text-slate-200 mb-4">image_search</span>
                <h4 className="text-xl font-bold text-slate-400 mb-2">Unggah Foto Kulit</h4>
                <p className="text-xs text-slate-400">Tarik-lepas file atau klik untuk memilih gambar</p>
              </div>
            )}
          </div>

          <div className="mt-8 flex gap-4 w-full max-w-[450px]">
            <button className="flex-1 bg-slate-100 text-on-surface-variant py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-slate-200 transition-all">
              <span className="material-symbols-outlined text-xl">photo_camera</span> Ambil Foto
            </button>
            <div className="flex-1 relative">
              <input type="file" className="absolute inset-0 opacity-0 cursor-pointer z-10" onChange={handleFileUpload} />
              <button className="w-full bg-primary-container/20 text-primary py-4 rounded-2xl font-bold flex items-center justify-center gap-2 border border-primary/20">
                <span className="material-symbols-outlined text-xl">upload_file</span> Pilih File
              </button>
            </div>
          </div>
          
          {image && !showResult && (
            <button 
              onClick={startAnalysis} 
              className="mt-4 w-full max-w-[450px] bg-primary text-white py-4 rounded-2xl font-bold shadow-lg shadow-primary/20 animate-bounce"
            >
              {isScanning ? 'Menganalisis...' : 'Mulai Deteksi AI Sekarang'}
            </button>
          )}
        </div>

        {/* Kanan: Hasil */}
        <div className="col-span-12 lg:col-span-5 flex flex-col gap-6">
          {/* Status Deteksi Card */}
          <div className="bg-white rounded-[32px] p-8 border border-slate-100 shadow-sm relative overflow-hidden">
             <div className="flex justify-between items-center mb-6">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Status Analisis Terbaru</p>
                  <h4 className="text-2xl font-bold text-on-surface">Terdeteksi: <span className="text-primary">{showResult ? 'Sehat' : '---'}</span></h4>
                </div>
                <div className="bg-primary/10 p-3 rounded-2xl text-primary">
                  <span className="material-symbols-outlined">verified_user</span>
                </div>
             </div>
             
             <div className="space-y-5">
                <div>
                  <div className="flex justify-between text-[11px] font-bold mb-2 uppercase">
                    <span>Hidrasi Kulit</span>
                    <span className="text-primary">{showResult ? '88%' : '0%'}</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div className={`h-full bg-primary transition-all duration-1000`} style={{width: showResult ? '88%' : '0%'}}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-[11px] font-bold mb-2 uppercase">
                    <span>Tingkat Minyak</span>
                    <span className="text-orange-400">{showResult ? '42%' : '0%'}</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div className={`h-full bg-orange-400 transition-all duration-1000`} style={{width: showResult ? '42%' : '0%'}}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-[11px] font-bold mb-2 uppercase">
                    <span>Elastisitas</span>
                    <span className="text-indigo-400">{showResult ? '92%' : '0%'}</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div className={`h-full bg-indigo-400 transition-all duration-1000`} style={{width: showResult ? '92%' : '0%'}}></div>
                  </div>
                </div>
             </div>
          </div>

          {/* Rekomendasi AI */}
          <div className="bg-white rounded-[32px] p-8 border border-slate-100 shadow-sm flex-1">
             <div className="flex items-center gap-2 mb-6">
                <span className="material-symbols-outlined text-primary text-sm">auto_awesome</span>
                <h4 className="font-bold text-on-surface">Rekomendasi AI</h4>
             </div>
             <div className="space-y-4">
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex gap-4 items-center">
                   <div className="p-2 bg-white rounded-xl shadow-sm"><span className="material-symbols-outlined text-primary">sanitizer</span></div>
                   <div>
                      <p className="font-bold text-sm">Moisturizer Gel</p>
                      <p className="text-[10px] text-slate-500">Gunakan pelembab berbasis air.</p>
                   </div>
                </div>
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex gap-4 items-center">
                   <div className="p-2 bg-white rounded-xl shadow-sm"><span className="material-symbols-outlined text-orange-400">wb_sunny</span></div>
                   <div>
                      <p className="font-bold text-sm">Sunscreen SPF 50+</p>
                      <p className="text-[10px] text-slate-500">Perlindungan UV ekstra pagi hari.</p>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </div>

      {/* Bagian Bawah: Riwayat & Trend */}
      <div className="grid grid-cols-12 gap-6">
        {/* Riwayat Deteksi */}
        <div className="col-span-12 lg:col-span-4 bg-white rounded-[32px] p-8 border border-slate-100 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h4 className="font-bold">Riwayat Deteksi</h4>
            <button className="text-[10px] font-bold text-primary uppercase">Lihat Semua</button>
          </div>
          <div className="flex gap-4">
            <div className="w-20 h-20 rounded-2xl bg-slate-100 border border-slate-200 overflow-hidden">
               <img src="https://images.unsplash.com/photo-1556228720-195a672e8a03?q=80&w=200" className="w-full h-full object-cover grayscale opacity-50" />
            </div>
            <div className="w-20 h-20 rounded-2xl bg-slate-100 border border-slate-200 overflow-hidden">
               <img src="https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=200" className="w-full h-full object-cover grayscale opacity-50" />
            </div>
            <button className="w-20 h-20 rounded-2xl border-2 border-dashed border-slate-200 flex items-center justify-center text-slate-300">
               <span className="material-symbols-outlined">add</span>
            </button>
          </div>
        </div>

        {/* Trend Kesehatan Kulit (Visual Chart Area) */}
        <div className="col-span-12 lg:col-span-8 bg-white rounded-[32px] p-8 border border-slate-100 shadow-sm">
          <div className="flex justify-between items-center mb-8">
            <h4 className="font-bold text-on-surface">Trend Kesehatan Kulit</h4>
            <div className="flex gap-2">
              <button className="px-3 py-1 bg-primary/10 text-primary text-[10px] font-bold rounded-lg uppercase">Bulanan</button>
              <button className="px-3 py-1 text-slate-400 text-[10px] font-bold rounded-lg uppercase">Mingguan</button>
            </div>
          </div>
          
          {/* Mock Chart Visualization */}
          <div className="flex items-end justify-between h-32 gap-4 px-4">
            {[45, 60, 50, 85, 95, 70].map((h, i) => (
              <div key={i} className="flex-1 relative group">
                <div 
                  className={`w-full rounded-t-xl transition-all duration-1000 ${i === 4 ? 'bg-primary' : 'bg-slate-100 group-hover:bg-primary/20'}`} 
                  style={{height: showResult ? `${h}%` : '10%'}}
                ></div>
                {i === 4 && showResult && (
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-primary text-white text-[8px] px-2 py-1 rounded font-bold whitespace-nowrap">
                    Poin Tertinggi
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>


      {/* Style untuk Animasi Scan */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes scanAnim {
          0% { top: 0; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
        .animate-scan {
          animation: scanAnim 3s ease-in-out infinite;
        }
      `}} />
    </div>
  );
};

export default SkinAnalysis;