"use client";

import { useState } from "react";

// ─── Icons ────────────────────────────────────────────────────────────────────

function Icon({ name, size = 16, color = "currentColor" }) {
  const cls = "inline-block flex-shrink-0";
  const p = {
    fill: "none",
    stroke: color,
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round",
  };
  const icons = {
    save:      <svg className={cls} width={size} height={size} viewBox="0 0 24 24" {...p}><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>,
    trash:     <svg className={cls} width={size} height={size} viewBox="0 0 24 24" {...p}><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>,
    edit:      <svg className={cls} width={size} height={size} viewBox="0 0 24 24" {...p}><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
    check:     <svg className={cls} width={size} height={size} viewBox="0 0 24 24" {...p}><polyline points="20 6 9 17 4 12"/></svg>,
    info:      <svg className={cls} width={size} height={size} viewBox="0 0 24 24" {...p}><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>,
    user:      <svg className={cls} width={size} height={size} viewBox="0 0 24 24" {...p}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
    calendar:  <svg className={cls} width={size} height={size} viewBox="0 0 24 24" {...p}><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
    star:      <svg className={cls} width={size} height={size} viewBox="0 0 24 24" {...p}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
    chartbar:  <svg className={cls} width={size} height={size} viewBox="0 0 24 24" {...p}><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/><line x1="2" y1="20" x2="22" y2="20"/></svg>,
    close:     <svg className={cls} width={size} height={size} viewBox="0 0 24 24" {...p}><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
    book:      <svg className={cls} width={size} height={size} viewBox="0 0 24 24" {...p}><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>,
    clock:     <svg className={cls} width={size} height={size} viewBox="0 0 24 24" {...p}><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
  };
  return icons[name] || null;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const MAHASISWA_LIST = [
  { nim: "22/123456/TK/00123", nama: "Budi Santoso",    prodi: "Teknik Informatika" },
  { nim: "22/123457/TK/00124", nama: "Sari Dewi",       prodi: "Teknik Elektro"     },
  { nim: "21/112233/TK/00099", nama: "Rizky Pratama",   prodi: "Teknik Informatika" },
  { nim: "23/199001/TK/00201", nama: "Aulia Rahma",     prodi: "Sistem Informasi"   },
];

// Rumus konversi: durasi magang → SKS (bisa disesuaikan aturan kampus)
function hitungSKS(durasi) {
  const d = parseInt(durasi, 10);
  if (!d || d <= 0) return 0;
  if (d <= 1)  return 2;
  if (d <= 3)  return 4;
  if (d <= 6)  return 6;
  if (d <= 12) return 20;
  return 20;
}

function getNilaiHuruf(nilai) {
  const n = parseFloat(nilai);
  if (n >= 85) return { huruf: "A",  bobot: 4.0, color: "#059669" };
  if (n >= 80) return { huruf: "A-", bobot: 3.7, color: "#059669" };
  if (n >= 75) return { huruf: "B+", bobot: 3.3, color: "#2563eb" };
  if (n >= 70) return { huruf: "B",  bobot: 3.0, color: "#2563eb" };
  if (n >= 65) return { huruf: "B-", bobot: 2.7, color: "#2563eb" };
  if (n >= 60) return { huruf: "C+", bobot: 2.3, color: "#d97706" };
  if (n >= 55) return { huruf: "C",  bobot: 2.0, color: "#d97706" };
  if (n >= 50) return { huruf: "D",  bobot: 1.0, color: "#dc2626" };
  return { huruf: "E", bobot: 0, color: "#dc2626" };
}

const MATAKULIAH_OPTIONS = [
  "Magang / Kerja Praktek",
  "Proyek Independen",
  "Riset / Penelitian",
  "Pertukaran Pelajar",
  "Kewirausahaan",
  "Proyek Kemanusiaan",
];

// ─── Toast ────────────────────────────────────────────────────────────────────

function Toast({ msg, onClose }) {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-[#1e1e2e] text-white px-4 py-3 rounded-xl shadow-2xl animate-fade-in">
      <span className="w-6 h-6 rounded-full bg-[#6c63ff] flex items-center justify-center flex-shrink-0">
        <Icon name="check" size={13} color="#fff" />
      </span>
      <span className="text-sm font-medium">{msg}</span>
      <button onClick={onClose} className="ml-2 text-white/50 hover:text-white transition-colors">
        <Icon name="close" size={14} color="currentColor" />
      </button>
    </div>
  );
}

// ─── Stat Card ────────────────────────────────────────────────────────────────

function StatCard({ icon, label, value, sub, color = "#6c63ff" }) {
  return (
    <div className="bg-white border border-[#e8e8f0] rounded-2xl p-4 flex items-center gap-3">
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ background: `${color}18` }}
      >
        <Icon name={icon} size={18} color={color} />
      </div>
      <div>
        <div className="text-[11px] font-bold text-[#b0b0c8] uppercase tracking-wider">{label}</div>
        <div className="text-[20px] font-extrabold text-[#1e1e2e] leading-tight">{value}</div>
        {sub && <div className="text-[11px] text-[#9898b0]">{sub}</div>}
      </div>
    </div>
  );
}

