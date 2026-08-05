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
      className="py-20 px-8 bg-blue-20"
      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
    >
      <div className="max-w-[1200px] mx-auto">
        <div className="text-center mb-14">
          <span className="text-xs font-bold tracking-widest uppercase text-blue-600">
            Cara Kerja
          </span>
          <h2 className="text-[2rem] font-extrabold text-slate-900 mt-3 mb-2 leading-tight">
            Empat langkah menuju magang impianmu
          </h2>
          <p className="text-[15px] text-slate-500 max-w-[560px] mx-auto">
            Alur yang sama, dari pendaftaran sampai laporan akhir, tanpa
            berpindah aplikasi.
          </p>
        </div>

        <div className="relative grid grid-cols-4 gap-6 max-[1024px]:grid-cols-2 max-[560px]:grid-cols-1">
          {/* connecting line, desktop only */}
          <div className="hidden lg:block absolute top-[28px] left-[12.5%] right-[12.5%] h-px bg-slate-200" />

          {steps.map(({ number, icon: Icon, title, desc }) => (
            <div key={number} className="relative flex flex-col items-center text-center gap-4">
              <div className="relative z-10 flex items-center gap-2 bg-white px-2">
                <span className="text-xs font-bold text-blue-600">{number}</span>
                <div className="w-14 h-14 rounded-full flex items-center justify-center bg-slate-50 border border-slate-200">
                  <Icon size={22} strokeWidth={1.8} className="text-blue-600" />
                </div>
              </div>
              <h3 className="text-[14.5px] font-bold text-slate-900">{title}</h3>
              <p className="text-[13px] text-slate-500 leading-relaxed max-w-[220px]">
                {desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}