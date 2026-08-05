"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const BIDANG_OPTIONS = [
  "Teknologi Informasi",
  "Manufaktur",
  "Perbankan & Keuangan",
  "Pendidikan",
  "Kesehatan",
  "Retail & E-Commerce",
  "Konstruksi & Properti",
  "Konsultan",
  "Media & Komunikasi",
  "Logistik & Transportasi",
  "Energi & Pertambangan",
  "Pertanian & Perkebunan",
  "Lainnya",
];

const UKURAN_OPTIONS = [
  { value: "1-10", label: "1–10 karyawan" },
  { value: "11-50", label: "11–50 karyawan" },
  { value: "51-200", label: "51–200 karyawan" },
  { value: "201-500", label: "201–500 karyawan" },
  { value: "501-1000", label: "501–1000 karyawan" },
  { value: ">1000", label: "> 1000 karyawan" },
];

const initialForm = {
  namaPerusahaan: "",
  bidang: "",
  ukuran: "",
  website: "",
  namaCP: "",
  jabatanCP: "",
  email: "",
  telepon: "",
  password: "",
  konfirmasiPassword: "",
  setuju: false,
};

const validate = (form) => {
  const errors = {};
  if (!form.namaPerusahaan.trim()) errors.namaPerusahaan = "Nama perusahaan wajib diisi.";
  if (!form.bidang) errors.bidang = "Pilih bidang usaha perusahaan.";
  if (!form.ukuran) errors.ukuran = "Pilih ukuran perusahaan.";
  if (form.website && !/^https?:\/\/.+\..+/.test(form.website))
    errors.website = "Format URL tidak valid. Contoh: https://perusahaan.com";
  if (!form.namaCP.trim()) errors.namaCP = "Nama penanggung jawab wajib diisi.";
  if (!form.jabatanCP.trim()) errors.jabatanCP = "Jabatan wajib diisi.";
  if (!form.email.trim()) {
    errors.email = "Email wajib diisi.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = "Format email tidak valid.";
  }
  if (!form.telepon.trim()) {
    errors.telepon = "Nomor telepon wajib diisi.";
  } else if (!/^(\+62|08)\d{8,12}$/.test(form.telepon.replace(/\s/g, ""))) {
    errors.telepon = "Format nomor tidak valid. Contoh: 08123456789";
  }
  if (!form.password) {
    errors.password = "Password wajib diisi.";
  } else if (form.password.length < 8) {
    errors.password = "Password minimal 8 karakter.";
  } else if (!/[A-Z]/.test(form.password)) {
    errors.password = "Password harus mengandung minimal 1 huruf kapital.";
  } else if (!/[0-9]/.test(form.password)) {
    errors.password = "Password harus mengandung minimal 1 angka.";
  }
  if (!form.konfirmasiPassword) {
    errors.konfirmasiPassword = "Konfirmasi password wajib diisi.";
  } else if (form.password !== form.konfirmasiPassword) {
    errors.konfirmasiPassword = "Password tidak cocok.";
  }
  if (!form.setuju) errors.setuju = "Anda harus menyetujui syarat dan ketentuan.";
  return errors;
};

// ─── SVG Icons ────────────────────────────────────────────────────────────────

const IconClipboardList = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
    <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
    <path d="M12 11h4M12 16h4M8 11h.01M8 16h.01" />
  </svg>
);

const IconUsers = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

const IconBarChart = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="20" x2="18" y2="10" />
    <line x1="12" y1="20" x2="12" y2="4" />
    <line x1="6" y1="20" x2="6" y2="14" />
    <line x1="2" y1="20" x2="22" y2="20" />
  </svg>
);

const IconBell = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </svg>
);

const IconCheckCircle = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const IconAlertCircle = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="12" />
    <line x1="12" y1="16" x2="12.01" y2="16" />
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

const IconX = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const IconCheck = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

// ─── Toast Notification ───────────────────────────────────────────────────────

