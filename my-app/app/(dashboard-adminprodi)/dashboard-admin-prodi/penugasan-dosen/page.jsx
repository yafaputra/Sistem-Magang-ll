"use client";

import { useState, useEffect, useMemo } from "react";
import Topbar from "../../components/topbar";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000";
const getToken = () => {
  try { return localStorage.getItem("token") || ""; } catch { return ""; }
};

// ─── Fonts — konsisten dengan halaman lain ──────────────────────────────────
const FONTS = `
@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600;9..144,700&family=IBM+Plex+Mono:wght@400;500;600&display=swap');
.font-display { font-family: 'Fraunces', 'Georgia', serif; }
.font-mono { font-family: 'IBM Plex Mono', 'Courier New', monospace; }
`;

// ─── Status Config (warna tidak diubah) ─────────────────────────────────────
const STATUS_CONFIG = {
  MENUNGGU_VERIFIKASI_PRODI: {
    label: "Perlu Ditunjuk",
    badge: "bg-amber-50 text-amber-700 border border-amber-200",
    dot: "bg-amber-400",
    timelineBg: "bg-amber-50 border border-amber-100",
    timelineDot: "bg-amber-400",
    icon: "clock",
  },
  MENUNGGU_PERSETUJUAN_DOSEN: {
    label: "Menunggu Dosen",
    badge: "bg-violet-50 text-violet-700 border border-violet-200",
    dot: "bg-violet-400",
    timelineBg: "bg-violet-50 border border-violet-100",
    timelineDot: "bg-violet-400",
    icon: "clock",
  },
  MENUNGGU_PENGESAHAN_ADMIN: {
    label: "Perlu Disahkan",
    badge: "bg-sky-50 text-sky-700 border border-sky-200",
    dot: "bg-sky-400",
    timelineBg: "bg-sky-50 border border-sky-100",
    timelineDot: "bg-sky-400",
    icon: "check-circle",
  },
  BIMBINGAN_AKTIF: {
    label: "Bimbingan Aktif",
    badge: "bg-emerald-50 text-emerald-700 border border-emerald-200",
    dot: "bg-emerald-500",
    timelineBg: "bg-emerald-50 border border-emerald-100",
    timelineDot: "bg-emerald-500",
    icon: "check-circle",
  },
  DITOLAK_DOSEN: {
    label: "Ditolak Dosen",
    badge: "bg-red-50 text-red-600 border border-red-200",
    dot: "bg-red-400",
    timelineBg: "bg-red-50 border border-red-100",
    timelineDot: "bg-red-400",
    icon: "x-circle",
  },
  SELESAI: {
    label: "Selesai",
    badge: "bg-slate-100 text-slate-600 border border-slate-200",
    dot: "bg-slate-400",
    timelineBg: "bg-slate-50 border border-slate-100",
    timelineDot: "bg-slate-400",
    icon: "check",
  },
};

const initials = (name) =>
  (name || "?").split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();

const AV_COLORS = [
  ["bg-blue-100", "text-blue-700", "border-blue-200"],
  ["bg-emerald-100", "text-emerald-700", "border-emerald-200"],
  ["bg-violet-100", "text-violet-700", "border-violet-200"],
  ["bg-amber-100", "text-amber-700", "border-amber-200"],
  ["bg-rose-100", "text-rose-700", "border-rose-200"],
];
const avColor = (id) => AV_COLORS[(id || 0) % AV_COLORS.length];

const formatDate = (d) =>
  d ? new Date(d).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" }) : "-";

