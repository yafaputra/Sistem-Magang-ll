"use client";

import {
  FileCheck2,
  ShieldCheck,
  BarChart3,
  FileText,
  Bell,
  Users2,
} from "lucide-react";

const features = [
  {
    icon: FileCheck2,
    title: "Pendaftaran Online",
    desc: "Ajukan lamaran magang dari HP, tanpa antre dan tanpa berkas fisik.",
  },
  {
    icon: BarChart3,
    title: "Monitoring Progres",
    desc: "Pantau tahapan magang mahasiswa secara real-time dari satu dashboard.",
  },
  {
    icon: ShieldCheck,
    title: "Validasi Dosen",
    desc: "Dosen pembimbing memvalidasi logbook dan progres langsung dari sistem.",
  },
  {
    icon: FileText,
    title: "Laporan Otomatis",
    desc: "Laporan akhir magang tergenerate otomatis, siap diunduh dan dikumpulkan.",
  },
  {
    icon: Bell,
    title: "Notifikasi Real-time",
    desc: "Update status lamaran dan validasi langsung masuk tanpa perlu cek manual.",
  },
  {
    icon: Users2,
    title: "Kolaborasi 3 Pihak",
    desc: "Mahasiswa, dosen, dan perusahaan terhubung dalam satu alur kerja yang sama.",
  },
];

export default function Features() {
  return (
    <section
      className="py-28 px-6 bg-slate-50"
      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
    >
      <div className="max-w-[1250px] mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold tracking-wide uppercase bg-theme-accent border border-theme-blue">
            <span className="text-theme-secondary">Fitur & Layanan</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-theme-dark mt-4 mb-3 leading-tight">
            Semua yang kamu butuhkan dalam satu sistem
          </h2>
          <p className="text-lg text-slate-500 max-w-[620px] mx-auto">
            Dirancang supaya proses magang dari pendaftaran sampai pelaporan
            berjalan tanpa hambatan.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="bg-white rounded-3xl p-8 flex flex-col gap-4 border border-slate-100 shadow-sm transition-all duration-300 hover:border-theme-blue hover:shadow-md"
            >
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-theme-accent border border-theme-blue flex-shrink-0">
                <Icon size={22} strokeWidth={1.8} className="text-theme-secondary" />
              </div>
              <h3 className="text-base font-extrabold text-theme-dark leading-snug">
                {title}
              </h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                {desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}