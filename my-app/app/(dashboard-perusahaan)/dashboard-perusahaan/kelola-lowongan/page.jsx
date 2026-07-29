"use client";
import { useEffect, useState } from "react";
import Topbar from "../../components/topbar";
import formatRupiah from "@/app/utils/price-formatter";

// ─── Fonts — sama dengan Dashboard Dosen (Fraunces + IBM Plex Mono) ─────────
const FONTS = `
@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600;9..144,700&family=IBM+Plex+Mono:wght@400;500;600&display=swap');
.font-display { font-family: 'Fraunces', 'Georgia', serif; }
.font-mono { font-family: 'IBM Plex Mono', 'Courier New', monospace; }
`;
// ─── SVG Icons ────────────────────────────────────────────────────────────────
const IconBriefcase = ({ size = 18, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="7" width="20" height="14" rx="2" />
    <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
  </svg>
);
const IconSearch = ({ size = 15 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
  </svg>
);
const IconPlus = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);
const IconX = ({ size = 15 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);
const IconEdit = ({ size = 15 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
);
const IconTrash = ({ size = 15 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
    <path d="M10 11v6M14 11v6" />
    <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
  </svg>
);
const IconArrowLeft = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
  </svg>
);
const IconChevronRight = ({ size = 13 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6" />
  </svg>
);
const IconCheck = ({ size = 15 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);
const IconUsers = ({ size = 17, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);
const IconTarget = ({ size = 17, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" />
  </svg>
);
const IconBuilding = ({ size = 12 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2" /><path d="M9 3v18M15 3v18M3 9h18M3 15h18" />
  </svg>
);
const IconClock = ({ size = 12 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
  </svg>
);
const IconMapPin = ({ size = 12 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
  </svg>
);
const IconCalendar = ({ size = 12 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);
const IconEye = ({ size = 15 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
  </svg>
);
const IconTrashSm = ({ size = 13 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
    <path d="M10 11v6M14 11v6" />
    <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
  </svg>
);
const IconToastSuccess = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
  </svg>
);
const IconToastError = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>
  </svg>
);
const IconToastInfo = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0A66C2" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>
  </svg>
);
const IconToastWarning = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
  </svg>
);

// ─── Status badge config ──────────────────────────────────────────────────────
const STATUS_CONFIG = {
  Pending:    { bg: "#faeeda", text: "#854f0b", border: "#fde68a", label: "Menunggu Kurasi Admin" },
  Aktif:      { bg: "#d1fae5", text: "#065f46", border: "#a7f3d0", label: "Aktif Tayang" },
  Ditolak:    { bg: "#fee2e2", text: "#991b1b", border: "#fecaca", label: "Ditolak Admin" },
  Bermasalah: { bg: "#fee2e2", text: "#991b1b", border: "#fecaca", label: "Bermasalah" },
};

// ─── Constants ────────────────────────────────────────────────────────────────
const DEPTS        = ["Semua Divisi", "Engineering", "Product", "Data & AI", "Infrastructure", "Quality"];
const DEPT_OPTIONS = ["Engineering", "Product", "Data & AI", "Infrastructure", "Quality"];
const TYPE_OPTIONS = ["Remote", "Hybrid", "Onsite"];
const EXP_OPTIONS  = ["Junior", "Junior – Intermediate", "Intermediate", "Senior"];
const STEPS        = ["Info Dasar", "Detail & Gaji", "Konten Lowongan"];

const EMPTY_FORM = {
  title: "", dept: "Engineering", type: "Remote", duration: "", slots: "1",
  target: "10", tags: "", salary: "", location: "", experience: "Junior",
  deadline: "", description: "",
  responsibilities: [""], requirements: [""], whoYouAre: [""], niceToHave: [""],
};



const TYPE_CONFIG = {
  Remote: { bg: "#EFF6FF", text: "#0A66C2", border: "#93C5FD" },
  Hybrid: { bg: "#FFFBEB", text: "#B45309", border: "#FDE68A" },
  Onsite: { bg: "#F0FDF4", text: "#15803D", border: "#BBF7D0" },
};

const TOAST_CONFIG = {
  success: { iconBg: "#ecfdf5", iconBorder: "#a7f3d0", titleColor: "#065f46", bar: "#10b981", border: "#a7f3d0" },
  error:   { iconBg: "#fff5f5", iconBorder: "#fecaca", titleColor: "#991b1b", bar: "#ef4444", border: "#fecaca" },
  info:    { iconBg: "#EFF6FF", iconBorder: "#93C5FD", titleColor: "#0A66C2", bar: "#0A66C2", border: "#93C5FD" },
  warning: { iconBg: "#fffbeb", iconBorder: "#fde68a", titleColor: "#92400e", bar: "#f59e0b", border: "#fde68a" },
};

const TOAST_ICONS = {
  success: <IconToastSuccess />,
  error:   <IconToastError />,
  info:    <IconToastInfo />,
  warning: <IconToastWarning />,
};

function getAvatarColor() {
  return { bg: "#EFF6FF", text: "#0A66C2", border: "#93C5FD" };
}

function getLogoKey(dept) {
  return (dept || "XX").split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);
}

// ─── Toast Hook ───────────────────────────────────────────────────────────────
function useToast() {
  const [toasts, setToasts] = useState([]);

  const showToast = (type, title, message = "") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, type, title, message, hiding: false }]);
    setTimeout(() => {
      setToasts((prev) => prev.map((t) => t.id === id ? { ...t, hiding: true } : t));
      setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 250);
    }, 3500);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.map((t) => t.id === id ? { ...t, hiding: true } : t));
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 250);
  };

  return { toasts, showToast, removeToast };
}

// ─── Toast Container ──────────────────────────────────────────────────────────
function ToastContainer({ toasts, onRemove }) {
  return (
    <div className="fixed z-[9999] flex flex-col gap-2.5 pointer-events-none" style={{ top: 76, right: 20, width: 320 }}>
      {toasts.map((t) => {
        const c = TOAST_CONFIG[t.type];
        return (
          <div
            key={t.id}
            className="bg-white rounded-2xl flex items-start gap-3 pointer-events-auto"
            style={{
              border: `1px solid ${c.border}`,
              padding: "13px 13px 11px",
              animation: t.hiding
                ? "toastOut 0.25s cubic-bezier(.4,0,1,1) forwards"
                : "toastIn 0.3s cubic-bezier(.21,1.02,.73,1) both",
            }}
          >
            <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
              style={{ background: c.iconBg, border: `1.5px solid ${c.iconBorder}` }}>
              {TOAST_ICONS[t.type]}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[13.5px] font-bold leading-snug" style={{ color: c.titleColor }}>{t.title}</p>
              {t.message && <p className="text-[12px] text-[#64748b] mt-0.5 leading-relaxed">{t.message}</p>}
              <div className="h-[3px] rounded-full mt-2.5 bg-[#f1f5f9] overflow-hidden">
                <div className="h-full rounded-full" style={{ background: c.bar, animation: "toastProgress 3.5s linear forwards" }} />
              </div>
            </div>
            <button onClick={() => onRemove(t.id)}
              className="w-5 h-5 flex items-center justify-center rounded-md text-[#94a3b8] hover:bg-[#f1f5f9] hover:text-[#475569] transition-all flex-shrink-0 mt-0.5 cursor-pointer">
              <IconX size={12} />
            </button>
          </div>
        );
      })}
    </div>
  );
}

// ─── Shared input style ───────────────────────────────────────────────────────
const inputBase = "w-full px-3 py-2 text-[13px] text-[#1e1e2e] bg-white border border-[#e2e8f0] rounded-lg outline-none transition-all placeholder:text-[#94a3b8] focus:border-[#0A66C2] focus:ring-2 focus:ring-[#0A66C2]/10";

function FormField({ label, required, error, hint, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[12px] font-semibold text-[#374151]">
        {label}{required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {children}
      {hint  && <p className="text-[11px] text-[#94a3b8]">{hint}</p>}
      {error && <p className="text-[11px] text-red-500">{error}</p>}
    </div>
  );
}

function ListField({ label, values, onChange, placeholder }) {
  const add    = () => onChange([...values, ""]);
  const remove = (i) => onChange(values.filter((_, idx) => idx !== i));
  const update = (i, v) => onChange(values.map((x, idx) => (idx === i ? v : x)));
  return (
    <FormField label={label}>
      <div className="flex flex-col gap-2">
        {values.map((v, i) => (
          <div key={i} className="flex items-center gap-2">
            <span className="text-[11px] text-[#94a3b8] w-4 text-right flex-shrink-0">{i + 1}.</span>
            <input className={inputBase} placeholder={placeholder} value={v} onChange={(e) => update(i, e.target.value)} />
            {values.length > 1 && (
              <button type="button" onClick={() => remove(i)}
                className="w-7 h-7 rounded-lg border border-[#e2e8f0] flex items-center justify-center flex-shrink-0 text-[#94a3b8] hover:bg-red-50 hover:text-red-500 hover:border-red-200 transition-all">
                <IconTrashSm />
              </button>
            )}
          </div>
        ))}
        <button type="button" onClick={add}
          className="flex items-center gap-1.5 text-[12px] text-[#0A66C2] font-semibold w-fit px-3 py-1.5 rounded-lg border border-[#DBEAFE] bg-[#EFF6FF] hover:bg-[#DBEAFE] transition-all">
          <IconPlus size={12} /> Tambah baris
        </button>
      </div>
    </FormField>
  );
}

function Avatar({ dept, size = "md" }) {
  const c   = getAvatarColor(dept);
  const key = getLogoKey(dept);
  const sz  = size === "lg" ? "w-14 h-14 rounded-2xl text-[15px]" :
              size === "sm" ? "w-8  h-8  rounded-xl  text-[10px]" :
                              "w-11 h-11 rounded-xl  text-[12px]";
  return (
    <div className={`${sz} flex items-center justify-center font-bold flex-shrink-0 border`}
      style={{ background: c.bg, color: c.text, borderColor: c.border }}>
      {key}
    </div>
  );
}

function IconBtn({ onClick, title, variant = "default", disabled = false, children }) {
  const base = "w-9 h-9 rounded-xl border-2 flex items-center justify-center transition-all duration-150 flex-shrink-0";
  const variants = {
    default  : "border-[#e2e8f0] bg-white text-[#64748b] hover:bg-[#f1f5f9] hover:border-[#cbd5e1] hover:text-[#1e293b]",
    primary  : "border-[#93C5FD] bg-[#EFF6FF] text-[#08519c] hover:bg-[#DBEAFE] hover:border-[#60A5FA]",
    danger   : "border-[#fecaca] bg-[#fff5f5] text-[#ef4444] hover:bg-[#fee2e2] hover:border-[#f87171]",
    green    : "border-[#bbf7d0] bg-[#f0fdf4] text-[#16a34a] hover:bg-[#dcfce7] hover:border-[#86efac]",
    disabled : "border-[#e2e8f0] bg-[#f8fafc] text-[#cbd5e1] cursor-not-allowed",
  };
  const cls = disabled ? variants.disabled : variants[variant];
  return (
    <button className={`${base} ${cls} ${disabled ? "" : "cursor-pointer"}`}
      onClick={disabled ? undefined : onClick} title={title} disabled={disabled}>
      {children}
    </button>
  );
}

function StepBar({ current }) {
  return (
    <div className="flex items-center px-5 py-3 bg-[#fafafa] border-b border-[#f0f0f8]">
      {STEPS.map((s, i) => {
        const done = i < current, active = i === current;
        return (
          <div key={i} className="flex items-center flex-1">
            <div className="flex items-center gap-2">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold flex-shrink-0 transition-all
                ${done ? "bg-[#0A66C2] text-white" : active ? "bg-[#0A66C2] text-white ring-[3px] ring-[#93C5FD]" : "bg-[#f1f5f9] text-[#94a3b8] border border-[#e2e8f0]"}`}>
                {done ? "✓" : i + 1}
              </div>
              <span className={`text-[11.5px] font-semibold whitespace-nowrap ${active || done ? "text-[#0A66C2]" : "text-[#94a3b8]"}`}>{s}</span>
            </div>
            {i < STEPS.length - 1 && (
              <div className={`h-[1.5px] flex-1 mx-2 rounded-full transition-all ${done ? "bg-[#0A66C2]" : "bg-[#e2e8f0]"}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── Detail Modal ─────────────────────────────────────────────────────────────
function DetailModal({ job, onClose, onEdit }) {
  if (!job) return null;
  const tc  = TYPE_CONFIG[job.type] || TYPE_CONFIG.Remote;
  const sc  = STATUS_CONFIG[job.status] || STATUS_CONFIG.Pending;

  const Section = ({ title, items }) =>
    items?.filter(Boolean).length ? (
      <div>
        <p className="text-[11px] font-bold uppercase tracking-widest text-[#94a3b8] mb-2">{title}</p>
        <ul className="flex flex-col gap-1.5">
          {items.filter(Boolean).map((x, i) => (
            <li key={i} className="flex items-start gap-2 text-[13px] text-[#374151]">
              <span className="mt-[5px] w-[5px] h-[5px] rounded-full bg-[#0A66C2] flex-shrink-0" />{x}
            </li>
          ))}
        </ul>
      </div>
    ) : null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[999] backdrop-blur-sm px-4" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-[620px] border border-[#e2e8f0] overflow-hidden"
        style={{ animation: "popIn 0.18s ease", maxHeight: "90vh", display: "flex", flexDirection: "column" }}
        onClick={(e) => e.stopPropagation()}>
        <div className="flex items-start gap-4 px-6 pt-6 pb-5 border-b border-[#f1f5f9]">
          <Avatar dept={job.dept} size="lg" />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <h2 className="text-[17px] font-bold text-[#1e1e2e]">{job.title}</h2>
              <span className="font-mono px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wide border"
                style={{ background: tc.bg, color: tc.text, borderColor: tc.border }}>{job.type}</span>
              <span className="font-mono px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wide border"
                style={{ background: sc.bg, color: sc.text, borderColor: sc.border }}>{sc.label}</span>
            </div>
            <div className="font-mono flex items-center gap-3 text-[11px] text-[#64748b] tracking-wide flex-wrap">
              <span className="flex items-center gap-1"><IconBuilding />{job.dept}</span>
              <span className="flex items-center gap-1"><IconClock />{job.duration}</span>
              {job.location && <span className="flex items-center gap-1"><IconMapPin />{job.location}</span>}
              {job.deadline && <span className="flex items-center gap-1"><IconCalendar />Deadline: {job.deadline}</span>}
            </div>
          </div>
          <div className="flex gap-2">
            {/* ✅ Opsi A: Edit selalu tersedia, apapun statusnya */}
            <IconBtn
              variant="primary"
              title="Edit"
              onClick={() => { onClose(); onEdit(job.id); }}
            >
              <IconEdit />
            </IconBtn>
            <IconBtn title="Tutup" onClick={onClose}><IconX /></IconBtn>
          </div>
        </div>

        {/* Status info banner dalam modal */}
        {job.status === "Pending" && (
          <div className="mx-6 mt-4 px-4 py-3 rounded-xl bg-[#faeeda] border border-[#fde68a] text-[12.5px] text-[#854f0b]">
            ⏳ Lowongan ini sedang menunggu kurasi admin. Setelah disetujui akan otomatis tayang di halaman publik.
          </div>
        )}
        {job.status === "Ditolak" && (
          <div className="mx-6 mt-4 px-4 py-3 rounded-xl bg-[#fee2e2] border border-[#fecaca] text-[12.5px] text-[#991b1b]">
            ✗ Lowongan ini ditolak oleh admin. Anda dapat mengedit dan mengirim ulang untuk dikurasi kembali.
          </div>
        )}
        {job.status === "Aktif" && (
          <div className="mx-6 mt-4 px-4 py-3 rounded-xl bg-[#d1fae5] border border-[#a7f3d0] text-[12.5px] text-[#065f46]">
            ✓ Lowongan ini aktif tayang dan dapat dilihat oleh mahasiswa. Perubahan yang Anda simpan akan langsung berlaku tanpa perlu kurasi ulang.
          </div>
        )}

        <div className="grid grid-cols-3 divide-x divide-[#f1f5f9] bg-[#fafafa] border-b border-[#f1f5f9] mt-4">
          {[
            { label: "Pelamar", value: job.applicants },
            { label: "Kuota",   value: job.slots },
            { label: "Gaji",    value: formatRupiah(job.salary) || "—" },
          ].map((s, i) => (
            <div key={i} className="text-center py-3">
              <div className="font-display text-[18px] font-semibold text-[#1e1e2e]">{s.value}</div>
              <div className="text-[11px] text-[#94a3b8] mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="px-6 py-5 overflow-y-auto flex flex-col gap-5">
          {job.tags?.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {job.tags.map((t) => (
                <span key={t} className="px-2.5 py-1 rounded-lg text-[11.5px] font-semibold bg-[#EFF6FF] text-[#0A66C2] border border-[#93C5FD]">{t}</span>
              ))}
            </div>
          )}
          {job.description && (
            <div>
              <p className="text-[11px] font-bold uppercase tracking-widest text-[#94a3b8] mb-2">Deskripsi</p>
              <p className="text-[13px] text-[#374151] leading-relaxed">{job.description}</p>
            </div>
          )}
          <Section title="Tanggung Jawab" items={job.responsibilities} />
          <Section title="Persyaratan"    items={job.requirements} />
          <Section title="Siapa Kamu"     items={job.whoYouAre} />
          <Section title="Nice to Have"   items={job.niceToHave} />
        </div>
      </div>
    </div>
  );
}

// ─── Add / Edit Modal ─────────────────────────────────────────────────────────
function JobModal({ mode, form, errors, jobStatus, onChange, onListChange, onSubmit, onClose }) {
  const [step, setStep] = useState(0);

  const validateStep = () => {
    const e = {};
    if (step === 0) {
      if (!form.title.trim())    e.title    = "Judul wajib diisi";
      if (!form.duration.trim()) e.duration = "Durasi wajib diisi";
      if (!form.tags.trim())     e.tags     = "Minimal 1 skill";
      const s = parseInt(form.slots), t = parseInt(form.target);
      if (!form.slots  || isNaN(s) || s < 1) e.slots  = "Kuota minimal 1";
      if (!form.target || isNaN(t) || t < 1) e.target = "Target minimal 1";
    }
    if (step === 1) {
      if (!form.description.trim()) e.description = "Deskripsi wajib diisi";
    }
    return e;
  };

  const next = () => {
    const e = validateStep();
    if (Object.keys(e).length) { onChange("__errors__", e); return; }
    setStep((s) => s + 1);
  };
  const back = () => setStep((s) => s - 1);
  const tagList = form.tags.split(",").map((t) => t.trim()).filter(Boolean);
  const isEditingAktif = mode === "edit" && jobStatus === "Aktif";

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[999] backdrop-blur-sm px-4" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-[580px] border border-[#e2e8f0] overflow-hidden flex flex-col"
        style={{ animation: "popIn 0.18s ease", maxHeight: "90vh" }}
        onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-[#f1f5f9]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#EFF6FF] border-2 border-[#93C5FD] flex items-center justify-center text-[#0A66C2]">
              <IconBriefcase size={17} color="#0A66C2" />
            </div>
            <div>
              <h2 className="text-[15px] font-bold text-[#1e1e2e]">
                {mode === "add" ? "Tambah Lowongan Baru" : "Edit Lowongan"}
              </h2>
              <p className="text-[11.5px] text-[#94a3b8] mt-0.5">
                {mode === "add"
                  ? "Lowongan akan masuk status Pending dan dikurasi admin sebelum tayang"
                  : isEditingAktif
                    ? "Lowongan ini sedang Aktif tayang. Perubahan akan langsung tersimpan tanpa perlu kurasi ulang"
                    : "Perubahan akan langsung tersimpan"}
              </p>
            </div>
          </div>
          <IconBtn title="Tutup" onClick={onClose}><IconX /></IconBtn>
        </div>

        {/* Info banner */}
        <div className={`mx-5 mt-4 px-4 py-2.5 rounded-xl text-[12px] border ${
          isEditingAktif
            ? "bg-[#fffbeb] border-[#fde68a] text-[#92400e]"
            : "bg-[#EFF6FF] border-[#93C5FD] text-[#0A66C2]"
        }`}>
          {mode === "add"
            ? "📋 Setelah disimpan, lowongan akan ditinjau admin terlebih dahulu sebelum tampil ke mahasiswa."
            : isEditingAktif
              ? "⚠️ Lowongan ini sudah tayang ke publik. Perubahan akan langsung terlihat oleh mahasiswa tanpa menunggu kurasi ulang."
              : "📋 Perubahan akan disimpan langsung."}
        </div>

        <StepBar current={step} />

        <div className="px-5 py-4 flex flex-col gap-4 overflow-y-auto flex-1">
          {step === 0 && (
            <>
              <FormField label="Judul Lowongan" required error={errors.title}>
                <input autoFocus type="text" className={inputBase} placeholder="cth: Backend Developer"
                  value={form.title} onChange={(e) => onChange("title", e.target.value)} />
              </FormField>
              <div className="grid grid-cols-2 gap-3">
                <FormField label="Divisi" required>
                  <select className={inputBase + " cursor-pointer"} value={form.dept} onChange={(e) => onChange("dept", e.target.value)}>
                    {DEPT_OPTIONS.map((d) => <option key={d}>{d}</option>)}
                  </select>
                </FormField>
                <FormField label="Tipe Kerja" required>
                  <select className={inputBase + " cursor-pointer"} value={form.type} onChange={(e) => onChange("type", e.target.value)}>
                    {TYPE_OPTIONS.map((t) => <option key={t}>{t}</option>)}
                  </select>
                </FormField>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <FormField label="Durasi Magang" required error={errors.duration}>
                  <input type="text" className={inputBase} placeholder="cth: 6 bulan"
                    value={form.duration} onChange={(e) => onChange("duration", e.target.value)} />
                </FormField>
                <FormField label="Level Pengalaman">
                  <select className={inputBase + " cursor-pointer"} value={form.experience} onChange={(e) => onChange("experience", e.target.value)}>
                    {EXP_OPTIONS.map((x) => <option key={x}>{x}</option>)}
                  </select>
                </FormField>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <FormField label="Kuota Diterima" required error={errors.slots}>
                  <input type="number" min={1} className={inputBase} placeholder="cth: 3"
                    value={form.slots} onChange={(e) => onChange("slots", e.target.value)} />
                </FormField>
                <FormField label="Target Pelamar" required error={errors.target}>
                  <input type="number" min={1} className={inputBase} placeholder="cth: 20"
                    value={form.target} onChange={(e) => onChange("target", e.target.value)} />
                </FormField>
              </div>
              <FormField label="Skill / Tags" required error={errors.tags} hint="Pisahkan dengan koma. Contoh: React, TypeScript, Tailwind">
                <input type="text" className={inputBase} placeholder="cth: React, TypeScript, Tailwind"
                  value={form.tags} onChange={(e) => onChange("tags", e.target.value)} />
              </FormField>
              {tagList.length > 0 && (
                <div className="flex flex-wrap gap-1.5 -mt-1">
                  {tagList.map((t) => (
                    <span key={t} className="px-2.5 py-1 rounded-lg text-[11.5px] font-semibold bg-[#EFF6FF] text-[#0A66C2] border border-[#93C5FD]">{t}</span>
                  ))}
                </div>
              )}
            </>
          )}

          {step === 1 && (
            <>
              <div className="grid grid-cols-2 gap-3">
                <FormField label="Lokasi">
                  <input type="text" className={inputBase} placeholder="cth: Jakarta, Indonesia"
                    value={form.location} onChange={(e) => onChange("location", e.target.value)} />
                </FormField>
                <FormField label="Deadline Lamaran">
                  <input type="date" className={inputBase} value={form.deadline} onChange={(e) => onChange("deadline", e.target.value)} />
                </FormField>
              </div>
              <FormField label="Range Gaji">
                <input type="text" className={inputBase} placeholder="cth: Rp 8.000.000 – Rp 12.000.000"
                  value={form.salary} onChange={(e) => onChange("salary", e.target.value)} />
              </FormField>
              <FormField label="Deskripsi Singkat" required error={errors.description}>
                <textarea className={inputBase + " resize-none"} rows={5}
                  placeholder="Deskripsikan posisi ini secara singkat dan menarik..."
                  value={form.description} onChange={(e) => onChange("description", e.target.value)} />
              </FormField>
            </>
          )}

          {step === 2 && (
            <>
              <div className="rounded-xl bg-[#EFF6FF] border border-[#93C5FD] px-4 py-3 text-[12px] text-[#0A66C2]">
                💡 Isi setiap poin secara singkat dan jelas. Baris kosong tidak akan ditampilkan.
              </div>
              <ListField label="Tanggung Jawab" values={form.responsibilities} onChange={(v) => onListChange("responsibilities", v)} placeholder="cth: Membangun REST API yang skalabel" />
              <ListField label="Persyaratan"    values={form.requirements}    onChange={(v) => onListChange("requirements", v)}    placeholder="cth: Menguasai React.js dan TypeScript" />
              <ListField label="Siapa Kamu"     values={form.whoYouAre}       onChange={(v) => onListChange("whoYouAre", v)}       placeholder="cth: Kamu antusias dengan teknologi web" />
              <ListField label="Nice To Have"   values={form.niceToHave}      onChange={(v) => onListChange("niceToHave", v)}      placeholder="cth: Pengalaman dengan GraphQL" />
            </>
          )}
        </div>

        <div className="px-5 py-4 border-t border-[#f1f5f9] bg-[#fafafa] flex gap-3">
          {step > 0 ? (
            <button onClick={back}
              className="flex-1 py-2.5 border border-[#e2e8f0] rounded-xl bg-white text-[#374151] text-[13px] font-semibold cursor-pointer hover:bg-[#f8fafc] transition-all flex items-center justify-center gap-2">
              <IconArrowLeft /> Sebelumnya
            </button>
          ) : (
            <button onClick={onClose}
              className="flex-1 py-2.5 border border-[#e2e8f0] rounded-xl bg-white text-[#374151] text-[13px] font-semibold cursor-pointer hover:bg-[#f8fafc] transition-all">
              Batal
            </button>
          )}
          {step < STEPS.length - 1 ? (
            <button onClick={next}
              className="flex-1 py-2.5 rounded-xl bg-[#0A66C2] text-white text-[13px] font-semibold cursor-pointer hover:bg-[#08519c] transition-colors flex items-center justify-center gap-2">
              Selanjutnya <IconChevronRight />
            </button>
          ) : (
            <button onClick={onSubmit}
              className="flex-1 py-2.5 rounded-xl bg-[#0A66C2] text-white text-[13px] font-semibold cursor-pointer hover:bg-[#08519c] transition-colors flex items-center justify-center gap-2">
              <IconCheck /> {mode === "add" ? "Kirim untuk Dikurasi" : "Simpan Perubahan"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Delete Confirm Modal ─────────────────────────────────────────────────────
function DeleteModal({ job, onConfirm, onClose }) {
  const isAktif = job?.status === "Aktif";
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[999] backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-2xl p-7 w-[380px] border border-[#e2e8f0]"
        style={{ animation: "popIn 0.18s ease" }} onClick={(e) => e.stopPropagation()}>
        <div className="w-12 h-12 rounded-2xl bg-red-50 border-2 border-red-100 flex items-center justify-center mb-4">
          <IconTrash size={20} />
        </div>
        <h3 className="text-[15px] font-bold text-[#1e1e2e] mb-2">Hapus Lowongan?</h3>
        <p className="text-[13px] text-[#64748b] leading-relaxed mb-3">
          Lowongan <span className="font-semibold text-[#1e1e2e]">"{job?.title}"</span> akan dihapus permanen.
        </p>
        {isAktif && (
          <p className="text-[12px] text-[#b45309] bg-[#fffbeb] border border-[#fde68a] rounded-lg px-3 py-2 mb-4">
            ⚠️ Lowongan ini sedang <span className="font-semibold">Aktif tayang</span>. Menghapusnya akan langsung menariknya dari halaman publik.
          </p>
        )}
        <div className="flex gap-3">
          <button onClick={onClose}
            className="flex-1 py-2.5 border border-[#e2e8f0] rounded-xl bg-white text-[#374151] text-[13px] font-semibold cursor-pointer hover:bg-[#f8fafc] transition-all">
            Batal
          </button>
          <button onClick={onConfirm}
            className="flex-1 py-2.5 rounded-xl bg-red-500 text-white text-[13px] font-semibold cursor-pointer hover:bg-red-600 transition-colors">
            Ya, Hapus
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────
function SkeletonRow() {
  return (
    <div className="bg-white border border-[#e2e8f0] rounded-2xl px-5 py-4 flex items-center gap-4 animate-pulse">
      <div className="w-11 h-11 rounded-xl bg-slate-100 flex-shrink-0" />
      <div className="flex-1 min-w-0">
        <div className="h-4 bg-slate-100 rounded w-1/3 mb-2" />
        <div className="h-3 bg-slate-100 rounded w-1/4 mb-3" />
        <div className="flex gap-2"><div className="h-6 bg-slate-100 rounded-lg w-16" /><div className="h-6 bg-slate-100 rounded-lg w-16" /></div>
      </div>
      <div className="w-px h-12 bg-[#f1f5f9]" />
      <div className="flex gap-5">
        <div className="text-center"><div className="h-5 w-8 bg-slate-100 rounded mb-1 mx-auto" /><div className="h-3 w-12 bg-slate-100 rounded" /></div>
        <div className="text-center"><div className="h-5 w-8 bg-slate-100 rounded mb-1 mx-auto" /><div className="h-3 w-12 bg-slate-100 rounded" /></div>
      </div>
      <div className="w-px h-12 bg-[#f1f5f9]" />
      <div className="flex gap-2">
        <div className="w-9 h-9 rounded-xl bg-slate-100" />
        <div className="w-9 h-9 rounded-xl bg-slate-100" />
        <div className="w-9 h-9 rounded-xl bg-slate-100" />
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function KelolaLowongan() {
  const [search, setSearch]       = useState("");
  const [dept, setDept]           = useState("Semua Divisi");
  const [jobs, setJobs]           = useState([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState(null);
  const [modalMode, setModalMode] = useState(null);
  const [editId, setEditId]       = useState(null);
  const [viewJob, setViewJob]     = useState(null);
  const [form, setForm]           = useState(EMPTY_FORM);
  const [errors, setErrors]       = useState({});
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [statusVerifikasi, setStatusVerifikasi] = useState(null);

  const { toasts, showToast, removeToast } = useToast();

  const fetchJobs = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem("token");
      if (!token) { window.location.href = "/login"; return; }

      const res    = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/lowongan`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = await res.json();
      if (!res.ok) { setError(result.message || "Gagal mengambil data lowongan."); return; }

      setJobs(
        result.data.map((item) => ({
          id:               item.id,
          title:            item.posisi,
          dept:             item.departemen   || "Engineering",
          type:             item.tipe         || "Remote",
          duration:         item.durasi       || "-",
          slots:            item.kuota        || 1,
          applicants:       item._count?.pelamars || item.pelamars?.length || 0,
          tags:             item.tags ? JSON.parse(item.tags) : [],
          salary:           item.gaji         || "",
          location:         item.lokasi       || "",
          deadline:         item.deadline ? item.deadline.split("T")[0] : "",
          experience:       item.experience   || "Junior",
          description:      item.deskripsi    || "",
          responsibilities: item.responsibilities ? JSON.parse(item.responsibilities) : [],
          requirements:     item.requirements  ? JSON.parse(item.requirements)  : [],
          whoYouAre:        item.whoYouAre     ? JSON.parse(item.whoYouAre)     : [],
          niceToHave:       item.niceToHave    ? JSON.parse(item.niceToHave)    : [],
          status:           item.status || "Pending",
        }))
      );
    } catch {
      setError("Tidak bisa terhubung ke server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
    const fetchStatus = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/perusahaan/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const result = await res.json();
        if (res.ok && result.data) setStatusVerifikasi(result.data.statusVerifikasi);
      } catch (err) {
        console.error("Gagal mengambil status verifikasi:", err);
      }
    };
    fetchStatus();
  }, []);

  const filtered = jobs.filter(
    (j) =>
      j.title.toLowerCase().includes(search.toLowerCase()) &&
      (dept === "Semua Divisi" || j.dept === dept)
  );

  const handleFormChange = (field, value) => {
    if (field === "__errors__") { setErrors((prev) => ({ ...prev, ...value })); return; }
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };
  const handleListChange = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));

  const validateFull = () => {
    const e = {};
    if (!form.title.trim())       e.title       = "Judul wajib diisi";
    if (!form.duration.trim())    e.duration    = "Durasi wajib diisi";
    if (!form.tags.trim())        e.tags        = "Minimal 1 skill";
    if (!form.description.trim()) e.description = "Deskripsi wajib diisi";
    const s = parseInt(form.slots), t = parseInt(form.target);
    if (!form.slots  || isNaN(s) || s < 1) e.slots  = "Kuota minimal 1";
    if (!form.target || isNaN(t) || t < 1) e.target = "Target minimal 1";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const openAdd = () => {
    setForm(EMPTY_FORM); setErrors({}); setEditId(null); setModalMode("add");
  };

  // ✅ Opsi A: edit selalu diizinkan, apapun statusnya
  const openEdit = (id) => {
    const job = jobs.find((j) => j.id === id);
    if (!job) return;
    setForm({
      title:            job.title,
      dept:             job.dept,
      type:             job.type,
      duration:         job.duration,
      slots:            String(job.slots),
      target:           String(job.slots),
      tags:             job.tags.join(", "),
      salary:           job.salary      || "",
      location:         job.location    || "",
      experience:       job.experience  || "Junior",
      deadline:         job.deadline    || "",
      description:      job.description || "",
      responsibilities: job.responsibilities?.length ? job.responsibilities : [""],
      requirements:     job.requirements?.length     ? job.requirements     : [""],
      whoYouAre:        job.whoYouAre?.length         ? job.whoYouAre        : [""],
      niceToHave:       job.niceToHave?.length        ? job.niceToHave       : [""],
    });
    setErrors({}); setEditId(id); setModalMode("edit");
  };

  const editingJob = editId ? jobs.find((j) => j.id === editId) : null;

  const handleSubmit = async () => {
    if (!validateFull()) return;
    const token = localStorage.getItem("token");
    const clean = (arr) => (arr || []).filter((x) => x.trim());
    const payload = {
      posisi:           form.title,
      departemen:       form.dept,
      tipe:             form.type,
      durasi:           form.duration,
      kuota:            Number(form.slots),
      target:           Number(form.target),
      tags:             form.tags.split(",").map((t) => t.trim()).filter(Boolean),
      gaji:             form.salary,
      lokasi:           form.location,
      experience:       form.experience,
      deadline:         form.deadline,
      deskripsi:        form.description,
      responsibilities: clean(form.responsibilities),
      requirements:     clean(form.requirements),
      whoYouAre:        clean(form.whoYouAre),
      niceToHave:       clean(form.niceToHave),
    };
    const isAdd = modalMode === "add";
    const url = isAdd
      ? `${process.env.NEXT_PUBLIC_API_URL}/api/lowongan`
      : `${process.env.NEXT_PUBLIC_API_URL}/api/lowongan/${editId}`;
    const res = await fetch(url, {
      method:  isAdd ? "POST" : "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body:    JSON.stringify(payload),
    });
    const result = await res.json();
    if (!res.ok) {
      showToast("error", "Gagal menyimpan lowongan", result.message || "Terjadi kesalahan, coba lagi.");
      return;
    }
    showToast(
      "success",
      isAdd ? "Lowongan dikirim untuk dikurasi" : "Lowongan diperbarui",
      isAdd
        ? `"${form.title}" berhasil dikirim dan menunggu persetujuan admin.`
        : `"${form.title}" berhasil diperbarui.`
    );
    setModalMode(null);
    fetchJobs();
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    const token = localStorage.getItem("token");
    const res   = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/lowongan/${deleteTarget.id}`, {
      method:  "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    const result = await res.json();
    if (!res.ok) {
      showToast("error", "Gagal menghapus lowongan", result.message || "Terjadi kesalahan.");
      return;
    }
    showToast("warning", "Lowongan dihapus", `"${deleteTarget.title}" telah dihapus.`);
    setDeleteTarget(null);
    fetchJobs();
  };

  const totalApplicants = jobs.reduce((a, j) => a + j.applicants, 0);
  const pendingCount    = jobs.filter((j) => j.status === "Pending").length;

  return (
    <div className="font-sans bg-slate-50 min-h-screen flex flex-col gap-6">
      <style>{FONTS}</style>
      <style>{`
        @keyframes popIn { from { transform: scale(0.95) translateY(8px); opacity: 0; } to { transform: scale(1) translateY(0); opacity: 1; } }
        @keyframes toastIn { from { opacity: 0; transform: translateX(20px) scale(0.97); } to { opacity: 1; transform: translateX(0) scale(1); } }
        @keyframes toastOut { from { opacity: 1; transform: translateX(0) scale(1); } to { opacity: 0; transform: translateX(20px) scale(0.97); } }
        @keyframes toastProgress { from { width: 100%; } to { width: 0%; } }
      `}</style>

      <Topbar
        icon={<IconBriefcase size={18} />}
        title="Kelola Lowongan"
        subtitle="Buat lowongan dan pantau status kurasi dari admin"
        iconBg="bg-[#EFF6FF]"
        iconBorder="border-[#93C5FD]"
        iconColor="text-[#0A66C2]"
        rightSlot={
          <button
            onClick={() => window.location.href = "/"}
            className="flex items-center gap-2 px-4 py-2 border border-[#0A66C2]/40 rounded-xl text-[#0A66C2] text-[12.5px] font-semibold bg-transparent transition-all duration-150 hover:bg-[#0958A8] hover:text-white hover:border-[#0A66C2] cursor-pointer"
          >
            <div className="w-6 h-6 rounded-lg bg-[#0A66C2]/10 border border-[#0A66C2]/20 flex items-center justify-center flex-shrink-0">
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 9.5L12 3l9 6.5" />
                <path d="M5 9v11a1 1 0 0 0 1 1h3v-7h6v7h3a1 1 0 0 0 1-1V9" />
              </svg>
            </div>
            Back to homepage
          </button>
        }
      />

      <main className="px-7 py-6 flex flex-col gap-5  mx-auto">

        <div className="bg-[#EFF6FF] border border-[#93C5FD] rounded-2xl px-5 py-4 text-[13px] text-[#0A66C2]">
          <p className="font-bold mb-1">Alur publikasi lowongan</p>
          <p className="text-[#0A66C2]">
            Lowongan baru masuk status <strong>Pending</strong> dan ditinjau admin sebelum tayang.
            Setelah <strong>Aktif</strong>, Anda tetap bisa mengedit atau menghapus lowongan kapan saja —
            perubahan langsung berlaku tanpa perlu kurasi ulang.
          </p>
        </div>

        {/* Stat strip — ledger, sama persis dengan Dashboard Dosen */}
        <div className="grid grid-cols-3 max-[700px]:grid-cols-1 bg-white border border-slate-200 rounded-2xl overflow-hidden">
          {[
            { label: "Total Lowongan",  value: jobs.length,     sub: "Semua status",      icon: <IconBriefcase size={16} />, color: "text-[#0A66C2]" },
            { label: "Total Pelamar",   value: totalApplicants, sub: "Dari semua lowongan", icon: <IconUsers size={16} />,     color: "text-emerald-600" },
            { label: "Menunggu Kurasi", value: pendingCount,    sub: "Belum ditinjau admin", icon: <IconTarget size={16} />,   color: "text-amber-500" },
          ].map((s, i) => (
            <div
              key={i}
              className="px-6 py-5 flex flex-col gap-2 transition-colors duration-150 hover:bg-slate-50 border-r border-dashed border-slate-200 last:border-r-0 max-[700px]:border-r-0 max-[700px]:border-b max-[700px]:last:border-b-0"
            >
              <div className="flex items-center gap-1.5">
                <span className={s.color}>{s.icon}</span>
                <span className={`font-mono text-[10px] uppercase tracking-[0.14em] font-semibold ${s.color}`}>{s.label}</span>
              </div>
              {loading
                ? <div className="h-8 w-10 bg-slate-100 rounded animate-pulse" />
                : <span className={`font-display text-[32px] font-semibold leading-none tracking-tight ${s.color}`}>{s.value}</span>}
              <span className="text-[11px] text-slate-400">{s.sub}</span>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2 flex-1 min-w-[200px] bg-white border border-[#e2e8f0] rounded-xl px-3.5 py-2.5 focus-within:border-[#0A66C2] focus-within:ring-2 focus-within:ring-[#0A66C2]/10 transition-all">
            <IconSearch />
            <input
              className="border-none outline-none text-[13px] text-[#1e1e2e] bg-transparent w-full placeholder:text-[#94a3b8]"
              placeholder="Cari lowongan..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <select
            className="px-3.5 py-2.5 border border-[#e2e8f0] rounded-xl text-[13px] text-[#374151] bg-white outline-none cursor-pointer hover:border-[#cbd5e1] transition-all focus:border-[#0A66C2] focus:ring-2 focus:ring-[#0A66C2]/10"
            value={dept}
            onChange={(e) => setDept(e.target.value)}
          >
            {DEPTS.map((d) => <option key={d}>{d}</option>)}
          </select>
          <button
            onClick={openAdd}
            disabled={statusVerifikasi !== "DITERIMA"}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-[13px] font-semibold whitespace-nowrap transition-colors
              ${statusVerifikasi === "DITERIMA"
                ? "bg-[#0A66C2] text-white cursor-pointer hover:bg-[#08519c]"
                : "bg-slate-200 text-slate-400 cursor-not-allowed"}`}
            title={statusVerifikasi !== "DITERIMA" ? "Akun belum diverifikasi admin" : ""}
          >
            <IconPlus /> Tambah Lowongan
          </button>
        </div>

        {statusVerifikasi && statusVerifikasi !== "DITERIMA" && (
          <div className={`rounded-2xl p-4 border flex items-center gap-3 ${
            statusVerifikasi === "MENUNGGU" ? "bg-amber-50 border-amber-200" : "bg-red-50 border-red-200"
          }`}>
            <span className={`text-[13px] font-medium ${statusVerifikasi === "MENUNGGU" ? "text-amber-700" : "text-red-700"}`}>
              {statusVerifikasi === "MENUNGGU"
                ? "Akun perusahaan Anda masih menunggu verifikasi admin. Anda belum dapat memposting lowongan."
                : "Akun perusahaan Anda ditolak oleh admin. Hubungi admin untuk informasi lebih lanjut."}
            </span>
          </div>
        )}

        {!loading && (
          <p className="text-[12.5px] text-[#94a3b8]">
            Menampilkan <span className="text-[#0A66C2] font-bold">{filtered.length}</span> lowongan
            {dept !== "Semua Divisi" ? ` di ${dept}` : ""}
          </p>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
            <p className="text-red-500 text-[14px] font-medium mb-2">{error}</p>
            <button onClick={fetchJobs} className="text-[13px] font-semibold text-[#0A66C2] underline">Coba lagi</button>
          </div>
        )}

        <div className="flex flex-col gap-3">
          {loading && !error && [...Array(4)].map((_, i) => <SkeletonRow key={i} />)}

          {!loading && !error && filtered.length === 0 && (
            <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-[#93C5FD]">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 rounded-2xl bg-[#EFF6FF] border-2 border-[#93C5FD] flex items-center justify-center">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#0A66C2" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
                    <line x1="12" y1="12" x2="12" y2="16" /><line x1="10" y1="14" x2="14" y2="14" />
                  </svg>
                </div>
              </div>
              <p className="text-[15px] font-bold text-[#1e1e2e] mb-1">
                {jobs.length === 0 ? "Belum ada lowongan" : "Lowongan tidak ditemukan"}
              </p>
              <p className="text-[13px] text-[#94a3b8] mb-5">
                {jobs.length === 0
                  ? "Mulai dengan menambahkan lowongan magang pertamamu. Lowongan akan ditinjau admin sebelum tayang."
                  : "Coba ubah kata kunci atau filter divisi."}
              </p>
              {jobs.length === 0 && (
                <button onClick={openAdd} disabled={statusVerifikasi !== "DITERIMA"}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-[13px] font-semibold whitespace-nowrap transition-colors mx-auto
                    ${statusVerifikasi === "DITERIMA" ? "bg-[#0A66C2] text-white cursor-pointer hover:bg-[#08519c]" : "bg-slate-200 text-slate-400 cursor-not-allowed"}`}>
                  <IconPlus /> Tambah Lowongan
                </button>
              )}
            </div>
          )}

          {!loading && !error && filtered.map((job) => {
            const tc = TYPE_CONFIG[job.type] || TYPE_CONFIG.Remote;
            const sc = STATUS_CONFIG[job.status] || STATUS_CONFIG.Pending;
            const isAktif   = job.status === "Aktif";
            const isDitolak = job.status === "Ditolak";

            return (
              <div key={job.id}
                className={`bg-white border rounded-2xl px-5 py-4 flex items-center gap-4 transition-all duration-150
                  ${isAktif ? "border-[#a7f3d0] " : isDitolak ? "border-[#fecaca]" : "border-[#e2e8f0] hover:border-[#60A5FA] "}`}
              >
                <Avatar dept={job.dept} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1.5">
                    <span className="text-[14.5px] font-bold text-[#1e1e2e]">{job.title}</span>
                    <span className="font-mono px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wide border"
                      style={{ background: tc.bg, color: tc.text, borderColor: tc.border }}>{job.type}</span>
                    <span className="font-mono px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wide border"
                      style={{ background: sc.bg, color: sc.text, borderColor: sc.border }}>{sc.label}</span>
                  </div>
                  <div className="font-mono flex items-center gap-3 text-[11px] text-[#64748b] tracking-wide mb-2.5 flex-wrap">
                    <span className="flex items-center gap-1"><IconBuilding />{job.dept}</span>
                    <span className="flex items-center gap-1"><IconClock />{job.duration}</span>
                    {job.location && <span className="flex items-center gap-1"><IconMapPin />{job.location}</span>}
                    {job.deadline && <span className="flex items-center gap-1"><IconCalendar />Deadline: {job.deadline}</span>}
                    {job.salary   && <span className="flex items-center gap-1 text-[#10b981] font-medium">{job.salary}</span>}
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {job.tags.map((t) => (
                      <span key={t} className="px-2 py-0.5 rounded-lg text-[11px] font-semibold bg-[#EFF6FF] text-[#0A66C2] border border-[#93C5FD]">{t}</span>
                    ))}
                  </div>
                </div>

                <div className="w-px h-14 bg-[#f1f5f9] flex-shrink-0" />
                <div className="flex gap-5 items-center flex-shrink-0">
                  <div className="text-center">
                    <div className="font-display text-[22px] font-semibold text-[#1e1e2e]">{job.applicants}</div>
                    <div className="text-[11px] text-[#94a3b8] mt-0.5">Pelamar</div>
                  </div>
                  <div className="text-center">
                    <div className="font-display text-[22px] font-semibold text-[#1e1e2e]">{job.slots}</div>
                    <div className="text-[11px] text-[#94a3b8] mt-0.5">Kuota</div>
                  </div>
                </div>

                <div className="w-px h-14 bg-[#f1f5f9] flex-shrink-0" />
                {/* ✅ Opsi A: Edit & Hapus selalu aktif, apapun statusnya */}
                <div className="flex gap-2 items-center flex-shrink-0">
                  <IconBtn variant="green" title="Lihat Detail" onClick={() => setViewJob(job)}><IconEye /></IconBtn>
                  <IconBtn variant="primary" title="Edit Lowongan" onClick={() => openEdit(job.id)}><IconEdit /></IconBtn>
                  <IconBtn variant="danger" title="Hapus Lowongan" onClick={() => setDeleteTarget(job)}><IconTrash /></IconBtn>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {/* Modals */}
      {viewJob && (
        <DetailModal job={viewJob} onClose={() => setViewJob(null)} onEdit={(id) => { setViewJob(null); openEdit(id); }} />
      )}
      {modalMode && (
        <JobModal mode={modalMode} form={form} errors={errors} jobStatus={editingJob?.status}
          onChange={handleFormChange} onListChange={handleListChange}
          onSubmit={handleSubmit} onClose={() => setModalMode(null)} />
      )}
      {deleteTarget && (
        <DeleteModal job={deleteTarget} onConfirm={handleDelete} onClose={() => setDeleteTarget(null)} />
      )}

      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  );
}