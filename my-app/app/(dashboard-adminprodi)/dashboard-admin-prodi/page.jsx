"use client";

import { useEffect, useRef } from "react";

import useAuth from "../../hooks/useAuth";
import Topbar from "../components/topbar";

// ─── Fonts — matches Fraunces (display) + IBM Plex Mono (utility) used across mahasiswa & dosen dashboards ──
const FONTS = `
@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600;9..144,700&family=IBM+Plex+Mono:wght@400;500;600&display=swap');
.font-display { font-family: 'Fraunces', 'Georgia', serif; }
.font-mono { font-family: 'IBM Plex Mono', 'Courier New', monospace; }
`;

// ─── Data ───────────────────────────────────────────────────────────────────

const statCards = [
  {
    label: "Total Mahasiswa",
    value: "120",
    trend: "+12 NAIK BULAN INI",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
        <path d="M6 12v5c3 3 9 3 12 0v-5" />
      </svg>
    ),
    iconBg:     "bg-[#dbeafe]",
    iconColor:  "text-[#3b82f6]",
    iconBorder: "border border-[#bfdbfe]",  // ← biru senada
  },
  {
    label: "Menunggu Validasi",
    value: "2040",
    trend: "+12 NAIK BULAN INI",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    ),
    iconBg:     "bg-[#dbeafe]",
    iconColor:  "text-[#3b82f6]",
    iconBorder: "border border-[#bfdbfe]",  // ← biru senada
  },
  {
    label: "Total Perusahaan",
    value: "2040",
    trend: "+12 NAIK BULAN INI",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
    iconBg:     "bg-[#dbeafe]",
    iconColor:  "text-[#3b82f6]",
    iconBorder: "border border-[#bfdbfe]",  // ← biru senada
  },
  {
    label: "Magang Aktif",
    value: "120",
    trend: "+12 NAIK BULAN INI",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <polyline points="16 11 18 13 22 9" />
      </svg>
    ),
    iconBg:     "bg-[#dbeafe]",
    iconColor:  "text-[#3b82f6]",
    iconBorder: "border border-[#bfdbfe]",  // ← biru senada
  },
];

const activities = [
  {
    initials: "AR",
    name: "Arif Rahmadan",
    desc: "Melamar posisi",
    highlight: "UI/UX Designer",
    badge: "Diterima",
    badgeColor: "green",
    time: "5 MNT LALU",
  },
  {
    initials: "DN",
    name: "Dina Nurhayati",
    desc: "Mengirim laporan",
    highlight: "Minggu ke-3",
    badge: "Laporan",
    badgeColor: "blue",
    time: "1 JAM LALU",
  },
  {
    initials: "BW",
    name: "Bima Wicaksono",
    desc: "Melamar posisi",
    highlight: "Backend Developer",
    badge: "Menunggu",
    badgeColor: "amber",
    time: "3 JAM LALU",
  },
  {
    initials: "SR",
    name: "Sari Rahayu",
    desc: "Selesai magang",
    highlight: "Data Analyst",
    badge: "Selesai",
    badgeColor: "green",
    time: "KEMARIN",
  },
];

const pendingApplicants = [
  { initials: "PM", name: "PT Maju Teknologi",  position: "Frontend Developer", prodi: "Teknik Informatika" },
  { initials: "CK", name: "CV Kreativ Digital", position: "UI/UX Designer",     prodi: "Desain Komunikasi" },
  { initials: "DH", name: "PT Data Husada",     position: "Data Analyst",        prodi: "Sistem Informasi" },
  { initials: "SI", name: "Startup Inovasi ID", position: "Backend Developer",   prodi: "Teknik Informatika" },
];

const chartMonths = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
const chartData   = [210, 240, 290, 380, 460, 420, 370, 390, 340, 390, 430, 480];

// ─── Sub-components ──────────────────────────────────────────────────────────