// ─── Icons (inline SVG helpers) ─────────────────────────────────────────────
function Icon({ name, className = "w-4 h-4" }) {
  const icons = {
    user: <><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></>,
    users: <><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" /></>,
    "user-check": <><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><polyline points="16 11 18 13 22 9" /></>,
    building: <><rect x="4" y="2" width="16" height="20" rx="1" /><path d="M9 22v-4h6v4" /><path d="M8 6h.01M16 6h.01M8 10h.01M16 10h.01M8 14h.01M16 14h.01" /></>,
    briefcase: <><rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" /></>,
    school: <><path d="M22 10v6M2 10l10-5 10 5-10 5z" /><path d="M6 12v5c3 3 9 3 12 0v-5" /></>,
    calendar: <><rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></>,
    clock: <><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></>,
    "message-circle": <><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></>,
    notes: <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" /></>,
    history: <><polyline points="1 4 1 10 7 10" /><path d="M3.51 15a9 9 0 1 0 .49-3.86" /><polyline points="12 7 12 12 15 15" /></>,
    "check-circle": <><polyline points="9 11 12 14 22 4" /><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" /></>,
    "x-circle": <><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></>,
    check: <><polyline points="20 6 9 17 4 12" /></>,
    send: <><line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" /></>,
    search: <><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></>,
    "arrow-left": <><line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" /></>,
    x: <><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></>,
    "alert-circle": <><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></>,
  };
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
      {icons[name]}
    </svg>
  );
}

