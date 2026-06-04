import React, { useState, useEffect } from 'react';
import api from '../services/api';

const Profile = () => {
  const [activeModal, setActiveModal] = useState(null);

  const [user, setUser] = useState(null);
  const [mentalLatest, setMentalLatest] = useState(null);
  const [skinLatest, setSkinLatest] = useState(null);
  const [mentalCount, setMentalCount] = useState(0);
  const [skinCount, setSkinCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [editName, setEditName] =
  useState("");

const [editEmail, setEditEmail] =
  useState("");

  const [oldPassword, setOldPassword] =
  useState("");

const [newPassword, setNewPassword] =
  useState("");

const [confirmPassword, setConfirmPassword] =
  useState("");

  const [editAvatar, setEditAvatar] =
  useState(null);

  const handleUpdateProfile =
async () => {

  try {

    const token =
      localStorage.getItem(
        "token"
      );

    let avatarPath =
      user?.avatar;

    // Upload avatar dulu
    if (editAvatar) {

      const formData =
        new FormData();

      formData.append(
        "image",
        editAvatar
      );

      const uploadRes =
        await api.post(
          "/upload",
          formData,
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
              "Content-Type":
                "multipart/form-data",
            },
          }
        );

      avatarPath =
        uploadRes.data.data.path;
    }

    // Update profile
    const response =
      await api.put(
        "/auth/profile",
        {
          name: editName,
          email: editEmail,
          avatar: avatarPath,
        },
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

    // Update localStorage user session data
    localStorage.setItem("user", JSON.stringify(response.data.data));

    alert(
      response.data.message
    );

    setUser(
      response.data.data
    );

    setActiveModal(
      null
    );

    // Refresh page to update header/navbar avatar and name
    window.location.reload();

  } catch (error) {

    console.log(error);

    alert(
      error.response?.data
        ?.message ||
      "Update profile gagal"
    );

  }

};

  const handleChangePassword =
  async () => {

    if (
      newPassword !==
      confirmPassword
    ) {

      alert(
        "Konfirmasi password tidak sama"
      );

      return;

    }

    try {

      const token =
        localStorage.getItem(
          "token"
        );

      const response =
        await api.put(
          "/auth/change-password",
          {
            oldPassword,
            newPassword,
          },
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );

      alert(
        response.data.message
      );

      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");

      setActiveModal(
        null
      );

    } catch (error) {

      alert(
        error.response?.data
          ?.message ||
          "Gagal mengubah password"
      );

    }

  };

  useEffect(() => {
    loadProfile();
  }, []);

  useEffect(() => {
    if (activeModal === 'edit' && user) {
      setEditName(user.name || "");
      setEditEmail(user.email || "");
    }
  }, [activeModal, user]);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };

      const [profileRes, mentalRes, skinRes] = await Promise.all([
        api.get('/auth/profile', { headers }),
        api.get('/mental/history', { headers }),
        api.get('/skin/history', { headers }),
      ]);

      // ── USER ──────────
      const userData =
        profileRes.data.user ||
        profileRes.data.data ||
        profileRes.data ||
        {};
      setUser(userData);

      // ── MENTAL ────
      const mentalData = Array.isArray(mentalRes.data)
        ? mentalRes.data
        : mentalRes.data.data || [];
      setMentalCount(mentalData.length);
      if (mentalData.length > 0) setMentalLatest(mentalData[0]);

      // ── SKIN ───
      const skinData = Array.isArray(skinRes.data)
        ? skinRes.data
        : skinRes.data.data || [];
      setSkinCount(skinData.length);
      if (skinData.length > 0) setSkinLatest(skinData[0]);

    } catch (error) {
      console.error('PROFILE ERROR:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  

  const formatDate = (dateStr) => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const formatScore = (score) => {
  if (score === null || score === undefined) return '-';

  const num = parseFloat(score);

  return isNaN(num)
    ? '-'
    : `${num.toFixed(2)}%`;
};

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <h2 className="text-xl font-bold text-primary">Loading Profile...</h2>
      </div>
    );
  }

  const activityLogs = [
    {
      id: 1,
      title: 'Analisis Mental',
      desc: mentalLatest
        ? `Prediksi: ${mentalLatest.prediction} • Skor: ${formatScore(mentalLatest.score)}`
        : 'Belum ada analisis mental',
      time: mentalLatest ? formatDate(mentalLatest.created_at) : '-',
      icon: 'psychology',
      color: 'text-orange-500 bg-orange-100',
    },
    {
      id: 2,
      title: 'Analisis Kulit',
      desc: skinLatest
        ? `Kondisi: ${skinLatest.prediction} • Kepercayaan: ${formatScore(skinLatest.confidence)}`
        : 'Belum ada analisis kulit',
      time: skinLatest ? formatDate(skinLatest.created_at) : '-',
      icon: 'biotech',
      color: 'text-primary bg-primary/10',
    }
    
  ];
  console.log("SKIN LATEST:", skinLatest);
  return (
    <div className="animate-in fade-in duration-700 pb-20 relative">

            {/* ===== MODAL: EDIT PROFIL ===== */}
      {activeModal === 'edit' && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">

          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setActiveModal(null)}
          />

          <div className="bg-white rounded-[40px] p-10 max-w-md w-full relative z-10 animate-in zoom-in-95 shadow-2xl">

            <h3 className="text-2xl font-bold mb-6 text-on-surface">
              Edit Profil
            </h3>

            <div className="space-y-4 mb-8">

              <input
                type="text"
                value={editName}
                onChange={(e) =>
                  setEditName(
                    e.target.value
                  )
                }
                className="w-full bg-slate-50 border-none rounded-xl p-4"
                placeholder="Nama Lengkap"
              />

              <input
                type="email"
                value={editEmail}
                onChange={(e) =>
                  setEditEmail(
                    e.target.value
                  )
                }
                className="w-full bg-slate-50 border-none rounded-xl p-4"
                placeholder="Email"
              />

              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  setEditAvatar(
                    e.target.files[0]
                  )
                }
                className="w-full bg-slate-50 border-none rounded-xl p-4"
              />

            </div>

            <button
              onClick={
                handleUpdateProfile
              }
              className="w-full bg-primary text-white py-4 rounded-2xl font-bold"
            >
              Simpan Perubahan
            </button>

          </div>

        </div>
      )}

      {/* ===== MODAL: GANTI PASSWORD ===== */}
      {activeModal === 'password' && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">

          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setActiveModal(null)}
          />

          <div className="bg-white rounded-[40px] p-10 max-w-md w-full relative z-10 animate-in zoom-in-95 shadow-2xl">

            <h3 className="text-2xl font-bold mb-6 text-on-surface">
              Ganti Password
            </h3>

            <div className="space-y-4 mb-8">

              <input
                type="password"
                value={oldPassword}
                onChange={(e) =>
                  setOldPassword(
                    e.target.value
                  )
                }
                className="w-full bg-slate-50 border-none rounded-xl p-4"
                placeholder="Password Lama"
              />

              <input
                type="password"
                value={newPassword}
                onChange={(e) =>
                  setNewPassword(
                    e.target.value
                  )
                }
                className="w-full bg-slate-50 border-none rounded-xl p-4"
                placeholder="Password Baru"
              />

              <input
                type="password"
                value={confirmPassword}
                onChange={(e) =>
                  setConfirmPassword(
                    e.target.value
                  )
                }
                className="w-full bg-slate-50 border-none rounded-xl p-4"
                placeholder="Konfirmasi Password Baru"
              />

            </div>

            <div className="flex gap-3">

              <button
                onClick={() =>
                  setActiveModal(
                    null
                  )
                }
                className="flex-1 bg-slate-100 text-slate-500 py-4 rounded-2xl font-bold"
              >
                Batal
              </button>

              <button
                onClick={
                  handleChangePassword
                }
                className="flex-1 bg-primary text-white py-4 rounded-2xl font-bold"
              >
                Simpan
              </button>

            </div>

          </div>

        </div>
      )}

      {/* ===== MODAL: LOGOUT KONFIRMASI ===== */}
      {activeModal === 'logout' && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setActiveModal(null)} />
          <div className="bg-white rounded-[40px] p-10 max-w-sm w-full relative z-10 animate-in zoom-in-95 shadow-2xl text-center">
            <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="material-symbols-outlined text-3xl">logout</span>
            </div>
            <h3 className="text-xl font-bold mb-2 text-on-surface">Keluar dari Akun?</h3>
            <p className="text-slate-400 text-sm mb-8">Kamu perlu login kembali untuk mengakses aplikasi.</p>
            <div className="flex gap-3">
              <button onClick={() => setActiveModal(null)} className="flex-1 bg-slate-100 text-slate-500 py-4 rounded-2xl font-bold">
                Batal
              </button>
              <button onClick={handleLogout} className="flex-1 bg-red-500 text-white py-4 rounded-2xl font-bold">
                Keluar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===================== GRID UTAMA ===================== */}
      <div className="grid grid-cols-12 gap-6 mb-8">

        {/* KIRI: Identitas User */}
        <div className="col-span-12 lg:col-span-4 bg-white rounded-[40px] p-10 border border-slate-100 shadow-sm flex flex-col items-center text-center">
          <div className="relative mb-6">
            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-primary-container">

              <img
                src={
                  user?.avatar
                    ? `${import.meta.env.VITE_API_URL || "http://localhost:5002"}${user.avatar}`
                    : "https://i.pravatar.cc/300"
                }
                alt="Avatar"
                className="w-full h-full object-cover"
              />

            </div>
            {user?.role && (
              <span className="absolute bottom-1 right-1 bg-primary text-white text-[9px] font-bold px-3 py-1 rounded-full border-4 border-white tracking-widest uppercase">
                {user.role}
              </span>
            )}
          </div>

          {/* ── PROFIL ── */}
          <h3 className="text-2xl font-bold text-on-surface mb-1">{user?.name || 'User'}</h3>
          <p className="text-[10px] text-slate-300 font-bold uppercase tracking-widest mb-6">
            Bergabung {formatDate(user?.created_at)}
          </p>

          {/* ── STATISTIK ── */}
          <div className="grid grid-cols-3 w-full gap-3 mb-8">
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 text-center">
              <p className="text-lg font-bold text-primary">{mentalCount}</p>
              <p className="text-[9px] text-slate-400 font-bold uppercase leading-tight">Mental</p>
            </div>
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 text-center">
              <p className="text-lg font-bold text-primary">{skinCount}</p>
              <p className="text-[9px] text-slate-400 font-bold uppercase leading-tight">Kulit</p>
            </div>
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 text-center">
              <p className="text-lg font-bold text-primary">0</p>
              <p className="text-[9px] text-slate-400 font-bold uppercase leading-tight">Artikel</p>
            </div>
          </div>

          <button onClick={() => setActiveModal('edit')} className="w-full bg-primary-container text-primary py-4 rounded-2xl font-bold text-sm hover:scale-[1.02] transition-transform">
            Edit Profil
          </button>
        </div>

        {/* KANAN: Hasil AI & Pengaturan */}
        <div className="col-span-12 lg:col-span-8 space-y-6">

          {/* ── HASIL MENTAL TERAKHIR ── */}
          <div className="bg-white rounded-[40px] p-8 border border-slate-100 shadow-sm">
            <h4 className="font-bold flex items-center gap-2 mb-6 text-on-surface">
              <span className="material-symbols-outlined text-orange-500">psychology</span> Hasil Mental Terakhir
            </h4>
            {mentalLatest ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-6 bg-slate-50 rounded-[28px] border border-slate-100">
                  <p className="text-[10px] font-bold text-slate-400 uppercase mb-2 tracking-widest">Status / Prediksi</p>
                  <h5 className="text-2xl font-bold text-orange-500">{mentalLatest.prediction || '-'}</h5>
                </div>
                <div className="p-6 bg-slate-50 rounded-[28px] border border-slate-100">
                  <p className="text-[10px] font-bold text-slate-400 uppercase mb-2 tracking-widest">Skor Kepercayaan</p>
                  <h5 className="text-3xl font-bold text-primary">{formatScore(mentalLatest.score)}</h5>
                </div>
              </div>
            ) : (
              <div className="text-center py-6 bg-slate-50 rounded-[28px] border border-dashed border-slate-200">
                <p className="text-slate-400 text-sm italic">Belum ada analisis mental.</p>
              </div>
            )}
          </div>

          {/* ── HASIL KULIT TERAKHIR ── */}
          <div className="bg-white rounded-[40px] p-8 border border-slate-100 shadow-sm">
            <h4 className="font-bold flex items-center gap-2 mb-6 text-on-surface">
              <span className="material-symbols-outlined text-primary">
                biotech
              </span>
              Hasil Kulit Terakhir
            </h4>

            {skinLatest ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                <div className="p-6 bg-slate-50 rounded-[28px] border border-slate-100">
                  <p className="text-[10px] font-bold text-slate-400 uppercase mb-2 tracking-widest">
                    Kondisi
                  </p>

                  <h5 className="text-2xl font-bold text-primary">
                    {skinLatest.prediction || '-'}
                  </h5>
                </div>

                <div className="p-6 bg-slate-50 rounded-[28px] border border-slate-100">
                  <p className="text-[10px] font-bold text-slate-400 uppercase mb-2 tracking-widest">
                    Kepercayaan
                  </p>

                  <h5 className="text-3xl font-bold text-primary">
                    {formatScore(
                      skinLatest.confidence
                    )}
                  </h5>
                </div>

              </div>
            ) : (
              <div className="text-center py-6 bg-slate-50 rounded-[28px] border border-dashed border-slate-200">
                <p className="text-slate-400 text-sm italic">
                  Belum ada analisis kulit.
                </p>
              </div>
            )}
          </div>
          {/* ── PENGATURAN ── */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div
              onClick={() => setActiveModal('edit')}
              className="bg-white rounded-[28px] p-5 border border-slate-100 shadow-sm flex items-center justify-between group cursor-pointer hover:border-primary transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="p-3 bg-surface rounded-2xl text-slate-400 group-hover:text-primary">
                  <span className="material-symbols-outlined">manage_accounts</span>
                </div>
                <p className="font-bold text-sm text-on-surface">Edit Profil</p>
              </div>
              <span className="material-symbols-outlined text-slate-300">chevron_right</span>
            </div>

            <div
              onClick={() => setActiveModal('password')}
              className="bg-white rounded-[28px] p-5 border border-slate-100 shadow-sm flex items-center justify-between group cursor-pointer hover:border-primary transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="p-3 bg-surface rounded-2xl text-slate-400 group-hover:text-primary">
                  <span className="material-symbols-outlined">lock_reset</span>
                </div>
                <p className="font-bold text-sm text-on-surface">Ganti Password</p>
              </div>
              <span className="material-symbols-outlined text-slate-300">chevron_right</span>
            </div>

            <div
              onClick={() => setActiveModal('logout')}
              className="bg-white rounded-[28px] p-5 border border-slate-100 shadow-sm flex items-center justify-between group cursor-pointer hover:border-red-400 transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="p-3 bg-surface rounded-2xl text-slate-400 group-hover:text-red-500">
                  <span className="material-symbols-outlined">logout</span>
                </div>
                <p className="font-bold text-sm text-on-surface group-hover:text-red-500 transition-colors">Logout</p>
              </div>
              <span className="material-symbols-outlined text-slate-300">chevron_right</span>
            </div>
          </div>

        </div>
      </div>

      
      {/* ===================== LOG AKTIVITAS ===================== */}
      <div className="bg-white rounded-[40px] p-10 border border-slate-100 shadow-sm">
        <h4 className="font-bold text-xl mb-8 flex items-center gap-2 text-on-surface">
          <span className="material-symbols-outlined">history</span> Aktivitas Terbaru
        </h4>
        <div className="space-y-4">
          {activityLogs.map((log) => (
            <div
              key={log.id}
              className="flex flex-col md:flex-row items-center gap-5 p-4 rounded-[24px] hover:bg-slate-50 transition-all border border-transparent hover:border-slate-100 group"
            >
              <div className={`p-4 rounded-2xl ${log.color}`}>
                <span className="material-symbols-outlined">{log.icon}</span>
              </div>
              <div className="flex-1 text-center md:text-left">
                <h5 className="font-bold text-on-surface group-hover:text-primary transition-colors">{log.title}</h5>
                <p className="text-xs text-slate-400">{log.desc}</p>
              </div>
              <div className="text-right text-xs font-bold text-slate-400">{log.time}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-12 text-center">
        <p className="text-[10px] text-slate-300 font-bold uppercase tracking-[0.3em]">
          Dermind Advanced Healthcare Intelligence • 2026
        </p>
      </div>
    </div>
  );
};

export default Profile;
