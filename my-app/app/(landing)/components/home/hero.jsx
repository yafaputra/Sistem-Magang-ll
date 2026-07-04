import Image from "next/image";
import { BriefcaseBusiness, Building2, TrendingUp } from "lucide-react";

const Hero = () => {
  return (
    <section className="w-full px-5 pt-24 pb-12 bg-blue-50" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <div className="max-w-[1200px] mx-auto flex flex-col lg:flex-row items-center justify-between gap-12">

        {/* ── Left: Text Content ── */}
        <div className="flex-1 max-w-[560px] space-y-6">

          <span
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold tracking-wide uppercase"
            style={{ background: "#e0f2fe", color: "#0284c7" }}
          >
            <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ background: "#38bdf8" }} />
            #1 Platform Magang Mahasiswa
          </span>

          <h1
            className="text-5xl font-extrabold text-slate-900 leading-[1.15] tracking-tight"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            Platform magang mahasiswa yang modern
          </h1>

          <p className="text-slate-500 text-base leading-relaxed">
            Sistem informasi magang mahasiswa untuk mempermudah proses
            pendaftaran, monitoring, validasi, dan pelaporan secara digital
            dan terpusat.
          </p>

          <div className="flex items-center gap-4 pt-2">
            <button className="text-white px-7 py-3 rounded-xl font-bold text-[15px] transition-colors bg-[#38bdf8] hover:bg-[#0ea5e9]">
              Daftar Sekarang
            </button>
          </div>

          <div className="flex items-center gap-8 pt-4 border-t" style={{ borderColor: "#bae6fd" }}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: "#e0f2fe" }}>
                <BriefcaseBusiness size={18} strokeWidth={1.8} style={{ color: "#0284c7" }} />
              </div>
              <div>
                <p className="text-[15px] font-extrabold text-slate-900 leading-none">1.75.324</p>
                <p className="text-[11.5px] text-slate-400 mt-1">Live Job</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full flex items-center justify-center bg-amber-50 flex-shrink-0">
                <Building2 size={18} strokeWidth={1.8} className="text-amber-600" />
              </div>
              <div>
                <p className="text-[15px] font-extrabold text-slate-900 leading-none">97.354</p>
                <p className="text-[11.5px] text-slate-400 mt-1">Companies</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full flex items-center justify-center bg-emerald-50 flex-shrink-0">
                <TrendingUp size={18} strokeWidth={1.8} className="text-emerald-600" />
              </div>
              <div>
                <p className="text-[15px] font-extrabold text-slate-900 leading-none">7.532</p>
                <p className="text-[11.5px] text-slate-400 mt-1">New Jobs</p>
              </div>
            </div>
          </div>
        </div>

        {/* ── Right: Image ── */}
        <div className="flex-1 flex justify-end w-full">
          <div className="relative w-full max-w-[460px] aspect-square">
            <div className="absolute -top-6 -right-6 w-32 h-32 rounded-full" style={{ background: "#e0f2fe" }} />
            <div className="absolute -bottom-8 -left-8 w-40 h-40 rounded-full bg-amber-100" />
            <div className="relative w-full h-full rounded-2xl overflow-hidden bg-white" style={{ border: "1px solid #bae6fd" }}>
              <Image
                src="/hero-image.png"
                alt="Hero Image"
                width={460}
                height={460}
                className="object-cover w-full h-full relative z-10"
              />
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default Hero;