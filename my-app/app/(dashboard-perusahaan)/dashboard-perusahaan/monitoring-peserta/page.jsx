"use client";

import { useEffect, useMemo, useState } from "react";
import Topbar from "../../components/topbar";

/* ── Fonts — sama persis dengan Kelola Lowongan / Dashboard Dosen ───────────── */
const FONTS = `
@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600;9..144,700&family=IBM+Plex+Mono:wght@400;500;600&display=swap');
.font-display { font-family: 'Fraunces', 'Georgia', serif; }
.font-mono { font-family: 'IBM Plex Mono', 'Courier New', monospace; }
`;

/* ═══════════════════════════════════════════════════════════════════════════
   ICONS — gaya stroke-based, konsisten dengan Kelola Lowongan
═══════════════════════════════════════════════════════════════════════════ */
const IconUsers = ({ size = 18, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);
const IconActivity = ({ size = 18, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
  </svg>
);
const IconCheckCircle = ({ size = 18, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);
const IconAlertTriangle = ({ size = 18, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
    <line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
);
const IconSearch = ({ size = 15 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
  </svg>
);
const IconHome = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9.5L12 3l9 6.5" /><path d="M5 9v11a1 1 0 0 0 1 1h3v-7h6v7h3a1 1 0 0 0 1-1V9" />
  </svg>
);
const IconEye = ({ size = 15 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
  </svg>
);
const IconBook = ({ size = 15 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
  </svg>
);
const IconAward = ({ size = 15 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="8" r="6" /><path d="M15.5 13.5 17 22l-5-3-5 3 1.5-8.5" />
  </svg>
);
const IconMessage = ({ size = 15 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);
const IconX = ({ size = 15 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);
const IconMail = ({ size = 12 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16v16H4z" opacity="0" /><path d="M22 6 12 13 2 6" /><path d="M2 6h20v12H2z" />
  </svg>
);
const IconPhone = ({ size = 12 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
);
const IconCalendar = ({ size = 12 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);
const IconGraduationCap = ({ size = 12 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 10 12 5 2 10l10 5 10-5z" /><path d="M6 12v5c0 1.5 3 3 6 3s6-1.5 6-3v-5" />
  </svg>
);
const IconStar = ({ size = 13, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color} stroke={color} strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);
const IconChevronDown = ({ size = 13 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 12 15 18 9" />
  </svg>
);
const IconToastSuccess = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
  </svg>
);
const IconToastError = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>
  </svg>
);

/* ═══════════════════════════════════════════════════════════════════════════
   CONFIG
═══════════════════════════════════════════════════════════════════════════ */
const STATUS_TABS = ["Semua", "Aktif", "Selesai", "Cuti", "Dropout"];
const STATUS_OPTIONS = ["Aktif", "Selesai", "Cuti", "Dropout"];
const FINAL_PERIODE_LABEL = "Final";

const STATUS_CONFIG = {
  Aktif:    { bg: "#d1fae5", text: "#065f46", border: "#a7f3d0" },
  Selesai:  { bg: "#dbeafe", text: "#1d4ed8", border: "#93c5fd" },
  Cuti:     { bg: "#faeeda", text: "#854f0b", border: "#fde68a" },
  Dropout:  { bg: "#fee2e2", text: "#991b1b", border: "#fecaca" },
};

const AVATAR_COLORS = [
  { bg: "#EFF6FF", text: "#0A66C2", border: "#93C5FD" },
  { bg: "#ECFDF5", text: "#059669", border: "#A7F3D0" },
  { bg: "#FFFBEB", text: "#B45309", border: "#FDE68A" },
  { bg: "#F5F3FF", text: "#6D28D9", border: "#DDD6FE" },
  { bg: "#FDF2F8", text: "#BE185D", border: "#FBCFE8" },
];

function initials(name) {
  return (name || "?").split(" ").slice(0, 2).map((w) => w[0] ?? "").join("").toUpperCase();
}
function avatarColor(id) {
  return AVATAR_COLORS[id % AVATAR_COLORS.length];
}
function fmtDate(d) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
}
function isFinalPenilaian(p) {
  return (p.periode || "").trim().toLowerCase() === FINAL_PERIODE_LABEL.toLowerCase();
}

/* ── Data mock — dipakai hanya sebagai fallback selagi backend belum siap ──── */
const MOCK_PESERTA = [
  {
    id: 1, nama: "Andi Pratama", nim: "21/123456/TK/01", prodi: "Teknik Informatika",
    universitas: "Universitas Gadjah Mada", email: "andi.pratama@mail.ugm.ac.id", telepon: "081234567890",
    posisi: "Frontend Developer Intern", pembimbing: "Siti Rahma, S.Kom",
    mulai: "2025-03-01", selesai: "2025-05-31", status: "Aktif",
    logbook: [
      { id: 1, tanggal: "2025-06-02", judul: "Implementasi halaman dashboard", status: "Disetujui" },
      { id: 2, tanggal: "2025-06-09", judul: "Integrasi API lowongan", status: "Disetujui" },
      { id: 3, tanggal: "2025-06-16", judul: "Perbaikan bug responsive", status: "Menunggu Review" },
    ],
    penilaian: [
      { id: 1, periode: "Bulan ke-1", nilai: 88, feedback: "Inisiatif baik, komunikasi lancar." },
      { id: 2, periode: "Bulan ke-2", nilai: 90, feedback: "Progress konsisten, siap tanggung jawab lebih." },
    ],
  },
  {
    id: 2, nama: "Bintang Sari", nim: "21/234567/TK/02", prodi: "Sistem Informasi",
    universitas: "Universitas Gadjah Mada", email: "bintang.sari@mail.ugm.ac.id", telepon: "081298765432",
    posisi: "Data Analyst Intern", pembimbing: "Reza Firmansyah",
    mulai: "2025-03-01", selesai: "2025-05-31", status: "Aktif",
    logbook: [
      { id: 1, tanggal: "2025-06-03", judul: "Eksplorasi dataset transaksi", status: "Disetujui" },
      { id: 2, tanggal: "2025-06-10", judul: "Membuat dashboard visualisasi", status: "Disetujui" },
    ],
    penilaian: [
      { id: 1, periode: "Bulan ke-1", nilai: 82, feedback: "Perlu tingkatkan ketepatan waktu laporan." },
    ],
  },
  {
    id: 3, nama: "Citra Dewi", nim: "21/345678/EK/01", prodi: "Ekonomi",
    universitas: "Universitas Gadjah Mada", email: "citra.dewi@mail.ugm.ac.id", telepon: "081311122233",
    posisi: "Finance Intern", pembimbing: "Hendra Wijaya",
    mulai: "2025-02-01", selesai: "2025-04-30", status: "Selesai",
    logbook: [
      { id: 1, tanggal: "2025-04-20", judul: "Rekonsiliasi laporan keuangan Q1", status: "Disetujui" },
    ],
    penilaian: [
      { id: 1, periode: "Bulan ke-1", nilai: 91, feedback: "Sangat teliti dan rapi dalam pembukuan." },
      { id: 2, periode: "Final", nilai: 93, feedback: "Layak direkomendasikan untuk posisi penuh waktu." },
    ],
  },
  {
    id: 4, nama: "Dodi Kurnia", nim: "21/456789/TK/03", prodi: "Teknik Elektro",
    universitas: "Universitas Gadjah Mada", email: "dodi.kurnia@mail.ugm.ac.id", telepon: "081344455566",
    posisi: "Engineering Intern", pembimbing: "Yusuf Maulana",
    mulai: "2025-01-01", selesai: "2025-03-31", status: "Dropout",
    logbook: [
      { id: 1, tanggal: "2025-01-15", judul: "Orientasi lapangan", status: "Disetujui" },
    ],
    penilaian: [],
  },
  {
    id: 5, nama: "Eka Putri", nim: "21/567890/FK/01", prodi: "Farmasi",
    universitas: "Universitas Gadjah Mada", email: "eka.putri@mail.ugm.ac.id", telepon: "081377788899",
    posisi: "Quality Control Intern", pembimbing: "Nadia Kusuma",
    mulai: "2025-04-01", selesai: "2025-06-30", status: "Cuti",
    logbook: [
      { id: 1, tanggal: "2025-04-10", judul: "Pengecekan standar mutu batch A", status: "Disetujui" },
    ],
    penilaian: [
      { id: 1, periode: "Bulan ke-1", nilai: 78, feedback: "Cuti sakit di minggu ke-3, progress tertunda." },
    ],
  },
  {
    id: 6, nama: "Farhan Maulana", nim: "21/678901/TK/04", prodi: "Teknik Industri",
    universitas: "Universitas Gadjah Mada", email: "farhan.maulana@mail.ugm.ac.id", telepon: "081355566677",
    posisi: "Operations Intern", pembimbing: "Lina Marlina",
    mulai: "2025-01-01", selesai: "2025-03-31", status: "Selesai",
    logbook: [
      { id: 1, tanggal: "2025-03-20", judul: "Audit proses produksi lini 2", status: "Disetujui" },
    ],
    penilaian: [
      { id: 1, periode: "Bulan ke-1", nilai: 85, feedback: "Analitis dan proaktif mencari solusi." },
    ],
  },
];

/* ═══════════════════════════════════════════════════════════════════════════
   TOAST
═══════════════════════════════════════════════════════════════════════════ */
function useToast() {
  const [toasts, setToasts] = useState([]);
  const showToast = (type, title, message = "") => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, type, title, message, hiding: false }]);
    setTimeout(() => {
      setToasts((prev) => prev.map((t) => (t.id === id ? { ...t, hiding: true } : t)));
      setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 250);
    }, 3200);
  };
  const removeToast = (id) => {
    setToasts((prev) => prev.map((t) => (t.id === id ? { ...t, hiding: true } : t)));
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 250);
  };
  return { toasts, showToast, removeToast };
}

function ToastContainer({ toasts, onRemove }) {
  const cfg = {
    success: { iconBg: "#ecfdf5", iconBorder: "#a7f3d0", titleColor: "#065f46", bar: "#10b981" },
    error:   { iconBg: "#fff5f5", iconBorder: "#fecaca", titleColor: "#991b1b", bar: "#ef4444" },
  };
  return (
    <div className="fixed z-[9999] flex flex-col gap-2.5 pointer-events-none" style={{ top: 76, right: 20, width: 320 }}>
      {toasts.map((t) => {
        const c = cfg[t.type] ?? cfg.success;
        return (
          <div key={t.id} className="bg-white rounded-2xl flex items-start gap-3 pointer-events-auto"
            style={{
              border: `1px solid ${c.iconBorder}`, padding: "13px 13px 11px",
              animation: t.hiding ? "toastOut 0.25s cubic-bezier(.4,0,1,1) forwards" : "toastIn 0.3s cubic-bezier(.21,1.02,.73,1) both",
            }}>
            <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
              style={{ background: c.iconBg, border: `1.5px solid ${c.iconBorder}` }}>
              {t.type === "error" ? <IconToastError /> : <IconToastSuccess />}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[13.5px] font-bold leading-snug" style={{ color: c.titleColor }}>{t.title}</p>
              {t.message && <p className="text-[12px] text-[#64748b] mt-0.5 leading-relaxed">{t.message}</p>}
              <div className="h-[3px] rounded-full mt-2.5 bg-[#f1f5f9] overflow-hidden">
                <div className="h-full rounded-full" style={{ background: c.bar, animation: "toastProgress 3.2s linear forwards" }} />
              </div>
            </div>
            <button onClick={() => onRemove(t.id)} className="w-5 h-5 flex items-center justify-center rounded-md text-[#94a3b8] hover:bg-[#f1f5f9] hover:text-[#475569] transition-all flex-shrink-0 mt-0.5 cursor-pointer">
              <IconX size={12} />
            </button>
          </div>
        );
      })}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   SHARED BITS
═══════════════════════════════════════════════════════════════════════════ */
function IconBtn({ onClick, title, variant = "default", disabled = false, children }) {
  const base = "w-9 h-9 rounded-xl border-2 flex items-center justify-center transition-all duration-150 flex-shrink-0 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed";
  const variants = {
    default : "border-[#e2e8f0] bg-white text-[#64748b] hover:bg-[#f1f5f9] hover:border-[#cbd5e1] hover:text-[#1e293b]",
    primary : "border-[#93C5FD] bg-[#EFF6FF] text-[#08519c] hover:bg-[#DBEAFE] hover:border-[#60A5FA]",
    green   : "border-[#bbf7d0] bg-[#f0fdf4] text-[#16a34a] hover:bg-[#dcfce7] hover:border-[#86efac]",
    amber   : "border-[#fde68a] bg-[#fffbeb] text-[#b45309] hover:bg-[#fef3c7] hover:border-[#fcd34d]",
    gold    : "border-[#fbbf24] bg-gradient-to-br from-[#fffbeb] to-[#fef3c7] text-[#92400e] hover:from-[#fef3c7] hover:to-[#fde68a] hover:border-[#f59e0b]",
  };
  return (
    <button className={`${base} ${variants[variant]}`} onClick={onClick} title={title} disabled={disabled}>
      {children}
    </button>
  );
}

function Avatar({ id, name, size = "md" }) {
  const c = avatarColor(id);
  const sz = size === "lg" ? "w-16 h-16 rounded-2xl text-[16px]" : size === "sm" ? "w-9 h-9 rounded-lg text-[11px]" : "w-10 h-10 rounded-xl text-[12px]";
  return (
    <div className={`${sz} flex items-center justify-center font-bold flex-shrink-0 border`} style={{ background: c.bg, color: c.text, borderColor: c.border }}>
      {initials(name)}
    </div>
  );
}

function StatusBadge({ status }) {
  const c = STATUS_CONFIG[status] ?? { bg: "#f1f5f9", text: "#64748b", border: "#e2e8f0" };
  return (
    <span className="font-mono inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wide border"
      style={{ background: c.bg, color: c.text, borderColor: c.border }}>
      <span className="w-[5px] h-[5px] rounded-full bg-current" />{status}
    </span>
  );
}

/* Dropdown kecil untuk mengubah status magang langsung dari Detail Modal */
function StatusDropdown({ value, onChange, disabled }) {
  const [open, setOpen] = useState(false);
  const c = STATUS_CONFIG[value] ?? { bg: "#f1f5f9", text: "#64748b", border: "#e2e8f0" };
  return (
    <div className="relative">
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen((o) => !o)}
        className="font-mono inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wide border cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        style={{ background: c.bg, color: c.text, borderColor: c.border }}
      >
        <span className="w-[5px] h-[5px] rounded-full bg-current" />{value}<IconChevronDown />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute z-20 top-full left-0 mt-1.5 bg-white border border-[#e2e8f0] rounded-xl overflow-hidden w-36">
            {STATUS_OPTIONS.map((s) => {
              const sc = STATUS_CONFIG[s];
              return (
                <button
                  key={s}
                  onClick={() => { setOpen(false); if (s !== value) onChange(s); }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-[12px] font-semibold hover:bg-[#f8fafc] transition-colors text-left"
                  style={{ color: sc.text }}
                >
                  <span className="w-[6px] h-[6px] rounded-full bg-current" />{s}
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   DETAIL MODAL
═══════════════════════════════════════════════════════════════════════════ */
function DetailModal({ item, onClose, onLogbook, onPenilaian, onPenilaianAkhir, onUpdateStatus, statusUpdating }) {
  if (!item) return null;
  const finalPenilaian = item.penilaian.find(isFinalPenilaian);
  const periodikPenilaian = item.penilaian.filter((p) => !isFinalPenilaian(p));
  const isSelesai = item.status === "Selesai";

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[999] backdrop-blur-sm px-4" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-[640px] border border-[#e2e8f0] overflow-hidden flex flex-col"
        style={{ animation: "popIn 0.18s ease", maxHeight: "90vh" }} onClick={(e) => e.stopPropagation()}>

        <div className="flex items-start gap-4 px-6 pt-6 pb-5 border-b border-[#f1f5f9]">
          <Avatar id={item.id} name={item.nama} size="lg" />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <h2 className="text-[17px] font-bold text-[#1e1e2e] font-display">{item.nama}</h2>
              <StatusDropdown value={item.status} disabled={statusUpdating} onChange={(s) => onUpdateStatus(item, s)} />
            </div>
            <p className="text-[12.5px] text-[#64748b]">{item.nim} · {item.prodi}</p>
            <div className="font-mono flex items-center gap-3 text-[11px] text-[#94a3b8] tracking-wide mt-2 flex-wrap">
              <span className="flex items-center gap-1"><IconMail />{item.email}</span>
              <span className="flex items-center gap-1"><IconPhone />{item.telepon}</span>
            </div>
          </div>
          <IconBtn title="Tutup" onClick={onClose}><IconX /></IconBtn>
        </div>

        <div className="px-6 py-5 overflow-y-auto flex flex-col gap-5">
          <div className="grid grid-cols-2 gap-3">
            {[
              ["Universitas", item.universitas],
              ["Posisi Magang", item.posisi],
              ["Pembimbing Perusahaan", item.pembimbing],
              ["Periode Magang", `${fmtDate(item.mulai)} – ${fmtDate(item.selesai)}`],
            ].map(([label, val]) => (
              <div key={label} className="bg-[#fafafa] border border-[#f1f5f9] rounded-xl p-3">
                <div className="text-[10.5px] font-bold uppercase tracking-widest text-[#94a3b8] mb-1 font-mono">{label}</div>
                <div className="text-[13px] font-semibold text-[#1e1e2e]">{val || "—"}</div>
              </div>
            ))}
          </div>

          {/* Riwayat Logbook */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-[11px] font-bold uppercase tracking-widest text-[#94a3b8]">Riwayat Logbook</p>
              <button onClick={() => onLogbook(item)} className="text-[11.5px] font-semibold text-[#0A66C2] hover:underline">Lihat semua →</button>
            </div>
            {item.logbook.length === 0 ? (
              <p className="text-[12.5px] text-[#94a3b8]">Belum ada logbook yang diunggah.</p>
            ) : (
              <ul className="flex flex-col gap-1.5">
                {item.logbook.slice(0, 3).map((l) => (
                  <li key={l.id} className="flex items-center justify-between gap-3 text-[12.5px] bg-[#fafafa] border border-[#f1f5f9] rounded-lg px-3 py-2">
                    <span className="text-[#374151] truncate">{l.judul}</span>
                    <span className="font-mono text-[10.5px] text-[#94a3b8] flex-shrink-0">{fmtDate(l.tanggal)}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Penilaian Akhir — hanya relevan setelah magang berstatus Selesai */}
          {isSelesai && (
            <div>
              <p className="text-[11px] font-bold uppercase tracking-widest text-[#94a3b8] mb-2">Penilaian Akhir Magang</p>
              {finalPenilaian ? (
                <div className="relative overflow-hidden rounded-xl border-2 border-[#fbbf24] bg-gradient-to-br from-[#fffbeb] to-[#fef9e7] px-4 py-3.5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 mb-1">
                        <IconStar size={12} color="#b45309" />
                        <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-[#92400e]">Penilaian Akhir</span>
                      </div>
                      <p className="text-[12.5px] text-[#78350f] leading-relaxed">{finalPenilaian.feedback}</p>
                    </div>
                    <span className="font-display text-[24px] font-bold text-[#92400e] flex-shrink-0">{finalPenilaian.nilai}</span>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between gap-3 rounded-xl border-2 border-dashed border-[#fde68a] bg-[#fffbeb] px-4 py-3.5">
                  <div>
                    <p className="text-[13px] font-semibold text-[#92400e]">Magang sudah selesai</p>
                    <p className="text-[12px] text-[#b45309] mt-0.5">Beri penilaian akhir sebagai rekap kinerja peserta.</p>
                  </div>
                  <button
                    onClick={() => onPenilaianAkhir(item)}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#f59e0b] text-white text-[12px] font-bold hover:bg-[#d97706] transition-colors flex-shrink-0"
                  >
                    <IconAward size={13} />Beri Penilaian Akhir
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Riwayat Penilaian periodik */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-[11px] font-bold uppercase tracking-widest text-[#94a3b8]">Riwayat Penilaian Berkala</p>
              <button onClick={() => onPenilaian(item)} className="text-[11.5px] font-semibold text-[#0A66C2] hover:underline">Beri penilaian →</button>
            </div>
            {periodikPenilaian.length === 0 ? (
              <p className="text-[12.5px] text-[#94a3b8]">Belum ada penilaian berkala.</p>
            ) : (
              <ul className="flex flex-col gap-1.5">
                {periodikPenilaian.map((p) => (
                  <li key={p.id} className="flex items-start justify-between gap-3 text-[12.5px] bg-[#fafafa] border border-[#f1f5f9] rounded-lg px-3 py-2.5">
                    <div className="min-w-0">
                      <p className="font-semibold text-[#1e1e2e]">{p.periode}</p>
                      <p className="text-[#64748b] mt-0.5">{p.feedback}</p>
                    </div>
                    <span className="font-display text-[18px] font-semibold text-[#0A66C2] flex-shrink-0">{p.nilai}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   LOGBOOK MODAL
═══════════════════════════════════════════════════════════════════════════ */
function LogbookModal({ item, onClose }) {
  if (!item) return null;
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[999] backdrop-blur-sm px-4" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-[520px] border border-[#e2e8f0] overflow-hidden flex flex-col"
        style={{ animation: "popIn 0.18s ease", maxHeight: "85vh" }} onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#f1f5f9]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#EFF6FF] border-2 border-[#93C5FD] flex items-center justify-center text-[#0A66C2]"><IconBook /></div>
            <div>
              <h2 className="text-[15px] font-bold text-[#1e1e2e] font-display">Logbook {item.nama}</h2>
              <p className="text-[11.5px] text-[#94a3b8]">{item.logbook.length} entri tercatat</p>
            </div>
          </div>
          <IconBtn title="Tutup" onClick={onClose}><IconX /></IconBtn>
        </div>
        <div className="px-6 py-4 overflow-y-auto flex flex-col gap-2.5">
          {item.logbook.length === 0 ? (
            <p className="text-[13px] text-[#94a3b8] text-center py-8">Belum ada logbook yang diunggah.</p>
          ) : item.logbook.map((l) => (
            <div key={l.id} className="border border-[#f1f5f9] rounded-xl px-4 py-3 flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="text-[13px] font-semibold text-[#1e1e2e] truncate">{l.judul}</p>
                <p className="font-mono text-[11px] text-[#94a3b8] mt-0.5">{fmtDate(l.tanggal)}</p>
              </div>
              <span className={`font-mono text-[10.5px] font-bold uppercase px-2.5 py-1 rounded-full flex-shrink-0 ${
                l.status === "Disetujui" ? "bg-[#d1fae5] text-[#065f46]" : "bg-[#faeeda] text-[#854f0b]"
              }`}>{l.status}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   PENILAIAN MODAL — dipakai untuk penilaian berkala maupun penilaian akhir
═══════════════════════════════════════════════════════════════════════════ */
function PenilaianModal({ item, isFinal = false, onClose, onSubmit, submitting }) {
  const [periode, setPeriode] = useState(isFinal ? FINAL_PERIODE_LABEL : "");
  const [nilai, setNilai] = useState("");
  const [feedback, setFeedback] = useState("");
  const [err, setErr] = useState({});

  if (!item) return null;

  const inputBase = "w-full px-3 py-2 text-[13px] text-[#1e1e2e] bg-white border border-[#e2e8f0] rounded-lg outline-none transition-all placeholder:text-[#94a3b8] focus:border-[#0A66C2] focus:ring-2 focus:ring-[#0A66C2]/10 disabled:bg-[#f8fafc] disabled:text-[#94a3b8]";

  const submit = () => {
    const e = {};
    if (!periode.trim()) e.periode = "Wajib diisi";
    const n = Number(nilai);
    if (!nilai || isNaN(n) || n < 0 || n > 100) e.nilai = "Masukkan nilai 0–100";
    if (!feedback.trim()) e.feedback = "Wajib diisi";
    if (Object.keys(e).length) { setErr(e); return; }
    onSubmit(item.id, { periode, nilai: n, feedback });
  };

  const accent = isFinal
    ? { iconBg: "bg-gradient-to-br from-[#fffbeb] to-[#fef3c7]", iconBorder: "border-[#fbbf24]", iconColor: "text-[#92400e]", btn: "bg-[#f59e0b] hover:bg-[#d97706]" }
    : { iconBg: "bg-[#fffbeb]", iconBorder: "border-[#fde68a]", iconColor: "text-[#b45309]", btn: "bg-[#0A66C2] hover:bg-[#08519c]" };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[999] backdrop-blur-sm px-4" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-[440px] border border-[#e2e8f0] overflow-hidden"
        style={{ animation: "popIn 0.18s ease" }} onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#f1f5f9]">
          <div className="flex items-center gap-2.5">
            <div className={`w-9 h-9 rounded-xl ${accent.iconBg} border-2 ${accent.iconBorder} flex items-center justify-center ${accent.iconColor}`}>
              {isFinal ? <IconStar size={16} color="currentColor" /> : <IconAward />}
            </div>
            <div>
              <h2 className="text-[15px] font-bold text-[#1e1e2e] font-display">{isFinal ? "Beri Penilaian Akhir" : "Beri Penilaian"}</h2>
              <p className="text-[11.5px] text-[#94a3b8]">{item.nama} · {item.posisi}</p>
            </div>
          </div>
          <IconBtn title="Tutup" onClick={onClose}><IconX /></IconBtn>
        </div>

        {isFinal && (
          <div className="mx-6 mt-4 px-3.5 py-2.5 rounded-lg bg-[#fffbeb] border border-[#fde68a] text-[11.5px] text-[#92400e] leading-relaxed">
            Ini adalah rekap penilaian akhir untuk peserta yang magangnya sudah berstatus <strong>Selesai</strong>. Nilai ini akan tampil sebagai ringkasan kinerja keseluruhan.
          </div>
        )}

        <div className="px-6 py-5 flex flex-col gap-3.5">
          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] font-semibold text-[#374151]">Periode Penilaian<span className="text-red-500 ml-0.5">*</span></label>
            <input
              className={inputBase}
              placeholder="cth: Bulan ke-2"
              value={periode}
              disabled={isFinal}
              onChange={(e) => setPeriode(e.target.value)}
            />
            {err.periode && <p className="text-[11px] text-red-500">{err.periode}</p>}
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] font-semibold text-[#374151]">Nilai (0–100)<span className="text-red-500 ml-0.5">*</span></label>
            <input type="number" min={0} max={100} className={inputBase} placeholder="cth: 88" value={nilai} onChange={(e) => setNilai(e.target.value)} />
            {err.nilai && <p className="text-[11px] text-red-500">{err.nilai}</p>}
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] font-semibold text-[#374151]">Feedback<span className="text-red-500 ml-0.5">*</span></label>
            <textarea rows={4} className={inputBase + " resize-none"} placeholder="Catatan kinerja peserta magang..." value={feedback} onChange={(e) => setFeedback(e.target.value)} />
            {err.feedback && <p className="text-[11px] text-red-500">{err.feedback}</p>}
          </div>
        </div>
        <div className="px-6 py-4 border-t border-[#f1f5f9] bg-[#fafafa] flex gap-3">
          <button onClick={onClose} className="flex-1 py-2.5 border border-[#e2e8f0] rounded-xl bg-white text-[#374151] text-[13px] font-semibold hover:bg-[#f8fafc] transition-all">Batal</button>
          <button
            onClick={submit}
            disabled={submitting}
            className={`flex-1 py-2.5 rounded-xl text-white text-[13px] font-semibold transition-colors disabled:opacity-60 ${accent.btn}`}
          >
            {submitting ? "Menyimpan..." : "Simpan Penilaian"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   PESAN MODAL (placeholder ringan — belum ada endpoint pesan di backend)
═══════════════════════════════════════════════════════════════════════════ */
function PesanModal({ item, onClose, onSend }) {
  const [pesan, setPesan] = useState("");
  if (!item) return null;
  const inputBase = "w-full px-3 py-2 text-[13px] text-[#1e1e2e] bg-white border border-[#e2e8f0] rounded-lg outline-none transition-all placeholder:text-[#94a3b8] focus:border-[#0A66C2] focus:ring-2 focus:ring-[#0A66C2]/10";
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[999] backdrop-blur-sm px-4" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-[420px] border border-[#e2e8f0] overflow-hidden"
        style={{ animation: "popIn 0.18s ease" }} onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#f1f5f9]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#f1f5f9] border-2 border-[#e2e8f0] flex items-center justify-center text-[#64748b]"><IconMessage /></div>
            <div>
              <h2 className="text-[15px] font-bold text-[#1e1e2e] font-display">Kirim Pesan</h2>
              <p className="text-[11.5px] text-[#94a3b8]">Kepada {item.nama}</p>
            </div>
          </div>
          <IconBtn title="Tutup" onClick={onClose}><IconX /></IconBtn>
        </div>
        <div className="px-6 py-5">
          <textarea rows={4} className={inputBase + " resize-none"} placeholder="Tulis pesan singkat..." value={pesan} onChange={(e) => setPesan(e.target.value)} />
        </div>
        <div className="px-6 py-4 border-t border-[#f1f5f9] bg-[#fafafa] flex gap-3">
          <button onClick={onClose} className="flex-1 py-2.5 border border-[#e2e8f0] rounded-xl bg-white text-[#374151] text-[13px] font-semibold hover:bg-[#f8fafc] transition-all">Batal</button>
          <button
            onClick={() => { if (pesan.trim()) { onSend(item, pesan); setPesan(""); } }}
            className="flex-1 py-2.5 rounded-xl bg-[#0A66C2] text-white text-[13px] font-semibold hover:bg-[#08519c] transition-colors"
          >
            Kirim
          </button>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   SKELETON ROW
═══════════════════════════════════════════════════════════════════════════ */
function SkeletonRow() {
  return (
    <tr className="border-b border-[#f1f5f9] animate-pulse">
      {Array.from({ length: 7 }).map((_, i) => (
        <td key={i} className="px-4 py-4"><div className="h-4 bg-slate-100 rounded w-4/5" /></td>
      ))}
    </tr>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   MAIN PAGE
═══════════════════════════════════════════════════════════════════════════ */
export default function DaftarMahasiswaMagang() {
  const [peserta, setPeserta] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);
  const [search, setSearch]   = useState("");
  const [statusTab, setStatusTab] = useState("Semua");

  const [detailItem, setDetailItem]       = useState(null);
  const [logbookItem, setLogbookItem]     = useState(null);
  const [penilaianItem, setPenilaianItem] = useState(null); // { item, isFinal }
  const [pesanItem, setPesanItem]         = useState(null);

  const [submittingPenilaian, setSubmittingPenilaian] = useState(false);
  const [statusUpdating, setStatusUpdating] = useState(false);

  const { toasts, showToast, removeToast } = useToast();

  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const authHeaders = () => ({
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  });

  /* ── Fetch data mahasiswa magang milik perusahaan yang login ──────────────
     Endpoint: GET /api/perusahaan/mahasiswa-magang (lihat magang.controller.js)  */
  const fetchPeserta = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`${API_URL}/api/perusahaan/mahasiswa-magang`, {
        headers: authHeaders(),
      });
      if (!res.ok) throw new Error("Endpoint belum tersedia");
      const result = await res.json();
      setPeserta(result.data || []);
    } catch {
      // fallback ke data contoh selama endpoint backend belum bisa diakses
      setPeserta(MOCK_PESERTA);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPeserta();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return peserta.filter((p) => {
      const matchTab = statusTab === "Semua" || p.status === statusTab;
      const matchQ =
        !q ||
        p.nama.toLowerCase().includes(q) ||
        p.nim.toLowerCase().includes(q) ||
        p.prodi.toLowerCase().includes(q) ||
        p.posisi.toLowerCase().includes(q);
      return matchTab && matchQ;
    });
  }, [peserta, search, statusTab]);

  const stats = useMemo(() => ({
    total:    peserta.length,
    aktif:    peserta.filter((p) => p.status === "Aktif").length,
    selesai:  peserta.filter((p) => p.status === "Selesai").length,
    masalah:  peserta.filter((p) => p.status === "Cuti" || p.status === "Dropout").length,
  }), [peserta]);

  /* ── Simpan penilaian (berkala ATAU akhir) ke backend ────────────────────── */
  const handleSubmitPenilaian = async (lamaranId, { periode, nilai, feedback }) => {
    setSubmittingPenilaian(true);
    try {
      const res = await fetch(`${API_URL}/api/perusahaan/mahasiswa-magang/${lamaranId}/penilaian`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify({ periode, nilai, feedback }),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.message || "Gagal menyimpan penilaian");

      setPeserta((prev) =>
        prev.map((p) => (p.id === lamaranId ? { ...p, penilaian: [...p.penilaian, result.data] } : p))
      );

      const isFinal = isFinalPenilaian({ periode });
      showToast(
        "success",
        isFinal ? "Penilaian akhir tersimpan" : "Penilaian tersimpan",
        isFinal
          ? "Penilaian akhir peserta magang berhasil disimpan."
          : `Nilai untuk periode "${periode}" berhasil ditambahkan.`
      );
      setPenilaianItem(null);
    } catch (err) {
      showToast("error", "Gagal menyimpan penilaian", err.message);
    } finally {
      setSubmittingPenilaian(false);
    }
  };

  /* ── Ubah status magang (Aktif / Selesai / Cuti / Dropout) ───────────────── */
  const handleUpdateStatus = async (item, status) => {
    setStatusUpdating(true);
    try {
      const res = await fetch(`${API_URL}/api/perusahaan/mahasiswa-magang/${item.id}/status`, {
        method: "PATCH",
        headers: authHeaders(),
        body: JSON.stringify({ status }),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.message || "Gagal memperbarui status");

      setPeserta((prev) => prev.map((p) => (p.id === item.id ? { ...p, status } : p)));
      setDetailItem((prev) => (prev && prev.id === item.id ? { ...prev, status } : prev));
      showToast("success", "Status diperbarui", `Status magang ${item.nama} diubah menjadi ${status}.`);
    } catch (err) {
      showToast("error", "Gagal memperbarui status", err.message);
    } finally {
      setStatusUpdating(false);
    }
  };

  const handleSendPesan = (item) => {
    showToast("success", "Pesan terkirim", `Pesan berhasil dikirim ke ${item.nama}.`);
    setPesanItem(null);
  };

  const STAT_STRIP = [
    { label: "Total Peserta Magang", value: stats.total,   color: "text-[#0A66C2]", icon: <IconUsers size={16} /> },
    { label: "Peserta Aktif",        value: stats.aktif,   color: "text-emerald-600", icon: <IconActivity size={16} /> },
    { label: "Peserta Selesai",      value: stats.selesai, color: "text-blue-600",  icon: <IconCheckCircle size={16} /> },
    { label: "Cuti / Dropout",       value: stats.masalah, color: "text-amber-500", icon: <IconAlertTriangle size={16} /> },
  ];

  return (
    <div className="font-sans bg-slate-50 min-h-screen flex flex-col gap-6">
      <style>{FONTS}</style>
      <style>{`
        @keyframes popIn { from { transform: scale(0.95) translateY(8px); opacity: 0; } to { transform: scale(1) translateY(0); opacity: 1; } }
        @keyframes toastIn { from { opacity: 0; transform: translateX(20px) scale(0.97); } to { opacity: 1; transform: translateX(0) scale(1); } }
        @keyframes toastOut { from { opacity: 1; transform: translateX(0) scale(1); } to { opacity: 0; transform: translateX(20px) scale(0.97); } }
        @keyframes toastProgress { from { width: 100%; } to { width: 0%; } }
      `}</style>

      <Topbar
        icon={<IconUsers size={18} />}
        title="Daftar Mahasiswa Magang"
        subtitle="Kelola dan pantau mahasiswa yang magang di perusahaan Anda"
        iconBg="bg-[#EFF6FF]"
        iconBorder="border-[#93C5FD]"
        iconColor="text-[#0A66C2]"
        rightSlot={
          <button
            onClick={() => (window.location.href = "/")}
            className="flex items-center gap-2 px-4 py-2 border border-blue-300 rounded-xl text-blue-600 text-[12.5px] font-semibold bg-transparent transition-all duration-150 hover:bg-blue-500 hover:text-white hover:border-blue-500 cursor-pointer"
          >
            <div className="w-6 h-6 rounded-lg bg-blue-100 border border-blue-200 flex items-center justify-center flex-shrink-0">
              <IconHome />
            </div>
            Back to homepage
          </button>
        }
      />

      <main className="px-7 py-6 flex flex-col gap-5">

        {/* Info banner */}
        <div className="bg-[#EFF6FF] border border-[#93C5FD] rounded-2xl px-5 py-4 text-[13px] text-[#0A66C2]">
          <p className="font-bold mb-1">Cakupan data</p>
          <p>
            Halaman ini hanya menampilkan mahasiswa yang sedang atau pernah magang di{" "}
            <strong>perusahaan Anda</strong> — diambil dari lamaran yang telah diterima pada lowongan milik perusahaan ini.
            Peserta dengan status <strong>Selesai</strong> dapat diberikan penilaian akhir sebagai rekap kinerja.
          </p>
        </div>

        {/* Stat strip — ledger */}
        <div className="grid grid-cols-2 md:grid-cols-4 bg-white border border-slate-200 rounded-2xl overflow-hidden">
          {STAT_STRIP.map((s, i) => (
            <div key={i}
              className={`px-6 py-5 flex flex-col gap-2 transition-colors duration-150 hover:bg-slate-50 border-r border-dashed border-slate-200 md:last:border-r-0 ${i % 2 === 0 ? "max-[900px]:border-r" : "max-[900px]:border-r-0"}`}
            >
              <div className="flex items-center gap-1.5">
                <span className={s.color}>{s.icon}</span>
                <span className={`font-mono text-[10px] uppercase tracking-[0.14em] font-semibold ${s.color}`}>{s.label}</span>
              </div>
              {loading
                ? <div className="h-8 w-10 bg-slate-100 rounded animate-pulse" />
                : <span className={`font-display text-[32px] font-semibold leading-none tracking-tight ${s.color}`}>{s.value}</span>}
            </div>
          ))}
        </div>

        {/* Toolbar: search + status tabs */}
        <div className="bg-white border border-[#e2e8f0] rounded-xl px-5 py-4 flex flex-col gap-3.5">
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-2 flex-1 min-w-[220px] bg-[#f8fafc] border border-[#e2e8f0] rounded-xl px-3.5 py-2.5 focus-within:border-[#0A66C2] focus-within:bg-white focus-within:ring-2 focus-within:ring-[#0A66C2]/10 transition-all">
              <IconSearch />
              <input
                className="border-none outline-none text-[13px] text-[#1e1e2e] bg-transparent w-full placeholder:text-[#94a3b8]"
                placeholder="Cari nama, NIM, program studi, atau posisi magang..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <span className="text-[11.5px] text-[#94a3b8] bg-[#f5f5fb] px-2.5 py-1 rounded-full font-medium font-mono whitespace-nowrap">
              {filtered.length} peserta
            </span>
          </div>

          <div className="flex gap-1 bg-[#f5f5fb] p-1 rounded-lg w-fit flex-wrap">
            {STATUS_TABS.map((t) => (
              <button
                key={t}
                onClick={() => setStatusTab(t)}
                className={`px-3.5 py-1.5 rounded-md text-[12px] font-medium transition-all ${
                  statusTab === t
                    ? "bg-white text-[#0A66C2] shadow-sm border border-[#e2e8f0]"
                    : "text-[#94a3b8] hover:text-[#0A66C2]"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="bg-white border border-[#e2e8f0] rounded-xl overflow-hidden">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                {["Peserta", "Program Studi", "Posisi Magang", "Mulai", "Selesai", "Status", "Aksi"].map((h) => (
                  <th key={h} className="text-left text-[10.5px] font-bold tracking-[0.07em] uppercase text-[#94a3b8] px-4 py-3 bg-[#fafafa] border-b border-[#f1f5f9] font-mono">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 4 }).map((_, i) => <SkeletonRow key={i} />)
              ) : error ? (
                <tr><td colSpan={7} className="text-center py-12 text-[13px] text-red-400">{error}</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={7} className="text-center py-12 text-[13px] text-[#94a3b8]">Tidak ada peserta yang cocok dengan pencarian/filter.</td></tr>
              ) : filtered.map((item) => {
                const isSelesai = item.status === "Selesai";
                const hasFinal = item.penilaian.some(isFinalPenilaian);
                return (
                  <tr key={item.id} className="border-b border-[#f8f8fc] last:border-0 hover:bg-[#fafafa] transition-colors">
                    {/* Foto/Avatar + Nama + NIM */}
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <Avatar id={item.id} name={item.nama} />
                        <div className="min-w-0">
                          <div className="text-[13px] font-semibold text-[#1e1e2e] truncate">{item.nama}</div>
                          <div className="font-mono text-[11px] text-[#94a3b8]">{item.nim}</div>
                        </div>
                      </div>
                    </td>
                    {/* Program Studi */}
                    <td className="px-4 py-3.5">
                      <span className="inline-flex items-center gap-1.5 text-[12px] font-medium text-[#374151] bg-[#f1f5f9] px-2.5 py-1 rounded-full">
                        <IconGraduationCap />{item.prodi}
                      </span>
                    </td>
                    {/* Posisi Magang */}
                    <td className="px-4 py-3.5 text-[12.5px] text-[#1e1e2e] font-medium">{item.posisi}</td>
                    {/* Mulai */}
                    <td className="px-4 py-3.5">
                      <span className="font-mono flex items-center gap-1.5 text-[11.5px] text-[#64748b]"><IconCalendar />{fmtDate(item.mulai)}</span>
                    </td>
                    {/* Selesai */}
                    <td className="px-4 py-3.5">
                      <span className="font-mono flex items-center gap-1.5 text-[11.5px] text-[#64748b]"><IconCalendar />{fmtDate(item.selesai)}</span>
                    </td>
                    {/* Status */}
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <StatusBadge status={item.status} />
                        {isSelesai && hasFinal && (
                          <span className="inline-flex items-center gap-1 text-[9.5px] font-bold uppercase tracking-wide text-[#92400e] bg-[#fef3c7] border border-[#fbbf24] px-1.5 py-0.5 rounded-full">
                            <IconStar size={9} color="#92400e" />Dinilai
                          </span>
                        )}
                      </div>
                    </td>
                    {/* Aksi */}
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-1.5">
                        <IconBtn variant="green"   title="Detail"        onClick={() => setDetailItem(item)}><IconEye /></IconBtn>
                        <IconBtn variant="primary" title="Lihat Logbook" onClick={() => setLogbookItem(item)}><IconBook /></IconBtn>
                        {isSelesai ? (
                          <IconBtn
                            variant="gold"
                            title={hasFinal ? "Penilaian akhir sudah ada — lihat detail" : "Beri Penilaian Akhir"}
                            onClick={() => (hasFinal ? setDetailItem(item) : setPenilaianItem({ item, isFinal: true }))}
                          >
                            <IconStar size={14} color="currentColor" />
                          </IconBtn>
                        ) : (
                          <IconBtn variant="amber" title="Beri Penilaian" onClick={() => setPenilaianItem({ item, isFinal: false })}>
                            <IconAward />
                          </IconBtn>
                        )}
                        <IconBtn variant="default" title="Kirim Pesan" onClick={() => setPesanItem(item)}><IconMessage /></IconBtn>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {!loading && (
            <div className="flex items-center justify-between px-5 py-3 border-t border-[#f1f5f9]">
              <span className="text-[12px] text-[#94a3b8] font-mono">Menampilkan {filtered.length} dari {peserta.length} peserta</span>
            </div>
          )}
        </div>
      </main>

      {/* Modals */}
      {detailItem && (
        <DetailModal
          item={detailItem}
          onClose={() => setDetailItem(null)}
          onLogbook={(it) => { setDetailItem(null); setLogbookItem(it); }}
          onPenilaian={(it) => { setDetailItem(null); setPenilaianItem({ item: it, isFinal: false }); }}
          onPenilaianAkhir={(it) => { setDetailItem(null); setPenilaianItem({ item: it, isFinal: true }); }}
          onUpdateStatus={handleUpdateStatus}
          statusUpdating={statusUpdating}
        />
      )}
      {logbookItem && <LogbookModal item={logbookItem} onClose={() => setLogbookItem(null)} />}
      {penilaianItem && (
        <PenilaianModal
          item={penilaianItem.item}
          isFinal={penilaianItem.isFinal}
          submitting={submittingPenilaian}
          onClose={() => setPenilaianItem(null)}
          onSubmit={handleSubmitPenilaian}
        />
      )}
      {pesanItem && <PesanModal item={pesanItem} onClose={() => setPesanItem(null)} onSend={handleSendPesan} />}

      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  );
}