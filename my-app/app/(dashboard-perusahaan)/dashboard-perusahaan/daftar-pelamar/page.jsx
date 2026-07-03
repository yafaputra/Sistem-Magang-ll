"use client";

import { useState, useEffect } from "react";
import Topbar from "../../components/topbar";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000";

// ─── Status Config ─────────────────────────────────────────────────────────────
const STATUS_CONFIG = {
  PENDING_BERKAS: {
    label: "Menunggu Berkas",
    dot: "bg-slate-300",
    badge: "bg-slate-100 text-slate-600 border border-slate-200",
    timelineBg: "bg-slate-50 border-slate-100",
    icon: "clock",
  },
  BERKAS_DITERIMA: {
    label: "Berkas Disetujui",
    dot: "bg-blue-400",
    badge: "bg-blue-50 text-blue-700 border border-blue-200",
    timelineBg: "bg-blue-50 border-blue-100",
    icon: "check-circle",
  },
  BERKAS_DITOLAK: {
    label: "Berkas Ditolak",
    dot: "bg-red-400",
    badge: "bg-red-50 text-red-600 border border-red-200",
    timelineBg: "bg-red-50 border-red-100",
    icon: "x-circle",
  },
  INTERVIEW_DIJADWALKAN: {
    label: "Interview",
    dot: "bg-violet-400",
    badge: "bg-violet-50 text-violet-700 border border-violet-200",
    timelineBg: "bg-violet-50 border-violet-100",
    icon: "calendar",
  },
  LOLOS_INTERVIEW: {
    label: "Lolos Interview",
    dot: "bg-amber-400",
    badge: "bg-amber-50 text-amber-700 border border-amber-200",
    timelineBg: "bg-amber-50 border-amber-100",
    icon: "check",
  },
  TIDAK_LOLOS_INTERVIEW: {
    label: "Tidak Lolos",
    dot: "bg-red-400",
    badge: "bg-red-50 text-red-600 border border-red-200",
    timelineBg: "bg-red-50 border-red-100",
    icon: "x-circle",
  },
  DITERIMA_MAGANG: {
    label: "Diterima",
    dot: "bg-emerald-400",
    badge: "bg-emerald-50 text-emerald-700 border border-emerald-200",
    timelineBg: "bg-emerald-50 border-emerald-100",
    icon: "check-circle",
  },
  KONFIRMASI_DITERIMA: {
    label: "Terkonfirmasi",
    dot: "bg-emerald-600",
    badge: "bg-emerald-100 text-emerald-800 border border-emerald-300",
    timelineBg: "bg-emerald-50 border-emerald-200",
    icon: "check-circle",
  },
  DITOLAK: {
    label: "Ditolak",
    dot: "bg-red-400",
    badge: "bg-red-50 text-red-600 border border-red-200",
    timelineBg: "bg-red-50 border-red-100",
    icon: "x-circle",
  },
};

const STATUS_COMPAT = {
  pending:  "PENDING_BERKAS",
  accepted: "DITERIMA_MAGANG",
  rejected: "DITOLAK",
};
const normalizeStatus = (s) => STATUS_COMPAT[s] || s;

// ─── Icon Component ────────────────────────────────────────────────────────────
function Icon({ name, className = "w-4 h-4" }) {
  const paths = {
    users:         <><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></>,
    clock:         <><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></>,
    refresh:       <><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-3.5"/></>,
    "check-circle":<><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></>,
    "x-circle":    <><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></>,
    calendar:      <><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></>,
    check:         <><polyline points="20 6 9 17 4 12"/></>,
    search:        <><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></>,
    "arrow-left":  <><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></>,
    x:             <><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>,
    briefcase:     <><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></>,
    school:        <><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></>,
    user:          <><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></>,
    star:          <><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></>,
    "map-pin":     <><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></>,
    file:          <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></>,
    download:      <><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></>,
    edit:          <><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></>,
    "alert-circle":<><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></>,
    "link":        <><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></>,
    "sliders":     <><line x1="4" y1="21" x2="4" y2="14"/><line x1="4" y1="10" x2="4" y2="3"/><line x1="12" y1="21" x2="12" y2="12"/><line x1="12" y1="8" x2="12" y2="3"/><line x1="20" y1="21" x2="20" y2="16"/><line x1="20" y1="12" x2="20" y2="3"/><line x1="1" y1="14" x2="7" y2="14"/><line x1="9" y1="8" x2="15" y2="8"/><line x1="17" y1="16" x2="23" y2="16"/></>,
  };
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
      {paths[name]}
    </svg>
  );
}

