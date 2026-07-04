"use client";

import { useState, useEffect, useMemo } from "react";
import Topbar from "../../components/topbar";

// ─── Fonts — sama dengan Dashboard Dosen (Fraunces + IBM Plex Mono) ─────────
const FONTS = `
@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600;9..144,700&family=IBM+Plex+Mono:wght@400;500;600&display=swap');
.font-display { font-family: 'Fraunces', 'Georgia', serif; }
.font-mono { font-family: 'IBM Plex Mono', 'Courier New', monospace; }
`;

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000";
const getToken = () => { try { return localStorage.getItem("token") || ""; } catch { return ""; } };

// ─── Status Config — palet disamakan dengan Dashboard Dosen (biru/amber/emerald/red/slate) ──
const STATUS_CONFIG = {
  MENUNGGU_PERSETUJUAN_DOSEN: {
    label: "Menunggu Keputusan",
    badge: "bg-amber-50 text-amber-700 border-amber-200",
    dot: "bg-amber-400",
    urgent: true,
  },
  MENUNGGU_PENGESAHAN_ADMIN: {
    label: "Menunggu Pengesahan Admin",
    badge: "bg-[#EFF6FF] text-[#0A66C2] border-[#93C5FD]",
    dot: "bg-[#0A66C2]",
  },
  BIMBINGAN_AKTIF: {
    label: "Bimbingan Aktif",
    badge: "bg-emerald-50 text-emerald-700 border-emerald-200",
    dot: "bg-emerald-500",
  },
  DITOLAK_DOSEN: {
    label: "Ditolak",
    badge: "bg-red-50 text-red-600 border-red-200",
    dot: "bg-red-400",
  },
  MENUNGGU_VERIFIKASI_PRODI: {
    label: "Proses Prodi",
    badge: "bg-slate-100 text-slate-600 border-slate-200",
    dot: "bg-slate-400",
  },
  SELESAI: {
    label: "Selesai",
    badge: "bg-slate-100 text-slate-600 border-slate-200",
    dot: "bg-slate-400",
  },
};

// Urutan prioritas tampilan: yang perlu aksi dulu
const STATUS_PRIORITY = {
  MENUNGGU_PERSETUJUAN_DOSEN: 0,
  MENUNGGU_PENGESAHAN_ADMIN: 1,
  BIMBINGAN_AKTIF: 2,
  MENUNGGU_VERIFIKASI_PRODI: 3,
  DITOLAK_DOSEN: 4,
  SELESAI: 5,
};

const initials = (name) => (name || "?").split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
const formatDate = (d) => d ? new Date(d).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }) : "-";

// ─── Icon Set ─────────────────────────────────────────────────────────────────
const Icon = {
  Users: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...p}>
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
  Check: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" {...p}>
      <polyline points="20 6 9 17 4 12" />
    </svg>
  ),
  X: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" {...p}>
      <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  ),
  XCircle: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" {...p}>
      <circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" />
    </svg>
  ),
  AlertCircle: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...p}>
      <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  ),
  Search: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...p}>
      <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
    </svg>
  ),
  Refresh: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...p}>
      <polyline points="23 4 23 10 17 10" /><polyline points="1 20 1 14 7 14" />
      <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
    </svg>
  ),
};

// ─── Toast ────────────────────────────────────────────────────────────────────
function Toast({ toast }) {
  if (!toast?.message) return null;
  const isError = toast.type === "error";
  const cls = isError ? "bg-red-50 text-red-600 border-red-200" : "bg-emerald-50 text-emerald-700 border-emerald-200";
  return (
    <div
      className={`fixed top-4 right-4 z-50 flex items-center gap-2.5 text-[13px] font-medium px-4 py-3 rounded-xl max-w-sm border ${cls}`}
      style={{ animation: "slideIn 0.2s ease" }}
    >
      {isError ? <Icon.AlertCircle className="w-4 h-4 flex-shrink-0" /> : <Icon.Check className="w-4 h-4 flex-shrink-0" />}
      <span>{toast.message}</span>
    </div>
  );
}

