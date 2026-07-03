"use client";
import Topbar from "../components/topbar";

// ─── Fonts — matches Fraunces (display) + IBM Plex Mono (utility) used across mahasiswa, dosen & admin prodi dashboards ──
const FONTS = `
@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600;9..144,700&family=IBM+Plex+Mono:wght@400;500;600&display=swap');
.font-display { font-family: 'Fraunces', 'Georgia', serif; }
.font-mono { font-family: 'IBM Plex Mono', 'Courier New', monospace; }
`;

// ─── Icon Component ────────────────────────────────────────────────────────────
function Icon({ name, className = "w-5 h-5", stroke = "currentColor" }) {
  const paths = {
    grid:        <><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></>,
    home:        <><path d="M3 9.5L12 3l9 6.5"/><path d="M5 9v11a1 1 0 0 0 1 1h3v-7h6v7h3a1 1 0 0 0 1-1V9"/></>,
    briefcase:   <><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></>,
    users:       <><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></>,
    check:       <><polyline points="20 6 9 17 4 12"/></>,
    star:        <><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></>,
    plus:        <><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></>,
    "arrow-up":  <><line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/></>,
    calendar:    <><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></>,
    "bar-chart": <><line x1="12" y1="20" x2="12" y2="10"/><line x1="18" y1="20" x2="18" y2="4"/><line x1="6" y1="20" x2="6" y2="16"/></>,
  };
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      {paths[name]}
    </svg>
  );
}

// ─── Data ──────────────────────────────────────────────────────────────────────
const stats = [
  {
    label: "Lowongan Aktif",
    value: 6,
    sub: "+ 2 BULAN INI",
    subClass: "text-blue-600",
    icon: "briefcase",
    iconBg: "bg-blue-50",
    iconBorder: "border-blue-200",
    iconColor: "text-blue-600",
  },
  {
    label: "Total Pelamar",
    value: 47,
    sub: "12 MENUNGGU REVIEW",
    subClass: "text-amber-500",
    icon: "users",
    iconBg: "bg-amber-50",
    iconBorder: "border-amber-200",
    iconColor: "text-amber-600",
  },
  {
    label: "Mahasiswa Diterima",
    value: 24,
    sub: "6 BULAN INI",
    subClass: "text-emerald-600",
    icon: "check",
    iconBg: "bg-emerald-50",
    iconBorder: "border-emerald-200",
    iconColor: "text-emerald-600",
  },
  {
    label: "Rating Perusahaan",
    value: "4.3",
    sub: "DARI 5.0",
    subClass: "text-slate-400",
    icon: "star",
    iconBg: "bg-violet-50",
    iconBorder: "border-violet-200",
    iconColor: "text-violet-600",
  },
];

const applicants = [
  { name: "Rizky Firmansyah", posisi: "Software Dev",  status: "Review", av: ["bg-blue-100",    "text-blue-700",    "border-blue-200"] },
  { name: "Andi Pratama",     posisi: "Data Analyst",  status: "Review", av: ["bg-emerald-100", "text-emerald-700", "border-emerald-200"] },
  { name: "Siti Rahayu",      posisi: "UI/UX Designer",status: "Review", av: ["bg-violet-100",  "text-violet-700",  "border-violet-200"] },
  { name: "Budi Santoso",     posisi: "Frontend Dev",  status: "Review", av: ["bg-amber-100",   "text-amber-700",   "border-amber-200"] },
];

const skills = [
  { label: "Backend Dev",  pct: 80, color: "from-blue-500 to-blue-300" },
  { label: "Data Analyst", pct: 65, color: "from-violet-500 to-violet-300" },
  { label: "UI & UX",      pct: 72, color: "from-emerald-500 to-emerald-300" },
  { label: "Frontend",     pct: 55, color: "from-amber-500 to-amber-300" },
  { label: "DevOps",       pct: 40, color: "from-rose-500 to-rose-300" },
];

