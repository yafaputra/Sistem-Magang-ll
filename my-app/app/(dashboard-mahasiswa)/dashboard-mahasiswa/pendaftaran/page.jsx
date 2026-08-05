"use client";

import { useState, useEffect } from "react";
import Topbar from "../../components/topbar";
import formatRupiah from "@/utils/price-formatter";

/* ════════════════════════════════════════
   FONTS (disamakan dengan Dashboard)
════════════════════════════════════════ */
const FONTS = `
@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600;9..144,700&family=IBM+Plex+Mono:wght@400;500;600&display=swap');
.font-display { font-family: 'Fraunces', 'Georgia', serif; }
.font-mono { font-family: 'IBM Plex Mono', 'Courier New', monospace; }
`;

/* ════════════════════════════════════════
   SVG ICON COMPONENTS
════════════════════════════════════════ */
const IconTrophy = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 9H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h2" />
    <path d="M18 9h2a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2h-2" />
    <path d="M6 2h12v10a6 6 0 0 1-12 0V2z" />
    <path d="M12 18v4" />
    <path d="M8 22h8" />
  </svg>
);

const IconCheckCircle = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);

const IconXCircle = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <line x1="15" y1="9" x2="9" y2="15" />
    <line x1="9" y1="9" x2="15" y2="15" />
  </svg>
);

const IconCalendar = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

const IconParty = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5.8 11.3L2 22l10.7-3.79" />
    <path d="M4 3h.01" /><path d="M22 8h.01" /><path d="M15 2h.01" /><path d="M22 20h.01" />
    <path d="m22 2-2.24.75a2.9 2.9 0 0 0-1.96 3.12v0c.1.86-.57 1.63-1.45 1.63h-.38c-.86 0-1.6.6-1.76 1.44L14 10" />
    <path d="m22 13-.82-.33c-.86-.34-1.82.2-1.98 1.11v0c-.11.7-.72 1.22-1.43 1.22H17" />
    <path d="m11 2 .33.82c.34.86-.2 1.82-1.11 1.98v0C9.52 4.9 9 5.52 9 6.23V7" />
    <path d="M11 13c1.93 1.93 2.83 4.17 2 5-.83.83-3.07-.07-5-2-1.93-1.93-2.83-4.17-2-5 .83-.83 3.07.07 5 2z" />
  </svg>
);

const IconFrown = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <path d="M16 16s-1.5-2-4-2-4 2-4 2" />
    <line x1="9" y1="9" x2="9.01" y2="9" />
    <line x1="15" y1="9" x2="15.01" y2="9" />
  </svg>
);

const IconClock = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

const IconAlertTriangle = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
    <line x1="12" y1="9" x2="12" y2="13" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
);

const IconSparkle = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
  </svg>
);

const IconLock = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

const IconInfo = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="16" x2="12" y2="12" />
    <line x1="12" y1="8" x2="12.01" y2="8" />
  </svg>
);

/* ════════════════════════════════════════
   STATUS CONFIG
════════════════════════════════════════ */
const STATUS_CONFIG = {
  PENDING_BERKAS:          { label: "Menunggu Verifikasi Berkas", cls: "bg-[#0A66C2]/5 text-[#0A66C2] border border-[#0A66C2]/25" },
  BERKAS_DITERIMA:         { label: "Berkas Disetujui",           cls: "bg-[#0A66C2]/5 text-[#0A66C2] border border-[#0A66C2]/25" },
  BERKAS_DITOLAK:          { label: "Berkas Ditolak",             cls: "bg-[#0A66C2]/5 text-[#0A66C2] border border-[#0A66C2]/25" },
  INTERVIEW_DIJADWALKAN:   { label: "Interview Dijadwalkan",      cls: "bg-[#0A66C2]/5 text-[#0A66C2] border border-[#0A66C2]/25" },
  LOLOS_INTERVIEW:         { label: "Lolos Interview",            cls: "bg-[#0A66C2]/5 text-[#0A66C2] border border-[#0A66C2]/25" },
  TIDAK_LOLOS_INTERVIEW:   { label: "Tidak Lolos Interview",      cls: "bg-[#0A66C2]/5 text-[#0A66C2] border border-[#0A66C2]/25" },
  DITERIMA_MAGANG:         { label: "Diterima Magang",            cls: "bg-[#0A66C2]/5 text-[#0A66C2] border border-[#0A66C2]/25" },
  DITOLAK:                 { label: "Ditolak",                    cls: "bg-[#0A66C2]/5 text-[#0A66C2] border border-[#0A66C2]/25" },
  KONFIRMASI_DITERIMA:     { label: "Disetujui",                  cls: "bg-[#0A66C2]/5 text-[#0A66C2] border border-[#0A66C2]/25" },
  MENUNGGU_KONFIRMASI:     { label: "Menunggu Konfirmasi",        cls: "bg-[#0A66C2]/5 text-[#0A66C2] border border-[#0A66C2]/25" },
};

const FILTER_OPTIONS = [
  { value: "all",                   label: "Semua" },
  { value: "PENDING_BERKAS",        label: "Menunggu" },
  { value: "BERKAS_DITERIMA",       label: "Berkas OK" },
  { value: "INTERVIEW_DIJADWALKAN", label: "Interview" },
  { value: "LOLOS_INTERVIEW",       label: "Lolos" },
  { value: "DITERIMA_MAGANG",       label: "Diterima" },
  { value: "KONFIRMASI_DITERIMA",   label: "Terkonfirmasi" },
  { value: "DITOLAK",               label: "Ditolak" },
];

/* ════════════════════════════════════════
   STEP LOGIC
════════════════════════════════════════ */
const STEP_LABELS = ["Upload Berkas", "Verifikasi Berkas", "Interview", "Hasil Seleksi"];

