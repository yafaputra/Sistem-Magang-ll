"use client";

import {
  ShieldCheck,
  Rocket,
  Users2,
  FileCheck2,
} from "lucide-react";

const features = [
  {
    icon: FileCheck2,
    title: "Pendaftaran Digital",
    desc: "Ajukan lamaran magang cukup dari HP, tanpa bolak-balik kampus.",
  },
  {
    icon: ShieldCheck,
    title: "Validasi Terpusat",
    desc: "Dosen pembimbing dan admin bisa memvalidasi progres secara real-time.",
  },
  {
    icon: Users2,
    title: "Terhubung Perusahaan",
    desc: "Ribuan perusahaan mitra siap menerima mahasiswa magang setiap semester.",
  },
  {
    icon: Rocket,
    title: "Laporan Otomatis",
    desc: "Generate laporan akhir magang otomatis, siap dikumpulkan ke kampus.",
  },
];

export default function About() {
  return (
    <section
      className="w-full px-6 py-28 bg-white"
      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
    >
      <div className="max-w-[1250px] mx-auto grid lg:grid-cols-[1.1fr_1fr] gap-16 items-center">

        {/* ── Left: Narrative ── */}
        <div className="space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold tracking-wide uppercase bg-theme-accent border border-theme-blue">
            <span className="text-theme-secondary">Tentang Kami</span>
          </div>

          <h2 className="text-4xl md:text-5xl font-black text-theme-dark leading-[1.15] tracking-tight">
            Satu platform untuk seluruh proses magang
          </h2>

          <p className="text-slate-600 text-lg leading-relaxed max-w-[540px]">
            Kami membangun sistem informasi magang mahasiswa agar
            pendaftaran, monitoring, validasi, hingga pelaporan tidak lagi
            berserakan di banyak dokumen dan aplikasi. Semua pihak — mahasiswa,
            dosen, dan perusahaan — terhubung dalam satu alur digital yang
            transparan.
          </p>

          <div className="flex items-center gap-12 pt-8 border-t border-slate-100">
            <div>
              <p className="text-3xl md:text-4xl font-black text-theme-dark">50K+</p>
              <p className="text-sm text-slate-400 mt-1 font-medium">Mahasiswa Aktif</p>
            </div>
            <div>
              <p className="text-3xl md:text-4xl font-black text-theme-dark">1.200+</p>
              <p className="text-sm text-slate-400 mt-1 font-medium">Kampus Mitra</p>
            </div>
            <div>
              <p className="text-3xl md:text-4xl font-black text-theme-dark">98%</p>
              <p className="text-sm text-slate-400 mt-1 font-medium">Puas dengan Layanan</p>
            </div>
          </div>
        </div>

        {/* ── Right: Feature list ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
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