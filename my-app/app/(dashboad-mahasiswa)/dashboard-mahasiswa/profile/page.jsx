"use client";
import { useEffect, useState, useRef } from "react";
import {
  User, MapPin, Mail, Phone, Globe, Award, Save, Plus, X,
  CheckCircle, AlertCircle, Camera, Upload,
  GraduationCap, BookOpen, Star, Lock, Calendar, Building,
  Link2, IdCard,
} from "lucide-react";

import Topbar from "../../components/topbar";

function InstagramIcon({ size = 13 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/>
    </svg>
  );
}
function TwitterIcon({ size = 13 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
    </svg>
  );
}
function GithubIcon({ size = 13 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
    </svg>
  );
}

function Card({ children, className = "" }) {
  return (
    <div className={`bg-white border border-slate-200 rounded-2xl shadow-[0_1px_2px_rgba(15,23,42,0.04)] ${className}`}>
      {children}
    </div>
  );
}

function SectionHead({ title, sub }) {
  return (
    <div className="mb-4 pb-3 border-b border-slate-100">
      <h2 className="text-sm font-bold text-slate-900 m-0 flex items-center gap-2">
        <span className="w-1 h-4 bg-[#0A66C2] rounded-full inline-block" />
        {title}
      </h2>
      {sub && <p className="text-xs text-slate-400 mt-0.5 ml-3">{sub}</p>}
    </div>
  );
}

function Field({ label, children, hint, required, locked }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[12px] font-semibold text-slate-700 flex items-center gap-1.5">
        {label}
        {required && <span className="text-[#DC2626]">*</span>}
        {locked && (
          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-slate-100 text-[9.5px] font-bold text-slate-400 tracking-wider">
            <Lock size={8} /> ADMIN
          </span>
        )}
      </label>
      {children}
      {hint && <p className="text-[11px] text-slate-400 m-0">{hint}</p>}
    </div>
  );
}

const inputClass =
  "w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-[13px] text-slate-800 bg-slate-50/60 outline-none transition-colors duration-150 focus:border-[#0A66C2] focus:bg-white focus:ring-2 focus:ring-[#0A66C2]/10 placeholder:text-slate-400";

const readonlyClass =
  "w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-[13px] bg-slate-100 text-slate-400 cursor-not-allowed select-none italic";

function TextInput({ value, onChange, placeholder, prefix, type = "text", disabled }) {
  return (
    <div className="relative flex items-center">
      {prefix && (
        <span className="absolute left-3.5 flex items-center text-slate-400">{prefix}</span>
      )}
      <input
        type={type}
        value={value}
        onChange={onChange ? (e) => onChange(e.target.value) : undefined}
        placeholder={placeholder}
        disabled={disabled}
        className={`${disabled ? readonlyClass : inputClass} ${prefix ? "pl-9" : ""}`}
      />
    </div>
  );
}

function TextArea({ value, onChange, placeholder, rows = 4, maxLength }) {
  return (
    <div className="relative">
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        maxLength={maxLength}
        className={`${inputClass} resize-none leading-relaxed`}
      />
      {maxLength && (
        <span className="absolute bottom-2.5 right-3 text-[10.5px] text-slate-400 bg-white/80 px-1 rounded">
          {value.length}/{maxLength}
        </span>
      )}
    </div>
  );
}

function Tag({ children, onRemove }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-[11.5px] font-semibold px-2.5 py-1 rounded-md bg-[#EFF6FF] text-[#1D4ED8] border border-[#93C5FD] whitespace-nowrap">
      {children}
      {onRemove && (
        <button onClick={onRemove} className="text-[#1D4ED8]/50 hover:text-[#1D4ED8] cursor-pointer">
          <X size={11} />
        </button>
      )}
    </span>
  );
}

function Toast({ message, visible, type = "success" }) {
  return (
    <div
      className="fixed bottom-6 right-6 z-[100] flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-lg transition-all duration-300"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(12px)",
        pointerEvents: "none",
        background: type === "error" ? "#DC2626" : "#0f172a",
      }}
    >
      {type === "success"
        ? <CheckCircle size={15} className="text-green-400" />
        : <AlertCircle size={15} className="text-white" />}
      <span className="text-[13px] font-medium text-white">{message}</span>
    </div>
  );
}

