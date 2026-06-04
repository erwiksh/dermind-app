import React, { useState, useEffect } from "react";
import api from "../services/api";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("stats");
  const [stats, setStats] = useState({
    users: 0,
    articles: 0,
    community_posts: 0,
    comments: 0,
    events: 0,
  });

  // State Kelola User
  const [users, setUsers] = useState([]);
  const [userSearch, setUserSearch] = useState("");

  // State Kelola Artikel
  const [articles, setArticles] = useState([]);
  const [articleSearch, setArticleSearch] = useState("");
  const [articleModal, setArticleModal] = useState({
    isOpen: false,
    mode: "add", // "add" or "edit"
    id: null,
    title: "",
    content: "",
    image: "",
  });

  // State Kelola Komunitas & Komentar
  const [posts, setPosts] = useState([]);
  const [postSearch, setPostSearch] = useState("");
  const [commentModal, setCommentModal] = useState({
    isOpen: false,
    postId: null,
    postTitle: "",
    comments: [],
  });

  // State Kelola Event
  const [events, setEvents] = useState([]);
  const [eventSearch, setEventSearch] = useState("");
  const [eventModal, setEventModal] = useState({
    isOpen: false,
    mode: "add",
    id: null,
    title: "",
    description: "",
    location: "",
    image: "",
    event_date: "",
  });

  // Loading & Error States
  const [loading, setLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    // Get logged in user details
    const userJson = localStorage.getItem("user");
    if (userJson) {
      setCurrentUser(JSON.parse(userJson));
    }
    fetchStats();
  }, []);

  useEffect(() => {
    if (activeTab === "users") {
      fetchUsers();
    } else if (activeTab === "articles") {
      fetchArticles();
    } else if (activeTab === "community") {
      fetchPosts();
    } else if (activeTab === "events") {
      fetchEvents();
    }
  }, [activeTab]);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await api.get("/dashboard");
      if (res.data.success) {
        setStats(res.data.data);
      }
    } catch (err) {
      console.error("Gagal mengambil statistik:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await api.get("/admin/users");
      if (res.data.success) {
        setUsers(res.data.data);
      }
    } catch (err) {
      console.error("Gagal mengambil data user:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchArticles = async () => {
    try {
      setLoading(true);
      const res = await api.get("/articles");
      if (res.data.success) {
        setArticles(res.data.data);
      }
    } catch (err) {
      console.error("Gagal mengambil artikel:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const res = await api.get("/community");
      if (res.data.success) {
        setPosts(res.data.data);
      }
    } catch (err) {
      console.error("Gagal mengambil postingan komunitas:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const res = await api.get("/events");
      if (res.data.success) {
        setEvents(res.data.data);
      }
    } catch (err) {
      console.error("Gagal mengambil data event:", err);
    } finally {
      setLoading(false);
    }
  };

  // Simpan Event (Tambah / Edit)
  const handleSaveEvent = async (e) => {
    e.preventDefault();
    if (!eventModal.title || !eventModal.description || !eventModal.event_date) {
      alert("Judul, deskripsi, dan tanggal event harus diisi");
      return;
    }

    try {
      const payload = {
        title: eventModal.title,
        description: eventModal.description,
        location: eventModal.location || "Online",
        image: eventModal.image || "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=400",
        event_date: eventModal.event_date,
      };

      if (eventModal.mode === "add") {
        const res = await api.post("/events", payload);
        if (res.data.success) {
          alert("Event berhasil ditambahkan");
          setEventModal({ isOpen: false, mode: "add", id: null, title: "", description: "", location: "", image: "", event_date: "" });
          fetchEvents();
          fetchStats();
        }
      } else {
        const res = await api.put(`/events/${eventModal.id}`, payload);
        if (res.data.success) {
          alert("Event berhasil diperbarui");
          setEventModal({ isOpen: false, mode: "add", id: null, title: "", description: "", location: "", image: "", event_date: "" });
          fetchEvents();
        }
      }
    } catch (err) {
      alert(err.response?.data?.message || "Gagal menyimpan event");
    }
  };

  // Hapus Event
  const handleDeleteEvent = async (id, title) => {
    if (window.confirm(`Apakah Anda yakin ingin menghapus event "${title}"?`)) {
      try {
        const res = await api.delete(`/events/${id}`);
        if (res.data.success) {
          alert("Event berhasil dihapus");
          fetchEvents();
          fetchStats();
        }
      } catch (err) {
        alert(err.response?.data?.message || "Gagal menghapus event");
      }
    }
  };

  // Hapus User
  const handleDeleteUser = async (id, name) => {
    if (window.confirm(`Apakah Anda yakin ingin menghapus user "${name}"? Semua data terkait (postingan, komentar) akan dihapus secara permanen.`)) {
      try {
        const res = await api.delete(`/admin/users/${id}`);
        if (res.data.success) {
          alert("User berhasil dihapus");
          fetchUsers();
          fetchStats(); // Update count
        }
      } catch (err) {
        alert(err.response?.data?.message || "Gagal menghapus user");
      }
    }
  };

  // Simpan Artikel (Tambah / Edit)
  const handleSaveArticle = async (e) => {
    e.preventDefault();
    if (!articleModal.title || !articleModal.content) {
      alert("Judul dan konten artikel harus diisi");
      return;
    }

    try {
      const payload = {
        title: articleModal.title,
        content: articleModal.content,
        image: articleModal.image || "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=400",
      };

      if (articleModal.mode === "add") {
        const res = await api.post("/articles", payload);
        if (res.data.success) {
          alert("Artikel berhasil ditambahkan");
          setArticleModal({ isOpen: false, mode: "add", id: null, title: "", content: "", image: "" });
          fetchArticles();
          fetchStats();
        }
      } else {
        const res = await api.put(`/articles/${articleModal.id}`, payload);
        if (res.data.success) {
          alert("Artikel berhasil diperbarui");
          setArticleModal({ isOpen: false, mode: "add", id: null, title: "", content: "", image: "" });
          fetchArticles();
        }
      }
    } catch (err) {
      alert(err.response?.data?.message || "Gagal menyimpan artikel");
    }
  };

  // Hapus Artikel
  const handleDeleteArticle = async (id, title) => {
    if (window.confirm(`Apakah Anda yakin ingin menghapus artikel "${title}"?`)) {
      try {
        const res = await api.delete(`/articles/${id}`);
        if (res.data.success) {
          alert("Artikel berhasil dihapus");
          fetchArticles();
          fetchStats();
        }
      } catch (err) {
        alert(err.response?.data?.message || "Gagal menghapus artikel");
      }
    }
  };

  // Hapus Postingan Komunitas
  const handleDeletePost = async (id, title) => {
    if (window.confirm(`Apakah Anda yakin ingin menghapus postingan "${title || "Tanpa Judul"}"? Semua komentar di dalamnya juga akan terhapus.`)) {
      try {
        const res = await api.delete(`/community/${id}`);
        if (res.data.success) {
          alert("Postingan berhasil dihapus");
          fetchPosts();
          fetchStats();
        }
      } catch (err) {
        alert(err.response?.data?.message || "Gagal menghapus postingan");
      }
    }
  };

  // Lihat Komentar Postingan
  const handleOpenComments = async (postId, postTitle) => {
    try {
      const res = await api.get(`/comments/post/${postId}`);
      if (res.data.success) {
        setCommentModal({
          isOpen: true,
          postId,
          postTitle,
          comments: res.data.data,
        });
      }
    } catch (err) {
      alert("Gagal memuat komentar");
    }
  };

  // Hapus Komentar
  const handleDeleteComment = async (commentId) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus komentar ini?")) {
      try {
        const res = await api.delete(`/comments/${commentId}`);
        if (res.data.success) {
          alert("Komentar berhasil dihapus");
          // Refresh komentar di modal
          const updatedComments = commentModal.comments.filter(c => c.id !== commentId);
          setCommentModal(prev => ({
            ...prev,
            comments: updatedComments
          }));
          fetchStats(); // Update comment count
        }
      } catch (err) {
        alert(err.response?.data?.message || "Gagal menghapus komentar");
      }
    }
  };

  // Filter lists based on search keys
  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.email.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.role.toLowerCase().includes(userSearch.toLowerCase())
  );

  const filteredArticles = articles.filter(
    (a) =>
      a.title.toLowerCase().includes(articleSearch.toLowerCase()) ||
      a.content.toLowerCase().includes(articleSearch.toLowerCase())
  );

  const filteredPosts = posts.filter(
    (p) =>
      (p.title && p.title.toLowerCase().includes(postSearch.toLowerCase())) ||
      p.content.toLowerCase().includes(postSearch.toLowerCase()) ||
      p.author_name.toLowerCase().includes(postSearch.toLowerCase())
  );

  const filteredEvents = events.filter(
    (ev) =>
      ev.title.toLowerCase().includes(eventSearch.toLowerCase()) ||
      ev.description.toLowerCase().includes(eventSearch.toLowerCase()) ||
      (ev.location && ev.location.toLowerCase().includes(eventSearch.toLowerCase()))
  );

  return (
    <div className="animate-in fade-in duration-500 relative">
      {/* ===== MENU TAB MINI ===== */}
      <div className="flex gap-2 p-1.5 bg-slate-100/80 backdrop-blur rounded-[20px] mb-8 w-fit border border-slate-200/50">
        <button
          onClick={() => setActiveTab("stats")}
          className={`flex items-center gap-2 px-6 py-3 rounded-2xl text-xs font-bold transition-all ${
            activeTab === "stats"
              ? "bg-white text-primary shadow-sm"
              : "text-slate-500 hover:text-primary"
          }`}
        >
          <span className="material-symbols-outlined text-lg">dashboard</span>
          Statistik Ringkas
        </button>
        <button
          onClick={() => setActiveTab("users")}
          className={`flex items-center gap-2 px-6 py-3 rounded-2xl text-xs font-bold transition-all ${
            activeTab === "users"
              ? "bg-white text-primary shadow-sm"
              : "text-slate-500 hover:text-primary"
          }`}
        >
          <span className="material-symbols-outlined text-lg">group</span>
          Kelola User
        </button>
        <button
          onClick={() => setActiveTab("articles")}
          className={`flex items-center gap-2 px-6 py-3 rounded-2xl text-xs font-bold transition-all ${
            activeTab === "articles"
              ? "bg-white text-primary shadow-sm"
              : "text-slate-500 hover:text-primary"
          }`}
        >
          <span className="material-symbols-outlined text-lg">article</span>
          Kelola Artikel
        </button>
        <button
          onClick={() => setActiveTab("community")}
          className={`flex items-center gap-2 px-6 py-3 rounded-2xl text-xs font-bold transition-all ${
            activeTab === "community"
              ? "bg-white text-primary shadow-sm"
              : "text-slate-500 hover:text-primary"
          }`}
        >
          <span className="material-symbols-outlined text-lg">forum</span>
          Kelola Komunitas
        </button>
        <button
          onClick={() => setActiveTab("events")}
          className={`flex items-center gap-2 px-6 py-3 rounded-2xl text-xs font-bold transition-all ${
            activeTab === "events"
              ? "bg-white text-primary shadow-sm"
              : "text-slate-500 hover:text-primary"
          }`}
        >
          <span className="material-symbols-outlined text-lg">calendar_month</span>
          Kelola Event
        </button>
      </div>

      {/* Loading state indicator */}
      {loading && (
        <div className="flex justify-center items-center py-10">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      )}

      {/* ===== TAB 1: STATS ===== */}
      {!loading && activeTab === "stats" && (
        <div className="space-y-8 animate-in fade-in duration-300">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-[32px] p-8 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
              <div className="bg-blue-50 p-4 rounded-2xl text-blue-500 w-fit mb-6">
                <span className="material-symbols-outlined text-2xl">group</span>
              </div>
              <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Total User</p>
              <h3 className="text-4xl font-manrope font-bold text-on-surface mt-2">{stats.users}</h3>
            </div>

            <div className="bg-white rounded-[32px] p-8 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
              <div className="bg-emerald-50 p-4 rounded-2xl text-emerald-500 w-fit mb-6">
                <span className="material-symbols-outlined text-2xl">article</span>
              </div>
              <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Total Artikel</p>
              <h3 className="text-4xl font-manrope font-bold text-on-surface mt-2">{stats.articles}</h3>
            </div>

            <div className="bg-white rounded-[32px] p-8 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
              <div className="bg-indigo-50 p-4 rounded-2xl text-indigo-500 w-fit mb-6">
                <span className="material-symbols-outlined text-2xl">forum</span>
              </div>
              <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Post Komunitas</p>
              <h3 className="text-4xl font-manrope font-bold text-on-surface mt-2">{stats.community_posts}</h3>
            </div>

            <div className="bg-white rounded-[32px] p-8 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
              <div className="bg-purple-50 p-4 rounded-2xl text-purple-500 w-fit mb-6">
                <span className="material-symbols-outlined text-2xl">calendar_month</span>
              </div>
              <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Total Event</p>
              <h3 className="text-4xl font-manrope font-bold text-on-surface mt-2">{stats.events}</h3>
            </div>
          </div>

          <div className="bg-white rounded-[32px] p-8 shadow-sm border border-slate-100">
            <h4 className="font-bold text-lg text-on-surface mb-6">Metrik & Aktivitas Lainnya</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h5 className="text-xs font-bold uppercase tracking-wider text-slate-400">Distribusi Data</h5>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-xs font-semibold mb-1">
                      <span>Rasio Artikel vs Komunitas</span>
                      <span>{stats.articles + stats.community_posts ? Math.round((stats.articles / (stats.articles + stats.community_posts)) * 100) : 0}% Artikel</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden flex">
                      <div className="bg-emerald-400 h-full" style={{ width: `${stats.articles + stats.community_posts ? (stats.articles / (stats.articles + stats.community_posts)) * 100 : 0}%` }}></div>
                      <div className="bg-indigo-400 h-full flex-1"></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs font-semibold mb-1">
                      <span>Rasio Komentar per Postingan</span>
                      <span>{stats.community_posts ? (stats.comments / stats.community_posts).toFixed(1) : 0} Komentar/Post</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div className="bg-yellow-400 h-full" style={{ width: `${Math.min(100, stats.community_posts ? (stats.comments / stats.community_posts) * 20 : 0)}%` }}></div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 flex flex-col justify-center">
                <span className="material-symbols-outlined text-4xl text-primary mb-3">verified_user</span>
                <h5 className="font-bold text-on-surface">Admin Terverifikasi</h5>
                <p className="text-xs text-slate-400 mt-1">Akun Anda: <span className="font-semibold text-primary">{currentUser?.email}</span> ({currentUser?.name})</p>
                <p className="text-xs text-slate-400 mt-2">Dermind API Endpoint: <span className="font-mono text-[10px]">{import.meta.env.VITE_API_BASE_URL || "http://localhost:5002/api"}</span></p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===== TAB 2: USER MANAGEMENT ===== */}
      {!loading && activeTab === "users" && (
        <div className="bg-white rounded-[32px] p-8 shadow-sm border border-slate-100 space-y-6 animate-in fade-in duration-300">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h4 className="font-bold text-lg text-on-surface">Daftar Pengguna</h4>
              <p className="text-xs text-slate-400">Total terdaftar: {filteredUsers.length} user</p>
            </div>
            {/* Search Input */}
            <div className="bg-slate-50 px-4 py-2 rounded-2xl flex items-center gap-3 w-full sm:w-[300px] border border-slate-100 focus-within:ring-2 focus-within:ring-primary/20 transition-all">
              <span className="material-symbols-outlined text-slate-400 text-lg">search</span>
              <input
                type="text"
                placeholder="Cari user..."
                className="border-none focus:ring-0 text-xs w-full bg-transparent p-0 font-medium"
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 text-[10px] uppercase font-bold tracking-wider">
                  <th className="pb-4 pl-4">User</th>
                  <th className="pb-4">Email</th>
                  <th className="pb-4">Role</th>
                  <th className="pb-4">Tanggal Daftar</th>
                  <th className="pb-4 text-center pr-4">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 text-xs">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-4 pl-4 flex items-center gap-3">
                      <img
                        src={user.avatar ? (user.avatar.startsWith('http') ? user.avatar : `${import.meta.env.VITE_API_URL || "http://localhost:5002"}${user.avatar}`) : `https://i.pravatar.cc/100?u=${user.id}`}
                        className="w-8 h-8 rounded-xl object-cover"
                        alt={user.name}
                      />
                      <span className="font-semibold text-on-surface">{user.name}</span>
                      {currentUser && user.id === currentUser.id && (
                        <span className="text-[9px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-bold">Saya</span>
                      )}
                    </td>
                    <td className="py-4 text-slate-500 font-medium">{user.email}</td>
                    <td className="py-4">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold ${
                        user.role === "admin"
                          ? "bg-primary/10 text-primary"
                          : "bg-slate-100 text-slate-500"
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="py-4 text-slate-400 font-medium">
                      {new Date(user.created_at).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </td>
                    <td className="py-4 text-center pr-4">
                      <button
                        onClick={() => handleDeleteUser(user.id, user.name)}
                        disabled={currentUser && user.id === currentUser.id}
                        className={`p-2 rounded-xl border text-red-500 border-red-100 bg-red-50/50 hover:bg-red-50 transition-all ${
                          currentUser && user.id === currentUser.id ? "opacity-30 cursor-not-allowed" : ""
                        }`}
                        title="Hapus Akun"
                      >
                        <span className="material-symbols-outlined text-lg leading-none block">delete</span>
                      </button>
                    </td>
                  </tr>
                ))}
                {filteredUsers.length === 0 && (
                  <tr>
                    <td colSpan="5" className="py-8 text-center text-slate-400 font-medium">
                      Tidak ada user ditemukan
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ===== TAB 3: ARTICLE MANAGEMENT ===== */}
      {!loading && activeTab === "articles" && (
        <div className="bg-white rounded-[32px] p-8 shadow-sm border border-slate-100 space-y-6 animate-in fade-in duration-300">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h4 className="font-bold text-lg text-on-surface">Kelola Artikel</h4>
              <p className="text-xs text-slate-400">Tulis dan edit artikel kesehatan untuk aplikasi.</p>
            </div>
            <div className="flex gap-3 w-full sm:w-auto">
              <div className="bg-slate-50 px-4 py-2 rounded-2xl flex items-center gap-3 w-full sm:w-[240px] border border-slate-100 focus-within:ring-2 focus-within:ring-primary/20 transition-all">
                <span className="material-symbols-outlined text-slate-400 text-lg">search</span>
                <input
                  type="text"
                  placeholder="Cari artikel..."
                  className="border-none focus:ring-0 text-xs w-full bg-transparent p-0 font-medium"
                  value={articleSearch}
                  onChange={(e) => setArticleSearch(e.target.value)}
                />
              </div>
              <button
                onClick={() => setArticleModal({
                  isOpen: true,
                  mode: "add",
                  id: null,
                  title: "",
                  content: "",
                  image: "",
                })}
                className="bg-primary text-white px-5 py-2.5 rounded-2xl text-xs font-bold shadow-md shadow-primary/10 hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-2 shrink-0"
              >
                <span className="material-symbols-outlined text-lg">add</span>
                Tulis Artikel
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredArticles.map((article) => (
              <div key={article.id} className="bg-slate-50/50 rounded-3xl p-5 border border-slate-100 flex flex-col justify-between group hover:border-primary/20 hover:shadow-sm transition-all duration-300">
                <div>
                  <div className="h-40 bg-slate-100 rounded-2xl overflow-hidden mb-4 relative">
                    <img
                      src={article.image || "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=400"}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      alt={article.title}
                      onError={(e) => {
                        e.target.src = "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=400";
                      }}
                    />
                  </div>
                  <h5 className="font-bold text-sm text-on-surface line-clamp-2 leading-snug">{article.title}</h5>
                  <p className="text-slate-400 text-[10px] font-bold uppercase mt-2">
                    {new Date(article.created_at).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                  <p className="text-slate-500 text-xs mt-3 line-clamp-3 leading-relaxed">{article.content}</p>
                </div>
                <div className="flex gap-2 mt-6 pt-4 border-t border-slate-200/40">
                  <button
                    onClick={() => setArticleModal({
                      isOpen: true,
                      mode: "edit",
                      id: article.id,
                      title: article.title,
                      content: article.content,
                      image: article.image,
                    })}
                    className="flex-1 bg-white border border-slate-200 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:text-primary hover:border-primary/20 transition-all flex items-center justify-center gap-1.5"
                  >
                    <span className="material-symbols-outlined text-base">edit</span>
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteArticle(article.id, article.title)}
                    className="p-2.5 bg-red-50 text-red-500 hover:bg-red-100 rounded-xl transition-all border border-red-100/30"
                  >
                    <span className="material-symbols-outlined text-base leading-none block">delete</span>
                  </button>
                </div>
              </div>
            ))}
            {filteredArticles.length === 0 && (
              <div className="col-span-12 py-12 text-center text-slate-400 font-medium">
                Tidak ada artikel kesehatan ditemukan
              </div>
            )}
          </div>
        </div>
      )}

      {/* ===== TAB 4: COMMUNITY MANAGEMENT ===== */}
      {!loading && activeTab === "community" && (
        <div className="bg-white rounded-[32px] p-8 shadow-sm border border-slate-100 space-y-6 animate-in fade-in duration-300">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h4 className="font-bold text-lg text-on-surface">Moderasi Komunitas</h4>
              <p className="text-xs text-slate-400">Hapus postingan dan komentar yang tidak pantas di forum diskusi.</p>
            </div>
            <div className="bg-slate-50 px-4 py-2 rounded-2xl flex items-center gap-3 w-full sm:w-[300px] border border-slate-100 focus-within:ring-2 focus-within:ring-primary/20 transition-all">
              <span className="material-symbols-outlined text-slate-400 text-lg">search</span>
              <input
                type="text"
                placeholder="Cari kata kunci atau penulis..."
                className="border-none focus:ring-0 text-xs w-full bg-transparent p-0 font-medium"
                value={postSearch}
                onChange={(e) => setPostSearch(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-4">
            {filteredPosts.map((post) => (
              <div key={post.id} className="bg-slate-50/50 p-6 rounded-3xl border border-slate-100 hover:border-primary/10 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-primary bg-primary/5 px-2.5 py-1 rounded-lg">@{post.author_name}</span>
                    <span className="text-[10px] text-slate-400 font-bold uppercase">
                      {new Date(post.created_at).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                  {post.title && <h5 className="font-bold text-sm text-on-surface">{post.title}</h5>}
                  <p className="text-slate-500 text-xs leading-relaxed">{post.content}</p>
                </div>
                <div className="flex gap-2 shrink-0 md:self-center">
                  <button
                    onClick={() => handleOpenComments(post.id, post.title || post.content.substring(0, 30) + "...")}
                    className="px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:text-primary hover:border-primary/20 transition-all flex items-center gap-1.5"
                  >
                    <span className="material-symbols-outlined text-base">chat_bubble</span>
                    Lihat Komentar
                  </button>
                  <button
                    onClick={() => handleDeletePost(post.id, post.title)}
                    className="px-3 py-2.5 bg-red-50 text-red-500 hover:bg-red-100 border border-red-100/30 rounded-xl transition-all flex items-center justify-center"
                    title="Hapus Postingan"
                  >
                    <span className="material-symbols-outlined text-base leading-none block">delete</span>
                  </button>
                </div>
              </div>
            ))}
            {filteredPosts.length === 0 && (
              <div className="py-12 text-center text-slate-400 font-medium">
                Tidak ada postingan komunitas ditemukan
              </div>
            )}
          </div>
        </div>
      )}

      {/* ===== TAB 5: EVENT MANAGEMENT ===== */}
      {!loading && activeTab === "events" && (
        <div className="bg-white rounded-[32px] p-8 shadow-sm border border-slate-100 space-y-6 animate-in fade-in duration-300">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h4 className="font-bold text-lg text-on-surface">Kelola Event</h4>
              <p className="text-xs text-slate-400">Buat dan edit kegiatan medis/kesehatan.</p>
            </div>
            <div className="flex gap-3 w-full sm:w-auto">
              <div className="bg-slate-50 px-4 py-2 rounded-2xl flex items-center gap-3 w-full sm:w-[240px] border border-slate-100 focus-within:ring-2 focus-within:ring-primary/20 transition-all">
                <span className="material-symbols-outlined text-slate-400 text-lg">search</span>
                <input
                  type="text"
                  placeholder="Cari event..."
                  className="border-none focus:ring-0 text-xs w-full bg-transparent p-0 font-medium"
                  value={eventSearch}
                  onChange={(e) => setEventSearch(e.target.value)}
                />
              </div>
              <button
                onClick={() => setEventModal({
                  isOpen: true,
                  mode: "add",
                  id: null,
                  title: "",
                  description: "",
                  location: "",
                  image: "",
                  event_date: "",
                })}
                className="bg-primary text-white px-5 py-2.5 rounded-2xl text-xs font-bold shadow-md shadow-primary/10 hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-2 shrink-0"
              >
                <span className="material-symbols-outlined text-lg">add</span>
                Buat Event
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event) => (
              <div key={event.id} className="bg-slate-50/50 rounded-3xl p-5 border border-slate-100 flex flex-col justify-between group hover:border-primary/20 hover:shadow-sm transition-all duration-300">
                <div>
                  <div className="h-40 bg-slate-100 rounded-2xl overflow-hidden mb-4 relative">
                    <img
                      src={event.image ? (event.image.startsWith("http") ? event.image : `${import.meta.env.VITE_API_URL || "http://localhost:5002"}/uploads/${event.image}`) : "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=400"}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      alt={event.title}
                      onError={(e) => {
                        e.target.src = "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=400";
                      }}
                    />
                  </div>
                  <h5 className="font-bold text-sm text-on-surface line-clamp-2 leading-snug">{event.title}</h5>
                  <div className="flex flex-col gap-1 mt-2">
                    <span className="flex items-center gap-1 text-[10px] text-slate-400 font-bold uppercase">
                      <span className="material-symbols-outlined text-xs">calendar_today</span>
                      {new Date(event.event_date).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                    <span className="flex items-center gap-1 text-[10px] text-slate-400 font-bold uppercase">
                      <span className="material-symbols-outlined text-xs">location_on</span>
                      {event.location || "Online"}
                    </span>
                  </div>
                  <p className="text-slate-500 text-xs mt-3 line-clamp-3 leading-relaxed">{event.description}</p>
                </div>
                <div className="flex gap-2 mt-6 pt-4 border-t border-slate-200/40">
                  <button
                    onClick={() => {
                      const formattedDate = event.event_date ? new Date(event.event_date).toISOString().substring(0, 10) : "";
                      setEventModal({
                        isOpen: true,
                        mode: "edit",
                        id: event.id,
                        title: event.title,
                        description: event.description,
                        location: event.location,
                        image: event.image,
                        event_date: formattedDate,
                      });
                    }}
                    className="flex-1 bg-white border border-slate-200 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:text-primary hover:border-primary/20 transition-all flex items-center justify-center gap-1.5"
                  >
                    <span className="material-symbols-outlined text-base">edit</span>
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteEvent(event.id, event.title)}
                    className="p-2.5 bg-red-50 text-red-500 hover:bg-red-100 rounded-xl transition-all border border-red-100/30"
                  >
                    <span className="material-symbols-outlined text-base leading-none block">delete</span>
                  </button>
                </div>
              </div>
            ))}
            {filteredEvents.length === 0 && (
              <div className="col-span-12 py-12 text-center text-slate-400 font-medium">
                Tidak ada event ditemukan
              </div>
            )}
          </div>
        </div>
      )}


      {/* ===== ARTICLE ADD/EDIT MODAL ===== */}
      {articleModal.isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300" onClick={() => setArticleModal(prev => ({ ...prev, isOpen: false }))}></div>
          <form onSubmit={handleSaveArticle} className="bg-white rounded-[40px] p-8 max-w-2xl w-full relative z-10 animate-in zoom-in-95 duration-300 shadow-2xl space-y-6">
            <button
              type="button"
              onClick={() => setArticleModal(prev => ({ ...prev, isOpen: false }))}
              className="absolute top-6 right-6 text-slate-300 hover:text-primary transition-colors"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
            <h3 className="text-2xl font-manrope font-bold text-on-surface">
              {articleModal.mode === "add" ? "Tulis Artikel Baru" : "Edit Artikel"}
            </h3>

            <div className="space-y-4 text-xs font-semibold">
              <div>
                <label className="text-slate-400 uppercase tracking-widest text-[10px]">Judul Artikel</label>
                <input
                  type="text"
                  placeholder="Ketik judul artikel..."
                  required
                  className="w-full bg-slate-50 border-none rounded-2xl p-4 mt-2 focus:ring-1 focus:ring-primary text-sm font-medium"
                  value={articleModal.title}
                  onChange={(e) => setArticleModal(prev => ({ ...prev, title: e.target.value }))}
                />
              </div>

              <div>
                <label className="text-slate-400 uppercase tracking-widest text-[10px]">URL Gambar Ilustrasi (Opsional)</label>
                <input
                  type="text"
                  placeholder="https://images.unsplash.com/..."
                  className="w-full bg-slate-50 border-none rounded-2xl p-4 mt-2 focus:ring-1 focus:ring-primary text-sm font-medium"
                  value={articleModal.image}
                  onChange={(e) => setArticleModal(prev => ({ ...prev, image: e.target.value }))}
                />
              </div>

              <div>
                <label className="text-slate-400 uppercase tracking-widest text-[10px]">Konten Kesehatan</label>
                <textarea
                  placeholder="Tulis informasi medis atau tips kesehatan kulit/mental di sini..."
                  required
                  rows="6"
                  className="w-full bg-slate-50 border-none rounded-2xl p-4 mt-2 focus:ring-1 focus:ring-primary text-sm font-medium leading-relaxed"
                  value={articleModal.content}
                  onChange={(e) => setArticleModal(prev => ({ ...prev, content: e.target.value }))}
                ></textarea>
              </div>
            </div>

            <div className="flex gap-4 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setArticleModal(prev => ({ ...prev, isOpen: false }))}
                className="flex-1 border border-slate-200 py-3.5 rounded-2xl font-bold text-slate-500 hover:bg-slate-50 transition-all text-xs"
              >
                Batal
              </button>
              <button
                type="submit"
                className="flex-1 bg-primary text-white py-3.5 rounded-2xl font-bold hover:scale-[1.02] shadow-lg shadow-primary/10 transition-all text-xs"
              >
                Simpan Artikel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ===== COMMENTS MODERATION MODAL ===== */}
      {commentModal.isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300" onClick={() => setCommentModal(prev => ({ ...prev, isOpen: false }))}></div>
          <div className="bg-white rounded-[40px] p-8 max-w-xl w-full relative z-10 animate-in zoom-in-95 duration-300 shadow-2xl flex flex-col max-h-[85vh]">
            <button
              onClick={() => setCommentModal(prev => ({ ...prev, isOpen: false }))}
              className="absolute top-6 right-6 text-slate-300 hover:text-primary transition-colors"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
            <div className="mb-6 pr-8">
              <h3 className="text-xl font-manrope font-bold text-on-surface line-clamp-1">Komentar Postingan</h3>
              <p className="text-slate-400 text-xs mt-1">"{commentModal.postTitle}"</p>
            </div>

            <div className="flex-1 overflow-y-auto pr-2 space-y-4 custom-scrollbar my-4 min-h-[200px]">
              {commentModal.comments.map((comment) => (
                <div key={comment.id} className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex justify-between items-start gap-4">
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-primary">@{comment.author_name}</span>
                      <span className="text-[9px] text-slate-400 font-medium">
                        {new Date(comment.created_at).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "short",
                        })}
                      </span>
                    </div>
                    <p className="text-slate-600 text-xs leading-relaxed">{comment.comment}</p>
                  </div>
                  <button
                    onClick={() => handleDeleteComment(comment.id)}
                    className="p-1.5 bg-red-100/50 text-red-500 hover:bg-red-100 rounded-xl transition-all border border-red-100/20 shrink-0"
                    title="Hapus Komentar"
                  >
                    <span className="material-symbols-outlined text-base leading-none block">delete</span>
                  </button>
                </div>
              ))}
              {commentModal.comments.length === 0 && (
                <div className="text-center text-slate-400 text-xs py-10 font-medium">
                  Belum ada komentar pada postingan ini
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-slate-100">
              <button
                onClick={() => setCommentModal(prev => ({ ...prev, isOpen: false }))}
                className="w-full bg-slate-50 border border-slate-200 py-3.5 rounded-2xl font-bold text-slate-600 hover:bg-slate-100 transition-all text-xs"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===== EVENT ADD/EDIT MODAL ===== */}
      {eventModal.isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300" onClick={() => setEventModal(prev => ({ ...prev, isOpen: false }))}></div>
          <form onSubmit={handleSaveEvent} className="bg-white rounded-[40px] p-8 max-w-2xl w-full relative z-10 animate-in zoom-in-95 duration-300 shadow-2xl space-y-6">
            <button
              type="button"
              onClick={() => setEventModal(prev => ({ ...prev, isOpen: false }))}
              className="absolute top-6 right-6 text-slate-300 hover:text-primary transition-colors"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
            <h3 className="text-2xl font-manrope font-bold text-on-surface">
              {eventModal.mode === "add" ? "Buat Event Baru" : "Edit Event"}
            </h3>

            <div className="space-y-4 text-xs font-semibold">
              <div>
                <label className="text-slate-400 uppercase tracking-widest text-[10px]">Judul Event</label>
                <input
                  type="text"
                  placeholder="Ketik judul event..."
                  required
                  className="w-full bg-slate-50 border-none rounded-2xl p-4 mt-2 focus:ring-1 focus:ring-primary text-sm font-medium"
                  value={eventModal.title}
                  onChange={(e) => setEventModal(prev => ({ ...prev, title: e.target.value }))}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-slate-400 uppercase tracking-widest text-[10px]">Lokasi</label>
                  <input
                    type="text"
                    placeholder="Contoh: Jakarta atau Online"
                    className="w-full bg-slate-50 border-none rounded-2xl p-4 mt-2 focus:ring-1 focus:ring-primary text-sm font-medium"
                    value={eventModal.location}
                    onChange={(e) => setEventModal(prev => ({ ...prev, location: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="text-slate-400 uppercase tracking-widest text-[10px]">Tanggal Event</label>
                  <input
                    type="date"
                    required
                    className="w-full bg-slate-50 border-none rounded-2xl p-4 mt-2 focus:ring-1 focus:ring-primary text-sm font-medium"
                    value={eventModal.event_date}
                    onChange={(e) => setEventModal(prev => ({ ...prev, event_date: e.target.value }))}
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-400 uppercase tracking-widest text-[10px]">URL Gambar Event / File Name (Opsional)</label>
                <input
                  type="text"
                  placeholder="Nama file gambar atau URL eksternal..."
                  className="w-full bg-slate-50 border-none rounded-2xl p-4 mt-2 focus:ring-1 focus:ring-primary text-sm font-medium"
                  value={eventModal.image}
                  onChange={(e) => setEventModal(prev => ({ ...prev, image: e.target.value }))}
                />
              </div>

              <div>
                <label className="text-slate-400 uppercase tracking-widest text-[10px]">Deskripsi Event</label>
                <textarea
                  placeholder="Tulis deskripsi detail event di sini..."
                  required
                  rows="5"
                  className="w-full bg-slate-50 border-none rounded-2xl p-4 mt-2 focus:ring-1 focus:ring-primary text-sm font-medium leading-relaxed"
                  value={eventModal.description}
                  onChange={(e) => setEventModal(prev => ({ ...prev, description: e.target.value }))}
                ></textarea>
              </div>
            </div>

            <div className="flex gap-4 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setEventModal(prev => ({ ...prev, isOpen: false }))}
                className="flex-1 border border-slate-200 py-3.5 rounded-2xl font-bold text-slate-500 hover:bg-slate-50 transition-all text-xs"
              >
                Batal
              </button>
              <button
                type="submit"
                className="flex-1 bg-primary text-white py-3.5 rounded-2xl font-bold hover:scale-[1.02] shadow-lg shadow-primary/10 transition-all text-xs"
              >
                Simpan Event
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
