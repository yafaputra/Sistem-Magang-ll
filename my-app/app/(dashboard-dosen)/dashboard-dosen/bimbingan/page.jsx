"use client";

import { useState, useEffect, useMemo } from "react";
import Topbar from "../../components/topbar";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000";
const getToken = () => { try { return localStorage.getItem("token") || ""; } catch { return ""; } };

// ─── Status Config ─────────────────────────────────────────────────────────────
const STATUS_CONFIG = {
  MENUNGGU_PERSETUJUAN_DOSEN: {
    label: "Menunggu Persetujuan",
    badge: "bg-violet-50 text-violet-700 border border-violet-200",
    dot: "bg-violet-400",
    urgent: true,
  },
  BIMBINGAN_AKTIF: {
    label: "Bimbingan Aktif",
    badge: "bg-emerald-50 text-emerald-700 border border-emerald-200",
    dot: "bg-emerald-500",
  },
  DITOLAK_DOSEN: {
    label: "Ditolak",
    badge: "bg-red-50 text-red-600 border border-red-200",
    dot: "bg-red-400",
  },
  MENUNGGU_VERIFIKASI_PRODI: {
    label: "Proses Prodi",
    badge: "bg-amber-50 text-amber-700 border border-amber-200",
    dot: "bg-amber-400",
  },
  SELESAI: {
    label: "Selesai",
    badge: "bg-slate-100 text-slate-600 border border-slate-200",
    dot: "bg-slate-400",
  },
};

// Urutan prioritas tampilan: yang perlu aksi dulu
const STATUS_PRIORITY = {
  MENUNGGU_PERSETUJUAN_DOSEN: 0,
  BIMBINGAN_AKTIF: 1,
  MENUNGGU_VERIFIKASI_PRODI: 2,
  DITOLAK_DOSEN: 3,
  SELESAI: 4,
};

const initials = (name) => (name || "?").split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
const AV_COLORS = [
  ["bg-blue-50", "text-blue-700"],
  ["bg-emerald-50", "text-emerald-700"],
  ["bg-violet-50", "text-violet-700"],
  ["bg-amber-50", "text-amber-700"],
  ["bg-rose-50", "text-rose-700"],
];
const avColor = (id) => AV_COLORS[(id || 0) % AV_COLORS.length];
const formatDate = (d) => d ? new Date(d).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }) : "-";
const formatDateTime = (d) => d ? new Date(d).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }) : "-";

// ─── Icon Set ─────────────────────────────────────────────────────────────────
const Icon = {
  Users: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...p}>
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
  ArrowLeft: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...p}>
      <path d="M19 12H5M5 12l7-7M5 12l7 7" />
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
  Building: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...p}>
      <rect x="3" y="3" width="18" height="18" rx="2" /><path d="M9 3v18M15 3v18M3 9h18M3 15h18" />
    </svg>
  ),
};

// ─── Toast ────────────────────────────────────────────────────────────────────
function Toast({ toast }) {
  if (!toast?.message) return null;
  const isError = toast.type === "error";
  return (
    <div
      className="fixed top-4 right-4 z-50 flex items-center gap-2.5 text-white text-[13px] px-4 py-3 rounded-xl shadow-lg max-w-sm"
      style={{ background: isError ? "#DC2626" : "#0f172a", animation: "slideIn 0.2s ease" }}
    >
      {isError ? <Icon.AlertCircle className="w-4 h-4 flex-shrink-0" /> : <Icon.Check className="w-4 h-4 flex-shrink-0 text-emerald-400" />}
      <span>{toast.message}</span>
    </div>
  );
}