const jobs = [
  { title: "Frontend Developer", dept: "Engineering", slots: 5, deadline: "30 JUN 2025", status: "Aktif" },
  { title: "Data Analyst",       dept: "Data & AI",   slots: 3, deadline: "15 JUL 2025", status: "Aktif" },
  { title: "UI/UX Designer",     dept: "Product",     slots: 2, deadline: "10 JUL 2025", status: "Aktif" },
];

const getInitials = (name) =>
  (name || "?").split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();

// ─── Stat Card ─────────────────────────────────────────────────────────────────
function StatCard({ s }) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col gap-3 transition-all duration-150 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-blue-100/60">
      <div className="flex items-center justify-between">
        <span className="font-mono text-[10px] text-slate-400 font-semibold uppercase tracking-[0.14em]">{s.label}</span>
        <div className={`w-10 h-10 rounded-xl border flex items-center justify-center flex-shrink-0 ${s.iconBg} ${s.iconBorder}`}>
          <Icon name={s.icon} className={`w-5 h-5 ${s.iconColor}`} />
        </div>
      </div>
      <div className="font-display text-[32px] font-semibold text-slate-800 leading-none tracking-tight">{s.value}</div>
      <div className={`font-mono text-[10.5px] font-semibold tracking-wide flex items-center gap-1 ${s.subClass}`}>
        {s.sub}
      </div>
    </div>
  );
}

