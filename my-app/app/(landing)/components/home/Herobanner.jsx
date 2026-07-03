"use client";
import React from "react";
import Link from "next/link";
import { ArrowRight, Palette, Code2, Megaphone } from "lucide-react";

const jobCards = [
  {
    id: 1,
    title: "Product Designer",
    type: "Full Time",
    location: "Remote",
    icon: <Palette size={18} />,
    iconColor: "#7C3AED",
    iconBg: "#ede9fe",
    featured: false,
  },
  {
    id: 2,
    title: "Frontend Developer",
    type: "Full Time",
    location: "Remote",
    icon: <Code2 size={18} />,
    iconColor: "#0ea5e9",
    iconBg: "#e0f2fe",
    featured: true,
  },
  {
    id: 3,
    title: "Marketing Manager",
    type: "Full Time",
    location: "Onsite",
    icon: <Megaphone size={18} />,
    iconColor: "#059669",
    iconBg: "#d1fae5",
    featured: false,
  },
];

export default function HeroBanner() {
  return (
    <div
      className="bg-white p-6 max-w-6xl mx-auto my-20"
      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
    >
      <section
        className="relative flex items-center justify-between gap-8 min-h-[220px] px-14 py-12"
        style={{
          backgroundColor: "#0ea5e9",
          borderRadius: "32px",
        }}
      >
        {/* Left: Text */}
        <div className="flex-1 z-10">
          <span className="inline-flex items-center gap-1.5 bg-white/90 text-sky-700 rounded-full px-3.5 py-1 text-[11px] font-semibold mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-sky-500 inline-block" />
            Untuk Perusahaan
          </span>

          <h1 className="text-white font-extrabold leading-tight text-[26px] mb-2.5 max-w-[280px]">
            Mulai Rekrut Talenta Terbaik
          </h1>
          <p className="text-sky-50 text-[13px] mb-6 leading-relaxed max-w-[300px]">
            Pasang lowongan magang dan pekerjaan dengan mudah
          </p>

          <Link
            href="/register-perusahaan"
            className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-white hover:bg-sky-50 text-sky-600 rounded-[12px] text-[13px] font-extrabold transition-all duration-200 hover:-translate-y-0.5"
          >
            Daftar sekarang
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Right: Job Cards */}
        <div className="flex flex-col gap-2.5 z-10 flex-shrink-0">
          {jobCards.map((job) => (
            <div
              key={job.id}
              className="bg-white rounded-[16px] px-4 py-3 flex items-center gap-3 min-w-[230px] cursor-pointer transition-all duration-200 hover:scale-[1.03] hover:shadow-lg"
            >
              {/* Icon */}
              <div
                className="w-[38px] h-[38px] rounded-[10px] flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: job.iconBg, color: job.iconColor }}
              >
                {job.icon}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-extrabold text-slate-900 leading-tight">
                  {job.title}
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  {job.type} · {job.location}
                </p>
              </div>

              {/* Badge */}
              {job.featured && (
                <span className="bg-sky-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-full flex-shrink-0">
                  Apply Now
                </span>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}