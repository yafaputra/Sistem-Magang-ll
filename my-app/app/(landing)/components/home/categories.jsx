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
      className="w-full px-5 py-20 bg-white"
      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
    >
      <div className="max-w-[1200px] mx-auto grid lg:grid-cols-[1fr_1.1fr] gap-12 items-center">

        {/* ── Left: Narrative ── */}
        <div className="space-y-6">
          <span className="text-xs font-bold tracking-widest uppercase text-blue-600">
            Tentang Kami
          </span>

          <h2 className="text-4xl font-extrabold text-slate-900 leading-[1.15] tracking-tight">
            Satu platform untuk seluruh proses magang
          </h2>

          <p className="text-slate-500 text-base leading-relaxed max-w-[480px]">
            Kami membangun sistem informasi magang mahasiswa agar
            pendaftaran, monitoring, validasi, hingga pelaporan tidak lagi
            berserakan di banyak dokumen dan aplikasi. Semua pihak — mahasiswa,
            dosen, dan perusahaan — terhubung dalam satu alur digital yang
            transparan.
          </p>

          <div className="flex items-center gap-10 pt-5 border-t border-slate-200">
            <div>
              <p className="text-2xl font-extrabold text-slate-900">50K+</p>
              <p className="text-sm text-slate-400">Mahasiswa Aktif</p>
            </div>
            <div>
              <p className="text-2xl font-extrabold text-slate-900">1.200+</p>
              <p className="text-sm text-slate-400">Kampus Mitra</p>
            </div>
            <div>
              <p className="text-2xl font-extrabold text-slate-900">98%</p>
              <p className="text-sm text-slate-400">Puas dengan Layanan</p>
            </div>
          </div>
        </div>

        {/* ── Right: Feature list ── */}
        <div className="grid grid-cols-2 gap-4">
          {features.map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="rounded-2xl p-6 flex flex-col gap-3 border border-slate-200 transition-colors duration-200 hover:border-blue-300"
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