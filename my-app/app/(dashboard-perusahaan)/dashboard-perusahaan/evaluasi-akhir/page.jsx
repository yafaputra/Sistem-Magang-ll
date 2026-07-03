"use client";

import { useState, useCallback, useRef } from "react";

// ─── Konstanta ────────────────────────────────────────────────────────────────

const API_BASE = (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000") + "/api";

const TABS = [
  { key: "penilaian",  label: "Penilaian Mahasiswa" },
  { key: "sertifikat", label: "Upload Sertifikat" },
];

const NILAI_OPTIONS = ["", "A", "A-", "B+", "B", "B-", "C+", "C", "D", "E"];

const badgeNilai = {
  A: "bg-[#ccfbf3] text-[#0d9488]",
  "A-": "bg-[#d1fae5] text-[#059669]",
  "B+": "bg-[#dbeafe] text-[#2563eb]",
  B: "bg-[#dbeafe] text-[#2563eb]",
  "B-": "bg-[#e0e7ff] text-[#4f46e5]",
  "C+": "bg-[#faeeda] text-[#854f0b]",
  C: "bg-[#faeeda] text-[#d97706]",
  D: "bg-[#fee2e2] text-[#dc2626]",
  E: "bg-[#f0f0f8] text-[#6b6b80]",
};

const badgeSertifikat = {
  Terbit:  "bg-[#ccfbf3] text-[#0d9488]",
  Pending: "bg-[#faeeda] text-[#854f0b]",
  Belum:   "bg-[#f0f0f8] text-[#6b6b80]",
};

const avatarColors = [
  "bg-[#dbeafe] text-[#2563eb]",
  "bg-[#cffafe] text-[#0891b2]",
  "bg-[#fef3c7] text-[#d97706]",
  "bg-[#d1fae5] text-[#059669]",
  "bg-[#e0e7ff] text-[#4f46e5]",
];

// ─── API Helper ───────────────────────────────────────────────────────────────

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
    throw new Error("Tidak dapat terhubung ke server.");
  }
  const ct = res.headers.get("content-type") ?? "";
  if (!ct.includes("application/json")) throw new Error(`Server error ${res.status}`);
  const json = await res.json();
  if (!res.ok) throw new Error(json.message ?? `Error ${res.status}`);
  return json;
}

// ─── Icons ────────────────────────────────────────────────────────────────────

const IconStar = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
  </svg>
);
const IconAward = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="8" r="6"/><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/>
  </svg>
);
const IconCheck = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);
const IconClock = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
  </svg>
);
const IconSearch = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
);
const IconHome = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9.5L12 3l9 6.5"/><path d="M5 9v11a1 1 0 0 0 1 1h3v-7h6v7h3a1 1 0 0 0 1-1V9"/>
  </svg>
);
const IconTrend = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/>
  </svg>
);
const IconSpinner = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="animate-spin">
    <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
  </svg>
);
const IconUpload = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
  </svg>
);
const IconDownload = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
  </svg>
);
const IconEdit = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
  </svg>
);
const IconFilePdf = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
    <polyline points="14 2 14 8 20 8"/>
    <line x1="9" y1="13" x2="15" y2="13"/><line x1="9" y1="17" x2="15" y2="17"/>
  </svg>
);

// ─── Mock Data ────────────────────────────────────────────────────────────────

