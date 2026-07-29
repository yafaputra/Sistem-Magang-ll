"use client";

import { useState, useEffect, useCallback } from "react";
import Topbar from "../../components/topbar";
// ─── Konstanta ────────────────────────────────────────────────────────────────

const API_BASE = (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000") + "/api";

/* ── Fonts — konsisten dengan halaman lain ── */
const FONTS = `
@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600;9..144,700&family=IBM+Plex+Mono:wght@400;500;600&display=swap');
.font-display { font-family: 'Fraunces', 'Georgia', serif; }
.font-mono { font-family: 'IBM Plex Mono', 'Courier New', monospace; }
`;

const TABS = [
  { key: "semua",      label: "Semua Lowongan" },
  { key: "kurasi",     label: "Kurasi" },
  { key: "bermasalah", label: "Bermasalah" },
];

const STATUS_OPTIONS = ["", "Aktif", "Pending", "Bermasalah", "Ditolak"];

const badgeStyle = {
  Aktif:      "bg-[#ccfbf3] text-[#0d9488]",
  Pending:    "bg-[#faeeda] text-[#854f0b]",
  Bermasalah: "bg-[#fee2e2] text-[#dc2626]",
  Ditolak:    "bg-[#f0f0f8] text-[#6b6b80]",
};

const avatarColors = [
  "bg-[#dbeafe] text-[#2563eb]",
  "bg-[#cffafe] text-[#0891b2]",
  "bg-[#fef3c7] text-[#d97706]",
  "bg-[#d1fae5] text-[#059669]",
  "bg-[#e0e7ff] text-[#4f46e5]",
];

// ─── Safe API helper ──────────────────────────────────────────────────────────

async function apiFetch(path, options = {}) {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  let res;
  try {
    res = await fetch(`${API_BASE}${path}`, {
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      ...options,
    });
  } catch {
    throw new Error("Tidak dapat terhubung ke server. Pastikan backend sudah berjalan.");
  }

  const contentType = res.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) {
    const text = await res.text();
    throw new Error(
      `Server mengembalikan HTML (bukan JSON). Status: ${res.status}.\nPreview: ${text.slice(0, 200)}`
    );
  }

  const json = await res.json();
  if (!res.ok) throw new Error(json.message ?? `Error ${res.status}`);
  return json;
}

// ─── Icons ───────────────────────────────────────────────────────────────────

const IconBriefcase = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
  </svg>
);
const IconClock = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
  </svg>
);
const IconCheck = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);
const IconAlert = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
    <line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
);
const IconSearch = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);
const IconTrash = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
    <path d="M10 11v6" /><path d="M14 11v6" />
    <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
  </svg>
);
const IconTrend = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" />
  </svg>
);
const IconSpinner = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="animate-spin">
    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
  </svg>
);
const IconInfo = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" />
  </svg>
);
const IconX = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);
const IconBuilding = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2" /><path d="M9 3v18M15 3v18M3 9h18M3 15h18" />
  </svg>
);

// ─── Sub-components ───────────────────────────────────────────────────────────