function Toast({ toast, onClose }) {
  if (!toast) return null;

  const isSuccess = toast.type === "success";

  return (
    <>
      <style>{`
        @keyframes tIn  { from{opacity:0;transform:translateX(50px) scale(.95)} to{opacity:1;transform:translateX(0) scale(1)} }
      `}</style>
      <div
        className="fixed top-6 right-6 z-50 flex items-start gap-4 px-5 py-4 rounded-2xl border backdrop-blur-md shadow-[0_12px_36px_-6px_rgba(0,0,0,0.08)] bg-white w-[340px]"
        style={{
          background: "rgba(255, 255, 255, 0.95)",
          borderColor: isSuccess ? "rgba(34, 197, 94, 0.2)" : "rgba(239, 68, 68, 0.2)",
          animation: "tIn 0.32s cubic-bezier(0.34, 1.56, 0.64, 1) forwards",
        }}
      >
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
          style={{
            backgroundColor: isSuccess ? "rgba(240, 253, 244, 0.95)" : "rgba(254, 242, 242, 0.95)",
            color: isSuccess ? "#16a34a" : "#dc2626",
          }}
        >
          {isSuccess ? (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          )}
        </div>
        <div className="flex-1 min-w-0 pt-0.5">
          <p className="text-[11px] font-black text-slate-800 tracking-wider uppercase mb-0.5 leading-none">
            {toast.title || (isSuccess ? "Berhasil" : "Gagal")}
          </p>
          <p className="text-slate-500 text-[12.5px] font-semibold leading-relaxed break-words">
            {toast.message}
          </p>
        </div>
        <button
          onClick={onClose}
          className="flex-shrink-0 opacity-40 hover:opacity-100 transition-opacity bg-transparent border-none cursor-pointer text-slate-400 hover:text-slate-600 flex items-center justify-center w-5 h-5 rounded-full hover:bg-slate-100"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </>
  );
}

// ─── Fitur list ───────────────────────────────────────────────────────────────

const FEATURES = [
  { icon: <IconClipboardList />, text: "Posting lowongan tanpa biaya" },
  { icon: <IconUsers />, text: "Akses ribuan mahasiswa terverifikasi" },
  { icon: <IconBarChart />, text: "Dashboard manajemen lamaran lengkap" },
  { icon: <IconBell />, text: "Notifikasi real-time setiap lamaran masuk" },
];

// ─── PasswordStrength ─────────────────────────────────────────────────────────

const PasswordStrength = ({ password }) => {
  if (!password) return null;
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  const levels = [
    { label: "Lemah", color: "#ef4444" },
    { label: "Cukup", color: "#f97316" },
    { label: "Baik", color: "#eab308" },
    { label: "Kuat", color: "#22c55e" },
  ];
  const level = levels[Math.max(0, score - 1)];

  return (
    <div className="mt-1.5 flex items-center gap-2">
      <div className="flex gap-1 flex-1">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="h-1 rounded-full flex-1 transition-all"
            style={{ background: i <= score ? level.color : "#e2e8f0" }}
          />
        ))}
      </div>
      <span className="text-[11px] font-medium" style={{ color: level.color }}>
        {level.label}
      </span>
    </div>
  );
};

// ─── InputField ───────────────────────────────────────────────────────────────