function StatCard({ label, value, trend, icon, iconBg, iconColor, iconBorder }) {
  return (
    <div className="bg-white border border-[#e8e8f0] rounded-[12px] p-[18px] flex flex-col gap-[10px]">
      <div className="flex items-start justify-between">
        <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#9898b0] font-semibold">{label}</span>
        {/* ← iconBorder diterapkan di sini */}
        <div className={`w-9 h-9 rounded-[10px] ${iconBg} ${iconColor} ${iconBorder} flex items-center justify-center`}>
          {icon}
        </div>
      </div>
      <div className="font-display text-[30px] font-semibold text-[#1e1e2e] leading-none tracking-tight">{value}</div>
      <div className="flex items-center gap-1 font-mono text-[10.5px] tracking-wide text-[#22c997]">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
          <polyline points="17 6 23 6 23 12" />
        </svg>
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
  return (
    <div className="flex items-start gap-3 py-[10px] border-b border-dashed border-[#f0f0f8] last:border-b-0 last:pb-0">
      <div className={`w-9 h-9 rounded-[10px] flex items-center justify-center flex-shrink-0 font-display text-[13px] font-semibold ${avatarStyles[index % avatarStyles.length]}`}>
        {item.initials}
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-[13px] font-semibold text-[#1e1e2e]">{item.name}</div>
        <div className="text-[11.5px] text-[#9898b0] mt-[2px]">
          {item.desc} <span className="font-semibold text-[#555]">{item.highlight}</span>{" "}
          <span className={`font-mono inline-block text-[10px] uppercase tracking-wide font-semibold px-[8px] py-[2px] rounded-full ${badgeStyles[item.badgeColor]}`}>
            {item.badge}
          </span>
        </div>
      </div>
      <div className="font-mono text-[10px] tracking-wide text-[#b0b0c8] flex-shrink-0 pt-[1px]">{item.time}</div>
    </div>
  );
}

function PendingItem({ item }) {
  return (
    <div className="flex items-center gap-3 py-[10px] border-b border-dashed border-[#f0f0f8] last:border-b-0 last:pb-0">
      {/* avatar pending — border indigo senada dengan bg-[#e0e7ff] */}
      <div className="w-9 h-9 rounded-[10px] bg-[#e0e7ff] border border-[#c7d2fe] flex items-center justify-center flex-shrink-0 text-[#4f46e5] font-display text-[13px] font-semibold">
        {item.initials.substring(0, 1)}
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-[13px] font-semibold text-[#1e1e2e] truncate">{item.name}</div>
        <div className="font-mono text-[10.5px] text-[#9898b0] mt-[2px] tracking-wide truncate">
          {item.position} &nbsp;·&nbsp; {item.prodi}
        </div>
      </div>
      <div className="flex gap-[6px] flex-shrink-0">
        <button className="font-mono uppercase tracking-wide px-[10px] py-[5px] rounded-[6px] text-[10.5px] font-semibold bg-[#ccfbf3] text-[#0d9488] border-none cursor-pointer transition-all duration-150 hover:bg-[#0d9488] hover:text-white">
          Terima
        </button>
        <button className="font-mono uppercase tracking-wide px-[10px] py-[5px] rounded-[6px] text-[10.5px] font-semibold bg-[#fee2e2] text-[#dc2626] border-none cursor-pointer transition-all duration-150 hover:bg-[#dc2626] hover:text-white">
          Tolak
        </button>
      </div>
    </div>
  );
}

function MagangChart() {
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
              beginAtZero: false,
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
  }, []);

  return (
    <div className="bg-white border border-[#e8e8f0] rounded-[12px] p-[20px] mb-5">
      <div className="flex items-center gap-2.5 mb-4 pb-3 border-b border-dashed border-[#f0f0f8]">
        <h2 className="text-[14px] font-bold text-[#1e1e2e] flex-1">Statistik Magang</h2>
        <span className="font-mono text-[10px] text-[#b0b0c8] tracking-wide">JAN–DES 2025</span>
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

  return (
    <div className="flex min-h-screen bg-[#f5f5fb] font-sans">
      <style>{FONTS}</style>

      <div className="flex-1 flex flex-col min-w-0">

        {/* Header */}
        
        <Topbar
          icon={<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
                  <rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" />
                </svg>}
          title="Dashboard Admin Prodi"
          subtitle="Kelola program magang mahasiswa"
          rightSlot={
            <button className="flex items-center gap-2 px-4 py-2 border border-blue-300 rounded-xl text-blue-600 text-[12.5px] font-semibold bg-transparent transition-all duration-150 hover:bg-blue-500 hover:text-white hover:border-blue-500 cursor-pointer">
              <div className="w-6 h-6 rounded-lg bg-blue-100 border border-blue-200 flex items-center justify-center flex-shrink-0">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 9.5L12 3l9 6.5" />
                <path d="M5 9v11a1 1 0 0 0 1 1h3v-7h6v7h3a1 1 0 0 0 1-1V9" />
              </svg>
              </div>
              Back to homepage
            </button>
          }
        />
        {/* Content */}
        <main className="flex-1 p-7">

          {/* Stat Cards */}
          <div className="grid grid-cols-4 gap-[14px] mb-5">
            {statCards.map((card) => (
              <StatCard key={card.label} {...card} />
            ))}
          </div>

          {/* Chart */}
          <MagangChart />

          {/* Bottom panels */}
          <div className="grid grid-cols-2 gap-4">

            {/* Aktifitas Terbaru */}
            <div className="bg-white border border-[#e8e8f0] rounded-[12px] p-[20px]">
              <h2 className="text-[14px] font-bold text-[#1e1e2e] mb-[14px] pb-3 border-b border-dashed border-[#f0f0f8]">Aktifitas Terbaru</h2>
              {activities.map((item, i) => (
                <ActivityItem key={item.name} item={item} index={i} />
              ))}
            </div>

            {/* Validasi Pendaftaran */}
            <div className="bg-white border border-[#e8e8f0] rounded-[12px] p-[20px]">
              <h2 className="text-[14px] font-bold text-[#1e1e2e] mb-[14px] pb-3 border-b border-dashed border-[#f0f0f8]">Validasi Pendaftaran</h2>
              {pendingApplicants.map((item) => (
                <PendingItem key={item.name} item={item} />
              ))}
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}