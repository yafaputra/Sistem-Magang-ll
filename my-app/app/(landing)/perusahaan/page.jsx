"use client";

import { useState } from "react";
import { MapPin, Search, Building2, BriefcaseBusiness, Clock, ChevronLeft, ChevronRight } from "lucide-react";

// ─── Data ─────────────────────────────────────────────────────────────────────

const companies = [
  { id: 1,  name: "Google Indonesia",   location: "Jakarta, Indonesia",  industry: "Technology",     jobs: 8,  lastActive: "2 jam lalu",    logo: "G"  },
  { id: 2,  name: "Tokopedia",          location: "Jakarta, Indonesia",  industry: "E-Commerce",     jobs: 12, lastActive: "5 jam lalu",    logo: "T"  },
  { id: 3,  name: "Gojek",              location: "Jakarta, Indonesia",  industry: "Transportation", jobs: 7,  lastActive: "1 jam lalu",    logo: "GJ" },
  { id: 4,  name: "Traveloka",          location: "Bali, Indonesia",     industry: "Travel & Tech",  jobs: 5,  lastActive: "20 jam lalu",   logo: "TV" },
  { id: 5,  name: "Shopee Indonesia",   location: "Jakarta, Indonesia",  industry: "E-Commerce",     jobs: 10, lastActive: "3 jam lalu",    logo: "S"  },
  { id: 6,  name: "Bukalapak",          location: "Bandung, Indonesia",  industry: "Technology",     jobs: 4,  lastActive: "12 jam lalu",   logo: "B"  },
  { id: 7,  name: "Ruangguru",          location: "Jakarta, Indonesia",  industry: "EdTech",         jobs: 6,  lastActive: "8 jam lalu",    logo: "RG" },
  { id: 8,  name: "OVO",                location: "Jakarta, Indonesia",  industry: "Fintech",        jobs: 3,  lastActive: "1 hari lalu",   logo: "O"  },
  { id: 9,  name: "Grab Indonesia",     location: "Jakarta, Indonesia",  industry: "Transportation", jobs: 9,  lastActive: "30 menit lalu", logo: "GR" },
  { id: 10, name: "Blibli",             location: "Jakarta, Indonesia",  industry: "E-Commerce",     jobs: 5,  lastActive: "6 jam lalu",    logo: "BL" },
  { id: 11, name: "Dana",               location: "Jakarta, Indonesia",  industry: "Fintech",        jobs: 4,  lastActive: "2 jam lalu",    logo: "D"  },
  { id: 12, name: "Tiket.com",          location: "Jakarta, Indonesia",  industry: "Travel & Tech",  jobs: 3,  lastActive: "15 jam lalu",   logo: "TC" },
];

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
  D:  { bg: "#E8F5E9", text: "#1B5E20" },
  TC: { bg: "#FFF3E0", text: "#BF360C" },
};

function CompanyLogo({ logo }) {
  const colors = logoColors[logo] ?? { bg: "#F3F4F6", text: "#374151" };
  if (logo === "G") {
    return (
      <div className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: colors.bg }}>
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
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
      className="w-14 h-14 rounded-2xl flex items-center justify-center font-bold text-[14px] flex-shrink-0"
      style={{ backgroundColor: colors.bg, color: colors.text }}
    >
      {logo}
    </div>
  );
}

// ─── Company Card ─────────────────────────────────────────────────────────────

function CompanyCard({ company }) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden cursor-pointer transition-all duration-200 hover:shadow-[0_6px_24px_rgba(10,102,194,0.10)] hover:border-[#6CC1FF] hover:-translate-y-0.5 group">

      {/* Top section */}
      <div className="p-5 pb-4">
        <div className="flex items-start gap-3.5 mb-4">
          <CompanyLogo logo={company.logo} />
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

        {/* Industry + Jobs */}
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

      {/* Footer: last active */}
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
  const [search, setSearch]     = useState("");
  const [location, setLocation] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const filtered = companies.filter(c => {
    const q = search.toLowerCase();
    const matchSearch   = !q || c.name.toLowerCase().includes(q) || c.industry.toLowerCase().includes(q);
    const matchLocation = !location || c.location.toLowerCase().includes(location.toLowerCase());
    return matchSearch && matchLocation;
  });

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const safePage   = Math.min(currentPage, totalPages || 1);
  const paginated  = filtered.slice((safePage - 1) * ITEMS_PER_PAGE, safePage * ITEMS_PER_PAGE);

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
        <div className="absolute top-0 right-0 w-[500px] h-[500px] opacity-40 pointer-events-none"
          style={{ background: "radial-gradient(circle at 80% 20%, #bfdbfe 0%, transparent 65%)" }} />

        <div className="relative max-w-[1200px] mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white border border-[#bfdbfe] text-[#1D4ED8] text-[12px] font-semibold px-4 py-1.5 rounded-full mb-6 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-[#0A66C2]" />
            {companies.length} Perusahaan Terdaftar
          </div>

          <h1 className="text-[3rem] font-black text-slate-900 mb-4 leading-[1.15] max-[700px]:text-[2.2rem]">
            Temukan Perusahaan <br />
            <span className="text-[#0A66C2] relative inline-block">
              Terbaik
              <svg className="absolute -bottom-1 left-0 w-full" height="6" viewBox="0 0 120 6" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
                <path d="M0 5 Q30 1 60 4 Q90 7 120 3" stroke="#0A66C2" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
              </svg>
            </span>
            {" "}untukmu
          </h1>

          <p className="text-slate-500 mb-8 text-[15px] max-w-[520px] leading-relaxed">
            Jelajahi ratusan perusahaan top Indonesia dan temukan tempat magang yang sesuai dengan passionmu.
          </p>

          {/* Search bar */}
          <div className="flex gap-2 items-center bg-white rounded-2xl p-2 shadow-[0_4px_24px_rgba(10,102,194,0.12)] border border-white max-[700px]:flex-col max-[700px]:rounded-xl">
            <div className="flex items-center gap-2.5 flex-1 px-3">
              <Search size={17} className="text-slate-400 flex-shrink-0" />
              <input
                value={search}
                onChange={e => { setSearch(e.target.value); setCurrentPage(1); }}
                placeholder="Cari nama perusahaan atau industri..."
                className="flex-1 text-[14px] text-slate-700 bg-transparent outline-none placeholder:text-slate-400"
              />
            </div>
            <div className="w-px h-7 bg-slate-200 max-[700px]:hidden" />
            <div className="flex items-center gap-2.5 flex-1 px-3 max-[700px]:w-full">
              <MapPin size={16} className="text-slate-400 flex-shrink-0" />
              <input
                value={location}
                onChange={e => { setLocation(e.target.value); setCurrentPage(1); }}
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

        {/* Results header */}
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

        {/* Grid */}
        {paginated.length > 0 ? (
          <div className="grid grid-cols-3 gap-4 max-[1024px]:grid-cols-2 max-[600px]:grid-cols-1">
            {paginated.map(company => (
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

        {/* Pagination */}
        <Pagination
          currentPage={safePage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
}