const MOCK_MAHASISWA = [
  { id: 1, nama: "Andi Pratama",  nim: "21/123456/TK/01", initials: "AP", perusahaan: "PT Tokopedia",   posisi: "Frontend Dev Intern",   pembimbing: "Dr. Budi S.",   nilaiPemusahaan: 88, nilaiPembimbing: 85, nilaiLaporan: 87, nilaiAkhir: "A",  komentar: "Kinerja sangat memuaskan, inisiatif tinggi.",   sertifikat: "Terbit",  fileSertifikat: "sertifikat_andi.pdf" },
  { id: 2, nama: "Bintang Sari",  nim: "21/234567/TK/02", initials: "BS", perusahaan: "PT Gojek",       posisi: "Data Analyst Intern",   pembimbing: "Dr. Sari M.",   nilaiPemusahaan: 80, nilaiPembimbing: 78, nilaiLaporan: 82, nilaiAkhir: "B+", komentar: "Analisis data cukup baik.",                         sertifikat: "Pending", fileSertifikat: null },
  { id: 3, nama: "Citra Dewi",    nim: "21/345678/EK/01", initials: "CD", perusahaan: "PT BCA",         posisi: "Finance Intern",        pembimbing: "Prof. Hendra",  nilaiPemusahaan: 92, nilaiPembimbing: 90, nilaiLaporan: 91, nilaiAkhir: "A",  komentar: "Luar biasa, bisa menjadi referensi mahasiswa lain.", sertifikat: "Terbit", fileSertifikat: "sertifikat_citra.pdf" },
  { id: 4, nama: "Dodi Kurnia",   nim: "21/456789/TK/03", initials: "DK", perusahaan: "PT PLN",         posisi: "Engineering Intern",    pembimbing: "Dr. Eko W.",    nilaiPemusahaan: null, nilaiPembimbing: null, nilaiLaporan: null, nilaiAkhir: null, komentar: "",  sertifikat: "Belum",   fileSertifikat: null },
  { id: 5, nama: "Eka Putri",     nim: "21/567890/FK/01", initials: "EP", perusahaan: "PT Kimia Farma", posisi: "QC Intern",             pembimbing: "Dr. Lina P.",   nilaiPemusahaan: 75, nilaiPembimbing: 72, nilaiLaporan: 74, nilaiAkhir: "B",  komentar: "Perlu peningkatan ketelitian di lab.",             sertifikat: "Belum",   fileSertifikat: null },
  { id: 6, nama: "Fajar Ramadan", nim: "21/678901/TK/04", initials: "FR", perusahaan: "PT Bukalapak",   posisi: "Backend Dev Intern",    pembimbing: "Dr. Rudi A.",   nilaiPemusahaan: 83, nilaiPembimbing: 81, nilaiLaporan: 84, nilaiAkhir: "B+", komentar: "Kemampuan teknis di atas rata-rata.",               sertifikat: "Pending", fileSertifikat: null },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatCard({ label, value, trend, trendColor = "text-[#22c997]", icon, iconBg, iconColor, loading }) {
  return (
    <div className="bg-white border border-[#e8e8f0] rounded-[12px] p-[18px] flex flex-col gap-[10px]">
      <div className="flex items-start justify-between">
        <span className="text-[12px] text-[#9898b0] font-medium">{label}</span>
        <div className={`w-9 h-9 rounded-[10px] ${iconBg} flex items-center justify-center ${iconColor}`}>{icon}</div>
      </div>
      <div className="text-[28px] font-bold text-[#1e1e2e] leading-none">
        {loading ? <span className="text-[#e8e8f0]">—</span> : value}
      </div>
      <div className={`flex items-center gap-1 text-[11.5px] ${trendColor}`}>
        <IconTrend />{trend}
      </div>
    </div>
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

// ─── Penilaian Modal ──────────────────────────────────────────────────────────

function PenilaianModal({ item, onClose, onSave }) {
  const [form, setForm] = useState({
    nilaiPerusahaan: item.nilaiPemusahaan ?? "",
    nilaiPembimbing: item.nilaiPembimbing ?? "",
    nilaiLaporan:    item.nilaiLaporan ?? "",
    nilaiAkhir:      item.nilaiAkhir ?? "",
    komentar:        item.komentar ?? "",
  });
  const [saving, setSaving] = useState(false);

  const color = avatarColors[item.id % avatarColors.length];

  const handleSave = async () => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 800)); // simulate API
    onSave({ ...item, ...form });
    setSaving(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-[rgba(30,30,46,0.45)] flex items-center justify-center z-50">
      <div className="bg-white rounded-[14px] p-7 w-[520px] shadow-[0_20px_60px_rgba(0,0,0,0.15)] max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className={`w-11 h-11 rounded-[12px] flex items-center justify-center text-[14px] font-bold ${color}`}>{item.initials}</div>
          <div>
            <div className="text-[15px] font-bold text-[#1e1e2e]">{item.nama}</div>
            <div className="text-[12px] text-[#9898b0]">{item.nim} · {item.perusahaan}</div>
          </div>
        </div>

        {/* Nilai inputs */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          {[
            ["Nilai Perusahaan", "nilaiPerusahaan", "0–100"],
            ["Nilai Pembimbing", "nilaiPembimbing", "0–100"],
            ["Nilai Laporan",    "nilaiLaporan",    "0–100"],
          ].map(([label, key, placeholder]) => (
            <div key={key}>
              <label className="text-[11.5px] text-[#9898b0] font-semibold block mb-[5px]">{label}</label>
              <input
                type="number"
                min="0" max="100"
                placeholder={placeholder}
                value={form[key]}
                onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                className="w-full border border-[#e8e8f0] rounded-[8px] px-3 py-2 text-[13px] text-[#1e1e2e] outline-none focus:border-[#a855f7] transition-colors"
              />
            </div>
          ))}
        </div>

        {/* Nilai Akhir */}
        <div className="mb-4">
          <label className="text-[11.5px] text-[#9898b0] font-semibold block mb-[5px]">Nilai Akhir (Huruf)</label>
          <select
            value={form.nilaiAkhir}
            onChange={(e) => setForm((f) => ({ ...f, nilaiAkhir: e.target.value }))}
            className="w-full border border-[#e8e8f0] rounded-[8px] px-3 py-2 text-[13px] text-[#555] bg-white outline-none focus:border-[#a855f7] transition-colors cursor-pointer"
          >
            {NILAI_OPTIONS.map((v) => <option key={v} value={v}>{v === "" ? "Pilih nilai akhir..." : v}</option>)}
          </select>
        </div>

        {/* Komentar */}
        <div className="mb-6">
          <label className="text-[11.5px] text-[#9898b0] font-semibold block mb-[5px]">Catatan / Komentar</label>
          <textarea
            rows={3}
            placeholder="Tuliskan catatan evaluasi untuk mahasiswa..."
            value={form.komentar}
            onChange={(e) => setForm((f) => ({ ...f, komentar: e.target.value }))}
            className="w-full border border-[#e8e8f0] rounded-[8px] px-3 py-[10px] text-[13px] text-[#1e1e2e] resize-none outline-none focus:border-[#a855f7] transition-colors"
          />
        </div>

        <div className="flex justify-end gap-2">
          <button onClick={onClose} disabled={saving} className="px-4 py-2 border border-[#e8e8f0] rounded-[8px] text-[13px] font-semibold text-[#555] bg-white hover:bg-[#f5f5fb] transition-colors disabled:opacity-50">
            Batal
          </button>
          <button onClick={handleSave} disabled={saving} className="px-4 py-2 rounded-[8px] bg-[#a855f7] text-white text-[13px] font-semibold hover:bg-[#9333ea] transition-colors flex items-center gap-2 disabled:opacity-70">
            {saving && <IconSpinner />}Simpan Penilaian
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Upload Sertifikat Modal ──────────────────────────────────────────────────

function UploadModal({ item, onClose, onUpload }) {
  const [file, setFile] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef(null);

  const color = avatarColors[item.id % avatarColors.length];

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files[0];
    if (f?.type === "application/pdf") setFile(f);
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    await new Promise((r) => setTimeout(r, 1200)); // simulate
    onUpload({ ...item, sertifikat: "Terbit", fileSertifikat: file.name });
    setUploading(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-[rgba(30,30,46,0.45)] flex items-center justify-center z-50">
      <div className="bg-white rounded-[14px] p-7 w-[480px] shadow-[0_20px_60px_rgba(0,0,0,0.15)]">
        <div className="flex items-center gap-3 mb-6">
          <div className={`w-11 h-11 rounded-[12px] flex items-center justify-center text-[14px] font-bold ${color}`}>{item.initials}</div>
          <div>
            <div className="text-[15px] font-bold text-[#1e1e2e]">Upload Sertifikat</div>
            <div className="text-[12px] text-[#9898b0]">{item.nama} · {item.nim}</div>
          </div>
        </div>

        {/* Drop zone */}
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className={`border-2 border-dashed rounded-[12px] p-8 flex flex-col items-center justify-center gap-3 cursor-pointer transition-colors mb-5
            ${dragOver ? "border-[#a855f7] bg-[#faf5ff]" : "border-[#e8e8f0] bg-[#fafafc] hover:border-[#a855f7] hover:bg-[#faf5ff]"}`}
        >
          <input ref={inputRef} type="file" accept=".pdf" className="hidden" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
          {file ? (
            <>
              <div className="w-12 h-12 rounded-[12px] bg-[#fee2e2] text-[#dc2626] flex items-center justify-center">
                <IconFilePdf />
              </div>
              <div className="text-[13px] font-semibold text-[#1e1e2e]">{file.name}</div>
              <div className="text-[11.5px] text-[#9898b0]">{(file.size / 1024).toFixed(1)} KB · PDF</div>
            </>
          ) : (
            <>
              <div className="w-12 h-12 rounded-[12px] bg-[#f0f0f8] text-[#9898b0] flex items-center justify-center"><IconUpload /></div>
              <div className="text-[13px] font-semibold text-[#555]">Drag & drop atau klik untuk pilih file</div>
              <div className="text-[11.5px] text-[#9898b0]">Format: PDF · Maks. 5 MB</div>
            </>
          )}
        </div>

        <div className="flex justify-end gap-2">
          <button onClick={onClose} disabled={uploading} className="px-4 py-2 border border-[#e8e8f0] rounded-[8px] text-[13px] font-semibold text-[#555] bg-white hover:bg-[#f5f5fb] transition-colors disabled:opacity-50">
            Batal
          </button>
          <button onClick={handleUpload} disabled={!file || uploading} className="px-4 py-2 rounded-[8px] bg-[#a855f7] text-white text-[13px] font-semibold hover:bg-[#9333ea] transition-colors flex items-center gap-2 disabled:opacity-50">
            {uploading ? <><IconSpinner />Mengupload...</> : <><IconUpload width="14" height="14" />Upload Sertifikat</>}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function EvaluasiAkhir() {
  const [activeTab, setActiveTab] = useState("penilaian");
  const [data, setData] = useState(MOCK_MAHASISWA);
  const [search, setSearch] = useState("");
  const [nilaiFilter, setNilaiFilter] = useState("");
  const [editItem, setEditItem] = useState(null);
  const [uploadItem, setUploadItem] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = useCallback((message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  }, []);

  const handleSavePenilaian = (updated) => {
    setData((prev) => prev.map((d) => (d.id === updated.id ? updated : d)));
    showToast(`Penilaian ${updated.nama} berhasil disimpan`);
  };

  const handleUpload = (updated) => {
    setData((prev) => prev.map((d) => (d.id === updated.id ? updated : d)));
    showToast(`Sertifikat ${updated.nama} berhasil diupload`);
  };

  const filtered = data.filter((m) => {
    const q = search.toLowerCase();
    const matchSearch = !q || m.nama.toLowerCase().includes(q) || m.nim.toLowerCase().includes(q) || m.perusahaan.toLowerCase().includes(q);
    const matchNilai = !nilaiFilter || m.nilaiAkhir === nilaiFilter;
    return matchSearch && matchNilai;
  });

  const stats = {
    total:    data.length,
    dinilai:  data.filter((d) => d.nilaiAkhir).length,
    sertTerbit: data.filter((d) => d.sertifikat === "Terbit").length,
    belumDinilai: data.filter((d) => !d.nilaiAkhir).length,
  };

  return (
    <div className="flex min-h-screen bg-[#f5f5fb] font-sans">
      <div className="flex-1 flex flex-col min-w-0">

        {/* Header */}
        <div className="flex items-center justify-between px-[30px] py-4 bg-white border-b border-[#e8e8f0]">
          <div className="flex items-center gap-[14px]">
            <div className="w-[38px] h-[38px] rounded-[10px] bg-[#f3e8ff] text-[#a855f7] flex items-center justify-center flex-shrink-0">
              <IconStar />
            </div>
            <div>
              <div className="text-[19px] font-bold text-[#1e1e2e] tracking-tight">Evaluasi Akhir</div>
              <div className="text-[12px] text-[#9898b0] mt-[1px]">Penilaian mahasiswa dan penerbitan sertifikat magang</div>
            </div>
          </div>
          <button className="px-4 py-[7px] border-[1.5px] border-[#2563eb] rounded-[7px] text-[#2563eb] text-[12.5px] font-semibold bg-transparent flex items-center gap-[6px] hover:bg-[#2563eb] hover:text-white transition-all duration-150">
            <IconHome />Back to homepage
          </button>
        </div>

        <main className="flex-1 p-7">

          {/* Tabs */}
          <div className="flex gap-1 bg-[#ececf4] rounded-[10px] p-1 w-fit mb-6">
            {TABS.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-[18px] py-[7px] rounded-[7px] text-[13px] font-semibold transition-all duration-150 border-none cursor-pointer
                  ${activeTab === tab.key ? "bg-white text-[#1e1e2e] shadow-[0_1px_4px_rgba(0,0,0,.08)]" : "bg-transparent text-[#9898b0] hover:text-[#555]"}`}
              >
                {tab.label}
                {tab.key === "penilaian" && stats.belumDinilai > 0 && (
                  <span className="ml-[6px] px-[6px] py-[1px] rounded-full bg-[#faeeda] text-[#854f0b] text-[10px] font-bold">{stats.belumDinilai}</span>
                )}
              </button>
            ))}
          </div>

          {/* Stat Cards */}
          <div className="grid grid-cols-4 gap-[14px] mb-5">
            <StatCard label="Total Mahasiswa"    value={stats.total}       trend="Seluruh peserta"       icon={<IconStar />}     iconBg="bg-[#f3e8ff]" iconColor="text-[#a855f7]" />
            <StatCard label="Sudah Dinilai"      value={stats.dinilai}     trend="Penilaian lengkap"     icon={<IconCheck />}    iconBg="bg-[#ccfbf3]" iconColor="text-[#0d9488]" />
            <StatCard label="Sertifikat Terbit"  value={stats.sertTerbit}  trend="Siap diunduh"          icon={<IconAward />}    iconBg="bg-[#dbeafe]" iconColor="text-[#2563eb]" />
            <StatCard label="Belum Dinilai"      value={stats.belumDinilai} trend="Perlu ditindak"       trendColor="text-[#d97706]" icon={<IconClock />} iconBg="bg-[#faeeda]" iconColor="text-[#d97706]" />
          </div>

          {/* Search & Filter */}
          <div className="flex items-center gap-[10px] mb-4">
            <div className="relative flex-1">
              <span className="absolute left-[11px] top-1/2 -translate-y-1/2 text-[#b0b0c8]"><IconSearch /></span>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Cari nama mahasiswa, NIM, atau perusahaan..."
                className="w-full pl-[34px] pr-3 py-2 border border-[#e8e8f0] rounded-[8px] text-[13px] text-[#1e1e2e] bg-white outline-none focus:border-[#a855f7] transition-colors"
              />
            </div>
            {activeTab === "penilaian" && (
              <select
                value={nilaiFilter}
                onChange={(e) => setNilaiFilter(e.target.value)}
                className="px-3 py-2 border border-[#e8e8f0] rounded-[8px] text-[13px] text-[#555] bg-white outline-none cursor-pointer hover:bg-[#f5f5fb] transition-colors"
              >
                {NILAI_OPTIONS.map((v) => <option key={v} value={v}>{v === "" ? "Semua Nilai" : `Nilai ${v}`}</option>)}
              </select>
            )}
          </div>

          {/* ── Tab: Penilaian ── */}
          {activeTab === "penilaian" && (
            <div className="bg-white border border-[#e8e8f0] rounded-[12px] overflow-hidden">
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    {["Mahasiswa", "Tempat Magang", "Pembimbing", "Nilai Perusahaan", "Nilai Pembimbing", "Nilai Laporan", "Nilai Akhir", "Aksi"].map((h) => (
                      <th key={h} className="px-4 py-3 bg-[#fafafc] border-b border-[#e8e8f0] text-left text-[11.5px] font-semibold text-[#9898b0] uppercase tracking-[.04em]">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <tr><td colSpan={8} className="text-center py-12 text-[13px] text-[#9898b0]">Tidak ada data</td></tr>
                  ) : filtered.map((item, i) => {
                    const color = avatarColors[i % avatarColors.length];
                    return (
                      <tr key={item.id} className="border-b border-[#f0f0f8] last:border-b-0 hover:bg-[#fafafc] transition-colors">
                        <td className="px-4 py-[13px]">
                          <div className="flex items-center gap-[10px]">
                            <div className={`w-8 h-8 rounded-[8px] flex items-center justify-center text-[12px] font-semibold flex-shrink-0 ${color}`}>{item.initials}</div>
                            <div>
                              <div className="text-[13px] font-semibold text-[#1e1e2e]">{item.nama}</div>
                              <div className="text-[11.5px] text-[#9898b0]">{item.nim}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-[13px]">
                          <div className="text-[13px] text-[#1e1e2e] font-medium">{item.perusahaan}</div>
                          <div className="text-[11.5px] text-[#9898b0]">{item.posisi}</div>
                        </td>
                        <td className="px-4 py-[13px] text-[13px] text-[#555]">{item.pembimbing}</td>
                        <td className="px-4 py-[13px] text-center">
                          <span className="text-[13px] font-semibold text-[#1e1e2e]">{item.nilaiPemusahaan ?? <span className="text-[#c8c8e0]">—</span>}</span>
                        </td>
                        <td className="px-4 py-[13px] text-center">
                          <span className="text-[13px] font-semibold text-[#1e1e2e]">{item.nilaiPembimbing ?? <span className="text-[#c8c8e0]">—</span>}</span>
                        </td>
                        <td className="px-4 py-[13px] text-center">
                          <span className="text-[13px] font-semibold text-[#1e1e2e]">{item.nilaiLaporan ?? <span className="text-[#c8c8e0]">—</span>}</span>
                        </td>
                        <td className="px-4 py-[13px]">
                          {item.nilaiAkhir ? (
                            <span className={`inline-flex items-center px-[10px] py-[3px] rounded-full text-[11px] font-bold ${badgeNilai[item.nilaiAkhir] ?? "bg-[#f0f0f8] text-[#555]"}`}>
                              {item.nilaiAkhir}
                            </span>
                          ) : (
                            <span className="text-[12px] text-[#c8c8e0]">Belum dinilai</span>
                          )}
                        </td>
                        <td className="px-4 py-[13px]">
                          <button
                            onClick={() => setEditItem(item)}
                            className="px-[10px] py-[5px] rounded-[6px] text-[11px] font-semibold bg-[#f3e8ff] text-[#a855f7] hover:bg-[#a855f7] hover:text-white transition-all duration-150 flex items-center gap-1"
                          >
                            <IconEdit />{item.nilaiAkhir ? "Edit" : "Nilai"}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              <div className="flex items-center justify-between px-4 py-3 border-t border-[#f0f0f8]">
                <span className="text-[12px] text-[#9898b0]">Menampilkan {filtered.length} dari {data.length} mahasiswa</span>
              </div>
            </div>
          )}

          {/* ── Tab: Sertifikat ── */}
          {activeTab === "sertifikat" && (
            <div className="bg-white border border-[#e8e8f0] rounded-[12px] overflow-hidden">
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    {["Mahasiswa", "Tempat Magang", "Nilai Akhir", "Status Sertifikat", "File", "Aksi"].map((h) => (
                      <th key={h} className="px-4 py-3 bg-[#fafafc] border-b border-[#e8e8f0] text-left text-[11.5px] font-semibold text-[#9898b0] uppercase tracking-[.04em]">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <tr><td colSpan={6} className="text-center py-12 text-[13px] text-[#9898b0]">Tidak ada data</td></tr>
                  ) : filtered.map((item, i) => {
                    const color = avatarColors[i % avatarColors.length];
                    return (
                      <tr key={item.id} className="border-b border-[#f0f0f8] last:border-b-0 hover:bg-[#fafafc] transition-colors">
                        <td className="px-4 py-[13px]">
                          <div className="flex items-center gap-[10px]">
                            <div className={`w-8 h-8 rounded-[8px] flex items-center justify-center text-[12px] font-semibold flex-shrink-0 ${color}`}>{item.initials}</div>
                            <div>
                              <div className="text-[13px] font-semibold text-[#1e1e2e]">{item.nama}</div>
                              <div className="text-[11.5px] text-[#9898b0]">{item.nim}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-[13px]">
                          <div className="text-[13px] font-medium text-[#1e1e2e]">{item.perusahaan}</div>
                          <div className="text-[11.5px] text-[#9898b0]">{item.posisi}</div>
                        </td>
                        <td className="px-4 py-[13px]">
                          {item.nilaiAkhir ? (
                            <span className={`inline-flex items-center px-[10px] py-[3px] rounded-full text-[11px] font-bold ${badgeNilai[item.nilaiAkhir] ?? "bg-[#f0f0f8] text-[#555]"}`}>
                              {item.nilaiAkhir}
                            </span>
                          ) : (
                            <span className="text-[12px] text-[#c8c8e0]">—</span>
                          )}
                        </td>
                        <td className="px-4 py-[13px]">
                          <span className={`inline-flex items-center gap-[5px] px-[10px] py-[3px] rounded-full text-[11px] font-semibold ${badgeSertifikat[item.sertifikat] ?? "bg-[#f0f0f8] text-[#555]"}`}>
                            <span className="w-[5px] h-[5px] rounded-full bg-current" />{item.sertifikat}
                          </span>
                        </td>
                        <td className="px-4 py-[13px]">
                          {item.fileSertifikat ? (
                            <div className="flex items-center gap-[6px] text-[12px] text-[#555]">
                              <span className="text-[#dc2626]"><IconFilePdf /></span>
                              <span className="truncate max-w-[120px]">{item.fileSertifikat}</span>
                            </div>
                          ) : (
                            <span className="text-[12px] text-[#c8c8e0]">Belum ada file</span>
                          )}
                        </td>
                        <td className="px-4 py-[13px]">
                          <div className="flex items-center gap-[6px]">
                            <button
                              onClick={() => setUploadItem(item)}
                              className="px-[10px] py-[5px] rounded-[6px] text-[11px] font-semibold bg-[#f3e8ff] text-[#a855f7] hover:bg-[#a855f7] hover:text-white transition-all duration-150 flex items-center gap-1"
                            >
                              <IconUpload />{item.fileSertifikat ? "Ganti" : "Upload"}
                            </button>
                            {item.fileSertifikat && (
                              <button className="px-[10px] py-[5px] rounded-[6px] text-[11px] font-semibold bg-[#dbeafe] text-[#2563eb] hover:bg-[#2563eb] hover:text-white transition-all duration-150 flex items-center gap-1">
                                <IconDownload />Unduh
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              <div className="flex items-center justify-between px-4 py-3 border-t border-[#f0f0f8]">
                <span className="text-[12px] text-[#9898b0]">Menampilkan {filtered.length} dari {data.length} mahasiswa</span>
              </div>
            </div>
          )}
        </main>
      </div>

      {editItem   && <PenilaianModal item={editItem}  onClose={() => setEditItem(null)}  onSave={handleSavePenilaian} />}
      {uploadItem && <UploadModal    item={uploadItem} onClose={() => setUploadItem(null)} onUpload={handleUpload} />}
      {toast && <Toast message={toast.message} type={toast.type} />}
    </div>
  );
}