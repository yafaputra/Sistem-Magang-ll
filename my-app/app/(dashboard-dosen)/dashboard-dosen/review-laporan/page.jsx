"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import Topbar from "../../components/topbar";

// ─── Fonts — sama persis dengan Dashboard Dosen (Fraunces + IBM Plex Mono) ───
const FONTS = `
@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600;9..144,700&family=IBM+Plex+Mono:wght@400;500;600&display=swap');
.font-display { font-family: 'Fraunces', 'Georgia', serif; }
.font-mono { font-family: 'IBM Plex Mono', 'Courier New', monospace; }
`;

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const STATUS_OPTIONS = [
  { key: "semua", label: "Semua" },
  { key: "menunggu", label: "Menunggu" },
  { key: "disetujui", label: "Disetujui" },
  { key: "ditolak", label: "Ditolak" },
];

// ── Helpers ──────────────────────────────────────────────────────────────
const initials = (name = "") =>
  name.split(" ").slice(0, 2).map((w) => w[0] ?? "").join("").toUpperCase();

// Ambil ekstensi dari nama file, untuk badge tipe file (PDF/DOCX/XLSX/JPG/dll)
function fileExt(name = "") {
  const parts = name.split(".");
  if (parts.length < 2) return null;
  return parts.pop().toUpperCase();
}

// fileUrl sekarang berupa URL Cloudinary penuh (bukan path lokal lagi).
// PENTING: jangan sisipkan flag transformasi (mis. fl_attachment) secara manual
// ke URL raw seperti ini — Cloudinary bisa menolak dengan error
// "show_original_unsupported_file_format" untuk file non-gambar (docx/xlsx/dll).
// Cukup pakai secure_url apa adanya, sama seperti pola di halaman lamaran/CV.
function toDownloadUrl(url) {
  return url || "#";
}

// ── Icons ────────────────────────────────────────────────────────────────
const IconDoc = (p) => (
  <svg width={p.size ?? 17} height={p.size ?? 17} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" />
  </svg>
);
const IconClock = (p) => (
  <svg width={p.size ?? 17} height={p.size ?? 17} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
  </svg>
);
const IconCheck = (p) => (
  <svg width={p.size ?? 17} height={p.size ?? 17} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);
const IconX = (p) => (
  <svg width={p.size ?? 17} height={p.size ?? 17} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" />
  </svg>
);
const IconSearch = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);
const IconClose = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);
const IconDownload = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" />
  </svg>
);
const IconAlert = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
  </svg>
);

// ── Small building blocks ──────────────────────────────────────────────────
function Avatar({ nama, size = 36 }) {
  return (
    <div
      style={{ width: size, height: size, fontSize: size * 0.32 }}
      className="rounded-[9px] bg-gradient-to-br from-[#EFF6FF] to-[#93C5FD] text-[#0A66C2] font-display font-semibold flex items-center justify-center flex-shrink-0 tracking-wide border border-[#93C5FD]/50"
    >
      {initials(nama)}
    </div>
  );
}

function StatusPill({ status }) {
  const cls =
    status === "Disetujui"
      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
      : status === "Ditolak"
      ? "bg-red-50 text-red-600 border-red-200"
      : "bg-amber-50 text-amber-600 border-amber-200";
  return (
    <span className={`font-mono inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold tracking-wide uppercase border ${cls}`}>
      {status === "Disetujui" ? "Disetujui" : status === "Ditolak" ? "Ditolak" : "Menunggu"}
    </span>
  );
}

function EmptyState({ icon, title, sub }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-14 px-4">
      <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-3 border border-[#93C5FD] bg-[#EFF6FF] text-[#0A66C2]">
        {icon}
      </div>
      <p className="text-[13.5px] font-semibold text-slate-800">{title}</p>
      {sub && <p className="text-[12px] mt-1 text-slate-400" style={{ maxWidth: 320 }}>{sub}</p>}
    </div>
  );
}

function Toast({ message, type }) {
  const cls = type === "error" ? "bg-red-50 text-red-600 border-red-200" : "bg-emerald-50 text-emerald-700 border-emerald-200";
  return (
    <div className={`fixed bottom-6 right-6 z-[70] px-4 py-3 rounded-xl text-[13px] font-semibold shadow-lg max-w-[360px] border ${cls}`}>
      {message}
    </div>
  );
}

