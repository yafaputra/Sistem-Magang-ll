import Image from "next/image";
import { BriefcaseBusiness, Building2, TrendingUp, ArrowRight } from "lucide-react";

const Hero = () => {
  return (
    <section className="relative w-full overflow-hidden bg-blue-50 pt-32 pb-24" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>

      <div className="max-w-[1250px] mx-auto px-6 flex flex-col lg:flex-row items-center justify-between gap-16">
        
        {/* ── Left: Text Content ── */}
        <div className="flex-1 space-y-8 text-center lg:text-left">
          
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold tracking-wide uppercase shadow-sm bg-white border border-blue-100/80">
            <span className="w-2 h-2 rounded-full inline-block bg-sky-400 animate-ping" />
            <span className="text-[#0284c7] font-extrabold">#1 Platform Magang Mahasiswa</span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 leading-[1.2] tracking-tight">
            Temukan Peluang <br className="hidden sm:inline" />
            Karir <span className="text-[#0284c7] relative inline-block">
              Impianmu
              <span className="absolute bottom-1 left-0 w-full h-[10px] bg-sky-200/60 rounded-full -z-10" />
            </span>
          </h1>

          <p className="text-slate-500 text-lg leading-relaxed max-w-[580px] mx-auto lg:mx-0">
            Ratusan perusahaan terbaik Indonesia mencari talenta sepertimu. Mulai perjalanan karirmu hari ini.
          </p>

          {/* ── CTA Buttons ── */}
          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
            <button className="w-full sm:w-auto text-white px-8 py-4 rounded-2xl font-bold text-base transition-all duration-300 bg-[#38bdf8] hover:bg-[#0ea5e9] shadow-lg shadow-sky-200/50 hover:shadow-sky-300/80 transform hover:-translate-y-0.5 hover:scale-[1.02] flex items-center justify-center gap-2 cursor-pointer">
              Daftar Sekarang
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="w-full sm:w-auto px-8 py-4 rounded-2xl font-bold text-base transition-all duration-200 bg-white hover:bg-slate-50 text-slate-700 border-2 border-slate-100 hover:border-slate-200 shadow-sm flex items-center justify-center gap-2 cursor-pointer">
              Pelajari Selengkapnya
            </button>
          </div>

          {/* ── Stats Block ── */}
          <div className="pt-8 border-t border-slate-100 grid grid-cols-3 gap-4 md:gap-8 max-w-[550px] mx-auto lg:mx-0">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-3 text-center md:text-left hover:scale-105 transition-transform duration-300">
              <div className="w-11 h-11 rounded-2xl flex items-center justify-center bg-blue-100/50 border border-blue-200/60 flex-shrink-0">
                <BriefcaseBusiness size={20} strokeWidth={1.8} className="text-[#0284c7]" />
              </div>
              <div>
                <p className="text-lg md:text-xl font-black text-slate-900 leading-none">175.324</p>
                <p className="text-xs text-slate-400 mt-1.5 font-medium tracking-wide">Live Jobs</p>
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row items-center md:items-start gap-3 text-center md:text-left hover:scale-105 transition-transform duration-300">
              <div className="w-11 h-11 rounded-2xl flex items-center justify-center bg-amber-50 border border-amber-100/80 flex-shrink-0">
                <Building2 size={20} strokeWidth={1.8} className="text-amber-600" />
              </div>
              <div>
                <p className="text-lg md:text-xl font-black text-slate-900 leading-none">97.354</p>
                <p className="text-xs text-slate-400 mt-1.5 font-medium tracking-wide">Companies</p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-center md:items-start gap-3 text-center md:text-left hover:scale-105 transition-transform duration-300">
              <div className="w-11 h-11 rounded-2xl flex items-center justify-center bg-emerald-50 border border-emerald-100/80 flex-shrink-0">
                <TrendingUp size={20} strokeWidth={1.8} className="text-emerald-600" />
              </div>
              <div>
                <p className="text-lg md:text-xl font-black text-slate-900 leading-none">7.532</p>
                <p className="text-xs text-slate-400 mt-1.5 font-medium tracking-wide">New Jobs</p>
              </div>
            </div>
          </div>

        </div>

        {/* ── Right: Image ── */}
        <div className="flex-1 w-full flex justify-center lg:justify-end">
          <div className="relative w-full max-w-[460px] aspect-square">
            {/* Background circles */}
            <div className="absolute -top-6 -right-6 w-32 h-32 rounded-full" style={{ background: "#e0f2fe" }} />
            <div className="absolute -bottom-8 -left-8 w-40 h-40 rounded-full bg-[#fef3c7]/70" />

            {/* Main Image Wrapper */}
            <div className="relative w-full h-full rounded-2xl overflow-hidden bg-white shadow-sm" style={{ border: "1px solid #bae6fd" }}>
              <Image
                src="/hero-image.png"
                alt="Magangku Hero Banner"
                width={460}
                height={460}
                className="object-cover w-full h-full relative z-10"
                priority
              />
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default Hero;