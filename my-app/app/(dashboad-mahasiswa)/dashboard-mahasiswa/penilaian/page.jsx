"use client";

import useAuth from "../../../hooks/useAuth";

export default function PenilaianPage() {
  useAuth("mahasiswa");

  return (
    <div className="min-h-screen bg-[#f5f5fb] font-[Inter,system-ui,sans-serif]">
      {/* Top Header */}
      <div className="flex items-center justify-between px-8 py-[18px] bg-white border-b border-[#e8e8f0]">
        <div className="flex items-center gap-3">
          <span className="text-[20px] font-bold text-[#1e1e2e] tracking-tight">Penilaian Magang</span>
          <span className="text-xs font-semibold text-[#6c63ff] bg-violet-50 px-2.5 py-1 rounded-full border border-violet-100">
            Aktif
          </span>
        </div>
        <button 
          onClick={() => window.location.href = "/"}
          className="px-4 py-2 border-[1.5px] border-[#6c63ff] rounded-lg text-[#6c63ff] text-[13px] font-semibold hover:bg-[#6c63ff] hover:text-white transition-all duration-150 cursor-pointer"
        >
          Back to homepage
        </button>
      </div>

      {/* Content */}
      <div className="max-w-[800px] mx-auto px-8 py-12 text-center">
        <div className="bg-white border border-[#e8e8f0] rounded-2xl p-10 shadow-sm flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-amber-50 border border-amber-200 text-amber-500 flex items-center justify-center">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
          </div>
          <h2 className="text-[20px] font-extrabold text-[#1e1e2e]">
            Penilaian Akhir Magang
          </h2>
          <p className="text-[#8888a8] text-[14px] max-w-[480px] leading-relaxed">
            Halaman penilaian akhir magang Anda sedang diproses oleh dosen pembimbing dan mentor industri Anda. Nilai akhir akan tampil di sini setelah periode magang selesai.
          </p>
          <div className="w-full max-w-[400px] mt-6 border-t border-[#f0f0f8] pt-6 flex flex-col gap-3">
            <div className="flex justify-between items-center text-[13.5px]">
              <span className="text-[#8888a8]">Nilai Mentor Industri</span>
              <span className="font-semibold text-slate-700">Dalam Proses</span>
            </div>
            <div className="flex justify-between items-center text-[13.5px]">
              <span className="text-[#8888a8]">Nilai Dosen Pembimbing</span>
              <span className="font-semibold text-slate-700">Dalam Proses</span>
            </div>
            <div className="flex justify-between items-center text-[13.5px] border-t border-dashed border-[#e8e8f0] pt-3">
              <span className="font-semibold text-[#1e1e2e]">Nilai Akhir Rata-rata</span>
              <span className="font-bold text-[#6c63ff] bg-[#ede9ff] px-3 py-1 rounded-lg text-xs border border-[#c4bcff]">TBA</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
