"use client";
import { Building2, BriefcaseBusiness, MapPin, Clock3 } from "lucide-react";
import { useState } from "react";

const companies = [
  { id: 1,  name: "Google Indonesia",  location: "Jakarta, Indonesia", industry: "Technology",  jobCount: 5,  lastActive: "20 hours ago", logo: "G"  },
  { id: 2,  name: "Tokopedia",         location: "Jakarta, Indonesia", industry: "E-Commerce",  jobCount: 12, lastActive: "2 hours ago",  logo: "T"  },
  { id: 3,  name: "Gojek",             location: "Jakarta, Indonesia", industry: "Technology",  jobCount: 8,  lastActive: "5 hours ago",  logo: "GJ" },
  { id: 4,  name: "Traveloka",         location: "Jakarta, Indonesia", industry: "Travel Tech", jobCount: 6,  lastActive: "1 day ago",    logo: "TV" },
  { id: 5,  name: "Shopee Indonesia",  location: "Jakarta, Indonesia", industry: "E-Commerce",  jobCount: 15, lastActive: "3 hours ago",  logo: "S"  },
  { id: 6,  name: "Bukalapak",         location: "Jakarta, Indonesia", industry: "Technology",  jobCount: 9,  lastActive: "18 hours ago", logo: "B"  },
  { id: 7,  name: "Grab Indonesia",    location: "Jakarta, Indonesia", industry: "Transport",   jobCount: 7,  lastActive: "10 hours ago", logo: "GR" },
  { id: 8,  name: "OVO",               location: "Jakarta, Indonesia", industry: "Fintech",     jobCount: 4,  lastActive: "6 hours ago",  logo: "O"  },
  { id: 9,  name: "Dana",              location: "Jakarta, Indonesia", industry: "Fintech",     jobCount: 3,  lastActive: "12 hours ago", logo: "D"  },
  { id: 10, name: "Blibli",            location: "Jakarta, Indonesia", industry: "E-Commerce",  jobCount: 11, lastActive: "8 hours ago",  logo: "BL" },
  { id: 11, name: "Tiket.com",         location: "Jakarta, Indonesia", industry: "Travel Tech", jobCount: 5,  lastActive: "1 day ago",    logo: "TK" },
  { id: 12, name: "Ruangguru",         location: "Jakarta, Indonesia", industry: "EdTech",      jobCount: 6,  lastActive: "4 hours ago",  logo: "RG" },
];

const logoColors = {
  G:  { bg: "#E8F0FE", text: "#1A73E8" },
  T:  { bg: "#FFF3E0", text: "#E65100" },
  GJ: { bg: "#E8F5E9", text: "#2E7D32" },
  TV: { bg: "#E3F2FD", text: "#1565C0" },
  S:  { bg: "#FCE4EC", text: "#C62828" },
  B:  { bg: "#F3E5F5", text: "#6A1B9A" },
  GR: { bg: "#E0F7FA", text: "#00838F" },
  O:  { bg: "#F3E5F5", text: "#7B1FA2" },
  D:  { bg: "#E8F5E9", text: "#1B5E20" },
  BL: { bg: "#FFF8E1", text: "#F57F17" },
  TK: { bg: "#FCE4EC", text: "#880E4F" },
  RG: { bg: "#E8EAF6", text: "#283593" },
};

function CompanyCard({ company }) {
  const color = logoColors[company.logo] ?? { bg: "#F5F5F5", text: "#333" };

  return (
    <div className="bg-white border-2 border-blue-300 rounded-[20px] p-5 flex flex-col gap-3.5 cursor-pointer transition-all duration-200 hover:shadow-[0_12px_36px_rgba(14,165,233,0.15)] hover:border-sky-400 hover:-translate-y-1">

      {/* Header */}
      <div className="flex items-center gap-3">
        <div
          className="w-[46px] h-[46px] rounded-[12px] flex items-center justify-center font-bold text-[12px] flex-shrink-0"
          style={{ backgroundColor: color.bg, color: color.text }}
        >
          {company.logo}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[13.5px] font-extrabold text-slate-900 truncate">{company.name}</p>
          <p className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-1">
            <MapPin size={11} strokeWidth={1.8} />
            {company.location}
          </p>
        </div>
      </div>

      <div className="border-t-2 border-blue-100" />

      {/* Meta */}
      <div className="flex flex-col gap-2">
        <span className="text-[12px] text-slate-600 flex items-center gap-2">
          <Building2 size={14} strokeWidth={1.8} className="text-sky-400" />
          {company.industry}
        </span>
        <span className="text-[12px] text-slate-600 flex items-center gap-2">
          <BriefcaseBusiness size={14} strokeWidth={1.8} className="text-sky-400" />
          {company.jobCount} Jobs
        </span>
      </div>

      <div className="border-t-2 border-blue-100" />

      {/* Footer */}
      <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
        <Clock3 size={12} strokeWidth={1.8} />
        <span>Last active {company.lastActive}</span>
      </div>
    </div>
  );
}

export default function CompanyGrid() {
  const [visibleCount, setVisibleCount] = useState(8);

  return (
    <section
      className="py-16 px-8 border-b-2 border-blue-300"
      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
    >
      <div className="max-w-[1200px] mx-auto">
        <h2 className="text-center text-[2rem] font-extrabold text-slate-900 mb-2 leading-tight">
          Temukan Perusahaan <span className="text-sky-500">Impianmu</span>
        </h2>
        <p className="text-center text-[14px] text-slate-500 mb-10">
          Ratusan perusahaan terbaik menunggumu
        </p>

        <div className="grid grid-cols-4 gap-[18px] mb-10 max-[1100px]:grid-cols-2 max-[580px]:grid-cols-1">
          {companies.slice(0, visibleCount).map((company) => (
            <CompanyCard key={company.id} company={company} />
          ))}
        </div>

        {visibleCount < companies.length && (
          <div className="flex justify-center">
            <button
              className="text-white px-12 py-3.5 rounded-[14px] font-bold text-[14px] transition-all duration-200 hover:-translate-y-0.5 hover:brightness-110"
              style={{
                background: "linear-gradient(135deg, #38bdf8 0%, #0ea5e9 100%)",
                boxShadow: "0 4px 16px rgba(14,165,233,0.35)",
              }}
              onClick={() => setVisibleCount((prev) => prev + 8)}
            >
              Lihat Lebih Banyak
            </button>
          </div>
        )}
      </div>
    </section>
  );
}