// ─── Delete Confirm Modal ─────────────────────────────────────────────────────

function DeleteModal({ item, onConfirm, onClose }) {
  return (
    <div className="fixed inset-0 bg-[rgba(30,20,60,0.4)] flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white rounded-2xl w-[380px] max-w-[95vw] shadow-2xl p-6" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center">
            <Icon name="trash" size={18} color="#dc2626" />
          </div>
          <div>
            <div className="text-[15px] font-extrabold text-[#1e1e2e]">Hapus Data Konversi</div>
            <div className="text-xs text-[#9898b0]">Tindakan ini tidak dapat dibatalkan</div>
          </div>
        </div>
        <p className="text-sm text-[#5a5a7a] mb-5">
          Yakin ingin menghapus data konversi SKS milik{" "}
          <span className="font-bold text-[#1e1e2e]">{item?.nama}</span>?
        </p>
        <div className="flex gap-2.5 justify-end">
          <button onClick={onClose} className="px-4 py-2 border border-[#e8e8f0] rounded-lg text-[#6e6e8a] text-sm font-semibold bg-white cursor-pointer hover:bg-gray-50 transition-colors">
            Batal
          </button>
          <button onClick={onConfirm} className="px-4 py-2 bg-red-600 rounded-lg text-white text-sm font-bold cursor-pointer border-none hover:bg-red-700 transition-colors">
            Hapus
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function KonversiSKS() {
  // Form state
  const [form, setForm] = useState({
    nim: "",
    durasi: "",
    nilaiAngka: "",
    matakuliah: "Magang / Kerja Praktek",
    periode: "",
    keterangan: "",
  });

  const [riwayat, setRiwayat] = useState([
    { id: 1, nim: "22/123456/TK/00123", nama: "Budi Santoso",  prodi: "Teknik Informatika", durasi: 6,  nilaiAngka: 90, matakuliah: "Magang / Kerja Praktek", periode: "Feb 2025 – Agu 2025", keterangan: "Magang di PT Teknologi Nusantara",  createdAt: "10 Jun 2025" },
    { id: 2, nim: "22/123457/TK/00124", nama: "Sari Dewi",     prodi: "Teknik Elektro",     durasi: 3,  nilaiAngka: 88, matakuliah: "Proyek Independen",       periode: "Agu 2024 – Okt 2024", keterangan: "Proyek IoT smart home",           createdAt: "22 Okt 2024" },
    { id: 3, nim: "21/112233/TK/00099", nama: "Rizky Pratama", prodi: "Teknik Informatika", durasi: 12, nilaiAngka: 76, matakuliah: "Riset / Penelitian",       periode: "Jan 2024 – Des 2024", keterangan: "Penelitian machine learning NLP",  createdAt: "05 Jan 2025" },
    { id: 4, nim: "23/199001/TK/00201", nama: "Aulia Rahma",   prodi: "Sistem Informasi",   durasi: 6,  nilaiAngka: 82, matakuliah: "Pertukaran Pelajar",       periode: "Sep 2024 – Feb 2025", keterangan: "Exchange program di UiTM Malaysia", createdAt: "01 Mar 2025" },
    { id: 5, nim: "22/123456/TK/00123", nama: "Budi Santoso",  prodi: "Teknik Informatika", durasi: 3,  nilaiAngka: 90, matakuliah: "Proyek Independen",       periode: "Agu 2024 – Okt 2024", keterangan: "Pengembangan app mobile",         createdAt: "15 Nov 2024" },
  ]);

  const [errors, setErrors]       = useState({});
  const [toast, setToast]         = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [editId, setEditId]       = useState(null);
  const [search, setSearch]       = useState("");
  const [filterProdi, setFilterProdi] = useState("Semua");

  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  // Autofill nama saat NIM dipilih
  const selectedMhs = MAHASISWA_LIST.find((m) => m.nim === form.nim);
  const sksPerhitungan = hitungSKS(form.durasi);
  const nilaiInfo = form.nilaiAngka ? getNilaiHuruf(form.nilaiAngka) : null;

  // Validasi
  const validate = () => {
    const e = {};
    if (!form.nim)        e.nim        = "Pilih mahasiswa";
    if (!form.durasi)     e.durasi     = "Isi durasi magang";
    if (!form.nilaiAngka) e.nilaiAngka = "Isi nilai akhir";
    if (!form.periode)    e.periode    = "Isi periode magang";
    if (parseFloat(form.nilaiAngka) < 0 || parseFloat(form.nilaiAngka) > 100)
      e.nilaiAngka = "Nilai harus antara 0 – 100";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSimpan = () => {
    if (!validate()) return;
    const mhs = MAHASISWA_LIST.find((m) => m.nim === form.nim);
    const entry = {
      id: editId || Date.now(),
      nim: form.nim,
      nama: mhs?.nama || "-",
      prodi: mhs?.prodi || "-",
      durasi: parseInt(form.durasi),
      nilaiAngka: parseFloat(form.nilaiAngka),
      matakuliah: form.matakuliah,
      periode: form.periode,
      keterangan: form.keterangan,
      createdAt: new Date().toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" }),
    };
    if (editId) {
      setRiwayat((prev) => prev.map((r) => (r.id === editId ? entry : r)));
      setToast("Data konversi berhasil diperbarui");
    } else {
      setRiwayat((prev) => [entry, ...prev]);
      setToast("Konversi SKS berhasil disimpan");
    }
    setForm({ nim: "", durasi: "", nilaiAngka: "", matakuliah: "Magang / Kerja Praktek", periode: "", keterangan: "" });
    setEditId(null);
    setErrors({});
  };

  const handleEdit = (r) => {
    setForm({
      nim: r.nim, durasi: String(r.durasi),
      nilaiAngka: String(r.nilaiAngka),
      matakuliah: r.matakuliah, periode: r.periode, keterangan: r.keterangan,
    });
    setEditId(r.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = () => {
    setRiwayat((prev) => prev.filter((r) => r.id !== deleteTarget.id));
    setToast("Data konversi berhasil dihapus");
    setDeleteTarget(null);
  };

  // Filter & search
  const prodis = ["Semua", ...new Set(riwayat.map((r) => r.prodi))];
  const filtered = riwayat.filter((r) => {
    const q = search.toLowerCase();
    const matchSearch = r.nama.toLowerCase().includes(q) || r.nim.includes(q) || r.matakuliah.toLowerCase().includes(q);
    const matchProdi  = filterProdi === "Semua" || r.prodi === filterProdi;
    return matchSearch && matchProdi;
  });

  // Stats
  const totalSKS     = riwayat.reduce((s, r) => s + hitungSKS(r.durasi), 0);
  const rataRata     = riwayat.length ? (riwayat.reduce((s, r) => s + r.nilaiAngka, 0) / riwayat.length).toFixed(1) : 0;
  const jumlahLulus  = riwayat.filter((r) => r.nilaiAngka >= 55).length;

  const inputCls = (field) =>
    `w-full px-3 py-2 border rounded-lg text-sm text-[#1e1e2e] outline-none bg-white font-[inherit] transition-colors
    ${errors[field] ? "border-red-400 focus:ring-1 focus:ring-red-400" : "border-[#e8e8f0] focus:border-[#6c63ff] focus:ring-1 focus:ring-[#6c63ff]"}`;

  return (
    <div className="flex min-h-screen bg-[#f5f5fa] font-[Inter,system-ui,sans-serif]">
      <div className="flex-1 flex flex-col min-w-0">

        {/* Topbar */}
      <div className="flex items-center justify-between px-[30px] py-4 bg-white border-b border-[#e8e8f0]">
        <div className="flex items-center gap-[14px]">
          <div className="w-[38px] h-[38px] rounded-[10px] bg-[#dbeafe] text-[#2563eb] flex items-center justify-center flex-shrink-0">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
              <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
            </svg>
          </div>
          <div>
            <div className="text-[19px] font-bold text-[#1e1e2e] tracking-tight">Konversi SKS</div>
            <div className="text-[12px] text-[#9898b0] mt-[1px]">Kelola konversi SKS kegiatan MBKM mahasiswa</div>
          </div>
        </div>

        <button className="px-4 py-[7px] border-[1.5px] border-[#2563eb] rounded-[7px] text-[#2563eb] text-[12.5px] font-semibold bg-transparent flex items-center gap-[6px] transition-all duration-150 hover:bg-[#2563eb] hover:text-white">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 9.5L12 3l9 6.5" />
            <path d="M5 9v11a1 1 0 0 0 1 1h3v-7h6v7h3a1 1 0 0 0 1-1V9" />
          </svg>
          Back to homepage
        </button>
      </div>
        <main className="flex-1 p-6 flex flex-col gap-5 overflow-y-auto">

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <StatCard icon="book"     label="Total Konversi" value={riwayat.length}   sub="Data tersimpan"     color="#6c63ff" />
            <StatCard icon="chartbar" label="Total SKS"      value={totalSKS}         sub="SKS dikonversi"     color="#0ea5e9" />
            <StatCard icon="star"     label="Rata-rata Nilai" value={rataRata}        sub="Nilai akhir"        color="#f59e0b" />
            <StatCard icon="check"    label="Mahasiswa Lulus" value={jumlahLulus}     sub="Nilai ≥ 55"         color="#10b981" />
          </div>

          {/* Main 2-col layout */}
          <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-5 items-start">

            {/* ── FORM ── */}
            <div className="bg-white border border-[#e8e8f0] rounded-2xl p-5 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-extrabold text-[#1e1e2e]">
                    {editId ? "Edit Konversi SKS" : "Input Konversi SKS"}
                  </h2>
                  <p className="text-[11px] text-[#9898b0] mt-0.5">
                    {editId ? "Perbarui data konversi" : "Tambah data konversi baru"}
                  </p>
                </div>
                {editId && (
                  <button
                    onClick={() => { setForm({ nim: "", durasi: "", nilaiAngka: "", matakuliah: "Magang / Kerja Praktek", periode: "", keterangan: "" }); setEditId(null); setErrors({}); }}
                    className="text-[11px] text-[#9898b0] border border-[#e8e8f0] px-2.5 py-1 rounded-lg hover:text-red-500 hover:border-red-300 transition-colors cursor-pointer bg-white"
                  >
                    Batal Edit
                  </button>
                )}
              </div>

              {/* Mahasiswa */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold text-[#6e6e8a] uppercase tracking-wider">Mahasiswa</label>
                <select className={inputCls("nim")} value={form.nim} onChange={(e) => set("nim", e.target.value)}>
                  <option value="">-- Pilih Mahasiswa --</option>
                  {MAHASISWA_LIST.map((m) => (
                    <option key={m.nim} value={m.nim}>{m.nama} – {m.nim}</option>
                  ))}
                </select>
                {errors.nim && <span className="text-[11px] text-red-500">{errors.nim}</span>}
                {selectedMhs && (
                  <div className="flex items-center gap-2 px-3 py-2 bg-[#f0eeff] rounded-lg mt-0.5">
                    <Icon name="user" size={13} color="#6c63ff" />
                    <span className="text-[12px] text-[#6c63ff] font-semibold">{selectedMhs.prodi}</span>
                  </div>
                )}
              </div>

              {/* Mata Kuliah */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold text-[#6e6e8a] uppercase tracking-wider">Mata Kuliah Konversi</label>
                <select className={inputCls("matakuliah")} value={form.matakuliah} onChange={(e) => set("matakuliah", e.target.value)}>
                  {MATAKULIAH_OPTIONS.map((mk) => <option key={mk}>{mk}</option>)}
                </select>
              </div>

              {/* Durasi & Nilai */}
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-bold text-[#6e6e8a] uppercase tracking-wider">Durasi Magang (Bulan)</label>
                  <input
                    type="number" min="1" max="24"
                    className={inputCls("durasi")}
                    placeholder="Contoh: 6"
                    value={form.durasi}
                    onChange={(e) => set("durasi", e.target.value)}
                  />
                  {errors.durasi && <span className="text-[11px] text-red-500">{errors.durasi}</span>}
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-bold text-[#6e6e8a] uppercase tracking-wider">Nilai Akhir (0–100)</label>
                  <input
                    type="number" min="0" max="100"
                    className={inputCls("nilaiAngka")}
                    placeholder="Contoh: 88"
                    value={form.nilaiAngka}
                    onChange={(e) => set("nilaiAngka", e.target.value)}
                  />
                  {errors.nilaiAngka && <span className="text-[11px] text-red-500">{errors.nilaiAngka}</span>}
                </div>
              </div>

              {/* Preview SKS & Nilai */}
              {(form.durasi || form.nilaiAngka) && (
                <div className="flex gap-2.5">
                  {form.durasi && (
                    <div className="flex-1 bg-[#f0eeff] rounded-xl px-3 py-2.5 text-center">
                      <div className="text-[10px] font-bold text-[#9898b0] uppercase tracking-wider">SKS Diperoleh</div>
                      <div className="text-2xl font-extrabold text-[#6c63ff]">{sksPerhitungan}</div>
                      <div className="text-[10px] text-[#9898b0]">SKS</div>
                    </div>
                  )}
                  {nilaiInfo && (
                    <div className="flex-1 rounded-xl px-3 py-2.5 text-center" style={{ background: `${nilaiInfo.color}12` }}>
                      <div className="text-[10px] font-bold text-[#9898b0] uppercase tracking-wider">Nilai Huruf</div>
                      <div className="text-2xl font-extrabold" style={{ color: nilaiInfo.color }}>{nilaiInfo.huruf}</div>
                      <div className="text-[10px] text-[#9898b0]">Bobot {nilaiInfo.bobot}</div>
                    </div>
                  )}
                </div>
              )}

              {/* Periode */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold text-[#6e6e8a] uppercase tracking-wider">Periode Kegiatan</label>
                <input
                  className={inputCls("periode")}
                  placeholder="Contoh: Feb 2025 – Agu 2025"
                  value={form.periode}
                  onChange={(e) => set("periode", e.target.value)}
                />
                {errors.periode && <span className="text-[11px] text-red-500">{errors.periode}</span>}
              </div>

              {/* SKS readonly */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold text-[#6e6e8a] uppercase tracking-wider">SKS</label>
                <input
                  readOnly
                  className="w-full px-3 py-2 border border-[#e8e8f0] rounded-lg text-sm text-[#6c63ff] font-bold outline-none bg-[#f9f9ff] cursor-not-allowed"
                  value={form.durasi ? `${sksPerhitungan} SKS` : ""}
                  placeholder="Otomatis terhitung"
                />
              </div>

              {/* Keterangan */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold text-[#6e6e8a] uppercase tracking-wider">Keterangan</label>
                <textarea
                  className="w-full px-3 py-2 border border-[#e8e8f0] rounded-lg text-sm text-[#1e1e2e] outline-none bg-white resize-none font-[inherit] focus:border-[#6c63ff] focus:ring-1 focus:ring-[#6c63ff] transition-colors min-h-[80px]"
                  placeholder="Keterangan tambahan (opsional)..."
                  value={form.keterangan}
                  onChange={(e) => set("keterangan", e.target.value)}
                />
              </div>

              {/* Info box */}
              <div className="flex gap-2 bg-[#fffbeb] border border-[#fde68a] rounded-xl p-3">
                <Icon name="info" size={15} color="#d97706" />
                <div className="text-[11.5px] text-[#92400e] leading-relaxed">
                  SKS dihitung otomatis berdasarkan durasi kegiatan. ≤1 bln = 2 SKS, ≤3 bln = 4 SKS, ≤6 bln = 6 SKS, ≤12 bln = 20 SKS.
                </div>
              </div>

              {/* Submit */}
              <button
                onClick={handleSimpan}
                className="w-full flex items-center justify-center gap-2 py-2.5 bg-[#6c63ff] rounded-xl text-white text-sm font-bold cursor-pointer border-none hover:bg-[#5a52e0] transition-colors"
              >
                <Icon name="save" size={15} color="#fff" />
                {editId ? "Perbarui Konversi SKS" : "Simpan Konversi SKS"}
              </button>
            </div>

            {/* ── RIWAYAT ── */}
            <div className="bg-white border border-[#e8e8f0] rounded-2xl p-5 flex flex-col gap-4">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div>
                  <h2 className="text-sm font-extrabold text-[#1e1e2e]">Riwayat Konversi SKS</h2>
                  <p className="text-[11px] text-[#9898b0] mt-0.5">{filtered.length} data ditemukan</p>
                </div>
              </div>

              {/* Search & filter */}
              <div className="flex gap-2 flex-wrap">
                <input
                  className="flex-1 min-w-[160px] px-3 py-2 border border-[#e8e8f0] rounded-lg text-sm outline-none focus:border-[#6c63ff] focus:ring-1 focus:ring-[#6c63ff] transition-colors"
                  placeholder="Cari nama, NIM, atau mata kuliah…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <select
                  className="px-3 py-2 border border-[#e8e8f0] rounded-lg text-sm outline-none focus:border-[#6c63ff] transition-colors bg-white"
                  value={filterProdi}
                  onChange={(e) => setFilterProdi(e.target.value)}
                >
                  {prodis.map((p) => <option key={p}>{p}</option>)}
                </select>
              </div>

              {/* Table */}
              <div className="overflow-x-auto rounded-xl border border-[#f0f0f8]">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="bg-[#f9f9ff]">
                      <th className="text-left px-4 py-3 text-[11px] font-bold text-[#b0b0c8] uppercase tracking-wider border-b border-[#f0f0f8]">Mahasiswa</th>
                      <th className="text-left px-4 py-3 text-[11px] font-bold text-[#b0b0c8] uppercase tracking-wider border-b border-[#f0f0f8]">Mata Kuliah</th>
                      <th className="text-center px-4 py-3 text-[11px] font-bold text-[#b0b0c8] uppercase tracking-wider border-b border-[#f0f0f8]">Durasi</th>
                      <th className="text-center px-4 py-3 text-[11px] font-bold text-[#b0b0c8] uppercase tracking-wider border-b border-[#f0f0f8]">SKS</th>
                      <th className="text-center px-4 py-3 text-[11px] font-bold text-[#b0b0c8] uppercase tracking-wider border-b border-[#f0f0f8]">Nilai</th>
                      <th className="text-center px-4 py-3 text-[11px] font-bold text-[#b0b0c8] uppercase tracking-wider border-b border-[#f0f0f8]">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="text-center py-10 text-[#b0b0c8] text-sm">
                          Belum ada data konversi SKS
                        </td>
                      </tr>
                    ) : (
                      filtered.map((r) => {
                        const sks = hitungSKS(r.durasi);
                        const nv  = getNilaiHuruf(r.nilaiAngka);
                        return (
                          <tr key={r.id} className="border-b border-[#f4f4fc] hover:bg-[#faf9ff] transition-colors">
                            {/* Mahasiswa */}
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-2.5">
                                <div className="w-8 h-8 rounded-full bg-[#6c63ff] flex items-center justify-center text-white text-[11px] font-bold flex-shrink-0">
                                  {r.nama.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                                </div>
                                <div>
                                  <div className="text-[13px] font-semibold text-[#1e1e2e]">{r.nama}</div>
                                  <div className="text-[11px] text-[#9898b0]">{r.nim}</div>
                                  <div className="text-[11px] text-[#b0b0c8]">{r.prodi}</div>
                                </div>
                              </div>
                            </td>
                            {/* Mata kuliah */}
                            <td className="px-4 py-3">
                              <div className="text-[12.5px] font-medium text-[#1e1e2e]">{r.matakuliah}</div>
                              <div className="text-[11px] text-[#9898b0] flex items-center gap-1 mt-0.5">
                                <Icon name="clock" size={11} color="#b0b0c8" />
                                {r.periode}
                              </div>
                            </td>
                            {/* Durasi */}
                            <td className="px-4 py-3 text-center">
                              <span className="text-[13px] font-semibold text-[#1e1e2e]">{r.durasi}</span>
                              <span className="text-[11px] text-[#9898b0]"> bln</span>
                            </td>
                            {/* SKS */}
                            <td className="px-4 py-3 text-center">
                              <span className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-[#f0eeff] text-[#6c63ff] text-[13px] font-extrabold">
                                {sks}
                              </span>
                            </td>
                            {/* Nilai */}
                            <td className="px-4 py-3 text-center">
                              <div className="flex flex-col items-center gap-0.5">
                                <span className="text-[15px] font-extrabold" style={{ color: nv.color }}>
                                  {nv.huruf}
                                </span>
                                <span className="text-[11px] text-[#9898b0]">{r.nilaiAngka}</span>
                              </div>
                            </td>
                            {/* Aksi */}
                            <td className="px-4 py-3 text-center">
                              <div className="flex items-center justify-center gap-1.5">
                                <button
                                  onClick={() => handleEdit(r)}
                                  className="w-7 h-7 rounded-lg bg-[#f0eeff] flex items-center justify-center cursor-pointer border-none hover:bg-[#e4dfff] transition-colors"
                                  title="Edit"
                                >
                                  <Icon name="edit" size={13} color="#6c63ff" />
                                </button>
                                <button
                                  onClick={() => setDeleteTarget(r)}
                                  className="w-7 h-7 rounded-lg bg-red-50 flex items-center justify-center cursor-pointer border-none hover:bg-red-100 transition-colors"
                                  title="Hapus"
                                >
                                  <Icon name="trash" size={13} color="#dc2626" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>

              {/* Legend */}
              <div className="flex flex-wrap gap-3 pt-1">
                {[
                  { huruf: "A / A-", range: "80–100", color: "#059669" },
                  { huruf: "B+/B/B-", range: "65–79", color: "#2563eb" },
                  { huruf: "C+ / C", range: "55–64", color: "#d97706" },
                  { huruf: "D / E", range: "0–54",  color: "#dc2626" },
                ].map((g) => (
                  <div key={g.huruf} className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full" style={{ background: g.color }} />
                    <span className="text-[11px] text-[#9898b0]">
                      <span className="font-semibold" style={{ color: g.color }}>{g.huruf}</span> ({g.range})
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </main>
      </div>

      {/* Delete confirm */}
      {deleteTarget && (
        <DeleteModal item={deleteTarget} onConfirm={handleDelete} onClose={() => setDeleteTarget(null)} />
      )}

      {/* Toast */}
      {toast && <Toast msg={toast} onClose={() => setToast(null)} />}
    </div>
  );
}