// ─── Stat Cards Config ─────────────────────────────────────────────────────────
const STAT_CARDS = [
  { key: "total",    label: "Total Pelamar",    icon: "users",        bg: "bg-white",       iconBg: "bg-slate-100",   iconBorder: "border-slate-200",   iconColor: "text-slate-500",   numColor: "text-slate-700" },
  { key: "menunggu", label: "Menunggu Review",  icon: "clock",        bg: "bg-blue-50",     iconBg: "bg-blue-100",    iconBorder: "border-blue-200",    iconColor: "text-blue-600",    numColor: "text-blue-700" },
  { key: "proses",   label: "Dalam Proses",     icon: "refresh",      bg: "bg-violet-50",   iconBg: "bg-violet-100",  iconBorder: "border-violet-200",  iconColor: "text-violet-600",  numColor: "text-violet-700" },
  { key: "diterima", label: "Diterima Magang",  icon: "check-circle", bg: "bg-emerald-50",  iconBg: "bg-emerald-100", iconBorder: "border-emerald-200", iconColor: "text-emerald-600", numColor: "text-emerald-700" },
];

// ─── Stepper ───────────────────────────────────────────────────────────────────
const TAHAPAN = [
  { key: "berkas",     label: "Upload Berkas" },
  { key: "verifikasi", label: "Verifikasi" },
  { key: "interview",  label: "Interview" },
  { key: "hasil",      label: "Hasil" },
];

function getStepStates(status) {
  const map = {
    PENDING_BERKAS:        ["active",   "pending",  "pending",  "pending"],
    BERKAS_DITERIMA:       ["done",     "done",     "active",   "pending"],
    BERKAS_DITOLAK:        ["done",     "rejected", "pending",  "pending"],
    INTERVIEW_DIJADWALKAN: ["done",     "done",     "active",   "pending"],
    LOLOS_INTERVIEW:       ["done",     "done",     "done",     "active"],
    TIDAK_LOLOS_INTERVIEW: ["done",     "done",     "rejected", "pending"],
    DITERIMA_MAGANG:       ["done",     "done",     "done",     "done"],
    KONFIRMASI_DITERIMA:   ["done",     "done",     "done",     "done"],
    DITOLAK:               ["done",     "done",     "done",     "rejected"],
  };
  return map[status] || ["active", "pending", "pending", "pending"];
}

const STEP_STYLE = {
  done:     { circle: "bg-emerald-100 border-emerald-300 text-emerald-700", label: "text-emerald-600", line: "bg-emerald-200", icon: "✓" },
  active:   { circle: "bg-blue-100 border-blue-400 text-blue-700",          label: "text-blue-600",    line: "bg-slate-200",   icon: "●" },
  rejected: { circle: "bg-red-100 border-red-300 text-red-600",             label: "text-red-500",     line: "bg-slate-200",   icon: "✕" },
  pending:  { circle: "bg-slate-100 border-slate-200 text-slate-400",       label: "text-slate-400",   line: "bg-slate-200",   icon: "" },
};

