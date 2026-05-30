import React, { useState } from 'react';

const Community = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showTrends, setShowTrends] = useState(false);
  const [activeComments, setActiveComments] = useState(null);

  const [posts, setPosts] = useState([
    {
      id: 1,
      author: "Erwiyana",
      role: "Member Platinum",
      time: "2 Jam yang lalu",
      category: "Skincare",
      title: "Rekomendasi Serum untuk Skin Barrier",
      content: "Halo semua, saya mau berbagi pengalaman pakai serum niacinamide selama 2 minggu terakhir. Tekstur kulit jadi lebih halus dan kemerahan berkurang drastis!",
      image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=800",
      likes: 124,
      comments: [
        { user: "Rekal", text: "Wah merk apa itu bro?" },
        { user: "Winson", text: "Niacinamide emang juara buat kemerahan." }
      ],
      isLiked: false
    },
    {
      id: 2,
      author: "Anggi",
      role: "Health Enthusiast",
      time: "5 Jam yang lalu",
      category: "Mental Health",
      title: "Tips Mengatur Waktu Tidur",
      content: "Ternyata bener ya, kualitas tidur itu pengaruh banget ke mood seharian. Ada yang punya ritual sebelum tidur supaya lebih nyenyak?",
      image: null,
      likes: 89,
      comments: [
        { user: "Rani", text: "Coba dengerin podcast meditasi deh." }
      ],
      isLiked: false
    }
  ]);

  // Fungsi like
  const handleLike = (id) => {
    setPosts(posts.map(post => {
      if (post.id === id) {
        return {
          ...post,
          likes: post.isLiked ? post.likes - 1 : post.likes + 1,
          isLiked: !post.isLiked
        };
      }
      return post;
    }));
  };

  // Fungsi share
  const handleShare = (post) => {
    if (navigator.share) {
      navigator.share({ title: post.title, text: post.content, url: window.location.href });
    } else {
      alert("Link diskusi berhasil disalin!");
    }
  };

  const filteredPosts = posts.filter(post => 
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex gap-8 animate-in fade-in duration-700 relative">
      
      {/* ===== MODAL TREN LAINNYA ===== */}
      {showTrends && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowTrends(false)}></div>
          <div className="bg-white rounded-[40px] p-10 max-w-md w-full relative z-10 animate-in zoom-in-95 shadow-2xl">
            <h3 className="text-2xl font-bold mb-6 text-on-surface">Tren Komunitas</h3>
            <div className="space-y-4">
              {['#SkincareRoutine', '#MentalAwareness', '#HealthyLifestyle', '#AcneSurvivor', '#MorningYoga'].map((tag, i) => (
                <div key={i} className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <span className="font-bold text-primary">{tag}</span>
                  <span className="text-xs text-slate-400">{(10 - i) * 120} Diskusi</span>
                </div>
              ))}
            </div>
            <button onClick={() => setShowTrends(false)} className="w-full mt-8 bg-primary text-white py-4 rounded-2xl font-bold">Tutup</button>
          </div>
        </div>
      )}

      {/* ===== MODAL KOMENTAR ===== */}
      {activeComments && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setActiveComments(null)}></div>
          <div className="bg-white rounded-[40px] p-10 max-w-lg w-full relative z-10 animate-in slide-in-from-bottom-10 shadow-2xl">
            <h3 className="text-xl font-bold mb-6">Komentar ({activeComments.comments.length})</h3>
            <div className="space-y-4 mb-8 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
              {activeComments.comments.map((c, i) => (
                <div key={i} className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <p className="text-xs font-bold text-primary mb-1">{c.user}</p>
                  <p className="text-sm text-on-surface-variant">{c.text}</p>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input type="text" placeholder="Tulis komentar..." className="flex-1 bg-slate-50 border-none rounded-xl px-4 text-sm focus:ring-1 focus:ring-primary" />
              <button className="bg-primary text-white px-6 py-2 rounded-xl font-bold text-sm">Kirim</button>
            </div>
          </div>
        </div>
      )}

      {/* BAGIAN KIRI*/}
      <div className="flex-1 space-y-6">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-3xl font-manrope font-bold text-on-surface">Diskusi Komunitas</h2>
            <p className="text-on-surface-variant mt-1">Berbagi pengalaman dan tumbuh bersama member lainnya.</p>
          </div>
        </div>

        {/* Input Post */}
        <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm flex items-center gap-4">
          <img src="https://i.pravatar.cc/150?u=anggia" className="w-12 h-12 rounded-2xl object-cover" alt="User" />
          <input 
            type="text" 
            placeholder="Apa yang ingin kamu bagikan hari ini?" 
            className="flex-1 bg-slate-50 border-none rounded-2xl py-4 px-6 text-sm focus:ring-2 focus:ring-primary/20 transition-all"
          />
          <button className="bg-primary text-white px-6 py-3 rounded-2xl font-bold text-sm shadow-lg shadow-primary/20">Posting</button>
        </div>

        {/* Feed Posts */}
        <div className="space-y-6">
         {filteredPosts.map((post) => ( 
            <div key={post.id} className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden hover:border-primary/30 transition-all group">
              <div className="p-8">
                <div className="flex justify-between items-start mb-6">
                  <div className="flex gap-4">
                    <img src={`https://i.pravatar.cc/150?u=${post.author}`} className="w-12 h-12 rounded-2xl object-cover" alt={post.author} />
                    <div>
                      <h4 className="font-bold text-on-surface flex items-center gap-2">
                        {post.author}
                        <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full uppercase tracking-tighter">{post.category}</span>
                      </h4>
                      <p className="text-xs text-slate-400 font-medium">{post.role} • {post.time}</p>
                    </div>
                  </div>
                </div>

                <h3 className="text-xl font-bold text-on-surface mb-3">{post.title}</h3>
                <p className="text-on-surface-variant text-sm leading-relaxed mb-6">{post.content}</p>

                {post.image && (
                  <div className="rounded-[24px] overflow-hidden mb-6 aspect-video bg-slate-100">
                    <img src={post.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt="Post content" />
                  </div>
                )}

                <div className="flex items-center gap-6 pt-6 border-t border-slate-50">
                  
                  {/* LIKE BUTTON*/}
                  <button 
                    onClick={() => handleLike(post.id)}
                    className={`flex items-center gap-2 transition-all duration-300 transform active:scale-125 ${post.isLiked ? 'text-red-500' : 'text-slate-400 hover:text-red-400'}`}
                  >
                    <span 
                        className="material-symbols-outlined text-2xl" 
                        style={{ fontVariationSettings: `'FILL' ${post.isLiked ? 1 : 0}, 'wght' 400, 'GRAD' 0, 'opsz' 24` }}
                    >
                        {post.isLiked ? 'favorite' : 'favorite'}
                    </span>
                    <span className={`text-xs font-bold ${post.isLiked ? 'text-red-500' : 'text-slate-400'}`}>
                        {post.likes}
                    </span>
                  </button>

                  {/* COMMENT BUTTON */}
                  <button 
                    onClick={() => setActiveComments(post)}
                    className="flex items-center gap-2 text-slate-400 hover:text-primary transition-colors"
                  >
                    <span className="material-symbols-outlined text-xl">chat_bubble</span>
                    <span className="text-xs font-bold">{post.comments.length}</span>
                  </button>

                  {/* SHARE BUTTON */}
                  <button 
                    onClick={() => handleShare(post)}
                    className="flex items-center gap-2 text-slate-400 hover:text-primary transition-colors ml-auto"
                  >
                    <span className="material-symbols-outlined text-xl">share</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* BAGIAN KANAN*/}
      <div className="w-[320px] space-y-6">
        <div className="bg-white rounded-[32px] p-8 border border-slate-100 shadow-sm">
          <h4 className="font-bold text-on-surface mb-6">Topik Populer</h4>
          <div className="space-y-6">
            <div>
              <div className="flex justify-between text-xs font-bold mb-2"><span>#SkincareRoutine</span><span className="text-primary">85%</span></div>
              <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden"><div className="h-full bg-primary" style={{width: '85%'}}></div></div>
            </div>
            <div>
              <div className="flex justify-between text-xs font-bold mb-2"><span>#MentalAwareness</span><span className="text-primary">62%</span></div>
              <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden"><div className="h-full bg-primary-container" style={{width: '62%'}}></div></div>
            </div>
          </div>
          <p 
            onClick={() => setShowTrends(true)}
            className="text-[10px] text-center text-slate-400 font-bold uppercase mt-6 tracking-widest cursor-pointer hover:text-primary transition-colors"
          >
            Lihat Tren Lainnya
          </p>
        </div>

        <div className="bg-white rounded-[32px] p-8 border border-slate-100 shadow-sm">
          <h4 className="font-bold text-on-surface mb-6">Aktif Hari Ini</h4>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img src="https://i.pravatar.cc/150?u=1" className="w-8 h-8 rounded-xl object-cover" alt="user" />
                <p className="text-xs font-bold">Dr. Sarah Wijaya</p>
              </div>
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
            </div>
          </div>
        </div>

        <div className="bg-primary rounded-[32px] p-8 shadow-lg shadow-primary/20 relative overflow-hidden group">
          <div className="relative z-10 text-white">
            <p className="text-xs font-bold opacity-60 uppercase mb-1">Skor Keaktifan Di</p>
            <h4 className="text-2xl font-bold mb-6">Komunitas</h4>
            <div className="flex items-baseline gap-1"><span className="text-5xl font-bold">82</span><span className="text-lg opacity-50">/100</span></div>
          </div>
          <span className="material-symbols-outlined absolute -right-4 -bottom-4 text-8xl text-white opacity-10">trending_up</span>
        </div>
      </div>
    </div>
  );
};

export default Community;