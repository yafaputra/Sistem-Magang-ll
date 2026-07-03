"use client";

import { useState } from "react";

// ─── Icon Component (gaya sama dengan Dashboard Perusahaan) ───────────────────
function Icon({ name, className = "w-5 h-5", stroke = "currentColor" }) {
  const paths = {
    grid:        <><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></>,
    home:        <><path d="M3 9.5L12 3l9 6.5"/><path d="M5 9v11a1 1 0 0 0 1 1h3v-7h6v7h3a1 1 0 0 0 1-1V9"/></>,
    calendar:    <><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></>,
    clock:       <><circle cx="12" cy="12" r="9"/><polyline points="12 7 12 12 16 14"/></>,
    "map-pin":   <><path d="M21 10c0 7-9 12-9 12s-9-5-9-12a9 9 0 1 1 18 0z"/><circle cx="12" cy="10" r="3"/></>,
    check:       <><polyline points="20 6 9 17 4 12"/></>,
    "check-circle": <><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></>,
    "chev-left":  <><polyline points="15 18 9 12 15 6"/></>,
    "chev-right": <><polyline points="9 18 15 12 9 6"/></>,
    "bar-chart":  <><line x1="12" y1="20" x2="12" y2="10"/><line x1="18" y1="20" x2="18" y2="4"/><line x1="6" y1="20" x2="6" y2="16"/></>,
    list:        <><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></>,
  };
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      {paths[name]}
    </svg>
  );
}

// ─── Constants ───────────────────────────────────────────────────────────────
const MONTH_NAMES = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember",
];

// ─── Data ──────────────────────────────────────────────────────────────────────
const stats = [
  { label: "Total Kegiatan", value: 18, sub: "Selama periode magang", subClass: "text-blue-600",   icon: "calendar",     iconBg: "bg-blue-50",    iconBorder: "border-blue-200",    iconColor: "text-blue-600" },
  { label: "Selesai",        value: 11, sub: "61% tercapai",          subClass: "text-emerald-600",icon: "check-circle", iconBg: "bg-emerald-50", iconBorder: "border-emerald-200", iconColor: "text-emerald-600" },
  { label: "Mendatang",      value: 5,  sub: "Minggu ini & depan",    subClass: "text-amber-500",  icon: "clock",        iconBg: "bg-amber-50",   iconBorder: "border-amber-200",   iconColor: "text-amber-600" },
  { label: "Progres Jadwal", value: "61%", sub: "Dari total kegiatan",subClass: "text-violet-600", icon: "bar-chart",    iconBg: "bg-violet-50",  iconBorder: "border-violet-200",  iconColor: "text-violet-600" },
];

const upcoming = [
  { title: "Bimbingan Mingguan", date: "30 Jun 2026", time: "10.00 - 11.00", loc: "Ruang Meeting A", tag: ["bg-blue-50", "text-blue-700", "border-blue-200"] },
  { title: "Presentasi Progres", date: "3 Jul 2026",  time: "13.00 - 14.30", loc: "Online (Zoom)",   tag: ["bg-violet-50", "text-violet-700", "border-violet-200"] },
  { title: "Evaluasi Tengah Periode", date: "8 Jul 2026", time: "09.00 - 10.00", loc: "Ruang HR",    tag: ["bg-amber-50", "text-amber-700", "border-amber-200"] },
  { title: "Penyerahan Laporan Akhir", date: "20 Jul 2026", time: "08.00 - 09.00", loc: "Kampus",    tag: ["bg-emerald-50", "text-emerald-700", "border-emerald-200"] },
];

const jadwal = [
  { kegiatan: "Orientasi & Onboarding",        tanggal: "1 Feb 2026",  waktu: "08.00 - 12.00", lokasi: "PT Teknologi Nusantara", status: "Selesai" },
  { kegiatan: "Briefing Proyek Pertama",       tanggal: "15 Feb 2026", waktu: "09.00 - 10.30", lokasi: "Ruang Meeting B",        status: "Selesai" },
  { kegiatan: "Pelatihan Tools Internal",      tanggal: "3 Mar 2026",  waktu: "13.00 - 16.00", lokasi: "Lab Komputer",           status: "Selesai" },
  { kegiatan: "Bimbingan Mingguan",            tanggal: "30 Jun 2026", waktu: "10.00 - 11.00", lokasi: "Ruang Meeting A",        status: "Mendatang" },
  { kegiatan: "Presentasi Progres",            tanggal: "3 Jul 2026",  waktu: "13.00 - 14.30", lokasi: "Online (Zoom)",          status: "Mendatang" },
  { kegiatan: "Evaluasi Tengah Periode",       tanggal: "8 Jul 2026",  waktu: "09.00 - 10.00", lokasi: "Ruang HR",                status: "Mendatang" },
  { kegiatan: "Penyerahan Laporan Akhir",      tanggal: "20 Jul 2026", waktu: "08.00 - 09.00", lokasi: "Kampus",                  status: "Mendatang" },
];

