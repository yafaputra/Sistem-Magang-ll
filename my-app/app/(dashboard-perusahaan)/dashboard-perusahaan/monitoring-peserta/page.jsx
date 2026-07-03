"use client";

import { useState, useEffect, useCallback } from "react";

// ─── Konstanta ────────────────────────────────────────────────────────────────

const API_BASE = (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000") + "/api";

const STATUS_OPTIONS = ["", "Aktif", "Selesai", "Dropout", "Cuti"];

const badgeStyle = {
  Aktif:    "bg-[#ccfbf3] text-[#0d9488]",
  Selesai:  "bg-[#dbeafe] text-[#2563eb]",
  Dropout:  "bg-[#fee2e2] text-[#dc2626]",
  Cuti:     "bg-[#faeeda] text-[#854f0b]",
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
  const contentType = res.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) {
    const text = await res.text();
    throw new Error(`Server error ${res.status}: ${text.slice(0, 200)}`);
  }
  const json = await res.json();
  if (!res.ok) throw new Error(json.message ?? `Error ${res.status}`);
  return json;
}

// ─── Icons ────────────────────────────────────────────────────────────────────

const IconUsers = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
);
const IconActivity = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
  </svg>
);
const IconCheckCircle = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
  </svg>
);
const IconAlertCircle = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
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
const IconEye = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
  </svg>
);
const IconMessage = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
  </svg>
);

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatCard({ label, value, trend, trendColor = "text-[#22c997]", icon, iconBg, iconColor, loading }) {
  return (
    <div className="bg-white border border-[#e8e8f0] rounded-[12px] p-[18px] flex flex-col gap-[10px]">
      <div className="flex items-start justify-between">
        <span className="text-[12px] text-[#9898b0] font-medium">{label}</span>
        <div className={`w-9 h-9 rounded-[10px] ${iconBg} flex items-center justify-center ${iconColor}`}>
          {icon}
        </div>
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

function StatusBadge({ status }) {
  return (
    <span className={`inline-flex items-center gap-[5px] px-[10px] py-[3px] rounded-full text-[11px] font-semibold ${badgeStyle[status] ?? "bg-[#f0f0f8] text-[#6b6b80]"}`}>
      <span className="w-[5px] h-[5px] rounded-full bg-current" />{status}
    </span>
  );
}

function ProgressBar({ value }) {
  const color =
    value >= 80 ? "bg-[#0d9488]" :
    value >= 50 ? "bg-[#2563eb]" :
    value >= 30 ? "bg-[#d97706]" :
    "bg-[#dc2626]";
  return (
    <div className="flex items-center gap-[8px]">
      <div className="flex-1 h-[6px] bg-[#f0f0f8] rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${color} transition-all duration-500`} style={{ width: `${value}%` }} />
      </div>
      <span className="text-[11.5px] font-semibold text-[#555] w-[30px] text-right">{value}%</span>
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

// ─── Mock data (replace with real API calls) ──────────────────────────────────

const MOCK_PESERTA = [
  { id: 1, nama: "Andi Pratama", nim: "21/123456/TK/01", initials: "AP", universitas: "UGM", prodi: "Teknik Informatika", perusahaan: "PT Tokopedia", posisi: "Frontend Dev Intern", mulai: "01 Mar 2025", selesai: "31 Mei 2025", progress: 85, status: "Aktif", laporan: 8, totalLaporan: 10 },
  { id: 2, nama: "Bintang Sari", nim: "21/234567/TK/02", initials: "BS", universitas: "UGM", prodi: "Sistem Informasi", perusahaan: "PT Gojek", posisi: "Data Analyst Intern", mulai: "01 Mar 2025", selesai: "31 Mei 2025", progress: 60, status: "Aktif", laporan: 6, totalLaporan: 10 },
  { id: 3, nama: "Citra Dewi", nim: "21/345678/EK/01", initials: "CD", universitas: "UGM", prodi: "Ekonomi", perusahaan: "PT BCA", posisi: "Finance Intern", mulai: "01 Feb 2025", selesai: "30 Apr 2025", progress: 100, status: "Selesai", laporan: 10, totalLaporan: 10 },
  { id: 4, nama: "Dodi Kurnia", nim: "21/456789/TK/03", initials: "DK", universitas: "UGM", prodi: "Teknik Elektro", perusahaan: "PT PLN", posisi: "Engineering Intern", mulai: "01 Jan 2025", selesai: "31 Mar 2025", progress: 20, status: "Dropout", laporan: 2, totalLaporan: 10 },
  { id: 5, nama: "Eka Putri", nim: "21/567890/FK/01", initials: "EP", universitas: "UGM", prodi: "Farmasi", perusahaan: "PT Kimia Farma", posisi: "QC Intern", mulai: "01 Apr 2025", selesai: "30 Jun 2025", progress: 45, status: "Cuti", laporan: 4, totalLaporan: 10 },
  { id: 6, nama: "Fajar Ramadan", nim: "21/678901/TK/04", initials: "FR", universitas: "UGM", prodi: "Ilmu Komputer", perusahaan: "PT Bukalapak", posisi: "Backend Dev Intern", mulai: "01 Mar 2025", selesai: "31 Mei 2025", progress: 72, status: "Aktif", laporan: 7, totalLaporan: 10 },
];

// ─── Detail Modal ─────────────────────────────────────────────────────────────

function DetailModal({ item, onClose }) {
  const color = avatarColors[item.id % avatarColors.length];
  return (
    <div className="fixed inset-0 bg-[rgba(30,30,46,0.45)] flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white rounded-[14px] p-7 w-[500px] shadow-[0_20px_60px_rgba(0,0,0,0.15)]" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center gap-3 mb-5">
          <div className={`w-12 h-12 rounded-[12px] flex items-center justify-center text-[15px] font-bold ${color}`}>
            {item.initials}
          </div>
          <div>
            <div className="text-[16px] font-bold text-[#1e1e2e]">{item.nama}</div>
            <div className="text-[12px] text-[#9898b0]">{item.nim} · {item.prodi}</div>
          </div>
          <div className="ml-auto"><StatusBadge status={item.status} /></div>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-5">
          {[
            ["Universitas", item.universitas],
            ["Perusahaan", item.perusahaan],
            ["Posisi", item.posisi],
            ["Periode", `${item.mulai} – ${item.selesai}`],
          ].map(([label, val]) => (
            <div key={label} className="bg-[#fafafc] rounded-[8px] p-3">
              <div className="text-[11px] text-[#9898b0] font-medium mb-[3px]">{label}</div>
              <div className="text-[13px] font-semibold text-[#1e1e2e]">{val}</div>
            </div>
          ))}
        </div>

        <div className="bg-[#fafafc] rounded-[8px] p-4 mb-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[12px] font-semibold text-[#555]">Progress Keseluruhan</span>
            <span className="text-[12px] font-bold text-[#1e1e2e]">Laporan {item.laporan}/{item.totalLaporan}</span>
          </div>
          <ProgressBar value={item.progress} />
        </div>

        <div className="flex justify-end">
          <button onClick={onClose} className="px-4 py-2 border border-[#e8e8f0] rounded-[8px] text-[13px] font-semibold text-[#555] bg-white hover:bg-[#f5f5fb] transition-colors">
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Peserta Row ──────────────────────────────────────────────────────────────

function PesertaRow({ item, index, onDetail }) {
  const color = avatarColors[index % avatarColors.length];
  return (
    <tr className="border-b border-[#f0f0f8] last:border-b-0 hover:bg-[#fafafc] transition-colors">
      <td className="px-4 py-[13px]">
        <div className="flex items-center gap-[10px]">
          <div className={`w-8 h-8 rounded-[8px] flex items-center justify-center flex-shrink-0 text-[12px] font-semibold ${color}`}>
            {item.initials}
          </div>
          <div>
            <div className="text-[13px] font-semibold text-[#1e1e2e]">{item.nama}</div>
            <div className="text-[11.5px] text-[#9898b0] mt-[1px]">{item.nim}</div>
          </div>
        </div>
      </td>
      <td className="px-4 py-[13px]">
        <div className="text-[13px] text-[#1e1e2e] font-medium">{item.perusahaan}</div>
        <div className="text-[11.5px] text-[#9898b0]">{item.posisi}</div>
      </td>
      <td className="px-4 py-[13px]">
        <span className="bg-[#f0f0f8] text-[#555] px-[8px] py-[2px] rounded-full text-[11px] font-medium">
          {item.prodi}
        </span>
      </td>
      <td className="px-4 py-[13px] text-[12px] text-[#9898b0]">
        {item.mulai} –<br />{item.selesai}
      </td>
      <td className="px-4 py-[13px] w-[160px]">
        <ProgressBar value={item.progress} />
        <div className="text-[10.5px] text-[#9898b0] mt-[4px]">Laporan {item.laporan}/{item.totalLaporan}</div>
      </td>
      <td className="px-4 py-[13px]"><StatusBadge status={item.status} /></td>
      <td className="px-4 py-[13px]">
        <div className="flex items-center gap-[6px]">
          <button
            onClick={() => onDetail(item)}
            className="px-[10px] py-[5px] rounded-[6px] text-[11px] font-semibold bg-[#dbeafe] text-[#2563eb] hover:bg-[#2563eb] hover:text-white transition-all duration-150 flex items-center gap-1"
          >
            <IconEye />Detail
          </button>
          <button className="px-[10px] py-[5px] rounded-[6px] text-[11px] font-semibold bg-[#f0f0f8] text-[#555] hover:bg-[#e0e0f0] transition-all duration-150 flex items-center gap-1">
            <IconMessage />Pesan
          </button>
        </div>
      </td>
    </tr>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function MonitoringPeserta() {
  const [peserta] = useState(MOCK_PESERTA);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [loading] = useState(false);
  const [detailItem, setDetailItem] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = useCallback((message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  }, []);

  const filtered = peserta.filter((p) => {
    const q = search.toLowerCase();
    const matchSearch = !q || p.nama.toLowerCase().includes(q) || p.perusahaan.toLowerCase().includes(q) || p.posisi.toLowerCase().includes(q) || p.nim.toLowerCase().includes(q);
    const matchStatus = !statusFilter || p.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const stats = {
    total: peserta.length,
    aktif: peserta.filter((p) => p.status === "Aktif").length,
    selesai: peserta.filter((p) => p.status === "Selesai").length,
    bermasalah: peserta.filter((p) => p.status === "Dropout" || p.status === "Cuti").length,
  };

  const avgProgress = Math.round(peserta.reduce((s, p) => s + p.progress, 0) / peserta.length);

  return (
    <div className="flex min-h-screen bg-[#f5f5fb] font-sans">
      <div className="flex-1 flex flex-col min-w-0">

        {/* Header */}
        <div className="flex items-center justify-between px-[30px] py-4 bg-white border-b border-[#e8e8f0]">
          <div className="flex items-center gap-[14px]">
            <div className="w-[38px] h-[38px] rounded-[10px] bg-[#d1fae5] text-[#059669] flex items-center justify-center flex-shrink-0">
              <IconUsers />
            </div>
            <div>
              <div className="text-[19px] font-bold text-[#1e1e2e] tracking-tight">Monitoring Peserta Magang</div>
              <div className="text-[12px] text-[#9898b0] mt-[1px]">Pantau aktivitas dan progress peserta magang aktif</div>
            </div>
          </div>
          <button className="px-4 py-[7px] border-[1.5px] border-[#2563eb] rounded-[7px] text-[#2563eb] text-[12.5px] font-semibold bg-transparent flex items-center gap-[6px] hover:bg-[#2563eb] hover:text-white transition-all duration-150">
            <IconHome />Back to homepage
          </button>
        </div>

        <main className="flex-1 p-7">

          {/* Stat Cards */}
          <div className="grid grid-cols-4 gap-[14px] mb-6">
            <StatCard label="Total Peserta"       value={stats.total}      trend="Terdaftar aktif"       loading={loading} icon={<IconUsers />}       iconBg="bg-[#d1fae5]" iconColor="text-[#059669]" />
            <StatCard label="Sedang Magang"       value={stats.aktif}      trend="Berjalan lancar"       loading={loading} icon={<IconActivity />}    iconBg="bg-[#dbeafe]" iconColor="text-[#2563eb]" />
            <StatCard label="Telah Selesai"       value={stats.selesai}    trend="Periode berakhir"      loading={loading} icon={<IconCheckCircle />} iconBg="bg-[#ccfbf3]" iconColor="text-[#0d9488]" />
            <StatCard label="Perlu Perhatian"     value={stats.bermasalah} trend="Dropout / Cuti"        loading={loading} trendColor="text-[#dc2626]" icon={<IconAlertCircle />} iconBg="bg-[#fee2e2]" iconColor="text-[#dc2626]" />
          </div>

          {/* Progress Banner */}
          <div className="bg-white border border-[#e8e8f0] rounded-[12px] p-[18px] mb-5 flex items-center gap-6">
            <div className="flex-1">
              <div className="text-[12px] font-semibold text-[#9898b0] mb-[6px]">Rata-rata Progress Seluruh Peserta</div>
              <ProgressBar value={avgProgress} />
            </div>
            <div className="text-[13px] text-[#555] border-l border-[#e8e8f0] pl-6">
              <span className="font-bold text-[#1e1e2e] text-[18px]">{avgProgress}%</span>
              <div className="text-[11px] text-[#9898b0] mt-[1px]">Rata-rata progress</div>
            </div>
          </div>

          {/* Search & Filter */}
          <div className="flex items-center gap-[10px] mb-4">
            <div className="relative flex-1">
              <span className="absolute left-[11px] top-1/2 -translate-y-1/2 text-[#b0b0c8]"><IconSearch /></span>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Cari peserta, perusahaan, atau NIM..."
                className="w-full pl-[34px] pr-3 py-2 border border-[#e8e8f0] rounded-[8px] text-[13px] text-[#1e1e2e] bg-white outline-none focus:border-[#059669] transition-colors"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
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
                  {["Peserta", "Tempat Magang", "Program Studi", "Periode", "Progress", "Status", "Aksi"].map((h) => (
                    <th key={h} className="px-4 py-3 bg-[#fafafc] border-b border-[#e8e8f0] text-left text-[11.5px] font-semibold text-[#9898b0] uppercase tracking-[.04em]">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={7} className="text-center py-12 text-[13px] text-[#9898b0]">
                      <div className="flex items-center justify-center gap-2"><IconSpinner />Memuat data...</div>
                    </td>
                  </tr>
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-12 text-[13px] text-[#9898b0]">Tidak ada peserta ditemukan</td>
                  </tr>
                ) : (
                  filtered.map((item, i) => (
                    <PesertaRow key={item.id} item={item} index={i} onDetail={setDetailItem} />
                  ))
                )}
              </tbody>
            </table>

            <div className="flex items-center justify-between px-4 py-3 border-t border-[#f0f0f8]">
              <span className="text-[12px] text-[#9898b0]">Menampilkan {filtered.length} dari {peserta.length} peserta</span>
            </div>
          </div>
        </main>
      </div>

      {detailItem && <DetailModal item={detailItem} onClose={() => setDetailItem(null)} />}
      {toast && <Toast message={toast.message} type={toast.type} />}
    </div>
  );
}