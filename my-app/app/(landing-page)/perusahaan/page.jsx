"use client";

import { useState, useEffect } from "react";
import { MapPin, Search, Building2, BriefcaseBusiness, Clock, ChevronLeft, ChevronRight } from "lucide-react";

// ─── Warna logo seragam untuk semua perusahaan ────────────────────────────────
const UNIFORM_LOGO_COLOR = { bg: "#E4E7F5", text: "#3B3F87" };

function getInitials(name) {
  if (!name) return "?";
  const words = name.trim().split(" ");
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return (words[0][0] + words[1][0]).toUpperCase();
}

function CompanyLogo({ name, logoUrl }) {
  if (logoUrl) {
    return (
      <div
        className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 overflow-hidden"
        style={{ backgroundColor: UNIFORM_LOGO_COLOR.bg }}
      >
        <img src={logoUrl} alt={name} className="w-full h-full object-cover" />
      </div>
    );
  }
  return (
    <div
      className="w-14 h-14 rounded-2xl flex items-center justify-center font-bold text-[14px] flex-shrink-0"
      style={{ backgroundColor: UNIFORM_LOGO_COLOR.bg, color: UNIFORM_LOGO_COLOR.text }}
    >
      {getInitials(name)}
    </div>
  );
}

// ─── Company Card ─────────────────────────────────────────────────────────────

function CompanyCard({ company }) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden cursor-pointer transition-all duration-200 hover:shadow-[0_6px_24px_rgba(10,102,194,0.10)] hover:border-[#6CC1FF] hover:-translate-y-0.5 group">
      <div className="p-5 pb-4">
        <div className="flex items-start gap-3.5 mb-4">
          <CompanyLogo name={company.name} logoUrl={company.logo} />
          <div className="min-w-0 pt-1">
            <h3 className="text-[15px] font-bold text-slate-900 leading-snug mb-1 group-hover:text-[#0A66C2] transition-colors truncate">
              {company.name}
            </h3>
            <span className="flex items-center gap-1 text-[12px] text-slate-400">
              <MapPin size={11} strokeWidth={2} className="flex-shrink-0" />
              {company.location}
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 text-[12.5px] text-slate-500">
            <Building2 size={14} strokeWidth={1.8} className="text-slate-400 flex-shrink-0" />
            <span>{company.industry}</span>
          </div>
          <div className="flex items-center gap-2 text-[12.5px] text-slate-500">
            <BriefcaseBusiness size={14} strokeWidth={1.8} className="text-slate-400 flex-shrink-0" />
            <span>{company.jobs} Lowongan</span>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-100 px-5 py-3 flex items-center gap-2">
        <Clock size={13} strokeWidth={1.8} className="text-slate-400 flex-shrink-0" />
        <span className="text-[11.5px] text-slate-400">Aktif {company.lastActive}</span>
      </div>
    </div>
  );
}

// ─── Pagination ───────────────────────────────────────────────────────────────

const ITEMS_PER_PAGE = 9;

