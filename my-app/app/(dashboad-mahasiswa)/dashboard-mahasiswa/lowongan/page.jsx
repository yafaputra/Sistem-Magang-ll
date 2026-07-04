"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  MapPin,
  Search,
  Bookmark,
  BookmarkCheck,
  SlidersHorizontal,
  X,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Briefcase,
  Home,
} from "lucide-react";
import Topbar from "../../components/topbar";
import useAuth from "../../../hooks/useAuth";

// ─── Konstanta ────────────────────────────────────────────────────────────────
const ITEMS_PER_PAGE = 10;

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

// ─── Company Logo ─────────────────────────────────────────────────────────────
function CompanyLogo({ logo }) {
  const colors = logoColors[logo] ?? { bg: "#F3F4F6", text: "#374151" };
  if (logo === "G") {
    return (
      <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: colors.bg }}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
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

// ─── Job Logo (logo dari path atau initials) ──────────────────────────────────
function JobLogo({ company, logoPath, logoInitials }) {
  if (logoPath) {
    return (
      <img
        src={logoPath}
        alt={company}
        className="w-11 h-11 rounded-xl object-contain flex-shrink-0 border border-slate-100"
      />
    );
  }
  const initials = logoInitials || (company ? company.charAt(0).toUpperCase() : "P");
  return <CompanyLogo logo={initials} />;
}

// ─── Filter Sidebar ───────────────────────────────────────────────────────────
function FilterSection({ title, children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-slate-100 pb-5 mb-5 last:border-0 last:mb-0 last:pb-0">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full mb-3 group"
      >
        <span className="text-[13px] font-bold text-slate-700 uppercase tracking-widest">{title}</span>
        <ChevronDown
          size={15}
          className={`text-slate-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && <div className="flex flex-col gap-2">{children}</div>}
    </div>
  );
}

function CheckItem({ label, checked, onChange }) {
  return (
    <label className="flex items-center justify-between gap-2 cursor-pointer group">
      <div className="flex items-center gap-2.5">
        <div
          onClick={onChange}
          className={`w-4 h-4 rounded flex items-center justify-center border transition-all duration-150 flex-shrink-0 cursor-pointer ${
            checked ? "bg-[#0A66C2] border-[#0A66C2]" : "border-slate-300 bg-white group-hover:border-[#6CC1FF]"
          }`}
        >
          {checked && (
            <svg width="9" height="7" viewBox="0 0 9 7" fill="none">
              <path d="M1 3.5L3.5 6L8 1" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </div>
        <span className={`text-[13.5px] transition-colors ${checked ? "text-slate-800 font-medium" : "text-slate-500 group-hover:text-slate-700"}`}>
          {label}
        </span>
      </div>
    </label>
  );
}

function Sidebar({ filters, setFilters, onReset, options }) {
  const toggle = (key, val) => {
    setFilters((prev) => ({
      ...prev,
      [key]: prev[key].includes(val)
        ? prev[key].filter((item) => item !== val)
        : [...prev[key], val],
    }));
  };

  const activeCount = filters.workType.length + filters.experience.length + filters.category.length;

  return (
    <aside className="w-[270px] flex-shrink-0">
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sticky top-24">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <SlidersHorizontal size={16} className="text-[#0A66C2]" />
            <span className="font-bold text-slate-800 text-[15px]">Filter</span>
            {activeCount > 0 && (
              <span className="bg-[#0A66C2] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                {activeCount}
              </span>
            )}
          </div>
          {activeCount > 0 && (
            <button
              onClick={onReset}
              className="text-[12px] text-slate-400 hover:text-red-500 transition-colors flex items-center gap-1"
            >
              <X size={11} /> Reset
            </button>
          )}
        </div>

        <FilterSection title="Tipe Kerja">
          {options.workTypes.map((value) => (
            <CheckItem
              key={value}
              label={value}
              checked={filters.workType.includes(value)}
              onChange={() => toggle("workType", value)}
            />
          ))}
        </FilterSection>

        <FilterSection title="Level Pengalaman">
          {options.experiences.map((value) => (
            <CheckItem
              key={value}
              label={value}
              checked={filters.experience.includes(value)}
              onChange={() => toggle("experience", value)}
            />
          ))}
        </FilterSection>

        <FilterSection title="Kategori">
          {options.categories.map((value) => (
            <CheckItem
              key={value}
              label={value}
              checked={filters.category.includes(value)}
              onChange={() => toggle("category", value)}
            />
          ))}
        </FilterSection>
      </div>
    </aside>
  );
}

// ─── Job Card ─────────────────────────────────────────────────────────────────
function JobCard({ job, saved, onSave }) {
  const router = useRouter();

  const formatRupiah = (angka) => {
    if (!angka) return "-";
    const num = parseInt(angka);
    if (isNaN(num)) return angka;
    return "Rp " + num.toLocaleString("id-ID");
  };

  return (
    <div className="bg-white border border-slate-200 rounded-sm p-5 transition-all duration-200 hover:shadow-[0_6px_24px_rgba(10,102,194,0.10)] hover:border-[#6CC1FF] hover:-translate-y-0.5 group">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="min-w-0">
          <h3 className="text-[18px] font-bold text-slate-900 leading-snug mb-2 group-hover:text-[#0A66C2] transition-colors line-clamp-2">
            {job.title}
          </h3>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-sm border tracking-wide bg-[#EFF6FF] text-[#1D4ED8] border-[#93C5FD]">
              {job.type}
            </span>
            <span className="text-[12.5px] text-slate-500 font-medium">
              {formatRupiah(job.salary)}
            </span>
          </div>
        </div>

        <span className="text-[12px] font-semibold px-3.5 py-1.5 rounded-sm border flex-shrink-0 bg-[#F0FDF4] text-[#15803D] border-[#86EFAC]">
          {job.workType}
        </span>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {job.skills.map((skill) => (
          <span
            key={skill}
            className="text-[12.5px] font-semibold px-4 py-1.5 rounded-sm border bg-[#F8FAFC] text-[#334155] border-[#CBD5E1]"
          >
            {skill}
          </span>
        ))}
      </div>

      <div className="border-t border-slate-100 pt-3.5">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <JobLogo company={job.company} logoPath={job.logoPath} logoInitials={job.logoInitials} />
            <div className="min-w-0">
              <p className="text-[13.5px] font-bold text-slate-800 leading-tight truncate">{job.company}</p>
              <span className="flex items-center gap-1 text-[12px] text-slate-400 mt-0.5 min-w-0">
                <MapPin size={11} strokeWidth={2} className="flex-shrink-0" />
                <span className="truncate">{job.location}</span>
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              className="text-[12.5px] font-semibold text-[#0A66C2] bg-blue-50 border border-blue-200 px-4 py-2 rounded-sm transition-all duration-150 hover:bg-[#0A66C2] hover:text-white hover:border-[#0A66C2]"
              onClick={(e) => {
                e.stopPropagation();
                // ✅ arahkan ke detail lowongan di dalam dashboard mahasiswa, berbasis slug
                router.push(`/dashboard-mahasiswa/lowongan/${job.slug}`);
              }}
            >
              Lamar
            </button>
            <button
              onClick={() => onSave(job.id)}
              className="w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-150 hover:bg-blue-50 border border-slate-200"
              aria-label={saved ? "Hapus dari tersimpan" : "Simpan lowongan"}
            >
              {saved ? (
                <BookmarkCheck size={17} className="text-[#0A66C2]" />
              ) : (
                <Bookmark size={17} className="text-slate-300 group-hover:text-slate-400" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Pagination ───────────────────────────────────────────────────────────────
function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  const getPages = () => {
    const pages = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i += 1) pages.push(i);
    } else if (currentPage <= 4) {
      pages.push(1, 2, 3, 4, 5, "...", totalPages);
    } else if (currentPage >= totalPages - 3) {
      pages.push(1, "...", totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
    } else {
      pages.push(1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages);
    }
    return pages;
  };

  return (
    <div className="flex items-center justify-center gap-1.5 mt-8">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`w-9 h-9 rounded-xl flex items-center justify-center border transition-all duration-150 text-sm font-medium ${
          currentPage === 1
            ? "border-slate-200 text-slate-300 cursor-not-allowed"
            : "border-slate-200 text-slate-600 hover:border-[#0A66C2] hover:text-[#0A66C2] hover:bg-blue-50"
        }`}
      >
        <ChevronLeft size={16} />
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
            className={`w-9 h-9 rounded-xl flex items-center justify-center text-[13px] font-semibold border transition-all duration-150 ${
              currentPage === page
                ? "bg-[#0A66C2] text-white border-[#0A66C2] shadow-sm"
                : "border-slate-200 text-slate-600 hover:border-[#0A66C2] hover:text-[#0A66C2] hover:bg-blue-50"
            }`}
          >
            {page}
          </button>
        )
      )}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`w-9 h-9 rounded-xl flex items-center justify-center border transition-all duration-150 text-sm font-medium ${
          currentPage === totalPages
            ? "border-slate-200 text-slate-300 cursor-not-allowed"
            : "border-slate-200 text-slate-600 hover:border-[#0A66C2] hover:text-[#0A66C2] hover:bg-blue-50"
        }`}
      >
        <ChevronRight size={16} />
      </button>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function LowonganDashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");
  const [saved, setSaved] = useState([]);
  const [filters, setFilters] = useState({ workType: [], experience: [], category: [] });
  const [currentPage, setCurrentPage] = useState(1);
  const [jobs, setJobs] = useState([]);
  const [sortBy, setSortBy] = useState("Terbaru");

  useAuth("mahasiswa");

  useEffect(() => {
    const fetchLowongan = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/lowongan/public`
        );
        const result = await response.json();

        if (!response.ok) {
          setLoadError(result.message || "Gagal memuat lowongan.");
          return;
        }

        setJobs(
          result.data.map((item) => ({
            id: item.id,
            slug: item.slug, // ✅ dipakai untuk link detail berbasis slug
            title: item.posisi,
            type: item.tipe || "FULL-TIME",
            workType: item.tipe || "Remote",
            salary: item.gaji || "-",
            salaryValue: parseInt(item.gaji) || 0,
            skills: item.tags ? JSON.parse(item.tags) : [],
            company: item.perusahaan?.nama || "Perusahaan",
            location: item.lokasi || item.perusahaan?.alamat || "-",
            logo: item.perusahaan?.logo || "P",
            logoPath: item.perusahaan?.logoPath || null,
            logoInitials: item.perusahaan?.nama?.charAt(0).toUpperCase() || "P",
            experience: item.experience || "Beginner",
            category: item.departemen || "Software Developer",
            postedAt: item.createdAt || item.postedAt || null,
          }))
        );
      } catch (error) {
        setLoadError("Gagal mengambil lowongan.");
        console.error("Gagal mengambil lowongan:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLowongan();
  }, []);

  const options = useMemo(() => ({
    workTypes: [...new Set(jobs.map((j) => j.workType).filter(Boolean))],
    experiences: [...new Set(jobs.map((j) => j.experience).filter(Boolean))],
    categories: [...new Set(jobs.map((j) => j.category).filter(Boolean))],
  }), [jobs]);

  const resetFilters = () => {
    setFilters({ workType: [], experience: [], category: [] });
    setCurrentPage(1);
  };

  const toggleSave = (id) => {
    setSaved((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));
  };

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    const loc = location.toLowerCase().trim();

    const result = jobs.filter((job) => {
      const skills = Array.isArray(job.skills) ? job.skills : [];
      const matchSearch =
        !q ||
        job.title.toLowerCase().includes(q) ||
        job.company.toLowerCase().includes(q) ||
        skills.some((skill) => skill.toLowerCase().includes(q)) ||
        job.category.toLowerCase().includes(q);
      const matchLocation = !loc || job.location.toLowerCase().includes(loc);
      const matchWork = !filters.workType.length || filters.workType.includes(job.workType);
      const matchExp = !filters.experience.length || filters.experience.includes(job.experience);
      const matchCat = !filters.category.length || filters.category.includes(job.category);

      return matchSearch && matchLocation && matchWork && matchExp && matchCat;
    });

    return [...result].sort((a, b) => {
      if (sortBy === "Gaji Tertinggi") return (b.salaryValue || 0) - (a.salaryValue || 0);
      if (sortBy === "Relevansi") return a.title.localeCompare(b.title);
      return new Date(b.postedAt || 0) - new Date(a.postedAt || 0);
    });
  }, [filters, jobs, location, search, sortBy]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const safePage = Math.min(currentPage, totalPages || 1);
  const paginated = filtered.slice((safePage - 1) * ITEMS_PER_PAGE, safePage * ITEMS_PER_PAGE);
  const startItem = filtered.length ? (safePage - 1) * ITEMS_PER_PAGE + 1 : 0;
  const endItem = Math.min(safePage * ITEMS_PER_PAGE, filtered.length);

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-slate-50 font-[Plus_Jakarta_Sans,Segoe_UI,sans-serif]">
      {/* Topbar — konsisten dengan dashboard mahasiswa */}
      <Topbar
        icon={<Briefcase className="w-4.5 h-4.5" />}
        title="Lowongan"
        subtitle="Temukan lowongan magang yang sesuai dengan minatmu"
        rightSlot={
          <button
            onClick={() => router.push("/")}
            className="flex items-center gap-2 px-4 py-2 border border-blue-300 rounded-xl text-blue-600 text-[12.5px] font-semibold bg-transparent transition-all duration-150 hover:bg-blue-500 hover:text-white hover:border-blue-500 cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-400"
          >
            <div className="w-6 h-6 rounded-lg bg-blue-100 border border-blue-200 flex items-center justify-center flex-shrink-0">
              <Home className="w-3.5 h-3.5" />
            </div>
            Back to homepage
          </button>
        }
      />

      <div className="px-8 pt-6 pb-6">
        <div className="flex gap-2 items-center bg-white rounded-2xl p-2 shadow-[0_2px_12px_rgba(10,102,194,0.08)] border border-slate-200 max-[700px]:flex-col">
          <div className="flex items-center gap-2.5 flex-1 px-3">
            <Search size={17} className="text-slate-400 flex-shrink-0" />
            <input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Cari posisi, skill, atau perusahaan..."
              className="flex-1 text-[14px] text-slate-700 bg-transparent outline-none placeholder:text-slate-400"
            />
          </div>
          <div className="w-px h-7 bg-slate-200 max-[700px]:hidden" />
          <div className="flex items-center gap-2.5 flex-1 px-3 max-[700px]:w-full">
            <MapPin size={16} className="text-slate-400 flex-shrink-0" />
            <input
              value={location}
              onChange={(e) => {
                setLocation(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Kota atau lokasi..."
              className="flex-1 text-[14px] text-slate-700 bg-transparent outline-none placeholder:text-slate-400"
            />
          </div>
          <button
            onClick={() => setCurrentPage(1)}
            className="bg-[#0A66C2] text-white px-7 py-2.5 rounded-xl text-[14px] font-semibold hover:bg-[#0958A8] transition-colors flex-shrink-0 max-[700px]:w-full"
          >
            Cari Lowongan
          </button>
        </div>
      </div>

      <div className="px-8 pb-10 flex gap-7 items-start max-[900px]:flex-col">
        <Sidebar filters={filters} setFilters={setFilters} onReset={resetFilters} options={options} />

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-4 mb-5 max-[640px]:flex-col max-[640px]:items-start">
            <p className="text-[13.5px] text-slate-500">
              {loading ? (
                "Memuat lowongan..."
              ) : (
                <>
                  Menampilkan{" "}
                  <span className="font-semibold text-slate-800">
                    {startItem.toLocaleString("id-ID")}–{endItem.toLocaleString("id-ID")}
                  </span>{" "}
                  dari <span className="font-semibold text-slate-800">{filtered.length.toLocaleString("id-ID")}</span> lowongan
                </>
              )}
            </p>
            <div className="flex items-center gap-2 text-[13px] text-slate-500">
              <span>Urutkan:</span>
              <select
                value={sortBy}
                onChange={(e) => {
                  setSortBy(e.target.value);
                  setCurrentPage(1);
                }}
                className="text-[13px] font-medium text-slate-700 bg-white border border-slate-200 rounded-lg px-2 py-1 outline-none cursor-pointer"
              >
                <option>Terbaru</option>
                <option>Gaji Tertinggi</option>
                <option>Relevansi</option>
              </select>
            </div>
          </div>

          {loading ? (
            <div className="flex flex-col gap-3.5">
              {[1, 2, 3].map((item) => (
                <div key={item} className="bg-white border border-slate-200 rounded-sm p-5 animate-pulse">
                  <div className="h-5 w-2/3 bg-slate-100 rounded mb-4" />
                  <div className="h-4 w-1/2 bg-slate-100 rounded mb-6" />
                  <div className="h-12 w-full bg-slate-100 rounded" />
                </div>
              ))}
            </div>
          ) : loadError ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-16 text-center">
              <p className="text-slate-400 text-[15px]">{loadError}</p>
            </div>
          ) : paginated.length > 0 ? (
            <div className="flex flex-col gap-3.5">
              {paginated.map((job) => (
                <JobCard key={job.id} job={job} saved={saved.includes(job.id)} onSave={toggleSave} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 p-16 text-center">
              <p className="text-slate-400 text-[15px]">Tidak ada lowongan yang sesuai filter.</p>
              <button onClick={resetFilters} className="mt-4 text-[13px] text-[#0A66C2] font-semibold hover:underline">
                Reset filter
              </button>
            </div>
          )}

          <Pagination currentPage={safePage} totalPages={totalPages} onPageChange={handlePageChange} />
        </div>
      </div>
    </div>
  );
}