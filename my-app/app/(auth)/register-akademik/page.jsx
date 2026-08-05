"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";

/* ─── Toast ──────────────────────────────────────────────────────── */
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
const EyeIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
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
    <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
  </svg>
);
const IconUserShield = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);
const IconGraduationCap = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 10v6M2 10l10-5 10 5-10 5z" /><path d="M6 12v5c3 3 9 3 12 0v-5" />
  </svg>
);

/* ─── InputField ─────────────────────────────────────────────────── */
function InputField({ label, required, error, children }) {
  return (
    <div className="mb-4">
      <label className="block text-[13px] font-semibold text-slate-700 mb-1.5">
        {label}{required && <span className="text-red-400 ml-0.5">*</span>}
      </label>
      {children}
      {error && (
        <p className="mt-1 text-[11.5px] text-red-500 flex items-center gap-1">
          <IconAlertCircle /> {error}
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

/* ─── Main Page ──────────────────────────────────────────────────── */
export default function RegisterAkademikPage() {
  const router = useRouter();
  const { toasts, toast, dismiss } = useToast();

  const [tipeAkun, setTipeAkun] = useState(""); // "admin" | "dosen"
  const [name, setName]         = useState("");
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw]     = useState(false);
  const [errors, setErrors]     = useState({});
  const [loading, setLoading]   = useState(false);
  const [navigating, setNavigating] = useState(false);

  const clearError = (field) =>
    setErrors((prev) => { const n = { ...prev }; delete n[field]; return n; });

  const validate = () => {
    const errs = {};
    if (!tipeAkun)          errs.tipeAkun = "Pilih tipe akun.";
    if (!name.trim())       errs.name     = "Nama tidak boleh kosong.";
    if (!email.trim())      errs.email    = "Email tidak boleh kosong.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.email = "Format email tidak valid.";
    if (!password)          errs.password = "Password tidak boleh kosong.";
    else if (password.length < 8) errs.password = "Minimal 8 karakter.";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const navigateTo = (path) => {
    setNavigating(true);
    setTimeout(() => router.push(path), 300);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, role: tipeAkun === "dosen" ? "dosen" : "admin" }),
      });
      const data = await res.json();

      if (!res.ok) {
        if (data.message?.toLowerCase().includes("email")) {
          setErrors({ email: data.message });
        }
        toast("error", data.message || "Registrasi gagal, coba lagi.");
        return;
      }

      if (data.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
      }

      const label = tipeAkun === "dosen" ? "Dosen" : "Admin Prodi";
      toast("success", `Akun ${label} berhasil dibuat! Mengarahkan ke dashboard...`);
      const dest = tipeAkun === "dosen" ? "/dashboard-dosen/" : "/dashboard-admin-prodi/";
      setTimeout(() => navigateTo(dest), 900);
    } catch {
      toast("error", "Tidak bisa terhubung ke server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ToastContainer toasts={toasts} onDismiss={dismiss} />

      {/* Navigating overlay */}
      <div className="fixed inset-0 z-[9998] bg-white flex flex-col items-center justify-center gap-4 transition-opacity duration-500"
        style={{ opacity: navigating ? 1 : 0, pointerEvents: navigating ? "all" : "none" }}>
        <div className="w-10 h-10 rounded-full border-[3px] border-sky-100 border-t-sky-400"
          style={{ animation: "spin 0.7s linear infinite" }} />
        <p className="text-[13px] font-semibold text-slate-400">Membuka dashboard...</p>
      </div>

      <section className="flex items-center justify-center min-h-screen bg-blue-50 px-6 py-10"
        style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
        <style>{`@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap'); @keyframes spin{to{transform:rotate(360deg)}} @keyframes spinBtn{to{transform:rotate(360deg)}}`}</style>

        <div className="w-full max-w-[460px] bg-white rounded-2xl border-2 border-blue-200 shadow-sm p-8">

          {/* Header */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-4 bg-sky-50 border border-sky-200">
              <span className="w-[7px] h-[7px] rounded-full bg-sky-400 inline-block" />
              <span className="text-[11px] font-bold text-sky-600 tracking-[0.10em] uppercase">Portal Akademik</span>
            </div>
            <h2 className="text-[22px] font-extrabold text-slate-900 mb-1">
              Daftar <em className="not-italic italic text-sky-500">akun akademik</em>
            </h2>
            <p className="text-[13px] text-slate-400">Pilih peran dan isi data untuk membuat akun.</p>
          </div>

          <form onSubmit={handleSubmit} noValidate>

            {/* Pilih tipe akun */}
            <div className="mb-4">
              <label className="block text-[13px] font-semibold text-slate-700 mb-1.5">
                Daftar Sebagai<span className="text-red-400 ml-0.5">*</span>
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { value: "admin", label: "Admin Prodi",     icon: <IconUserShield /> },
                  { value: "dosen", label: "Dosen Pembimbing", icon: <IconGraduationCap /> },
                ].map((opt) => (
                  <button key={opt.value} type="button"
                    onClick={() => { setTipeAkun(opt.value); clearError("tipeAkun"); }}
                    className="flex items-center gap-2.5 px-3 py-3 rounded-lg border-2 text-left transition-all"
                    style={{
                      background:  tipeAkun === opt.value ? "#e0f2fe" : "#fff",
                      borderColor: tipeAkun === opt.value ? "#38bdf8" : "#e2e8f0",
                    }}>
                    <span className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center ${
                      tipeAkun === opt.value ? "bg-sky-400 text-white" : "bg-slate-100 text-slate-400"}`}>
                      {opt.icon}
                    </span>
                    <span className={`text-[13px] font-semibold ${tipeAkun === opt.value ? "text-sky-700" : "text-slate-700"}`}>
                      {opt.label}
                    </span>
                  </button>
                ))}
              </div>
              {errors.tipeAkun && (
                <p className="mt-1 text-[11.5px] text-red-500 flex items-center gap-1">
                  <IconAlertCircle /> {errors.tipeAkun}
                </p>
              )}
            </div>

            {/* Nama */}
            <InputField label="Nama Lengkap" required error={errors.name}>
              <input type="text" placeholder="Masukkan nama lengkap" value={name}
                onChange={(e) => { setName(e.target.value); clearError("name"); }}
                className={inputCls(errors.name)} />
            </InputField>

            {/* Email */}
            <InputField label="Email" required error={errors.email}>
              <input type="email" placeholder="nama@kampus.ac.id" value={email}
                onChange={(e) => { setEmail(e.target.value); clearError("email"); }}
                className={inputCls(errors.email)} />
            </InputField>

            {/* Password */}
            <InputField label="Password" required error={errors.password}>
              <div className="relative">
                <input type={showPw ? "text" : "password"} placeholder="••••••••" value={password}
                  onChange={(e) => { setPassword(e.target.value); clearError("password"); }}
                  className={inputCls(errors.password)} style={{ paddingRight: "2.75rem" }} />
                <button type="button" onClick={() => setShowPw((v) => !v)} tabIndex={-1}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 bg-transparent border-none cursor-pointer p-0 flex items-center">
                  {showPw ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              </div>
            </InputField>

            {/* Submit */}
            <button type="submit" disabled={loading}
              className="w-full py-[11px] bg-sky-400 hover:bg-sky-500 active:scale-[0.99] text-white font-bold text-sm rounded-lg border-none cursor-pointer tracking-wide transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-1">
              {loading ? (
                <>
                  <span className="inline-block w-[14px] h-[14px] rounded-full border-2 border-white/30 border-t-white flex-shrink-0"
                    style={{ animation: "spinBtn 0.7s linear infinite" }} />
                  Mendaftarkan...
                </>
              ) : tipeAkun === "dosen" ? "Daftar sebagai Dosen" : tipeAkun === "admin" ? "Daftar sebagai Admin Prodi" : "Daftar Sekarang"}
            </button>
          </form>

          <p className="text-[13px] text-slate-400 text-center mt-5">
            Sudah punya akun?{" "}
            <a href="/masuk" className="text-sky-400 font-bold no-underline hover:text-sky-500 transition-colors">
              Masuk sekarang
            </a>
          </p>
          <p className="text-[12px] text-slate-400 text-center mt-1">
            Daftar sebagai mahasiswa?{" "}
            <a href="/masuk?mode=register" className="text-sky-400 font-semibold no-underline hover:text-sky-500 transition-colors">
              Klik di sini
            </a>
          </p>

        </div>
      </section>
    </>
  );
}