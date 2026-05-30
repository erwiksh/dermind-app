import React, { useState, useEffect } from 'react';

const Articles = () => {
  const [activeCategory, setActiveCategory] = useState('Semua');
  const [selectedArticle, setSelectedArticle] = useState(null); // State untuk modal
  const [savedIds, setSavedIds] = useState([]); // State untuk bookmark

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('savedArticles')) || [];
    setSavedIds(saved);
  }, []);

  const categories = ['Semua', 'Skincare', 'Mental Health', 'Nutrisi', 'Olahraga', 'Kesehatan Anak'];

  const articles = [
    {
      id: 1,
      category: 'Skincare',
      title: 'Masa Depan Dermatologi: Bagaimana AI Mengubah Cara Kita Merawat Kulit',
      desc: 'Teknologi kecerdasan buatan kini mampu mendeteksi kondisi kulit dengan akurasi klinis hanya melalui kamera smartphone.',
      content: 'AI dalam dermatologi bukan lagi sekadar fiksi ilmiah. Dengan integrasi computer vision dan deep learning, aplikasi kesehatan modern kini dapat menganalisis tekstur kulit, mendeteksi pori-pori tersumbat, hingga memberikan peringatan dini terhadap lesi mencurigakan. Di Dermind, kami menggabungkan data klinis dengan kenyamanan penggunaan di rumah untuk memastikan setiap individu mendapatkan perawatan yang personal dan tepat waktu...',
      date: '24 Jan 2026',
      image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=800',
    },
    {
      id: 2,
      category: 'Mental Health',
      title: 'Kesehatan Mental di Era Digital',
      desc: 'Cara mengelola kecemasan akibat paparan media sosial berlebih.',
      content: 'Kesehatan mental di dunia yang serba cepat ini memerlukan perhatian ekstra. Paparan konstan terhadap notifikasi dan standar hidup yang tidak realistis di media sosial seringkali memicu hormon kortisol (stres). Teknik digital detox dan meditasi harian selama 5 menit terbukti secara klinis dapat menurunkan tingkat kecemasan sistem saraf pusat...',
      date: '23 Jan 2026',
      image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=400'
    },
    {
      id: 3,
      category: 'Nutrisi',
      title: 'Superfood untuk Imunitas',
      desc: 'Daftar makanan yang wajib dikonsumsi saat musim pancaroba.',
      content: 'Nutrisi adalah pondasi utama kesehatan fisik. Makanan seperti brokoli, buah beri, dan kacang-kacangan mengandung antioksidan tinggi yang melawan radikal bebas. Selain itu, asupan protein yang cukup mendukung regenerasi sel kulit yang rusak akibat paparan polusi sehari-hari...',
      date: '22 Jan 2026',
      image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=400'
    },
    {
      id: 4,
      category: 'Olahraga',
      title: 'Membangun Kebiasaan Yoga',
      desc: 'Tips untuk pemula yang ingin mulai meditasi dan yoga di rumah.',
      content: 'Yoga bukan hanya tentang fleksibilitas fisik, melainkan tentang koneksi antara nafas dan gerakan. Bagi pemula, memulai dengan pose harian seperti Mountain Pose atau Child Pose dapat membantu memperbaiki postur tubuh dan melancarkan sirkulasi darah yang berdampak langsung pada kecerahan kulit wajah...',
      date: '21 Jan 2026',
      image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=400'
    }
  ];

  // Fungsi simpan artikel
  const handleSave = (id) => {
    let updatedSaved;
    if (savedIds.includes(id)) {
      updatedSaved = savedIds.filter(savedId => savedId !== id);
    } else {
      updatedSaved = [...savedIds, id];
    }
    setSavedIds(updatedSaved);
    localStorage.setItem('savedArticles', JSON.stringify(updatedSaved));
  };

  // Fungsi share artikel
  const handleShare = (article) => {
    if (navigator.share) {
      navigator.share({
        title: article.title,
        text: article.desc,
        url: window.location.href,
      }).catch(console.error);
    } else {
      alert(`Link artikel "${article.title}" berhasil disalin!`);
    }
  };

  return (
    <div className="animate-in fade-in duration-700 pb-20 relative">
      
      {/* ===== POPUP MODAL BACA PENUH ===== */}
      {selectedArticle && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-md" onClick={() => setSelectedArticle(null)}></div>
          <div className="bg-white rounded-[40px] w-full max-w-4xl max-h-[90vh] overflow-y-auto relative z-10 animate-in zoom-in-95 duration-300 shadow-2xl custom-scrollbar">
            <div className="relative h-64 md:h-96">
              <img src={selectedArticle.image} className="w-full h-full object-cover" alt="" />
              <button 
                onClick={() => setSelectedArticle(null)}
                className="absolute top-6 right-6 bg-white/20 backdrop-blur-md text-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-white hover:text-primary transition-all"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="p-8 md:p-12">
              <div className="flex gap-4 mb-6">
                <span className="bg-primary/10 text-primary px-4 py-1 rounded-full text-xs font-bold uppercase">{selectedArticle.category}</span>
                <span className="text-slate-400 text-xs font-bold">{selectedArticle.date}</span>
              </div>
              <h3 className="text-3xl md:text-4xl font-manrope font-bold text-on-surface mb-8 leading-tight">
                {selectedArticle.title}
              </h3>
              <div className="prose prose-slate max-w-none">
                <p className="text-on-surface-variant text-lg leading-relaxed font-inter">
                  {selectedArticle.content}
                </p>
                <p className="text-on-surface-variant text-lg leading-relaxed font-inter mt-6">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. 
                </p>
              </div>
              <div className="mt-12 pt-8 border-t border-slate-100 flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <img src="https://i.pravatar.cc/150?u=dr" className="w-12 h-12 rounded-full border-2 border-primary-container" alt="" />
                  <div>
                    <p className="font-bold text-sm">Ditulis oleh Dr. Elena Vance</p>
                    <p className="text-xs text-slate-400">Pakar Dermatologi Dermind</p>
                  </div>
                </div>
                <button onClick={() => handleShare(selectedArticle)} className="bg-primary-container/20 text-primary px-6 py-3 rounded-xl font-bold text-sm flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm">share</span> Bagikan
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="mb-8">
        <h2 className="text-3xl font-manrope font-bold text-on-surface">Artikel Kesehatan</h2>
        <p className="text-on-surface-variant mt-1 font-inter">Pelajari tips dan wawasan medis dari para ahli kami.</p>
      </header>

      {/* Kategori */}
      <div className="flex gap-2 overflow-x-auto pb-4 mb-8 no-scrollbar">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-6 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all uppercase tracking-widest ${
              activeCategory === cat 
              ? 'bg-primary text-white shadow-md' 
              : 'bg-white text-slate-400 border border-slate-100 hover:border-primary/50 hover:text-primary'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Bagian Atas */}
      <div className="grid grid-cols-12 gap-6 mb-10">
        <div 
          onClick={() => setSelectedArticle(articles[0])} 
          className="col-span-12 lg:col-span-8 bg-white rounded-[32px] overflow-hidden border border-slate-100 shadow-sm relative group cursor-pointer h-[400px]"
        >
          <img src={articles[0].image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" alt="Hero" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-10 flex flex-col justify-end">
            <span className="bg-primary-container text-primary px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest w-fit mb-4">
              Trending
            </span>
            <h3 className="text-3xl font-bold text-white mb-4 leading-tight max-w-2xl">
              {articles[0].title}
            </h3>
            <p className="text-white/70 text-sm max-w-xl mb-6 line-clamp-2">
              {articles[0].desc}
            </p>
            <div className="flex items-center gap-4">
              <button className="text-white font-bold text-sm flex items-center gap-2 hover:gap-4 transition-all">
                Baca Selengkapnya <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </button>
            </div>
          </div>
        </div>

        {/* Artikel samping */}
        <div className="col-span-12 lg:col-span-4 flex flex-col gap-6">
          <div className="bg-white rounded-[32px] p-6 border border-slate-100 shadow-sm flex-1 flex flex-col justify-center hover:border-primary/20 transition-all cursor-pointer">
            <div className="flex items-center gap-2 text-primary-container mb-3 font-bold text-[9px] uppercase tracking-widest">
              <span className="material-symbols-outlined text-sm">bolt</span> Terbaru
            </div>
            <h4 className="font-bold text-on-surface mb-2 leading-snug line-clamp-2">
              Tips Menghindari Penuaan Dini dengan Retinol
            </h4>
            <p className="text-[10px] text-slate-400">Oleh Dr. Elena Vance • 12 Min Read</p>
          </div>
          <div className="bg-white rounded-[32px] p-6 border border-slate-100 shadow-sm flex-1 flex flex-col justify-center hover:border-primary/20 transition-all cursor-pointer">
            <div className="flex items-center gap-2 text-orange-400 mb-3 font-bold text-[9px] uppercase tracking-widest">
              <span className="material-symbols-outlined text-sm">psychology</span> Mental
            </div>
            <h4 className="font-bold text-on-surface mb-2 leading-snug line-clamp-2">
              Manfaat Meditasi 5 Menit di Pagi Hari
            </h4>
            <p className="text-[10px] text-slate-400">Oleh Psikolog Budi • 8 Min Read</p>
          </div>
        </div>
      </div>

      {/* Bagian tenggah: artikel 3 kolom */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {articles.slice(1).map((art) => (
          <div key={art.id} className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden group hover:border-primary/30 transition-all">
            <div className="h-48 overflow-hidden relative cursor-pointer" onClick={() => setSelectedArticle(art)}>
              <img src={art.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="article" />
              <span className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold text-primary uppercase">
                {art.category}
              </span>
            </div>
            <div className="p-6">
              <p className="text-[10px] text-slate-400 font-bold mb-2">{art.date}</p>
              <h4 onClick={() => setSelectedArticle(art)} className="font-bold text-on-surface mb-3 leading-tight line-clamp-2 group-hover:text-primary transition-colors cursor-pointer">
                {art.title}
              </h4>
              <p className="text-[11px] text-on-surface-variant line-clamp-2 leading-relaxed mb-4">
                {art.desc}
              </p>
              <div className="flex items-center justify-between border-t border-slate-50 pt-4">
                <div className="flex gap-4">
                  <button 
                    onClick={() => handleSave(art.id)} 
                    className={`material-symbols-outlined transition-colors ${savedIds.includes(art.id) ? 'text-primary fill-current' : 'text-slate-300 hover:text-primary'}`}
                    style={{ fontVariationSettings: `'FILL' ${savedIds.includes(art.id) ? 1 : 0}` }}
                  >
                    bookmark
                  </button>
                  <button onClick={() => handleShare(art)} className="material-symbols-outlined text-slate-300 hover:text-primary transition-colors">
                    share
                  </button>
                </div>
                <span className="material-symbols-outlined text-slate-300 hover:text-primary cursor-pointer" onClick={() => setSelectedArticle(art)}>open_in_full</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Bagaian Bawah */}
      <div className="mt-16 bg-primary rounded-[40px] p-12 text-center text-white relative overflow-hidden">
        <div className="relative z-10">
          <h3 className="text-3xl font-manrope font-bold mb-4">Jangan Lewatkan Insight Terbaru</h3>
          <p className="text-white/70 max-w-lg mx-auto mb-10 text-sm leading-relaxed">
            Dapatkan update artikel kesehatan, tips kecantikan, dan berita medis terbaru langsung di email Anda setiap minggu.
          </p>
          <div className="flex max-w-md mx-auto gap-3">
            <input 
              type="email" 
              placeholder="Masukkan email Anda" 
              className="flex-1 bg-white/10 border border-white/20 rounded-2xl px-6 py-4 text-white placeholder:text-white/40 focus:ring-0 outline-none"
            />
            <button className="bg-white text-primary px-8 rounded-2xl font-bold text-sm hover:scale-105 transition-transform">
              Berlangganan
            </button>
          </div>
        </div>
        <span className="material-symbols-outlined absolute -left-10 -bottom-10 text-[200px] text-white opacity-5">mail</span>
        <span className="material-symbols-outlined absolute -right-10 -top-10 text-[200px] text-white opacity-5 rotate-12">article</span>
      </div>
    </div>
  );
};

export default Articles;