function Stepper({ status }) {
  const states = getStepStates(status);
  return (
    <div className="flex items-start">
      {TAHAPAN.map((t, i) => {
        const s = STEP_STYLE[states[i]] || STEP_STYLE.pending;
        return (
          <div key={t.key} className="flex items-start">
            <div className="flex flex-col items-center gap-1">
              <div className={`w-7 h-7 rounded-full border-2 flex items-center justify-center text-[10px] font-bold flex-shrink-0 ${s.circle}`}>
                {s.icon}
              </div>
              <span className={`text-[9.5px] font-medium whitespace-nowrap ${s.label}`}>{t.label}</span>
            </div>
            {i < TAHAPAN.length - 1 && (
              <div className={`w-9 h-0.5 mt-3.5 mx-0.5 flex-shrink-0 ${s.line}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── Helpers ───────────────────────────────────────────────────────────────────
const getInitials = (name) =>
  (name || "?").split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();

const parseSkills = (raw) => {
  if (!raw) return [];
  if (Array.isArray(raw)) return raw.map((s) => s.name || s);
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [raw];
  } catch { return [raw]; }
};

const formatDate = (date) => {
  if (!date) return "-";
  return new Date(date).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
};

const mapLamaranToApplicant = (item) => ({
  id:              item.id,
  name:            item.name || item.mahasiswa?.user?.name || "-",
  position:        item.lowongan?.posisi || "-",
  ipk:             item.mahasiswa?.ipk || "-",
  university:      item.university || "-",
  major:           item.major || item.mahasiswa?.prodi || "-",
  semester:        item.semester || item.mahasiswa?.semester || "-",
  duration:        item.duration || "-",
  skills:          parseSkills(item.skills),
  status:          normalizeStatus(item.status || "PENDING_BERKAS"),
  jadwalInterview: item.jadwalInterview || null,
  cvUrl:           item.cvFile ? `${API_BASE}/uploads/lamaran/${item.cvFile}` : null,
  cvFilename:      item.cvFile || null,
  appliedAt:       formatDate(item.createdAt),
});

const AV_COLORS = [
  ["bg-blue-100",    "text-blue-700",    "border-blue-200"],
  ["bg-emerald-100", "text-emerald-700", "border-emerald-200"],
  ["bg-violet-100",  "text-violet-700",  "border-violet-200"],
  ["bg-amber-100",   "text-amber-700",   "border-amber-200"],
  ["bg-rose-100",    "text-rose-700",    "border-rose-200"],
];

const getToken = () => {
  try { return localStorage.getItem("token") || ""; } catch { return ""; }
};

// ─── Interview Modal ───────────────────────────────────────────────────────────
function InterviewModal({ onClose, onSave, existing }) {
  const [form, setForm] = useState({
    tanggal:     existing?.tanggal     || "",
    jam:         existing?.jam         || "",
    lokasi:      existing?.lokasi      || "",
    linkMeeting: existing?.linkMeeting || "",
  });
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  const valid = form.tanggal && form.jam && form.lokasi;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xl w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-violet-50 border border-violet-200 flex items-center justify-center flex-shrink-0">
              <Icon name="calendar" className="w-4.5 h-4.5 text-violet-600" />
            </div>
            <div>
              <div className="text-[13.5px] font-semibold text-slate-800">{existing ? "Edit Jadwal Interview" : "Jadwalkan Interview"}</div>
              <div className="text-[11px] text-slate-400 mt-0.5">Isi detail jadwal untuk pelamar ini</div>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-slate-100 transition-colors">
            <Icon name="x" className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="px-5 py-4 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10.5px] font-semibold text-slate-500 mb-1.5 uppercase tracking-wide">Tanggal *</label>
              <input type="date" value={form.tanggal} onChange={(e) => set("tanggal", e.target.value)}
                className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-[12.5px] text-slate-700 focus:outline-none focus:border-blue-400 transition-colors" />
            </div>
            <div>
              <label className="block text-[10.5px] font-semibold text-slate-500 mb-1.5 uppercase tracking-wide">Jam *</label>
              <input type="time" value={form.jam} onChange={(e) => set("jam", e.target.value)}
                className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-[12.5px] text-slate-700 focus:outline-none focus:border-blue-400 transition-colors" />
            </div>
          </div>
          <div>
            <label className="block text-[10.5px] font-semibold text-slate-500 mb-1.5 uppercase tracking-wide">Lokasi *</label>
            <input type="text" placeholder="cth. Kantor Pusat Lt. 3" value={form.lokasi} onChange={(e) => set("lokasi", e.target.value)}
              className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-[12.5px] text-slate-700 focus:outline-none focus:border-blue-400 transition-colors" />
          </div>
          <div>
            <label className="block text-[10.5px] font-semibold text-slate-500 mb-1.5 uppercase tracking-wide">
              Link Meeting <span className="normal-case font-normal text-slate-400">(opsional)</span>
            </label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                <Icon name="link" className="w-3.5 h-3.5" />
              </div>
              <input type="url" placeholder="https://meet.google.com/..." value={form.linkMeeting} onChange={(e) => set("linkMeeting", e.target.value)}
                className="w-full border border-slate-200 rounded-xl pl-9 pr-3 py-2.5 text-[12.5px] text-slate-700 focus:outline-none focus:border-blue-400 transition-colors" />
            </div>
          </div>
        </div>

        <div className="px-5 pb-5 flex gap-2">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl text-sm font-semibold border border-slate-200 text-slate-500 hover:bg-slate-50 transition-colors">
            Batal
          </button>
          <button onClick={() => valid && onSave(form)} disabled={!valid}
            className="flex-1 py-2.5 rounded-xl text-sm font-semibold bg-violet-500 text-white hover:bg-violet-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2">
            <Icon name="calendar" className="w-4 h-4" />
            {existing ? "Simpan Perubahan" : "Jadwalkan"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Action Panel (ditempatkan di bawah CV/PDF) ────────────────────────────────
// Header konsisten dengan InfoSection: kotak ikon + label uppercase.
function ActionHeader({ icon, color, children }) {
  return (
    <div className="flex items-center gap-2 mb-4">
      <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 border ${color}`}>
        <Icon name={icon} className="w-3.5 h-3.5" />
      </div>
      <span className="text-[10px] font-semibold tracking-widest uppercase text-slate-400">{children}</span>
    </div>
  );
}

function ActionButton({ onClick, tone, icon, children, disabled }) {
  const tones = {
    emerald: "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100",
    red:     "bg-red-50 text-red-600 border-red-100 hover:bg-red-100",
    violet:  "bg-violet-500 text-white border-violet-500 hover:bg-violet-600",
    slate:   "bg-white text-slate-600 border-slate-200 hover:bg-slate-50",
  };
  const iconTones = {
    emerald: "bg-emerald-100 border-emerald-300 text-emerald-700",
    red:     "bg-red-100 border-red-300 text-red-600",
    violet:  "bg-violet-400 border-violet-300 text-white",
    slate:   "bg-slate-100 border-slate-200 text-slate-500",
  };
  return (
    <button onClick={onClick} disabled={disabled}
      className={`flex-1 py-2.5 rounded-xl text-[12.5px] font-semibold flex items-center justify-center gap-2 border transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${tones[tone]}`}>
      <div className={`w-6 h-6 rounded-lg border flex items-center justify-center flex-shrink-0 ${iconTones[tone]}`}>
        <Icon name={icon} className="w-3.5 h-3.5" />
      </div>
      {children}
    </button>
  );
}

function ActionPanel({ selected, onStatusChange, onOpenInterview }) {
  const s = selected.status;

  let body = null;

  if (s === "PENDING_BERKAS") {
    body = (
      <>
        <ActionHeader icon="file" color="bg-slate-100 border-slate-200 text-slate-500">Verifikasi Berkas</ActionHeader>
        <div className="flex gap-2">
          <ActionButton tone="emerald" icon="check" onClick={() => onStatusChange("BERKAS_DITERIMA")}>Setujui Berkas</ActionButton>
          <ActionButton tone="red" icon="x" onClick={() => onStatusChange("BERKAS_DITOLAK")}>Tolak Berkas</ActionButton>
        </div>
      </>
    );
  } else if (s === "BERKAS_DITERIMA") {
    body = (
      <>
        <ActionHeader icon="calendar" color="bg-violet-50 border-violet-200 text-violet-600">Jadwalkan Interview</ActionHeader>
        <ActionButton tone="violet" icon="calendar" onClick={onOpenInterview}>Jadwalkan Interview</ActionButton>
      </>
    );
  } else if (s === "INTERVIEW_DIJADWALKAN") {
    const j = selected.jadwalInterview;
    body = (
      <>
        <ActionHeader icon="calendar" color="bg-violet-50 border-violet-200 text-violet-600">Interview Dijadwalkan</ActionHeader>
        {j && (
          <div className="bg-violet-50 border border-violet-100 rounded-xl p-3 space-y-2 mb-3">
            {[
              ["Tanggal", new Date(j.tanggal).toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" })],
              ["Jam", j.jam + " WIB"],
              ["Lokasi", j.lokasi],
              j.linkMeeting ? ["Link", j.linkMeeting] : null,
            ].filter(Boolean).map(([k, v]) => (
              <div key={k} className="flex gap-2 items-start">
                <span className="text-[10.5px] text-violet-500 w-14 flex-shrink-0 font-semibold pt-0.5">{k}</span>
                <span className="text-[12px] text-violet-800 font-medium break-all">{v}</span>
              </div>
            ))}
          </div>
        )}
        <div className="flex gap-2">
          <ActionButton tone="slate" icon="edit" onClick={onOpenInterview}>Edit Jadwal</ActionButton>
          <ActionButton tone="emerald" icon="check" onClick={() => onStatusChange("LOLOS_INTERVIEW")}>Lolos</ActionButton>
          <ActionButton tone="red" icon="x" onClick={() => onStatusChange("TIDAK_LOLOS_INTERVIEW")}>Tidak Lolos</ActionButton>
        </div>
      </>
    );
  } else if (s === "LOLOS_INTERVIEW") {
    body = (
      <>
        <ActionHeader icon="star" color="bg-amber-50 border-amber-200 text-amber-600">Hasil Seleksi</ActionHeader>
        <div className="flex gap-2">
          <ActionButton tone="emerald" icon="check-circle" onClick={() => onStatusChange("DITERIMA_MAGANG")}>Terima Magang</ActionButton>
          <ActionButton tone="red" icon="x-circle" onClick={() => onStatusChange("DITOLAK")}>Tolak Pelamar</ActionButton>
        </div>
      </>
    );
  } else if (s === "DITERIMA_MAGANG") {
    body = (
      <>
        <ActionHeader icon="clock" color="bg-emerald-50 border-emerald-200 text-emerald-600">Menunggu Konfirmasi Mahasiswa</ActionHeader>
        <div className="flex items-start gap-3 bg-emerald-50 border border-emerald-100 rounded-xl p-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-100 border border-emerald-300 flex items-center justify-center flex-shrink-0">
            <Icon name="clock" className="w-4.5 h-4.5 text-emerald-600" />
          </div>
          <div>
            <div className="text-[12.5px] font-semibold text-emerald-800">Menunggu konfirmasi dari mahasiswa</div>
            <div className="text-[11.5px] text-emerald-600 mt-0.5 leading-relaxed">Mahasiswa akan mendapat notifikasi dan mengkonfirmasi penerimaan dalam 3 × 24 jam.</div>
          </div>
        </div>
      </>
    );
  } else if (s === "KONFIRMASI_DITERIMA") {
    body = (
      <>
        <ActionHeader icon="check-circle" color="bg-emerald-50 border-emerald-200 text-emerald-600">Selesai — Mahasiswa Bergabung</ActionHeader>
        <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-100 rounded-xl p-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 border border-emerald-300 flex items-center justify-center flex-shrink-0">
            <Icon name="check-circle" className="w-5 h-5 text-emerald-600" />
          </div>
          <div>
            <div className="text-[13px] font-semibold text-emerald-800">Konfirmasi diterima</div>
            <div className="text-[11.5px] text-emerald-600 mt-0.5">Mahasiswa telah mengkonfirmasi keikutsertaan dalam program magang.</div>
          </div>
        </div>
      </>
    );
  } else {
    const finalMessages = {
      DITOLAK:               "Pelamar ini telah ditolak.",
      BERKAS_DITOLAK:        "Berkas pelamar ini telah ditolak.",
      TIDAK_LOLOS_INTERVIEW: "Pelamar tidak lolos tahap interview.",
    };
    const msg = finalMessages[s];
    if (msg) {
      body = (
        <>
          <ActionHeader icon="x-circle" color="bg-red-50 border-red-200 text-red-500">Status Final</ActionHeader>
          <div className="flex items-center gap-3 bg-red-50 border border-red-100 rounded-xl p-3">
            <div className="w-9 h-9 rounded-xl bg-red-100 border border-red-300 flex items-center justify-center flex-shrink-0">
              <Icon name="x-circle" className="w-4.5 h-4.5 text-red-500" />
            </div>
            <span className="text-[13px] font-medium text-red-700">{msg}</span>
          </div>
        </>
      );
    }
  }

  if (!body) return null;

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
      {body}
    </div>
  );
}

// ─── Stat Card ─────────────────────────────────────────────────────────────────
function StatCard({ card, value }) {
  return (
    <div className={`${card.bg} border border-slate-200 rounded-xl p-4 flex items-center gap-3`}>
      <div className={`${card.iconBg} ${card.iconColor} border ${card.iconBorder} w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0`}>
        <Icon name={card.icon} className="w-5 h-5" />
      </div>
      <div>
        <div className={`text-2xl font-semibold ${card.numColor} leading-none`}>{value}</div>
        <div className="text-xs text-slate-500 mt-1">{card.label}</div>
      </div>
    </div>
  );
}

// ─── Applicant Item (sidebar) ──────────────────────────────────────────────────
function ApplicantItem({ applicant, index, isActive, onClick }) {
  const sc = STATUS_CONFIG[applicant.status] || STATUS_CONFIG.PENDING_BERKAS;
  const [avBg, avText, avBorder] = AV_COLORS[index % AV_COLORS.length];
  return (
    <button onClick={onClick}
      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all border mb-0.5
        ${isActive ? "bg-blue-500 border-blue-400" : "border-transparent hover:bg-slate-50 hover:border-slate-200"}`}>
      <div className={`w-9 h-9 rounded-xl flex-shrink-0 flex items-center justify-center text-[11px] font-bold border
        ${isActive ? "bg-blue-400 text-white border-blue-300" : `${avBg} ${avText} ${avBorder}`}`}>
        {getInitials(applicant.name)}
      </div>
      <div className="flex-1 min-w-0">
        <div className={`text-[12.5px] font-semibold truncate ${isActive ? "text-white" : "text-slate-800"}`}>{applicant.name}</div>
        <div className={`text-[11px] truncate mt-0.5 ${isActive ? "text-blue-100" : "text-slate-400"}`}>{applicant.position}</div>
      </div>
      <div className={`w-2 h-2 rounded-full flex-shrink-0 ${sc.dot}`} />
    </button>
  );
}

// ─── Info Section ──────────────────────────────────────────────────────────────
function InfoSection({ applicant }) {
  return (
    <div className="space-y-3">
      <div className="bg-white border border-slate-200 rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-7 h-7 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center flex-shrink-0">
            <Icon name="star" className="w-3.5 h-3.5 text-blue-500" />
          </div>
          <span className="text-[10px] font-semibold tracking-widest uppercase text-slate-400">Keahlian</span>
        </div>
        {applicant.skills.length > 0 ? (
          <div className="flex flex-wrap gap-1.5">
            {applicant.skills.map((skill) => (
              <span key={skill} className="px-3 py-1 rounded-lg bg-blue-50 text-blue-700 text-[11.5px] font-medium border border-blue-100">{skill}</span>
            ))}
          </div>
        ) : (
          <p className="text-xs text-slate-400">Belum ada data keahlian.</p>
        )}
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-7 h-7 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center flex-shrink-0">
            <Icon name="school" className="w-3.5 h-3.5 text-slate-500" />
          </div>
          <span className="text-[10px] font-semibold tracking-widest uppercase text-slate-400">Detail Akademik</span>
        </div>
        <div className="grid grid-cols-2 gap-x-6 gap-y-4">
          {[
            ["Tanggal Daftar", applicant.appliedAt],
            ["Program Studi",  applicant.major],
            ["Universitas",    applicant.university],
            ["Durasi Pilihan", applicant.duration],
            ["Semester",       applicant.semester ? `Semester ${applicant.semester}` : "-"],
            ["IPK",            applicant.ipk],
          ].map(([label, value]) => (
            <div key={label}>
              <div className="text-[10.5px] text-slate-400 mb-0.5">{label}</div>
              <div className="text-[13px] font-medium text-slate-800">{value || "-"}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── CV Section ────────────────────────────────────────────────────────────────
function CVSection({ applicant }) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-7 h-7 rounded-lg bg-red-50 border border-red-200 flex items-center justify-center flex-shrink-0">
          <Icon name="file" className="w-3.5 h-3.5 text-red-500" />
        </div>
        <span className="text-[10px] font-semibold tracking-widest uppercase text-slate-400">CV / Resume</span>
      </div>
      <div className="flex items-center justify-between bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 mb-3">
        <div className="flex items-center gap-2 text-[12px] font-medium text-slate-600">
          <Icon name="file" className="w-4 h-4 text-red-400" />
          {applicant.cvFilename || "Belum ada file"}
        </div>
        {applicant.cvFilename && (
          <a href={applicant.cvUrl} target="_blank" rel="noopener noreferrer" download={applicant.cvFilename}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11.5px] font-medium bg-blue-50 text-blue-700 border border-blue-200 no-underline hover:bg-blue-100 transition-colors">
            <div className="w-5 h-5 rounded-md bg-blue-100 border border-blue-200 flex items-center justify-center flex-shrink-0">
              <Icon name="download" className="w-3 h-3" />
            </div>
            Download
          </a>
        )}
      </div>
      {applicant.cvUrl && applicant.cvFilename ? (
        <iframe src={applicant.cvUrl} title={`CV ${applicant.name}`} className="w-full h-[420px] rounded-xl border border-slate-200 block" />
      ) : (
        <div className="py-14 flex flex-col items-center text-slate-400">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center mb-3">
            <Icon name="file" className="w-6 h-6 text-slate-300" />
          </div>
          <div className="text-sm font-medium">CV belum diunggah</div>
          <div className="text-xs mt-1">Mahasiswa belum mengupload file CV</div>
        </div>
      )}
    </div>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────────
export default function DaftarPelamar() {
  const [list,               setList]               = useState([]);
  const [selectedId,         setSelectedId]         = useState(null);
  const [loading,            setLoading]            = useState(true);
  const [error,              setError]              = useState("");
  const [search,             setSearch]             = useState("");
  const [activeTab,          setActiveTab]          = useState("info");
  const [showInterviewModal, setShowInterviewModal] = useState(false);

  useEffect(() => {
    const token = getToken();
    fetch(`${API_BASE}/api/rekrutmen/pelamar`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => { if (!res.ok) throw new Error(`HTTP ${res.status}`); return res.json(); })
      .then((result) => {
        const mapped = (result.data || []).map(mapLamaranToApplicant);
        setList(mapped);
        if (mapped.length > 0) setSelectedId(mapped[0].id);
      })
      .catch((err) => { console.error(err); setError(`Gagal mengambil data pelamar: ${err.message}`); })
      .finally(() => setLoading(false));
  }, []);

  const selected    = list.find((a) => a.id === selectedId) ?? null;
  const rawIdx      = list.findIndex((a) => a.id === selectedId);
  const safeIdx     = rawIdx < 0 ? 0 : rawIdx;
  const [avBg, avText, avBorder] = AV_COLORS[safeIdx % AV_COLORS.length];
  const sc          = selected ? (STATUS_CONFIG[selected.status] ?? STATUS_CONFIG.PENDING_BERKAS) : STATUS_CONFIG.PENDING_BERKAS;

  const counts = {
    total:    list.length,
    menunggu: list.filter((a) => a.status === "PENDING_BERKAS").length,
    proses:   list.filter((a) => ["BERKAS_DITERIMA", "INTERVIEW_DIJADWALKAN", "LOLOS_INTERVIEW"].includes(a.status)).length,
    diterima: list.filter((a) => ["DITERIMA_MAGANG", "KONFIRMASI_DITERIMA"].includes(a.status)).length,
  };

  const filtered = list.filter((a) => {
    const q = search.toLowerCase();
    return a.name.toLowerCase().includes(q) || a.position.toLowerCase().includes(q);
  });

  const handleSelect = (id) => { setSelectedId(id); setActiveTab("info"); };

  const handleStatusChange = async (newStatus) => {
    if (!selectedId) return;
    const token = getToken();
    try {
      const res = await fetch(`${API_BASE}/api/rekrutmen/pelamar/${selectedId}/status`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setList((prev) => prev.map((a) => a.id === selectedId ? { ...a, status: newStatus } : a));
    } catch (err) {
      alert(`Gagal mengubah status: ${err.message}`);
    }
  };

  const handleSaveInterview = async (data) => {
    if (!selectedId) return;
    const token = getToken();
    try {
      const res = await fetch(`${API_BASE}/api/rekrutmen/pelamar/${selectedId}/interview`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, status: "INTERVIEW_DIJADWALKAN" }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setList((prev) => prev.map((a) => a.id === selectedId ? { ...a, status: "INTERVIEW_DIJADWALKAN", jadwalInterview: data } : a));
      setShowInterviewModal(false);
    } catch (err) {
      alert(`Gagal menyimpan jadwal interview: ${err.message}`);
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-screen bg-slate-50 gap-3">
      <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      <div className="text-slate-400 text-sm">Memuat data pelamar…</div>
    </div>
  );

  if (error) return (
    <div className="flex flex-col items-center justify-center h-screen bg-slate-50 gap-4">
      <div className="w-12 h-12 rounded-2xl bg-red-50 border border-red-200 flex items-center justify-center">
        <Icon name="alert-circle" className="w-6 h-6 text-red-500" />
      </div>
      <div className="text-center">
        <div className="text-sm font-semibold text-slate-700 mb-1">Gagal memuat data</div>
        <div className="text-xs text-red-500">{error}</div>
      </div>
      <button onClick={() => window.location.reload()}
        className="px-4 py-2 rounded-xl bg-blue-500 text-white text-sm font-semibold hover:bg-blue-600 transition-colors">
        Coba Lagi
      </button>
    </div>
  );

  return (
    <div className="flex flex-col h-screen bg-slate-50 font-sans">
      {showInterviewModal && (
        <InterviewModal
          onClose={() => setShowInterviewModal(false)}
          onSave={handleSaveInterview}
          existing={selected?.jadwalInterview}
        />
      )}

      <Topbar
        icon={<Icon name="briefcase" className="w-4.5 h-4.5" />}
        title="Daftar Pelamar"
        subtitle="Portal manajemen pelamar magang"
        rightSlot={
          <button className="flex items-center gap-2 px-4 py-2 border border-blue-300 rounded-xl text-blue-600 text-[12.5px] font-semibold bg-transparent transition-all duration-150 hover:bg-blue-500 hover:text-white hover:border-blue-500 cursor-pointer">
            <div className="w-6 h-6 rounded-lg bg-blue-100 border border-blue-200 flex items-center justify-center flex-shrink-0">
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 9.5L12 3l9 6.5" />
                <path d="M5 9v11a1 1 0 0 0 1 1h3v-7h6v7h3a1 1 0 0 0 1-1V9" />
              </svg>
            </div>
            Back to homepage
          </button>
        }
      />

      {/* Stat Cards */}
      <div className="grid grid-cols-4 gap-3 px-6 py-4 flex-shrink-0">
        {STAT_CARDS.map((card) => (
          <StatCard key={card.key} card={card} value={counts[card.key]} />
        ))}
      </div>

      {/* Main Body */}
      <div className="flex flex-1 overflow-hidden px-6 pb-6 gap-4">

        {/* Sidebar */}
        <div className="w-[250px] flex-shrink-0 bg-white border border-slate-200 rounded-2xl flex flex-col overflow-hidden">
          <div className="px-4 pt-4 pb-3 border-b border-slate-100 flex-shrink-0">
            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 focus-within:border-blue-300 transition-colors">
              <Icon name="search" className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
              <input
                className="border-none outline-none text-[12.5px] text-slate-700 bg-transparent w-full placeholder:text-slate-400"
                placeholder="Cari nama atau posisi…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto px-3 py-3">
            <div className="text-[10px] font-semibold tracking-widest uppercase text-slate-400 px-1 mb-2">
              Pelamar ({filtered.length})
            </div>
            {filtered.length === 0 ? (
              <div className="py-10 text-center text-slate-400">
                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-2">
                  <Icon name="search" className="w-5 h-5 text-slate-300" />
                </div>
                <div className="text-xs">Tidak ada hasil</div>
              </div>
            ) : (
              filtered.map((a, i) => (
                <ApplicantItem key={a.id} applicant={a} index={i} isActive={a.id === selectedId} onClick={() => handleSelect(a.id)} />
              ))
            )}
          </div>
        </div>

        {/* Detail Panel */}
        {selected ? (
          <div className="flex-1 overflow-y-auto space-y-3">
            {/* Profile Card */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl border flex items-center justify-center text-base font-bold flex-shrink-0 ${avBg} ${avText} ${avBorder}`}>
                  {getInitials(selected.name)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[15px] font-semibold text-slate-800">{selected.name}</div>
                  <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-0.5">
                    <Icon name="map-pin" className="w-3 h-3" />
                    {selected.university}
                  </div>
                </div>
                <span className={`flex-shrink-0 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${sc.badge}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />
                  {sc.label}
                </span>
              </div>

              <div className="mt-4 pt-4 border-t border-slate-100">
                <div className="text-[10px] font-semibold tracking-widest uppercase text-slate-400 mb-3">Progress Seleksi</div>
                <Stepper status={selected.status} />
              </div>

              <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-slate-100">
                {[
                  { icon: "briefcase", val: selected.position },
                  { icon: "school",    val: selected.major },
                  { icon: "clock",     val: `Sem ${selected.semester}` },
                  { icon: "star",      val: `IPK ${selected.ipk}` },
                ].map(({ icon, val }) => (
                  <div key={val} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-50 text-slate-600 text-xs border border-slate-200">
                    <Icon name={icon} className="w-3 h-3 text-slate-400" />
                    {val}
                  </div>
                ))}
              </div>
            </div>

            {/* Tab Switcher */}
            <div className="flex bg-white border border-slate-200 rounded-2xl overflow-hidden">
              {[
                { key: "info", label: "Info Pelamar", icon: "user" },
                { key: "cv",   label: "CV / Resume",  icon: "file" },
              ].map((tab) => (
                <button key={tab.key} onClick={() => setActiveTab(tab.key)}
                  className={`flex-1 py-3 text-xs font-semibold flex items-center justify-center gap-2 border-none cursor-pointer transition-all
                    ${activeTab === tab.key ? "bg-blue-50 text-blue-700 border-b-2 border-blue-400" : "bg-transparent text-slate-400 hover:bg-slate-50"}`}>
                  <div className={`w-5 h-5 rounded-md border flex items-center justify-center flex-shrink-0 ${activeTab === tab.key ? "bg-blue-100 border-blue-200" : "bg-slate-100 border-slate-200"}`}>
                    <Icon name={tab.icon} className="w-3 h-3" />
                  </div>
                  {tab.label}
                </button>
              ))}
            </div>

            {activeTab === "info" ? <InfoSection applicant={selected} /> : <CVSection applicant={selected} />}

            {/* Aksi / Tindakan — ditaruh paling bawah, di bawah bagian CV/PDF */}
            <div className="pt-1">
              <div className="flex items-center gap-2 px-1 mb-2">
                <Icon name="sliders" className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-[10px] font-semibold tracking-widest uppercase text-slate-400">Tindakan</span>
              </div>
              <ActionPanel selected={selected} onStatusChange={handleStatusChange} onOpenInterview={() => setShowInterviewModal(true)} />
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-white border border-slate-200 rounded-2xl text-slate-400">
            <div className="text-center">
              <div className="w-14 h-14 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center mx-auto mb-3">
                <Icon name="users" className="w-7 h-7 text-slate-300" />
              </div>
              <div className="text-sm font-medium">Pilih pelamar untuk melihat detail</div>
              <div className="text-xs text-slate-400 mt-1">Detail akan muncul di sini</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}