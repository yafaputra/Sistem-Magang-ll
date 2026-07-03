"use client";

import { useState, useRef } from "react";

// ─── Icons ────────────────────────────────────────────────────────────────────

function IconUpload() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="16 16 12 12 8 16" />
      <line x1="12" y1="12" x2="12" y2="21" />
      <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" />
    </svg>
  );
}

function IconFile() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" />
      <polyline points="13 2 13 9 20 9" />
    </svg>
  );
}

function IconX({ size = 12 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

function IconCheck() {
  return (
    <svg width="10" height="10" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function IconPencil() {
  return (
    <svg width="10" height="10" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  );
}

function IconClock() {
  return (
    <svg width="10" height="10" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

function IconPlus() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}

function IconArrowLeft() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="19" y1="12" x2="5" y2="12" />
      <polyline points="12 19 5 12 12 5" />
    </svg>
  );
}

function IconChevronLeft() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="15 18 9 12 15 6" />
    </svg>
  );
}

function IconChevronRight() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}

function IconSend() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="22" y1="2" x2="11" y2="13" />
      <polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
  );
}

function IconTrendUp() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
      <polyline points="17 6 23 6 23 12" />
    </svg>
  );
}

function IconLayers() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 2 7 12 12 22 7 12 2" />
      <polyline points="2 17 12 22 22 17" />
      <polyline points="2 12 12 17 22 12" />
    </svg>
  );
}

// ─── Constants ────────────────────────────────────────────────────────────────

const STATUSES = ["Belum Dikerjakan", "Sedang Dikerjakan", "Selesai"];

const REVISION_STATUSES = [
  { value: "revision", label: "Perlu revisi" },
  { value: "approved", label: "Disetujui" },
  { value: "pending",  label: "Menunggu review" },
  { value: "rejected", label: "Ditolak" },
];

const initialChapters = [
  { id: 1, title: "Pendahuluan",               status: "Selesai" },
  { id: 2, title: "Tinjauan Pustaka",           status: "Selesai" },
  { id: 3, title: "Metodologi dan Pelaksanaan", status: "Sedang Dikerjakan" },
  { id: 4, title: "Hasil dan Pembahasan",       status: "Belum Dikerjakan" },
  { id: 5, title: "Penutup dan Kesimpulan",     status: "Belum Dikerjakan" },
];

const initialRevisions = [
  {
    id: 1,
    status: "approved",
    note: "Pendahuluan sudah sesuai, latar belakang diperjelas dengan baik.",
    date: "10 Jun 2025",
  },
  {
    id: 2,
    status: "revision",
    note: "Bab metodologi perlu menambahkan diagram alur penelitian.",
    date: "18 Jun 2025",
  },
  {
    id: 3,
    status: "pending",
    note: "Menunggu review hasil dan pembahasan dari pembimbing.",
    date: "23 Jun 2025",
  },
];

const REV_PER_PAGE = 3;

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDate(date) {
  const months = ["Jan","Feb","Mar","Apr","Mei","Jun","Jul","Ags","Sep","Okt","Nov","Des"];
  return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
}

function revisionStatusMeta(status) {
  switch (status) {
    case "approved": return { label: "Disetujui",       color: "text-[#0F6E56]", bg: "bg-[#E1F5EE]", bar: "#0F6E56" };
    case "revision": return { label: "Perlu revisi",    color: "text-[#534AB7]", bg: "bg-[#EEEDFE]", bar: "#534AB7" };
    case "rejected": return { label: "Ditolak",         color: "text-[#A32D2D]", bg: "bg-[#FCEBEB]", bar: "#A32D2D" };
    default:         return { label: "Menunggu review", color: "text-[#854F0B]", bg: "bg-[#FDF3E3]", bar: "#854F0B" };
  }
}

function chapterBadge(status) {
  switch (status) {
    case "Selesai":           return { bg: "bg-[#E1F5EE]", text: "text-[#0F6E56]" };
    case "Sedang Dikerjakan": return { bg: "bg-[#EEEDFE]", text: "text-[#534AB7]" };
    default:                  return { bg: "bg-[#F1EFE8]", text: "text-[#888780]" };
  }
}