function ProfileAvatar({ initials, photoUrl, onPhotoChange, size = 80 }) {
  const fileRef = useRef(null);
  const [hover, setHover] = useState(false);
  const handleFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => onPhotoChange(ev.target.result);
    reader.readAsDataURL(file);
  };
  return (
    <div className="relative inline-block" style={{ width: size, height: size }}>
      <div
        className="rounded-2xl border-[3px] border-white flex items-center justify-center font-extrabold text-white overflow-hidden cursor-pointer relative shadow-lg"
        style={{
          width: size,
          height: size,
          fontSize: size * 0.3,
          background: photoUrl ? "transparent" : "linear-gradient(135deg, #0A66C2 0%, #1d7fe0 100%)",
        }}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        onClick={() => fileRef.current?.click()}
      >
        {photoUrl ? <img src={photoUrl} alt="Foto Profil" className="w-full h-full object-cover" /> : initials}
        <div className={`absolute inset-0 bg-black/50 flex items-center justify-center rounded-2xl transition-opacity duration-200 ${hover ? "opacity-100" : "opacity-0"}`}>
          <Camera size={Math.round(size * 0.25)} color="#fff" />
        </div>
      </div>
      <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
    </div>
  );
}

function getInitials(nama = "") {
  const parts = nama.trim().split(" ").filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

/* ── Sidebar helper: icon-row used by Detail Tambahan / Status Magang ── */
function InfoRow({ icon, label, value, placeholder = "—", italic = false }) {
  return (
    <div className="flex items-start gap-2.5">
      <div className="w-7 h-7 rounded-lg bg-[#EFF6FF] flex items-center  border border-[#BFDBFE] justify-center flex-shrink-0 mt-[1px]">
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[9.5px] font-semibold text-slate-400 uppercase tracking-wider m-0">{label}</p>
        <p className={`text-[12px] font-medium m-0 mt-0.5 truncate ${value ? "text-slate-700" : "text-slate-400 italic"} ${italic && !value ? "italic" : ""}`}>
          {value || placeholder}
        </p>
      </div>
    </div>
  );
}

/* ── Sidebar card wrapper with consistent heading style ── */
function SideCard({ title, children }) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
      <div className="mb-3.5 pb-3 border-b border-slate-100">
        <p className="text-[11.5px] font-bold text-slate-700 m-0 flex items-center gap-2">
          <span className="w-1 h-3.5 bg-[#0A66C2] rounded-full inline-block" />
          {title}
        </p>
      </div>
      <div className="flex flex-col gap-3">{children}</div>
    </div>
  );
}

/* ── Compact editable field used in sidebar cards ── */
function MiniField({ icon, label, value, onChange, placeholder }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-[9.5px] font-semibold text-slate-400 uppercase tracking-wider">{label}</label>
      <div className="relative flex items-center">
        <span className="absolute left-2.5 flex items-center text-slate-400">{icon}</span>
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full pl-8 pr-2.5 py-2 rounded-lg border border-slate-200 text-[12px] text-slate-800 bg-slate-50/60 outline-none transition-colors duration-150 focus:border-[#0A66C2] focus:bg-white focus:ring-2 focus:ring-[#0A66C2]/10 placeholder:text-slate-400"
        />
      </div>
    </div>
  );
}

const SOCIAL_META = {
  instagram: { icon: <InstagramIcon size={13} />, label: "Instagram", color: "#E1306C", bg: "#FDF1F6" },
  twitter:   { icon: <TwitterIcon size={13} />,   label: "Twitter / X", color: "#0f172a", bg: "#F1F5F9" },
  github:    { icon: <GithubIcon size={13} />,    label: "GitHub", color: "#0f172a", bg: "#F1F5F9" },
  website:   { icon: <Globe size={13} />,         label: "Website", color: "#0A66C2", bg: "#EFF6FF" },
};