function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  const getPages = () => {
    const pages = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
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
    <div className="flex items-center justify-center gap-1.5 mt-10">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`w-9 h-9 rounded-xl flex items-center justify-center border transition-all duration-150
          ${currentPage === 1
            ? "border-slate-200 text-slate-300 cursor-not-allowed"
            : "border-slate-200 text-slate-600 hover:border-[#0A66C2] hover:text-[#0A66C2] hover:bg-blue-50"
          }`}
      >
        <ChevronLeft size={16} />
      </button>

      {getPages().map((page, idx) =>
        page === "..." ? (
          <span key={`dot-${idx}`} className="w-9 h-9 flex items-center justify-center text-slate-400 text-sm">...</span>
        ) : (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`w-9 h-9 rounded-xl flex items-center justify-center text-[13px] font-semibold border transition-all duration-150
              ${currentPage === page
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
        className={`w-9 h-9 rounded-xl flex items-center justify-center border transition-all duration-150
          ${currentPage === totalPages
            ? "border-slate-200 text-slate-300 cursor-not-allowed"
            : "border-slate-200 text-slate-600 hover:border-[#0A66C2] hover:text-[#0A66C2] hover:bg-blue-50"
          }`}
      >
        <ChevronRight size={16} />
      </button>
    </div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────

export default function PerusahaanPage() {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // ── Ambil data perusahaan dari backend
  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/perusahaan/public`);
        const json = await res.json();
        if (!res.ok) throw new Error(json.message || "Gagal memuat data");
        setCompanies(json.data || []);
      } catch (err) {
        setErrorMsg(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchCompanies();
  }, []);

  const filtered = companies.filter((c) => {
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      c.name?.toLowerCase().includes(q) ||
      c.industry?.toLowerCase().includes(q);
    const matchLocation =
      !location || c.location?.toLowerCase().includes(location.toLowerCase());
    return matchSearch && matchLocation;
  });

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const safePage = Math.min(currentPage, totalPages || 1);
  const paginated = filtered.slice((safePage - 1) * ITEMS_PER_PAGE, safePage * ITEMS_PER_PAGE);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-white font-[Plus_Jakarta_Sans,Segoe_UI,sans-serif] pt-5">
      {/* Hero */}
      <div
        className="relative overflow-hidden border-b border-[#d6e8f7] pt-20 pb-12 px-8"
        style={{ background: "linear-gradient(160deg, #dbeeff 0%, #e8f3ff 50%, #d4e9fb 100%)" }}
      >
        <div
          className="absolute top-0 right-0 w-[500px] h-[500px] opacity-40 pointer-events-none"
          style={{ background: "radial-gradient(circle at 80% 20%, #bfdbfe 0%, transparent 65%)" }}
        />
        <div className="relative max-w-[1200px] mx-auto">
          <div className="inline-flex items-center gap-2 bg-white border border-[#bfdbfe] text-[#1D4ED8] text-[12px] font-semibold px-4 py-1.5 rounded-full mb-6 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-[#0A66C2]" />
            {companies.length} Perusahaan Terdaftar
          </div>

          <h1 className="text-[3rem] font-black text-slate-900 mb-4 leading-[1.15] max-[700px]:text-[2.2rem]">
            Temukan Perusahaan <br />
            <span className="text-[#0A66C2] relative inline-block">
              Terbaik
              <svg className="absolute -bottom-1 left-0 w-full" height="6" viewBox="0 0 120 6" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
                <path d="M0 5 Q30 1 60 4 Q90 7 120 3" stroke="#0A66C2" strokeWidth="2.5" fill="none" strokeLinecap="round" />
              </svg>
            </span>{" "}
            untukmu
          </h1>

          <p className="text-slate-500 mb-8 text-[15px] max-w-[520px] leading-relaxed">
            Jelajahi ratusan perusahaan top Indonesia dan temukan tempat magang yang sesuai dengan passionmu.
          </p>

          <div className="flex gap-2 items-center bg-white rounded-2xl p-2 shadow-[0_4px_24px_rgba(10,102,194,0.12)] border border-white max-[700px]:flex-col max-[700px]:rounded-xl">
            <div className="flex items-center gap-2.5 flex-1 px-3">
              <Search size={17} className="text-slate-400 flex-shrink-0" />
              <input
                value={search}
                onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
                placeholder="Cari nama perusahaan atau industri..."
                className="flex-1 text-[14px] text-slate-700 bg-transparent outline-none placeholder:text-slate-400"
              />
            </div>
            <div className="w-px h-7 bg-slate-200 max-[700px]:hidden" />
            <div className="flex items-center gap-2.5 flex-1 px-3 max-[700px]:w-full">
              <MapPin size={16} className="text-slate-400 flex-shrink-0" />
              <input
                value={location}
                onChange={(e) => { setLocation(e.target.value); setCurrentPage(1); }}
                placeholder="Kota atau lokasi..."
                className="flex-1 text-[14px] text-slate-700 bg-transparent outline-none placeholder:text-slate-400"
              />
            </div>
            <button className="bg-[#0A66C2] text-white px-7 py-2.5 rounded-xl text-[14px] font-semibold hover:bg-[#0958A8] transition-colors flex-shrink-0 max-[700px]:w-full">
              Cari Perusahaan
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-[1200px] mx-auto px-8 py-10">
        <div className="flex items-center justify-between mb-6">
          <p className="text-[13.5px] text-slate-500">
            Menampilkan <span className="font-semibold text-slate-800">{filtered.length}</span> perusahaan
          </p>
          <div className="flex items-center gap-2 text-[13px] text-slate-500">
            <span>Urutkan:</span>
            <select className="text-[13px] font-medium text-slate-700 bg-white border border-slate-200 rounded-lg px-2 py-1 outline-none cursor-pointer">
              <option>Terbaru</option>
              <option>Lowongan Terbanyak</option>
              <option>Paling Aktif</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-16 text-center">
            <p className="text-slate-400 text-[15px]">Memuat data perusahaan...</p>
          </div>
        ) : errorMsg ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-16 text-center">
            <p className="text-red-400 text-[15px]">{errorMsg}</p>
          </div>
        ) : paginated.length > 0 ? (
          <div className="grid grid-cols-3 gap-4 max-[1024px]:grid-cols-2 max-[600px]:grid-cols-1">
            {paginated.map((company) => (
              <CompanyCard key={company.id} company={company} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200 p-16 text-center">
            <p className="text-slate-400 text-[15px]">Tidak ada perusahaan yang ditemukan.</p>
            <button
              onClick={() => { setSearch(""); setLocation(""); }}
              className="mt-4 text-[13px] text-[#0A66C2] font-semibold hover:underline"
            >
              Reset pencarian
            </button>
          </div>
        )}

        <Pagination currentPage={safePage} totalPages={totalPages} onPageChange={handlePageChange} />
      </div>
    </div>
  );
}