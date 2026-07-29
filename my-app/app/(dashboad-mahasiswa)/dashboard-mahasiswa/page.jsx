"use client";

import { useState, useEffect } from "react";
import useAuth from "../../hooks/useAuth";
import Topbar from "../components/topbar";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

// ─── Palette (light / blue) ─────────────────────────────────────────────────
const FONTS = `
@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600;9..144,700&family=IBM+Plex+Mono:wght@400;500;600&display=swap');
.font-display { font-family: 'Fraunces', 'Georgia', serif; }
.font-mono { font-family: 'IBM Plex Mono', 'Courier New', monospace; }
`;

function Icon({ name, className = "w-5 h-5", stroke = "currentColor" }) {
  const paths = {
    grid:        <><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></>,
    home:        <><path d="M3 9.5L12 3l9 6.5"/><path d="M5 9v11a1 1 0 0 0 1 1h3v-7h6v7h3a1 1 0 0 0 1-1V9"/></>,
    send:        <><path d="M22 2L11 13"/><path d="M22 2L15 22l-4-9-9-4 20-7z"/></>,
    calendar:    <><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/><path d="M9 16l2 2 4-4"/></>,
    doc:         <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><polyline points="9 15 11 17 15 13"/></>,
    "doc-plain": <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="9" y1="13" x2="15" y2="13"/><line x1="9" y1="17" x2="13" y2="17"/></>,
    clock:       <><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></>,
    check:       <><polyline points="20 6 9 17 4 12"/></>,
    x:           <><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></>,
    stamp:       <><path d="M12 3v4"/><path d="M8 7h8l2 5H6l2-5z"/><rect x="4" y="12" width="16" height="7" rx="1"/></>,
  };
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      {paths[name]}
    </svg>
  );
}

// Timeline masih statis — belum ada controller untuk ini
const timelineItems = [
  { label: "Orientasi & Onboarding",  date: "1 FEB 2025",  done: true  },
  { label: "Proyek Pertama",          date: "15 FEB 2025", done: true  },
  { label: "Evaluasi Tengah Periode", date: "1 APR 2025",  done: true  },
  { label: "Presentasi Akhir",        date: "20 MEI 2025", done: false },
  { label: "Selesai Magang",          date: "31 MEI 2025", done: false },
];

// Helper format tanggal untuk kartu stat (Magang Mulai / Magang Selesai)
function fmtDate(d) {
  if (!d) return "-";
  return new Date(d).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" });
}

// Badge kecil untuk status laporan — dipakai di card "Status Laporan"
function statusBadge(status) {
  if (status === "DISETUJUI") {
    return {
      cls: "bg-emerald-50 text-emerald-700 border-emerald-200",
      icon: "check",
      text: "DISETUJUI",
      barCls: "bg-emerald-500",
    };
  }
  if (status === "DITOLAK") {
    return {
      cls: "bg-red-50 text-red-600 border-red-200",
      icon: "x",
      text: "DITOLAK",
      barCls: "bg-red-400",
    };
  }
  return {
    cls: "bg-amber-50 text-amber-700 border-amber-200",
    icon: null,
    text: "MENUNGGU",
    barCls: "bg-amber-500",
  };
}