// ─── Timeline Item ───────────────────────────────────────────────────────────
function TimelineItem({ riwayat, isLatest, isLast }) {
  const sc = STATUS_CONFIG[riwayat.status] || {};
  return (
    <div className="relative flex gap-4">
      <div className="flex flex-col items-center">
        <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center flex-shrink-0 z-10 ${
          isLatest
            ? "bg-emerald-500 border-white shadow-md shadow-emerald-200"
            : "bg-white border-slate-200"
        }`}>
          <Icon name={isLatest ? "check" : "clock"} className={`w-3.5 h-3.5 ${isLatest ? "text-white" : "text-slate-400"}`} />
        </div>
        {!isLast && <div className="w-px flex-1 bg-slate-200 mt-1" />}
      </div>

      <div className="flex-1 pb-4">
        <div className={`rounded-xl p-3.5 ${isLatest ? "bg-emerald-50 border border-emerald-100" : "bg-slate-50 border border-slate-100"}`}>
          <div className="flex items-center justify-between gap-2 flex-wrap mb-1">
            <span className={`text-[12.5px] font-semibold ${isLatest ? "text-emerald-800" : "text-slate-700"}`}>
              {sc.label || riwayat.status}
            </span>
            <span className={`text-[11px] font-mono ${isLatest ? "text-emerald-600" : "text-slate-400"}`}>
              {formatDate(riwayat.createdAt)}
            </span>
          </div>
          {riwayat.keterangan && (
            <p className={`text-[12px] leading-relaxed ${isLatest ? "text-emerald-700" : "text-slate-500"}`}>
              {riwayat.keterangan}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Info Row (used in detail grid) ─────────────────────────────────────────
function InfoCard({ icon, label, value, highlight }) {
  return (
    <div className={`rounded-xl border p-3 flex flex-col gap-1.5 ${highlight ? "bg-emerald-50 border-emerald-200" : "bg-slate-50 border-slate-200"}`}>
      <div className={`flex items-center gap-1.5 text-[10.5px] uppercase tracking-wide font-semibold font-mono ${highlight ? "text-emerald-600" : "text-slate-400"}`}>
        <Icon name={icon} className="w-3.5 h-3.5" />
        {label}
      </div>
      <div className={`text-[13px] font-semibold ${highlight ? "text-emerald-800" : "text-slate-800"}`}>{value || "—"}</div>
    </div>
  );
}

// ─── Avatar ─────────────────────────────────────────────────────────────────
function Avatar({ name, id, size = "md" }) {
  const [bg, text, border] = avColor(id);
  const sz = size === "sm" ? "w-7 h-7 text-[9px]" : "w-9 h-9 text-[11px]";
  return (
    <div className={`${sz} rounded-lg border ${bg} ${text} ${border} flex items-center justify-center font-bold flex-shrink-0`}>
      {initials(name)}
    </div>
  );
}

// ─── Detail Modal ─────────────────────────────────────────────────────────────
function DetailModal({ pengajuan, dosenList, onClose, onTetapkan, onSahkan }) {
  const [selectedDosen, setSelectedDosen] = useState(
    pengajuan?.dosenDitetapkan?.id || pengajuan?.dosenUsulan?.id || ""
  );
  const [catatan, setCatatan] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [searchDosen, setSearchDosen] = useState("");

  if (!pengajuan) return null;

  const sc = STATUS_CONFIG[pengajuan.status] || {};
  const mahasiswaNama = pengajuan.mahasiswa?.user?.name || "-";
  const perusahaan = pengajuan.lamaran?.lowongan?.perusahaan?.nama || "-";
  const posisi = pengajuan.lamaran?.lowongan?.posisi || "-";
  const dosenUsulanNama = pengajuan.dosenUsulan?.user?.name || "Tidak ada usulan";
  const dosenDitetapkanNama = pengajuan.dosenDitetapkan?.user?.name || null;

  // Tunjuk dosen: hanya saat mahasiswa belum punya dosen, atau setelah dosen menolak
  const canTetapkan = ["MENUNGGU_VERIFIKASI_PRODI", "DITOLAK_DOSEN"].includes(pengajuan.status);
  // Sahkan: hanya saat dosen sudah setuju atas usulan mahasiswa sendiri
  const canSahkan = pengajuan.status === "MENUNGGU_PENGESAHAN_ADMIN";

  const filteredDosen = dosenList.filter((d) =>
    (d.user?.name || d.name || "").toLowerCase().includes(searchDosen.toLowerCase())
  );

  const riwayatReversed = [...(pengajuan.riwayatStatus || [])].reverse();

  const handleTetapkan = async () => {
    if (!selectedDosen) return;
    setSubmitting(true);
    await onTetapkan(pengajuan.id, Number(selectedDosen), catatan);
    setSubmitting(false);
    onClose();
  };

  const handleSahkan = async () => {
    setSubmitting(true);
    await onSahkan(pengajuan.id);
    setSubmitting(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[92vh] flex flex-col overflow-hidden border border-slate-200">

        {/* ── Header ── */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center flex-shrink-0">
              <Icon name="user-check" className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <div className="text-[14px] font-semibold text-slate-800 leading-tight font-display">Detail Pengajuan Dosen</div>
              <div className="text-[11.5px] text-slate-400 mt-0.5">{mahasiswaNama} · {perusahaan}</div>
            </div>
          </div>
          <div className="flex items-center gap-2.5">
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11.5px] font-semibold ${sc.badge}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />
              {sc.label}
            </span>
            <button onClick={onClose}
              className="w-8 h-8 rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-slate-100 transition-colors">
              <Icon name="x" className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* ── Scrollable body ── */}
        <div className="overflow-y-auto flex-1 p-5 space-y-5">

          {/* ── Info Grid ── */}
          <div className="grid grid-cols-3 gap-2.5">
            <InfoCard icon="user" label="Mahasiswa" value={mahasiswaNama} />
            <InfoCard icon="building" label="Perusahaan" value={perusahaan} />
            <InfoCard icon="briefcase" label="Posisi" value={posisi} />
          </div>

          {/* ── Dosen Cards ── */}
          <div className="grid grid-cols-2 gap-2.5">
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
              <div className="flex items-center gap-1.5 text-[10.5px] uppercase tracking-wide font-semibold text-slate-400 mb-2.5 font-mono">
                <Icon name="school" className="w-3.5 h-3.5" />
                Dosen Usulan Mahasiswa
              </div>
              <div className="flex items-center gap-2.5">
                <Avatar name={dosenUsulanNama} id={pengajuan.dosenUsulan?.id} size="sm" />
                <div className="text-[12.5px] font-semibold text-slate-800 truncate">{dosenUsulanNama}</div>
              </div>
            </div>
            <div className={`rounded-xl border p-3 ${dosenDitetapkanNama ? "bg-emerald-50 border-emerald-200" : "bg-slate-50 border-slate-200"}`}>
              <div className={`flex items-center gap-1.5 text-[10.5px] uppercase tracking-wide font-semibold mb-2.5 font-mono ${dosenDitetapkanNama ? "text-emerald-600" : "text-slate-400"}`}>
                <Icon name="check-circle" className="w-3.5 h-3.5" />
                Dosen Berjalan
              </div>
              {dosenDitetapkanNama ? (
                <div className="flex items-center gap-2.5">
                  <Avatar name={dosenDitetapkanNama} id={pengajuan.dosenDitetapkan?.id} size="sm" />
                  <div className="text-[12.5px] font-semibold text-emerald-800 truncate">{dosenDitetapkanNama}</div>
                </div>
              ) : (
                <div className="text-[12px] text-slate-400 italic">Belum ditunjuk</div>
              )}
            </div>
          </div>

          {/* ── Tanggal ── */}
          <div className="flex items-center gap-2.5 px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl">
            <Icon name="calendar" className="w-4 h-4 text-slate-400" />
            <span className="text-[12px] text-slate-500">Tanggal pengajuan</span>
            <span className="ml-auto text-[12.5px] font-semibold text-slate-700 font-mono">{formatDate(pengajuan.createdAt)}</span>
          </div>

          {/* ── Alasan ── */}
          <div className="rounded-xl border border-slate-200 overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-2.5 bg-slate-50 border-b border-slate-200">
              <Icon name="message-circle" className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-[10.5px] font-semibold uppercase tracking-wider text-slate-400 font-mono">Alasan Mahasiswa</span>
            </div>
            <div className="px-4 py-3 bg-white">
              <p className="text-[13px] text-slate-700 leading-relaxed">{pengajuan.alasanMemilih}</p>
            </div>
          </div>

          {/* ── Catatan Tambahan ── */}
          {pengajuan.catatanTambahan && (
            <div className="rounded-xl border border-slate-200 overflow-hidden">
              <div className="flex items-center gap-2 px-4 py-2.5 bg-slate-50 border-b border-slate-200">
                <Icon name="notes" className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-[10.5px] font-semibold uppercase tracking-wider text-slate-400 font-mono">Catatan Tambahan</span>
              </div>
              <div className="px-4 py-3 bg-white">
                <p className="text-[13px] text-slate-700 leading-relaxed">{pengajuan.catatanTambahan}</p>
              </div>
            </div>
          )}

          {/* ── Alasan Penolakan ── */}
          {pengajuan.alasanPenolakan && (
            <div className="rounded-xl border border-red-100 overflow-hidden">
              <div className="flex items-center gap-2 px-4 py-2.5 bg-red-50 border-b border-red-100">
                <Icon name="alert-circle" className="w-3.5 h-3.5 text-red-500" />
                <span className="text-[10.5px] font-semibold uppercase tracking-wider text-red-500 font-mono">Alasan Penolakan Dosen</span>
              </div>
              <div className="px-4 py-3 bg-red-50">
                <p className="text-[13px] text-red-700 leading-relaxed">{pengajuan.alasanPenolakan}</p>
              </div>
            </div>
          )}

          {/* ── Riwayat Status (Timeline) ── */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Icon name="history" className="w-4 h-4 text-slate-400" />
              <span className="text-[10.5px] font-semibold uppercase tracking-wider text-slate-400 font-mono">Riwayat Status</span>
            </div>
            <div className="space-y-0">
              {riwayatReversed.map((r, i) => (
                <TimelineItem
                  key={r.id}
                  riwayat={r}
                  isLatest={i === 0}
                  isLast={i === riwayatReversed.length - 1}
                />
              ))}
            </div>
          </div>

          {/* ── Panel Sahkan Bimbingan (dosen sudah setuju usulan mahasiswa) ── */}
          {canSahkan && (
            <div className="border-t border-slate-100 pt-5 space-y-3">
              <div className="bg-sky-50 border border-sky-100 rounded-xl p-4 flex items-start gap-3">
                <Icon name="check-circle" className="w-5 h-5 text-sky-600 flex-shrink-0 mt-0.5" />
                <p className="text-[12.5px] text-sky-700 leading-relaxed">
                  Dosen <strong>{dosenDitetapkanNama}</strong> sudah menyetujui permohonan bimbingan dari usulan mahasiswa.
                  Sahkan untuk mengaktifkan bimbingan ini secara resmi.
                </p>
              </div>
              <div className="flex gap-2">
                <button onClick={onClose}
                  className="flex-1 py-2.5 rounded-xl text-sm font-semibold border border-slate-200 text-slate-500 hover:bg-slate-50 transition-colors">
                  Nanti Dulu
                </button>
                <button onClick={handleSahkan} disabled={submitting}
                  className="flex-1 py-2.5 rounded-xl text-sm font-semibold bg-sky-500 text-white hover:bg-sky-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2">
                  {submitting
                    ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Menyahkan...</>
                    : <><Icon name="check-circle" className="w-4 h-4" />Sahkan Bimbingan</>}
                </button>
              </div>
            </div>
          )}

          {/* ── Panel Tunjuk Dosen ── */}
          {canTetapkan && (
            <div className="border-t border-slate-100 pt-5 space-y-3">
              <div className="flex items-center gap-2 mb-1">
                <Icon name="user-check" className="w-4 h-4 text-blue-500" />
                <span className="text-[10.5px] font-semibold uppercase tracking-wider text-slate-500 font-mono">
                  {pengajuan.status === "DITOLAK_DOSEN" ? "Tunjuk Dosen Pengganti (Setelah Penolakan)" : "Tunjuk Dosen Pembimbing"}
                </span>
              </div>

              {/* Search dosen */}
              <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 focus-within:border-blue-300 transition-colors">
                <Icon name="search" className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                <input
                  className="border-none outline-none text-[12.5px] text-slate-700 bg-transparent w-full placeholder:text-slate-400"
                  placeholder="Cari nama dosen..."
                  value={searchDosen}
                  onChange={(e) => setSearchDosen(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-1 gap-2 max-h-52 overflow-y-auto pr-1">
                {filteredDosen.map((d) => {
                  const nama = d.user?.name || d.name || "-";
                  const dep = d.department || d.faculty || "-";
                  const isSelected = String(selectedDosen) === String(d.id);
                  return (
                    <button key={d.id} onClick={() => setSelectedDosen(d.id)}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl border text-left transition-all ${
                        isSelected ? "border-blue-400 bg-blue-50" : "border-slate-200 hover:border-blue-200 hover:bg-slate-50"
                      }`}>
                      <Avatar name={nama} id={d.id} size="sm" />
                      <div className="flex-1 min-w-0">
                        <div className={`text-[12.5px] font-semibold truncate ${isSelected ? "text-blue-700" : "text-slate-800"}`}>{nama}</div>
                        <div className="text-[11px] text-slate-400 truncate">{dep}</div>
                      </div>
                      {isSelected && (
                        <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0">
                          <Icon name="check" className="w-3 h-3 text-white" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>

              <div>
                <label className="block text-[10.5px] font-semibold text-slate-500 mb-1.5 uppercase tracking-wide font-mono">
                  Catatan Prodi <span className="normal-case font-normal text-slate-400">(opsional)</span>
                </label>
                <textarea
                  value={catatan}
                  onChange={(e) => setCatatan(e.target.value)}
                  rows={2}
                  placeholder="Keterangan tambahan dari prodi..."
                  className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-[12.5px] text-slate-700 focus:outline-none focus:border-blue-400 resize-none transition-colors"
                />
              </div>

              <div className="flex gap-2 pt-1">
                <button onClick={onClose}
                  className="flex-1 py-2.5 rounded-xl text-sm font-semibold border border-slate-200 text-slate-500 hover:bg-slate-50 transition-colors">
                  Batal
                </button>
                <button onClick={handleTetapkan} disabled={!selectedDosen || submitting}
                  className="flex-1 py-2.5 rounded-xl text-sm font-semibold bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2">
                  {submitting
                    ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Menyimpan...</>
                    : <><Icon name="user-check" className="w-4 h-4" />Tunjuk Dosen</>}
                </button>
              </div>
            </div>
          )}

          {/* ── Close button (non-action states) ── */}
          {!canTetapkan && !canSahkan && (
            <div className="border-t border-slate-100 pt-4">
              <button onClick={onClose}
                className="w-full py-2.5 rounded-xl text-sm font-semibold border border-slate-200 text-slate-500 hover:bg-slate-50 transition-colors flex items-center justify-center gap-2">
                <Icon name="x" className="w-4 h-4" />
                Tutup
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Stat Card — versi "ledger", warna per kolom TIDAK diubah ───────────────
function StatCard({ label, value, icon, color, isLast }) {
  return (
    <div className={`px-5 py-4 flex flex-col gap-2 transition-colors duration-150 hover:bg-slate-50 border-r border-dashed border-slate-200 ${isLast ? "border-r-0" : ""}`}>
      <div className="flex items-center gap-1.5">
        <span className={color}><Icon name={icon} className="w-3.5 h-3.5" /></span>
        <span className={`font-mono text-[10px] uppercase tracking-[0.14em] font-semibold ${color}`}>{label}</span>
      </div>
      <span className={`font-display text-[26px] font-semibold leading-none ${color}`}>{value}</span>
    </div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────
export default function AdminPengajuanDosenPage() {
  const [pengajuanList, setPengajuanList] = useState([]);
  const [dosenList, setDosenList]         = useState([]);
  const [loading, setLoading]             = useState(true);
  const [search, setSearch]               = useState("");
  const [filterStatus, setFilterStatus]   = useState("semua");
  const [selected, setSelected]           = useState(null);
  const [toast, setToast]                 = useState("");

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(""), 3500); };

  const fetchAll = async () => {
    const token = getToken();
    try {
      const [resPengajuan, resDosen] = await Promise.all([
        fetch(`${API_BASE}/api/pengajuan-dosen`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${API_BASE}/api/dosen`,            { headers: { Authorization: `Bearer ${token}` } }),
      ]);
      const dP = await resPengajuan.json();
      const dD = await resDosen.json();
      setPengajuanList(dP.data || []);
      setDosenList(dD.data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAll(); }, []);

  const counts = {
    total:     pengajuanList.length,
    perluTunjuk: pengajuanList.filter((p) => p.status === "MENUNGGU_VERIFIKASI_PRODI").length,
    proses:    pengajuanList.filter((p) => p.status === "MENUNGGU_PERSETUJUAN_DOSEN").length,
    perluSahkan: pengajuanList.filter((p) => p.status === "MENUNGGU_PENGESAHAN_ADMIN").length,
    aktif:     pengajuanList.filter((p) => p.status === "BIMBINGAN_AKTIF").length,
    ditolak:   pengajuanList.filter((p) => p.status === "DITOLAK_DOSEN").length,
  };

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return pengajuanList.filter((p) => {
      const matchStatus = filterStatus === "semua" || p.status === filterStatus;
      const nama  = p.mahasiswa?.user?.name || "";
      const perus = p.lamaran?.lowongan?.perusahaan?.nama || "";
      return matchStatus && (nama.toLowerCase().includes(q) || perus.toLowerCase().includes(q));
    });
  }, [pengajuanList, search, filterStatus]);

  const handleTetapkan = async (pengajuanId, dosenId, catatan) => {
    const token = getToken();
    try {
      const res = await fetch(`${API_BASE}/api/pengajuan-dosen/${pengajuanId}/tetapkan`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ dosenDitetapkanId: dosenId, catatanProdi: catatan }),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.message);
      showToast("Dosen pembimbing berhasil ditunjuk!");
      await fetchAll();
    } catch (e) {
      showToast("Gagal: " + e.message);
    }
  };

  const handleSahkan = async (pengajuanId) => {
    const token = getToken();
    try {
      const res = await fetch(`${API_BASE}/api/pengajuan-dosen/${pengajuanId}/sahkan`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.message);
      showToast("Bimbingan berhasil disahkan!");
      await fetchAll();
    } catch (e) {
      showToast("Gagal: " + e.message);
    }
  };

  const FILTER_TABS = [
    { key: "semua",                      label: "Semua" },
    { key: "MENUNGGU_VERIFIKASI_PRODI",  label: "Perlu Ditunjuk" },
    { key: "MENUNGGU_PERSETUJUAN_DOSEN", label: "Menunggu Dosen" },
    { key: "MENUNGGU_PENGESAHAN_ADMIN",  label: "Perlu Disahkan" },
    { key: "DITOLAK_DOSEN",              label: "Ditolak Dosen" },
    { key: "BIMBINGAN_AKTIF",            label: "Aktif" },
  ];

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-screen bg-slate-50 gap-3">
      <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      <div className="text-slate-400 text-sm">Memuat data...</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 font-sans flex flex-col">
      <style>{FONTS}</style>

      {/* Toast */}
      {toast && (
        <div className="fixed top-4 right-4 z-50 bg-slate-800 text-white text-sm px-4 py-3 rounded-xl shadow-lg flex items-center gap-2">
          <Icon name="check-circle" className="w-4 h-4 text-emerald-400" />
          {toast}
        </div>
      )}

      {/* Detail Modal */}
      {selected && (
        <DetailModal
          pengajuan={selected}
          dosenList={dosenList}
          onClose={() => setSelected(null)}
          onTetapkan={handleTetapkan}
          onSahkan={handleSahkan}
        />
      )}

      {/* Top Bar */}
      <Topbar
        icon={<Icon name="user-check" className="w-5 h-5" />}
        title="Pengajuan Dosen Pembimbing"
        subtitle="Kelola penunjukan & pengesahan dosen pembimbing"
        iconBg="bg-blue-50"
        iconBorder="border-blue-200"
        iconColor="text-blue-600"
        rightSlot={
          <button className="flex items-center gap-2 px-4 py-2 border border-blue-300 rounded-xl text-blue-600 text-[12.5px] font-semibold bg-transparent transition-all duration-150 hover:bg-blue-500 hover:text-white hover:border-blue-500 cursor-pointer">
            <div className="w-6 h-6 rounded-lg bg-blue-100 border border-blue-200 flex items-center justify-center flex-shrink-0">
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 9.5L12 3l9 6.5" />
                <path d="M5 9v11a1 1 0 0 0 1 1h3v-7h6v7h3a1 1 0 0 0 1-1V9" />
              </svg>
            </div>
            Back to homepage
          </button>
        }
      />

      {/* Stat strip — ledger, warna tetap sama */}
      <div className="px-6 pt-4">
        <div className="grid grid-cols-2 sm:grid-cols-5 bg-white border border-slate-200 rounded-2xl overflow-hidden">
          <StatCard label="Total Pengajuan" value={counts.total}       icon="users"        color="text-slate-700" />
          <StatCard label="Perlu Ditunjuk"  value={counts.perluTunjuk} icon="clock"        color="text-amber-600" />
          <StatCard label="Perlu Disahkan"  value={counts.perluSahkan} icon="check-circle" color="text-sky-600" />
          <StatCard label="Ditolak Dosen"   value={counts.ditolak}     icon="x-circle"     color="text-red-500" />
          <StatCard label="Bimbingan Aktif" value={counts.aktif}       icon="check-circle" color="text-emerald-600" isLast />
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 px-6 py-4">
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">

          {/* Toolbar */}
          <div className="px-5 py-3.5 border-b border-slate-100 space-y-3">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="text-[13.5px] font-bold text-slate-800 font-display">Daftar Pengajuan</span>
                <span className="text-[11px] text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full font-medium font-mono">{filtered.length}</span>
              </div>
              <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 w-52 focus-within:border-blue-300 transition-colors">
                <Icon name="search" className="w-3.5 h-3.5 text-slate-400" />
                <input
                  className="border-none outline-none text-[12px] text-slate-700 bg-transparent w-full placeholder:text-slate-400"
                  placeholder="Cari mahasiswa..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>
            <div className="flex gap-1 flex-wrap">
              {FILTER_TABS.map((t) => (
                <button key={t.key} onClick={() => setFilterStatus(t.key)}
                  className={`px-3 py-1 rounded-lg text-[11.5px] font-medium transition-all ${
                    filterStatus === t.key ? "bg-blue-500 text-white" : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                  }`}>
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Table body */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr>
                  {["Mahasiswa", "Perusahaan / Posisi", "Dosen Usulan", "Dosen Berjalan", "Status", "Tgl Pengajuan", "Aksi"].map((h) => (
                    <th key={h} className="text-left text-[10.5px] font-bold tracking-widest uppercase text-slate-400 px-4 py-3 bg-slate-50 border-b border-slate-100 whitespace-nowrap font-mono">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-14 text-[13px] text-slate-400">
                      <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-3">
                        <Icon name="users" className="w-6 h-6 text-slate-300" />
                      </div>
                      Tidak ada pengajuan ditemukan
                    </td>
                  </tr>
                ) : filtered.map((p, i) => {
                  const sc = STATUS_CONFIG[p.status] || {};
                  const mahasiswaNama = p.mahasiswa?.user?.name || "-";
                  const [bg, text, border] = avColor(p.mahasiswa?.id || i);
                  const dosenUsulan     = p.dosenUsulan?.user?.name || "—";
                  const dosenDitetapkan = p.dosenDitetapkan?.user?.name || null;
                  const needsAction     = ["MENUNGGU_VERIFIKASI_PRODI", "DITOLAK_DOSEN", "MENUNGGU_PENGESAHAN_ADMIN"].includes(p.status);
                  return (
                    <tr key={p.id} className="hover:bg-slate-50 transition-colors group">
                      <td className="px-4 py-3 border-b border-slate-50">
                        <div className="flex items-center gap-2.5">
                          <div className={`w-8 h-8 rounded-lg border flex items-center justify-center text-[10px] font-bold flex-shrink-0 ${bg} ${text} ${border}`}>
                            {initials(mahasiswaNama)}
                          </div>
                          <div>
                            <div className="text-[12.5px] font-semibold text-slate-800">{mahasiswaNama}</div>
                            <div className="text-[11px] text-slate-400 font-mono">{p.mahasiswa?.nim || "-"}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 border-b border-slate-50">
                        <div className="text-[12.5px] text-slate-700">{p.lamaran?.lowongan?.perusahaan?.nama || "-"}</div>
                        <div className="text-[11px] text-slate-400">{p.lamaran?.lowongan?.posisi || "-"}</div>
                      </td>
                      <td className="px-4 py-3 border-b border-slate-50 text-[12.5px] text-slate-600">{dosenUsulan}</td>
                      <td className="px-4 py-3 border-b border-slate-50">
                        {dosenDitetapkan
                          ? <span className="text-[12.5px] font-medium text-emerald-700">{dosenDitetapkan}</span>
                          : <span className="text-[11.5px] text-slate-400 italic">Belum ditunjuk</span>}
                      </td>
                      <td className="px-4 py-3 border-b border-slate-50">
                        <div className="flex items-center gap-1.5">
                          <div className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />
                          <span className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${sc.badge}`}>{sc.label}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 border-b border-slate-50 text-[11.5px] text-slate-500 whitespace-nowrap font-mono">
                        {formatDate(p.createdAt)}
                      </td>
                      <td className="px-4 py-3 border-b border-slate-50">
                        <button onClick={() => setSelected(p)}
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11.5px] font-semibold border transition-colors ${
                            needsAction
                              ? "bg-blue-500 text-white border-blue-500 hover:bg-blue-600"
                              : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                          }`}>
                          {needsAction
                            ? <><Icon name="user-check" className="w-3.5 h-3.5" />{p.status === "MENUNGGU_PENGESAHAN_ADMIN" ? "Sahkan" : "Tunjuk"}</>
                            : "Detail"}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}