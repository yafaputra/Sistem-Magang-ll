"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Topbar from "../../components/topbar";

// ── THEME ──────────────────────────────────────────────────────────────────────
const ACCENT           = "#0A66C2";
const ACCENT_DARK      = "#0958A8";
const ACCENT_SOFT      = "#EFF6FF";
const ACCENT_SOFT_BORDER = "#BFDBFE";

// ── ICON COMPONENT ─────────────────────────────────────────────────────────────
function Icon({ name, size = 16, color = "currentColor" }) {
  const icons = {
    grid: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
        <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
      </svg>
    ),
    briefcase: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="7" width="20" height="14" rx="2"/>
        <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>
      </svg>
    ),
    search: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
      </svg>
    ),
    mappin: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
        <circle cx="12" cy="10" r="3"/>
      </svg>
    ),
    bookmark: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
      </svg>
    ),
    bookmarkFilled: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
      </svg>
    ),
    chevrondown: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="6 9 12 15 18 9"/>
      </svg>
    ),
    chevronup: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="18 15 12 9 6 15"/>
      </svg>
    ),
    chevronleft: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="15 18 9 12 15 6"/>
      </svg>
    ),
    chevronright: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="9 18 15 12 9 6"/>
      </svg>
    ),
    filter: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
      </svg>
    ),
    x: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
      </svg>
    ),
    home: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9.5L12 3l9 6.5" /><path d="M5 9v11a1 1 0 0 0 1 1h3v-7h6v7h3a1 1 0 0 0 1-1V9" />
      </svg>
    ),
    spinner: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ animation: "spin 0.8s linear infinite" }}>
        <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
      </svg>
    ),
  };
  return icons[name] || null;
}

// ── GOOGLE LOGO ────────────────────────────────────────────────────────────────
const logoColors = {
  G:  { bg: "#E8F0FE", text: "#1A73E8" },
  T:  { bg: "#FFF3E0", text: "#E65100" },
  GJ: { bg: "#E8F5E9", text: "#2E7D32" },
  TV: { bg: "#E3F2FD", text: "#1565C0" },
  S:  { bg: "#FCE4EC", text: "#C62828" },
  B:  { bg: "#F3E5F5", text: "#6A1B9A" },
  RG: { bg: "#E8EAF6", text: "#283593" },
  O:  { bg: "#F3E5F5", text: "#7B1FA2" },
  GR: { bg: "#E0F7FA", text: "#00838F" },
  BL: { bg: "#FFF8E1", text: "#F57F17" },
};

function CompanyLogo({ logo }) {
  const colors = logoColors[logo] ?? { bg: "#F3F4F6", text: "#374151" };
  if (logo === "G") {
    return (
      <div
        className="w-11 h-11 rounded-xl border flex items-center justify-center flex-shrink-0"
        style={{ backgroundColor: "#E8F0FE", borderColor: "#dbeafe" }}
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
        </svg>
      </div>
    );
  }
  return (
    <div
      className="w-11 h-11 rounded-xl flex items-center justify-center font-bold text-[12px] flex-shrink-0"
      style={{ backgroundColor: colors.bg, color: colors.text }}
    >
      {logo}
    </div>
  );
}

