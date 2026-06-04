import React, {
  useState,
  useEffect
} from "react";

import api from "../services/api";

const Events = () => {

  const [showCalendar,
    setShowCalendar] =
    useState(false);

  const [showNewsDetail,
    setShowNewsDetail] =
    useState(false);

  const [registeredIds,
    setRegisteredIds] =
    useState([]);

  const [reminderIds,
    setRemindersIds] =
    useState([]);

  const [events,
    setEvents] =
    useState([]);

  const [currentUser, setCurrentUser] = useState(null);
  const [skinHistory, setSkinHistory] = useState([]);

  useEffect(() => {
    const userJson = localStorage.getItem("user");
    if (userJson) {
      const user = JSON.parse(userJson);
      setCurrentUser(user);

      // Load registered and reminder IDs from localStorage
      const storedFollows = localStorage.getItem(`registered_events_${user.id}`);
      if (storedFollows) {
        setRegisteredIds(JSON.parse(storedFollows));
      }

      const storedReminders = localStorage.getItem(`reminder_events_${user.id}`);
      if (storedReminders) {
        setRemindersIds(JSON.parse(storedReminders));
      }

      // Load skin analysis history for Trend Analisis
      fetchSkinHistory();
    }
    loadEvents();
  }, []);

  const fetchSkinHistory = async () => {
    try {
      const res = await api.get("/skin/history");
      if (res.data.success) {
        setSkinHistory(res.data.data);
      }
    } catch (error) {
      console.log("Error loading skin history:", error);
    }
  };

  const loadEvents = async () => {
    try {
      const res = await api.get("/events");
      setEvents(res.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const toggleFollow = (id) => {
    if (!currentUser) return;
    let updated;
    if (registeredIds.includes(id)) {
      updated = registeredIds.filter(item => item !== id);
    } else {
      updated = [...registeredIds, id];
    }
    setRegisteredIds(updated);
    localStorage.setItem(`registered_events_${currentUser.id}`, JSON.stringify(updated));
  };

  const toggleReminder = (id) => {
    if (!currentUser) return;
    let updated;
    if (reminderIds.includes(id)) {
      updated = reminderIds.filter(item => item !== id);
    } else {
      updated = [...reminderIds, id];
    }
    setRemindersIds(updated);
    localStorage.setItem(`reminder_events_${currentUser.id}`, JSON.stringify(updated));
  };

  const getTrendData = () => {
    if (skinHistory.length === 0) {
      return {
        heights: [30, 45, 60, 40, 80, 95],
        message: "Belum ada riwayat deteksi. Coba fitur AI Skin Detection untuk melihat tren analisis Anda."
      };
    }
    // Take the last 6 records, oldest to newest (recent values on the right)
    const recentScans = [...skinHistory].slice(0, 6).reverse();
    const heights = recentScans.map(scan => Math.max(15, parseFloat(scan.confidence)));

    // Fill missing bars up to 6
    while (heights.length < 6) {
      heights.unshift(20);
    }

    const latestScan = skinHistory[0];
    const message = `Deteksi terakhir menunjukkan kondisi ${latestScan.prediction} (${parseFloat(latestScan.confidence).toFixed(0)}% confidence).`;

    return { heights, message };
  };

  const { heights, message: trendMessage } = getTrendData();
  return (
    <div className="animate-in fade-in duration-700 pb-20 relative">

      {/* ===== MODAL KALENDER ===== */}
      {showCalendar && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowCalendar(false)}></div>
          <div className="bg-white rounded-[40px] p-10 max-w-md w-full relative z-10 animate-in zoom-in-95 shadow-2xl">
            <h3 className="text-2xl font-bold mb-6 text-on-surface">Kalender Event</h3>
            <div className="bg-slate-50 p-6 rounded-[32px] border border-slate-100">
               <div className="flex justify-between mb-4 font-bold text-xs text-primary uppercase">
                 <span>Januari 2026</span>
                 <div className="flex gap-2">
                    <span className="material-symbols-outlined text-sm cursor-pointer">chevron_left</span>
                    <span className="material-symbols-outlined text-sm cursor-pointer">chevron_right</span>
                 </div>
               </div>
               <div className="grid grid-cols-7 gap-2 text-center text-[10px] font-bold text-slate-400 mb-2">
                 <span>S</span><span>S</span><span>R</span><span>K</span><span>J</span><span>S</span><span>M</span>
               </div>
               <div className="grid grid-cols-7 gap-2">

  {[...Array(31)].map((_, i) => (

              <div
                key={i}
                className={`aspect-square flex items-center justify-center rounded-lg text-xs font-medium cursor-pointer transition-all ${
                  events.some(
                    (event) =>
                      new Date(
                        event.event_date
                      ).getDate() === i + 1
                  )
                    ? "bg-primary text-white shadow-lg"
                    : "hover:bg-primary/10"
                }`}
              >
                {i + 1}
              </div>

            ))}

          </div>
            </div>
            <button onClick={() => setShowCalendar(false)} className="w-full mt-8 bg-primary text-white py-4 rounded-2xl font-bold">Tutup</button>
          </div>
        </div>
      )}

      {/* ===== MODAL BACA SELENGKAPNYA (BERITA UTAMA) ===== */}
      {showNewsDetail && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={() => setShowNewsDetail(false)}></div>
          <div className="bg-white rounded-[40px] max-w-2xl w-full max-h-[85vh] overflow-y-auto relative z-10 animate-in slide-in-from-bottom-10 shadow-2xl custom-scrollbar">
             <img src="https://plus.unsplash.com/premium_photo-1670981098417-dac28d081825?w=500&auto=format&fit=crop&q=60" className="w-full h-64 object-cover" alt="" />
             <div className="p-10">
                <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-[10px] font-bold uppercase mb-4 inline-block">Sains & Riset</span>
                <h3 className="text-3xl font-bold mb-6">Evolusi AI dalam Deteksi Kanker Kulit</h3>
                <p className="text-on-surface-variant leading-relaxed mb-6">
                  Teknologi Deep Learning yang dikembangkan oleh tim riset Dermind kini telah mencapai tingkat akurasi 94% dalam mengenali sel abnormal pada lapisan epidermis. Penemuan ini dipublikasikan dalam Journal of Clinical Dermatology bulan ini. Dengan pembaruan ini, pengguna aplikasi dapat merasakan deteksi yang lebih presisi hanya dengan satu unggahan foto...
                </p>
                <button onClick={() => setShowNewsDetail(false)} className="bg-slate-100 px-8 py-3 rounded-xl font-bold text-slate-500">Tutup Artikel</button>
             </div>
          </div>
        </div>
      )}

      {/* Header Halaman */}
      <header className="mb-8">
        <h2 className="text-3xl font-manrope font-bold text-on-surface">Events & Berita</h2>
        <p className="text-on-surface-variant mt-1">Temukan kegiatan medis terbaru dan pantau perkembangan inovasi kesehatan kami.</p>
      </header>

      {/* SECTION ATAS */}
      <div className="grid grid-cols-12 gap-6 mb-12">
        <div className="col-span-12 lg:col-span-8 bg-white rounded-[32px] overflow-hidden border border-slate-100 shadow-sm relative group h-[400px]">
          <img 
            src="https://plus.unsplash.com/premium_photo-1670981098417-dac28d081825?w=500&auto=format&fit=crop&q=60" 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 opacity-90" 
            alt="Feature" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent p-10 flex flex-col justify-end">
            <span className="bg-[#4fbdba] text-white px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest w-fit mb-4">Laporan Terbaru</span>
            <h3 className="text-3xl font-bold text-white mb-4 leading-tight max-w-xl">
              Evolusi di dalam Deteksi Dini Kanker Kulit: Apa yang Harus Anda Ketahui
            </h3>
            <p className="text-white/70 text-sm max-w-lg mb-6">
              Bagaimana teknologi deep learning membantu dokter mendiagnosis melanoma lebih cepat dari sebelumnya.
            </p>
            <button 
                onClick={() => setShowNewsDetail(true)}
                className="text-[#4fbdba] font-bold text-sm flex items-center gap-2 hover:gap-4 transition-all"
            >
              Baca Selengkapnya <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </button>
          </div>
        </div>

        <div className="col-span-12 lg:col-span-4 flex flex-col gap-6">
          <div className="bg-white rounded-[32px] p-8 border border-slate-100 shadow-sm flex-1 text-on-surface">
            <h4 className="font-bold text-sm">Trend Analisis</h4>
            <div className="flex items-end gap-2 h-20 mb-4 mt-4">
              {heights.map((h, i) => (
                <div key={i} className="flex-1 bg-primary/10 rounded-t-md hover:bg-primary/30 transition-all" style={{height: `${h}%`}}></div>
              ))}
            </div>
            <p className="text-[11px] text-on-surface-variant leading-relaxed">{trendMessage}</p>
          </div>

          <div className="bg-[#1a2b2b] rounded-[32px] p-8 border border-white/5 shadow-sm flex-1 text-white relative overflow-hidden">
             <div className="bg-[#4fbdba]/20 p-2 rounded-xl w-fit mb-4"><span className="material-symbols-outlined text-[#4fbdba]">notifications_active</span></div>
             <h4 className="font-bold text-sm mb-2 uppercase tracking-wide text-[#4fbdba]">Update AI Profil</h4>
             <p className="text-xs text-white/60 leading-relaxed">Kami telah memperbarui algoritma deteksi untuk akurasi yang lebih tinggi.</p>
          </div>
        </div>
      </div>

      {events.map((event) => (

  <div
    key={event.id}
    className="relative group"
  >

    <div
      className={`absolute -left-[30px] top-1/2 -translate-y-1/2 w-[22px] h-[22px] bg-white border-4 rounded-full z-10 shadow-sm transition-all ${
        registeredIds.includes(event.id)
          ? "border-green-500 bg-green-500"
          : "border-primary"
      }`}
    ></div>

    <div className="bg-white rounded-[32px] p-6 border border-slate-100 shadow-sm hover:border-primary/20 transition-all flex flex-col md:flex-row gap-8 items-center">

      <div className="w-full md:w-48 h-32 rounded-2xl overflow-hidden bg-slate-50 flex-shrink-0">

        <img
          src={event.image ? (event.image.startsWith("http") ? event.image : `${import.meta.env.VITE_API_URL || "http://localhost:5002"}/uploads/${event.image}`) : "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=400"}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          alt={event.title}
          onError={(e) => {
            e.target.src = "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=400";
          }}
        />

      </div>

      <div className="flex-1">

        <div className="flex flex-wrap gap-4 mb-3">

          <span className="flex items-center gap-1 text-[10px] font-bold text-slate-400 uppercase tracking-widest">

            <span className="material-symbols-outlined text-sm">
              calendar_today
            </span>

            {new Date(
              event.event_date
            ).toLocaleDateString(
              "id-ID"
            )}

          </span>

        </div>

        <h4 className="text-xl font-bold text-on-surface mb-2 group-hover:text-primary transition-colors">
          {event.title}
        </h4>

        <p className="text-[11px] text-on-surface-variant leading-relaxed line-clamp-2 max-w-2xl">
          {event.description}
        </p>

        <p className="text-xs text-slate-500 mt-2">
          📍 {event.location}
        </p>

      </div>

      <div className="flex flex-col gap-2 w-full md:w-fit">

        <button
          onClick={() =>
            toggleFollow(
              event.id
            )
          }
          className={`px-8 py-3 rounded-2xl font-bold text-xs shadow-lg transition-all whitespace-nowrap ${
            registeredIds.includes(
              event.id
            )
              ? "bg-green-500 text-white shadow-green-100"
              : "bg-primary text-white shadow-primary/20"
          }`}
        >
          {registeredIds.includes(
            event.id
          )
            ? "Sudah Terdaftar"
            : "Ikuti Sekarang"}
        </button>

        <button
          onClick={() =>
            toggleReminder(
              event.id
            )
          }
          className={`px-8 py-3 rounded-2xl font-bold text-xs border transition-all ${
            reminderIds.includes(
              event.id
            )
              ? "bg-orange-50 border-orange-200 text-orange-500"
              : "bg-white border-slate-100 text-slate-400 hover:text-primary hover:border-primary"
          }`}
        >
          {reminderIds.includes(
            event.id
          )
            ? "Pengingat Aktif"
            : "Ingatkan Saya"}
        </button>

      </div>

    </div>

  </div>

))}

    </div>
  );
};

export default Events;