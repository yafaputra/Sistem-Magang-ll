"use client";

import { useMemo, useState } from "react";
import Topbar from "../../components/topbar";

// ═══════════════════════════════════════════════════════════════════════════
// Halaman Admin Prodi — Validasi & Penetapan SKS Konversi Magang
// Konsisten dengan Konversi SKS Mahasiswa & Dosen Pembimbing:
// Fraunces + IBM Plex Mono, palet blue/emerald/amber/rose.
// ═══════════════════════════════════════════════════════════════════════════

const FONTS = `
@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600;9..144,700&family=IBM+Plex+Mono:wght@400;500;600&display=swap');
.font-display { font-family: 'Fraunces', 'Georgia', serif; }
.font-mono { font-family: 'IBM Plex Mono', 'Courier New', monospace; }
`;

const STATUS_CONFIG = {
  menunggu_dosen: { label: "Menunggu Review Dosen",   dot: "bg-amber-500",   cls: "bg-amber-50 text-amber-700 border-amber-200",  accent: "#D97706" },
  menunggu_prodi: { label: "Menunggu Validasi Prodi", dot: "bg-blue-500",    cls: "bg-blue-50 text-blue-700 border-blue-200",     accent: "#2563EB" },
  disetujui:      { label: "Disetujui",               dot: "bg-emerald-500",cls: "bg-emerald-50 text-emerald-700 border-emerald-200", accent: "#059669" },
  ditolak:        { label: "Ditolak",                 dot: "bg-rose-400",   cls: "bg-rose-50 text-rose-700 border-rose-200",     accent: "#E11D48" },
};

const AVATAR_COLORS = [
  { bg: "bg-blue-50", text: "text-blue-600" },
  { bg: "bg-emerald-50", text: "text-emerald-700" },
  { bg: "bg-amber-50", text: "text-amber-600" },
  { bg: "bg-rose-50", text: "text-rose-600" },
  { bg: "bg-slate-100", text: "text-slate-600" },
];

// ── Mock data: hanya pengajuan yang sudah direkomendasikan dosen (menunggu_prodi)
// dan yang sudah selesai (disetujui/ditolak) untuk keperluan rekap ────────────
const MOCK_DATA = [
  {
    id: 1,
    mahasiswa: "Rizky Pratama",
    nim: "21/112233/TK/00099",
    prodi: "Teknik Informatika",
    dosenPembimbing: "Dr. Andi Wijaya, S.Kom., M.T.",
    pengajuan: {
      id: 103,
      tanggalPengajuan: "14 Jan 2026",
      perusahaan: "PT Data Cipta Solusi",
      posisi: "Data Analyst Intern",
      periode: "1 Jul 2025 – 31 Des 2025",
      totalJam: 640,
      status: "menunggu_prodi",
      jumlahSks: null,
      catatanDosen: "Kegiatan relevan dengan capaian pembelajaran, direkomendasikan penuh.",
      catatanAdmin: "",
      dokumen: { sertifikat: "sertifikat_rizky.pdf", laporan: "laporan_akhir_rizky.pdf", penilaian: "penilaian_perusahaan_rizky.pdf" },
    },
  },
  {
    id: 2,
    mahasiswa: "Nadia Kusuma",
    nim: "22/145678/TK/00145",
    prodi: "Sistem Informasi",
    dosenPembimbing: "Dr. Sinta Marlina, S.T., M.Kom.",
    pengajuan: {
      id: 105,
      tanggalPengajuan: "10 Jan 2026",
      perusahaan: "PT Solusi Digital Indonesia",
      posisi: "QA Engineer Intern",
      periode: "1 Jun 2025 – 30 Nov 2025",
      totalJam: 700,
      status: "menunggu_prodi",
      jumlahSks: null,
      catatanDosen: "Laporan lengkap, kegiatan sesuai dengan bidang keilmuan.",
      catatanAdmin: "",
      dokumen: { sertifikat: "sertifikat_nadia.pdf", laporan: "laporan_akhir_nadia.pdf", penilaian: "penilaian_perusahaan_nadia.pdf" },
    },
  },
  {
    id: 3,
    mahasiswa: "Budi Santoso",
    nim: "22/123456/TK/00123",
    prodi: "Teknik Informatika",
    dosenPembimbing: "Dr. Andi Wijaya, S.Kom., M.T.",
    pengajuan: {
      id: 102,
      tanggalPengajuan: "12 Nov 2025",
      perusahaan: "PT Data Cipta Solusi",
      posisi: "Data Analyst Intern",
      periode: "1 Jul 2025 – 31 Des 2025",
      totalJam: 640,
      status: "disetujui",
      jumlahSks: 20,
      catatanDosen: "Kegiatan relevan dengan capaian pembelajaran, direkomendasikan penuh.",
      catatanAdmin: "Dokumen lengkap dan valid. SKS disetujui sesuai rekomendasi dosen.",
      dokumen: { sertifikat: "sertifikat_budi2.pdf", laporan: "laporan_akhir_budi2.pdf", penilaian: "penilaian_perusahaan_budi2.pdf" },
    },
  },
  {
    id: 4,
    mahasiswa: "Aulia Rahma",
    nim: "23/199001/TK/00201",
    prodi: "Sistem Informasi",
    dosenPembimbing: "Dr. Sinta Marlina, S.T., M.Kom.",
    pengajuan: {
      id: 104,
      tanggalPengajuan: "02 Jun 2025",
      perusahaan: "CV Kreasi Digital",
      posisi: "UI/UX Intern",
      periode: "1 Feb 2025 – 30 Apr 2025",
      totalJam: 320,
      status: "ditolak",
      jumlahSks: 0,
      catatanDosen: "Durasi magang kurang dari minimum 3 bulan penuh sesuai ketentuan prodi.",
      catatanAdmin: "",
      dokumen: { sertifikat: "sertifikat_aulia.pdf", laporan: "laporan_akhir_aulia.pdf", penilaian: null },
    },
  },
];

