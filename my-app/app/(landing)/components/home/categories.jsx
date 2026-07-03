"use client";

import {
  Code2, BarChart2, Megaphone, Film,
  DollarSign, Brush, Music, HeartPulse,
} from "lucide-react";

const categories = [
  { icon: Code2,      title: "Development & IT",     jobs: 958, iconBg: "#e0f2fe", iconBorder: "#7dd3fc", iconColor: "#0284c7" },
  { icon: BarChart2,  title: "Data & Science",        jobs: 754, iconBg: "#e0f2fe", iconBorder: "#7dd3fc", iconColor: "#0284c7" },
  { icon: Megaphone,  title: "Digital Marketing",     jobs: 612, iconBg: "#e0f2fe", iconBorder: "#7dd3fc", iconColor: "#0284c7" },
  { icon: Film,       title: "Video & Animation",     jobs: 430, iconBg: "#e0f2fe", iconBorder: "#7dd3fc", iconColor: "#0284c7" },
  { icon: DollarSign, title: "Finance & Accounting",  jobs: 519, iconBg: "#e0f2fe", iconBorder: "#7dd3fc", iconColor: "#0284c7" },
  { icon: Brush,      title: "Graphics & Design",     jobs: 876, iconBg: "#e0f2fe", iconBorder: "#7dd3fc", iconColor: "#0284c7" },
  { icon: Music,      title: "Audio & Music",         jobs: 298, iconBg: "#e0f2fe", iconBorder: "#7dd3fc", iconColor: "#0284c7" },
  { icon: HeartPulse, title: "Health & Care",         jobs: 341, iconBg: "#e0f2fe", iconBorder: "#7dd3fc", iconColor: "#0284c7" },
];

function CategoryCard({ cat }) {
  const Icon = cat.icon;
  return (
    <div className="bg-white border-2 border-blue-300 rounded-[20px] p-7 flex flex-col items-center text-center cursor-pointer transition-all duration-200 gap-2.5 hover:shadow-[0_12px_36px_rgba(14,165,233,0.15)] hover:border-sky-400 hover:-translate-y-1">
      <div
        className="w-14 h-14 rounded-[14px] flex items-center justify-center flex-shrink-0 border-2"
        style={{
          backgroundColor: cat.iconBg,
          borderColor: cat.iconBorder,
        }}
      >
        <Icon size={24} color={cat.iconColor} strokeWidth={1.8} />
      </div>
      <h3 className="text-[13.5px] font-bold text-slate-900 leading-snug m-0">
        {cat.title}
      </h3>
      <span
        className="text-xs font-semibold px-3 py-1 rounded-full border border-blue-200 text-sky-700"
        style={{ backgroundColor: "#e0f2fe" }}
      >
        {cat.jobs.toLocaleString()} Jobs
      </span>
    </div>
  );
}

export default function Categories() {
  return (
    <section className="bg-[#f8fafc] py-20 px-8" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <div className="max-w-[1200px] mx-auto">
        <h2 className="text-center text-[2rem] font-extrabold text-slate-900 mb-2 leading-tight">
          Pilih Kategori <span className="text-sky-500">Magang</span>
        </h2>
        <p className="text-center text-[15px] text-slate-500 mb-10">
          Temukan peluang magang sesuai bidang keahlian dan minatmu
        </p>
        <div className="grid grid-cols-4 gap-[18px] max-[1024px]:grid-cols-2">
          {categories.map((cat, i) => (
            <CategoryCard key={i} cat={cat} />
          ))}
        </div>
      </div>
    </section>
  );
}