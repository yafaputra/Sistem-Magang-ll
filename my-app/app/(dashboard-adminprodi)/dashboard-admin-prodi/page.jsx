"use client";

import { useEffect, useRef, useState } from "react";

import useAuth from "@/hooks/useAuth";
import Topbar from "../components/topbar";

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/api`;

const FONTS = `
@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600;9..144,700&family=IBM+Plex+Mono:wght@400;500;600&display=swap');
.font-display { font-family: 'Fraunces', 'Georgia', serif; }
.font-mono { font-family: 'IBM Plex Mono', 'Courier New', monospace; }
`;

const chartMonths = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];

function initials(nama) {
  return (nama || "?").split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase();
}

function relativeTime(dateStr) {
  if (!dateStr) return "-";
  const diffMs = Date.now() - new Date(dateStr).getTime();
  const menit = Math.floor(diffMs / 60000);
  if (menit < 1) return "BARU SAJA";
  if (menit < 60) return `${menit} MNT LALU`;
  const jam = Math.floor(menit / 60);
  if (jam < 24) return `${jam} JAM LALU`;
  const hari = Math.floor(jam / 24);
  if (hari === 1) return "KEMARIN";
  return `${hari} HARI LALU`;
}

// Map status lamaran ke label + warna badge yang dipakai di UI
const STATUS_BADGE = {
  PENDING_BERKAS:        { label: "Menunggu", color: "amber" },
  BERKAS_DITERIMA:       { label: "Berkas OK", color: "blue" },
  BERKAS_DITOLAK:        { label: "Ditolak", color: "red" },
  INTERVIEW_DIJADWALKAN: { label: "Interview", color: "blue" },
  LOLOS_INTERVIEW:       { label: "Lolos", color: "green" },
  TIDAK_LOLOS_INTERVIEW: { label: "Tidak Lolos", color: "red" },
  DITERIMA_MAGANG:       { label: "Diterima", color: "green" },
  DITOLAK:               { label: "Ditolak", color: "red" },
  KONFIRMASI_DITERIMA:   { label: "Aktif Magang", color: "green" },
};

// ─── Sub-components ──────────────────────────────────────────────────────────

function StatCard({ label, value, trend, icon, loading }) {
  return (
    <div className="bg-white border border-[#e8e8f0] rounded-[12px] p-[18px] flex flex-col gap-[10px]">
      <div className="flex items-start justify-between">
        <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#9898b0] font-semibold">{label}</span>
        <div className="w-9 h-9 rounded-[10px] bg-[#0A66C2]/10 text-[#0A66C2] border border-[#0A66C2]/20 flex items-center justify-center">
          {icon}
        </div>
      </div>
      {loading ? (
        <div className="h-[30px] w-16 bg-slate-100 rounded animate-pulse" />
      ) : (
        <div className="font-display text-[30px] font-semibold text-[#1e1e2e] leading-none tracking-tight">{value}</div>
      )}
      <div className="flex items-center gap-1 font-mono text-[10.5px] tracking-wide text-[#22c997]">
        {trend}
      </div>
    </div>
  );
}

const badgeStyles = {
  green: "bg-[#ccfbf3] text-[#0d9488]",
  blue:  "bg-[#e6f1fb] text-[#185fa5]",
  amber: "bg-[#faeeda] text-[#854f0b]",
  red:   "bg-[#fcebeb] text-[#a32d2d]",
};

const avatarStyles = [
  "bg-[#dbeafe] text-[#2563eb]",
  "bg-[#cffafe] text-[#0891b2]",
  "bg-[#fef3c7] text-[#d97706]",
  "bg-[#d1fae5] text-[#059669]",
];

function ActivityItem({ item, index }) {
  const badge = STATUS_BADGE[item.status] || { label: item.status || "-", color: "blue" };
  return (
    <div className="flex items-start gap-3 py-[10px] border-b border-dashed border-[#f0f0f8] last:border-b-0 last:pb-0">
      <div className={`w-9 h-9 rounded-[10px] flex items-center justify-center flex-shrink-0 font-display text-[13px] font-semibold ${avatarStyles[index % avatarStyles.length]}`}>
        {initials(item.name)}
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-[13px] font-semibold text-[#1e1e2e]">{item.name}</div>
        <div className="text-[11.5px] text-[#9898b0] mt-[2px]">
          Melamar posisi <span className="font-semibold text-[#555]">{item.posisi}</span>{" "}
          <span className={`font-mono inline-block text-[10px] uppercase tracking-wide font-semibold px-[8px] py-[2px] rounded-full ${badgeStyles[badge.color]}`}>
            {badge.label}
          </span>
        </div>
      </div>
      <div className="font-mono text-[10px] tracking-wide text-[#b0b0c8] flex-shrink-0 pt-[1px]">{relativeTime(item.createdAt)}</div>
    </div>
  );
}

// PendingItem sekarang menampilkan PERUSAHAAN yang menunggu verifikasi pendaftaran
// (bukan lamaran mahasiswa) — sumber data: GET /api/verifikasi-perusahaan
function PendingItem({ item, onAksi, actionLoadingId }) {
  const isLoading = actionLoadingId === item.id;
  return (
    <div className="flex items-center gap-3 py-[10px] border-b border-dashed border-[#f0f0f8] last:border-b-0 last:pb-0">
      <div className="w-9 h-9 rounded-[10px] bg-[#e0e7ff] border border-[#c7d2fe] flex items-center justify-center flex-shrink-0 text-[#4f46e5] font-display text-[13px] font-semibold">
        {initials(item.nama).substring(0, 2)}
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-[13px] font-semibold text-[#1e1e2e] truncate">{item.nama}</div>
        <div className="font-mono text-[10.5px] text-[#9898b0] mt-[2px] tracking-wide truncate">
          {item.bidang} &nbsp;·&nbsp; {item.namaCP || "-"}
        </div>
      </div>
      <div className="flex gap-[6px] flex-shrink-0">
        <button
          disabled={isLoading}
          onClick={() => onAksi(item.id, "DITERIMA")}
          className="font-mono uppercase tracking-wide px-[10px] py-[5px] rounded-[6px] text-[10.5px] font-semibold bg-[#ccfbf3] text-[#0d9488] border-none cursor-pointer transition-all duration-150 hover:bg-[#0d9488] hover:text-white disabled:opacity-50"
        >
          Setujui
        </button>
        <button
          disabled={isLoading}
          onClick={() => onAksi(item.id, "DITOLAK")}
          className="font-mono uppercase tracking-wide px-[10px] py-[5px] rounded-[6px] text-[10.5px] font-semibold bg-[#fee2e2] text-[#dc2626] border-none cursor-pointer transition-all duration-150 hover:bg-[#dc2626] hover:text-white disabled:opacity-50"
        >
          Tolak
        </button>
      </div>
    </div>
  );
}

function MagangChart({ chartData }) {
  const canvasRef = useRef(null);
  const chartRef  = useRef(null);

  useEffect(() => {
    const initChart = () => {
      const canvas = canvasRef.current;
      if (!canvas || !window.Chart) return;

      if (chartRef.current) {
        chartRef.current.destroy();
      }

      const ctx = canvas.getContext("2d");
      chartRef.current = new window.Chart(ctx, {
        type: "line",
        data: {
          labels: chartMonths,
          datasets: [
            {
              data: chartData,
              fill: true,
              tension: 0.45,
              borderColor: "#3b82f6",
              borderWidth: 2,
              pointRadius: 0,
              pointHoverRadius: 5,
              pointHoverBackgroundColor: "#3b82f6",
              backgroundColor: (context) => {
                const gradient = context.chart.ctx.createLinearGradient(0, 0, 0, 200);
                gradient.addColorStop(0, "rgba(59, 130, 246, 0.20)");
                gradient.addColorStop(1, "rgba(59, 130, 246, 0.01)");
                return gradient;
              },
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          interaction: { mode: "index", intersect: false },
          plugins: {
            legend: { display: false },
            tooltip: {
              backgroundColor: "#1e1e2e",
              titleColor: "#fff",
              bodyColor: "#ccc",
              padding: 10,
              cornerRadius: 8,
              displayColors: false,
              titleFont: { family: "'IBM Plex Mono', monospace", size: 11 },
              bodyFont: { family: "'IBM Plex Mono', monospace", size: 11 },
            },
          },
          scales: {
            x: {
              grid: { display: false },
              border: { display: false },
              ticks: { font: { family: "'IBM Plex Mono', monospace", size: 11 }, color: "#b0b0c8" },
            },
            y: {
              grid: { color: "rgba(0,0,0,0.04)", drawBorder: false },
              border: { display: false },
              ticks: { font: { family: "'IBM Plex Mono', monospace", size: 11 }, color: "#b0b0c8" },
              beginAtZero: true,
            },
          },
        },
      });
    };

    if (window.Chart) {
      initChart();
    } else {
      const script = document.createElement("script");
      script.src = "https://cdn.jsdelivr.net/npm/chart.js@4.4.1/dist/chart.umd.min.js";
      script.onload = initChart;
      document.head.appendChild(script);
    }

    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
        chartRef.current = null;
      }
    };
  }, [chartData]);

  return (
    <div className="bg-white border border-[#e8e8f0] rounded-[12px] p-[20px] mb-5">
      <div className="flex items-center gap-2.5 mb-4 pb-3 border-b border-dashed border-[#f0f0f8]">
        <h2 className="text-[14px] font-bold text-[#1e1e2e] flex-1">Statistik Magang</h2>
        <span className="font-mono text-[10px] text-[#b0b0c8] tracking-wide">JAN–DES {new Date().getFullYear()}</span>
      </div>
      <div className="h-[180px] relative">
        <canvas ref={canvasRef} />
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function DashboardAdminProdi() {
  useAuth("admin");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lamaranStats, setLamaranStats] = useState({ total: 0, pending: 0, review: 0, approved: 0, rejected: 0 });
  const [magangAktifCount, setMagangAktifCount] = useState(0);
  const [totalPerusahaan, setTotalPerusahaan] = useState(0);
  const [totalMahasiswa, setTotalMahasiswa] = useState(0); // ✅ data asli, bukan dummy lagi
  const [recentLamaran, setRecentLamaran] = useState([]);
  const [pendingPerusahaan, setPendingPerusahaan] = useState([]); // ✅ perusahaan menunggu verifikasi pendaftaran
  const [chartData, setChartData] = useState(Array(12).fill(0));
  const [actionLoadingId, setActionLoadingId] = useState(null);

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };

      // ── 1. Semua lamaran (admin) untuk stats, aktivitas terbaru, & chart ──
      //    Catatan: limit dinaikkan supaya chart per-bulan cukup representatif.
      //    Kalau data lamaran sudah banyak, sebaiknya backend punya endpoint
      //    agregat khusus (misal GET /api/lamaran/stats-bulanan) daripada
      //    menarik semua row seperti ini.
      const lamaranRes = await fetch(`${API_URL}/lamaran?limit=500`, { headers });
      const lamaranJson = await lamaranRes.json();
      if (!lamaranRes.ok) throw new Error(lamaranJson.message || "Gagal mengambil data lamaran");

      const semuaLamaran = lamaranJson.data || [];
      setLamaranStats(lamaranJson.stats || { total: 0, pending: 0, review: 0, approved: 0, rejected: 0 });

      // Magang aktif = status KONFIRMASI_DITERIMA
      const aktif = semuaLamaran.filter((l) => l.status === "KONFIRMASI_DITERIMA");
      setMagangAktifCount(aktif.length);

      // Aktivitas terbaru = 4 lamaran paling baru
      const terbaru = [...semuaLamaran]
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 4)
        .map((l) => ({
          id: l.id,
          name: l.name,
          posisi: l.lowongan?.posisi || "-",
          status: l.status,
          createdAt: l.createdAt,
        }));
      setRecentLamaran(terbaru);

      // Chart: hitung jumlah lamaran masuk per bulan (tahun berjalan)
      const tahunIni = new Date().getFullYear();
      const perBulan = Array(12).fill(0);
      semuaLamaran.forEach((l) => {
        const d = new Date(l.createdAt);
        if (d.getFullYear() === tahunIni) perBulan[d.getMonth()] += 1;
      });
      setChartData(perBulan);

      // ── 2. Total perusahaan ──────────────────────────────────────────────
      //    getAllPerusahaan didaftarkan di perusahaanProfileRoutes.js dengan
      //    path "/public", dan di-mount sebagai app.use("/api/perusahaan", ...)
      //    Jadi path lengkapnya: /api/perusahaan/public
      const perusahaanRes = await fetch(`${API_URL}/perusahaan/public`);
      if (perusahaanRes.ok) {
        const perusahaanJson = await perusahaanRes.json();
        setTotalPerusahaan((perusahaanJson.data || []).length);
      }

      // ── 3. Total mahasiswa ───────────────────────────────────────────────
      //    Route ini didaftarkan di mahasiswaRoutes.js, dan di server.js
      //    di-mount sebagai: app.use("/api/mahasiswa", mahasiswaRoutes)
      //    Jadi path lengkapnya: /api/mahasiswa/admin/mahasiswa/count
      const mahasiswaRes = await fetch(`${API_URL}/mahasiswa/admin/mahasiswa/count`, { headers });
      if (mahasiswaRes.ok) {
        const mahasiswaJson = await mahasiswaRes.json();
        setTotalMahasiswa(mahasiswaJson.total || 0);
      }

      // ── 4. Perusahaan yang menunggu verifikasi pendaftaran ────────────────
      //    Sama seperti halaman ValidasiPerusahaanPage — status yang belum
      //    DITERIMA / DITOLAK dianggap "pending".
      const verifikasiRes = await fetch(`${API_URL}/verifikasi-perusahaan`, { headers });
      if (verifikasiRes.ok) {
        const verifikasiJson = await verifikasiRes.json();
        const semuaPerusahaan = verifikasiJson.data || [];

        const pendingPerusahaanList = semuaPerusahaan
          .filter(
            (p) => p.statusVerifikasi !== "DITERIMA" && p.statusVerifikasi !== "DITOLAK"
          )
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 4)
          .map((p) => ({
            id: p.id,
            nama: p.nama || "-",
            bidang: p.bidang || "-",
            namaCP: p.namaCP || p.user?.name || "-",
          }));

        setPendingPerusahaan(pendingPerusahaanList);
      }

    } catch (err) {
      setError(err.message || "Gagal memuat data dashboard");
    } finally {
      setLoading(false);
    }
  }

  // Setujui/Tolak PERUSAHAAN yang menunggu verifikasi pendaftaran
  // statusVerifikasi: "DITERIMA" | "DITOLAK"
  async function handleAksiValidasi(perusahaanId, statusVerifikasi) {
    setActionLoadingId(perusahaanId);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/verifikasi-perusahaan/${perusahaanId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ statusVerifikasi }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || "Gagal memperbarui status verifikasi");
      await loadDashboard(); // refresh semua data setelah aksi
    } catch (err) {
      setError(err.message);
    } finally {
      setActionLoadingId(null);
    }
  }

  const statCards = [
    {
      label: "Total Mahasiswa",
      value: totalMahasiswa, // ✅ sekarang diambil dari server (prisma.mahasiswa.count())
      trend: "Mahasiswa terdaftar",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
          <path d="M6 12v5c3 3 9 3 12 0v-5" />
        </svg>
      ),
    },
    {
      label: "Menunggu Validasi",
      value: pendingPerusahaan.length,
      trend: "Perusahaan belum diverifikasi",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
      ),
    },
    {
      label: "Total Perusahaan",
      value: totalPerusahaan,
      trend: "Perusahaan terdaftar",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
      ),
    },
    {
      label: "Magang Aktif",
      value: magangAktifCount,
      trend: "Mahasiswa sedang magang",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <polyline points="16 11 18 13 22 9" />
        </svg>
      ),
    },
  ];

  return (
    <div className="flex min-h-screen bg-[#f5f5fb] font-sans">
      <style>{FONTS}</style>

      <div className="flex-1 flex flex-col min-w-0">

        <Topbar
          icon={<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
                  <rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" />
                </svg>}
          title="Dashboard Admin Prodi"
          subtitle="Kelola program magang mahasiswa"
          rightSlot={
            <button className="flex items-center gap-2 px-4 py-2 border border-[#0A66C2]/40 rounded-xl text-[#0A66C2] text-[12.5px] font-semibold bg-transparent transition-all duration-150 hover:bg-[#0958A8] hover:text-white hover:border-[#0A66C2] cursor-pointer">
              <div className="w-6 h-6 rounded-lg bg-[#0A66C2]/10 border border-[#0A66C2]/20 flex items-center justify-center flex-shrink-0">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 9.5L12 3l9 6.5" />
                <path d="M5 9v11a1 1 0 0 0 1 1h3v-7h6v7h3a1 1 0 0 0 1-1V9" />
              </svg>
              </div>
              Back to homepage
            </button>
          }
        />

        <main className="flex-1 p-7">

          {error && (
            <div className="mb-5 bg-rose-50 border border-rose-200 text-rose-700 text-[13px] rounded-xl px-4 py-3">
              {error}
            </div>
          )}

          {/* Stat Cards */}
          <div className="grid grid-cols-4 gap-[14px] mb-5">
            {statCards.map((card) => (
              <StatCard key={card.label} {...card} loading={loading} />
            ))}
          </div>

          {/* Chart */}
          <MagangChart chartData={chartData} />

          {/* Bottom panels */}
          <div className="grid grid-cols-2 gap-4">

            {/* Aktifitas Terbaru */}
            <div className="bg-white border border-[#e8e8f0] rounded-[12px] p-[20px]">
              <h2 className="text-[14px] font-bold text-[#1e1e2e] mb-[14px] pb-3 border-b border-dashed border-[#f0f0f8]">Aktifitas Terbaru</h2>
              {loading ? (
                <div className="flex flex-col gap-3">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="h-10 bg-slate-100 rounded-lg animate-pulse" />
                  ))}
                </div>
              ) : recentLamaran.length === 0 ? (
                <p className="text-[12.5px] text-slate-400 py-6 text-center">Belum ada aktivitas lamaran.</p>
              ) : (
                recentLamaran.map((item, i) => (
                  <ActivityItem key={item.id} item={item} index={i} />
                ))
              )}
            </div>

            {/* Validasi Pendaftaran — PERUSAHAAN yang menunggu verifikasi */}
            <div className="bg-white border border-[#e8e8f0] rounded-[12px] p-[20px]">
              <h2 className="text-[14px] font-bold text-[#1e1e2e] mb-[14px] pb-3 border-b border-dashed border-[#f0f0f8]">Validasi Pendaftaran</h2>
              {loading ? (
                <div className="flex flex-col gap-3">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="h-10 bg-slate-100 rounded-lg animate-pulse" />
                  ))}
                </div>
              ) : pendingPerusahaan.length === 0 ? (
                <p className="text-[12.5px] text-slate-400 py-6 text-center">Tidak ada perusahaan yang menunggu verifikasi.</p>
              ) : (
                pendingPerusahaan.map((item) => (
                  <PendingItem
                    key={item.id}
                    item={item}
                    onAksi={handleAksiValidasi}
                    actionLoadingId={actionLoadingId}
                  />
                ))
              )}
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}