import Image from "next/image";
import { BriefcaseBusiness, Building2, TrendingUp, ArrowRight, Star, ShieldCheck } from "lucide-react";

const Hero = () => {
  return (
    <section className="relative w-full overflow-hidden bg-gradient-to-b from-[#f0f4ff] via-[#f7f9ff] to-white pt-32 pb-24" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      {/* ── Background Glow Blobs ── */}
      <div className="absolute top-0 right-1/4 w-96 h-96 rounded-full bg-blue-200/50 filter blur-3xl -z-10 animate-pulse" />
      <div className="absolute bottom-10 left-1/4 w-[400px] h-[400px] rounded-full bg-sky-100/50 filter blur-3xl -z-10" />

      <div className="max-w-[1250px] mx-auto px-6 flex flex-col lg:flex-row items-center justify-between gap-16">
        
        {/* ── Left: Text Content ── */}
        <div className="flex-1 space-y-8 text-center lg:text-left">
          
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold tracking-wide uppercase shadow-sm bg-white/80 border border-blue-100 backdrop-blur-md">
            <span className="w-2 h-2 rounded-full inline-block bg-sky-500 animate-ping" />
            <span className="text-sky-800 font-extrabold">#1 Platform Magang Mahasiswa</span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 leading-[1.12] tracking-tight">
            Platform Magang Mahasiswa yang{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-sky-500 to-indigo-600">
              Modern & Terintegrasi
            </span>
          </h1>

          <p className="text-slate-600 text-lg leading-relaxed max-w-[580px] mx-auto lg:mx-0">
            Sistem informasi terpadu untuk mempermudah pendaftaran, monitoring, 
            validasi, dan pelaporan magang secara digital dan real-time.
          </p>

          {/* ── CTA Buttons ── */}
          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
            <button className="w-full sm:w-auto text-white px-8 py-4 rounded-2xl font-bold text-base transition-all duration-300 bg-gradient-to-r from-blue-600 to-sky-500 hover:from-sky-500 hover:to-blue-600 shadow-lg shadow-blue-200/50 hover:shadow-blue-300/80 transform hover:-translate-y-0.5 flex items-center justify-center gap-2 cursor-pointer">
              Daftar Sekarang
              <ArrowRight size={18} />
            </button>
            <button className="w-full sm:w-auto px-8 py-4 rounded-2xl font-bold text-base transition-all duration-200 bg-white hover:bg-slate-50 text-slate-800 border-2 border-slate-200 hover:border-slate-300 shadow-sm flex items-center justify-center gap-2 cursor-pointer">
              Cari Lowongan
            </button>
          </div>

          {/* ── Stats Block ── */}
          <div className="pt-8 border-t border-slate-200/80 grid grid-cols-3 gap-4 md:gap-8 max-w-[550px] mx-auto lg:mx-0">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-3 text-center md:text-left">
              <div className="w-11 h-11 rounded-2xl flex items-center justify-center bg-blue-50 border border-blue-100 flex-shrink-0">
                <BriefcaseBusiness size={20} strokeWidth={1.8} className="text-blue-600" />
              </div>
              <div>
                <p className="text-lg md:text-xl font-black text-slate-900 leading-none">175K+</p>
                <p className="text-xs text-slate-400 mt-1.5 font-medium tracking-wide">Live Jobs</p>
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row items-center md:items-start gap-3 text-center md:text-left">
              <div className="w-11 h-11 rounded-2xl flex items-center justify-center bg-amber-50 border border-amber-100 flex-shrink-0">
                <Building2 size={20} strokeWidth={1.8} className="text-amber-600" />
              </div>
              <div>
                <p className="text-lg md:text-xl font-black text-slate-900 leading-none">97K+</p>
                <p className="text-xs text-slate-400 mt-1.5 font-medium tracking-wide">Companies</p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-center md:items-start gap-3 text-center md:text-left">
              <div className="w-11 h-11 rounded-2xl flex items-center justify-center bg-emerald-50 border border-emerald-100 flex-shrink-0">
                <TrendingUp size={20} strokeWidth={1.8} className="text-emerald-600" />
              </div>
              <div>
                <p className="text-lg md:text-xl font-black text-slate-900 leading-none">7.5K+</p>
                <p className="text-xs text-slate-400 mt-1.5 font-medium tracking-wide">New Jobs</p>
              </div>
            </div>
          </div>

        </div>

        {/* ── Right: Image & Floating Cards ── */}
        <div className="flex-1 w-full flex justify-center lg:justify-end relative">
          
          <div className="relative w-full max-w-[480px] aspect-[4/5] rounded-[32px] overflow-visible">
            {/* Background geometric accents */}
            <div className="absolute -top-10 -right-10 w-44 h-44 rounded-full bg-blue-300/30 filter blur-2xl -z-10" />
            <div className="absolute -bottom-10 -left-10 w-48 h-48 rounded-full bg-amber-200/40 filter blur-2xl -z-10" />
            
            {/* Main Image Wrapper with double outline/shadow */}
            <div className="w-full h-full rounded-[32px] overflow-hidden bg-white border border-slate-100 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.12)] p-2">
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
            <div className="absolute -left-8 top-12 bg-white/80 border border-white/60 shadow-[0_15px_30px_-5px_rgba(0,0,0,0.08)] px-4 py-3 rounded-2xl backdrop-blur-md flex items-center gap-3 z-20 hover:scale-105 transition-transform duration-300">
              <div className="w-10 h-10 rounded-xl bg-sky-500 flex items-center justify-center text-white shadow-md shadow-sky-300/30">
                <ShieldCheck size={20} />
              </div>
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Perusahaan</p>
                <p className="text-[13px] font-black text-slate-800 mt-0.5">100% Terverifikasi</p>
              </div>
            </div>

            {/* Floating Glass Card 2 (Bottom-Right) */}
            <div className="absolute -right-6 bottom-16 bg-white/80 border border-white/60 shadow-[0_15px_30px_-5px_rgba(0,0,0,0.08)] px-4 py-3 rounded-2xl backdrop-blur-md flex items-center gap-3 z-20 hover:scale-105 transition-transform duration-300">
              <div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center text-white shadow-md shadow-amber-300/30">
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