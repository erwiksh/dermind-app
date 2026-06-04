import React, { useState, useEffect } from 'react';

const API_BASE =
  (import.meta.env.VITE_API_BASE_URL || 'http://localhost:5002/api') + '/community';

const formatTime = (isoString) => {
  const date = new Date(isoString);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return 'Baru saja';
  if (diffMins < 60) return `${diffMins} Menit yang lalu`;
  if (diffHours < 24) return `${diffHours} Jam yang lalu`;
  return `${diffDays} Hari yang lalu`;
};


const Community = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showTrends, setShowTrends] = useState(false);
  const [activeComments, setActiveComments] = useState(null);
  const [posts, setPosts] = useState([]);
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostContent, setNewPostContent] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isPosting, setIsPosting] = useState(false);

  const [comments, setComments] =
  useState([]);

  const [newComment, setNewComment] =
    useState("");
  // Fetch semua post dari API
  const fetchPosts = async () => {
    try {
      setIsLoading(true);
      const res = await fetch(API_BASE);
      const json = await res.json();
      if (json.success) {
        setPosts(json.data);
      }
    } catch (err) {
      console.error('Gagal mengambil data post:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  // Buat post baru
  const handlePost = async () => {

  if (
    !newPostTitle.trim() ||
    !newPostContent.trim()
  ) return;

  setIsPosting(true);

  try {

    const token =
      localStorage.getItem(
        "token"
      );

    const res =
      await fetch(
        API_BASE,
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
            Authorization:
              `Bearer ${token}`,
          },
          body: JSON.stringify({
            title:
              newPostTitle,
            content:
              newPostContent,
          }),
        }
      );

    const json =
      await res.json();

    console.log(json);

    if (json.success) {

      setPosts([
        json.data,
        ...posts,
      ]);

      setNewPostTitle("");
      setNewPostContent("");

      alert(
        "Posting berhasil dibuat"
      );

    }

  } catch (err) {

    console.error(
      "Gagal membuat post:",
      err
    );

  } finally {

    setIsPosting(false);

  }

};
const handleComment =
async () => {

  if (
    !newComment.trim()
  ) return;

  try {

    const token =
      localStorage.getItem(
        "token"
      );

    const res =
      await fetch(
        (import.meta.env.VITE_API_BASE_URL || "http://localhost:5002/api") + "/comments",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
            Authorization:
              `Bearer ${token}`
          },
          body: JSON.stringify({
            post_id:
              activeComments.id,
            comment:
              newComment
          })
        }
      );

    const json =
      await res.json();

    if (json.success) {

      setComments([
        ...comments,
        json.data
      ]);

      setNewComment("");

    }

  } catch (error) {

    console.log(error);

  }

};
  const filteredPosts = posts.filter((post) =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.content.toLowerCase().includes(searchTerm.toLowerCase())
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
    
    <div
      className="absolute inset-0 bg-black/40 backdrop-blur-sm"
      onClick={() => setActiveComments(null)}
    ></div>

    <div className="bg-white rounded-[40px] p-8 max-w-lg w-full relative z-10 animate-in slide-in-from-bottom-10 shadow-2xl">

      <h3 className="text-xl font-bold mb-6">
        Komentar Diskusi
      </h3>

      {/* LIST KOMENTAR */}
      <div className="space-y-4 max-h-80 overflow-y-auto mb-6">

        {comments.length > 0 ? (

          comments.map((item) => (
            <div
              key={item.id}
              className="bg-slate-50 p-4 rounded-2xl border border-slate-100"
            >
              <h4 className="font-bold text-sm text-on-surface">
                {item.author_name}
              </h4>

              <p className="text-sm text-slate-600 mt-2">
                {item.comment}
              </p>

              <p className="text-[10px] text-slate-400 mt-2">
                {formatTime(item.created_at)}
              </p>
            </div>
          ))

        ) : (

          <div className="text-center py-8">
            <p className="text-slate-400 text-sm">
              Belum ada komentar
            </p>
          </div>

        )}

      </div>

      {/* INPUT KOMENTAR */}
      <div className="flex gap-3 mb-4">

        <input
          type="text"
          value={newComment}
          onChange={(e) =>
            setNewComment(
              e.target.value
            )
          }
          placeholder="Tulis komentar..."
          className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm outline-none focus:border-primary"
        />

        <button
          onClick={handleComment}
          className="bg-primary text-white px-5 py-3 rounded-2xl font-bold text-sm"
        >
          Kirim
        </button>

      </div>

      {/* BUTTON TUTUP */}
      <button
        onClick={() => setActiveComments(null)}
        className="w-full bg-slate-100 text-slate-600 py-3 rounded-2xl font-bold text-sm"
      >
        Tutup
      </button>

    </div>

  </div>
)}

      {/* BAGIAN KIRI */}
      <div className="flex-1 space-y-6">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-3xl font-manrope font-bold text-on-surface">Diskusi Komunitas</h2>
            <p className="text-on-surface-variant mt-1">Berbagi pengalaman dan tumbuh bersama member lainnya.</p>
          </div>
        </div>

        {/* Input Post */}
        <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm space-y-3">
          <div className="flex items-center gap-4">
            <img src="https://i.pravatar.cc/150?u=anggia" className="w-12 h-12 rounded-2xl object-cover" alt="User" />
            <input
              type="text"
              placeholder="Judul diskusi..."
              value={newPostTitle}
              onChange={(e) => setNewPostTitle(e.target.value)}
              className="flex-1 bg-slate-50 border-none rounded-2xl py-3 px-5 text-sm font-semibold focus:ring-2 focus:ring-primary/20 transition-all"
            />
          </div>
          <div className="flex items-end gap-4 pl-16">
            <textarea
              placeholder="Apa yang ingin kamu bagikan hari ini?"
              value={newPostContent}
              onChange={(e) => setNewPostContent(e.target.value)}
              rows={2}
              className="flex-1 bg-slate-50 border-none rounded-2xl py-3 px-5 text-sm focus:ring-2 focus:ring-primary/20 transition-all resize-none"
            />
            <button
              onClick={handlePost}
              disabled={isPosting || !newPostTitle.trim() || !newPostContent.trim()}
              className="bg-primary text-white px-6 py-3 rounded-2xl font-bold text-sm shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPosting ? 'Posting...' : 'Posting'}
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xl">search</span>
          <input
            type="text"
            placeholder="Cari diskusi..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white border border-slate-100 rounded-2xl py-3 pl-11 pr-5 text-sm shadow-sm focus:ring-2 focus:ring-primary/20 transition-all"
          />
        </div>

        {/* Feed Posts */}
        <div className="space-y-6">
          {isLoading ? (
            <div className="text-center py-16 text-slate-400 text-sm">Memuat diskusi...</div>
          ) : filteredPosts.length === 0 ? (
            <div className="text-center py-16 text-slate-400 text-sm">Belum ada diskusi.</div>
          ) : (
            filteredPosts.map((post) => (
              <div key={post.id} className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden hover:border-primary/30 transition-all group">
                <div className="p-8">
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex gap-4">
                      <img
                        src={`https://i.pravatar.cc/150?u=${post.user_id}`}
                        className="w-12 h-12 rounded-2xl object-cover"
                        alt={`User ${post.user_id}`}
                      />
                      <div>
                        <h4 className="font-bold text-on-surface">
                          {post.author_name || `User #${post.user_id}`}
                        </h4>
                        <p className="text-xs text-slate-400 font-medium">{formatTime(post.created_at)}</p>
                      </div>
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-on-surface mb-3">{post.title}</h3>
                  <p className="text-on-surface-variant text-sm leading-relaxed mb-6">{post.content}</p>

                  <div className="flex items-center gap-6 pt-6 border-t border-slate-50">

                    {/* COMMENT BUTTON */}
                    <button
                      onClick={async () => {

                      setActiveComments(post);

                      try {

                        const res =
                          await fetch(
                            `${import.meta.env.VITE_API_BASE_URL || "http://localhost:5002/api"}/comments/post/${post.id}`
                          );

                        const json =
                          await res.json();

                        if (json.success) {
                          setComments(
                            json.data
                          );
                        }

                      } catch (error) {

                        console.log(error);

                      }

                    }}
                      className="flex items-center gap-2 text-slate-400 hover:text-primary transition-colors"
                    >
                      <span className="material-symbols-outlined text-xl">chat_bubble</span>
                      <span className="text-xs font-bold">Komentar</span>
                    </button>

                    {/* SHARE BUTTON */}
                    <button
                      onClick={() => {
                        if (navigator.share) {
                          navigator.share({ title: post.title, text: post.content, url: window.location.href });
                        } else {
                          alert('Link diskusi berhasil disalin!');
                        }
                      }}
                      className="flex items-center gap-2 text-slate-400 hover:text-primary transition-colors ml-auto"
                    >
                      <span className="material-symbols-outlined text-xl">share</span>
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      

      
    </div>
  );
};

export default Community;