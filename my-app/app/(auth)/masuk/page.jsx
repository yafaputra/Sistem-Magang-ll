"use client";

import { useState, useCallback, Suspense } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { login, register } from "@/services/auth.service";

/* ─── Toast ─────────────────────────────────────────────────────── */
const TOAST_STYLE = {
  success: {
    bg: "rgba(255, 255, 255, 0.95)",
    border: "rgba(34, 197, 94, 0.2)",
    color: "#16a34a",
    iconBg: "rgba(240, 253, 244, 0.95)",
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
      </svg>
    ),
    title: "Berhasil",
  },
  error: {
    bg: "rgba(255, 255, 255, 0.95)",
    border: "rgba(239, 68, 68, 0.2)",
    color: "#dc2626",
    iconBg: "rgba(254, 242, 242, 0.95)",
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
      </svg>
    ),
    title: "Gagal",
  },
  info: {
    bg: "rgba(255, 255, 255, 0.95)",
    border: "rgba(59, 130, 246, 0.2)",
    color: "#2563eb",
    iconBg: "rgba(239, 246, 255, 0.95)",
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: "Info",
  },
};

let _tid = 0;

function ToastContainer({ toasts, onDismiss }) {
  if (!toasts.length) return null;
  return (
    <div className="fixed top-6 right-6 z-[9999] flex flex-col gap-3 pointer-events-none" style={{ width: 340 }}>
      <style>{`
        @keyframes tIn  { from{opacity:0;transform:translateX(50px) scale(.95)} to{opacity:1;transform:translateX(0) scale(1)} }
        @keyframes tOut { from{opacity:1;transform:translateX(0) scale(1)} to{opacity:0;transform:translateX(15px) scale(.95)} }
      `}</style>
      {toasts.map((t) => {
        const s = TOAST_STYLE[t.type] || TOAST_STYLE.info;
        return (
          <div
            key={t.id}
            className="flex items-start gap-4 px-5 py-4 rounded-2xl border pointer-events-auto backdrop-blur-md shadow-[0_12px_36px_-6px_rgba(0,0,0,0.08)] transition-all duration-300 bg-white"
            style={{
              background: s.bg,
              borderColor: s.border,
              animation: `${t.leaving ? "tOut" : "tIn"} 0.32s cubic-bezier(0.34, 1.56, 0.64, 1) forwards`,
            }}
          >
            {/* Circular icon badge */}
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: s.iconBg, color: s.color }}
            >
              {s.icon}
            </div>

            {/* Content text */}
            <div className="flex-1 pt-0.5 min-w-0">
              <h4 className="text-[11px] font-black text-slate-800 tracking-wider uppercase mb-0.5 leading-none">
                {s.title}
              </h4>
              <p className="text-slate-500 text-[12.5px] font-semibold leading-relaxed break-words">
                {t.msg}
              </p>
            </div>

            {/* Dismiss button */}
            <button
              onClick={() => onDismiss(t.id)}
              className="flex-shrink-0 opacity-40 hover:opacity-100 transition-opacity bg-transparent border-none cursor-pointer text-slate-400 hover:text-slate-600 flex items-center justify-center w-5 h-5 rounded-full hover:bg-slate-100"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        );
      })}
    </div>
  );
}

function useToast() {
  const [toasts, setToasts] = useState([]);
  const dismiss = useCallback((id) => {
    setToasts((p) => p.map((t) => (t.id === id ? { ...t, leaving: true } : t)));
    setTimeout(() => setToasts((p) => p.filter((t) => t.id !== id)), 280);
  }, []);
  const toast = useCallback((type, msg, dur = 3500) => {
    const id = ++_tid;
    setToasts((p) => [...p, { id, type, msg }]);
    setTimeout(() => dismiss(id), dur);
  }, [dismiss]);
  return { toasts, toast, dismiss };
}

/* ─── Icons ──────────────────────────────────────────────────────── */
const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
    <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 01-1.796 2.717v2.258h2.908C16.658 14.251 17.64 11.943 17.64 9.2z" fill="#4285F4" />
    <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853" />
    <path d="M3.964 10.707A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.707V4.961H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.039l3.007-2.332z" fill="#FBBC05" />
    <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.961L3.964 7.293C4.672 5.166 6.656 3.58 9 3.58z" fill="#EA4335" />
  </svg>
);

const EyeIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const EyeOffIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
    <line x1="1" y1="1" x2="23" y2="23" />
  </svg>
);

const IconAlertCircle = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="12" />
    <line x1="12" y1="16" x2="12.01" y2="16" />
  </svg>
);

/* ─── Password Strength ──────────────────────────────────────────── */
function getPasswordStrength(password) {
  if (!password) return null;
  let score = 0;
  if (password.length >= 8)          score++;
  if (/[A-Z]/.test(password))        score++;
  if (/[0-9]/.test(password))        score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  const levels = [
    { label: "Lemah", color: "#ef4444" },
    { label: "Cukup", color: "#f97316" },
    { label: "Baik",  color: "#eab308" },
    { label: "Kuat",  color: "#22c55e" },
  ];
  return { score, ...levels[Math.max(0, score - 1)] };
}

function PasswordStrengthBar({ password }) {
  const strength = getPasswordStrength(password);
  if (!strength) return null;
  const hints = [
    { ok: password.length >= 8,          text: "8+ karakter" },
    { ok: /[A-Z]/.test(password),        text: "Kapital" },
    { ok: /[0-9]/.test(password),        text: "Angka" },
    { ok: /[^A-Za-z0-9]/.test(password), text: "Simbol" },
  ];
  return (
    <div className="mt-2">
      <div className="flex items-center gap-2">
        <div className="flex gap-1 flex-1">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-1 rounded-full flex-1 transition-all duration-300"
              style={{ background: i <= strength.score ? strength.color : "#e2e8f0" }} />
          ))}
        </div>
        <span className="text-[11px] font-bold min-w-[34px] text-right" style={{ color: strength.color }}>
          {strength.label}
        </span>
      </div>
      <div className="flex gap-1.5 mt-1.5 flex-wrap">
        {hints.map((h) => (
          <span key={h.text} className="text-[10.5px] px-2 py-0.5 rounded-full font-medium transition-all duration-200"
            style={{
              background: h.ok ? strength.color + "18" : "#f1f5f9",
              color: h.ok ? strength.color : "#94a3b8",
              border: `1px solid ${h.ok ? strength.color + "40" : "#e2e8f0"}`,
            }}>
            {h.ok ? "✓ " : ""}{h.text}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ─── InputField wrapper ─────────────────────────────────────────── */
function InputField({ label, required, error, hint, children }) {
  return (
    <div className="mb-3.5">
      <label className="block text-[13px] font-semibold text-slate-700 mb-1.5">
        {label}
        {required && <span className="text-red-400 ml-0.5">*</span>}
      </label>
      {children}
      {hint && !error && <p className="mt-1 text-[11.5px] text-slate-400">{hint}</p>}
      {error && (
        <p className="mt-1 text-[11.5px] text-red-500 flex items-center gap-1">
          <IconAlertCircle />
          {error}
        </p>
      )}
    </div>
  );
}

function inputCls(hasError) {
  return `w-full px-3.5 py-[11px] text-[13.5px] border rounded-lg outline-none text-slate-800 bg-white placeholder-slate-300 transition-all ${
    hasError
      ? "border-red-300 focus:border-red-400 focus:ring-2 focus:ring-red-100"
      : "border-slate-200 focus:border-sky-300 focus:ring-2 focus:ring-sky-100"
  }`;
}

/* ─── Register Form — Mahasiswa only, 2 step ─────────────────────── */
/*
  STEP 1: Nama lengkap + Email
  STEP 2: Password + Konfirmasi password
*/
function RegisterForm({ onSuccess, toast }) {
  const [step, setStep]           = useState(1);
  const [name, setName]           = useState("");
  const [email, setEmail]         = useState("");
  const [password, setPassword]   = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [showPw, setShowPw]       = useState(false);
  const [showCPw, setShowCPw]     = useState(false);
  const [errors, setErrors]       = useState({});
  const [loading, setLoading]     = useState(false);

  const clearError = (field) =>
    setErrors((prev) => { const n = { ...prev }; delete n[field]; return n; });

  const validateStep = (s) => {
    const errs = {};
    if (s === 1) {
      if (!name.trim()) errs.name = "Nama tidak boleh kosong.";
      if (!email.trim()) errs.email = "Email tidak boleh kosong.";
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.email = "Format email tidak valid.";
    }
    if (s === 2) {
      if (!password)                    errs.password = "Password tidak boleh kosong.";
      else if (password.length < 8)     errs.password = "Minimal 8 karakter.";
      else if (!/[A-Z]/.test(password)) errs.password = "Harus ada huruf kapital.";
      else if (!/[0-9]/.test(password)) errs.password = "Harus ada angka.";

      if (!confirmPw)                   errs.confirmPw = "Konfirmasi password wajib diisi.";
      else if (password !== confirmPw)  errs.confirmPw = "Password tidak cocok.";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const nextStep = () => { if (validateStep(step)) setStep((s) => s + 1); };
  const prevStep = () => setStep((s) => s - 1);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep(2)) return;

    setLoading(true);
    try {
      const data = await register(name, email, password, "mahasiswa");

      if (data.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
      }

      toast("success", "Akun berhasil dibuat! Mengarahkan ke dashboard...");
      setTimeout(() => onSuccess(data.user?.role ?? "mahasiswa", data.token, data.user), 900);
    } catch (err) {
      if (err.message?.toLowerCase().includes("email")) {
        setErrors({ email: err.message });
        setStep(1);
      }
      toast("error", err.message || "Registrasi gagal, coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col justify-center py-4">
      {/* Badge */}
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-3"
        style={{ background: "#e0f2fe", border: "1px solid #bae6fd", width: "fit-content" }}>
        <span style={{ width: 7, height: 7, borderRadius: "50%", background: "var(--color-brand-primary)", display: "inline-block" }} />
        <span style={{ fontSize: 11, fontWeight: 700, color: "var(--color-brand-secondary)", letterSpacing: "0.10em", textTransform: "uppercase" }}>
          Langkah {step} dari 2
        </span>
      </div>

      <h2 className="text-[24px] font-extrabold text-slate-900 leading-snug mb-1">
        {step === 1 && <>Data <em className="not-italic italic text-sky-500">diri</em></>}
        {step === 2 && <>Buat <em className="not-italic italic text-sky-500">password</em></>}
      </h2>
      <p className="text-[13px] text-slate-400 mb-5">
        {step === 1 && "Masukkan nama lengkap dan email aktifmu."}
        {step === 2 && "Buat password yang kuat untuk mengamankan akunmu."}
      </p>

      <form onSubmit={handleSubmit} noValidate>

        {/* ── STEP 1 — Nama & Email ── */}
        {step === 1 && (
          <>
            <InputField label="Nama Lengkap" required error={errors.name}>
              <input
                type="text"
                placeholder="Masukkan nama lengkap"
                value={name}
                onChange={(e) => { setName(e.target.value); clearError("name"); }}
                className={inputCls(errors.name)}
              />
            </InputField>

            <InputField label="Email" required error={errors.email} hint="Digunakan untuk login dan notifikasi.">
              <input
                type="email"
                placeholder="nama@email.com"
                value={email}
                onChange={(e) => { setEmail(e.target.value); clearError("email"); }}
                className={inputCls(errors.email)}
              />
            </InputField>
          </>
        )}

        {/* ── STEP 2 — Password ── */}
        {step === 2 && (
          <>
            <InputField label="Password" required error={errors.password}>
              <div className="relative">
                <input
                  type={showPw ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); clearError("password"); }}
                  className={inputCls(errors.password)}
                  style={{ paddingRight: "2.75rem" }}
                />
                <button type="button" onClick={() => setShowPw((v) => !v)} tabIndex={-1}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors bg-transparent border-none cursor-pointer p-0 flex items-center">
                  {showPw ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              </div>
              <PasswordStrengthBar password={password} />
            </InputField>

            <InputField label="Konfirmasi Password" required error={errors.confirmPw}>
              <div className="relative">
                <input
                  type={showCPw ? "text" : "password"}
                  placeholder="••••••••"
                  value={confirmPw}
                  onChange={(e) => { setConfirmPw(e.target.value); clearError("confirmPw"); }}
                  className={inputCls(errors.confirmPw)}
                  style={{ paddingRight: "2.75rem" }}
                />
                <button type="button" onClick={() => setShowCPw((v) => !v)} tabIndex={-1}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors bg-transparent border-none cursor-pointer p-0 flex items-center">
                  {showCPw ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              </div>
            </InputField>
          </>
        )}

        {/* ── Navigasi Step ── */}
        <div className="flex gap-3 mt-2">
          {step > 1 && (
            <button type="button" onClick={prevStep}
              className="flex-1 py-[11px] bg-white hover:bg-slate-50 text-slate-700 font-bold text-sm rounded-lg border border-slate-200 hover:border-slate-300 cursor-pointer transition-all">
              ← Kembali
            </button>
          )}

          {step < 2 ? (
            <button type="button" onClick={nextStep}
              className="flex-1 py-[11px] bg-sky-400 hover:bg-sky-500 active:scale-[0.99] text-white font-bold text-sm rounded-lg cursor-pointer tracking-wide transition-all">
              Lanjut →
            </button>
          ) : (
            <button type="submit" disabled={loading}
              className="flex-1 py-[11px] bg-sky-400 hover:bg-sky-500 active:scale-[0.99] text-white font-bold text-sm rounded-lg border-none cursor-pointer tracking-wide transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2">
              {loading ? (
                <>
                  <span className="inline-block w-[14px] h-[14px] rounded-full border-2 border-white/30 border-t-white flex-shrink-0"
                    style={{ animation: "spinBtn 0.7s linear infinite" }} />
                  Mendaftarkan...
                </>
              ) : "Daftar Sekarang"}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

/* ─── Page content (uses useSearchParams — must live inside <Suspense>) ── */
function AuthPageContent() {
  const router       = useRouter();
  const { toasts, toast, dismiss } = useToast();
  const searchParams = useSearchParams();

  const [mode, setMode]           = useState(() => {
    const m = searchParams.get("mode");
    return m === "register" ? "register" : "login";
  });
  const [formState, setFormState] = useState("in");
  const [busy, setBusy]           = useState(false);
  const [loading, setLoading]     = useState(false);
  const [navigating, setNavigating] = useState(false);

  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw]     = useState(false);

  const isLogin = mode === "login";

  const navigateTo = (path) => {
    setNavigating(true);
    setTimeout(() => { router.push(path); }, 300);
  };

  const switchMode = useCallback(() => {
    if (busy) return;
    setBusy(true);
    setFormState(isLogin ? "out-r" : "out-l");
    const nextMode = isLogin ? "register" : "login";
    router.replace(`/masuk?mode=${nextMode}`, { scroll: false });
    setTimeout(() => {
      setMode(nextMode);
      setEmail(""); setPassword(""); setShowPw(false);
      setFormState(isLogin ? "out-l" : "out-r");
      requestAnimationFrame(() =>
        requestAnimationFrame(() => { setFormState("in"); setBusy(false); })
      );
    }, 320);
  }, [busy, isLogin, router]);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email)    { toast("error", "Email tidak boleh kosong."); return; }
    if (!password) { toast("error", "Password tidak boleh kosong."); return; }
    setLoading(true);
    try {
      const data = await login(email, password);

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      const routes = {
        mahasiswa:  "/dashboard-mahasiswa/",
        dosen:      "/dashboard-dosen/",
        admin:      "/dashboard-admin-prodi/",
        perusahaan: "/dashboard-perusahaan/",
      };

      toast("success", "Login berhasil! Mengarahkan ke dashboard...");
      setTimeout(() => navigateTo(routes[data.user.role] || "/"), 900);
    } catch (err) {
      toast("error", err.message || "Tidak bisa terhubung ke server.");
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSuccess = (role, token, user) => {
    if (token) {
      localStorage.setItem("token", token);
      if (user) localStorage.setItem("user", JSON.stringify(user));
    }
    const routes = {
      mahasiswa:  "/dashboard-mahasiswa/",
      dosen:      "/dashboard-dosen/",
      admin:      "/dashboard-admin-prodi/",
      perusahaan: "/dashboard-perusahaan/",
    };
    navigateTo(routes[role] || "/dashboard-mahasiswa/");
  };

  const formSlideClass = {
    "in":    "opacity-100 translate-x-0",
    "out-l": "opacity-0 -translate-x-8",
    "out-r": "opacity-0 translate-x-8",
  }[formState];

  const imageSlideClass = busy ? "opacity-0 scale-95" : "opacity-100 scale-100";

  const inputClsLogin = () =>
    "w-full px-3.5 py-[11px] text-[13.5px] border rounded-lg outline-none text-slate-800 bg-white placeholder-slate-300 transition-all border-slate-200 focus:border-sky-300 focus:ring-2 focus:ring-sky-100";

  return (
    <>
      <ToastContainer toasts={toasts} onDismiss={dismiss} />

      <div className="fixed inset-0 z-[9998] bg-white flex flex-col items-center justify-center gap-4 transition-opacity duration-500"
        style={{ opacity: navigating ? 1 : 0, pointerEvents: navigating ? "all" : "none" }}>
        <div className="w-10 h-10 rounded-full border-[3px] border-sky-100 border-t-sky-400"
          style={{ animation: "spin 0.7s linear infinite" }} />
        <p className="text-[13px] font-semibold text-slate-400">Membuka dashboard...</p>
        <style>{`
          @keyframes spin    { to { transform: rotate(360deg); } }
          @keyframes spinBtn { to { transform: rotate(360deg); } }
        `}</style>
      </div>

      <section className="flex items-center justify-center min-h-screen bg-blue-50 px-6 py-10"
        style={{ fontFamily: "'Plus Jakarta Sans', 'DM Sans', sans-serif" }}>
        <style>{`@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,400;0,500;0,600;0,700;0,800;1,400;1,600;1,700&display=swap');`}</style>

        <div className="w-full max-w-[1050px] flex items-stretch gap-10 bg-white py-6 px-10 rounded-2xl border-2 border-blue-300 overflow-hidden">

          {/* Panel gambar KIRI — Register */}
          {!isLogin && (
            <div className={`w-[500px] min-h-[500px] bg-gradient-to-br from-sky-300 to-sky-400 rounded-[8px_36px_8px_36px] flex items-center justify-center p-8 relative overflow-hidden flex-shrink-0 transition-all duration-500 ease-[cubic-bezier(.4,0,.2,1)] ${imageSlideClass}`}>
              <Image src="/Register-image.png" alt="Ilustrasi daftar" width={650} height={650}
                className="object-contain w-full h-auto relative z-10" />
            </div>
          )}

          {/* Form area */}
          <div className={`flex-1 flex flex-col justify-center transition-all duration-[380ms] ease-[cubic-bezier(.4,0,.2,1)] ${formSlideClass}`}>
            {isLogin ? (
              <>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-3"
                  style={{ background: "#e0f2fe", border: "1px solid #bae6fd", width: "fit-content" }}>
                  <span style={{ width: 7, height: 7, borderRadius: "50%", background: "var(--color-brand-primary)", display: "inline-block" }} />
                  <span style={{ fontSize: 11, fontWeight: 700, color: "var(--color-brand-secondary)", letterSpacing: "0.10em", textTransform: "uppercase" }}>
                    Portal Masuk
                  </span>
                </div>

                <h2 className="text-[26px] font-extrabold text-slate-900 leading-snug mb-1.5">
                  Halo, selamat <em className="not-italic italic font-bold text-sky-500">kembali</em>
                </h2>
                <p className="text-[13.5px] text-slate-400 font-normal mb-5">
                  Masuk untuk melanjutkan — semua yang kamu tinggalkan masih ada di sini.
                </p>

                <form onSubmit={handleLogin}>
                  <div className="mb-3.5">
                    <label className="block text-[13px] font-semibold text-slate-700 mb-1.5">Email</label>
                    <input type="email" placeholder="nama@email.com" value={email}
                      onChange={(e) => setEmail(e.target.value)} className={inputClsLogin()} />
                  </div>

                  <div className="mb-2.5">
                    <label className="block text-[13px] font-semibold text-slate-700 mb-1.5">Password</label>
                    <div className="relative">
                      <input type={showPw ? "text" : "password"} placeholder="••••••••" value={password}
                        onChange={(e) => setPassword(e.target.value)} className={inputClsLogin()}
                        style={{ paddingRight: "2.75rem" }} />
                      <button type="button" onClick={() => setShowPw((v) => !v)} tabIndex={-1}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors bg-transparent border-none cursor-pointer p-0 flex items-center">
                        {showPw ? <EyeOffIcon /> : <EyeIcon />}
                      </button>
                    </div>
                  </div>

                  <div className="flex justify-between items-center mb-[18px] mt-1">
                    <label className="flex items-center gap-1.5 text-[13px] text-slate-500 cursor-pointer select-none">
                      <input type="checkbox" className="w-[15px] h-[15px] accent-sky-400 cursor-pointer" />
                      Ingat saya
                    </label>
                    <a href="#" className="text-[13px] text-slate-600 font-medium no-underline hover:text-sky-400 transition-colors">
                      Lupa password?
                    </a>
                  </div>

                  <button type="submit" disabled={loading || navigating}
                    className="w-full py-[11px] bg-sky-400 hover:bg-sky-500 active:scale-[0.99] text-white font-bold text-sm rounded-lg border-none cursor-pointer tracking-wide transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                    {loading ? (
                      <>
                        <span className="inline-block w-[14px] h-[14px] rounded-full border-2 border-white/30 border-t-white flex-shrink-0"
                          style={{ animation: "spinBtn 0.7s linear infinite" }} />
                        Memproses...
                      </>
                    ) : "Masuk sekarang"}
                  </button>
                </form>

                <div className="flex items-center gap-2.5 text-slate-300 text-xs my-3.5">
                  <span className="flex-1 h-px bg-slate-100" />
                  atau masuk dengan
                  <span className="flex-1 h-px bg-slate-100" />
                </div>

                <button className="w-full py-2.5 bg-white hover:bg-slate-50 text-slate-800 font-bold text-[13.5px] border border-slate-200 hover:border-slate-300 rounded-lg cursor-pointer flex items-center justify-center gap-2.5 transition-all">
                  <GoogleIcon />
                  Lanjutkan dengan Google
                </button>

                <p className="text-[13px] text-slate-400 text-center mt-5">
                  Belum punya akun?{" "}
                  <button type="button" onClick={switchMode}
                    className="text-sky-400 font-bold bg-transparent border-none cursor-pointer hover:text-sky-500 transition-colors p-0 text-[13px]">
                    Daftar sekarang
                  </button>
                </p>
              </>
            ) : (
              <>
                <RegisterForm onSuccess={handleRegisterSuccess} toast={toast} />

                <div className="flex items-center gap-2.5 text-slate-300 text-xs my-3">
                  <span className="flex-1 h-px bg-slate-100" />
                  atau daftar dengan
                  <span className="flex-1 h-px bg-slate-100" />
                </div>

                <button className="w-full py-2.5 bg-white hover:bg-slate-50 text-slate-800 font-bold text-[13.5px] border border-slate-200 hover:border-slate-300 rounded-lg cursor-pointer flex items-center justify-center gap-2.5 transition-all">
                  <GoogleIcon />
                  Lanjutkan dengan Google
                </button>

                <p className="text-[13px] text-slate-400 text-center mt-4">
                  Sudah punya akun?{" "}
                  <button type="button" onClick={switchMode}
                    className="text-sky-400 font-bold bg-transparent border-none cursor-pointer hover:text-sky-500 transition-colors p-0 text-[13px]">
                    Masuk sekarang
                  </button>
                </p>
              </>
            )}
          </div>

          {/* Panel gambar KANAN — Login */}
          {isLogin && (
            <div className={`w-[500px] min-h-[500px] bg-gradient-to-br from-sky-300 to-sky-400 rounded-[36px_8px_36px_8px] flex items-center justify-center p-8 relative overflow-hidden flex-shrink-0 transition-all duration-500 ease-[cubic-bezier(.4,0,.2,1)] ${imageSlideClass}`}>
              <Image src="/Register-image.png" alt="Ilustrasi login" width={650} height={650}
                className="object-contain w-full h-auto relative z-10" />
            </div>
          )}

        </div>
      </section>
    </>
  );
}

/* ─── Page (export default) — wraps content in Suspense for useSearchParams ── */
export default function AuthPage() {
  return (
    <Suspense fallback={null}>
      <AuthPageContent />
    </Suspense>
  );
}