const InputField = ({ label, required, error, hint, children }) => (
  <div className="mb-4">
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

const inputClass = (error) =>
  `w-full px-3.5 py-[11px] text-[13.5px] border rounded-lg outline-none text-slate-800 bg-white placeholder-slate-300 transition-all ${
    error
      ? "border-red-300 focus:border-red-400 focus:ring-2 focus:ring-red-100"
      : "border-slate-200 focus:border-sky-300 focus:ring-2 focus:ring-sky-100"
  }`;

// ─── Main Component ───────────────────────────────────────────────────────────

const RegisterPerusahaanPage = () => {
  const router = useRouter();

  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showKonfirmasi, setShowKonfirmasi] = useState(false);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [toast, setToast] = useState(null);

  const showToast = (type, title, message, duration = 4000) => {
    setToast({ type, title, message });
    setTimeout(() => setToast(null), duration);
  };

  const set = (field) => (e) => {
    const value = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const validateStep = (s) => {
    const all = validate(form);
    const step1Fields = ["namaPerusahaan", "bidang", "ukuran", "website"];
    const step2Fields = ["namaCP", "jabatanCP", "email", "telepon"];
    const step3Fields = ["password", "konfirmasiPassword", "setuju"];
    const fields = s === 1 ? step1Fields : s === 2 ? step2Fields : step3Fields;
    const relevant = Object.fromEntries(Object.entries(all).filter(([k]) => fields.includes(k)));
    setErrors(relevant);
    return Object.keys(relevant).length === 0;
  };

  const nextStep = () => { if (validateStep(step)) setStep((s) => s + 1); };
  const prevStep = () => setStep((s) => s - 1);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const all = validate(form);
    if (Object.keys(all).length > 0) { setErrors(all); return; }

    setLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/register-perusahaan`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: form.namaCP,
            email: form.email,
            password: form.password,
            perusahaan: {
              nama: form.namaPerusahaan,
              bidang: form.bidang,
              ukuran: form.ukuran,
              website: form.website || null,
              telepon: form.telepon,
              namaCP: form.namaCP,
              jabatanCP: form.jabatanCP,
            },
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        if (data.message?.toLowerCase().includes("email")) {
          setErrors({ email: data.message });
          setStep(2);
          showToast("error", "Email sudah terdaftar", data.message);
        } else {
          showToast("error", "Registrasi gagal", data.message || "Silakan coba lagi.");
        }
        return;
      }

      // Simpan token jika API mengembalikannya
      if (data.token) {
        localStorage.setItem("token", data.token);
      }

      showToast(
        "success",
        "Registrasi berhasil!",
        "Akun perusahaan sedang menunggu verifikasi admin. Mengalihkan ke dashboard...",
        3000
      );

      // Redirect ke dashboard setelah 2 detik agar toast sempat terbaca
      setTimeout(() => {
        router.push("/dashboard-perusahaan");
      }, 2000);

    } catch {
      showToast("error", "Koneksi gagal", "Tidak bisa terhubung ke server. Periksa koneksi Anda.");
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { label: "Profil Perusahaan" },
    { label: "Kontak & Akun" },
    { label: "Keamanan" },
  ];

  return (
    <section
      className="flex items-center justify-center min-h-screen bg-blue-50 px-6 py-10"
      style={{ fontFamily: "'Plus Jakarta Sans', 'DM Sans', sans-serif" }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
      `}</style>

      {/* Toast */}
      <Toast toast={toast} onClose={() => setToast(null)} />

      <div className="w-full max-w-[1050px] flex items-stretch gap-10 bg-white py-8 px-10 rounded-2xl border-2 border-blue-200 shadow-sm">

        {/* ── Panel Kiri ── */}
        <div className="w-[420px] bg-gradient-to-br from-sky-400 to-sky-500 rounded-[8px_32px_8px_32px] flex flex-col items-center justify-between p-8 flex-shrink-0">
          <div className="w-full">
            <div className="inline-flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full mb-6">
              <span className="w-2 h-2 rounded-full bg-white inline-block" />
              <span className="text-white text-[11px] font-bold tracking-widest uppercase">
                Daftar Perusahaan
              </span>
            </div>

            <h1 className="text-white text-[26px] font-extrabold leading-snug mb-2">
              Buka peluang magang <br />
              <em className="not-italic font-normal text-sky-100">terbaik untuk mahasiswa</em>
            </h1>
            <p className="text-sky-100 text-[13px] leading-relaxed mb-8">
              Posting lowongan, kelola lamaran, dan temukan talenta terbaik dari kampus-kampus terkemuka.
            </p>

            <div className="space-y-3">
              {FEATURES.map((item) => (
                <div key={item.text} className="flex items-center gap-3">
                  <span className="flex-shrink-0 w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center text-white">
                    {item.icon}
                  </span>
                  <span className="text-white text-[13px] font-medium">{item.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Step indicator */}
          <div className="w-full mt-10">
            <div className="flex items-center justify-between">
              {steps.map((s, i) => {
                const num = i + 1;
                const active = step === num;
                const done = step > num;
                return (
                  <div key={s.label} className="flex flex-col items-center gap-1 flex-1">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-[13px] font-bold border-2 transition-all ${
                        done
                          ? "bg-white border-white text-sky-500"
                          : active
                          ? "bg-white/30 border-white text-white"
                          : "bg-transparent border-white/40 text-white/50"
                      }`}
                    >
                      {done ? <IconCheckCircle /> : num}
                    </div>
                    <span
                      className={`text-[10px] text-center leading-tight font-semibold transition-all ${
                        active || done ? "text-white" : "text-white/40"
                      }`}
                    >
                      {s.label}
                    </span>
                  </div>
                );
              })}
            </div>
            <div className="relative mt-2 h-1 bg-white/20 rounded-full overflow-hidden">
              <div
                className="absolute left-0 top-0 h-full bg-white rounded-full transition-all duration-300"
                style={{ width: `${((step - 1) / (steps.length - 1)) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* ── Panel Kanan — Form ── */}
        <div className="flex-1 flex flex-col justify-center py-2">
          <div className="mb-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-3 bg-sky-50 border border-sky-200">
              <span className="w-[7px] h-[7px] rounded-full bg-sky-400 inline-block" />
              <span className="text-[11px] font-bold text-sky-600 tracking-[0.10em] uppercase">
                Langkah {step} dari {steps.length}
              </span>
            </div>

            <h2 className="text-[22px] font-extrabold text-slate-900 leading-snug mb-1">
              {step === 1 && (<>Profil <em className="not-italic italic text-sky-500">perusahaan</em></>)}
              {step === 2 && (<>Kontak & <em className="not-italic italic text-sky-500">informasi akun</em></>)}
              {step === 3 && (<>Keamanan <em className="not-italic italic text-sky-500">akun</em></>)}
            </h2>
            <p className="text-[13px] text-slate-400">
              {step === 1 && "Isi informasi umum tentang perusahaan Anda."}
              {step === 2 && "Siapa yang bertanggung jawab atas akun ini?"}
              {step === 3 && "Buat password yang kuat untuk melindungi akun Anda."}
            </p>
          </div>

          <form onSubmit={handleSubmit} noValidate>

            {/* ── STEP 1 ── */}
            {step === 1 && (
              <>
                <InputField label="Nama Perusahaan" required error={errors.namaPerusahaan}>
                  <input
                    type="text"
                    placeholder="PT. Nama Perusahaan"
                    value={form.namaPerusahaan}
                    onChange={set("namaPerusahaan")}
                    className={inputClass(errors.namaPerusahaan)}
                  />
                </InputField>

                <div className="grid grid-cols-2 gap-3">
                  <InputField label="Bidang Usaha" required error={errors.bidang}>
                    <select value={form.bidang} onChange={set("bidang")} className={inputClass(errors.bidang)}>
                      <option value="">Pilih bidang</option>
                      {BIDANG_OPTIONS.map((b) => (<option key={b} value={b}>{b}</option>))}
                    </select>
                  </InputField>
                  <InputField label="Ukuran Perusahaan" required error={errors.ukuran}>
                    <select value={form.ukuran} onChange={set("ukuran")} className={inputClass(errors.ukuran)}>
                      <option value="">Pilih ukuran</option>
                      {UKURAN_OPTIONS.map((u) => (<option key={u.value} value={u.value}>{u.label}</option>))}
                    </select>
                  </InputField>
                </div>

                <InputField label="Website Perusahaan" error={errors.website} hint="Opsional. Contoh: https://perusahaan.co.id">
                  <input
                    type="url"
                    placeholder="https://perusahaan.co.id"
                    value={form.website}
                    onChange={set("website")}
                    className={inputClass(errors.website)}
                  />
                </InputField>
              </>
            )}

            {/* ── STEP 2 ── */}
            {step === 2 && (
              <>
                <div className="grid grid-cols-2 gap-3">
                  <InputField label="Nama Penanggung Jawab" required error={errors.namaCP}>
                    <input
                      type="text"
                      placeholder="Nama lengkap"
                      value={form.namaCP}
                      onChange={set("namaCP")}
                      className={inputClass(errors.namaCP)}
                    />
                  </InputField>
                  <InputField label="Jabatan" required error={errors.jabatanCP}>
                    <input
                      type="text"
                      placeholder="HRD / Direktur / dll"
                      value={form.jabatanCP}
                      onChange={set("jabatanCP")}
                      className={inputClass(errors.jabatanCP)}
                    />
                  </InputField>
                </div>

                <InputField label="Email Perusahaan" required error={errors.email} hint="Digunakan untuk login dan notifikasi.">
                  <input
                    type="email"
                    placeholder="hrd@perusahaan.co.id"
                    value={form.email}
                    onChange={set("email")}
                    className={inputClass(errors.email)}
                  />
                </InputField>

                <InputField label="Nomor Telepon" required error={errors.telepon} hint="Format: 08xxxxxxxxxx atau +628xxxxxxxxxx">
                  <input
                    type="tel"
                    placeholder="08123456789"
                    value={form.telepon}
                    onChange={set("telepon")}
                    className={inputClass(errors.telepon)}
                  />
                </InputField>
              </>
            )}

            {/* ── STEP 3 ── */}
            {step === 3 && (
              <>
                <InputField label="Password" required error={errors.password} hint="Min. 8 karakter, mengandung huruf kapital dan angka.">
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={form.password}
                      onChange={set("password")}
                      className={inputClass(errors.password) + " pr-10"}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                      tabIndex={-1}
                    >
                      {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                    </button>
                  </div>
                  <PasswordStrength password={form.password} />
                </InputField>

                <InputField label="Konfirmasi Password" required error={errors.konfirmasiPassword}>
                  <div className="relative">
                    <input
                      type={showKonfirmasi ? "text" : "password"}
                      placeholder="••••••••"
                      value={form.konfirmasiPassword}
                      onChange={set("konfirmasiPassword")}
                      className={inputClass(errors.konfirmasiPassword) + " pr-10"}
                    />
                    <button
                      type="button"
                      onClick={() => setShowKonfirmasi((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                      tabIndex={-1}
                    >
                      {showKonfirmasi ? <EyeOffIcon /> : <EyeIcon />}
                    </button>
                  </div>
                </InputField>

                <div className="mb-5">
                  <label
                    className={`flex items-start gap-2.5 cursor-pointer select-none text-[12.5px] ${
                      errors.setuju ? "text-red-500" : "text-slate-500"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={form.setuju}
                      onChange={set("setuju")}
                      className="w-[15px] h-[15px] mt-0.5 accent-sky-400 cursor-pointer flex-shrink-0"
                    />
                    <span>
                      Saya menyetujui{" "}
                      <a href="/syarat" className="text-sky-500 font-semibold hover:underline">Syarat & Ketentuan</a>{" "}
                      serta{" "}
                      <a href="/privasi" className="text-sky-500 font-semibold hover:underline">Kebijakan Privasi</a>{" "}
                      yang berlaku.
                    </span>
                  </label>
                  {errors.setuju && (
                    <p className="mt-1 text-[11.5px] text-red-500 flex items-center gap-1 pl-5">
                      <IconAlertCircle />
                      {errors.setuju}
                    </p>
                  )}
                </div>
              </>
            )}

            {/* Navigasi */}
            <div className="flex gap-3 mt-2">
              {step > 1 && (
                <button
                  type="button"
                  onClick={prevStep}
                  className="flex-1 py-[11px] bg-white hover:bg-slate-50 text-slate-700 font-bold text-sm rounded-lg border border-slate-200 hover:border-slate-300 cursor-pointer transition-all"
                >
                  ← Kembali
                </button>
              )}
              {step < 3 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="flex-1 py-[11px] bg-sky-400 hover:bg-sky-500 active:scale-[0.99] text-white font-bold text-sm rounded-lg cursor-pointer tracking-wide transition-all"
                >
                  Lanjut →
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-[11px] bg-sky-400 hover:bg-sky-500 active:scale-[0.99] text-white font-bold text-sm rounded-lg cursor-pointer tracking-wide transition-all disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                      </svg>
                      Mendaftarkan...
                    </>
                  ) : (
                    "Daftar Sekarang"
                  )}
                </button>
              )}
            </div>
          </form>

          <p className="text-[13px] text-slate-400 text-center mt-5">
            Sudah punya akun?{" "}
            <a href="/login" className="text-sky-400 font-bold no-underline hover:text-sky-500 transition-colors">
              Masuk sekarang
            </a>
          </p>
          <p className="text-[12px] text-slate-400 text-center mt-1">
            Daftar sebagai mahasiswa?{" "}
            <a href="/register" className="text-sky-400 font-semibold no-underline hover:text-sky-500 transition-colors">
              Klik di sini
            </a>
          </p>
        </div>
      </div>
    </section>
  );
};

export default RegisterPerusahaanPage;