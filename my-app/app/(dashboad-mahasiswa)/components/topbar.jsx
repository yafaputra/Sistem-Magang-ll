// app/dashboard-mahasiswa/components/topbar.jsx
"use client";

export default function Topbar({ icon, title, subtitle, iconBg = "bg-[#0A66C2]/5", iconBorder = "border-[#0A66C2]/20", iconColor = "text-[#0A66C2]", rightSlot }) {
  return (
    <div className="flex items-center justify-between px-8 py-4 bg-white border-b border-slate-200">
      <div className="flex items-center gap-3.5">
        <div className={`w-10 h-10 rounded-xl border flex items-center justify-center flex-shrink-0 ${iconBg} ${iconBorder} ${iconColor}`}>
          {icon}
        </div>
        <div>
          <div className="text-[18px] font-bold text-slate-800 tracking-tight leading-snug">
            {title}
          </div>
          <div className="text-[11.5px] text-slate-400 mt-0.5">
            {subtitle}
          </div>
        </div>
      </div>
      {rightSlot}
    </div>
  );
}