function getStepStates(status) {
  const map = {
    PENDING_BERKAS:        ["active",   "pending",  "pending",  "pending"],
    BERKAS_DITERIMA:       ["done",     "done",     "active",   "pending"],
    BERKAS_DITOLAK:        ["done",     "rejected", "pending",  "pending"],
    INTERVIEW_DIJADWALKAN: ["done",     "done",     "active",   "pending"],
    LOLOS_INTERVIEW:       ["done",     "done",     "done",     "active"],
    TIDAK_LOLOS_INTERVIEW: ["done",     "done",     "rejected", "pending"],
    DITERIMA_MAGANG:       ["done",     "done",     "done",     "done"],
    DITOLAK:               ["done",     "done",     "done",     "rejected"],
    KONFIRMASI_DITERIMA:   ["done",     "done",     "done",     "done"],
  };
  return map[status] || ["active", "pending", "pending", "pending"];
}

const STEP_STYLE = {
  done:     { circle: "bg-[#0A66C2/10] border-[#0A66C2/40] text-[#0A66C2]",  label: "text-[#0A66C2]",  line: "bg-[#0A66C2/40]" },
  active:   { circle: "bg-[#EFF6FF] border-[#0A66C2] text-[#0A66C2]",  label: "text-[#0A66C2]",  line: "bg-[#e8e8f0]" },
  rejected: { circle: "bg-[#FCEBEB] border-[#F7C1C1] text-[#A32D2D]",  label: "text-[#A32D2D]",  line: "bg-[#e8e8f0]" },
  pending:  { circle: "bg-[#f0f0f8] border-[#e8e8f0] text-[#c0c0d8]",  label: "text-[#b0b0c8]",  line: "bg-[#e8e8f0]" },
};

const STEP_ICON = {
  done:     <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
  active:   <div className="w-2 h-2 rounded-full bg-current" />,
  rejected: <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  pending:  null,
};