// ─── Confirm Setuju Dialog ────────────────────────────────────────────────────
function SetujuiDialog({ open, mahasiswaNama, onConfirm, onCancel, loading }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4" onClick={onCancel}>
      <div
        className="bg-white rounded-2xl border border-slate-200 shadow-xl w-full max-w-md p-6"
        style={{ animation: "popIn 0.18s ease" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-11 h-11 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center mb-4">
          <Icon.Check className="w-5 h-5 text-emerald-600" />
        </div>
        <h3 className="text-[15px] font-bold text-slate-900 mb-1.5">Setujui Permohonan Bimbingan?</h3>
        <p className="text-[12.5px] text-slate-500 leading-relaxed mb-5">
          Anda akan menjadi dosen pembimbing untuk <strong className="text-slate-700">{mahasiswaNama}</strong>. Status
          akan berubah menjadi <strong>Bimbingan Aktif</strong>.
        </p>
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
            className="flex-1 py-2.5 rounded-xl bg-emerald-500 text-white text-[13px] font-semibold hover:bg-emerald-600 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4" onClick={onClose}>
      <div
        className="bg-white rounded-2xl border border-slate-200 shadow-xl w-full max-w-md"
        style={{ animation: "popIn 0.18s ease" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <div>
            <div className="text-sm font-semibold text-slate-800">Tolak Permohonan Bimbingan</div>
            <div className="text-xs text-slate-400 mt-0.5">
              {mahasiswaNama ? `Mahasiswa: ${mahasiswaNama}` : "Berikan alasan penolakan yang jelas"}
            </div>
          </div>
          <button onClick={onClose} className="w-7 h-7 rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-slate-100 transition-colors">
            <Icon.X className="w-3.5 h-3.5" />
          </button>
        </div>
        <div className="px-5 py-4">
          <label className="block text-[10.5px] font-semibold text-slate-500 mb-1.5 uppercase tracking-wide">
            Alasan Penolakan <span className="text-red-400">*</span>
          </label>
          <textarea
            value={alasan}
            onChange={(e) => setAlasan(e.target.value)}
            rows={4}
            placeholder="Jelaskan alasan Anda menolak permohonan bimbingan ini (mis. beban bimbingan penuh, tidak sesuai bidang keahlian, dll)..."
            className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-[12.5px] text-slate-700 focus:outline-none focus:border-red-300 resize-none transition-colors placeholder:text-slate-400"
          />
          <div className="flex justify-between mt-1">
            <p className="text-[11px] text-slate-400">Minimal 10 karakter</p>
            <p className={`text-[11px] font-medium ${alasan.length < 10 ? "text-red-400" : "text-emerald-600"}`}>{alasan.length} karakter</p>
          </div>
        </div>
        <div className="px-5 pb-5 flex gap-2">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl text-sm font-semibold border border-slate-200 text-slate-500 hover:bg-slate-50 transition-colors">
            Batal
          </button>
          <button
            onClick={() => valid && onConfirm(alasan)}
            disabled={!valid || loading}
            className="flex-1 py-2.5 rounded-xl text-sm font-semibold bg-red-500 text-white hover:bg-red-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
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
function PermohonanCard({ permohonan, index, onSetujui, onTolak }) {
  const [expanded, setExpanded] = useState(false);
  const sc = STATUS_CONFIG[permohonan.status] || {};
  const mahasiswaNama = permohonan.mahasiswa?.user?.name || "-";
  const mahasiswaNim = permohonan.mahasiswa?.nim || "-";
  const perusahaan = permohonan.lamaran?.lowongan?.perusahaan?.nama || "-";
  const posisi = permohonan.lamaran?.lowongan?.posisi || "-";
  const [bg, text] = avColor(permohonan.mahasiswa?.id || index);
  const isPending = permohonan.status === "MENUNGGU_PERSETUJUAN_DOSEN";

  return (
    <div className={`bg-white border rounded-2xl overflow-hidden transition-all flex flex-col ${isPending ? "border-violet-200 shadow-[0_0_0_3px_rgba(139,92,246,0.08)]" : "border-slate-200"}`}>
      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-[13px] font-bold flex-shrink-0 ${bg} ${text}`}>
              {initials(mahasiswaNama)}
            </div>
            <div className="min-w-0">
              <div className="text-[14px] font-semibold text-slate-800 truncate">{mahasiswaNama}</div>
              <div className="text-[11.5px] text-slate-400 mt-0.5">{mahasiswaNim}</div>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            {isPending && <div className="w-2 h-2 rounded-full bg-violet-400 animate-pulse" />}
            <span className={`px-2.5 py-1 rounded-full text-[11px] font-semibold ${sc.badge}`}>{sc.label}</span>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {[
            ["Perusahaan", perusahaan],
            ["Posisi", posisi],
            ["Tgl Pengajuan", formatDate(permohonan.createdAt)],
          ].map(([label, val]) => (
            <div key={label}>
              <div className="text-[10px] text-slate-400 mb-0.5">{label}</div>
              <div className="text-[12.5px] font-medium text-slate-700 truncate" title={val}>{val}</div>
            </div>
          ))}
        </div>

        {/* Alasan & action */}
        <div className="mt-4 bg-slate-50 rounded-xl p-3">
          <div className="text-[10px] font-semibold uppercase tracking-wide text-slate-400 mb-1.5">Alasan Memilih Anda</div>
          <p className={`text-[12.5px] text-slate-600 leading-relaxed ${!expanded ? "line-clamp-2" : ""}`}>
            {permohonan.alasanMemilih || "-"}
          </p>
          {permohonan.alasanMemilih?.length > 100 && (
            <button onClick={() => setExpanded(!expanded)} className="text-[11px] text-blue-500 hover:underline mt-1">
              {expanded ? "Tampilkan lebih sedikit" : "Baca selengkapnya"}
            </button>
          )}
        </div>

        {permohonan.catatanTambahan && (
          <div className="mt-2 bg-blue-50 border border-blue-100 rounded-xl p-3">
            <div className="text-[10px] font-semibold uppercase tracking-wide text-blue-500 mb-1">Catatan Mahasiswa</div>
            <p className="text-[12.5px] text-blue-700 leading-relaxed">{permohonan.catatanTambahan}</p>
          </div>
        )}

        {permohonan.alasanPenolakan && (
          <div className="mt-2 bg-red-50 border border-red-100 rounded-xl p-3">
            <div className="text-[10px] font-semibold uppercase tracking-wide text-red-400 mb-1">Alasan Penolakan Anda</div>
            <p className="text-[12.5px] text-red-600 leading-relaxed">{permohonan.alasanPenolakan}</p>
          </div>
        )}

        <div className="flex-1" />

        {/* Action Buttons */}
        {isPending && (
          <div className="mt-4 flex gap-2">
            <button
              onClick={onSetujui}
              className="flex-1 py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 transition-colors"
            >
              <Icon.Check className="w-4 h-4" /> Setujui
            </button>
            <button
              onClick={onTolak}
              className="flex-1 py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 bg-red-50 text-red-600 border border-red-100 hover:bg-red-100 transition-colors"
            >
              <Icon.XCircle className="w-4 h-4" /> Tolak
            </button>
          </div>
        )}

        {permohonan.status === "BIMBINGAN_AKTIF" && (
          <div className="mt-4 flex items-center gap-2 bg-emerald-50 border border-emerald-100 rounded-xl p-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center flex-shrink-0">
              <Icon.Check className="w-4 h-4 text-white" />
            </div>
            <div>
              <div className="text-[12.5px] font-semibold text-emerald-800">Bimbingan Aktif</div>
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

// ─── Stat Row ───────────────────────────────────────────────────────────────
function StatRow({ counts }) {
  const stats = [
    {
      key: "total",
      label: "Total Permohonan",
      value: counts.total,
      bg: "bg-slate-50",
      border: "border-slate-200",
      numColor: "text-slate-700",
      iconBg: "bg-slate-200/70",
      iconColor: "text-slate-600",
      bordericon: "border-slate-300",
    },
    {
      key: "menunggu",
      label: "Menunggu Keputusan",
      value: counts.menunggu,
      bg: "bg-violet-50",
      border: "border-violet-200",
      numColor: "text-violet-700",
      iconBg: "bg-violet-100",
      iconColor: "text-violet-600",
      bordericon: "border-violet-300",
    },
    {
      key: "aktif",
      label: "Bimbingan Aktif",
      value: counts.aktif,
      bg: "bg-emerald-50",
      border: "border-emerald-200",
      numColor: "text-emerald-700",
      iconBg: "bg-emerald-100",
      iconColor: "text-emerald-600",
      bordericon: "border-emerald-300",
    },
  ];

  return (
    <div className="grid grid-cols-3 gap-3 px-6 py-4">
      {stats.map((s) => (
        <div
          key={s.key}
          className={`${s.bg} border ${s.border} rounded-xl p-4 flex items-center gap-3 transition-shadow hover:shadow-sm`}
        >
          <div className={`w-10 h-10 rounded-lg border ${s.iconBg} ${s.iconColor} ${s.bordericon} flex items-center justify-center flex-shrink-0`}>
            <StatIcon type={s.key} className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <div className={`text-2xl font-bold ${s.numColor} leading-none tabular-nums`}>
              {s.value}
            </div>
            <div className="text-xs text-slate-500 mt-1 truncate">{s.label}</div>
          </div>
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
      showToast("Permohonan bimbingan berhasil disetujui!", "success");
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
      showToast("Permohonan berhasil ditolak. Admin prodi akan menetapkan dosen lain.", "success");
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
    { key: "BIMBINGAN_AKTIF", label: "Aktif" },
    { key: "DITOLAK_DOSEN", label: "Ditolak" },
  ];

  if (loading) return <SkeletonPage />;

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-slate-50 gap-4 px-4">
        <div className="w-12 h-12 rounded-2xl bg-red-50 border border-red-100 flex items-center justify-center">
          <Icon.AlertCircle className="w-6 h-6 text-red-500" />
        </div>
        <div className="text-center">
          <div className="text-sm font-semibold text-slate-700 mb-1">Gagal memuat data</div>
          <div className="text-[12.5px] text-slate-400">{error}</div>
        </div>
        <button
          onClick={() => { setLoading(true); fetchData(); }}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-500 text-white text-[12.5px] font-semibold hover:bg-blue-600 transition-colors"
        >
          <Icon.Refresh className="w-3.5 h-3.5" /> Coba Lagi
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans flex flex-col">
      <style>{`
        @keyframes slideIn { from { transform: translateX(20px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
        @keyframes popIn { from { transform: scale(0.96) translateY(6px); opacity: 0; } to { transform: scale(1) translateY(0); opacity: 1; } }
      `}</style>

      <Toast toast={toast} />

      {setujuiTarget && (
        <SetujuiDialog
          open
          mahasiswaNama={setujuiData?.mahasiswa?.user?.name || "mahasiswa ini"}
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
        rightSlot={
          <div className="flex items-center gap-2">
            {counts.menunggu > 0 && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-violet-50 border border-violet-200">
                <div className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
                <span className="text-[11.5px] font-semibold text-violet-700">{counts.menunggu} menunggu</span>
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
      <div className="flex-1 px-6 pb-6 space-y-4">
        {/* Filter & Search */}
        <div className="bg-white border border-slate-200 rounded-2xl px-4 py-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex gap-1 flex-wrap">
            {FILTER_TABS.map((t) => (
              <button
                key={t.key}
                onClick={() => setFilterStatus(t.key)}
                className={`px-3 py-1 rounded-lg text-[11.5px] font-medium transition-all ${
                  filterStatus === t.key ? "bg-blue-500 text-white" : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                }`}
              >
                {t.label}
                {t.key === "MENUNGGU_PERSETUJUAN_DOSEN" && counts.menunggu > 0 && (
                  <span className="ml-1.5 bg-white/30 text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold">{counts.menunggu}</span>
                )}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 w-full sm:w-52 focus-within:border-blue-300 transition-colors">
            <Icon.Search className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
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
                ? "Admin prodi belum menetapkan Anda sebagai dosen pembimbing"
                : "Coba ubah filter atau kata kunci pencarian"}
            </div>
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {filtered.map((p, i) => (
              <PermohonanCard
                key={p.id}
                permohonan={p}
                index={i}
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