function RevisionIcon({ status }) {
  if (status === "approved") return <IconCheck />;
  if (status === "revision") return <IconPencil />;
  if (status === "rejected") return <IconX size={10} />;
  return <IconClock />;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatCard({ icon, label, color, value, subtext }) {
  return (
    <div className="bg-white border border-[#e8e8f0] rounded-2xl p-4 flex flex-col gap-3">
      <div className="flex items-center gap-1.5" style={{ color }}>
        {icon}
        <span className="text-[10.5px] font-semibold uppercase tracking-widest">{label}</span>
      </div>
      <div>
        <span className="text-[26px] font-semibold text-[#1e1e2e] leading-none">{value}</span>
      </div>
      <span className="text-[11.5px] text-[#9898b0]">{subtext}</span>
    </div>
  );
}

function ChapterItem({ chapter, onCycle }) {
  const { bg, text } = chapterBadge(chapter.status);
  return (
    <div
      onClick={() => onCycle(chapter.id)}
      className="flex items-center gap-2.5 px-3 py-2.5 border border-[#e8e8f0] rounded-lg cursor-pointer hover:border-[#b5aef5] hover:bg-[#faf9ff] transition-all select-none"
    >
      <div className="w-7 h-7 rounded-md bg-[#EEEDFE] flex items-center justify-center text-[11px] font-medium text-[#534AB7] flex-shrink-0">
        {chapter.id}
      </div>
      <span className="flex-1 text-[13px] text-[#1e1e2e]">{chapter.title}</span>
      <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full whitespace-nowrap ${bg} ${text}`}>
        {chapter.status}
      </span>
    </div>
  );
}

function LaporanCard({ revision, nomor }) {
  const meta = revisionStatusMeta(revision.status);
  return (
    <div
      className="flex items-center gap-3 bg-white border border-[#e8e8f0] rounded-xl pl-3.5 pr-3 py-3"
      style={{ borderLeft: `3px solid ${meta.bar}` }}
    >
      <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${meta.bg} ${meta.color}`}>
        <RevisionIcon status={revision.status} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[13px] font-medium text-[#1e1e2e] truncate">Revisi ke-{nomor}</p>
        <p className="text-[11px] text-[#9898b0] truncate mt-0.5">{revision.note}</p>
      </div>
      <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
        <span className="text-[10.5px] text-[#b0b0c8] whitespace-nowrap">{revision.date}</span>
        <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full whitespace-nowrap ${meta.bg} ${meta.color}`}>
          {meta.label}
        </span>
      </div>
    </div>
  );
}

function ArrowPagination({ page, totalPages, onChange }) {
  if (totalPages <= 1) return null;
  return (
    <div className="flex items-center justify-center gap-2 pt-1">
      <button
        onClick={() => onChange(page - 1)}
        disabled={page === 1}
        aria-label="Halaman sebelumnya"
        className={`w-8 h-8 rounded-lg border flex items-center justify-center transition-all
          ${page === 1
            ? "border-[#eceCF4] text-[#d2d2e4] cursor-not-allowed"
            : "border-[#e0e0f0] text-[#6e6e8a] hover:border-[#534AB7] hover:text-[#534AB7] hover:bg-[#faf9ff] cursor-pointer"}`}
      >
        <IconChevronLeft />
      </button>
      <span className="text-[11px] text-[#9898b0] px-1 tabular-nums">
        {page} / {totalPages}
      </span>
      <button
        onClick={() => onChange(page + 1)}
        disabled={page === totalPages}
        aria-label="Halaman berikutnya"
        className={`w-8 h-8 rounded-lg border flex items-center justify-center transition-all
          ${page === totalPages
            ? "border-[#eceCF4] text-[#d2d2e4] cursor-not-allowed"
            : "border-[#e0e0f0] text-[#6e6e8a] hover:border-[#534AB7] hover:text-[#534AB7] hover:bg-[#faf9ff] cursor-pointer"}`}
      >
        <IconChevronRight />
      </button>
    </div>
  );
}

function Toast({ toast }) {
  if (!toast) return null;
  const isError = toast.type === "error";
  return (
    <div className={`fixed bottom-6 left-1/2 -translate-x-1/2 px-5 py-2.5 rounded-xl text-[12px] font-medium shadow-md z-50 border whitespace-nowrap transition-all
      ${isError
        ? "bg-[#FCEBEB] text-[#A32D2D] border-[#F09595]"
        : "bg-[#E1F5EE] text-[#0F6E56] border-[#5DCAA5]"}`}>
      {toast.msg}
    </div>
  );
}

function Modal({ open, onClose, onSave }) {
  const [status, setStatus] = useState("revision");
  const [note, setNote]     = useState("");

  const handleSave = () => {
    if (!note.trim()) return;
    onSave({ status, note });
    setNote("");
    setStatus("revision");
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4">
      <div className="bg-white border border-[#e8e8f0] rounded-2xl p-5 w-[300px]">
        <p className="text-[14px] font-medium text-[#1e1e2e] mb-4">Tambah catatan revisi</p>
        <div className="mb-3">
          <label className="text-[11px] text-[#6e6e8a] font-medium block mb-1.5">Status</label>
          <select
            value={status}
            onChange={e => setStatus(e.target.value)}
            className="w-full px-3 py-2 border border-[#e0e0f0] rounded-lg text-[13px] text-[#1e1e2e] bg-white outline-none focus:border-[#534AB7] transition-colors"
          >
            {REVISION_STATUSES.map(s => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label className="text-[11px] text-[#6e6e8a] font-medium block mb-1.5">Catatan</label>
          <textarea
            value={note}
            onChange={e => setNote(e.target.value)}
            placeholder="Catatan dari pembimbing…"
            rows={3}
            className="w-full px-3 py-2 border border-[#e0e0f0] rounded-lg text-[13px] text-[#1e1e2e] bg-white outline-none focus:border-[#534AB7] transition-colors resize-none placeholder:text-[#c0c0d8]"
          />
        </div>
        <div className="flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 py-2 border border-[#e0e0f0] rounded-lg text-[12px] text-[#6e6e8a] bg-transparent cursor-pointer hover:bg-[#f5f5fa] transition-colors"
          >
            Batal
          </button>
          <button
            onClick={handleSave}
            className="flex-1 py-2 bg-[#534AB7] rounded-lg text-[12px] font-medium text-white border-none cursor-pointer hover:bg-[#3C3489] transition-colors"
          >
            Simpan
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function LaporanAkhir() {
  const [judul, setJudul]         = useState("");
  const [chapters, setChapters]   = useState(initialChapters);
  const [files, setFiles]         = useState([]);
  const [dragging, setDragging]   = useState(false);
  const [revisions, setRevisions] = useState(initialRevisions);
  const [revPage, setRevPage]     = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [toast, setToast]         = useState(null);
  const fileRef = useRef();

  const completedChapters = chapters.filter(c => c.status === "Selesai").length;
  const progress = Math.round((completedChapters / chapters.length) * 100);

  const cycleStatus = (id) => {
    setChapters(prev => prev.map(c => {
      if (c.id !== id) return c;
      const idx = STATUSES.indexOf(c.status);
      return { ...c, status: STATUSES[(idx + 1) % STATUSES.length] };
    }));
  };

  const addFiles = (incoming) => {
    const list = Array.from(incoming).map(f => ({ name: f.name, id: Date.now() + Math.random() }));
    setFiles(prev => [...prev, ...list]);
  };

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 2800);
  };

  const handleDraft = () => {
    if (!judul.trim()) { showToast("Isi judul terlebih dahulu.", "error"); return; }
    showToast("Disimpan sebagai draft.");
  };

  const handleKirim = () => {
    if (!judul.trim()) { showToast("Isi judul terlebih dahulu.", "error"); return; }
    if (progress < 100) { showToast("Selesaikan semua bab terlebih dahulu.", "error"); return; }
    showToast("Laporan berhasil dikirim!");
  };

  const handleSaveRevision = ({ status, note }) => {
    setRevisions(prev => [
      ...prev,
      { id: Date.now(), status, note, date: formatDate(new Date()) },
    ]);
    setModalOpen(false);
    setRevPage(1); // catatan baru selalu muncul di halaman pertama
  };

  const totalApproved = revisions.filter(r => r.status === "approved").length;
  const totalPending  = revisions.filter(r => r.status === "pending").length;

  // Riwayat laporan terbaru di atas, dengan penomoran tetap stabil lintas halaman
  const revisionsNewestFirst = [...revisions].reverse().map((r, i) => ({
    ...r,
    nomor: revisions.length - i,
  }));
  const revTotalPages = Math.max(1, Math.ceil(revisionsNewestFirst.length / REV_PER_PAGE));
  const safeRevPage = Math.min(revPage, revTotalPages);
  const revisionsPage = revisionsNewestFirst.slice(
    (safeRevPage - 1) * REV_PER_PAGE,
    safeRevPage * REV_PER_PAGE
  );

  return (
    <div className="min-h-screen bg-[#f5f5fa] font-[Inter,system-ui,sans-serif]">

      {/* Topbar */}
      <div className="flex items-center justify-between px-6 py-3.5 bg-white border-b border-[#e8e8f0]">
        <div className="flex items-center gap-2.5">
          <div className="w-2 h-2 rounded-full bg-[#534AB7]" />
          <span className="text-[15px] font-medium text-[#1e1e2e]">Portal Magang</span>
        </div>
        <button className="flex items-center gap-1.5 px-3.5 py-1.5 border border-[#e0e0f0] rounded-lg text-[#6e6e8a] text-[12px] bg-transparent cursor-pointer hover:bg-[#f5f5fa] hover:text-[#1e1e2e] transition-all">
          <IconArrowLeft />
          Kembali
        </button>
      </div>

      {/* Stat cards */}
      <div className="px-5 pt-5 max-w-4xl mx-auto">
        <div className="grid grid-cols-4 gap-4">
          <StatCard
            icon={<IconLayers />}
            label="Bab Selesai"
            color="#534AB7"
            value={`${completedChapters}/${chapters.length}`}
            subtext={`${progress}% dari total bab`}
          />
          <StatCard
            icon={<IconTrendUp />}
            label="Progres Laporan"
            color="#0F6E56"
            value={`${progress}%`}
            subtext={progress < 100 ? "Sedang berjalan" : "Laporan lengkap"}
          />
          <StatCard
            icon={<IconFile />}
            label="Total Revisi"
            color="#854F0B"
            value={revisions.length}
            subtext={`${totalApproved} sudah disetujui`}
          />
          <StatCard
            icon={<IconSend />}
            label="Menunggu Review"
            color="#A32D2D"
            value={totalPending}
            subtext="Dari dosen pembimbing"
          />
        </div>
      </div>

      {/* Grid */}
      <div className="p-5 grid grid-cols-2 gap-4 max-w-4xl mx-auto">

        {/* ── LEFT: Laporan ── */}
        <div className="bg-white border border-[#e8e8f0] rounded-2xl p-5 flex flex-col gap-4">
          <p className="text-[11px] font-medium text-[#9898b0] uppercase tracking-widest">
            Laporan hasil magang
          </p>

          {/* Judul */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] font-medium text-[#6e6e8a]">Judul laporan</label>
            <input
              type="text"
              value={judul}
              onChange={e => setJudul(e.target.value)}
              placeholder="Masukkan judul laporan…"
              className="w-full px-3 py-2 border border-[#e0e0f0] rounded-lg text-[13px] text-[#1e1e2e] bg-white outline-none focus:border-[#534AB7] transition-colors placeholder:text-[#c0c0d8]"
            />
          </div>

          {/* Struktur Bab */}
          <div className="flex flex-col gap-2">
            <div>
              <label className="text-[12px] font-medium text-[#6e6e8a]">Struktur bab</label>
              <p className="text-[11px] text-[#b0b0c8] mt-0.5">Klik bab untuk mengubah status</p>
            </div>
            {chapters.map(ch => (
              <ChapterItem key={ch.id} chapter={ch} onCycle={cycleStatus} />
            ))}
          </div>

          {/* Upload */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] font-medium text-[#6e6e8a]">Dokumen laporan</label>
            <div
              onClick={() => fileRef.current?.click()}
              onDragOver={e => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onDrop={e => { e.preventDefault(); setDragging(false); addFiles(e.dataTransfer.files); }}
              className={`min-h-[72px] border border-dashed rounded-xl flex flex-col items-center justify-center gap-1 cursor-pointer transition-all
                ${dragging
                  ? "border-[#534AB7] bg-[#EEEDFE]"
                  : "border-[#d8d8ec] bg-[#fafafa] hover:border-[#534AB7] hover:bg-[#faf9ff]"}`}
            >
              <span className={dragging ? "text-[#534AB7]" : "text-[#c0c0d8]"}>
                <IconUpload />
              </span>
              <span className="text-[11px] text-[#b0b0c8]">Klik atau seret file ke sini</span>
              <input ref={fileRef} type="file" multiple className="hidden" onChange={e => addFiles(e.target.files)} />
            </div>

            {files.length > 0 && (
              <div className="flex flex-col gap-1 mt-0.5">
                {files.map(f => (
                  <div key={f.id} className="flex items-center gap-2 px-3 py-1.5 bg-[#EEEDFE] rounded-lg text-[11px] text-[#534AB7]">
                    <IconFile />
                    <span className="flex-1 truncate">{f.name}</span>
                    <button
                      onClick={() => setFiles(prev => prev.filter(x => x.id !== f.id))}
                      className="text-[#AFA9EC] hover:text-[#D85A30] transition-colors bg-transparent border-none cursor-pointer p-0"
                      aria-label="Hapus file"
                    >
                      <IconX size={11} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Progress */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <label className="text-[12px] font-medium text-[#6e6e8a]">Progres penulisan</label>
              <span className="text-[12px] font-medium text-[#534AB7]">{progress}%</span>
            </div>
            <div className="h-1.5 bg-[#f0f0f8] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#534AB7] rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2.5">
            <button
              onClick={handleDraft}
              className="flex-1 py-2.5 border border-[#e0e0f0] rounded-xl text-[#6e6e8a] text-[13px] bg-transparent cursor-pointer hover:border-[#534AB7] hover:text-[#534AB7] hover:bg-[#faf9ff] transition-all"
            >
              Simpan draft
            </button>
            <button
              onClick={handleKirim}
              className="flex-1 py-2.5 bg-[#534AB7] rounded-xl text-white text-[13px] font-medium border-none cursor-pointer hover:bg-[#3C3489] transition-colors"
            >
              Kirim laporan
            </button>
          </div>
        </div>

        {/* ── RIGHT: Riwayat Laporan ── */}
        <div className="bg-white border border-[#e8e8f0] rounded-2xl p-5 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-medium text-[#9898b0] uppercase tracking-widest">
              Riwayat laporan
            </p>
            <span className="text-[11px] text-[#b0b0c8]">
              {revisions.length} dari {revisions.length} laporan
            </span>
          </div>

          {/* Summary stats */}
          <div className="grid grid-cols-3 gap-2">
            {[
              { label: "Total revisi", value: revisions.length, color: "text-[#534AB7]" },
              { label: "Disetujui",    value: totalApproved,    color: "text-[#0F6E56]" },
              { label: "Menunggu",     value: totalPending,     color: "text-[#854F0B]" },
            ].map(s => (
              <div key={s.label} className="bg-[#f5f5fa] rounded-xl p-3 flex flex-col gap-0.5">
                <span className={`text-[20px] font-medium leading-none ${s.color}`}>{s.value}</span>
                <span className="text-[11px] text-[#9898b0] mt-1">{s.label}</span>
              </div>
            ))}
          </div>

          {/* Daftar laporan (dipaginasi) */}
          <div className="flex flex-col gap-2 flex-1">
            {revisionsPage.map(rev => (
              <LaporanCard key={rev.id} revision={rev} nomor={rev.nomor} />
            ))}
          </div>

          {/* Pagination — hanya tombol panah, muncul setelah lebih dari 3 laporan */}
          <ArrowPagination
            page={safeRevPage}
            totalPages={revTotalPages}
            onChange={setRevPage}
          />

          {/* Add revision */}
          <button
            onClick={() => setModalOpen(true)}
            className="flex items-center justify-center gap-1.5 py-2 border border-dashed border-[#d8d8ec] rounded-xl text-[12px] text-[#9898b0] bg-transparent cursor-pointer hover:border-[#534AB7] hover:text-[#534AB7] hover:bg-[#faf9ff] transition-all"
          >
            <IconPlus />
            Tambah catatan revisi
          </button>
        </div>
      </div>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSaveRevision}
      />

      <Toast toast={toast} />
    </div>
  );
}