// ─── Confirm Setuju Dialog ────────────────────────────────────────────────────
function SetujuiDialog({ open, mahasiswaNama, sumberPenetapan, onConfirm, onCancel, loading }) {
  if (!open) return null;
  const infoLanjutan = sumberPenetapan === "MAHASISWA"
    ? "Karena ini usulan mahasiswa sendiri, status akan menjadi Menunggu Pengesahan Admin sebelum resmi aktif."
    : "Karena Anda ditunjuk oleh admin prodi, status akan langsung menjadi Bimbingan Aktif.";
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4" onClick={onCancel}>
      <div
        className="bg-white rounded-2xl border border-slate-200 w-full max-w-md p-6"
        style={{ animation: "popIn 0.18s ease" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-11 h-11 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center mb-4 text-emerald-600">
          <Icon.Check className="w-5 h-5" />
        </div>
        <h3 className="text-[15px] font-bold text-slate-800 mb-1.5">Setujui Permohonan Bimbingan?</h3>
        <p className="text-[12.5px] text-slate-500 leading-relaxed mb-2">
          Anda akan menjadi dosen pembimbing untuk <strong className="text-slate-700">{mahasiswaNama}</strong>.
        </p>
        <p className="font-mono text-[11px] text-slate-400 leading-relaxed mb-5 tracking-wide">{infoLanjutan}</p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            disabled={loading}
            className="flex-1 py-2.5 border border-slate-200 rounded-xl text-slate-600 text-[13px] font-semibold hover:bg-slate-50 transition-colors disabled:opacity-50"
          >
            Batal
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 py-2.5 rounded-xl bg-emerald-600 text-white text-[13px] font-semibold hover:bg-emerald-700 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {loading ? (
              <><div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />Menyetujui...</>
            ) : (
              "Ya, Setujui"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Tolak Modal ──────────────────────────────────────────────────────────────
function TolakModal({ mahasiswaNama, onClose, onConfirm, loading }) {
  const [alasan, setAlasan] = useState("");
  const valid = alasan.trim().length >= 10;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4" onClick={onClose}>
      <div
        className="bg-white rounded-2xl border border-slate-200 w-full max-w-md"
        style={{ animation: "popIn 0.18s ease" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200">
          <div>
            <div className="text-[13.5px] font-semibold text-slate-800">Tolak Permohonan Bimbingan</div>
            <div className="font-mono text-[11px] text-slate-400 mt-0.5 tracking-wide">
              {mahasiswaNama ? `Mahasiswa: ${mahasiswaNama}` : "Berikan alasan penolakan yang jelas"}
            </div>
          </div>
          <button onClick={onClose} className="w-7 h-7 rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-slate-100 transition-colors">
            <Icon.X className="w-3.5 h-3.5" />
          </button>
        </div>
        <div className="px-5 py-4">
          <label className="font-mono block text-[10.5px] font-semibold text-slate-400 mb-1.5 uppercase tracking-wide">
            Alasan Penolakan <span className="text-red-500">*</span>
          </label>
          <textarea
            value={alasan}
            onChange={(e) => setAlasan(e.target.value)}
            rows={4}
            placeholder="Jelaskan alasan Anda menolak permohonan bimbingan ini (mis. beban bimbingan penuh, tidak sesuai bidang keahlian, dll)..."
            className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-[12.5px] text-slate-700 focus:outline-none focus:border-[#0A66C2] resize-none transition-colors placeholder:text-slate-400"
          />
          <div className="flex justify-between mt-1">
            <p className="text-[11px] text-slate-400">Minimal 10 karakter</p>
            <p className={`font-mono text-[11px] font-medium ${alasan.length < 10 ? "text-red-500" : "text-emerald-600"}`}>{alasan.length} karakter</p>
          </div>
        </div>
        <div className="px-5 pb-5 flex gap-2">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl text-[13px] font-semibold border border-slate-200 text-slate-500 hover:bg-slate-50 transition-colors">
            Batal
          </button>
          <button
            onClick={() => valid && onConfirm(alasan)}
            disabled={!valid || loading}
            className="flex-1 py-2.5 rounded-xl text-[13px] font-semibold bg-red-600 text-white hover:bg-red-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
          >
            {loading ? (
              <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Menolak...</>
            ) : (
              "Tolak Permohonan"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Permohonan Card ──────────────────────────────────────────────────────────
function PermohonanCard({ permohonan, onSetujui, onTolak }) {
  const [expanded, setExpanded] = useState(false);
  const sc = STATUS_CONFIG[permohonan.status] || {};
  const mahasiswaNama = permohonan.mahasiswa?.user?.name || "-";
  const mahasiswaNim = permohonan.mahasiswa?.nim || "-";
  const perusahaan = permohonan.lamaran?.lowongan?.perusahaan?.nama || "-";
  const posisi = permohonan.lamaran?.lowongan?.posisi || "-";
  const isPending = permohonan.status === "MENUNGGU_PERSETUJUAN_DOSEN";
  const isMenungguPengesahan = permohonan.status === "MENUNGGU_PENGESAHAN_ADMIN";

  return (
    <div className={`bg-white border rounded-2xl overflow-hidden flex flex-col ${isPending ? "border-amber-300" : "border-slate-200"}`}>
      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#EFF6FF] to-[#93C5FD] text-[#0A66C2] font-display font-semibold text-[13px] flex items-center justify-center flex-shrink-0 tracking-wide border border-[#93C5FD]/50">
              {initials(mahasiswaNama)}
            </div>
            <div className="min-w-0">
              <div className="text-[14px] font-semibold text-slate-800 truncate">{mahasiswaNama}</div>
              <div className="font-mono text-[11px] text-slate-400 mt-0.5 tracking-wide">{mahasiswaNim}</div>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            {isPending && <div className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />}
            <span className={`font-mono px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wide border ${sc.badge}`}>{sc.label}</span>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {[
            ["Perusahaan", perusahaan],
            ["Posisi", posisi],
            ["Tgl Pengajuan", formatDate(permohonan.createdAt)],
          ].map(([label, val]) => (
            <div key={label}>
              <div className="font-mono text-[10px] text-slate-400 mb-0.5 uppercase tracking-wide">{label}</div>
              <div className="text-[12.5px] font-medium text-slate-700 truncate" title={val}>{val}</div>
            </div>
          ))}
        </div>

        {/* Alasan */}
        <div className="mt-4 bg-slate-50 rounded-xl p-3 border border-slate-100">
          <div className="font-mono text-[10px] font-semibold uppercase tracking-wide text-slate-400 mb-1.5">Alasan Memilih Anda</div>
          <p className={`text-[12.5px] text-slate-600 leading-relaxed ${!expanded ? "line-clamp-2" : ""}`}>
            {permohonan.alasanMemilih || "-"}
          </p>
          {permohonan.alasanMemilih?.length > 100 && (
            <button onClick={() => setExpanded(!expanded)} className="text-[11px] text-[#0A66C2] hover:underline mt-1">
              {expanded ? "Tampilkan lebih sedikit" : "Baca selengkapnya"}
            </button>
          )}
        </div>

        {permohonan.catatanTambahan && (
          <div className="mt-2 bg-[#EFF6FF] border border-[#93C5FD] rounded-xl p-3">
            <div className="font-mono text-[10px] font-semibold uppercase tracking-wide text-[#0A66C2] mb-1">Catatan Mahasiswa</div>
            <p className="text-[12.5px] text-[#0A66C2] leading-relaxed">{permohonan.catatanTambahan}</p>
          </div>
        )}

        {permohonan.alasanPenolakan && (
          <div className="mt-2 bg-red-50 border border-red-200 rounded-xl p-3">
            <div className="font-mono text-[10px] font-semibold uppercase tracking-wide text-red-500 mb-1">Alasan Penolakan Anda</div>
            <p className="text-[12.5px] text-red-600 leading-relaxed">{permohonan.alasanPenolakan}</p>
          </div>
        )}

        <div className="flex-1" />

        {/* Action Buttons */}
        {isPending && (
          <div className="mt-4 flex gap-2">
            <button
              onClick={onSetujui}
              className="flex-1 py-2.5 rounded-xl text-[13px] font-semibold flex items-center justify-center gap-2 bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 transition-colors"
            >
              <Icon.Check className="w-4 h-4" /> Setujui
            </button>
            <button
              onClick={onTolak}
              className="flex-1 py-2.5 rounded-xl text-[13px] font-semibold flex items-center justify-center gap-2 bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 transition-colors"
            >
              <Icon.XCircle className="w-4 h-4" /> Tolak
            </button>
          </div>
        )}

        {isMenungguPengesahan && (
          <div className="mt-4 flex items-center gap-2 bg-[#EFF6FF] border border-[#93C5FD] rounded-xl p-3">
            <div className="w-8 h-8 rounded-lg bg-[#0A66C2] flex items-center justify-center flex-shrink-0">
              <Icon.Check className="w-4 h-4 text-white" />
            </div>
            <div>
              <div className="text-[12.5px] font-semibold text-[#0A66C2]">Sudah Anda Setujui</div>
              <div className="text-[11.5px] text-[#0A66C2]/80">Menunggu pengesahan admin prodi agar resmi aktif</div>
            </div>
          </div>
        )}

        {permohonan.status === "BIMBINGAN_AKTIF" && (
          <div className="mt-4 flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-xl p-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center flex-shrink-0">
              <Icon.Check className="w-4 h-4 text-white" />
            </div>
            <div>
              <div className="text-[12.5px] font-semibold text-emerald-700">Bimbingan Aktif</div>
              <div className="text-[11.5px] text-emerald-600">Anda sedang membimbing mahasiswa ini</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Skeleton Loader ──────────────────────────────────────────────────────────
function SkeletonPage() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <div className="flex items-center justify-between px-6 py-3.5 bg-white border-b border-slate-200">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-slate-100 animate-pulse" />
          <div>
            <div className="h-4 w-56 bg-slate-100 rounded animate-pulse mb-1.5" />
            <div className="h-3 w-72 bg-slate-100 rounded animate-pulse" />
          </div>
        </div>
        <div className="h-9 w-24 bg-slate-100 rounded-lg animate-pulse" />
      </div>
      <div className="grid grid-cols-3 gap-3 px-6 py-4">
        {[0, 1, 2].map((i) => (
          <div key={i} className="h-20 bg-white border border-slate-200 rounded-xl animate-pulse" />
        ))}
      </div>
      <div className="px-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {[0, 1, 2].map((i) => (
          <div key={i} className="h-64 bg-white border border-slate-200 rounded-2xl animate-pulse" />
        ))}
      </div>
    </div>
  );
}

// ─── Stat Icons ───────────────────────────────────────────────────────────────
function StatIcon({ type, className }) {
  const icons = {
    total: (
      <>
        <path d="M9 11l3 3L22 4" />
        <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
      </>
    ),
    menunggu: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3.5 2" />
      </>
    ),
    aktif: (
      <>
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 8l-5 5-2-2" strokeWidth="2.5" />
      </>
    ),
  };
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      {icons[type]}
    </svg>
  );
}

// ─── Stat Row — ledger strip, sama persis dengan Dashboard Dosen ─────────────
function StatRow({ counts }) {
  const stats = [
    { key: "total", label: "Total Permohonan", value: counts.total, sub: "Semua status", color: "text-slate-700" },
    { key: "menunggu", label: "Menunggu Keputusan", value: counts.menunggu, sub: "Perlu Anda tindak lanjuti", color: "text-amber-500" },
    { key: "aktif", label: "Bimbingan Aktif", value: counts.aktif, sub: "Sedang berjalan", color: "text-emerald-600" },
  ];

  return (
    <div className="mx-6 grid grid-cols-3 max-[700px]:grid-cols-1 bg-white border border-slate-200 rounded-2xl overflow-hidden">
      {stats.map((s) => (
        <div
          key={s.key}
          className="px-6 py-5 flex flex-col gap-2 transition-colors duration-150 hover:bg-slate-50 border-r border-dashed border-slate-200 last:border-r-0 max-[700px]:border-r-0 max-[700px]:border-b max-[700px]:last:border-b-0"
        >
          <div className="flex items-center gap-1.5">
            <span className={s.color}><StatIcon type={s.key} className="w-4 h-4" /></span>
            <span className={`font-mono text-[10px] uppercase tracking-[0.14em] font-semibold ${s.color}`}>{s.label}</span>
          </div>
          <span className={`font-display text-[32px] font-semibold leading-none tracking-tight ${s.color}`}>{s.value}</span>
          <span className="text-[11px] text-slate-400">{s.sub}</span>
        </div>
      ))}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function DosenPermohonanBimbinganPage() {
  const [permohonanList, setPermohonanList] = useState([]);
  const [loading, setLoading]               = useState(true);
  const [error, setError]                   = useState("");
  const [search, setSearch]                 = useState("");
  const [filterStatus, setFilterStatus]     = useState("semua");
  const [tolakTarget, setTolakTarget]       = useState(null);
  const [setujuiTarget, setSetujuiTarget]   = useState(null);
  const [actionLoading, setActionLoading]   = useState(false);
  const [toast, setToast]                   = useState(null);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchData = async () => {
    setError("");
    const token = getToken();
    try {
      const res = await fetch(`${API_BASE}/api/pengajuan-dosen/dosen/permohonan`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const d = await res.json();
      if (!res.ok) throw new Error(d.message || "Gagal memuat data permohonan");
      setPermohonanList(d.data || []);
    } catch (e) {
      setError(e.message || "Gagal memuat data permohonan");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const counts = {
    total: permohonanList.length,
    menunggu: permohonanList.filter((p) => p.status === "MENUNGGU_PERSETUJUAN_DOSEN").length,
    aktif: permohonanList.filter((p) => p.status === "BIMBINGAN_AKTIF").length,
  };

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return permohonanList
      .filter((p) => {
        const matchStatus = filterStatus === "semua" || p.status === filterStatus;
        const nama = p.mahasiswa?.user?.name || "";
        const perus = p.lamaran?.lowongan?.perusahaan?.nama || "";
        return matchStatus && (nama.toLowerCase().includes(q) || perus.toLowerCase().includes(q));
      })
      .sort((a, b) => (STATUS_PRIORITY[a.status] ?? 9) - (STATUS_PRIORITY[b.status] ?? 9));
  }, [permohonanList, search, filterStatus]);

  const setujuiData = permohonanList.find((p) => p.id === setujuiTarget);
  const tolakData = permohonanList.find((p) => p.id === tolakTarget);

  const handleSetujui = async () => {
    if (!setujuiTarget) return;
    setActionLoading(true);
    const token = getToken();
    try {
      const res = await fetch(`${API_BASE}/api/pengajuan-dosen/${setujuiTarget}/setujui`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.message || "Gagal menyetujui permohonan");
      const jadiAktifLangsung = result.data?.status === "BIMBINGAN_AKTIF";
      showToast(
        jadiAktifLangsung
          ? "Permohonan disetujui, bimbingan langsung aktif!"
          : "Permohonan disetujui, menunggu pengesahan admin prodi.",
        "success"
      );
      setSetujuiTarget(null);
      await fetchData();
    } catch (e) {
      showToast(e.message || "Gagal menyetujui permohonan", "error");
    } finally {
      setActionLoading(false);
    }
  };

  const handleTolak = async (alasan) => {
    if (!tolakTarget) return;
    setActionLoading(true);
    const token = getToken();
    try {
      const res = await fetch(`${API_BASE}/api/pengajuan-dosen/${tolakTarget}/tolak`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ alasanPenolakan: alasan }),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.message || "Gagal menolak permohonan");
      showToast("Permohonan berhasil ditolak. Admin prodi akan menindaklanjuti.", "success");
      setTolakTarget(null);
      await fetchData();
    } catch (e) {
      showToast(e.message || "Gagal menolak permohonan", "error");
    } finally {
      setActionLoading(false);
    }
  };

  const FILTER_TABS = [
    { key: "semua", label: "Semua" },
    { key: "MENUNGGU_PERSETUJUAN_DOSEN", label: "Menunggu" },
    { key: "MENUNGGU_PENGESAHAN_ADMIN", label: "Menunggu Admin" },
    { key: "BIMBINGAN_AKTIF", label: "Aktif" },
    { key: "DITOLAK_DOSEN", label: "Ditolak" },
  ];

  if (loading) return <SkeletonPage />;

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-slate-50 gap-4 px-4">
        <div className="w-12 h-12 rounded-2xl bg-red-50 border border-red-200 flex items-center justify-center text-red-500">
          <Icon.AlertCircle className="w-6 h-6" />
        </div>
        <div className="text-center">
          <div className="text-[13.5px] font-semibold text-slate-700 mb-1">Gagal memuat data</div>
          <div className="text-[12.5px] text-slate-400">{error}</div>
        </div>
        <button
          onClick={() => { setLoading(true); fetchData(); }}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#0A66C2] text-white text-[12.5px] font-semibold hover:bg-[#08519c] transition-colors"
        >
          <Icon.Refresh className="w-3.5 h-3.5" /> Coba Lagi
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans flex flex-col gap-6">
      <style>{FONTS}</style>
      <style>{`
        @keyframes slideIn { from { transform: translateX(20px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
        @keyframes popIn { from { transform: scale(0.96) translateY(6px); opacity: 0; } to { transform: scale(1) translateY(0); opacity: 1; } }
      `}</style>

      <Toast toast={toast} />

      {setujuiTarget && (
        <SetujuiDialog
          open
          mahasiswaNama={setujuiData?.mahasiswa?.user?.name || "mahasiswa ini"}
          sumberPenetapan={setujuiData?.sumberPenetapan}
          onCancel={() => setSetujuiTarget(null)}
          onConfirm={handleSetujui}
          loading={actionLoading}
        />
      )}

      {tolakTarget && (
        <TolakModal
          mahasiswaNama={tolakData?.mahasiswa?.user?.name}
          onClose={() => setTolakTarget(null)}
          onConfirm={handleTolak}
          loading={actionLoading}
        />
      )}

      {/* Top Bar */}
      <Topbar
        icon={<Icon.Users className="w-4.5 h-4.5" />}
        title="Permohonan Bimbingan Magang"
        subtitle="Kelola permohonan bimbingan dari mahasiswa"
        iconBg="bg-[#EFF6FF]"
        iconBorder="border-[#93C5FD]"
        iconColor="text-[#0A66C2]"
        rightSlot={
          <div className="flex items-center gap-2">
            {counts.menunggu > 0 && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-50 border border-amber-200">
                <div className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                <span className="font-mono text-[11px] font-semibold text-amber-700 uppercase tracking-wide">{counts.menunggu} menunggu</span>
              </div>
            )}
            <button
              onClick={() => { setLoading(true); fetchData(); }}
              title="Muat ulang data"
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-200 text-slate-500 text-[12.5px] font-medium hover:bg-slate-50 transition-colors cursor-pointer"
            >
              <Icon.Refresh className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => window.history.back()}
              className="flex items-center gap-2 px-4 py-2 border border-blue-300 rounded-xl text-blue-600 text-[12.5px] font-semibold bg-transparent transition-all duration-150 hover:bg-blue-500 hover:text-white hover:border-blue-500 cursor-pointer"
            >
              <div className="w-6 h-6 rounded-lg bg-blue-100 border border-blue-200 flex items-center justify-center flex-shrink-0">
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 9.5L12 3l9 6.5" />
                  <path d="M5 9v11a1 1 0 0 0 1 1h3v-7h6v7h3a1 1 0 0 0 1-1V9" />
                </svg>
              </div>
              Back to homepage
            </button>
          </div>
        }
      />

      {/* Stat Row */}
      <StatRow counts={counts} />

      {/* Content */}
      <div className="flex-1 px-6 pb-6 flex flex-col gap-4">
        {/* Filter & Search */}
        <div className="bg-white border border-slate-200 rounded-2xl px-4 py-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-100 flex-wrap">
            {FILTER_TABS.map((t) => (
              <button
                key={t.key}
                onClick={() => setFilterStatus(t.key)}
                className={`font-mono px-3 py-1.5 rounded-lg text-[10.5px] font-semibold uppercase tracking-wide transition-all whitespace-nowrap ${
                  filterStatus === t.key ? "bg-white text-slate-800 shadow-none" : "text-slate-400"
                }`}
              >
                {t.label}
                {t.key === "MENUNGGU_PERSETUJUAN_DOSEN" && counts.menunggu > 0 && (
                  <span className="ml-1.5 bg-amber-100 text-amber-700 text-[10px] px-1.5 py-0.5 rounded-full font-bold">{counts.menunggu}</span>
                )}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-3 py-2 w-full sm:w-52 focus-within:border-[#0A66C2] transition-colors">
            <Icon.Search className="w-3.5 h-3.5 text-slate-300 flex-shrink-0" />
            <input
              className="border-none outline-none text-[12px] text-slate-700 bg-transparent w-full placeholder:text-slate-400"
              placeholder="Cari mahasiswa atau perusahaan..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Cards */}
        {filtered.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-2xl py-16 text-center">
            <Icon.Users className="w-10 h-10 mx-auto mb-3 text-slate-300" />
            <div className="text-[13px] font-medium text-slate-500">Tidak ada permohonan ditemukan</div>
            <div className="text-[11.5px] text-slate-400 mt-1">
              {counts.total === 0
                ? "Belum ada mahasiswa yang mengusulkan atau ditunjuk admin prodi kepada Anda"
                : "Coba ubah filter atau kata kunci pencarian"}
            </div>
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {filtered.map((p) => (
              <PermohonanCard
                key={p.id}
                permohonan={p}
                onSetujui={() => setSetujuiTarget(p.id)}
                onTolak={() => setTolakTarget(p.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}