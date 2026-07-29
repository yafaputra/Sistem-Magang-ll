"use client";
import { useEffect, useState } from "react";
import Topbar from "../components/topbar";

// ⚠️ SESUAIKAN: ganti dengan base URL API project kamu
// contoh umum: process.env.NEXT_PUBLIC_API_URL, atau "" kalau API di-proxy lewat domain yang sama
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "";

// Auth di project ini pakai JWT yang disimpan di localStorage setelah login
// (lihat halaman /masuk: localStorage.setItem("token", data.token))
async function apiGet(path, params) {
  const url = new URL(`${API_BASE_URL}${path}`, typeof window !== "undefined" ? window.location.origin : undefined);
  if (params) {
    Object.entries(params).forEach(([key, value]) => url.searchParams.set(key, value));
  }

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const res = await fetch(url.toString(), {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  if (res.status === 401) {
    throw new Error("Sesi login sudah habis. Silakan login ulang.");
  }

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.message || `Request gagal (${res.status})`);
  }

  return res.json();
}

// ─── Fonts — matches Fraunces (display) + IBM Plex Mono (utility) used across mahasiswa, dosen & admin prodi dashboards ──
const FONTS = `
@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600;9..144,700&family=IBM+Plex+Mono:wght@400;500;600&display=swap');
.font-display { font-family: 'Fraunces', 'Georgia', serif; }
.font-mono { font-family: 'IBM Plex Mono', 'Courier New', monospace; }
`;

// ─── Icon Component ────────────────────────────────────────────────────────────
function Icon({ name, className = "w-5 h-5", stroke = "currentColor" }) {
  const paths = {
    grid:        <><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></>,
    home:        <><path d="M3 9.5L12 3l9 6.5"/><path d="M5 9v11a1 1 0 0 0 1 1h3v-7h6v7h3a1 1 0 0 0 1-1V9"/></>,
    briefcase:   <><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></>,
    users:       <><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></>,
    check:       <><polyline points="20 6 9 17 4 12"/></>,
    plus:        <><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></>,
    calendar:    <><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></>,
    "bar-chart": <><line x1="12" y1="20" x2="12" y2="10"/><line x1="18" y1="20" x2="18" y2="4"/><line x1="6" y1="20" x2="6" y2="16"/></>,
    inbox:       <><path d="M22 12h-6l-2 3h-4l-2-3H2"/><path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/></>,
  };
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      {paths[name]}
    </svg>
  );
}

const getInitials = (name) =>
  (name || "?").split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();

// Palet warna untuk badge status lamaran (mengikuti nilai enum status di controller lamaran)
const STATUS_STYLE = {
  PENDING_BERKAS:         { label: "Pending Berkas",       bg: "bg-amber-50",   text: "text-amber-700",   border: "border-amber-200",   dot: "bg-amber-400" },
  BERKAS_DITERIMA:        { label: "Berkas Diterima",      bg: "bg-[#0A66C2]/5",    text: "text-[#0958A8]",    border: "border-[#0A66C2]/20",    dot: "bg-[#0A66C2]/60" },
  BERKAS_DITOLAK:         { label: "Berkas Ditolak",       bg: "bg-rose-50",    text: "text-rose-700",    border: "border-rose-200",    dot: "bg-rose-400" },
  INTERVIEW_DIJADWALKAN:  { label: "Interview Dijadwalkan",bg: "bg-violet-50",  text: "text-violet-700",  border: "border-violet-200",  dot: "bg-violet-400" },
  LOLOS_INTERVIEW:        { label: "Lolos Interview",      bg: "bg-emerald-50",text: "text-emerald-700",  border: "border-emerald-200", dot: "bg-emerald-400" },
  TIDAK_LOLOS_INTERVIEW:  { label: "Tidak Lolos",          bg: "bg-rose-50",    text: "text-rose-700",    border: "border-rose-200",    dot: "bg-rose-400" },
  DITERIMA_MAGANG:        { label: "Diterima Magang",      bg: "bg-emerald-50",text: "text-emerald-700",  border: "border-emerald-200", dot: "bg-emerald-500" },
  DITOLAK:                { label: "Ditolak",              bg: "bg-rose-50",    text: "text-rose-700",    border: "border-rose-200",    dot: "bg-rose-400" },
  KONFIRMASI_DITERIMA:    { label: "Konfirmasi Diterima",  bg: "bg-emerald-50",text: "text-emerald-700",  border: "border-emerald-200", dot: "bg-emerald-500" },
};

