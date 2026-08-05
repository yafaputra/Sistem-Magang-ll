"use client";

import { UserPlus, Send, ClipboardCheck, GraduationCap } from "lucide-react";

const steps = [
  {
    number: "01",
    icon: UserPlus,
    title: "Buat Akun",
    desc: "Daftar sebagai mahasiswa menggunakan email kampus dalam hitungan menit.",
  },
  {
    number: "02",
    icon: Send,
    title: "Ajukan Lamaran",
    desc: "Pilih perusahaan dan posisi magang, lalu kirim lamaran langsung dari platform.",
  },
  {
    number: "03",
    icon: ClipboardCheck,
    title: "Jalani & Validasi",
    desc: "Isi logbook harian, dosen pembimbing memvalidasi progres secara berkala.",
  },
  {
    number: "04",
    icon: GraduationCap,
    title: "Selesai & Laporan",
    desc: "Sistem menyusun laporan akhir otomatis, siap dikumpulkan ke kampus.",
  },
];

export default function HowItWorks() {
  return (
    <section
      className="py-28 px-6 bg-theme-accent/40"
      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
    >
      <div className="max-w-[1250px] mx-auto">
        <div className="text-center mb-18">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold tracking-wide uppercase bg-theme-accent border border-theme-blue">
            <span className="text-theme-secondary">Cara Kerja</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-theme-dark mt-4 mb-3 leading-tight">
            Empat langkah menuju magang impianmu
          </h2>
          <p className="text-lg text-slate-500 max-w-[620px] mx-auto">
            Alur yang sama, dari pendaftaran sampai laporan akhir, tanpa berpindah aplikasi.
          </p>
        </div>

        <div className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mt-12">
          {/* connecting line, desktop only */}
          <div className="hidden lg:block absolute top-[28px] left-[12.5%] right-[12.5%] h-0.5" style={{ backgroundColor: "var(--color-border-blue)" }} />

          {steps.map(({ number, icon: Icon, title, desc }) => (
            <div key={number} className="relative flex flex-col items-center text-center gap-4">
              {/* Badge Pill (bg-white covers the absolute line behind it) */}
              <div className="relative z-10 flex items-center gap-3 bg-white px-4 py-2 rounded-full border border-theme-blue shadow-sm">
                <span className="text-xs font-black text-theme-secondary">{number}</span>
                <div className="w-10 h-10 rounded-full flex items-center justify-center bg-theme-accent border border-theme-blue flex-shrink-0">
                  <Icon size={18} strokeWidth={1.8} className="text-theme-secondary" />
                </div>
              </div>
              <h3 className="text-base font-extrabold text-theme-dark mt-2">{title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed max-w-[240px]">
                {desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}