// ─── Main Dashboard ────────────────────────────────────────────────────────────
export default function DashboardPerusahaan() {
  return (
    <div className="font-sans bg-slate-50 min-h-screen">
      <style>{FONTS}</style>

      <Topbar
        icon={<Icon name="grid" className="w-4.5 h-4.5" />}
        title="Dashboard"
        subtitle="Pantau lowongan, pelamar, dan aktivitas magang perusahaan"
        rightSlot={
          <button className="flex items-center gap-2 px-4 py-2 border border-blue-300 rounded-xl text-blue-600 text-[12.5px] font-semibold bg-transparent transition-all duration-150 hover:bg-blue-500 hover:text-white hover:border-blue-500 cursor-pointer">
            <div className="w-6 h-6 rounded-lg bg-blue-100 border border-blue-200 flex items-center justify-center flex-shrink-0">
              <Icon name="home" className="w-3.5 h-3.5" />
            </div>
            Back to homepage
          </button>
        }
      />
      {/* ── Body ── */}
      <div className="px-8 py-6 flex flex-col gap-5">

        {/* Stats */}
        <div className="grid grid-cols-4 gap-3.5">
          {stats.map((s, i) => <StatCard key={i} s={s} />)}
        </div>

        {/* Middle row */}
        <div className="grid grid-cols-2 gap-5">

          {/* Pelamar Terbaru */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6">
            <div className="flex items-center gap-2.5 mb-5 pb-4 border-b border-dashed border-slate-200">
              <div className="w-7 h-7 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center flex-shrink-0">
                <Icon name="users" className="w-3.5 h-3.5 text-blue-600" />
              </div>
              <span className="text-[14px] font-bold text-slate-800">Pelamar Terbaru</span>
            </div>
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  {["Mahasiswa", "Posisi", "Status"].map((h) => (
                    <th key={h} className="text-left font-mono text-[10px] font-bold tracking-[0.14em] uppercase text-slate-400 pb-3 pr-3 border-b border-slate-100">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {applicants.map((a, i) => (
                  <tr key={i} className="group hover:bg-slate-50 transition-colors">
                    <td className="py-2.5 pr-3 border-b border-slate-50 group-last:border-0">
                      <div className="flex items-center gap-2.5">
                        <div className={`w-7 h-7 rounded-lg border flex items-center justify-center font-display text-[10px] font-semibold flex-shrink-0 ${a.av[0]} ${a.av[1]} ${a.av[2]}`}>
                          {getInitials(a.name)}
                        </div>
                        <span className="text-[12.5px] text-slate-700 font-medium">{a.name}</span>
                      </div>
                    </td>
                    <td className="py-2.5 pr-3 text-[12.5px] text-slate-500 border-b border-slate-50 group-last:border-0">{a.posisi}</td>
                    <td className="py-2.5 pr-3 border-b border-slate-50 group-last:border-0">
                      <span className="font-mono inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wide bg-blue-50 text-blue-700 border border-blue-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-400 flex-shrink-0" />
                        {a.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Sebaran Keahlian */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6">
            <div className="flex items-center gap-2.5 mb-5 pb-4 border-b border-dashed border-slate-200">
              <div className="w-7 h-7 rounded-lg bg-violet-50 border border-violet-200 flex items-center justify-center flex-shrink-0">
                <Icon name="bar-chart" className="w-3.5 h-3.5 text-violet-600" />
              </div>
              <span className="text-[14px] font-bold text-slate-800">Sebaran Keahlian Pelamar</span>
            </div>
            <div className="flex flex-col gap-4">
              {skills.map((s, i) => (
                <div key={i}>
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-[12.5px] font-semibold text-slate-700">{s.label}</span>
                    <span className="font-mono text-[11px] font-semibold text-slate-400">{s.pct}%</span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                    <div
                      className={`h-full rounded-full bg-gradient-to-r ${s.color}`}
                      style={{ width: `${s.pct}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Lowongan Aktif */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-5 pb-4 border-b border-dashed border-slate-200">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center flex-shrink-0">
                <Icon name="briefcase" className="w-3.5 h-3.5 text-emerald-600" />
              </div>
              <span className="text-[14px] font-bold text-slate-800">Lowongan Aktif</span>
              <span className="font-mono text-[10.5px] font-semibold text-slate-400 bg-slate-100 px-2.5 py-0.5 rounded-full">{jobs.length}</span>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white border border-blue-500 rounded-xl text-[12px] font-semibold cursor-pointer transition-colors duration-150 hover:bg-blue-600">
              <div className="w-5 h-5 rounded-md bg-blue-400 border border-blue-300 flex items-center justify-center flex-shrink-0">
                <Icon name="plus" className="w-3 h-3 text-white" />
              </div>
              Kelola Semua
            </button>
          </div>
          <table className="w-full border-collapse">
            <thead>
              <tr>
                {["Posisi", "Departemen", "Kuota", "Deadline", "Status"].map((h) => (
                  <th key={h} className="text-left font-mono text-[10px] font-bold tracking-[0.14em] uppercase text-slate-400 pb-3 pr-3 border-b border-slate-100">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {jobs.map((j, i) => (
                <tr key={i} className="group hover:bg-slate-50 transition-colors">
                  <td className="py-3 pr-3 border-b border-slate-50 group-last:border-0">
                    <div className="text-[13px] font-semibold text-slate-800">{j.title}</div>
                  </td>
                  <td className="py-3 pr-3 border-b border-slate-50 group-last:border-0">
                    <span className="inline-flex items-center gap-1.5 text-[12px] text-slate-500">
                      {j.dept}
                    </span>
                  </td>
                  <td className="py-3 pr-3 text-[12.5px] text-slate-600 border-b border-slate-50 group-last:border-0">
                    {j.slots} orang
                  </td>
                  <td className="py-3 pr-3 border-b border-slate-50 group-last:border-0">
                    <div className="flex items-center gap-1.5 font-mono text-[11px] tracking-wide text-slate-500">
                      <div className="w-5 h-5 rounded-md bg-slate-100 border border-slate-200 flex items-center justify-center flex-shrink-0">
                        <Icon name="calendar" className="w-3 h-3 text-slate-400" />
                      </div>
                      {j.deadline}
                    </div>
                  </td>
                  <td className="py-3 pr-3 border-b border-slate-50 group-last:border-0">
                    <span className="font-mono inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wide bg-emerald-50 text-emerald-700 border border-emerald-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0" />
                      {j.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}