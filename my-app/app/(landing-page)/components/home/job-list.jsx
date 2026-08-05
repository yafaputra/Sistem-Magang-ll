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
      className="py-20 px-8 bg-slate-50"
      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
    >
      <div className="max-w-[1200px] mx-auto">
        <div className="text-center mb-12">
          <span className="text-xs font-bold tracking-widest uppercase text-blue-600">
            Fitur & Layanan
          </span>
          <h2 className="text-[2rem] font-extrabold text-slate-900 mt-3 mb-2 leading-tight">
            Semua yang kamu butuhkan dalam satu sistem
          </h2>
          <p className="text-[15px] text-slate-500 max-w-[560px] mx-auto">
            Dirancang supaya proses magang dari pendaftaran sampai pelaporan
            berjalan tanpa hambatan.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-4 max-[1024px]:grid-cols-2 max-[600px]:grid-cols-1">
          {features.map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="bg-white rounded-2xl p-6 flex flex-col gap-3 border border-slate-200 transition-colors duration-200 hover:border-blue-300"
            >
              <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-slate-50 flex-shrink-0">
                <Icon size={19} strokeWidth={1.8} className="text-blue-600" />
              </div>
              <h3 className="text-[14.5px] font-bold text-slate-900 leading-snug">
                {title}
              </h3>
              <p className="text-[13px] text-slate-500 leading-relaxed">
                {desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}