// ── FILTER SECTION ─────────────────────────────────────────────────────────────
function FilterSection({ title, options, selected, onToggle }) {
  const [open, setOpen] = useState(true);
  return (
    <div className="border-b border-slate-100 py-4 last:border-0">
      <button
        className="flex items-center justify-between w-full mb-3"
        onClick={() => setOpen((v) => !v)}
      >
        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">{title}</span>
        <Icon name={open ? "chevronup" : "chevrondown"} size={15} color="#94a3b8" />
      </button>
      {open && (
        <div className="flex flex-col gap-2.5">
          {options.map((opt) => (
            <label key={opt} className="flex items-center gap-2.5 cursor-pointer group">
              <div
                onClick={() => onToggle(opt)}
                className="w-4 h-4 border rounded flex items-center justify-center flex-shrink-0 transition-all cursor-pointer"
                style={
                  selected.includes(opt)
                    ? { backgroundColor: ACCENT, borderColor: ACCENT }
                    : { borderColor: "#cbd5e1" }
                }
              >
                {selected.includes(opt) && (
                  <svg width="8" height="6" viewBox="0 0 8 6" fill="none">
                    <path d="M1 3L3 5L7 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </div>
              <span className="text-[13px] text-slate-600 group-hover:text-slate-800 transition-colors">{opt}</span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
}

// ── PAGINATION ─────────────────────────────────────────────────────────────────
const ITEMS_PER_PAGE = 5;

function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  const getPages = () => {
    const pages = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 4) {
        pages.push(1, 2, 3, 4, 5, "...", totalPages);
      } else if (currentPage >= totalPages - 3) {
        pages.push(1, "...", totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages);
      }
    }
    return pages;
  };

  return (
    <div className="flex items-center justify-center gap-1.5 mt-8">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="w-9 h-9 rounded-xl flex items-center justify-center border transition-all duration-150"
        style={
          currentPage === 1
            ? { borderColor: "#e2e8f0", color: "#cbd5e1", cursor: "not-allowed" }
            : { borderColor: "#e2e8f0", color: "#475569" }
        }
        onMouseEnter={(e) => currentPage !== 1 && (e.currentTarget.style.borderColor = ACCENT, e.currentTarget.style.color = ACCENT, e.currentTarget.style.backgroundColor = ACCENT_SOFT)}
        onMouseLeave={(e) => currentPage !== 1 && (e.currentTarget.style.borderColor = "#e2e8f0", e.currentTarget.style.color = "#475569", e.currentTarget.style.backgroundColor = "transparent")}
      >
        <Icon name="chevronleft" size={16} color="currentColor" />
      </button>

      {getPages().map((page, idx) =>
        page === "..." ? (
          <span key={`dot-${idx}`} className="w-9 h-9 flex items-center justify-center text-slate-400 text-sm">
            ...
          </span>
        ) : (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className="w-9 h-9 rounded-xl flex items-center justify-center text-[13px] font-semibold border transition-all duration-150"
            style={
              currentPage === page
                ? { backgroundColor: ACCENT, color: "white", borderColor: ACCENT }
                : { borderColor: "#e2e8f0", color: "#475569" }
            }
            onMouseEnter={(e) => currentPage !== page && (e.currentTarget.style.borderColor = ACCENT, e.currentTarget.style.color = ACCENT, e.currentTarget.style.backgroundColor = ACCENT_SOFT)}
            onMouseLeave={(e) => currentPage !== page && (e.currentTarget.style.borderColor = "#e2e8f0", e.currentTarget.style.color = "#475569", e.currentTarget.style.backgroundColor = "transparent")}
          >
            {page}
          </button>
        )
      )}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="w-9 h-9 rounded-xl flex items-center justify-center border transition-all duration-150"
        style={
          currentPage === totalPages
            ? { borderColor: "#e2e8f0", color: "#cbd5e1", cursor: "not-allowed" }
            : { borderColor: "#e2e8f0", color: "#475569" }
        }
        onMouseEnter={(e) => currentPage !== totalPages && (e.currentTarget.style.borderColor = ACCENT, e.currentTarget.style.color = ACCENT, e.currentTarget.style.backgroundColor = ACCENT_SOFT)}
        onMouseLeave={(e) => currentPage !== totalPages && (e.currentTarget.style.borderColor = "#e2e8f0", e.currentTarget.style.color = "#475569", e.currentTarget.style.backgroundColor = "transparent")}
      >
        <Icon name="chevronright" size={16} color="currentColor" />
      </button>
    </div>
  );
}

// ── JOB CARD ───────────────────────────────────────────────────────────────────
function JobCard({ job, saved, onSave }) {
  const router = useRouter();

  return (
    <div className="bg-white border border-slate-200 rounded-2xl px-6 py-5 transition-all duration-200 hover:border-[#93c5fd] hover:shadow-[0_6px_24px_rgba(10,102,194,0.10)] hover:-translate-y-0.5">
      {/* Row 1: Title + Work Type Badge */}
      <div className="flex items-start justify-between mb-2">
        <h3 className="text-[17px] font-bold text-slate-900">{job.title}</h3>
        <span
          className="px-3.5 py-1.5 border rounded-md text-[12px] font-semibold flex-shrink-0"
          style={{ backgroundColor: "#F0FDF4", color: "#15803D", borderColor: "#86EFAC" }}
        >
          {job.workType}
        </span>
      </div>

      {/* Row 2: Type badge + Salary */}
      <div className="flex items-center gap-3 mb-3">
        <span
          className="px-2.5 py-0.5 border rounded-sm text-[10.5px] font-bold tracking-wide uppercase"
          style={{ backgroundColor: ACCENT_SOFT, color: "#1D4ED8", borderColor: ACCENT_SOFT_BORDER }}
        >
          {job.type}
        </span>
        <span className="text-[13px] text-slate-500">Salary: {job.salary}</span>
      </div>

      {/* Row 3: Skill Tags */}
      <div className="flex gap-2 flex-wrap mb-4">
        {job.skills.map((tag) => (
          <span
            key={tag}
            className="px-3.5 py-1.5 border border-slate-200 text-slate-600 rounded-sm text-[12.5px] font-semibold bg-slate-50 hover:border-slate-300 transition-colors"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Divider */}
      <div className="border-t border-slate-100 pt-4">
        {/* Row 4: Company + Actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CompanyLogo logo={job.logo} />
            <div>
              <div className="text-[13.5px] font-bold text-slate-800">{job.company}</div>
              <div className="flex items-center gap-1 text-[12px] text-slate-400 mt-0.5">
                <Icon name="mappin" size={11} color="#94a3b8" />
                {job.location}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              className="text-[12.5px] font-semibold px-5 py-2 rounded-lg border transition-all duration-150"
              style={{ color: ACCENT, backgroundColor: ACCENT_SOFT, borderColor: ACCENT_SOFT_BORDER }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = ACCENT; e.currentTarget.style.color = "white"; e.currentTarget.style.borderColor = ACCENT; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = ACCENT_SOFT; e.currentTarget.style.color = ACCENT; e.currentTarget.style.borderColor = ACCENT_SOFT_BORDER; }}
              onClick={() => router.push(`/lowongan/${job.id}`)}
            >
              Lamar
            </button>
            <button
              className="w-9 h-9 flex items-center justify-center border rounded-lg transition-all duration-150 cursor-pointer"
              style={
                saved
                  ? { borderColor: ACCENT, color: ACCENT, backgroundColor: ACCENT_SOFT }
                  : { borderColor: "#e2e8f0", color: "#94a3b8", backgroundColor: "white" }
              }
              onClick={(e) => { e.stopPropagation(); onSave(job.id); }}
              title={saved ? "Hapus dari simpanan" : "Simpan lowongan"}
            >
              <Icon name={saved ? "bookmarkFilled" : "bookmark"} size={15} color="currentColor" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── SKELETON LOADER ────────────────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl px-6 py-5 animate-pulse">
      <div className="flex items-start justify-between mb-3">
        <div className="h-5 bg-slate-200 rounded w-2/5" />
        <div className="h-7 bg-slate-100 rounded-md w-20" />
      </div>
      <div className="flex gap-2 mb-3">
        <div className="h-5 bg-slate-100 rounded w-16" />
        <div className="h-5 bg-slate-100 rounded w-28" />
      </div>
      <div className="flex gap-2 mb-4">
        <div className="h-8 bg-slate-100 rounded w-20" />
        <div className="h-8 bg-slate-100 rounded w-20" />
        <div className="h-8 bg-slate-100 rounded w-20" />
      </div>
      <div className="border-t border-slate-100 pt-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-slate-200" />
          <div>
            <div className="h-4 bg-slate-200 rounded w-32 mb-1.5" />
            <div className="h-3 bg-slate-100 rounded w-24" />
          </div>
        </div>
        <div className="flex gap-2">
          <div className="h-9 bg-slate-100 rounded-lg w-20" />
          <div className="w-9 h-9 bg-slate-100 rounded-lg" />
        </div>
      </div>
    </div>
  );
}

// ── MAIN PAGE ──────────────────────────────────────────────────────────────────
export default function LowonganPage() {
  const router = useRouter();

  // ── State ────────────────────────────────────────────────────────────────────
  const [jobs, setJobs]           = useState([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState(null);
  const [keyword, setKeyword]     = useState("");
  const [location, setLocation]   = useState("");
  const [savedJobs, setSavedJobs] = useState({});
  const [sortBy, setSortBy]       = useState("Terbaru");
  const [currentPage, setCurrentPage] = useState(1);
  const [workTypes, setWorkTypes]   = useState([]);
  const [expLevels, setExpLevels]   = useState([]);
  const [categories, setCategories] = useState([]);

  // ── Fetch dari API ───────────────────────────────────────────────────────────
  useEffect(() => {
    const fetchLowongan = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/lowongan/public`
        );
        const result = await response.json();
        if (!response.ok) {
          setError(result.message || "Gagal memuat data lowongan.");
          return;
        }
        setJobs(
          result.data.map((item) => ({
            id:         item.id,
            title:      item.posisi,
            type:       item.tipe       || "FULL-TIME",
            workType:   item.tipe       || "Remote",
            salary:     item.gaji       || "-",
            skills:     item.tags       ? JSON.parse(item.tags) : [],
            company:    item.perusahaan?.nama    || "Perusahaan",
            location:   item.lokasi     || item.perusahaan?.alamat || "-",
            logo:       item.perusahaan?.logo    || "P",
            experience: item.experience || "Beginner",
            category:   item.departemen || "Software Developer",
          }))
        );
      } catch (err) {
        setError("Koneksi gagal. Periksa jaringan Anda.");
        console.error("Gagal mengambil lowongan:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLowongan();
  }, []);

  // ── Helpers ──────────────────────────────────────────────────────────────────
  const toggleCheck = (val, list, setList) => {
    setList((prev) =>
      prev.includes(val) ? prev.filter((v) => v !== val) : [...prev, val]
    );
    setCurrentPage(1);
  };

  const toggleSave = (id) =>
    setSavedJobs((prev) => ({ ...prev, [id]: !prev[id] }));

  const resetFilters = () => {
    setWorkTypes([]);
    setExpLevels([]);
    setCategories([]);
    setKeyword("");
    setLocation("");
    setCurrentPage(1);
  };

  const activeFilterCount = workTypes.length + expLevels.length + categories.length;

  // ── Filtering ────────────────────────────────────────────────────────────────
  const filtered = jobs.filter((job) => {
    const q           = keyword.toLowerCase();
    const matchSearch = !q || job.title.toLowerCase().includes(q) || job.company.toLowerCase().includes(q) || job.skills.some((s) => s.toLowerCase().includes(q));
    const matchLoc    = !location || job.location.toLowerCase().includes(location.toLowerCase());
    const matchWork   = !workTypes.length   || workTypes.includes(job.workType);
    const matchExp    = !expLevels.length   || expLevels.includes(job.experience);
    const matchCat    = !categories.length  || categories.includes(job.category);
    return matchSearch && matchLoc && matchWork && matchExp && matchCat;
  });

  // ── Sorting ──────────────────────────────────────────────────────────────────
  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === "Gaji Tertinggi") {
      const parse = (s) => parseInt((s || "0").replace(/\D/g, "")) || 0;
      return parse(b.salary) - parse(a.salary);
    }
    if (sortBy === "Terlama") return a.id - b.id;
    return b.id - a.id; // Terbaru (default)
  });

  // ── Pagination ───────────────────────────────────────────────────────────────
  const totalPages = Math.ceil(sorted.length / ITEMS_PER_PAGE);
  const safePage   = Math.min(currentPage, totalPages || 1);
  const paginated  = sorted.slice((safePage - 1) * ITEMS_PER_PAGE, safePage * ITEMS_PER_PAGE);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const startItem = sorted.length === 0 ? 0 : (safePage - 1) * ITEMS_PER_PAGE + 1;
  const endItem   = Math.min(safePage * ITEMS_PER_PAGE, sorted.length);

  // ── Render ───────────────────────────────────────────────────────────────────
  return (
    <>
      {/* Inject spinner keyframe */}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

      <div className="flex min-h-screen font-sans bg-[#f6f9fc]">
        <div className="flex-1 flex flex-col overflow-hidden">

          {/* ── TOP BAR ── */}
          <Topbar
            icon={<Icon name="briefcase" size={17} />}
            title="Cari Lowongan"
            subtitle="Temukan lowongan magang yang sesuai dengan minatmu"
            rightSlot={
              <button
                onClick={() => router.push("/")}
                className="flex items-center gap-2 px-4 py-2 border border-blue-300 rounded-xl text-blue-600 text-[12.5px] font-semibold bg-transparent transition-all duration-150 hover:bg-blue-500 hover:text-white hover:border-blue-500 cursor-pointer"
              >
                <div className="w-6 h-6 rounded-lg bg-blue-100 border border-blue-200 flex items-center justify-center flex-shrink-0">
                  <Icon name="home" size={14} />
                </div>
                Back to homepage
              </button>
            }
          />

          {/* ── SEARCH BAR ── */}
          <div className="px-7 pt-6">
            <div
              className="flex items-center gap-3 bg-white border rounded-xl px-4 py-2.5 shadow-[0_2px_12px_rgba(10,102,194,0.06)]"
              style={{ borderColor: "#e2e8f0" }}
            >
              <Icon name="search" size={16} color="#94a3b8" />
              <input
                className="flex-1 border-none outline-none text-[13.5px] text-slate-800 bg-transparent placeholder:text-slate-400"
                placeholder="Posisi, skill, atau nama perusahaan..."
                value={keyword}
                onChange={(e) => { setKeyword(e.target.value); setCurrentPage(1); }}
              />
              <div className="w-px h-7 bg-slate-200" />
              <div className="flex items-center gap-1.5 flex-1">
                <Icon name="mappin" size={16} color={ACCENT} />
                <input
                  className="border-none outline-none text-[13.5px] text-slate-600 bg-transparent flex-1 placeholder:text-slate-400"
                  placeholder="Kota atau lokasi..."
                  value={location}
                  onChange={(e) => { setLocation(e.target.value); setCurrentPage(1); }}
                />
              </div>
              <button
                className="px-6 py-2 text-white border-none rounded-lg text-[13.5px] font-bold cursor-pointer transition-colors whitespace-nowrap"
                style={{ backgroundColor: ACCENT }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = ACCENT_DARK)}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = ACCENT)}
                onClick={() => setCurrentPage(1)}
              >
                Search
              </button>
            </div>
          </div>

          {/* ── CONTENT: FILTER + JOBS ── */}
          <div className="flex gap-6 p-6">

            {/* ── FILTER PANEL ── */}
            <aside className="w-[260px] flex-shrink-0 bg-white rounded-2xl border border-slate-200 p-5 h-fit shadow-[0_2px_12px_rgba(10,102,194,0.05)] sticky top-6">
              <div className="flex items-center justify-between mb-1 pb-4 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <Icon name="filter" size={16} color={ACCENT} />
                  <span className="text-[15px] font-bold text-slate-800">Filter</span>
                  {activeFilterCount > 0 && (
                    <span
                      className="text-[10px] font-bold px-1.5 py-0.5 rounded-full text-white"
                      style={{ backgroundColor: ACCENT }}
                    >
                      {activeFilterCount}
                    </span>
                  )}
                </div>
                {activeFilterCount > 0 && (
                  <button
                    onClick={resetFilters}
                    className="text-[11px] text-slate-400 hover:text-red-500 transition-colors flex items-center gap-1"
                  >
                    <Icon name="x" size={10} color="currentColor" /> Reset
                  </button>
                )}
              </div>

              <FilterSection
                title="Tipe Kerja"
                options={["Remote", "Hybrid", "On-Site"]}
                selected={workTypes}
                onToggle={(v) => toggleCheck(v, workTypes, setWorkTypes)}
              />
              <FilterSection
                title="Level Pengalaman"
                options={["Expert", "Intermediate", "Beginner"]}
                selected={expLevels}
                onToggle={(v) => toggleCheck(v, expLevels, setExpLevels)}
              />
              <FilterSection
                title="Kategori"
                options={["Software Developer", "Design", "Marketing", "Data Science", "Product Management"]}
                selected={categories}
                onToggle={(v) => toggleCheck(v, categories, setCategories)}
              />
            </aside>

            {/* ── JOB LIST ── */}
            <div className="flex-1 flex flex-col gap-4">

              {/* Result count + Sort */}
              <div className="flex items-center justify-between">
                <p className="text-[13.5px] text-slate-500">
                  {loading ? (
                    <span className="inline-flex items-center gap-1.5 text-slate-400">
                      <Icon name="spinner" size={13} color="#94a3b8" /> Memuat lowongan...
                    </span>
                  ) : sorted.length === 0 ? (
                    <span className="text-slate-400">Tidak ada lowongan ditemukan</span>
                  ) : (
                    <>
                      Menampilkan{" "}
                      <span className="font-bold text-slate-800">{startItem}–{endItem}</span>{" "}
                      dari <span className="font-bold text-slate-800">{sorted.length}</span> lowongan
                    </>
                  )}
                </p>
                <div className="flex items-center gap-2">
                  <span className="text-[13px] text-slate-500">Urutkan:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => { setSortBy(e.target.value); setCurrentPage(1); }}
                    className="text-[13px] font-medium text-slate-700 border border-slate-200 rounded-lg px-3 py-1.5 outline-none bg-white cursor-pointer"
                  >
                    <option>Terbaru</option>
                    <option>Terlama</option>
                    <option>Gaji Tertinggi</option>
                    <option>Relevan</option>
                  </select>
                </div>
              </div>

              {/* ── ERROR STATE ── */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
                  <p className="text-red-500 text-[14px] font-medium mb-2">{error}</p>
                  <button
                    onClick={() => window.location.reload()}
                    className="text-[13px] font-semibold underline"
                    style={{ color: ACCENT }}
                  >
                    Coba lagi
                  </button>
                </div>
              )}

              {/* ── LOADING STATE ── */}
              {loading && !error && (
                <div className="flex flex-col gap-4">
                  {[...Array(3)].map((_, i) => <SkeletonCard key={i} />)}
                </div>
              )}

              {/* ── EMPTY STATE ── */}
              {!loading && !error && sorted.length === 0 && (
                <div className="bg-white rounded-2xl border border-slate-200 p-16 text-center">
                  <p className="text-slate-400 text-[15px]">Tidak ada lowongan yang sesuai filter.</p>
                  <button
                    onClick={resetFilters}
                    className="mt-4 text-[13px] font-semibold hover:underline"
                    style={{ color: ACCENT }}
                  >
                    Reset filter
                  </button>
                </div>
              )}

              {/* ── JOB CARDS ── */}
              {!loading && !error && paginated.map((job) => (
                <JobCard
                  key={job.id}
                  job={job}
                  saved={!!savedJobs[job.id]}
                  onSave={toggleSave}
                />
              ))}

              {/* ── PAGINATION ── */}
              {!loading && !error && (
                <Pagination
                  currentPage={safePage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}