/* ── Stat Card — versi "ledger", warna TIDAK diubah ── */
function StatCard({ label, value, trend, trendColor = "text-[#22c997]", icon, iconColor, loading, isLast }) {
  return (
    <div className={`px-[18px] py-[16px] flex flex-col gap-[10px] transition-colors duration-150 hover:bg-[#fafafc] border-r border-dashed border-[#e8e8f0] ${isLast ? "border-r-0" : ""}`}>
      <div className="flex items-center gap-1.5">
        <span className={iconColor}>{icon}</span>
        <span className={`font-mono text-[10px] uppercase tracking-[0.14em] font-semibold ${iconColor}`}>{label}</span>
      </div>
      <div className="text-[28px] font-bold font-display text-[#1e1e2e] leading-none">
        {loading ? <span className="text-[#e8e8f0]">—</span> : value}
      </div>
      <div className={`flex items-center gap-1 text-[11.5px] ${trendColor}`}>
        <IconTrend />{trend}
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  return (
    <span className={`inline-flex items-center gap-[5px] px-[10px] py-[3px] rounded-full text-[11px] font-semibold ${badgeStyle[status] ?? "bg-[#f0f0f8] text-[#6b6b80]"}`}>
      <span className="w-[5px] h-[5px] rounded-full bg-current" />{status}
    </span>
  );
}

function Toast({ message, type }) {
  const bg = type === "error" ? "bg-[#fee2e2] text-[#dc2626]" : "bg-[#ccfbf3] text-[#0d9488]";
  return (
    <div className={`fixed bottom-6 right-6 z-[60] px-4 py-3 rounded-[10px] text-[13px] font-semibold shadow-lg max-w-[360px] ${bg}`}>
      {message}
    </div>
  );
}

function DeleteModal({ item, onConfirm, onCancel, loading }) {
  const [alasan, setAlasan] = useState("");
  const isPending = item.status === "Pending";

  return (
    <div className="fixed inset-0 bg-[rgba(30,30,46,0.45)] flex items-center justify-center z-50">
      <div className="bg-white rounded-[14px] p-7 w-[420px] shadow-[0_20px_60px_rgba(0,0,0,0.15)]">
        <div className="w-11 h-11 rounded-[12px] bg-[#fee2e2] text-[#dc2626] flex items-center justify-center mb-4">
          <IconTrash />
        </div>
        <div className="text-[16px] font-bold text-[#1e1e2e] mb-[6px] font-display">
          {isPending ? "Tolak lowongan ini?" : "Hapus lowongan bermasalah?"}
        </div>
        <div className="text-[13px] text-[#9898b0] mb-5">
          <span className="font-semibold text-[#1e1e2e]">"{item.position}"</span> dari{" "}
          <span className="font-semibold text-[#1e1e2e]">{item.company}</span> akan{" "}
          {isPending ? "ditolak" : "dihapus permanen"}. Perusahaan akan mendapat notifikasi.
        </div>
        <label className="text-[12px] text-[#9898b0] font-semibold block mb-[6px]">
          Alasan {isPending ? "penolakan" : "penghapusan"} <span className="text-[#dc2626]">*</span>
        </label>
        <textarea
          className="w-full border border-[#e8e8f0] rounded-[8px] p-[10px_12px] text-[13px] text-[#1e1e2e] resize-none outline-none focus:border-[#dc2626] transition-colors"
          rows={3}
          placeholder="Contoh: Informasi tidak valid, mengandung konten menyesatkan..."
          value={alasan}
          onChange={(e) => setAlasan(e.target.value)}
        />
        <div className="flex justify-end gap-2 mt-5">
          <button
            onClick={onCancel}
            disabled={loading}
            className="px-4 py-2 border border-[#e8e8f0] rounded-[8px] text-[13px] font-semibold text-[#555] bg-white hover:bg-[#f5f5fb] transition-colors disabled:opacity-50"
          >
            Batal
          </button>
          <button
            onClick={() => onConfirm(alasan)}
            disabled={loading || !alasan.trim()}
            className="px-4 py-2 rounded-[8px] bg-[#dc2626] text-white text-[13px] font-semibold hover:bg-[#b91c1c] transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading && <IconSpinner />}
            {isPending ? "Tolak Lowongan" : "Hapus Lowongan"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Modal Detail Admin (baru) ────────────────────────────────────────────────
function AdminDetailModal({ item, onClose }) {
  if (!item) return null;
  return (
    <div className="fixed inset-0 bg-[rgba(30,30,46,0.45)] flex items-center justify-center z-50" onClick={onClose}>
      <div
        className="bg-white rounded-[14px] p-7 w-[460px] max-h-[85vh] overflow-y-auto shadow-[0_20px_60px_rgba(0,0,0,0.15)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-[10px] flex items-center justify-center text-[13px] font-semibold flex-shrink-0 ${avatarColors[0]}`}>
              {item.initials}
            </div>
            <div>
              <div className="text-[15px] font-bold text-[#1e1e2e] leading-tight font-display">{item.position}</div>
              <div className="text-[12.5px] text-[#9898b0] flex items-center gap-1 mt-0.5">
                <IconBuilding />{item.company}
              </div>
            </div>
          </div>
          <button onClick={onClose} className="text-[#9898b0] hover:text-[#555] flex-shrink-0">
            <IconX />
          </button>
        </div>

        <div className="flex items-center gap-2 mb-4">
          <StatusBadge status={item.status} />
          {item.reported && (
            <span className="inline-flex items-center gap-[4px] px-[8px] py-[2px] rounded-full bg-[#fee2e2] text-[#dc2626] text-[10.5px] font-semibold">
              <span className="w-[4px] h-[4px] rounded-full bg-current" />Dilaporkan
            </span>
          )}
        </div>

        {(item.status === "Bermasalah" || item.reported) && (
          <div className="bg-[#fee2e2] border border-[#fecaca] rounded-[10px] px-4 py-3 mb-4">
            <p className="text-[12px] font-bold text-[#dc2626] mb-1 flex items-center gap-1.5">
              <IconAlert /> Detail Laporan Masalah
            </p>
            <p className="text-[12.5px] text-[#991b1b] leading-relaxed">
              {item.alasanLaporan || item.laporan || item.reportReason ||
                "Lowongan ini ditandai bermasalah, namun detail alasan laporan belum tersedia dari data yang dikirim backend. Tambahkan field alasan laporan pada endpoint admin/lowongan agar informasi ini bisa tampil di sini."}
            </p>
          </div>
        )}

        <div className="grid grid-cols-2 gap-3 text-[13px] mb-2">
          <div>
            <span className="text-[11px] text-[#9898b0] uppercase tracking-wide font-mono">Bidang</span>
            <div className="font-semibold text-[#1e1e2e] mt-0.5">{item.bidang}</div>
          </div>
          <div>
            <span className="text-[11px] text-[#9898b0] uppercase tracking-wide font-mono">Kuota</span>
            <div className="font-semibold text-[#1e1e2e] mt-0.5">{item.kuota} orang</div>
          </div>
          <div>
            <span className="text-[11px] text-[#9898b0] uppercase tracking-wide font-mono">Batas Daftar</span>
            <div className="font-semibold text-[#1e1e2e] mt-0.5">{item.batas ?? "-"}</div>
          </div>
          <div>
            <span className="text-[11px] text-[#9898b0] uppercase tracking-wide font-mono">ID Lowongan</span>
            <div className="font-semibold text-[#1e1e2e] mt-0.5 font-mono">#{item.id}</div>
          </div>
        </div>

        {item.deskripsi && (
          <div className="mt-4">
            <span className="text-[11px] text-[#9898b0] uppercase tracking-wide font-semibold font-mono">Deskripsi</span>
            <p className="text-[13px] text-[#374151] leading-relaxed mt-1.5">{item.deskripsi}</p>
          </div>
        )}

        <button
          onClick={onClose}
          className="w-full py-2.5 border border-[#e2e8f0] rounded-[8px] text-[13px] font-semibold text-[#555] bg-white hover:bg-[#f5f5fb] transition-colors mt-5"
        >
          Tutup
        </button>
      </div>
    </div>
  );
}

function LowonganRow({ item, index, onApprove, onDelete, onDetail, loadingId }) {
  const color = avatarColors[index % avatarColors.length];
  const isLoading = loadingId === item.id;

  return (
    <tr className="border-b border-[#f0f0f8] last:border-b-0 hover:bg-[#fafafc] transition-colors">
      <td className="px-4 py-[13px]">
        <div className="flex items-center gap-[10px]">
          <div className={`w-8 h-8 rounded-[8px] flex items-center justify-center flex-shrink-0 text-[12px] font-semibold ${color}`}>
            {item.initials}
          </div>
          <div>
            <div className="text-[13px] font-semibold text-[#1e1e2e]">{item.company}</div>
            <div className="flex items-center gap-[6px] mt-[2px]">
              <span className="text-[11.5px] text-[#9898b0]">{item.position}</span>
              {item.reported && (
                <span className="inline-flex items-center gap-[4px] px-[7px] py-[1px] rounded-full bg-[#fee2e2] text-[#dc2626] text-[10px] font-semibold">
                  <span className="w-[4px] h-[4px] rounded-full bg-current" />Dilaporkan
                </span>
              )}
            </div>
          </div>
        </div>
      </td>

      <td className="px-4 py-[13px]">
        <span className="bg-[#f0f0f8] text-[#555] px-[8px] py-[2px] rounded-full text-[11px] font-medium">
          {item.bidang}
        </span>
      </td>

      <td className="px-4 py-[13px] text-[13px]">
        <span className="font-semibold text-[#1e1e2e]">{item.kuota}</span>{" "}
        <span className="text-[#9898b0]">orang</span>
      </td>

      <td className="px-4 py-[13px] text-[13px] text-[#555] font-mono">{item.batas ?? "-"}</td>

      <td className="px-4 py-[13px]"><StatusBadge status={item.status} /></td>

      <td className="px-4 py-[13px]">
        <div className="flex items-center gap-[6px]">
          {isLoading ? (
            <span className="text-[#9898b0]"><IconSpinner /></span>
          ) : (
            <>
              {/* Pending — Setujui / Tolak, plus Detail */}
              {item.status === "Pending" && (
                <>
                  <button
                    onClick={() => onApprove(item)}
                    className="px-[10px] py-[5px] rounded-[6px] text-[11px] font-semibold bg-[#ccfbf3] text-[#0d9488] hover:bg-[#0d9488] hover:text-white transition-all duration-150"
                  >
                    Setujui
                  </button>
                  <button
                    onClick={() => onDelete(item)}
                    className="px-[10px] py-[5px] rounded-[6px] text-[11px] font-semibold bg-[#fee2e2] text-[#dc2626] hover:bg-[#dc2626] hover:text-white transition-all duration-150"
                  >
                    Tolak
                  </button>
                  <button
                    onClick={() => onDetail(item)}
                    className="px-[10px] py-[5px] rounded-[6px] text-[11px] font-semibold bg-[#f0f0f8] text-[#555] hover:bg-[#e0e0f0] transition-all duration-150"
                  >
                    Detail
                  </button>
                </>
              )}

              {/* ✅ Bermasalah — admin bisa lihat detail laporan + hapus */}
              {item.status === "Bermasalah" && (
                <>
                  <button
                    onClick={() => onDetail(item)}
                    className="px-[10px] py-[5px] rounded-[6px] text-[11px] font-semibold bg-[#fef3c7] text-[#b45309] hover:bg-[#b45309] hover:text-white transition-all duration-150"
                  >
                    Lihat Laporan
                  </button>
                  <button
                    onClick={() => onDelete(item)}
                    className="px-[10px] py-[5px] rounded-[6px] text-[11px] font-semibold bg-[#fee2e2] text-[#dc2626] hover:bg-[#dc2626] hover:text-white transition-all duration-150"
                  >
                    Hapus
                  </button>
                </>
              )}

              {/* Aktif — admin bisa hapus jika bermasalah, plus Detail */}
              {item.status === "Aktif" && (
                <>
                  <button
                    onClick={() => onDelete(item)}
                    className="px-[10px] py-[5px] rounded-[6px] text-[11px] font-semibold bg-[#fee2e2] text-[#dc2626] hover:bg-[#dc2626] hover:text-white transition-all duration-150"
                  >
                    Hapus
                  </button>
                  <button
                    onClick={() => onDetail(item)}
                    className="px-[10px] py-[5px] rounded-[6px] text-[11px] font-semibold bg-[#f0f0f8] text-[#555] hover:bg-[#e0e0f0] transition-all duration-150"
                  >
                    Detail
                  </button>
                </>
              )}

              {/* Ditolak — hanya lihat detail */}
              {item.status === "Ditolak" && (
                <button
                  onClick={() => onDetail(item)}
                  className="px-[10px] py-[5px] rounded-[6px] text-[11px] font-semibold bg-[#f0f0f8] text-[#555] hover:bg-[#e0e0f0] transition-all duration-150"
                >
                  Detail
                </button>
              )}
            </>
          )}
        </div>
      </td>
    </tr>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function ManajemenLowongan() {
  const [lowongan, setLowongan]           = useState([]);
  const [stats, setStats]                 = useState({ total: 0, pending: 0, aktif: 0, bermasalah: 0 });
  const [pagination, setPagination]       = useState({ page: 1, totalPages: 1, total: 0 });
  const [activeTab, setActiveTab]         = useState("semua");
  const [search, setSearch]               = useState("");
  const [statusFilter, setStatusFilter]   = useState("");
  const [page, setPage]                   = useState(1);
  const [loading, setLoading]             = useState(false);
  const [loadingId, setLoadingId]         = useState(null);
  const [deleteTarget, setDeleteTarget]   = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [detailTarget, setDetailTarget]   = useState(null); // ✅ baru
  const [toast, setToast]                 = useState(null);

  const showToast = useCallback((message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  }, []);

  const fetchLowongan = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        tab:   activeTab,
        page:  String(page),
        limit: "10",
        ...(search       ? { search }          : {}),
        ...(statusFilter ? { status: statusFilter } : {}),
      });

      const json = await apiFetch(`/admin/lowongan?${params}`);
      setLowongan(json.data ?? []);
      setStats(json.stats ?? { total: 0, pending: 0, aktif: 0, bermasalah: 0 });
      setPagination(json.pagination ?? { page: 1, totalPages: 1, total: 0 });
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setLoading(false);
    }
  }, [activeTab, page, search, statusFilter, showToast]);

  useEffect(() => {
    setPage(1);
    const t = setTimeout(() => fetchLowongan(), 350);
    return () => clearTimeout(t);
  }, [search]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    fetchLowongan();
  }, [activeTab, statusFilter, page]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleApprove = async (item) => {
    setLoadingId(item.id);
    try {
      await apiFetch(`/admin/lowongan/${item.id}/setujui`, { method: "PATCH" });
      showToast(`Lowongan "${item.position}" berhasil disetujui dan sekarang aktif tayang`);
      fetchLowongan();
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setLoadingId(null);
    }
  };

  const handleDeleteConfirm = async (alasan) => {
    if (!deleteTarget) return;
    setDeleteLoading(true);
    try {
      if (deleteTarget.status === "Pending") {
        await apiFetch(`/admin/lowongan/${deleteTarget.id}/tolak`, {
          method: "PATCH",
          body: JSON.stringify({ alasan }),
        });
        showToast(`Lowongan "${deleteTarget.position}" ditolak dan perusahaan telah dinotifikasi`);
      } else {
        await apiFetch(`/admin/lowongan/${deleteTarget.id}`, {
          method: "DELETE",
          body: JSON.stringify({ alasan }),
        });
        showToast(`Lowongan "${deleteTarget.position}" berhasil dihapus`);
      }
      fetchLowongan();
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setDeleteLoading(false);
      setDeleteTarget(null);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#f5f5fb] font-sans">
      <style>{FONTS}</style>

      <div className="flex-1 flex flex-col min-w-0">

        <Topbar
          icon={<IconBriefcase className="w-4.5 h-4.5" />}
          title="Manajemen Lowongan"
          subtitle="Kurasi dan kelola lowongan magang dari perusahaan mitra"
          iconBg="bg-[#dbeafe]"
          iconBorder="border-[#93c5fd]"
          iconColor="text-[#2563eb]"
          rightSlot={
            <button className="flex items-center gap-2 px-4 py-2 border border-[#0A66C2]/40 rounded-xl text-[#0A66C2] text-[12.5px] font-semibold bg-transparent transition-all duration-150 hover:bg-[#0958A8] hover:text-white hover:border-[#0A66C2] cursor-pointer">
              <div className="w-6 h-6 rounded-lg bg-[#0A66C2]/10 border border-[#0A66C2]/20 flex items-center justify-center flex-shrink-0">
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 9.5L12 3l9 6.5" />
                  <path d="M5 9v11a1 1 0 0 0 1 1h3v-7h6v7h3a1 1 0 0 0 1-1V9" />
                </svg>
              </div>
              Back to homepage
            </button>
          }
        />

        <main className="flex-1 p-7">

          <div className="flex items-start gap-3 bg-[#eff6ff] border border-[#bfdbfe] rounded-[10px] px-4 py-3 mb-5 text-[12.5px] text-[#1d4ed8]">
            <span className="flex-shrink-0 mt-0.5"><IconInfo /></span>
            <span>
              Lowongan dibuat oleh perusahaan mitra dan masuk dengan status <strong>Pending</strong>.
              Tugas admin adalah meninjau kelayakan, lalu <strong>Setujui</strong> agar tayang di landing page, atau <strong>Tolak</strong> jika tidak memenuhi syarat.
              Perusahaan tetap dapat mengedit atau menghapus lowongan yang sudah Aktif — jika ada penyalahgunaan, admin dapat menandainya <strong>Bermasalah</strong> dan menghapusnya dari sini.
            </span>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 bg-[#ececf4] rounded-[10px] p-1 w-fit mb-6">
            {TABS.map((tab) => (
              <button
                key={tab.key}
                onClick={() => { setActiveTab(tab.key); setPage(1); }}
                className={`px-[18px] py-[7px] rounded-[7px] text-[13px] font-semibold transition-all duration-150 border-none cursor-pointer
                  ${activeTab === tab.key ? "bg-white text-[#1e1e2e] shadow-[0_1px_4px_rgba(0,0,0,.08)]" : "bg-transparent text-[#9898b0] hover:text-[#555]"}`}
              >
                {tab.label}
                {tab.key === "kurasi" && stats.pending > 0 && (
                  <span className="ml-[6px] px-[6px] py-[1px] rounded-full bg-[#faeeda] text-[#854f0b] text-[10px] font-bold">
                    {stats.pending}
                  </span>
                )}
                {tab.key === "bermasalah" && stats.bermasalah > 0 && (
                  <span className="ml-[6px] px-[6px] py-[1px] rounded-full bg-[#fee2e2] text-[#dc2626] text-[10px] font-bold">
                    {stats.bermasalah}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Stat strip — model ledger, warna tetap sama */}
          <div className="grid grid-cols-4 bg-white border border-[#e8e8f0] rounded-[12px] overflow-hidden mb-5">
            <StatCard label="Total Lowongan"       value={stats.total}      trend="Semua perusahaan"         loading={loading} icon={<IconBriefcase />} iconColor="text-[#3b82f6]" />
            <StatCard label="Menunggu Kurasi"       value={stats.pending}    trend="Perlu ditinjau"           loading={loading} trendColor="text-[#d97706]" icon={<IconClock />} iconColor="text-[#d97706]" />
            <StatCard label="Aktif Tayang"          value={stats.aktif}      trend="Tersedia untuk mahasiswa" loading={loading} icon={<IconCheck />} iconColor="text-[#0d9488]" />
            <StatCard label="Dilaporkan Bermasalah" value={stats.bermasalah} trend="Perlu ditindak"           loading={loading} trendColor="text-[#dc2626]" icon={<IconAlert />} iconColor="text-[#dc2626]" isLast />
          </div>

          {/* Search & Filter Bar */}
          <div className="flex items-center gap-[10px] mb-4">
            <div className="relative flex-1">
              <span className="absolute left-[11px] top-1/2 -translate-y-1/2 text-[#b0b0c8]"><IconSearch /></span>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Cari lowongan, perusahaan, atau posisi..."
                className="w-full pl-[34px] pr-3 py-2 border border-[#e8e8f0] rounded-[8px] text-[13px] text-[#1e1e2e] bg-white outline-none focus:border-[#3b82f6] transition-colors"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
              className="px-3 py-2 border border-[#e8e8f0] rounded-[8px] text-[13px] text-[#555] bg-white outline-none cursor-pointer hover:bg-[#f5f5fb] transition-colors"
            >
              {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>{s === "" ? "Semua Status" : s}</option>
              ))}
            </select>
          </div>

          {/* Table */}
          <div className="bg-white border border-[#e8e8f0] rounded-[12px] overflow-hidden">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  {["Perusahaan & Posisi", "Bidang", "Kuota", "Batas Daftar", "Status", "Aksi Admin"].map((h) => (
                    <th key={h} className="px-4 py-3 bg-[#fafafc] border-b border-[#e8e8f0] text-left text-[11.5px] font-semibold text-[#9898b0] uppercase tracking-[.04em] font-mono">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={6} className="text-center py-12 text-[13px] text-[#9898b0]">
                      <div className="flex items-center justify-center gap-2">
                        <IconSpinner />Memuat data...
                      </div>
                    </td>
                  </tr>
                ) : lowongan.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-12 text-[13px] text-[#9898b0]">
                      {activeTab === "kurasi"
                        ? "Tidak ada lowongan yang menunggu kurasi"
                        : activeTab === "bermasalah"
                        ? "Tidak ada lowongan bermasalah"
                        : "Tidak ada lowongan ditemukan"}
                    </td>
                  </tr>
                ) : (
                  lowongan.map((item, i) => (
                    <LowonganRow
                      key={item.id}
                      item={item}
                      index={i}
                      onApprove={handleApprove}
                      onDelete={setDeleteTarget}
                      onDetail={setDetailTarget}
                      loadingId={loadingId}
                    />
                  ))
                )}
              </tbody>
            </table>

            {/* Pagination */}
            <div className="flex items-center justify-between px-4 py-3 border-t border-[#f0f0f8]">
              <span className="text-[12px] text-[#9898b0] font-mono">
                Menampilkan {lowongan.length} dari {pagination.total} lowongan
              </span>
              <div className="flex gap-1">
                <button
                  disabled={page <= 1}
                  onClick={() => setPage((p) => Math.max(p - 1, 1))}
                  className="w-7 h-7 rounded-[6px] border border-[#e8e8f0] bg-white text-[#555] text-[12px] flex items-center justify-center hover:bg-[#f0f0f8] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >‹</button>

                {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).slice(0, 5).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`w-7 h-7 rounded-[6px] border text-[12px] flex items-center justify-center cursor-pointer transition-colors
                      ${p === page ? "bg-[#2563eb] text-white border-[#2563eb]" : "bg-white text-[#555] border-[#e8e8f0] hover:bg-[#f0f0f8]"}`}
                  >
                    {p}
                  </button>
                ))}

                {pagination.totalPages > 5 && (
                  <span className="w-7 h-7 flex items-center justify-center text-[#9898b0] text-[12px]">…</span>
                )}

                <button
                  disabled={page >= pagination.totalPages}
                  onClick={() => setPage((p) => Math.min(p + 1, pagination.totalPages))}
                  className="w-7 h-7 rounded-[6px] border border-[#e8e8f0] bg-white text-[#555] text-[12px] flex items-center justify-center hover:bg-[#f0f0f8] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >›</button>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Delete / Tolak Modal */}
      {deleteTarget && (
        <DeleteModal
          item={deleteTarget}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeleteTarget(null)}
          loading={deleteLoading}
        />
      )}

      {/* ✅ Detail Modal (termasuk laporan Bermasalah) */}
      {detailTarget && (
        <AdminDetailModal item={detailTarget} onClose={() => setDetailTarget(null)} />
      )}

      {toast && <Toast message={toast.message} type={toast.type} />}
    </div>
  );
}