function StatusBadge({ status }) {
  const s = STATUS_STYLE[status] || { label: status || "-", bg: "bg-slate-50", text: "text-slate-600", border: "border-slate-200", dot: "bg-slate-400" };
  return (
    <span className={`font-mono inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wide ${s.bg} ${s.text} border ${s.border}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${s.dot} flex-shrink-0`} />
      {s.label}
    </span>
  );
}

// ─── Stat Card ─────────────────────────────────────────────────────────────────
function StatCard({ s }) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col gap-3 transition-all duration-150 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-blue-100/60">
      <div className="flex items-center justify-between">
        <span className="font-mono text-[10px] text-slate-400 font-semibold uppercase tracking-[0.14em]">{s.label}</span>
        <div className={`w-10 h-10 rounded-xl border flex items-center justify-center flex-shrink-0 ${s.iconBg} ${s.iconBorder}`}>
          <Icon name={s.icon} className={`w-5 h-5 ${s.iconColor}`} />
        </div>
      </div>
      <div className="font-display text-[32px] font-semibold text-slate-800 leading-none tracking-tight">{s.value}</div>
      <div className={`font-mono text-[10.5px] font-semibold tracking-wide flex items-center gap-1 ${s.subClass}`}>
        {s.sub}
      </div>
    </div>
  );
}

function isThisMonth(dateStr) {
  if (!dateStr) return false;
  const d = new Date(dateStr);
  const now = new Date();
  return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
}

