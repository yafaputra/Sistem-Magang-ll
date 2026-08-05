import Image from "next/image";
import { BriefcaseBusiness, Building2, TrendingUp, ArrowRight, Star, ShieldCheck } from "lucide-react";

const Hero = () => {
  return (
    <section className="relative w-full overflow-hidden bg-blue-50 pt-32 pb-24" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <div className="max-w-[1250px] mx-auto px-6 flex flex-col lg:flex-row items-center justify-between gap-16">
        
        {/* ── Left: Text Content ── */}
        <div className="flex-1 space-y-8 text-center lg:text-left">
          
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold tracking-wide uppercase shadow-sm bg-white border border-blue-200">
            <span className="w-2 h-2 rounded-full inline-block bg-sky-400" />
            <span className="text-[#0284c7] font-extrabold">#1 Platform Magang Mahasiswa</span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 leading-[1.15] tracking-tight">
            Platform magang mahasiswa yang modern
          </h1>

          <p className="text-slate-500 text-lg leading-relaxed max-w-[580px] mx-auto lg:mx-0">
            Sistem informasi terpadu untuk mempermudah pendaftaran, monitoring, 
            validasi, dan pelaporan magang secara digital dan real-time.
          </p>

          {/* ── CTA Buttons ── */}
          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
            <button className="w-full sm:w-auto text-white px-8 py-4 rounded-2xl font-bold text-base transition-colors bg-[#38bdf8] hover:bg-[#0ea5e9] shadow-lg shadow-sky-200/50 hover:shadow-sky-300/80 flex items-center justify-center gap-2 cursor-pointer">
              Daftar Sekarang
              <ArrowRight size={18} />
            </button>
            <button className="w-full sm:w-auto px-8 py-4 rounded-2xl font-bold text-base transition-all duration-200 bg-white hover:bg-slate-50 text-slate-700 border-2 border-slate-200 hover:border-slate-300 shadow-sm flex items-center justify-center gap-2 cursor-pointer">
              Pelajari Selengkapnya
            </button>
          </div>

          {/* ── Stats Block ── */}
          <div className="pt-8 border-t border-slate-200 grid grid-cols-3 gap-4 md:gap-8 max-w-[550px] mx-auto lg:mx-0">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-3 text-center md:text-left">
              <div className="w-11 h-11 rounded-2xl flex items-center justify-center bg-blue-100/50 border border-blue-200 flex-shrink-0">
                <BriefcaseBusiness size={20} strokeWidth={1.8} className="text-[#0284c7]" />
              </div>
              <div>
                <p className="text-lg md:text-xl font-black text-slate-900 leading-none">175.324</p>
                <p className="text-xs text-slate-400 mt-1.5 font-medium tracking-wide">Live Jobs</p>
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row items-center md:items-start gap-3 text-center md:text-left">
              <div className="w-11 h-11 rounded-2xl flex items-center justify-center bg-amber-50 border border-amber-100 flex-shrink-0">
                <Building2 size={20} strokeWidth={1.8} className="text-amber-600" />
              </div>
              <div>
                <p className="text-lg md:text-xl font-black text-slate-900 leading-none">97.354</p>
                <p className="text-xs text-slate-400 mt-1.5 font-medium tracking-wide">Companies</p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-center md:items-start gap-3 text-center md:text-left">
              <div className="w-11 h-11 rounded-2xl flex items-center justify-center bg-emerald-50 border border-emerald-100 flex-shrink-0">
                <TrendingUp size={20} strokeWidth={1.8} className="text-emerald-600" />
              </div>
              <div>
                <p className="text-lg md:text-xl font-black text-slate-900 leading-none">7.532</p>
                <p className="text-xs text-slate-400 mt-1.5 font-medium tracking-wide">New Jobs</p>
              </div>
            </div>
          </div>

        </div>

        {/* ── Right: Image & Floating Cards ── */}
        <div className="flex-1 w-full flex justify-center lg:justify-end relative">
          
          <div className="relative w-full max-w-[480px] aspect-[4/5] rounded-[32px] overflow-visible">
            {/* Main Image Wrapper */}
            <div className="w-full h-full rounded-[32px] overflow-hidden bg-white border border-[#bae6fd] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.08)] p-2">
              <div className="w-full h-full rounded-[24px] overflow-hidden relative bg-slate-50 border border-slate-100/50">
                <Image
                  src="/hero-image.png"
                  alt="Magangku Hero Banner"
                  width={480}
                  height={600}
                  className="object-cover w-full h-full relative z-10"
                  priority
                />
              </div>
            </div>

            {/* Floating Glass Card 1 (Top-Left) */}
            <div className="absolute -left-8 top-12 bg-white/95 border border-blue-100 shadow-[0_15px_30px_-5px_rgba(0,0,0,0.05)] px-4 py-3 rounded-2xl backdrop-blur-md flex items-center gap-3 z-20 hover:scale-105 transition-transform duration-300">
              <div className="w-10 h-10 rounded-xl bg-[#0284c7] flex items-center justify-center text-white shadow-md shadow-sky-200/50">
                <ShieldCheck size={20} />
              </div>
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Perusahaan</p>
                <p className="text-[13px] font-black text-slate-800 mt-0.5">100% Terverifikasi</p>
              </div>
            </div>

            {/* Floating Glass Card 2 (Bottom-Right) */}
            <div className="absolute -right-6 bottom-16 bg-white/95 border border-blue-100 shadow-[0_15px_30px_-5px_rgba(0,0,0,0.05)] px-4 py-3 rounded-2xl backdrop-blur-md flex items-center gap-3 z-20 hover:scale-105 transition-transform duration-300">
              <div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center text-white shadow-md shadow-amber-200/50">
                <Star size={18} fill="currentColor" />
              </div>
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Rating Magang</p>
                <p className="text-[13px] font-black text-slate-800 mt-0.5">4.9 / 5.0 Kepuasan</p>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};

export default Hero;