// ── Detail & Review Modal ───────────────────────────────────────────────
function ReviewModal({ row, initialTab = "laporan", onClose, onSave }) {
  const [tab, setTab] = useState(initialTab);
  const [decision, setDecision] = useState(
    row.status === "Ditolak" ? "DITOLAK" : "DISETUJUI"
  );
  const [catatan, setCatatan] = useState(row.catatan ?? "");
  const [saving, setSaving] = useState(false);
  const ext = row.file ? fileExt(row.file.name) : null;

  const catatanKosongSaatTolak = decision === "DITOLAK" && !catatan.trim();

  async function submit() {
    if (catatanKosongSaatTolak) return;
    setSaving(true);
    await onSave({ status: decision, catatan });
    setSaving(false);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/45" onClick={onClose}>
      <style>{`@keyframes popIn { from { transform: scale(.97); opacity: 0 } to { transform: scale(1); opacity: 1 } }`}</style>
      <div
        className="bg-white rounded-2xl w-full max-w-[560px] max-h-[88vh] flex flex-col shadow-2xl border border-slate-200"
        style={{ animation: "popIn .16s ease-out" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-200 flex-shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <Avatar nama={row.mahasiswaNama} size={40} />
            <div className="min-w-0">
              <p className="text-[14px] font-bold truncate text-slate-800">{row.mahasiswaNama}</p>
              <p className="font-mono text-[10.5px] text-slate-400 tracking-wide">Minggu {row.minggu} &nbsp;·&nbsp; {row.status}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full cursor-pointer transition-colors flex-shrink-0 border text-red-600 bg-red-50 border-red-200 hover:bg-red-600 hover:text-white"
          >
            <IconClose />
          </button>
        </div>

        {/* Tabs */}
        <div className="px-6 pt-4 flex-shrink-0">
          <div className="flex gap-1 p-1 rounded-xl bg-slate-50">
            {[
              { key: "laporan", label: "Laporan" },
              { key: "review", label: "Setujui / Tolak" },
            ].map((t) => {
              const active = tab === t.key;
              return (
                <button
                  key={t.key}
                  onClick={() => setTab(t.key)}
                  className={`flex-1 py-2 rounded-lg text-[12.5px] font-semibold transition-all cursor-pointer ${
                    active ? "bg-white text-slate-800 shadow-sm" : "text-slate-400"
                  }`}
                >
                  {t.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          {tab === "laporan" ? (
            <div className="flex flex-col gap-4">
              <div>
                <p className="font-mono text-[10.5px] font-semibold uppercase tracking-widest mb-1 text-slate-400">
                  Minggu ke-{row.minggu}
                </p>
                <h3 className="text-[15.5px] font-bold leading-snug text-slate-800">{row.judul}</h3>
                <p className="text-[12px] mt-1 text-slate-400">Dikirim {row.dikirim}</p>
              </div>

              {row.file ? (
                <div className="flex items-center gap-3 p-3.5 rounded-xl border border-slate-200 bg-slate-50">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 border border-[#93C5FD] bg-[#EFF6FF] text-[#0A66C2]">
                    <IconDoc size={18} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-semibold truncate text-slate-800">{row.file.name}</p>
                    <p className="font-mono text-[10.5px] text-slate-400 tracking-wide">{ext || "FILE"}</p>
                  </div>
                  <a
                    href={toDownloadUrl(row.file?.url)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-[11.5px] font-semibold text-white flex-shrink-0 bg-[#0A66C2] hover:bg-[#08519c] transition-colors"
                  >
                    <IconDownload /> Unduh
                  </a>
                </div>
              ) : (
                <div className="flex items-center gap-2.5 p-3.5 rounded-xl border border-dashed border-slate-200 text-slate-400">
                  <IconAlert />
                  <p className="text-[12.5px]">Mahasiswa belum mengunggah file untuk laporan ini.</p>
                </div>
              )}

              {(row.status === "Disetujui" || row.status === "Ditolak") && (
                <div className="rounded-xl p-4 border border-slate-200 bg-slate-50">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-mono text-[10.5px] font-semibold uppercase tracking-widest text-slate-400">
                      Keputusan saat ini
                    </p>
                    <span
                      className={`font-mono text-[11px] font-bold px-2.5 py-1 rounded-full border ${
                        row.status === "Disetujui"
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                          : "bg-red-50 text-red-600 border-red-200"
                      }`}
                    >
                      {row.status}
                    </span>
                  </div>
                  {row.catatan && <p className="text-[12.5px] leading-relaxed text-slate-600">{row.catatan}</p>}
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col gap-5">
              <div>
                <p className="text-[12px] font-semibold text-slate-800 mb-3">Keputusan</p>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setDecision("DISETUJUI")}
                    className={`flex items-center justify-center gap-2 py-3 rounded-xl border-2 text-[13px] font-bold transition-all cursor-pointer ${
                      decision === "DISETUJUI"
                        ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                        : "border-slate-200 text-slate-400 hover:border-emerald-200 hover:bg-emerald-50/40"
                    }`}
                  >
                    <IconCheck size={16} /> Setujui
                  </button>
                  <button
                    onClick={() => setDecision("DITOLAK")}
                    className={`flex items-center justify-center gap-2 py-3 rounded-xl border-2 text-[13px] font-bold transition-all cursor-pointer ${
                      decision === "DITOLAK"
                        ? "border-red-500 bg-red-50 text-red-600"
                        : "border-slate-200 text-slate-400 hover:border-red-200 hover:bg-red-50/40"
                    }`}
                  >
                    <IconX size={16} /> Tolak
                  </button>
                </div>
              </div>

              <div>
                <p className="text-[12px] font-semibold mb-2 text-slate-800">
                  Catatan {decision === "DITOLAK" && <span className="text-red-500">*wajib diisi</span>}
                </p>
                <textarea
                  value={catatan}
                  onChange={(e) => setCatatan(e.target.value)}
                  placeholder={
                    decision === "DITOLAK"
                      ? "Jelaskan alasan penolakan agar mahasiswa bisa memperbaiki laporannya…"
                      : "Tulis masukan untuk mahasiswa (opsional)…"
                  }
                  rows={4}
                  className={`w-full px-4 py-3 rounded-xl text-[13px] resize-none outline-none transition-all font-sans text-slate-800 border focus:ring-4 ${
                    catatanKosongSaatTolak
                      ? "border-red-300 focus:border-red-400 focus:ring-red-50"
                      : "border-slate-200 focus:border-[#0A66C2] focus:ring-[#EFF6FF]"
                  }`}
                />
                {catatanKosongSaatTolak && (
                  <p className="text-[11px] text-red-500 mt-1">Catatan wajib diisi saat menolak laporan.</p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer action — hanya di tab Setujui/Tolak */}
        {tab === "review" && (
          <div className="px-6 py-4 border-t border-slate-200 flex-shrink-0">
            <button
              onClick={submit}
              disabled={saving || catatanKosongSaatTolak}
              className={`w-full py-3 rounded-xl text-[13px] font-bold text-white transition-colors cursor-pointer disabled:opacity-60 ${
                decision === "DITOLAK" ? "bg-red-600 hover:bg-red-700" : "bg-[#0A66C2] hover:bg-[#08519c]"
              }`}
            >
              {saving
                ? "Menyimpan…"
                : decision === "DITOLAK"
                ? "Tolak Laporan"
                : "Setujui Laporan"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Row laporan (satu baris tabel) ──────────────────────────────────────────
function LaporanTableRow({ row, onOpen }) {
  const ext = row.file ? fileExt(row.file.name) : null;

  return (
    <tr className="border-b border-slate-100 last:border-b-0 transition-colors hover:bg-slate-50">
      <td className="px-4 py-[13px]">
        <div className="flex items-center gap-[10px]">
          <Avatar nama={row.mahasiswaNama} size={32} />
          <div className="min-w-0">
            <p className="text-[13px] font-semibold truncate text-slate-800">{row.mahasiswaNama}</p>
            <p className="font-mono text-[10.5px] text-slate-400 tracking-wide">{row.mahasiswaNim}</p>
          </div>
        </div>
      </td>
      <td className="px-4 py-[13px] max-w-[260px]">
        <p className="text-[13px] font-medium truncate text-slate-800">{row.judul}</p>
        <div className="flex items-center gap-1.5 mt-[2px]">
          <span className="font-mono text-[10.5px] text-slate-400 tracking-wide">Minggu {row.minggu}</span>
          {ext && <span className="font-mono text-[10px] font-semibold text-[#0A66C2]">· {ext}</span>}
        </div>
      </td>
      <td className="px-4 py-[13px] font-mono text-[11.5px] text-slate-400 tracking-wide">{row.dikirim}</td>
      <td className="px-4 py-[13px]"><StatusPill status={row.status} /></td>
      <td className="px-4 py-[13px] max-w-[220px]">
        <p className="text-[11.5px] text-slate-500 truncate">{row.catatan || "—"}</p>
      </td>
      <td className="px-4 py-[13px]">
        <div className="flex items-center gap-[6px]">
          <button
            onClick={() => onOpen(row, "laporan")}
            className="px-[10px] py-[7px] rounded-lg text-[11px] font-medium transition-colors cursor-pointer bg-slate-50 text-slate-600 border border-slate-200 hover:bg-[#EFF6FF] hover:text-[#0A66C2] hover:border-[#93C5FD]"
          >
            Lihat Laporan
          </button>
          <button
            onClick={() => onOpen(row, "review")}
            className="px-[10px] py-[7px] rounded-lg text-[11px] font-bold transition-colors cursor-pointer bg-[#0A66C2] text-white hover:bg-[#08519c]"
          >
            {row.status === "Menunggu Review" ? "Review" : "Ubah Keputusan"}
          </button>
        </div>
      </td>
    </tr>
  );
}

// ── Main Page ────────────────────────────────────────────────────────────────
export default function KelolaLaporanPage() {
  const [mahasiswaData, setMahasiswaData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("semua");
  const [activeRow, setActiveRow] = useState(null);
  const [activeTab, setActiveTab] = useState("laporan");
  const [toast, setToast] = useState(null);

  const showToast = useCallback((message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3200);
  }, []);

  async function fetchLaporanDosen() {
    try {
      setLoading(true);
      setError("");
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/api/laporan-magang/dosen`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || "Gagal mengambil laporan dosen");
      setMahasiswaData(json.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchLaporanDosen();
  }, []);

  // Ratakan data mahasiswa + laporan jadi satu daftar baris
  const rows = useMemo(() => {
    const list = [];
    mahasiswaData.forEach((m) => {
      (m.laporan || []).forEach((l) => {
        list.push({
          ...l,
          mahasiswaId: m.id,
          mahasiswaNama: m.nama,
          mahasiswaNim: m.nim,
        });
      });
    });
    // Laporan yang masih menunggu tampil lebih dulu
    return list.sort((a, b) => {
      const rank = (s) => (s === "Menunggu Review" ? 0 : s === "Ditolak" ? 1 : 2);
      return rank(a.status) - rank(b.status);
    });
  }, [mahasiswaData]);

  const filteredRows = useMemo(() => {
    const q = search.toLowerCase().trim();
    return rows.filter((r) => {
      const matchSearch =
        !q ||
        r.mahasiswaNama.toLowerCase().includes(q) ||
        r.judul.toLowerCase().includes(q) ||
        r.mahasiswaNim.toLowerCase().includes(q);
      const matchStatus =
        statusFilter === "semua" ||
        (statusFilter === "menunggu" && r.status === "Menunggu Review") ||
        (statusFilter === "disetujui" && r.status === "Disetujui") ||
        (statusFilter === "ditolak" && r.status === "Ditolak");
      return matchSearch && matchStatus;
    });
  }, [rows, search, statusFilter]);

  const stats = useMemo(() => {
    const total = rows.length;
    const menunggu = rows.filter((r) => r.status === "Menunggu Review").length;
    const disetujui = rows.filter((r) => r.status === "Disetujui").length;
    const ditolak = rows.filter((r) => r.status === "Ditolak").length;
    return { total, menunggu, disetujui, ditolak };
  }, [rows]);

  function openRow(row, tab = "laporan") {
    setActiveRow(row);
    setActiveTab(tab);
  }

  async function handleSave({ status, catatan }) {
    const row = activeRow;
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/api/laporan-magang/dosen/${row.id}/review`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status, catatan }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || "Gagal menyimpan keputusan");

      const statusLabel = status === "DISETUJUI" ? "Disetujui" : "Ditolak";

      setMahasiswaData((prev) =>
        prev.map((m) =>
          m.id === row.mahasiswaId
            ? {
                ...m,
                laporan: m.laporan.map((l) =>
                  l.id === row.id ? { ...l, status: statusLabel, catatan } : l
                ),
              }
            : m
        )
      );
      setActiveRow(null);
      showToast(
        status === "DISETUJUI" ? "Laporan berhasil disetujui." : "Laporan berhasil ditolak."
      );
    } catch (err) {
      showToast(err.message, "error");
    }
  }

  // Ledger statistik — sama persis dengan strip statistik Dashboard Dosen
  const statCards = [
    { label: "Total Laporan", value: stats.total, sub: "Dari mahasiswa bimbingan", icon: <IconDoc size={18} />, color: "text-[#0A66C2]" },
    { label: "Menunggu", value: stats.menunggu, sub: "Belum direview", icon: <IconClock size={18} />, color: "text-[#0A66C2]" },
    { label: "Disetujui", value: stats.disetujui, sub: "Sudah disetujui", icon: <IconCheck size={18} />, color: "text-[#0A66C2]" },
    { label: "Ditolak", value: stats.ditolak, sub: "Perlu revisi mahasiswa", icon: <IconX size={18} />, color: "text-[#0A66C2]" },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col gap-6 font-sans">
      <style>{FONTS}</style>

      <Topbar
        icon={<IconDoc size={17} />}
        title="Kelola Laporan Magang"
        subtitle="Semua laporan mahasiswa bimbingan, dalam satu daftar"
        iconBg="bg-[#EFF6FF]"
        iconBorder="border-[#93C5FD]"
        iconColor="text-[#0A66C2]"
        rightSlot={
          <button
            onClick={() => window.history.back()}
            className="flex items-center gap-2 px-4 py-2 border border-[#0A66C2]/40 rounded-xl text-[#0A66C2] text-[12.5px] font-semibold bg-transparent transition-all duration-150 hover:bg-[#0958A8] hover:text-white hover:border-[#0A66C2] cursor-pointer"
          >
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

      <main className="px-8 pb-8 flex flex-col gap-5">
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <p className="text-[13px] text-slate-400">Memuat laporan...</p>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center py-24">
            <p className="text-[13px] text-red-600">{error}</p>
          </div>
        ) : rows.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200">
            <EmptyState
              icon={<IconDoc size={20} />}
              title="Belum ada laporan untuk ditinjau"
              sub="Setelah mahasiswa bimbinganmu mengirim laporan, semuanya akan tampil di sini dalam satu daftar."
            />
          </div>
        ) : (
          <>
            {/* Stat strip — treatment ledger, identik dengan Dashboard Dosen */}
            <div className="grid grid-cols-4 max-[900px]:grid-cols-1 bg-white border border-slate-200 rounded-2xl overflow-hidden">
              {statCards.map((s) => (
                <div
                  key={s.label}
                  className="px-6 py-5 flex flex-col gap-2 transition-colors duration-150 hover:bg-slate-50 border-r border-dashed border-slate-200 last:border-r-0 max-[900px]:border-r-0 max-[900px]:border-b max-[900px]:last:border-b-0"
                >
                  <div className="flex items-center gap-1.5">
                    <span className={s.color}>{s.icon}</span>
                    <span className={`font-mono text-[10px] uppercase tracking-[0.14em] font-semibold ${s.color}`}>
                      {s.label}
                    </span>
                  </div>
                  <span className={`font-display text-[32px] font-semibold leading-none tracking-tight ${s.color}`}>
                    {s.value}
                  </span>
                  <span className="text-[11px] text-slate-400">{s.sub}</span>
                </div>
              ))}
            </div>

            {/* Search & filter */}
            <div className="flex items-center gap-[10px]">
              <div className="relative flex-1">
                <span className="absolute left-[11px] top-1/2 -translate-y-1/2 text-slate-300"><IconSearch /></span>
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Cari nama mahasiswa, NIM, atau judul laporan..."
                  className="w-full pl-[34px] pr-3 py-2 rounded-[8px] text-[13px] outline-none transition-colors text-slate-800 bg-white border border-slate-200 focus:border-[#0A66C2]"
                />
              </div>
              <div className="flex items-center gap-1 p-1 rounded-xl flex-shrink-0 bg-slate-100">
                {STATUS_OPTIONS.map((s) => (
                  <button
                    key={s.key}
                    onClick={() => setStatusFilter(s.key)}
                    className={`font-mono px-3 py-1.5 rounded-lg text-[10.5px] font-semibold uppercase tracking-wide transition-all cursor-pointer whitespace-nowrap ${
                      statusFilter === s.key ? "bg-white text-slate-800 shadow-sm" : "text-slate-400"
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl overflow-hidden border border-slate-200">
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    {["Mahasiswa", "Laporan", "Dikirim", "Status", "Catatan", "Aksi"].map((h) => (
                      <th
                        key={h}
                        className="font-mono px-4 py-3 text-left text-[10.5px] font-semibold uppercase tracking-[.08em] border-b border-slate-200 bg-slate-50 text-slate-400"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredRows.length > 0 ? (
                    filteredRows.map((row) => (
                      <LaporanTableRow key={row.id} row={row} onOpen={openRow} />
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6}>
                        <EmptyState
                          icon={<IconSearch />}
                          title="Tidak ada laporan yang cocok"
                          sub="Coba ubah kata kunci pencarian atau filter status."
                        />
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>

              <div className="flex items-center justify-between px-4 py-3 border-t border-slate-100">
                <span className="text-[12px] text-slate-400">
                  Menampilkan {filteredRows.length} dari {rows.length} laporan
                </span>
              </div>
            </div>
          </>
        )}
      </main>

      {activeRow && (
        <ReviewModal
          key={`${activeRow.id}-${activeTab}`}
          row={activeRow}
          initialTab={activeTab}
          onClose={() => setActiveRow(null)}
          onSave={handleSave}
        />
      )}
      {toast && <Toast message={toast.message} type={toast.type} />}
    </div>
  );
}