const STATUS_STYLE = {
  Selesai:   "bg-emerald-50 text-emerald-700 border-emerald-200",
  Mendatang: "bg-blue-50 text-blue-700 border-blue-200",
  Batal:     "bg-rose-50 text-rose-700 border-rose-200",
};

function StatusBadge({ status }) {
  const dot = {
    Selesai:   "bg-emerald-500",
    Mendatang: "bg-blue-400",
    Batal:     "bg-rose-500",
  }[status] ?? "bg-slate-400";
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border ${STATUS_STYLE[status] ?? "bg-slate-50 text-slate-600 border-slate-200"}`}>
      <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${dot}`} />
      {status}
    </span>
  );
}

// ─── Stat Card ─────────────────────────────────────────────────────────────────
function StatCard({ s }) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col gap-3 transition-all duration-150 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-blue-100/60">
      <div className="flex items-center justify-between">
        <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-widest">{s.label}</span>
        <div className={`w-10 h-10 rounded-xl border flex items-center justify-center flex-shrink-0 ${s.iconBg} ${s.iconBorder}`}>
          <Icon name={s.icon} className={`w-5 h-5 ${s.iconColor}`} />
        </div>
      </div>
      <div className="text-[32px] font-extrabold text-slate-800 leading-none tracking-tight">{s.value}</div>
      <div className={`text-[11.5px] font-semibold flex items-center gap-1 ${s.subClass}`}>{s.sub}</div>
    </div>
  );
}