// ─── Helper fetch dengan token ───────────────────────────────────────────────
async function authFetch(path) {
  const token = localStorage.getItem("token");
  const res = await fetch(`${API_BASE}${path}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.message || `Request gagal (${res.status})`);
  }
  return res.json();
}

export default function DashboardPage() {

  useAuth("mahasiswa");

  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);

  const [profile, setProfile] = useState(null);       // getProfileMahasiswa
  const [infoAktif, setInfoAktif] = useState(null);   // getInfoAktifMahasiswa
  const [reports, setReports] = useState([]);         // getLaporanMahasiswa

  useEffect(() => {
    let mounted = true;

    async function loadDashboard() {
      setLoading(true);
      setErrorMsg(null);
      try {
        const [profileRes, laporanRes] = await Promise.all([
          authFetch("/api/mahasiswa/profile"),
          authFetch("/api/laporan-magang/mahasiswa"),
        ]);

        if (!mounted) return;
        setProfile(profileRes.data);
        setReports(laporanRes.data || []);

        // info-aktif dipisah try/catch sendiri karena bisa 404 kalau
        // mahasiswa belum KONFIRMASI_DITERIMA — bukan error fatal
        try {
          const infoRes = await authFetch("/api/mahasiswa/magang/info-aktif");
          if (mounted) setInfoAktif(infoRes.data);
        } catch {
          if (mounted) setInfoAktif(null);
        }
      } catch (err) {
        if (mounted) setErrorMsg(err.message);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadDashboard();
    return () => { mounted = false; };
  }, []);

  // ── Stats: sebagian dihitung dari data asli, sebagian masih placeholder ──
  // Backend sudah memetakan status lama "SUDAH_DINILAI" -> "DISETUJUI",
  // jadi laporan lama tetap terhitung benar tanpa perlu migrasi data.
  const laporanSelesai = reports.filter((r) => r.status === "DISETUJUI").length;

  const stats = [
    { label: "Lamaran Dikirim", value: 18, suffix: "", sub: "Sedang diproses", icon: "send", accent: "#2563EB" }, // TODO: sambungkan ke endpoint lamaran
    {
      label: "Magang Mulai",
      value: fmtDate(infoAktif?.tanggalMulai),
      suffix: "",
      sub: "Tanggal mulai magang",
      icon: "calendar",
      accent: "#7C3AED",
    },
    { label: "Laporan Disetujui", value: laporanSelesai, suffix: "", sub: "Sudah disetujui dosen", icon: "doc", accent: "#059669" },
    {
      label: "Magang Selesai",
      value: fmtDate(infoAktif?.tanggalSelesai),
      suffix: "",
      sub: "Tanggal selesai magang",
      icon: "clock",
      accent: "#D97706",
    },
  ];

  const namaMahasiswa = profile?.nama || profile?.name || "Mahasiswa";
  const perusahaanAktif = infoAktif?.perusahaan || "-";

  return (
    <div className="font-sans bg-slate-50 min-h-screen">
      <style>{FONTS}</style>

      <Topbar
        icon={<Icon name="grid" className="w-4.5 h-4.5" />}
        title="Dashboard"
        subtitle="Pantau progres magang kamu"
        rightSlot={
          <button className="flex items-center gap-2 px-4 py-2 border border-[#0A66C2]/40 rounded-xl text-[#0A66C2] text-[12.5px] font-semibold bg-transparent transition-all duration-150 hover:bg-[#0958A8] hover:text-white hover:border-[#0A66C2] cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0A66C2]">
            <div className="w-6 h-6 rounded-lg bg-[#0A66C2]/10 border border-[#0A66C2]/20 flex items-center justify-center flex-shrink-0">
              <Icon name="home" className="w-3.5 h-3.5" />
            </div>
            Back to homepage
          </button>
        }
      />

      <div className="px-8 py-6 flex flex-col gap-5">

        {errorMsg && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-[13px] rounded-xl px-4 py-3">
            Gagal memuat data dashboard: {errorMsg}
          </div>
        )}

        {/* Welcome card */}
        <div className="relative overflow-hidden bg-gradient-to-br from-[#0A66C2]/20 via-[#0A66C2]/5 to-[#0A66C2]/5 border border-[#0A66C2]/10 rounded-[28px] px-7 py-6 flex items-center justify-between gap-6 max-[700px]:flex-col max-[700px]:items-start">
          <div className="pointer-events-none absolute left-0 right-0 bottom-0 h-2 flex items-center justify-around opacity-20">
            {[...Array(28)].map((_, i) => (
              <span key={i} className="w-1 h-1 rounded-full bg-[#0A66C2]/60" />
            ))}
          </div>

          <div className="min-w-0">
            <div className="font-mono text-[10px] text-[#0A66C2] border border-[#0A66C2]/20 bg-white rounded-full px-2.5 py-1 w-fit tracking-[0.2em] uppercase mb-3">
              Selamat Datang
            </div>
            <div className="font-display text-slate-800 text-[30px] font-semibold tracking-tight leading-none">
              {loading ? "Halo…" : `Halo, ${namaMahasiswa}`}
            </div>
            <div className="text-slate-500 text-[12.5px] mt-2.5">
              Magang aktif di <span className="text-slate-700 font-semibold">{perusahaanAktif}</span>
            </div>
          </div>


        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 max-[900px]:grid-cols-1 bg-white border border-slate-200 rounded-2xl overflow-hidden">
          {stats.map((s, i) => (
            <div
              key={i}
              className={[
                "px-6 py-5 flex flex-col gap-2 transition-colors duration-150 hover:bg-slate-50",
                "border-r border-dashed border-slate-200 last:border-r-0",
                "max-[900px]:border-r-0 max-[900px]:border-b max-[900px]:border-dashed max-[900px]:last:border-b-0",
              ].join(" ")}
            >
              <div className="flex items-center gap-1.5">
                <Icon name={s.icon} className="w-3.5 h-3.5" stroke={s.accent} />
                <span className="font-mono text-[10px] uppercase tracking-[0.14em] font-semibold" style={{ color: s.accent }}>
                  {s.label}
                </span>
              </div>
              <div className="flex items-end gap-1">
                <span
                  className={`font-display font-semibold leading-none tracking-tight text-slate-800 ${
                    typeof s.value === "string" ? "text-[20px]" : "text-[32px]"
                  }`}
                >
                  {s.value}
                </span>
                {s.suffix && <span className="text-[12px] text-slate-400 font-medium mb-1">{s.suffix}</span>}
              </div>
              <span className="text-[11px] text-slate-400">{s.sub}</span>
            </div>
          ))}
        </div>

        {/* Bottom Grid */}
        <div className="grid grid-cols-[1fr_1.6fr] gap-5 max-[900px]:grid-cols-1">

          {/* Timeline Card — masih statis */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6">
            <div className="flex items-center gap-2.5 mb-5 pb-4 border-b border-dashed border-slate-200">
              <Icon name="stamp" className="w-4 h-4 text-[#0A66C2]" />
              <span className="text-[14px] font-bold text-slate-800 flex-1">Timeline Magang</span>
              <span className="font-mono text-[10px] text-slate-400 tracking-wide">FEB–MEI 2025</span>
            </div>
            <div className="flex flex-col gap-0">
              {timelineItems.map((item, i) => (
                <div key={i} className="flex gap-4 items-start">
                  <div className="flex flex-col items-center pt-0.5">
                    <div
                      className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                        item.done ? "border-[#0A66C2] bg-[#0A66C2]" : "border-slate-200 bg-white"
                      }`}
                    >
                      {item.done && (
                        <svg width="8" height="8" viewBox="0 0 10 10" fill="none">
                          <path d="M2 5l2.5 2.5L8 3" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      )}
                    </div>
                    {i < timelineItems.length - 1 && (
                      <div className={`w-px flex-1 min-h-[32px] ${item.done ? "bg-[#0A66C2]/25" : "border-l border-dashed border-slate-200"}`} />
                    )}
                  </div>
                  <div className="pb-5">
                    <div className={`text-[12.5px] font-semibold ${item.done ? "text-slate-800" : "text-slate-300"}`}>
                      {item.label}
                    </div>
                    <div className="font-mono text-[10px] text-slate-400 mt-1 tracking-wide">{item.date}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Status Laporan Card — sekarang dari API, 3 status: Menunggu/Disetujui/Ditolak */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-5 pb-4 border-b border-dashed border-slate-200">
              <div className="flex items-center gap-2.5">
                <Icon name="doc-plain" className="w-4 h-4 text-[#0A66C2]" />
                <span className="text-[14px] font-bold text-slate-800">Status Laporan</span>
              </div>
              <button className="text-[12px] text-[#0A66C2] font-semibold hover:underline cursor-pointer">
                Lihat semua →
              </button>
            </div>

            {loading ? (
              <div className="text-[12.5px] text-slate-400 py-6 text-center">Memuat laporan…</div>
            ) : reports.length === 0 ? (
              <div className="text-[12.5px] text-slate-400 py-6 text-center">Belum ada laporan dikirim.</div>
            ) : (
              <div className="flex flex-col gap-2.5">
                {reports.slice(0, 3).map((r) => {
                  const badge = statusBadge(r.status);
                  return (
                    <div
                      key={r.id}
                      className="relative flex items-center gap-3.5 pl-5 pr-4 py-3.5 bg-white border border-slate-100 rounded-xl hover:border-[#0A66C2]/20 hover:bg-[#0A66C2]/5/40 transition-all duration-150 group cursor-pointer overflow-hidden"
                    >
                      <span className={`absolute left-0 top-0 bottom-0 w-1 ${badge.barCls}`} />
                      <div className="w-10 h-10 rounded-lg bg-[#0A66C2]/5 border border-[#0A66C2]/20 flex items-center justify-center flex-shrink-0">
                        <Icon name="doc-plain" className="w-4 h-4 text-[#0A66C2]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-[13px] font-semibold text-slate-800 group-hover:text-[#0A66C2] transition-colors duration-150 truncate">
                          {r.judul}
                        </div>
                        <div className="font-mono text-[10px] text-slate-400 mt-1 tracking-wide">
                          {new Date(r.tanggal).toLocaleDateString("id-ID", { day: "2-digit", month: "long", year: "numeric" }).toUpperCase()}
                        </div>
                      </div>
                      <span
                        className={`font-mono inline-flex items-center gap-1.5 shrink-0 px-2.5 py-1 rounded-full text-[10px] font-semibold tracking-wide border ${badge.cls}`}
                      >
                        {badge.icon && <Icon name={badge.icon} className="w-2.5 h-2.5" />}
                        {badge.text}
                      </span>
                    </div>
                  );
                })}

                <div className="mt-1 flex items-center justify-between px-1">
                  <span className="font-mono text-[10.5px] text-slate-400 tracking-wide">
                    {Math.min(3, reports.length)} DARI {reports.length} LAPORAN
                  </span>
                  <div className="flex gap-1">
                    {[...Array(Math.min(12, reports.length))].map((_, i) => (
                      <div key={i} className={`w-1.5 h-1.5 rounded-full ${i < Math.min(3, reports.length) ? "bg-[#0A66C2]" : "bg-slate-200"}`} />
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}