// ─── Main Dashboard ────────────────────────────────────────────────────────────
export default function DashboardPerusahaan() {
  const [lowongan, setLowongan] = useState([]);
  const [lamaran, setLamaran] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError(null);
      try {
        // GET /api/lowongan → lowongan milik perusahaan yang login, plus _count.pelamars
        const lowonganRes = await apiGet("/api/lowongan");
        setLowongan(lowonganRes.data || []);

        // GET /api/lamaran → daftar pelamar (dipakai untuk tabel "Pelamar Terbaru")
        // ⚠️ SESUAIKAN jika perusahaan punya endpoint lamaran sendiri (bukan endpoint admin).
        // Kalau endpoint ini 403 untuk role perusahaan, tabel pelamar terbaru akan tampil kosong
        // dan cukup diganti ke endpoint yang sesuai (misal /api/perusahaan/lamaran).
        try {
          const lamaranRes = await apiGet("/api/lamaran", { limit: 5 });
          setLamaran(lamaranRes.data || []);
        } catch {
          setLamaran([]);
        }
      } catch (err) {
        setError(err?.message || "Gagal memuat data dashboard");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  // ── Derivasi angka statistik dari data asli ──────────────────────────────
  const lowonganAktif = lowongan.filter((l) => l.status === "Aktif");
  const lowonganAktifBulanIni = lowonganAktif.filter((l) => isThisMonth(l.createdAt));

  const totalPelamar = lowongan.reduce((sum, l) => sum + (l._count?.pelamars || 0), 0);
  const pelamarMenungguReview = lamaran.filter((l) => l.status === "PENDING_BERKAS" || l.status === "BERKAS_DITERIMA").length;

  const mahasiswaDiterima = lamaran.filter(
    (l) => l.status === "DITERIMA_MAGANG" || l.status === "KONFIRMASI_DITERIMA"
  ).length;
  const diterimaBulanIni = lamaran.filter(
    (l) => (l.status === "DITERIMA_MAGANG" || l.status === "KONFIRMASI_DITERIMA") && isThisMonth(l.updatedAt || l.createdAt)
  ).length;

  const stats = [
    {
      label: "Lowongan Aktif",
      value: lowonganAktif.length,
      sub: `+ ${lowonganAktifBulanIni.length} BULAN INI`,
      subClass: "text-[#0A66C2]",
      icon: "briefcase",
      iconBg: "bg-[#0A66C2]/5",
      iconBorder: "border-[#0A66C2]/20",
      iconColor: "text-[#0A66C2]",
    },
    {
      label: "Total Pelamar",
      value: totalPelamar,
      sub: `${pelamarMenungguReview} MENUNGGU REVIEW`,
      subClass: "text-amber-500",
      icon: "users",
      iconBg: "bg-amber-50",
      iconBorder: "border-amber-200",
      iconColor: "text-amber-600",
    },
    {
      label: "Mahasiswa Diterima",
      value: mahasiswaDiterima,
      sub: `${diterimaBulanIni} BULAN INI`,
      subClass: "text-emerald-600",
      icon: "check",
      iconBg: "bg-emerald-50",
      iconBorder: "border-emerald-200",
      iconColor: "text-emerald-600",
    },
  ];

  const pelamarTerbaru = lamaran.slice(0, 4);
  const jobs = lowonganAktif.slice(0, 5);

  return (
    <div className="font-sans bg-slate-50 min-h-screen">
      <style>{FONTS}</style>

      <Topbar
        icon={<Icon name="grid" className="w-4.5 h-4.5" />}
        title="Dashboard"
        subtitle="Pantau lowongan, pelamar, dan aktivitas magang perusahaan"
        rightSlot={
          <button className="flex items-center gap-2 px-4 py-2 border border-[#0A66C2]/40 rounded-xl text-[#0A66C2] text-[12.5px] font-semibold bg-transparent transition-all duration-150 hover:bg-[#0958A8] hover:text-white hover:border-[#0A66C2] cursor-pointer">
            <div className="w-6 h-6 rounded-lg bg-[#0A66C2]/10 border border-[#0A66C2]/20 flex items-center justify-center flex-shrink-0">
              <Icon name="home" className="w-3.5 h-3.5" />
            </div>
            Back to homepage
          </button>
        }
      />

      <div className="px-8 py-6 flex flex-col gap-5">

        {error && (
          <div className="bg-rose-50 border border-rose-200 text-rose-700 text-[13px] rounded-xl px-4 py-3">
            {error}
          </div>
        )}

        {/* Stats — 3 kolom (rating dihapus) */}
        <div className="grid grid-cols-3 gap-3.5">
          {loading
            ? Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="bg-white border border-slate-200 rounded-2xl p-5 h-[126px] animate-pulse" />
              ))
            : stats.map((s, i) => <StatCard key={i} s={s} />)}
        </div>

        {/* Middle row */}
        <div className="grid grid-cols-2 gap-5">

          {/* Pelamar Terbaru */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6">
            <div className="flex items-center gap-2.5 mb-5 pb-4 border-b border-dashed border-slate-200">
              <div className="w-7 h-7 rounded-lg bg-[#0A66C2]/5 border border-[#0A66C2]/20 flex items-center justify-center flex-shrink-0">
                <Icon name="users" className="w-3.5 h-3.5 text-[#0A66C2]" />
              </div>
              <span className="text-[14px] font-bold text-slate-800">Pelamar Terbaru</span>
            </div>

            {loading ? (
              <div className="flex flex-col gap-3">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="h-9 bg-slate-100 rounded-lg animate-pulse" />
                ))}
              </div>
            ) : pelamarTerbaru.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-2 py-10 text-slate-400">
                <Icon name="inbox" className="w-6 h-6" />
                <span className="text-[12.5px]">Belum ada pelamar masuk</span>
              </div>
            ) : (
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    {["Mahasiswa", "Posisi", "Status"].map((h) => (
                      <th key={h} className="text-left font-mono text-[10px] font-bold tracking-[0.14em] uppercase text-slate-400 pb-3 pr-3 border-b border-slate-100">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {pelamarTerbaru.map((a) => (
                    <tr key={a.id} className="group hover:bg-slate-50 transition-colors">
                      <td className="py-2.5 pr-3 border-b border-slate-50 group-last:border-0">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-lg border flex items-center justify-center font-display text-[10px] font-semibold flex-shrink-0 bg-[#0A66C2]/10 text-[#0958A8] border-[#0A66C2]/20">
                            {getInitials(a.name)}
                          </div>
                          <span className="text-[12.5px] text-slate-700 font-medium">{a.name}</span>
                        </div>
                      </td>
                      <td className="py-2.5 pr-3 text-[12.5px] text-slate-500 border-b border-slate-50 group-last:border-0">
                        {a.lowongan?.posisi || "-"}
                      </td>
                      <td className="py-2.5 pr-3 border-b border-slate-50 group-last:border-0">
                        <StatusBadge status={a.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Lowongan Aktif (ringkas) */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6">
            <div className="flex items-center gap-2.5 mb-5 pb-4 border-b border-dashed border-slate-200">
              <div className="w-7 h-7 rounded-lg bg-violet-50 border border-violet-200 flex items-center justify-center flex-shrink-0">
                <Icon name="bar-chart" className="w-3.5 h-3.5 text-violet-600" />
              </div>
              <span className="text-[14px] font-bold text-slate-800">Kuota Terisi per Lowongan</span>
            </div>

            {loading ? (
              <div className="flex flex-col gap-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="h-6 bg-slate-100 rounded-lg animate-pulse" />
                ))}
              </div>
            ) : lowonganAktif.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-2 py-10 text-slate-400">
                <Icon name="briefcase" className="w-6 h-6" />
                <span className="text-[12.5px]">Belum ada lowongan aktif</span>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {lowonganAktif.slice(0, 5).map((l) => {
                  const terisi = l._count?.pelamars || 0;
                  const target = l.target || l.kuota || 1;
                  const pct = Math.min(100, Math.round((terisi / target) * 100));
                  return (
                    <div key={l.id}>
                      <div className="flex justify-between items-center mb-1.5">
                        <span className="text-[12.5px] font-semibold text-slate-700">{l.posisi}</span>
                        <span className="font-mono text-[11px] font-semibold text-slate-400">{terisi}/{target}</span>
                      </div>
                      <div className="h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-blue-500 to-blue-300"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Lowongan Aktif */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-5 pb-4 border-b border-dashed border-slate-200">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center flex-shrink-0">
                <Icon name="briefcase" className="w-3.5 h-3.5 text-emerald-600" />
              </div>
              <span className="text-[14px] font-bold text-slate-800">Lowongan Aktif</span>
              <span className="font-mono text-[10.5px] font-semibold text-slate-400 bg-slate-100 px-2.5 py-0.5 rounded-full">{jobs.length}</span>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-[#0A66C2] text-white border border-[#0A66C2] rounded-xl text-[12px] font-semibold cursor-pointer transition-colors duration-150 hover:bg-[#0958A8]">
              <div className="w-5 h-5 rounded-md bg-[#0A66C2]/60 border border-[#0A66C2]/40 flex items-center justify-center flex-shrink-0">
                <Icon name="plus" className="w-3 h-3 text-white" />
              </div>
              Kelola Semua
            </button>
          </div>

          {loading ? (
            <div className="flex flex-col gap-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-10 bg-slate-100 rounded-lg animate-pulse" />
              ))}
            </div>
          ) : jobs.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-2 py-10 text-slate-400">
              <Icon name="briefcase" className="w-6 h-6" />
              <span className="text-[12.5px]">Belum ada lowongan aktif. Buat lowongan baru untuk mulai menerima pelamar.</span>
            </div>
          ) : (
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  {["Posisi", "Departemen", "Kuota", "Deadline", "Status"].map((h) => (
                    <th key={h} className="text-left font-mono text-[10px] font-bold tracking-[0.14em] uppercase text-slate-400 pb-3 pr-3 border-b border-slate-100">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {jobs.map((j) => (
                  <tr key={j.id} className="group hover:bg-slate-50 transition-colors">
                    <td className="py-3 pr-3 border-b border-slate-50 group-last:border-0">
                      <div className="text-[13px] font-semibold text-slate-800">{j.posisi}</div>
                    </td>
                    <td className="py-3 pr-3 border-b border-slate-50 group-last:border-0">
                      <span className="inline-flex items-center gap-1.5 text-[12px] text-slate-500">
                        {j.departemen || "-"}
                      </span>
                    </td>
                    <td className="py-3 pr-3 text-[12.5px] text-slate-600 border-b border-slate-50 group-last:border-0">
                      {j._count?.pelamars || 0} / {j.kuota} orang
                    </td>
                    <td className="py-3 pr-3 border-b border-slate-50 group-last:border-0">
                      <div className="flex items-center gap-1.5 font-mono text-[11px] tracking-wide text-slate-500">
                        <div className="w-5 h-5 rounded-md bg-slate-100 border border-slate-200 flex items-center justify-center flex-shrink-0">
                          <Icon name="calendar" className="w-3 h-3 text-slate-400" />
                        </div>
                        {j.deadline ? new Date(j.deadline).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" }) : "-"}
                      </div>
                    </td>
                    <td className="py-3 pr-3 border-b border-slate-50 group-last:border-0">
                      <StatusBadge status={j.status === "Aktif" ? "DITERIMA_MAGANG" : j.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

      </div>
    </div>
  );
}