// ─── Main Page ──────────────────────────────────────────────────────────────────
export default function JadwalMagangPage() {
  const [calDate, setCalDate] = useState(new Date(2026, 5, 1));
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 5;

  const getDaysInMonth  = (y, m) => new Date(y, m + 1, 0).getDate();
  const getFirstWeekday = (y, m) => { const d = new Date(y, m, 1).getDay(); return d === 0 ? 6 : d - 1; };

  const buildCalendarCells = () => {
    const y = calDate.getFullYear(), m = calDate.getMonth();
    const total    = getDaysInMonth(y, m);
    const firstIdx = getFirstWeekday(y, m);
    const prevM    = m === 0 ? 11 : m - 1;
    const prevY    = m === 0 ? y - 1 : y;
    const dPrev    = getDaysInMonth(prevY, prevM);
    const cells    = [];

    for (let i = firstIdx - 1; i >= 0; i--) cells.push({ day: dPrev - i, cur: false, date: new Date(prevY, prevM, dPrev - i) });
    for (let i = 1; i <= total; i++) cells.push({ day: i, cur: true, date: new Date(y, m, i) });
    const nm = m === 11 ? 0 : m + 1, ny = m === 11 ? y + 1 : y;
    for (let i = 1; i <= 42 - cells.length; i++) cells.push({ day: i, cur: false, date: new Date(ny, nm, i) });
    return cells;
  };

  const today = new Date();
  const isToday = (d) => d.getDate() === today.getDate() && d.getMonth() === today.getMonth() && d.getFullYear() === today.getFullYear();

  const hasJadwal = (dateObj) => {
    const d = dateObj.getDate();
    const m = dateObj.getMonth();
    return jadwal.some((j) => {
      const [dd, mmName] = j.tanggal.split(" ");
      const mi = MONTH_NAMES.findIndex((mn) => mn.toLowerCase().startsWith(mmName.toLowerCase().slice(0, 3)));
      return parseInt(dd, 10) === d && mi === m;
    });
  };

  const calCells = buildCalendarCells();

  const totalPages   = Math.ceil(jadwal.length / ITEMS_PER_PAGE);
  const pageStart    = (currentPage - 1) * ITEMS_PER_PAGE;
  const pageEnd      = Math.min(pageStart + ITEMS_PER_PAGE, jadwal.length);
  const currentItems = jadwal.slice(pageStart, pageEnd);
  const changePage   = (p) => { if (p >= 1 && p <= totalPages) setCurrentPage(p); };

  return (
    <div className="font-sans bg-slate-50 min-h-screen">

      {/* ── Header ── */}
      <div className="flex items-center justify-between px-8 py-4 bg-white border-b border-slate-200">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center flex-shrink-0">
            <Icon name="calendar" className="w-4.5 h-4.5" />
          </div>
          <div>
            <div className="text-[18px] font-bold text-slate-800 tracking-tight leading-snug">Jadwal Magang</div>
            <div className="text-[11.5px] text-slate-400 mt-0.5">Pantau seluruh agenda dan kegiatan magangmu</div>
          </div>
        </div>
        <button
          onClick={() => (window.location.href = "/")}
          className="flex items-center gap-2 px-4 py-2 border border-blue-300 rounded-xl text-blue-600 text-[12.5px] font-semibold bg-transparent transition-all duration-150 hover:bg-blue-500 hover:text-white hover:border-blue-500 cursor-pointer"
        >
          <div className="w-6 h-6 rounded-lg bg-blue-100 border border-blue-200 flex items-center justify-center flex-shrink-0">
            <Icon name="home" className="w-3.5 h-3.5" />
          </div>
          Back to homepage
        </button>
      </div>

      {/* ── Body ── */}
      <div className="px-8 py-6 flex flex-col gap-5">

        {/* Stats */}
        <div className="grid grid-cols-4 gap-3.5">
          {stats.map((s, i) => <StatCard key={i} s={s} />)}
        </div>

        {/* Middle row: Calendar + Agenda Mendatang */}
        <div className="grid grid-cols-2 gap-5">

          {/* Calendar card */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-5">
              <span className="text-[15px] font-bold text-slate-800">
                {MONTH_NAMES[calDate.getMonth()]} {calDate.getFullYear()}
              </span>
              <div className="flex gap-1.5">
                <button
                  onClick={() => setCalDate(new Date(calDate.getFullYear(), calDate.getMonth() - 1, 1))}
                  className="w-8 h-8 rounded-lg border border-slate-200 bg-white flex items-center justify-center text-slate-500 hover:bg-blue-50 hover:text-blue-600 active:scale-95 transition-all cursor-pointer"
                >
                  <Icon name="chev-left" className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setCalDate(new Date(calDate.getFullYear(), calDate.getMonth() + 1, 1))}
                  className="w-8 h-8 rounded-lg border border-slate-200 bg-white flex items-center justify-center text-slate-500 hover:bg-blue-50 hover:text-blue-600 active:scale-95 transition-all cursor-pointer"
                >
                  <Icon name="chev-right" className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-7 mb-1 text-center">
              {["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"].map((d) => (
                <span key={d} className="text-[10.5px] font-bold uppercase tracking-wider text-slate-400 py-1">{d}</span>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-y-1 text-center">
              {calCells.map((cell, idx) => {
                const has = cell.cur && hasJadwal(cell.date);
                const tod = isToday(cell.date);
                return (
                  <div key={idx} className="flex flex-col items-center justify-center py-0.5">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-[12.5px] font-medium relative transition-all
                        ${!cell.cur ? "text-slate-300 font-normal" : "text-slate-800"}
                        ${tod ? "border-[1.5px] border-blue-500 text-blue-600 font-bold" : ""}
                        ${has && !tod ? "bg-blue-50 text-blue-600 font-semibold" : ""}
                      `}
                    >
                      {cell.day}
                      {has && <span className="absolute bottom-1 w-1 h-1 rounded-full bg-blue-500" />}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex items-center gap-4 mt-4 pt-4 border-t border-slate-100">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-blue-500" />
                <span className="text-[11.5px] text-slate-500 font-medium">Ada agenda</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full border-[1.5px] border-blue-500" />
                <span className="text-[11.5px] text-slate-500 font-medium">Hari ini</span>
              </div>
            </div>
          </div>

          {/* Agenda Mendatang */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6">
            <div className="flex items-center gap-2.5 mb-5">
              <div className="w-7 h-7 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-center flex-shrink-0">
                <Icon name="clock" className="w-3.5 h-3.5 text-amber-600" />
              </div>
              <span className="text-[14px] font-bold text-slate-800">Agenda Mendatang</span>
            </div>
            <div className="flex flex-col gap-3">
              {upcoming.map((u, i) => (
                <div key={i} className="flex items-center gap-3 p-3.5 rounded-xl border border-slate-100 hover:border-blue-200 hover:bg-blue-50/40 transition-all duration-150">
                  <div className={`w-11 h-11 rounded-xl border flex flex-col items-center justify-center flex-shrink-0 ${u.tag[0]} ${u.tag[2]}`}>
                    <span className={`text-[13px] font-extrabold leading-none ${u.tag[1]}`}>{u.date.split(" ")[0]}</span>
                    <span className={`text-[8.5px] font-bold uppercase ${u.tag[1]}`}>{u.date.split(" ")[1]}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[13px] font-semibold text-slate-800 truncate">{u.title}</div>
                    <div className="text-[11.5px] text-slate-400 mt-0.5 flex items-center gap-1">
                      <Icon name="map-pin" className="w-3 h-3" /> {u.loc} · {u.time}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Daftar Jadwal Magang */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-violet-50 border border-violet-200 flex items-center justify-center flex-shrink-0">
                <Icon name="list" className="w-3.5 h-3.5 text-violet-600" />
              </div>
              <span className="text-[14px] font-bold text-slate-800">Daftar Jadwal Magang</span>
              <span className="text-[11px] font-semibold text-slate-400 bg-slate-100 px-2.5 py-0.5 rounded-full">{jadwal.length}</span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  {["Kegiatan", "Tanggal", "Waktu", "Lokasi", "Status"].map((h) => (
                    <th key={h} className="text-left text-[10px] font-bold tracking-widest uppercase text-slate-400 pb-3 pr-3 border-b border-slate-100">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {currentItems.map((j, i) => (
                  <tr key={i} className="group hover:bg-slate-50 transition-colors">
                    <td className="py-3 pr-3 border-b border-slate-50 group-last:border-0">
                      <div className="text-[13px] font-semibold text-slate-800">{j.kegiatan}</div>
                    </td>
                    <td className="py-3 pr-3 text-[12.5px] text-slate-600 border-b border-slate-50 group-last:border-0">{j.tanggal}</td>
                    <td className="py-3 pr-3 text-[12.5px] text-slate-500 font-mono border-b border-slate-50 group-last:border-0">{j.waktu}</td>
                    <td className="py-3 pr-3 border-b border-slate-50 group-last:border-0">
                      <span className="inline-flex items-center gap-1.5 text-[12px] text-slate-500">
                        <div className="w-5 h-5 rounded-md bg-slate-100 border border-slate-200 flex items-center justify-center flex-shrink-0">
                          <Icon name="map-pin" className="w-3 h-3 text-slate-400" />
                        </div>
                        {j.lokasi}
                      </span>
                    </td>
                    <td className="py-3 pr-3 border-b border-slate-50 group-last:border-0">
                      <StatusBadge status={j.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between mt-5">
            <span className="text-[12.5px] text-slate-400 font-medium">
              Menampilkan {pageStart + 1}–{pageEnd} dari {jadwal.length}
            </span>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => changePage(currentPage - 1)}
                disabled={currentPage === 1}
                className={`w-8 h-8 rounded-lg border flex items-center justify-center transition-all
                  ${currentPage === 1 ? "border-slate-200 bg-slate-50 text-slate-300 cursor-not-allowed" : "border-slate-200 bg-white text-slate-500 hover:bg-blue-50 hover:text-blue-600 active:scale-95 cursor-pointer"}`}
              >
                <Icon name="chev-left" className="w-3.5 h-3.5" />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => changePage(p)}
                  className={`w-8 h-8 rounded-lg text-[13px] font-bold transition-all cursor-pointer
                    ${p === currentPage ? "bg-slate-800 text-white border border-slate-800" : "border border-slate-200 bg-white text-slate-500 hover:bg-blue-50 hover:text-blue-600"}`}
                >
                  {p}
                </button>
              ))}
              <button
                onClick={() => changePage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`w-8 h-8 rounded-lg border flex items-center justify-center transition-all
                  ${currentPage === totalPages ? "border-slate-200 bg-slate-50 text-slate-300 cursor-not-allowed" : "border-slate-200 bg-white text-slate-500 hover:bg-blue-50 hover:text-blue-600 active:scale-95 cursor-pointer"}`}
              >
                <Icon name="chev-right" className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}