// ── Icons ─────────────────────────────────────────────────────────────────────
function Icon({ name, className = "w-4 h-4", stroke = "currentColor" }) {
  const paths = {
    home:      <><path d="M3 9.5L12 3l9 6.5"/><path d="M5 9v11a1 1 0 0 0 1 1h3v-7h6v7h3a1 1 0 0 0 1-1V9"/></>,
    layers:    <><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></>,
    close:     <><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>,
    list:      <><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></>,
    check:     <><polyline points="20 6 9 17 4 12"/></>,
    x:         <><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>,
    eye:       <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></>,
    clock:     <><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></>,
    info:      <><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></>,
    file:      <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></>,
    search:    <><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></>,
    alert:     <><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></>,
    download:  <><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></>,
    barchart:  <><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/><line x1="2" y1="20" x2="22" y2="20"/></>,
  };
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      {paths[name]}
    </svg>
  );
}

function getInitials(name) {
  return name.split(" ").slice(0, 2).map((n) => n[0]).join("").toUpperCase();
}

function Avatar({ name, index = 0 }) {
  const c = AVATAR_COLORS[index % AVATAR_COLORS.length];
  return (
    <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-[12px] flex-shrink-0 ${c.bg} ${c.text}`}>
      {getInitials(name)}
    </div>
  );
}

function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status];
  return (
    <span className={`font-mono inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wide border whitespace-nowrap ${cfg.cls}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
}

function StatCell({ label, value, icon, accent, sub, last }) {
  return (
    <div
      className={[
        "px-5 py-5 flex flex-col gap-2 transition-colors duration-150 hover:bg-slate-50",
        "border-r border-dashed border-slate-200",
        last ? "sm:border-r-0" : "",
        "max-[900px]:border-r-0 max-[900px]:border-b max-[900px]:border-dashed",
      ].join(" ")}
    >
      <div className="flex items-center gap-1.5">
        <Icon name={icon} className="w-3.5 h-3.5" stroke={accent} />
        <span className="font-mono text-[9.5px] uppercase tracking-[0.12em] font-semibold" style={{ color: accent }}>{label}</span>
      </div>
      <span className="font-display text-[28px] font-semibold leading-none tracking-tight text-slate-800">{value}</span>
      {sub && <span className="text-[10.5px] text-slate-400">{sub}</span>}
    </div>
  );
}

// ─── Validasi Modal ───────────────────────────────────────────────────────────
function ValidasiModal({ row, onClose, onSetujui, onTolak }) {
  const [sks, setSks] = useState("");
  const [catatan, setCatatan] = useState("");
  const [dokChecked, setDokChecked] = useState({ sertifikat: false, laporan: false, penilaian: false });
  if (!row) return null;
  const { pengajuan: p } = row;
  const isMenunggu = p.status === "menunggu_prodi";
  const semuaDokLengkap = Object.values(dokChecked).every(Boolean);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/30 backdrop-blur-sm px-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg border border-slate-200 overflow-hidden max-h-[88vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-dashed border-slate-200 flex-shrink-0">
          <h2 className="font-display text-[17px] font-semibold text-slate-800">Validasi konversi SKS</h2>
          <button onClick={onClose} className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-400 transition-colors">
            <Icon name="close" className="w-3 h-3" />
          </button>
        </div>

        <div className="px-5 py-4 overflow-y-auto space-y-4">
          <div className="flex items-center gap-3 px-4 py-3 bg-slate-50 rounded-xl border border-slate-100">
            <Avatar name={row.mahasiswa} />
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-bold text-slate-800">{row.mahasiswa}</p>
              <p className="text-[11px] text-slate-400 mt-0.5">{row.nim} · {row.prodi}</p>
            </div>
            <StatusBadge status={p.status} />
          </div>

          <div className="rounded-xl border border-slate-100 overflow-hidden">
            {[
              { label: "Dosen Pembimbing", value: row.dosenPembimbing },
              { label: "Perusahaan", value: p.perusahaan },
              { label: "Posisi", value: p.posisi },
              { label: "Periode Magang", value: p.periode },
              { label: "Total Jam", value: `${p.totalJam} jam` },
            ].map((r, i, arr) => (
              <div key={r.label} className={`flex justify-between items-center px-4 py-2.5 ${i < arr.length - 1 ? "border-b border-dashed border-slate-100" : ""}`}>
                <span className="font-mono text-[10.5px] uppercase tracking-wide text-slate-400">{r.label}</span>
                <span className="text-[13px] font-semibold text-slate-800 text-right max-w-[60%]">{r.value}</span>
              </div>
            ))}
          </div>

          <div>
            <p className="font-mono text-[10.5px] uppercase tracking-wide text-slate-400 mb-1.5">Catatan dosen pembimbing</p>
            <p className="text-[13px] text-slate-700 leading-relaxed bg-amber-50 border border-amber-100 rounded-xl px-3 py-2.5">{p.catatanDosen || "—"}</p>
          </div>

          <div>
            <p className="font-mono text-[10.5px] uppercase tracking-wide text-slate-400 mb-1.5">
              {isMenunggu ? "Verifikasi kelengkapan dokumen" : "Dokumen terlampir"}
            </p>
            <div className="flex flex-col gap-1.5">
              {[
                { key: "sertifikat", label: "Sertifikat Magang" },
                { key: "laporan", label: "Laporan Akhir" },
                { key: "penilaian", label: "Surat Penilaian Perusahaan" },
              ].map((d) => (
                <label key={d.key} className={`flex items-center gap-2.5 px-3 py-2 bg-slate-50 rounded-lg border border-slate-100 ${isMenunggu && p.dokumen[d.key] ? "cursor-pointer hover:border-blue-300" : ""}`}>
                  {isMenunggu && (
                    <input
                      type="checkbox"
                      disabled={!p.dokumen[d.key]}
                      checked={dokChecked[d.key]}
                      onChange={(e) => setDokChecked((prev) => ({ ...prev, [d.key]: e.target.checked }))}
                      className="w-3.5 h-3.5 accent-blue-600"
                    />
                  )}
                  <Icon name="file" className="w-3.5 h-3.5 text-slate-400" />
                  <span className="text-[12px] text-slate-600 flex-1 truncate">{d.label}</span>
                  {p.dokumen[d.key] ? (
                    <span className="text-[11px] font-mono text-blue-600">{p.dokumen[d.key]}</span>
                  ) : (
                    <span className="text-[11px] text-rose-400">tidak ada</span>
                  )}
                </label>
              ))}
            </div>
          </div>

          {isMenunggu ? (
            <>
              <div>
                <label className="block text-[12px] font-semibold text-slate-700 mb-1.5">Jumlah SKS yang dikonversi</label>
                <input
                  type="number" min={0} max={24}
                  value={sks}
                  onChange={(e) => setSks(e.target.value)}
                  placeholder="Contoh: 20"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-[13px] text-slate-800 outline-none focus:border-blue-400 placeholder:text-slate-300 transition-colors"
                />
              </div>
              <div>
                <label className="block text-[12px] font-semibold text-slate-700 mb-1.5">
                  Catatan admin prodi <span className="text-slate-400 font-normal">(wajib jika menolak)</span>
                </label>
                <textarea
                  rows={3}
                  value={catatan}
                  onChange={(e) => setCatatan(e.target.value)}
                  placeholder="Contoh: Dokumen lengkap dan valid, SKS disetujui sesuai rekomendasi dosen."
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-[13px] text-slate-800 outline-none resize-none focus:border-blue-400 placeholder:text-slate-300 transition-colors"
                />
              </div>
              {!semuaDokLengkap && (
                <div className="flex items-start gap-2 px-3.5 py-2.5 bg-amber-50 border border-amber-200 rounded-lg">
                  <Icon name="alert" className="w-3.5 h-3.5 text-amber-500 mt-0.5 flex-shrink-0" />
                  <p className="text-[11.5px] text-amber-700 leading-relaxed">Centang semua dokumen yang tersedia sebagai bukti telah diverifikasi sebelum menyetujui.</p>
                </div>
              )}
              <div className="flex gap-2.5 pt-1">
                <button
                  onClick={() => { if (!catatan.trim()) return; onTolak(row.id, catatan); onClose(); }}
                  disabled={!catatan.trim()}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-[13px] font-semibold border border-rose-300 text-rose-500 bg-white hover:bg-rose-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <Icon name="x" className="w-3.5 h-3.5" /> Tolak
                </button>
                <button
                  onClick={() => { if (!sks || !semuaDokLengkap) return; onSetujui(row.id, Number(sks), catatan || "Dokumen lengkap dan valid. SKS disetujui."); onClose(); }}
                  disabled={!sks || !semuaDokLengkap}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-[13px] font-semibold bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <Icon name="check" className="w-3.5 h-3.5" /> Setujui SKS
                </button>
              </div>
            </>
          ) : (
            <div>
              <p className="font-mono text-[10.5px] uppercase tracking-wide text-slate-400 mb-1.5">Catatan admin prodi</p>
              <p className="text-[13px] text-slate-700 leading-relaxed bg-blue-50 border border-blue-100 rounded-xl px-3 py-2.5">{p.catatanAdmin || "—"}</p>
              <div className={`mt-3 flex items-center gap-2 px-4 py-3 rounded-xl border text-[12.5px] font-medium ${
                p.status === "ditolak" ? "bg-rose-50 border-rose-200 text-rose-600" : "bg-emerald-50 border-emerald-200 text-emerald-700"
              }`}>
                <Icon name={p.status === "ditolak" ? "x" : "check"} className="w-3.5 h-3.5" />
                {p.status === "ditolak" ? "Pengajuan ini telah ditolak." : `Disetujui dengan ${p.jumlahSks} SKS.`}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function KonversiSKSAdminPage() {
  const [data, setData] = useState(MOCK_DATA);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("semua");
  const [filterProdi, setFilterProdi] = useState("Semua");
  const [target, setTarget] = useState(null);
  const [toast, setToast] = useState(null);

  function showToast(msg, type = "success") {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 4000);
  }

  const stats = useMemo(() => {
    const count = (s) => data.filter((d) => d.pengajuan.status === s).length;
    return {
      total: data.length,
      menungguProdi: count("menunggu_prodi"),
      disetujui: count("disetujui"),
      ditolak: count("ditolak"),
      totalSks: data.filter((d) => d.pengajuan.status === "disetujui").reduce((s, d) => s + (d.pengajuan.jumlahSks || 0), 0),
    };
  }, [data]);

  const prodiList = ["Semua", ...new Set(data.map((d) => d.prodi))];

  const filtered = data.filter((row) => {
    const q = search.toLowerCase();
    const matchSearch = row.mahasiswa.toLowerCase().includes(q) || row.nim.includes(q) || row.pengajuan.perusahaan.toLowerCase().includes(q);
    const matchStatus = filterStatus === "semua" || row.pengajuan.status === filterStatus;
    const matchProdi = filterProdi === "Semua" || row.prodi === filterProdi;
    return matchSearch && matchStatus && matchProdi;
  });

  function handleSetujui(rowId, sks, catatan) {
    setData((prev) => prev.map((r) => r.id === rowId ? { ...r, pengajuan: { ...r.pengajuan, status: "disetujui", jumlahSks: sks, catatanAdmin: catatan } } : r));
    showToast(`Konversi disetujui dengan ${sks} SKS.`);
    // Ganti dengan: PATCH `${API_URL}/api/admin/konversi-sks/${pengajuanId}/setujui`
  }

  function handleTolak(rowId, catatan) {
    setData((prev) => prev.map((r) => r.id === rowId ? { ...r, pengajuan: { ...r.pengajuan, status: "ditolak", jumlahSks: 0, catatanAdmin: catatan } } : r));
    showToast("Pengajuan ditolak oleh admin prodi.", "error");
    // Ganti dengan: PATCH `${API_URL}/api/admin/konversi-sks/${pengajuanId}/tolak`
  }

  const filterTabs = ["semua", "menunggu_prodi", "disetujui", "ditolak"];

  return (
    <div className="font-sans bg-slate-50 min-h-screen">
      <style>{FONTS}</style>

      {toast && (
        <div className={`fixed top-5 right-5 z-[100] flex items-center gap-2.5 px-4 py-3 rounded-xl border text-[13px] font-medium shadow-lg ${
          toast.type === "error" ? "bg-rose-50 border-rose-200 text-rose-600" : "bg-emerald-50 border-emerald-200 text-emerald-700"
        }`}>
          <Icon name={toast.type === "error" ? "x" : "check"} className="w-4 h-4" />
          {toast.msg}
        </div>
      )}

      <Topbar
        icon={<Icon name="layers" className="w-4 h-4" />}
        title="Validasi Konversi SKS — Admin Prodi"
        subtitle="Verifikasi dokumen, tetapkan SKS, dan kelola rekapitulasi konversi"
        rightSlot={
          <button
            onClick={() => window.history.back()}
            className="flex items-center gap-2 px-4 py-2 border border-blue-300 rounded-xl text-blue-600 text-[12.5px] font-semibold bg-transparent transition-all duration-150 hover:bg-blue-500 hover:text-white hover:border-blue-500 cursor-pointer"
          >
            <div className="w-6 h-6 rounded-lg bg-blue-100 border border-blue-200 flex items-center justify-center flex-shrink-0">
              <Icon name="home" className="w-3.5 h-3.5" />
            </div>
            Back to homepage
          </button>
        }
      />

      <div className="px-8 py-6 flex flex-col gap-5">

        {/* Stats */}
        <div className="grid grid-cols-5 max-[1100px]:grid-cols-2 bg-white border border-slate-200 rounded-2xl overflow-hidden">
          <StatCell label="Total Pengajuan"      value={stats.total}         icon="list"     accent="#2563EB" sub="Diteruskan dosen" />
          <StatCell label="Menunggu Validasi"    value={stats.menungguProdi} icon="clock"    accent={STATUS_CONFIG.menunggu_prodi.accent} sub="Perlu tindakan Anda" />
          <StatCell label="Disetujui"            value={stats.disetujui}     icon="check"    accent={STATUS_CONFIG.disetujui.accent} sub="SKS ditetapkan" />
          <StatCell label="Ditolak"               value={stats.ditolak}       icon="alert"    accent={STATUS_CONFIG.ditolak.accent} sub="Oleh admin prodi" />
          <StatCell label="Total SKS Terkonversi" value={stats.totalSks}      icon="barchart" accent="#7C3AED" sub="Akumulasi seluruh prodi" last />
        </div>

        {stats.menungguProdi > 0 && (
          <div className="flex items-start gap-2.5 px-4 py-3 bg-blue-50 rounded-xl border border-blue-200">
            <Icon name="info" className="w-3.5 h-3.5 text-blue-500 mt-0.5 flex-shrink-0" />
            <p className="text-[12px] text-blue-700 leading-relaxed">
              Terdapat <strong>{stats.menungguProdi} pengajuan</strong> yang sudah direkomendasikan dosen dan menunggu validasi dokumen serta penetapan SKS.
            </p>
          </div>
        )}

        {/* Table card */}
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-dashed border-slate-200 flex-wrap gap-3">
            <div className="flex items-center gap-2.5">
              <Icon name="list" className="w-4 h-4 text-blue-500" />
              <span className="font-display text-[15px] font-semibold text-slate-800">Rekapitulasi pengajuan konversi SKS</span>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <select
                value={filterProdi}
                onChange={(e) => setFilterProdi(e.target.value)}
                className="px-3 py-1.5 border border-slate-200 rounded-lg text-[12px] text-slate-600 bg-white outline-none focus:border-blue-400"
              >
                {prodiList.map((p) => <option key={p}>{p}</option>)}
              </select>
              <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg px-3 w-56">
                <Icon name="search" className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Cari mahasiswa, NIM..."
                  className="flex-1 py-1.5 bg-transparent text-[12.5px] text-slate-800 outline-none placeholder:text-slate-300"
                />
              </div>
              <button className="flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 rounded-lg text-[12px] text-slate-500 hover:text-blue-600 hover:border-blue-300 transition-colors">
                <Icon name="download" className="w-3.5 h-3.5" /> Ekspor
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2 px-6 py-3 border-b border-dashed border-slate-100 flex-wrap">
            {filterTabs.map((f) => (
              <button
                key={f}
                onClick={() => setFilterStatus(f)}
                className={`font-mono px-3.5 py-1.5 rounded-lg text-[11px] font-semibold uppercase tracking-wide transition-colors duration-150 ${
                  filterStatus === f ? "bg-blue-600 text-white" : "bg-slate-50 border border-slate-200 text-slate-400 hover:text-blue-600 hover:border-blue-300"
                }`}
              >
                {f === "semua" ? "Semua" : STATUS_CONFIG[f]?.label || f}
              </button>
            ))}
            <span className="ml-auto font-mono text-[10.5px] text-slate-400 tracking-wide">{filtered.length} DATA</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-[13px]">
              <thead>
                <tr className="border-y border-slate-200 bg-slate-50">
                  <th className="text-left px-6 py-3 font-mono text-[10px] font-semibold uppercase tracking-wider text-slate-400">Mahasiswa</th>
                  <th className="text-left px-4 py-3 font-mono text-[10px] font-semibold uppercase tracking-wider text-slate-400">Prodi</th>
                  <th className="text-left px-4 py-3 font-mono text-[10px] font-semibold uppercase tracking-wider text-slate-400">Dosen Pembimbing</th>
                  <th className="text-left px-4 py-3 font-mono text-[10px] font-semibold uppercase tracking-wider text-slate-400">Perusahaan</th>
                  <th className="text-center px-4 py-3 font-mono text-[10px] font-semibold uppercase tracking-wider text-slate-400">Status</th>
                  <th className="text-center px-4 py-3 font-mono text-[10px] font-semibold uppercase tracking-wider text-slate-400">SKS</th>
                  <th className="text-center px-4 py-3 font-mono text-[10px] font-semibold uppercase tracking-wider text-slate-400">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan={7} className="text-center py-10 text-slate-300 text-[13px]">Tidak ada data ditemukan.</td></tr>
                ) : (
                  filtered.map((row, i) => (
                    <tr key={row.id} className={`hover:bg-blue-50/40 transition-colors duration-100 ${i < filtered.length - 1 ? "border-b border-dashed border-slate-100" : ""}`}>
                      <td className="px-6 py-3.5">
                        <div className="flex items-center gap-2.5">
                          <Avatar name={row.mahasiswa} index={i} />
                          <div>
                            <p className="font-semibold text-slate-800">{row.mahasiswa}</p>
                            <p className="text-[11px] text-slate-400 mt-0.5">{row.nim}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3.5 text-slate-600">{row.prodi}</td>
                      <td className="px-4 py-3.5 text-slate-600">{row.dosenPembimbing}</td>
                      <td className="px-4 py-3.5">
                        <p className="text-slate-700">{row.pengajuan.perusahaan}</p>
                        <p className="text-[11px] text-slate-400 mt-0.5">{row.pengajuan.posisi}</p>
                      </td>
                      <td className="px-4 py-3.5 text-center"><StatusBadge status={row.pengajuan.status} /></td>
                      <td className="px-4 py-3.5 text-center">
                        {row.pengajuan.jumlahSks != null ? (
                          <span className="font-mono inline-flex items-center justify-center w-8 h-7 rounded-lg bg-blue-50 text-blue-700 text-[12px] font-semibold">{row.pengajuan.jumlahSks}</span>
                        ) : (
                          <span className="text-slate-300">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3.5 text-center">
                        <button
                          onClick={() => setTarget(row)}
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11.5px] font-semibold transition-colors ${
                            row.pengajuan.status === "menunggu_prodi"
                              ? "bg-blue-600 hover:bg-blue-700 text-white"
                              : "text-blue-600 hover:underline bg-transparent"
                          }`}
                        >
                          <Icon name="eye" className="w-3.5 h-3.5" /> {row.pengajuan.status === "menunggu_prodi" ? "Validasi" : "Lihat"}
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <ValidasiModal
        row={target}
        onClose={() => setTarget(null)}
        onSetujui={handleSetujui}
        onTolak={handleTolak}
      />
    </div>
  );
}