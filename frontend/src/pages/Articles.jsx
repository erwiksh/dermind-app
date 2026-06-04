import React, { useState, useEffect } from 'react';
import api from '../services/api';

const Articles = () => {
  const [activeCategory, setActiveCategory] = useState('Semua');
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [savedIds, setSavedIds] = useState([]);
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    const saved =
      JSON.parse(
        localStorage.getItem(
          'savedArticles'
        )
      ) || [];

    setSavedIds(saved);
  }, []);

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      const response =
        await api.get(
          '/articles'
        );

      setArticles(
        response.data.data
      );

    } catch (error) {
      console.log(
        'Gagal mengambil artikel',
        error
      );
    }
  };

  const getArticleCategory = (article) => {
    const title = (article.title || '').toLowerCase();
    const content = (article.content || '').toLowerCase();
    
    if (title.includes('skincare') || title.includes('kulit') || title.includes('jerawat') || title.includes('wajah') || title.includes('serum') || title.includes('sunscreen') || title.includes('acne') || title.includes('dermatitis') ||
        content.includes('skincare') || content.includes('kulit') || content.includes('jerawat') || content.includes('wajah') || content.includes('serum') || content.includes('sunscreen') || content.includes('acne') || content.includes('dermatitis')) {
      return 'Skincare';
    }
    
    if (title.includes('mental') || title.includes('stres') || title.includes('stress') || title.includes('cemas') || title.includes('anxious') || title.includes('depresi') || title.includes('depressed') || title.includes('burnout') || title.includes('meditasi') || title.includes('psikolog') ||
        content.includes('mental') || content.includes('stres') || content.includes('stress') || content.includes('cemas') || content.includes('anxious') || content.includes('depresi') || content.includes('depressed') || content.includes('burnout') || content.includes('meditasi') || content.includes('psikolog')) {
      return 'Mental Health';
    }
    
    if (title.includes('nutrisi') || title.includes('makanan') || title.includes('diet') || title.includes('vitamin') || title.includes('makan') ||
        content.includes('nutrisi') || content.includes('makanan') || content.includes('diet') || content.includes('vitamin') || content.includes('makan')) {
      return 'Nutrisi';
    }
    
    if (title.includes('olahraga') || title.includes('lari') || title.includes('run') || title.includes('yoga') || title.includes('gym') || title.includes('fit') ||
        content.includes('olahraga') || content.includes('lari') || content.includes('run') || content.includes('yoga') || content.includes('gym') || content.includes('fit')) {
      return 'Olahraga';
    }
    
    if (title.includes('anak') || title.includes('bayi') || title.includes('balita') || title.includes('pediatrik') ||
        content.includes('anak') || content.includes('bayi') || content.includes('balita') || content.includes('pediatrik')) {
      return 'Kesehatan Anak';
    }
    
    return 'Skincare'; 
  };

  const filteredArticles = activeCategory === 'Semua'
    ? articles
    : articles.filter(art => getArticleCategory(art) === activeCategory);

  const categories = [
    'Semua',
    'Skincare',
    'Mental Health',
    'Nutrisi',
    'Olahraga',
    'Kesehatan Anak'
  ];

  // Simpan Artikel
  const handleSave = (id) => {

    let updatedSaved;

    if (
      savedIds.includes(id)
    ) {

      updatedSaved =
        savedIds.filter(
          savedId =>
            savedId !== id
        );

    } else {

      updatedSaved = [
        ...savedIds,
        id
      ];

    }

    setSavedIds(
      updatedSaved
    );

    localStorage.setItem(
      'savedArticles',
      JSON.stringify(
        updatedSaved
      )
    );
  };

  // Share Artikel
  const handleShare = (
    article
  ) => {

    if (
      navigator.share
    ) {

      navigator.share({
        title:
          article.title,
        text:
          article.content,
        url:
          window.location.href,
      }).catch(
        console.error
      );

    } else {

      alert(
        `Link artikel "${article.title}" berhasil disalin!`
      );

    }
  };

  return (
    <div className="animate-in fade-in duration-700 pb-20 relative">
      {/* ===== POPUP MODAL BACA PENUH ===== */}
{selectedArticle && (
  <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10">

    <div
      className="absolute inset-0 bg-black/40 backdrop-blur-md"
      onClick={() =>
        setSelectedArticle(null)
      }
    />

    <div className="bg-white rounded-[40px] w-full max-w-4xl max-h-[90vh] overflow-y-auto relative z-10 animate-in zoom-in-95 duration-300 shadow-2xl custom-scrollbar">

      <div className="relative h-64 md:h-96">

        <img
          src={
            selectedArticle.image
              ? (selectedArticle.image.startsWith("http") ? selectedArticle.image : `${import.meta.env.VITE_API_URL || "http://localhost:5002"}/uploads/${selectedArticle.image}`)
              : "https://placehold.co/1200x600?text=Artikel"
          }
          className="w-full h-full object-cover"
          alt={selectedArticle.title}
        />

        <button
          onClick={() =>
            setSelectedArticle(null)
          }
          className="absolute top-6 right-6 bg-white/20 backdrop-blur-md text-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-white hover:text-primary transition-all"
        >
          <span className="material-symbols-outlined">
            close
          </span>
        </button>

      </div>

      <div className="p-8 md:p-12">

        <div className="flex gap-4 mb-6">

          <span className="bg-primary/10 text-primary px-4 py-1 rounded-full text-xs font-bold uppercase">
            Artikel
          </span>

          <span className="text-slate-400 text-xs font-bold">
            {new Date(
              selectedArticle.created_at
            ).toLocaleDateString(
              "id-ID"
            )}
          </span>

        </div>

        <h3 className="text-3xl md:text-4xl font-manrope font-bold text-on-surface mb-8 leading-tight">
          {selectedArticle.title}
        </h3>

        <div className="prose prose-slate max-w-none">

          <p className="text-on-surface-variant text-lg leading-relaxed font-inter">
            {selectedArticle.content}
          </p>

        </div>

        <div className="mt-12 pt-8 border-t border-slate-100 flex justify-between items-center">

          <div className="flex items-center gap-4">

            <img
              src="https://i.pravatar.cc/150?u=author"
              className="w-12 h-12 rounded-full border-2 border-primary-container"
              alt=""
            />

            <div>

              <p className="font-bold text-sm">
                Admin Dermind
              </p>

              <p className="text-xs text-slate-400">
                Penulis Artikel
              </p>

            </div>

          </div>

          <button
            onClick={() =>
              handleShare(
                selectedArticle
              )
            }
            className="bg-primary-container/20 text-primary px-6 py-3 rounded-xl font-bold text-sm flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-sm">
              share
            </span>

            Bagikan
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
        {filteredArticles.length === 0 ? (
          <div className="col-span-12 text-center py-20 bg-white rounded-[32px] border border-dashed border-slate-200 w-full">
            <span className="material-symbols-outlined text-6xl text-slate-200 mb-4 animate-pulse">article</span>
            <p className="text-slate-400 font-bold font-manrope">Belum ada artikel di kategori ini</p>
            <p className="text-slate-300 text-xs mt-1">Coba pilih kategori lain atau kembali ke Semua.</p>
          </div>
        ) : (
          <>
            <div
              onClick={() =>
                setSelectedArticle(
                  filteredArticles[0]
                )
              }
              className="col-span-12 lg:col-span-8 bg-white rounded-[32px] overflow-hidden border border-slate-100 shadow-sm relative group cursor-pointer h-[400px]"
            >
              <img
                src={
                  filteredArticles[0]?.image
                    ? (filteredArticles[0].image.startsWith("http") ? filteredArticles[0].image : `${import.meta.env.VITE_API_URL || "http://localhost:5002"}/uploads/${filteredArticles[0].image}`)
                    : "https://placehold.co/1200x600?text=Artikel"
                }
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
                alt="Hero"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-10 flex flex-col justify-end">
                <span className="bg-primary-container text-primary px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest w-fit mb-4">
                  Trending
                </span>
                <h3 className="text-3xl font-bold text-white mb-4 leading-tight max-w-2xl font-manrope">
                  {filteredArticles[0]?.title}
                </h3>
                <p className="text-white/70 text-sm max-w-xl mb-6 line-clamp-2">
                  {
                    filteredArticles[0]?.content?.substring(
                      0,
                      150
                    ) + "..."
                  }
                </p>
                <div className="flex items-center gap-4">
                  <button className="text-white font-bold text-sm flex items-center gap-2 hover:gap-4 transition-all">
                    Baca Selengkapnya
                    <span className="material-symbols-outlined text-sm">
                      arrow_forward
                    </span>
                  </button>
                </div>
              </div>
            </div>

            {/* Artikel samping */}
            <div className="col-span-12 lg:col-span-4 flex flex-col gap-6">
              {filteredArticles.slice(1, 3).map((article, index) => (
                <div
                  key={article.id}
                  onClick={() =>
                    setSelectedArticle(article)
                  }
                  className="bg-white rounded-[32px] p-6 border border-slate-100 shadow-sm flex-1 flex flex-col justify-center hover:border-primary/20 transition-all cursor-pointer"
                >
                  <div
                    className={`flex items-center gap-2 mb-3 font-bold text-[9px] uppercase tracking-widest ${
                      index === 0
                        ? "text-primary"
                        : "text-orange-400"
                    }`}
                  >
                    <span className="material-symbols-outlined text-sm">
                      {index === 0
                        ? "bolt"
                        : "psychology"}
                    </span>
                    {index === 0
                      ? "Terbaru"
                      : "Artikel"}
                  </div>
                  <h4 className="font-bold text-on-surface mb-2 leading-snug line-clamp-2 font-manrope">
                    {article.title}
                  </h4>
                  <p className="text-[10px] text-slate-400">
                    {new Date(
                      article.created_at
                    ).toLocaleDateString("id-ID")}
                  </p>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Bagian Tengah: Artikel */}
<div className="grid grid-cols-1 md:grid-cols-3 gap-6">

  {filteredArticles.slice(1).map((art) => (

    <div
      key={art.id}
      className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden group hover:border-primary/30 transition-all"
    >

      <div
        className="h-48 overflow-hidden relative cursor-pointer"
        onClick={() => setSelectedArticle(art)}
      >

        <img
          src={
            art.image
              ? (art.image.startsWith("http") ? art.image : `${import.meta.env.VITE_API_URL || "http://localhost:5002"}/uploads/${art.image}`)
              : "https://placehold.co/600x400?text=Artikel"
          }
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          alt={art.title}
        />

        <span className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold text-primary uppercase">
          Artikel
        </span>

      </div>

      <div className="p-6">

        <p className="text-[10px] text-slate-400 font-bold mb-2">
          {new Date(
            art.created_at
          ).toLocaleDateString(
            "id-ID"
          )}
        </p>

        <h4
          onClick={() =>
            setSelectedArticle(art)
          }
          className="font-bold text-on-surface mb-3 leading-tight line-clamp-2 group-hover:text-primary transition-colors cursor-pointer"
        >
          {art.title}
        </h4>

        <p className="text-[11px] text-on-surface-variant line-clamp-2 leading-relaxed mb-4">
          {
            art.content
              ?.substring(
                0,
                120
              ) + "..."
          }
        </p>

        <div className="flex items-center justify-between border-t border-slate-50 pt-4">

          <div className="flex gap-4">

            <button
              onClick={() =>
                handleSave(
                  art.id
                )
              }
              className={`material-symbols-outlined transition-colors ${
                savedIds.includes(
                  art.id
                )
                  ? "text-primary fill-current"
                  : "text-slate-300 hover:text-primary"
              }`}
              style={{
                fontVariationSettings:
                  `'FILL' ${
                    savedIds.includes(
                      art.id
                    )
                      ? 1
                      : 0
                  }`,
              }}
            >
              bookmark
            </button>

            <button
              onClick={() =>
                handleShare(
                  art
                )
              }
              className="material-symbols-outlined text-slate-300 hover:text-primary transition-colors"
            >
              share
            </button>

          </div>

          <span
            className="material-symbols-outlined text-slate-300 hover:text-primary cursor-pointer"
            onClick={() =>
              setSelectedArticle(
                art
              )
            }
          >
            open_in_full
          </span>

        </div>

      </div>

    </div>

  ))}

</div>

    </div>
  );
};

export default Articles;