/* ════════════════════════════════════════
   SUB-COMPONENTS
════════════════════════════════════════ */
function StepperFull({ status }) {
  const steps = getStepStates(status);
  return (
    <div className="flex items-start justify-center gap-0 pt-4 pb-1">
      {STEP_LABELS.map((label, i) => {
        const s = STEP_STYLE[steps[i]] || STEP_STYLE.pending;
        return (
          <div key={i} className="flex items-start">
            <div className="flex flex-col items-center min-w-[64px]">
              <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-bold ${s.circle}`}>
                {STEP_ICON[steps[i]]}
              </div>
              <div className={`text-[10px] font-semibold mt-1.5 text-center leading-tight ${s.label}`}>
                {label}
              </div>
            </div>
            {i < STEP_LABELS.length - 1 && (
              <div className={`w-10 h-0.5 mt-[15px] flex-shrink-0 ${steps[i] === "done" ? "bg-[#0A66C2/40]" : "bg-[#e8e8f0]"}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

function StepperMini({ status }) {
  const steps = getStepStates(status);
  return (
    <div className="flex items-center">
      {steps.map((state, i) => {
        const s = STEP_STYLE[state] || STEP_STYLE.pending;
        return (
          <div key={i} className="flex items-center">
            <div title={STEP_LABELS[i]} className={`w-5 h-5 rounded-full border flex items-center justify-center text-[8px] font-bold flex-shrink-0 ${s.circle}`}>
              {STEP_ICON[state]}
            </div>
            {i < steps.length - 1 && (
              <div className={`w-4 h-0.5 ${steps[i] === "done" && state !== "rejected" ? "bg-[#0A66C2/40]" : "bg-[#e8e8f0]"}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

function Tag({ label }) {
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-semibold bg-[#EFF6FF] text-[#0A66C2]">
      {label}
    </span>
  );
}

function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.PENDING_BERKAS;
  return (
    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-semibold whitespace-nowrap ${cfg.cls}`}>
      {status === "KONFIRMASI_DITERIMA" && (
        <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12"/>
        </svg>
      )}
      {cfg.label}
    </span>
  );
}

function Spinner({ color = "currentColor" }) {
  return (
    <svg className="w-3.5 h-3.5 animate-spin" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round">
      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
    </svg>
  );
}

/* ════════════════════════════════════════
   MODAL: KONFIRMASI PENERIMAAN MAGANG
════════════════════════════════════════ */
function ModalKonfirmasiMagang({ lamaran, onConfirm, onCancel, onClose, sudahKonfirmasiLain }) {
  const posisi      = lamaran?.lowongan?.posisi      ?? "—";
  const namaPerush  = lamaran?.lowongan?.perusahaan?.nama ?? "—";
  const [loadingConfirm, setLoadingConfirm] = useState(false);
  const [loadingCancel,  setLoadingCancel]  = useState(false);

  // State untuk form alasan pembatalan
  const [showCancelForm, setShowCancelForm] = useState(false);
  const [alasanBatal,    setAlasanBatal]    = useState("");
  const [alasanError,    setAlasanError]    = useState("");

  const handleConfirm = async () => {
    setLoadingConfirm(true);
    await onConfirm(lamaran.id);
    setLoadingConfirm(false);
  };

  const handleBatalClick = () => {
    setShowCancelForm(true);
    setAlasanBatal("");
    setAlasanError("");
  };

  const handleCancelSubmit = async () => {
    const trimmed = alasanBatal.trim();
    if (!trimmed) {
      setAlasanError("Alasan pembatalan wajib diisi.");
      return;
    }
    if (trimmed.length < 10) {
      setAlasanError("Alasan terlalu singkat, minimal 10 karakter.");
      return;
    }
    setLoadingCancel(true);
    await onCancel(lamaran.id, trimmed);
    setLoadingCancel(false);
  };

  return (
    <div
      className="fixed inset-0 z-[100] bg-[rgba(20,20,40,0.45)] flex items-center justify-center p-5 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl w-full max-w-[500px] shadow-2xl overflow-hidden animate-[modalIn_0.2s_ease]"
      >
        <style>{`@keyframes modalIn { from { opacity: 0; transform: translateY(16px) scale(0.97); } to { opacity: 1; transform: translateY(0) scale(1); } }`}</style>

        {/* Header */}
        <div className={`p-7 pb-6 relative ${sudahKonfirmasiLain ? "bg-gradient-to-br from-[#0A66C2] to-[#0958A8]" : "bg-gradient-to-br from-[#0A66C2] to-[#1a9e7a]"}`}>
          <div className="w-14 h-14 rounded-2xl bg-white/15 flex items-center justify-center mb-3.5">
            {sudahKonfirmasiLain
              ? <IconLock className="w-7 h-7 text-white" />
              : <IconTrophy className="w-7 h-7 text-white" />
            }
          </div>
          <div className="text-xl font-bold text-white leading-tight">
            {sudahKonfirmasiLain ? "Penerimaan Ini Tidak Dapat Dikonfirmasi" : "Selamat! Kamu Diterima Magang"}
          </div>
          <div className="text-[13px] text-white/80 mt-1.5">{posisi} · {namaPerush}</div>
          <button onClick={onClose} className="absolute top-4 right-4 w-8 h-8 rounded-lg bg-white/15 border-none text-white cursor-pointer flex items-center justify-center hover:bg-white/25 transition-colors">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        {/* Body */}
        <div className="p-7 pt-6">

          {/* Jika sudah konfirmasi di tempat lain */}
          {sudahKonfirmasiLain ? (
            <>
              <div className="bg-[#FFF8E1] border border-[#FFD54F] rounded-xl p-4 mb-5 text-sm text-[#B8860B]">
                <div className="flex items-center gap-2 font-bold mb-1">
                  <IconAlertTriangle className="w-4 h-4" /> Kamu Sudah Terdaftar di Tempat Lain
                </div>
                <p className="text-[12.5px] leading-relaxed">
                  Karena kamu sudah mengkonfirmasi magang di tempat lain, penerimaan ini tidak dapat dikonfirmasi. Mahasiswa hanya diperbolehkan magang di <strong>satu tempat</strong>.
                </p>
              </div>
              {!showCancelForm ? (
                <div className="flex flex-col gap-2.5">
                  <button
                    onClick={handleBatalClick}
                    className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-[#F7C1C1] bg-white text-[#A32D2D] text-sm font-semibold cursor-pointer hover:bg-[#FCEBEB]"
                  >
                    <IconXCircle className="w-4 h-4" />
                    Batalkan Penerimaan Ini
                  </button>
                  <button onClick={onClose} className="text-[12px] text-[#9898b0] text-center mt-1 cursor-pointer hover:underline bg-transparent border-none">
                    Tutup
                  </button>
                </div>
              ) : (
                <CancelForm
                  alasan={alasanBatal}
                  setAlasan={setAlasanBatal}
                  error={alasanError}
                  loading={loadingCancel}
                  onSubmit={handleCancelSubmit}
                  onBack={() => setShowCancelForm(false)}
                />
              )}
            </>
          ) : (
            /* Normal: belum konfirmasi di mana-mana */
            <>
              {!showCancelForm ? (
                <>
                  <p className="text-[13px] text-[#4a4a6a] leading-relaxed mb-5">
                    Kamu dinyatakan <strong>diterima</strong> sebagai peserta magang. Konfirmasi kesediaanmu di bawah. Jika tidak bisa hadir, pilih <strong>Batalkan Pendaftaran</strong> dan isi alasanmu.
                  </p>

                  <div className="bg-[#EFF6FF] border border-[#0A66C2/40] rounded-xl p-3 px-4 mb-5 text-xs text-[#0A66C2]">
                    <div className="flex items-center gap-1.5 font-semibold mb-1">
                      <IconAlertTriangle className="w-3.5 h-3.5" />
                      Penting
                    </div>
                    <ul className="list-disc list-inside space-y-1">
                      <li>Konfirmasi dalam <strong>3 × 24 jam</strong> setelah notifikasi diterima.</li>
                      <li>Setelah dikonfirmasi, kamu <strong>tidak dapat melamar</strong> di tempat lain.</li>
                      <li>Lamaran lain yang berstatus "Diterima" akan <strong>otomatis ditolak</strong>.</li>
                    </ul>
                  </div>

                  <div className="flex flex-col gap-2.5">
                    <button
                      onClick={handleConfirm}
                      disabled={loadingConfirm || loadingCancel}
                      className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl border-none text-white text-sm font-semibold cursor-pointer transition-opacity disabled:cursor-not-allowed"
                      style={{ background: loadingConfirm ? "#0A66C2/40" : "linear-gradient(135deg, #0A66C2, #1a9e7a)", opacity: loadingCancel ? 0.5 : 1 }}
                    >
                      {loadingConfirm
                        ? <><Spinner /> Mengkonfirmasi…</>
                        : <><svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg> Ya, Saya Konfirmasi Penerimaan</>
                      }
                    </button>

                    <button
                      onClick={handleBatalClick}
                      disabled={loadingConfirm || loadingCancel}
                      className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-[#F7C1C1] bg-white text-[#A32D2D] text-sm font-semibold cursor-pointer hover:bg-[#FCEBEB] disabled:cursor-not-allowed"
                      style={{ opacity: loadingConfirm ? 0.5 : 1 }}
                    >
                      <IconXCircle className="w-4 h-4" />
                      Batalkan Pendaftaran
                    </button>
                  </div>
                </>
              ) : (
                <CancelForm
                  alasan={alasanBatal}
                  setAlasan={setAlasanBatal}
                  error={alasanError}
                  loading={loadingCancel}
                  onSubmit={handleCancelSubmit}
                  onBack={() => setShowCancelForm(false)}
                />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════
   FORM ALASAN PEMBATALAN (reusable)
════════════════════════════════════════ */
function CancelForm({ alasan, setAlasan, error, loading, onSubmit, onBack }) {
  const ALASAN_CEPAT = [
    "Sudah diterima di tempat lain",
    "Ada kepentingan akademik mendadak",
    "Lokasi terlalu jauh dari tempat tinggal",
    "Kondisi kesehatan tidak memungkinkan",
    "Jadwal bentrok dengan kuliah",
  ];

  return (
    <div className="animate-[fadeIn_0.2s_ease]">
      <style>{`@keyframes fadeIn { from { opacity:0; transform:translateY(6px); } to { opacity:1; transform:translateY(0); } }`}</style>
      <p className="text-[13px] text-[#4a4a6a] font-semibold mb-3">Alasan Pembatalan</p>
      <p className="text-[12px] text-[#9898b0] mb-3 leading-relaxed">
        Pilih alasan di bawah atau tulis sendiri. Informasi ini membantu perusahaan dan program magang kami berkembang.
      </p>

      {/* Quick picks */}
      <div className="flex flex-wrap gap-1.5 mb-3">
        {ALASAN_CEPAT.map((a) => (
          <button
            key={a}
            onClick={() => setAlasan(a)}
            className={`px-3 py-1.5 rounded-full text-[11.5px] font-medium border transition-all cursor-pointer ${
              alasan === a
                ? "bg-[#FCEBEB] border-[#F7C1C1] text-[#A32D2D]"
                : "bg-[#f7f7fb] border-[#e8e8f0] text-[#555] hover:border-[#F7C1C1]"
            }`}
          >
            {a}
          </button>
        ))}
      </div>

      {/* Textarea */}
      <textarea
        value={alasan}
        onChange={(e) => { setAlasan(e.target.value); }}
        placeholder="Atau tulis alasanmu di sini… (min. 10 karakter)"
        rows={3}
        maxLength={300}
        className={`w-full border rounded-xl px-4 py-3 text-[13px] text-[#1e1e2e] placeholder:text-[#c0c0d8] resize-none outline-none transition-colors ${
          error ? "border-[#F7C1C1] bg-[#FCEBEB]/30" : "border-[#e8e8f0] bg-[#f7f7fb] focus:border-[#0A66C2]"
        }`}
      />
      <div className="flex items-center justify-between mt-1 mb-4">
        {error
          ? <p className="text-[11.5px] text-[#A32D2D]">{error}</p>
          : <span />
        }
        <span className="text-[11px] text-[#b0b0c8]">{alasan.length}/300</span>
      </div>

      <div className="flex gap-2">
        <button
          onClick={onBack}
          disabled={loading}
          className="flex-1 px-4 py-2.5 rounded-xl border border-[#e8e8f0] bg-white text-[#555] text-sm font-semibold cursor-pointer hover:border-[#0A66C2] disabled:cursor-not-allowed"
        >
          ← Kembali
        </button>
        <button
          onClick={onSubmit}
          disabled={loading}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border-none bg-[#A32D2D] text-white text-sm font-semibold cursor-pointer hover:bg-[#8a2424] disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? <><Spinner /> Membatalkan…</> : "Konfirmasi Pembatalan"}
        </button>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════
   BANNER KONFIRMASI (di dalam detail panel card)
════════════════════════════════════════ */
function BannerKonfirmasiMagang({ lamaran, onOpenModal, sudahKonfirmasiLain }) {
  return (
    <div className="border-l-2 border-[#e8e8f0] pl-3.5 mb-3">
      <div className="text-[13px] font-semibold text-[#1e1e2e] mb-2.5">
        {sudahKonfirmasiLain ? "Penerimaan ini belum dapat dikonfirmasi" : "Kamu diterima sebagai peserta magang"}
      </div>
      <div className="flex gap-2 flex-wrap">
        {!sudahKonfirmasiLain && (
          <button
            onClick={(e) => { e.stopPropagation(); onOpenModal(lamaran, false); }}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg border-none bg-[#0A66C2] text-white text-xs font-semibold cursor-pointer hover:opacity-85"
          >
            <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
            Konfirmasi
          </button>
        )}
        <button
          onClick={(e) => { e.stopPropagation(); onOpenModal(lamaran, sudahKonfirmasiLain); }}
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-[#e8e8f0] bg-white text-[#9898b0] text-xs font-semibold cursor-pointer hover:border-[#0A66C2] hover:text-[#0A66C2]"
        >
          Batalkan Pendaftaran
        </button>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════
   BANNER SUDAH TERKONFIRMASI (readonly, minimalis)
════════════════════════════════════════ */
function BannerSudahKonfirmasi({ lamaran }) {
  return (
    <div className="border-l-2 border-[#0A66C2/40] pl-3.5 mb-3">
      <div className="text-[13px] font-semibold text-[#0A66C2]">Magang Terkonfirmasi</div>
      <div className="text-[12px] text-[#9898b0] mt-0.5">
        Bergabung di {lamaran?.lowongan?.perusahaan?.nama ?? "perusahaan ini"}
      </div>
    </div>
  );
}

/* ════════════════════════════════════════
   INFO STATUS (pengganti NotifBanner, minimalis tanpa warna alert)
════════════════════════════════════════ */
const STATUS_TEXT = {
  BERKAS_DITERIMA:       "Berkas disetujui, lanjut ke tahap interview.",
  BERKAS_DITOLAK:        "Berkas belum lolos seleksi.",
  INTERVIEW_DIJADWALKAN: "Interview telah dijadwalkan.",
  LOLOS_INTERVIEW:       "Lolos tahap interview.",
  TIDAK_LOLOS_INTERVIEW: "Belum lolos tahap interview.",
  DITOLAK:               "Belum lolos pada tahap seleksi ini.",
};

function InfoStatus({ status }) {
  const text = STATUS_TEXT[status];
  if (!text) return null;
  return <div className="text-[12.5px] text-[#9898b0] mb-3">{text}</div>;
}

/* ════════════════════════════════════════
   JADWAL INTERVIEW CARD
════════════════════════════════════════ */
function JadwalInterviewCard({ jadwal }) {
  if (!jadwal) return null;
  const tanggalFmt = jadwal.tanggal
    ? new Date(jadwal.tanggal).toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" })
    : "-";
  return (
    <div className="border-l-2 border-[#e8e8f0] pl-3.5 mt-2">
      <div className="font-mono text-[10px] font-semibold text-[#9898b0] mb-2 tracking-[0.14em] uppercase">Detail Jadwal Interview</div>
      <div className="grid grid-cols-2 gap-x-6 gap-y-1.5">
        {[
          ["Tanggal", tanggalFmt],
          ["Jam", jadwal.jam ? jadwal.jam + " WIB" : "-"],
          ["Lokasi", jadwal.lokasi || "-"],
          jadwal.linkMeeting ? ["Link Meeting", jadwal.linkMeeting] : null,
        ].filter(Boolean).map(([k, v]) => (
          <div key={k}>
            <div className="font-mono text-[10px] text-[#b0b0c8] mb-0.5 uppercase tracking-wide">{k}</div>
            <div className="text-xs font-semibold text-[#2a2a4a]">{v}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ════════════════════════════════════════
   HELPERS
════════════════════════════════════════ */
function parseTags(raw) {
  if (!raw) return [];
  if (Array.isArray(raw)) return raw;
  try { return JSON.parse(raw); } catch { return [raw]; }
}

function formatTanggal(iso) {
  return new Date(iso).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" }).toUpperCase();
}

function getLogoInitial(nama = "") { return nama.slice(0, 2).toUpperCase() || "?"; }

const LOGO_PALETTES = [
  { bg: "bg-[#EFF6FF] text-[#0A66C2] border border-[#0A66C2]/20" },
  { bg: "bg-[#0A66C2]/5 text-[#0A66C2] border border-[#0A66C2]/15" },
  { bg: "bg-[#E6F1FB] text-[#185FA5] border border-[#185FA5]/20" },
  { bg: "bg-[#0A66C2]/10 text-[#0A66C2] border border-[#0A66C2]/20" },
  { bg: "bg-[#EFF6FF] text-[#0A66C2]" },
  { bg: "bg-[#E6F1FB] text-[#0A66C2]" },
];
function getLogoPalette(nama = "") {
  return LOGO_PALETTES[nama.charCodeAt(0) % LOGO_PALETTES.length].bg;
}

/* ════════════════════════════════════════
   APP CARD (disederhanakan: border kiri, tanpa shadow, tanpa badge peringatan)
════════════════════════════════════════ */
function AppCard({ lamaran, onHapus, onOpenKonfirmasi, sudahKonfirmasiGlobal }) {
  const [open, setOpen] = useState(false);

  const posisi      = lamaran.lowongan?.posisi ?? "—";
  const namaPerush  = lamaran.lowongan?.perusahaan?.nama ?? "—";
  const lokasi      = lamaran.lowongan?.lokasi ?? "—";
  const tipeKerja   = lamaran.lowongan?.tipeKerja ?? lamaran.lowongan?.tipe ?? "—";
  const gaji        = lamaran.lowongan?.gaji ?? "—";
  const tags        = parseTags(lamaran.lowongan?.tags ?? []);
  const status      = lamaran.status ?? "PENDING_BERKAS";
  const tanggal     = formatTanggal(lamaran.createdAt);
  const jadwal      = lamaran.jadwalInterview ?? null;
  const logoClass   = getLogoPalette(namaPerush);
  const logoInitial = getLogoInitial(namaPerush);

  const isDiterimaMagang   = status === "DITERIMA_MAGANG";
  const isKonfirmasiDone   = status === "KONFIRMASI_DITERIMA";

  // Lamaran ini butuh konfirmasi, tapi sudah ada yg dikonfirmasi di tempat lain
  const perluKonfirmasiTapiTerhalang = isDiterimaMagang && sudahKonfirmasiGlobal;

  // Aksen garis kiri sesuai status — pengganti shadow/top-stripe
  const accentColor = isKonfirmasiDone
    ? "#0A66C2"
    : isDiterimaMagang
    ? "#0A66C2"
    : "#e8e8f0";

  // Tombol delete/batal
  const isFinalStatus = ["KONFIRMASI_DITERIMA", "DITOLAK", "BERKAS_DITOLAK", "TIDAK_LOLOS_INTERVIEW"].includes(status);

  return (
    <div
      onClick={() => setOpen(!open)}
      className="bg-white rounded-xl overflow-hidden cursor-pointer border border-[#e8e8f0] transition-colors duration-150"
      style={{ borderLeft: `3px solid ${accentColor}` }}
    >
      {/* Header */}
      <div className="flex items-center gap-4 px-5 py-4">
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-[14px] font-bold flex-shrink-0 ${logoClass}`}>
          {logoInitial}
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-[14px] font-semibold text-[#1e1e2e]">{posisi}</div>
          <div className="text-xs text-[#9898b0] mt-0.5">{namaPerush} · {lokasi}</div>
        </div>
        <div className="flex flex-col items-end gap-2 flex-shrink-0">
          <div className="flex items-center gap-2">
            <StatusBadge status={status} />
            <svg className={`w-4 h-4 text-[#b0b0c8] transition-transform duration-200 ${open ? "rotate-180" : ""}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </div>
          <div className="font-mono text-[10.5px] text-[#b0b0c8]">{tanggal}</div>
        </div>
      </div>

      {/* Detail panel */}
      {open && (
        <div className="border-t border-[#f0f0f8] px-5 pt-4 pb-4" onClick={(e) => e.stopPropagation()}>

          {/* Banner sesuai status */}
          {isKonfirmasiDone && <BannerSudahKonfirmasi lamaran={lamaran} />}

          {isDiterimaMagang && (
            <BannerKonfirmasiMagang
              lamaran={lamaran}
              onOpenModal={onOpenKonfirmasi}
              sudahKonfirmasiLain={sudahKonfirmasiGlobal}
            />
          )}

          {!isDiterimaMagang && !isKonfirmasiDone && <InfoStatus status={status} />}

          {/* Full stepper */}
          <div className="mb-3.5">
            <StepperFull status={status} />
          </div>

          {/* Interview jadwal */}
          {["INTERVIEW_DIJADWALKAN", "LOLOS_INTERVIEW", "TIDAK_LOLOS_INTERVIEW"].includes(status) && (
            <JadwalInterviewCard jadwal={jadwal} />
          )}

          {/* Detail grid */}
          <div className="grid grid-cols-2 gap-x-8 mt-3">
            {[
              { label: "Tipe Pekerjaan",   value: tipeKerja },
              { label: "Estimasi Gaji",    value: formatRupiah(gaji) },
              { label: "Skill Dibutuhkan", value: tags.join(", ") || "—" },
            ].map(({ label, value }) => (
              <div key={label} className="py-2.5 border-b border-[#f0f0f8]">
                <div className="font-mono text-[10px] text-[#9898b0] mb-0.5 uppercase tracking-wide">{label}</div>
                <div className="text-[13px] text-[#1e1e2e] font-medium">{value}</div>
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 mt-4 flex-wrap">
            <button className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold bg-white border border-[#e8e8f0] rounded-lg text-[#555] cursor-pointer hover:border-[#0A66C2]">
              <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                <polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
              </svg>
              Lihat Lowongan
            </button>

            {!isKonfirmasiDone && !isFinalStatus && (
              <button
                onClick={() => onHapus(lamaran.id)}
                className="ml-auto flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold bg-white border border-[#e8e8f0] rounded-lg text-[#9898b0] cursor-pointer hover:border-[#0A66C2] hover:text-[#0A66C2] transition-colors"
              >
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="3 6 5 6 21 6"/>
                  <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                  <path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/>
                </svg>
                Batalkan Pendaftaran
              </button>
            )}

            {isFinalStatus && !isKonfirmasiDone && (
              <button
                onClick={() => onHapus(lamaran.id)}
                className="ml-auto flex items-center gap-1.5 px-3 py-2 text-xs bg-white border border-[#e8e8f0] rounded-lg text-[#9898b0] cursor-pointer hover:border-[#0A66C2] hover:text-[#0A66C2] transition-colors"
              >
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="3 6 5 6 21 6"/>
                  <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                  <path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/>
                </svg>
                Hapus
              </button>
            )}

            {isKonfirmasiDone && (
              <div className="ml-auto text-xs text-[#b0b0c8]">Tidak dapat dibatalkan</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/* ════════════════════════════════════════
   BANNER PROFIL TIDAK LENGKAP (minimalis)
════════════════════════════════════════ */
function BannerProfilTidakLengkap({ alasan }) {
  const pesan = {
    BELUM_LOGIN:           "Kamu belum login. Silakan login untuk melihat lamaran.",
    PROFIL_BELUM_DIBUAT:   "Profil mahasiswamu belum dibuat. Lengkapi profil terlebih dahulu.",
    PROFIL_TIDAK_LENGKAP:  "Profil mahasiswamu belum lengkap (NIM, program studi, dan nomor telepon wajib diisi).",
  }[alasan] || "Profil belum lengkap.";

  return (
    <div className="border-l-2 border-[#e8e8f0] pl-4 mb-5">
      <div className="text-[13px] text-[#4a4a6a]">{pesan}</div>
      <a href="/profile" className="inline-block mt-1 text-[12px] font-semibold text-[#0A66C2] hover:underline">
        Lengkapi Profil →
      </a>
    </div>
  );
}

/* ════════════════════════════════════════
   SUMMARY STATS
════════════════════════════════════════ */
function SummaryStats({ data }) {
  const total    = data.length;
  const proses   = data.filter(a => ["BERKAS_DITERIMA","INTERVIEW_DIJADWALKAN","LOLOS_INTERVIEW","PENDING_BERKAS"].includes(a.status)).length;
  const diterima = data.filter(a => ["DITERIMA_MAGANG","KONFIRMASI_DITERIMA"].includes(a.status)).length;
  const ditolak  = data.filter(a => ["DITOLAK","BERKAS_DITOLAK","TIDAK_LOLOS_INTERVIEW"].includes(a.status)).length;

  const items = [
    { label: "Total Lamaran", value: total,    sub: "Semua status",     accent: "#0A66C2",
      icon: <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></svg> },
    { label: "Sedang Proses", value: proses,   sub: "Menunggu hasil",   accent: "#0A66C2",
      icon: <IconClock className="w-3.5 h-3.5" /> },
    { label: "Diterima",      value: diterima, sub: "Lolos seleksi",    accent: "#0A66C2",
      icon: <IconCheckCircle className="w-3.5 h-3.5" /> },
    { label: "Ditolak",       value: ditolak,  sub: "Tidak lolos",      accent: "#0A66C2",
      icon: <IconXCircle className="w-3.5 h-3.5" /> },
  ];

  return (
    <div className="grid grid-cols-4 max-[900px]:grid-cols-1 bg-white border border-[#e8e8f0] rounded-xl overflow-hidden mb-5">
      {items.map((s, i) => (
        <div
          key={i}
          className="px-6 py-5 flex flex-col gap-2 border-r border-dashed border-[#e8e8f0] last:border-r-0 max-[900px]:border-r-0 max-[900px]:border-b max-[900px]:border-dashed max-[900px]:last:border-b-0"
        >
          <div className="flex items-center gap-1.5">
            <span style={{ color: s.accent }}>{s.icon}</span>
            <span className="font-mono text-[10px] uppercase tracking-[0.14em] font-semibold" style={{ color: s.accent }}>
              {s.label}
            </span>
          </div>
          <span className="font-display text-[32px] font-semibold leading-none tracking-tight text-[#1e1e2e]">
            {s.value}
          </span>
          <span className="text-[11px] text-[#9898b0]">{s.sub}</span>
        </div>
      ))}
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="bg-white border border-[#e8e8f0] rounded-xl p-4 px-5">
      {[200, 140, 100].map((w, i) => (
        <div key={i} className="rounded-md animate-pulse bg-gradient-to-r from-[#f0f0f8] via-[#e8e8f0] to-[#f0f0f8]"
          style={{ height: i === 0 ? 16 : 12, width: w, marginTop: i === 0 ? 0 : 8 }} />
      ))}
    </div>
  );
}

/* ════════════════════════════════════════
   MAIN PAGE
════════════════════════════════════════ */
const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000";

export default function DaftarLamaranPage() {
  const [lamaran,        setLamaran]        = useState([]);
  const [loading,        setLoading]        = useState(true);
  const [error,          setError]          = useState(null);
  const [filter,         setFilter]         = useState("all");
  const [search,         setSearch]         = useState("");
  const [modalLamaran,   setModalLamaran]   = useState(null);
  const [modalIsLocked,  setModalIsLocked]  = useState(false); // sudah konfirmasi di lain
  const [toast,          setToast]          = useState(null);

  // Meta dari server
  const [sudahKonfirmasi,  setSudahKonfirmasi]  = useState(false);
  const [profileLengkap,   setProfileLengkap]   = useState(true);
  const [profileAlasan,    setProfileAlasan]     = useState(null); // untuk banner

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setProfileAlasan("BELUM_LOGIN");
      setLoading(false);
      return;
    }
    fetch(`${API_BASE}/api/lamaran/mahasiswa`, {
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    })
      .then(res => { if (!res.ok) throw new Error(`HTTP ${res.status}`); return res.json(); })
      .then(result => {
        setLamaran(result.data ?? []);
        const meta = result.meta ?? {};
        setSudahKonfirmasi(meta.sudahKonfirmasi ?? false);
        const lengkap = meta.profileLengkap ?? true;
        setProfileLengkap(lengkap);
        if (!lengkap) setProfileAlasan("PROFIL_TIDAK_LENGKAP");
        setLoading(false);
      })
      .catch(err => {
        console.error("Gagal mengambil data lamaran:", err);
        setError("Gagal memuat data. Pastikan Anda sudah login.");
        setLoading(false);
      });
  }, []);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const handleHapus = async (id) => {
    const target = lamaran.find(l => l.id === id);
    if (!confirm("Batalkan / hapus lamaran ini?")) return;
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`${API_BASE}/api/lamaran/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) {
        showToast(data.message || "Gagal menghapus.", "error");
        return;
      }
      setLamaran(prev => prev.filter(l => l.id !== id));
      showToast("Lamaran berhasil dihapus.", "info");
    } catch {
      showToast("Gagal menghapus lamaran.", "error");
    }
  };

  /* Buka modal konfirmasi */
  const handleOpenKonfirmasi = (lmr, isLocked) => {
    setModalLamaran(lmr);
    setModalIsLocked(isLocked ?? sudahKonfirmasi);
  };

  /* Konfirmasi → terima */
  const handleKonfirmasi = async (id) => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`${API_BASE}/api/lamaran/${id}/konfirmasi`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ konfirmasi: true }),
      });
      const data = await res.json();
      if (!res.ok) {
        showToast(data.message || "Gagal mengkonfirmasi.", "error");
        return;
      }
      // Update lamaran lokal: yang ini jadi KONFIRMASI_DITERIMA,
      // yang lain DITERIMA_MAGANG → DITOLAK
      setLamaran(prev =>
        prev.map(l => {
          if (l.id === id) return { ...l, status: "KONFIRMASI_DITERIMA" };
          if (l.status === "DITERIMA_MAGANG") return { ...l, status: "DITOLAK" };
          return l;
        })
      );
      setSudahKonfirmasi(true);
      setModalLamaran(null);
      showToast("Konfirmasi berhasil! Selamat bergabung sebagai peserta magang.", "success");
    } catch {
      showToast("Gagal mengkonfirmasi. Coba lagi.", "error");
    }
  };

  /* Batalkan dari modal (dengan alasan) */
  const handleBatalkanDariModal = async (id, alasanBatal) => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`${API_BASE}/api/lamaran/${id}/konfirmasi`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ konfirmasi: false, alasanBatal }),
      });
      const data = await res.json();
      if (!res.ok) {
        showToast(data.message || "Gagal membatalkan.", "error");
        return;
      }
      setLamaran(prev => prev.map(l => l.id === id ? { ...l, status: "DITOLAK" } : l));
      setModalLamaran(null);
      showToast("Pendaftaran berhasil dibatalkan.", "info");
    } catch {
      showToast("Gagal membatalkan pendaftaran.", "error");
    }
  };

  const filtered = lamaran.filter(l => {
    const matchStatus = filter === "all" || l.status === filter;
    const posisi = l.lowongan?.posisi?.toLowerCase() ?? "";
    const perush  = l.lowongan?.perusahaan?.nama?.toLowerCase() ?? "";
    const q       = search.toLowerCase();
    return matchStatus && (q === "" || posisi.includes(q) || perush.includes(q));
  });

  const sorted = [...filtered].sort((a, b) => {
    const priority = (s) =>
      s === "KONFIRMASI_DITERIMA" ? 0
      : s === "DITERIMA_MAGANG"   ? 1
      : 2;
    return priority(a.status) - priority(b.status);
  });

  return (
    <div className="flex-1 bg-[#f7f7fb] min-h-screen font-sans">
      <style>{FONTS}</style>

      {/* Toast */}
      {toast && (
        <div className={`fixed top-5 right-5 z-[200] px-5 py-3 rounded-xl text-white text-[13px] font-semibold shadow-lg max-w-[360px] animate-[slideIn_0.25s_ease] ${
          toast.type === "success" ? "bg-[#0A66C2]" : toast.type === "error" ? "bg-[#A32D2D]" : "bg-[#0A66C2]"
        }`}>
          <style>{`@keyframes slideIn { from { opacity:0; transform:translateX(20px); } to { opacity:1; transform:translateX(0); } }`}</style>
          {toast.msg}
        </div>
      )}

      {/* Modal */}
      {modalLamaran && (
        <ModalKonfirmasiMagang
          lamaran={modalLamaran}
          onConfirm={handleKonfirmasi}
          onCancel={handleBatalkanDariModal}
          onClose={() => setModalLamaran(null)}
          sudahKonfirmasiLain={modalIsLocked}
        />
        )}

      <Topbar
        icon={
          <svg className="w-4.5 h-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
            <polyline points="14 2 14 8 20 8"/>
            <line x1="16" y1="13" x2="8" y2="13"/>
            <line x1="16" y1="17" x2="8" y2="17"/>
            <polyline points="10 9 9 9 8 9"/>
          </svg>
        }
        title="Daftar Lamaran Saya"
        subtitle="Pantau status dan progres setiap lamaran magang kamu"
        rightSlot={
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 border border-[#0A66C2]/40 rounded-xl text-[#0A66C2] text-[12.5px] font-semibold bg-transparent transition-all duration-150 hover:bg-[#0958A8] hover:text-white hover:border-[#0A66C2] cursor-pointer">
              <div className="w-6 h-6 rounded-lg bg-[#0A66C2]/10 border border-[#0A66C2]/20 flex items-center justify-center flex-shrink-0">
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 9.5L12 3l9 6.5"/>
                  <path d="M5 9v11a1 1 0 0 0 1 1h3v-7h6v7h3a1 1 0 0 0 1-1V9"/>
                </svg>
              </div>
              Back to homepage
            </button>
          </div>
        }
      />
      {/* Content */}
      <div className=" px-8 py-7">

        {/* Banner: profil tidak lengkap */}
        {profileAlasan && <BannerProfilTidakLengkap alasan={profileAlasan} />}

        <SummaryStats data={lamaran} />

        {error && (
          <div className="border-l-2 border-[#A32D2D] pl-4 py-1 text-[#A32D2D] text-[13px] mb-4">{error}</div>
        )}

        {/* Search + filter */}
        <div className="bg-white border border-[#e8e8f0] rounded-xl px-5 py-3.5 mb-4 flex gap-3 items-center flex-wrap">
          <div className="flex-1 min-w-[200px] relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-[15px] h-[15px] text-[#b0b0c8]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input
              type="text"
              placeholder="Cari posisi atau nama perusahaan…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 border border-[#e8e8f0] rounded-lg text-[13px] text-[#1e1e2e] bg-[#f7f7fb] outline-none focus:border-[#0A66C2] transition-colors"
            />
          </div>
          <div className="w-px h-7 bg-[#e8e8f0] flex-shrink-0" />
          <div className="flex gap-1.5 flex-wrap">
            {FILTER_OPTIONS.map(({ value, label }) => (
              <button
                key={value}
                onClick={() => setFilter(value)}
                className={`px-3.5 py-1.5 text-xs rounded-full border transition-all whitespace-nowrap ${
                  filter === value
                    ? "font-semibold border-[#0A66C2] bg-[#EFF6FF] text-[#0A66C2]"
                    : "font-normal border-[#e8e8f0] bg-transparent text-[#9898b0] hover:border-[#0A66C2] hover:text-[#0A66C2]"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="font-mono text-[10.5px] uppercase tracking-wide text-[#b0b0c8] mb-3 pl-0.5">
          Menampilkan <strong className="text-[#0A66C2]">{sorted.length}</strong> lamaran
          {filter !== "all" && ` · Filter: ${FILTER_OPTIONS.find(f => f.value === filter)?.label}`}
        </div>

        {loading ? (
          <div className="flex flex-col gap-2.5">{[1,2,3].map(i => <SkeletonCard key={i} />)}</div>
        ) : sorted.length === 0 ? (
          <div className="text-center py-16 text-[#9898b0] text-[13px] bg-white rounded-xl border border-[#e8e8f0]">
            <svg className="w-10 h-10 mx-auto mb-3 text-[#d0d0e8]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
            </svg>
            {lamaran.length === 0
              ? "Kamu belum memiliki lamaran. Yuk, mulai melamar!"
              : "Tidak ada lamaran yang cocok dengan pencarian kamu"}
          </div>
        ) : (
          <div className="flex flex-col gap-2.5">
            {sorted.map(l => (
              <AppCard
                key={l.id}
                lamaran={l}
                onHapus={handleHapus}
                onOpenKonfirmasi={handleOpenKonfirmasi}
                sudahKonfirmasiGlobal={sudahKonfirmasi && l.status !== "KONFIRMASI_DITERIMA"}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
