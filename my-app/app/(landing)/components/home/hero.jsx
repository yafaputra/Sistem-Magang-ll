import Image from "next/image";

import {
  BriefcaseBusiness,
  Building2,
  TrendingUp,
} from "lucide-react";

const Hero = () => {
  return (
    <section className="w-full px-5 pt-24 pb-12">
      <div
        className="relative rounded-3xl border-2 border-blue-300"
        style={{
          background: "linear-gradient(135deg, #e0f2fe 0%, #f0f9ff 50%, #bae6fd 100%)",
        }}
      >
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8 px-20 py-12">

          {/* ── Left: Text Content ── */}
          <div className="flex-1 max-w-[620px] space-y-6">

            <span className="inline-flex items-center gap-1.5 bg-white/80 text-[#1E1B4B] px-4 py-2 rounded-full text-sm font-semibold shadow-sm border border-white/60">
              <span className="w-2 h-2 rounded-full bg-sky-400 inline-block" />
              #1 Platform Magang Mahasiswa
            </span>

            <h1
              className="text-6xl font-extrabold text-[#0f172a] leading-[1.1] tracking-tight"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              Platform Magang
              <br />
              Mahasiswa yang{" "}
              <span className="relative inline-block text-sky-500">
                Modern
                <svg className="absolute -bottom-1 left-0 w-full" height="6" viewBox="0 0 200 6" preserveAspectRatio="none" fill="none">
                  <path d="M0 5 Q50 1 100 4 Q150 7 200 3" stroke="#38bdf8" strokeWidth="3" strokeLinecap="round" />
                </svg>
              </span>
            </h1>

            <p className="text-slate-500 text-lg leading-relaxed">
              Sistem informasi magang mahasiswa untuk mempermudah proses
              pendaftaran, monitoring, validasi, dan pelaporan secara digital
              dan terpusat.
            </p>

            <div className="flex items-center gap-4 pt-2">
              <button
                className="text-white px-8 py-3.5 rounded-[14px] font-bold text-[15px] tracking-tight transition-all duration-200 hover:-translate-y-0.5 hover:brightness-110 active:scale-[0.98]"
                style={{
                  background: "linear-gradient(135deg, #38bdf8 0%, #0ea5e9 100%)",
                  boxShadow: "0 4px 16px rgba(14,165,233,0.35), 0 1px 3px rgba(14,165,233,0.18)",
                }}
              >
                Daftar Sekarang
              </button>
            </div>
          </div>

          {/* ── Right: Image + Stats ── */}
          <div className="flex-1 flex justify-end">
            <div className="relative" style={{ width: "520px", height: "520px" }}>

              {/* Main image */}
              <div
                className="absolute inset-0 rounded-[28px] overflow-hidden"
                style={{
                  background: "linear-gradient(145deg, #38bdf8 0%, #0ea5e9 100%)",
                  boxShadow: "0 24px 64px rgba(14,165,233,0.35)",
                }}
              >
                <div className="absolute inset-0" style={{ boxShadow: "inset 0 0 80px rgba(255,255,255,0.12)" }} />
                <Image
                  src="/hero-image.png"
                  alt="Hero Image"
                  width={520}
                  height={520}
                  className="object-cover w-full h-full relative z-10"
                />
              </div>

              {/* Stat: Live Job — top right */}
              <div
                className="absolute top-6 -right-16 z-20 bg-white rounded-2xl px-5 py-4 flex items-center gap-4 border-2 border-blue-300"
                style={{ boxShadow: "0 8px 32px rgba(14,165,233,0.15)", minWidth: "190px" }}
              >
                <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 bg-sky-50">
                  <BriefcaseBusiness size={22} strokeWidth={2} stroke="#38bdf8" />
                </div>
                <div>
                  <p className="text-[20px] font-bold text-[#0f172a] leading-none mb-1">1,75,324</p>
                  <p className="text-[13px] text-slate-400 font-medium">Live Job</p>
                </div>
              </div>

              {/* Stat: Companies — middle left */}
              <div
                className="absolute top-1/2 -translate-y-1/2 -left-16 z-20 bg-white rounded-2xl pl-5 pr-10 py-4 flex items-center gap-4 border-2 border-blue-300  "
                style={{ boxShadow: "0 8px 32px rgba(14,165,233,0.15)", minWidth: "195px" }}
              >
                <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 bg-sky-400">
                  <Building2 size={22} strokeWidth={2} stroke="#FFFFFF" />
                </div>
                <div>
                  <p className="text-[20px] font-bold text-[#0f172a] leading-none mb-1">97,354</p>
                  <p className="text-[13px] text-slate-400 font-medium">Companies</p>
                </div>
              </div>

              {/* Stat: New Jobs — bottom right */}
              <div
                className="absolute bottom-6 -right-16 z-20 bg-white rounded-2xl px-5 py-4 flex items-center gap-4 border-2 border-blue-300"
                style={{ boxShadow: "0 8px 32px rgba(14,165,233,0.15)", minWidth: "185px" }}
              >
                <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 bg-green-50">
                  <TrendingUp size={22} strokeWidth={2} stroke="#16A34A" />
                </div>
                <div>
                  <p className="text-[20px] font-bold text-[#0f172a] leading-none mb-1">7,532</p>
                  <p className="text-[13px] text-slate-400 font-medium">New Jobs</p>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Hero;