export default function ProfilMahasiswa() {
  const [photoUrl, setPhotoUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [newSkill, setNewSkill] = useState("");
  const [toast, setToast] = useState({ visible: false, message: "", type: "success" });

  const [profile, setProfile] = useState({
    nama: "",
    nim: "",
    prodi: "",
    angkatan: "",
    semester: "",
    ipk: "",
    sks: "",
    dosenPembimbing: "",
    location: "",
    about: "",
    perusahaan: "",
    periodeAwal: "Feb 2025",
    periodeAkhir: "Agu 2025",
  });

  const [details, setDetails] = useState({
    email: "",
    phone: "",
    languages: "Indonesia, Inggris",
  });

  const [socials, setSocials] = useState({
    instagram: "",
    twitter: "",
    github: "",
    website: "",
  });

  const [skills, setSkills] = useState([]);

  const set  = (k, v) => setProfile((p) => ({ ...p, [k]: v }));
  const setD = (k, v) => setDetails((p) => ({ ...p, [k]: v }));
  const setS = (k, v) => setSocials((p) => ({ ...p, [k]: v }));

  const showToast = (message, type = "success") => {
    setToast({ visible: true, message, type });
    setTimeout(() => setToast((t) => ({ ...t, visible: false })), 2800);
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) { window.location.href = "/login"; return; }
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/mahasiswa/profile`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const result = await res.json();
        if (!res.ok) { console.error(result.message); return; }
        const d = result.data;
        if (d) {
          setProfile({
            nama: d.nama || d.user?.name || "",
            nim: d.nim || "",
            prodi: d.prodi || "",
            angkatan: d.angkatan || "",
            semester: String(d.semester || ""),
            ipk: String(d.ipk || ""),
            sks: String(d.totalSks || ""),
            dosenPembimbing: d.dosenPembimbing || "",
            location: d.alamat || "",
            about: d.about || "",
            perusahaan: d.perusahaan || "",
            periodeAwal: d.periodeAwal || "Feb 2025",
            periodeAkhir: d.periodeAkhir || "Agu 2025",
          });
          setDetails({
            email: d.user?.email || "",
            phone: d.telepon || "",
            languages: "Indonesia, Inggris",
          });
          if (d.fotoProfil) setPhotoUrl(d.fotoProfil);
          if (d.skills?.length > 0) setSkills(d.skills);
          if (d.sosialMedia) {
            setSocials({
              instagram: d.sosialMedia.instagram || "",
              twitter:   d.sosialMedia.twitter   || "",
              github:    d.sosialMedia.github     || "",
              website:   d.sosialMedia.website    || "",
            });
          }
        }
      } catch (err) {
        console.error("Gagal mengambil data profil:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/mahasiswa/profile`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          nama:        profile.nama,
          nim:         profile.nim,
          prodi:       profile.prodi,
          angkatan:    profile.angkatan,
          semester:    Number(profile.semester),
          ipk:         Number(profile.ipk),
          totalSks:    Number(profile.sks),
          alamat:      profile.location,
          telepon:     details.phone,
          fotoProfil:  photoUrl,
          about:       profile.about,
          perusahaan:  profile.perusahaan,
          skills:      skills.map((s) => ({ name: s.name })),
          sosialMedia: {
            instagram: socials.instagram,
            twitter:   socials.twitter,
            github:    socials.github,
            website:   socials.website,
          },
        }),
      });
      const result = await res.json();
      if (!res.ok) { showToast(result.message || "Gagal menyimpan profil", "error"); return; }
      showToast("Profil berhasil disimpan", "success");
    } catch {
      showToast("Tidak bisa terhubung ke server", "error");
    } finally {
      setSaving(false);
    }
  };

  const addSkill = () => {
    const v = newSkill.trim();
    if (!v || skills.find((s) => s.name === v)) { setNewSkill(""); return; }
    setSkills((prev) => [...prev, { id: Date.now(), name: v }]);
    setNewSkill("");
  };
  const removeSkill = (id) => setSkills((prev) => prev.filter((s) => s.id !== id));
  const initials = getInitials(profile.nama);
  const hasSocials = socials.instagram || socials.twitter || socials.github || socials.website;

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-[#0A66C2] border-t-transparent animate-spin" />
          <p className="text-[13px] text-slate-500">Memuat profil…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/20 to-white font-sans text-slate-900">

    <Topbar
        icon={<User size={17} />}
        title="Profil Saya"
        subtitle="Kelola informasi profil dan data akademik kamu"
        rightSlot={
          <button className="flex items-center gap-2 px-4 py-2 border border-blue-300 rounded-xl text-blue-600 text-[12.5px] font-semibold bg-transparent transition-all duration-150 hover:bg-blue-500 hover:text-white hover:border-blue-500 cursor-pointer">
            <div className="w-6 h-6 rounded-lg bg-blue-100 border border-blue-200 flex items-center justify-center flex-shrink-0">
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 9.5L12 3l9 6.5" />
                <path d="M5 9v11a1 1 0 0 0 1 1h3v-7h6v7h3a1 1 0 0 0 1-1V9" />
              </svg>
            </div>
            Back to Homepage
          </button>
        }
      />

      {/* ── Body: single page, no tabs ── */}
      <div className="px-6 py-6 flex gap-5 items-start">

        {/* ── LEFT: semua section ── */}
        <div className="flex-1 min-w-0 flex flex-col gap-5">

          {/* 1. Profile Hero Card */}
          <Card>
            <div
              className="h-28 rounded-t-2xl relative overflow-hidden"
              style={{ background: "linear-gradient(135deg, #bcd6f7 0%, #d8e8fb 45%, #cfe0f8 100%)" }}
            >
              <div className="absolute -right-8 -top-10 w-40 h-40 rounded-full bg-white/25" />
              <div className="absolute right-16 -bottom-12 w-24 h-24 rounded-full bg-white/15" />
            </div>
            <div className="px-5 pb-5 flex items-start gap-4">
              <div className="-mt-11 flex-shrink-0">
                <ProfileAvatar initials={initials} photoUrl={photoUrl} onPhotoChange={setPhotoUrl} size={88} />
              </div>
              <div className="flex-1 min-w-0 pt-3">
                <h3 className="text-[17px] font-extrabold text-slate-900 m-0 leading-tight truncate">
                  {profile.nama || <span className="text-slate-400 italic font-normal text-[14px]">Nama belum diisi</span>}
                </h3>
                <p className="text-[12.5px] text-slate-500 m-0 mt-1 flex items-center gap-1.5 flex-wrap">
                  <span className="font-medium">{profile.nim ? `NIM ${profile.nim}` : "NIM belum diisi"}</span>
                  <span className="text-slate-300">·</span>
                  <span>{profile.prodi || "Program studi belum diisi"}</span>
                </p>
                <span className="inline-flex items-center gap-1 bg-emerald-50 border border-emerald-100 text-emerald-700 text-[10px] font-semibold px-2.5 py-1 rounded-full mt-2.5">
                  <CheckCircle size={10} className="fill-emerald-700 text-emerald-50" /> Terbuka untuk peluang
                </span>
              </div>
              <div className="flex flex-col gap-2 mt-3 items-end flex-shrink-0">
                <button
                  onClick={() => document.getElementById("photo-input-hero")?.click()}
                  className="px-3.5 py-2 rounded-xl text-[11.5px] font-semibold cursor-pointer bg-white border border-slate-200 text-slate-700 hover:border-[#0A66C2] hover:text-[#0A66C2] hover:bg-blue-50/50 transition-colors flex items-center gap-1.5 shadow-sm"
                >
                  <Upload size={12} /> Unggah Foto
                </button>
                <input
                  id="photo-input-hero"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    const reader = new FileReader();
                    reader.onload = (ev) => setPhotoUrl(ev.target.result);
                    reader.readAsDataURL(file);
                  }}
                />
                <p className="text-[10px] text-slate-400 m-0">PNG/JPG · maks 2MB</p>
              </div>
            </div>
            {/* Quick stats strip */}
            <div className="border-t border-slate-100 px-5 py-4 grid grid-cols-4 gap-3">
              {[
                { label: "Program Studi", val: profile.prodi, icon: <GraduationCap size={13} className="text-[#0A66C2]" /> },
                { label: "Angkatan",      val: profile.angkatan, icon: <Calendar size={13} className="text-[#0A66C2]" /> },
                { label: "IPK",           val: profile.ipk ? `${profile.ipk} / 4.00` : "", icon: <Star size={13} className="text-[#0A66C2]" /> },
                { label: "Semester",      val: profile.semester ? `Semester ${profile.semester}` : "", icon: <BookOpen size={13} className="text-[#0A66C2]" /> },
              ].map((item) => (
                <div key={item.label} className="flex items-start gap-2 px-1 first:pl-0">
                  <div className="w-7 h-7 rounded-lg bg-[#EFF6FF] flex items-center justify-center flex-shrink-0 mt-[1px]">
                    {item.icon}
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider m-0">{item.label}</p>
                    <p className={`text-[12.5px] font-semibold m-0 mt-0.5 truncate ${item.val ? "text-slate-800" : "text-slate-400 italic"}`}>
                      {item.val || "—"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* 2. Informasi Pribadi */}
          <Card className="p-6">
            <SectionHead title="Informasi Pribadi" sub="Data diri utama yang tampil pada halaman profil" />
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <Field label="Nama Lengkap" required>
                  <TextInput value={profile.nama} onChange={(v) => set("nama", v)} placeholder="Nama lengkap sesuai KTP" prefix={<User size={13} />} />
                </Field>
              </div>
              <div className="col-span-2">
                <Field label="Lokasi / Alamat">
                  <TextInput value={profile.location} onChange={(v) => set("location", v)} placeholder="Kota, Provinsi" prefix={<MapPin size={13} />} />
                </Field>
              </div>
            </div>
          </Card>

          {/* 3. Data Akademik */}
          <Card className="p-6">
            <SectionHead title="Data Akademik" sub="Informasi akademik yang disinkronkan dengan sistem kampus" />
            <div className="grid grid-cols-2 gap-4">
              <Field label="NIM" required>
                <TextInput value={profile.nim} onChange={(v) => set("nim", v)} placeholder="Nomor Induk Mahasiswa" prefix={<IdCard size={13} />} />
              </Field>
              <Field label="Program Studi" required>
                <TextInput value={profile.prodi} onChange={(v) => set("prodi", v)} placeholder="Contoh: Teknik Informatika" prefix={<GraduationCap size={13} />} />
              </Field>
              <Field label="Angkatan">
                <TextInput value={profile.angkatan} onChange={(v) => set("angkatan", v)} placeholder="2022" prefix={<Calendar size={13} />} />
              </Field>
              <Field label="Semester">
                <TextInput value={profile.semester} onChange={(v) => set("semester", v.replace(/\D/g, "").slice(0, 2))} placeholder="6" prefix={<BookOpen size={13} />} />
              </Field>
              <Field label="IPK">
                <TextInput value={profile.ipk} onChange={(v) => set("ipk", v)} placeholder="3.75" prefix={<Star size={13} />} />
              </Field>
              <Field label="SKS Ditempuh">
                <TextInput value={profile.sks} onChange={(v) => set("sks", v.replace(/\D/g, ""))} placeholder="120" prefix={<BookOpen size={13} />} />
              </Field>
              <div className="col-span-2">
                <Field label="Dosen Pembimbing" locked>
                  <TextInput value={profile.dosenPembimbing || ""} placeholder="Belum ditentukan oleh admin prodi" disabled />
                  <p className="text-[11px] text-slate-400 m-0">Dosen pembimbing ditentukan oleh admin prodi dan tidak dapat diubah di sini.</p>
                </Field>
              </div>
            </div>

            {/* Status Magang */}
            <div className="mt-5 pt-5 border-t border-slate-100">
              <p className="text-[12px] font-bold text-slate-700 mb-3 flex items-center gap-2">
                <span className="w-1 h-4 bg-[#0A66C2] rounded-full inline-block" />
                Status Magang
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                  <p className="text-[10.5px] font-semibold text-slate-400 uppercase tracking-wider m-0 mb-0.5">Perusahaan</p>
                  <p className="text-[13px] font-semibold text-slate-800 m-0">{profile.perusahaan || "—"}</p>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                  <p className="text-[10.5px] font-semibold text-slate-400 uppercase tracking-wider m-0 mb-0.5">Periode</p>
                  <p className="text-[13px] font-semibold text-slate-800 m-0">
                    {profile.periodeAwal && profile.periodeAkhir ? `${profile.periodeAwal} – ${profile.periodeAkhir}` : "—"}
                  </p>
                </div>
              </div>
            </div>
          </Card>

          {/* 4. Tentang Saya */}
          <Card className="p-6">
            <SectionHead title="Tentang Saya" sub="Deskripsi singkat yang tampil di halaman profil publik" />
            <Field label="Deskripsi" hint="Ceritakan tentang dirimu, minat, dan tujuan karier (maks 500 karakter)">
              <TextArea
                value={profile.about}
                onChange={(v) => set("about", v)}
                rows={4}
                maxLength={500}
                placeholder="Ceritakan tentang dirimu, latar belakang, minat, dan apa yang kamu cari dari program magang ini…"
              />
            </Field>
          </Card>

          {/* 5. Skill & Keahlian */}
          <Card className="p-6">
            <SectionHead title="Skill & Keahlian" sub="Tambahkan skill yang relevan untuk menarik perhatian perusahaan" />
            <div className="flex gap-1.5 flex-wrap mb-4">
              {skills.map((sk) => (
                <Tag key={sk.id} onRemove={() => removeSkill(sk.id)}>{sk.name}</Tag>
              ))}
              {skills.length === 0 && (
                <span className="text-[12px] text-slate-400">Belum ada skill ditambahkan</span>
              )}
            </div>
            <div className="flex gap-2 max-w-[440px]">
              <input
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addSkill())}
                placeholder="Tambah skill baru… (tekan Enter)"
                maxLength={32}
                className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/60 text-[13px] outline-none focus:border-[#0A66C2] focus:bg-white transition-colors"
              />
              <button
                onClick={addSkill}
                className="px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-[#0A66C2] text-[12.5px] font-semibold cursor-pointer hover:border-[#0A66C2] hover:bg-blue-50 transition-colors flex items-center gap-1.5"
              >
                <Plus size={13} /> Tambah
              </button>
            </div>
          </Card>

        </div>

        {/* ── RIGHT: Sidebar ── */}
        <div className="w-[268px] shrink-0 flex flex-col gap-3 sticky top-[72px]">

          {/* Detail Tambahan */}
          <SideCard title="Detail Tambahan">
            <MiniField icon={<Mail size={12} />} label="Email" value={details.email} onChange={(v) => setD("email", v)} placeholder="email@mahasiswa.ac.id" />
            <MiniField icon={<Phone size={12} />} label="Nomor Telepon" value={details.phone} onChange={(v) => setD("phone", v)} placeholder="+62 812 3456 7890" />
            <InfoRow icon={<Globe size={12} className="text-[#0A66C2]" />} label="Bahasa" value={details.languages} />
            <InfoRow icon={<Calendar size={12} className="text-[#0A66C2]" />} label="Angkatan" value={profile.angkatan} />
          </SideCard>

          {/* Status Magang sidebar */}
          <SideCard title="Status Magang">
            <InfoRow icon={<Building size={12} className="text-[#0A66C2]" />} label="Perusahaan" value={profile.perusahaan} />
            <InfoRow
              icon={<Calendar size={12} className="text-[#0A66C2]" />}
              label="Periode"
              value={profile.periodeAwal && profile.periodeAkhir ? `${profile.periodeAwal} – ${profile.periodeAkhir}` : ""}
            />
            <InfoRow icon={<User size={12} className="text-[#0A66C2]" />} label="Dosen Pembimbing" value={profile.dosenPembimbing} placeholder="Belum ditentukan" />
          </SideCard>

          {/* Tautan Sosial */}
          <SideCard title="Tautan Sosial">
            <MiniField icon={<InstagramIcon size={12} />} label="Instagram" value={socials.instagram} onChange={(v) => setS("instagram", v)} placeholder="@username" />
            <MiniField icon={<TwitterIcon size={12} />} label="Twitter / X" value={socials.twitter} onChange={(v) => setS("twitter", v)} placeholder="@username" />
            <MiniField icon={<GithubIcon size={12} />} label="GitHub" value={socials.github} onChange={(v) => setS("github", v)} placeholder="github.com/username" />
            <MiniField icon={<Globe size={12} />} label="Website" value={socials.website} onChange={(v) => setS("website", v)} placeholder="www.portfolio.com" />
          </SideCard>

          {/* Tips */}
          <div className="rounded-2xl p-4 border border-[#d6e8f7]" style={{ background: "linear-gradient(160deg, #dbeeff 0%, #e8f3ff 60%, #d4e9fb 100%)" }}>
            <div className="flex items-center gap-2 mb-1.5">
              <Award size={14} className="text-[#0A66C2]" />
              <p className="text-[12px] font-bold text-slate-900 m-0">Tips Profil</p>
            </div>
            <p className="text-[11.5px] text-slate-600 leading-relaxed m-0">
              Profil dengan foto, deskripsi lengkap, dan skill terisi mendapat lebih banyak perhatian dari perusahaan mitra.
            </p>
          </div>

        </div>
      </div>

      <Toast message={toast.message} visible={toast.visible} type={toast.type} />

      {/* ── Bottom save bar ── */}
      <div className="z-30 bg-white/95 backdrop-blur-xl border-t border-slate-200">
        <div className="px-6 py-3.5 flex items-center justify-end gap-3">
          <span className="text-[12px] text-slate-400 mr-auto hidden sm:inline">
            Pastikan semua field wajib (<span className="text-red-500">*</span>) sudah terisi sebelum menyimpan
          </span>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-5 py-2.5 rounded-xl text-[13px] font-semibold cursor-pointer bg-[#0A66C2] text-white border border-[#0A66C2] hover:bg-[#0958A8] disabled:opacity-60 disabled:cursor-not-allowed transition-colors flex items-center gap-1.5"
          >
            {saving
              ? <><div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" /> Menyimpan…</>
              : <><Save size={14} /> Simpan Perubahan</>
            }
          </button>
        </div>
      </div>
    </div>
  );
}