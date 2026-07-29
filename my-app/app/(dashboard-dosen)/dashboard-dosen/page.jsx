"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Topbar from "../components/topbar";

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/api`;

const FONTS = `
@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600;9..144,700&family=IBM+Plex+Mono:wght@400;500;600&display=swap');
.font-display { font-family: 'Fraunces', 'Georgia', serif; }
.font-mono { font-family: 'IBM Plex Mono', 'Courier New', monospace; }
`;

function initials(nama) {
  return (nama || "?").split(" ").map((w) => w[0]).slice(0, 2).join("");
}

function formatTanggal(dateStr) {
  if (!dateStr) return "-";
  return new Date(dateStr).toLocaleDateString("id-ID", {
    day: "2-digit", month: "short", year: "numeric",
  }).toUpperCase();
}

function StatusBadge({ status }) {
  const map = {
    Aktif: "bg-emerald-50 text-emerald-700 border-emerald-200",
    Menunggu: "bg-amber-50 text-amber-700 border-amber-200",
    Selesai: "bg-[#EFF6FF] text-[#0A66C2] border-[#93C5FD]",
  };
  return (
    <span className={`font-mono text-[10px] font-semibold px-2.5 py-0.5 rounded-full border tracking-wide uppercase ${map[status] || "bg-slate-50 text-slate-500 border-slate-200"}`}>
      {status}
    </span>
  );
}

// Derive status mahasiswa dari progres laporan (belum ada field status eksplisit dari backend)
function deriveStatus(progres, totalLaporan) {
  if (totalLaporan === 0) return "Menunggu";
  if (progres >= 100) return "Selesai";
  return "Aktif";
}

export default function DashboardPage() {
  const [mahasiswaData, setMahasiswaData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoadingId, setActionLoadingId] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/laporan-magang/dosen`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || "Gagal mengambil data laporan bimbingan");
      setMahasiswaData(json.data || []);
    } catch (err) {
      setError(err.message || "Gagal memuat data dashboard");
    } finally {
      setLoading(false);
    }
  }

  // ── Flatten semua laporan dari semua mahasiswa, untuk hitung statistik global ──
  const semuaLaporan = mahasiswaData.flatMap((mhs) =>
    mhs.laporan.map((l) => ({ ...l, mahasiswaNama: mhs.nama, perusahaan: mhs.perusahaan }))
  );

  const totalLaporan = semuaLaporan.length;
  const laporanPending = semuaLaporan.filter((l) => l.status === "Belum Dinilai");
  const laporanSelesai = semuaLaporan.filter((l) => l.status === "Sudah Dinilai");
  const persentaseSelesai = totalLaporan ? Math.round((laporanSelesai.length / totalLaporan) * 100) : 0;

  const stats = [
    {
      label: "Mahasiswa Bimbingan",
      value: mahasiswaData.length,
      sub: "Aktif semester ini",
      iconColor: "text-[#0A66C2]",
      valueColor: "text-[#0A66C2]",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      ),
    },
    {
      label: "Laporan Pending",
      value: laporanPending.length,
      sub: "Menunggu tinjauan",
      iconColor: "text-[#0A66C2]",
      valueColor: "text-[#0A66C2]",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="12" y1="18" x2="12" y2="12" />
          <line x1="9" y1="15" x2="15" y2="15" />
        </svg>
      ),
    },
    {
      label: "Laporan Selesai",
      value: laporanSelesai.length,
      sub: "Sudah ditinjau",
      iconColor: "text-[#0A66C2]",
      valueColor: "text-[#0A66C2]",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      ),
    },
    {
      label: "Presentase Selesai",
      value: persentaseSelesai,
      suffix: "%",
      sub: totalLaporan
        ? `${laporanSelesai.length} dari ${totalLaporan} laporan sudah dinilai`
        : "Belum ada laporan masuk",
      iconColor: "text-[#0A66C2]",
      valueColor: "text-[#0A66C2]",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="20" x2="18" y2="10" />
          <line x1="12" y1="20" x2="12" y2="4" />
          <line x1="6" y1="20" x2="6" y2="14" />
        </svg>
      ),
    },
  ];

  // Laporan yang perlu ditinjau — ambil beberapa laporan pending terbaru
  const laporanPerluDitinjau = [...laporanPending]
    .sort((a, b) => new Date(b.dikirim) - new Date(a.dikirim))
    .slice(0, 3);

  async function handleReview(laporanId, nilai) {
    setActionLoadingId(laporanId);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/laporan-magang/dosen/${laporanId}/review`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ nilai }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || "Gagal menyimpan penilaian");
      await loadData(); // refresh data setelah aksi
    } catch (err) {
      setError(err.message);
    } finally {
      setActionLoadingId(null);
    }
  }

  return (
    <div className="flex-1 min-h-screen bg-slate-50 flex flex-col gap-6 font-sans">
      <style>{FONTS}</style>

      <Topbar
        icon={
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
            <rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" />
          </svg>
        }
        title="Dashboard"
        subtitle="Selamat datang kembali, Dosen"
        iconBg="bg-[#EFF6FF]"
        iconBorder="border-[#93C5FD]"
        iconColor="text-[#0A66C2]"
        rightSlot={
          <Link
            href="/"
            className="flex items-center gap-2 px-4 py-2 border border-[#0A66C2]/40 rounded-xl text-[#0A66C2] text-[12.5px] font-semibold bg-transparent transition-all duration-150 hover:bg-[#0958A8] hover:text-white hover:border-[#0A66C2] no-underline"
          >
            <div className="w-6 h-6 rounded-lg bg-[#0A66C2]/10 border border-[#0A66C2]/20 flex items-center justify-center flex-shrink-0">
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 9.5L12 3l9 6.5" />
                <path d="M5 9v11a1 1 0 0 0 1 1h3v-7h6v7h3a1 1 0 0 0 1-1V9" />
              </svg>
            </div>
            Back to homepage
          </Link>
        }
      />

      {error && (
        <div className="mx-8 bg-rose-50 border border-rose-200 text-rose-700 text-[13px] rounded-xl px-4 py-3">
          {error}
        </div>
      )}

      {/* ── Stat Cards ── */}
      <div className="mx-8 grid grid-cols-4 max-[900px]:grid-cols-1 bg-white border border-slate-200 rounded-2xl overflow-hidden">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="px-6 py-5 h-[110px] animate-pulse border-r border-dashed border-slate-200 last:border-r-0" />
            ))
          : stats.map((s) => (
              <div
                key={s.label}
                className="px-6 py-5 flex flex-col gap-2 transition-colors duration-150 hover:bg-slate-50 border-r border-dashed border-slate-200 last:border-r-0 max-[900px]:border-r-0 max-[900px]:border-b max-[900px]:border-dashed max-[900px]:last:border-b-0"
              >
                <div className="flex items-center gap-1.5">
                  <span className={s.iconColor}>{s.icon}</span>
                  <span className={`font-mono text-[10px] uppercase tracking-[0.14em] font-semibold ${s.iconColor}`}>
                    {s.label}
                  </span>
                </div>
                <div className="flex items-end gap-1">
                  <span className={`font-display text-[32px] font-semibold leading-none tracking-tight ${s.valueColor}`}>
                    {s.value}
                  </span>
                  {s.suffix && <span className="text-[12px] text-slate-400 font-medium mb-1">{s.suffix}</span>}
                </div>
                <span className="text-[11px] text-slate-400">{s.sub}</span>
              </div>
            ))}
      </div>

      {/* ── Main Grid ── */}
      <div className="grid grid-cols-[1.4fr_1fr] max-[900px]:grid-cols-1 gap-4 px-8 pb-8">

        {/* Laporan Perlu Ditinjau */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
          <div className="flex items-center justify-between mb-5 pb-4 border-b border-dashed border-slate-200">
            <h2 className="text-[14px] font-bold text-slate-800 flex items-center gap-2.5">
              <span className="w-1 h-4 bg-[#0A66C2] rounded-full inline-block" />
              Laporan Perlu Ditinjau
            </h2>
            <span className="font-mono text-[10.5px] font-semibold text-[#0A66C2] bg-[#EFF6FF] border border-[#93C5FD] px-3 py-1 rounded-full tracking-wide">
              {laporanPending.length} BARU
            </span>
          </div>

          {loading ? (
            <div className="flex flex-col gap-3">
              {Array.from({ length: 2 }).map((_, i) => (
                <div key={i} className="h-24 bg-slate-100 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : laporanPerluDitinjau.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-2 py-10 text-slate-400">
              <span className="text-[12.5px]">Tidak ada laporan yang perlu ditinjau saat ini.</span>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {laporanPerluDitinjau.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-3.5 items-start border border-slate-200 rounded-xl p-3.5 hover:border-[#93C5FD] hover:shadow-sm transition-all"
                >
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#EFF6FF] to-[#93C5FD] text-[#0A66C2] font-display font-semibold text-[13px] flex items-center justify-center flex-shrink-0 tracking-wide border border-[#93C5FD]/50">
                    {initials(item.mahasiswaNama)}
                  </div>

                  <div className="flex-1 flex flex-col gap-1">
                    <div className="flex items-center justify-between">
                      <p className="text-[13.5px] font-semibold text-slate-800">{item.mahasiswaNama}</p>
                      <span className="font-mono text-[10px] font-semibold text-amber-600 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full tracking-wide uppercase">
                        Menunggu
                      </span>
                    </div>
                    <p className="text-[12.5px] text-slate-600">{item.judul}</p>
                    <p className="font-mono text-[10.5px] text-slate-400 tracking-wide">
                      {item.perusahaan} &nbsp;·&nbsp; {formatTanggal(item.dikirim)}
                    </p>
                    <div className="flex gap-2 mt-1">
                      {item.file?.url && (
                        <a
                          href={item.file.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 px-3 py-1.5 text-[12px] font-medium text-slate-600 bg-slate-50 border border-slate-200 rounded-lg hover:bg-[#EFF6FF] hover:text-[#0A66C2] hover:border-[#93C5FD] transition-colors cursor-pointer no-underline"
                        >
                          Lihat File
                        </a>
                      )}
                      <button
                        disabled={actionLoadingId === item.id}
                        onClick={() => {
                          const nilai = prompt(`Masukkan nilai untuk laporan "${item.judul}" (0-100):`);
                          if (nilai !== null && nilai !== "") handleReview(item.id, Number(nilai));
                        }}
                        className="inline-flex items-center gap-1 px-3 py-1.5 text-[12px] font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg hover:bg-emerald-100 transition-colors cursor-pointer disabled:opacity-50"
                      >
                        {actionLoadingId === item.id ? "Menyimpan..." : "Beri Nilai"}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Daftar Mahasiswa */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
          <div className="flex items-center justify-between mb-5 pb-4 border-b border-dashed border-slate-200">
            <h2 className="text-[14px] font-bold text-slate-800 flex items-center gap-2.5">
              <span className="w-1 h-4 bg-[#0A66C2] rounded-full inline-block" />
              Daftar Mahasiswa
            </h2>
            <Link href="/penilaian" className="text-[12px] font-semibold text-[#0A66C2] no-underline hover:underline">
              Lihat semua →
            </Link>
          </div>

          {loading ? (
            <div className="flex flex-col gap-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-14 bg-slate-100 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : mahasiswaData.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-2 py-10 text-slate-400">
              <span className="text-[12.5px]">Belum ada mahasiswa bimbingan.</span>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {mahasiswaData.map((mhs) => (
                <div
                  key={mhs.id}
                  className="flex items-center gap-3 border border-slate-200 rounded-xl p-3 hover:border-[#93C5FD] hover:shadow-sm transition-all"
                >
                  <div className="w-9 h-9 rounded-[9px] bg-gradient-to-br from-[#EFF6FF] to-[#93C5FD] text-[#0A66C2] font-display font-semibold text-[11px] flex items-center justify-center flex-shrink-0 tracking-wide border border-[#93C5FD]/50">
                    {initials(mhs.nama)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-[13px] font-semibold text-slate-800 leading-none truncate">{mhs.nama}</p>
                      <StatusBadge status={deriveStatus(mhs.progres, mhs.totalLaporan)} />
                    </div>
                    <p className="font-mono text-[10.5px] text-slate-400 mt-1.5 tracking-wide truncate">
                      {mhs.nim} &nbsp;·&nbsp; {mhs.perusahaan}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}