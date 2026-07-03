"use client";

import { useEffect, useState, useRef } from "react";
import {
  User, Mail, Phone, Building, GraduationCap, Award, Save, Plus, X,
  CheckCircle, AlertCircle, Camera, Upload, IdCard, BookOpen,
} from "lucide-react";
import Topbar from "../../components/topbar";

const emptyProfile = {
  name: "",
  nip: "",
  nidn: "",
  position: "",
  rank: "",
  department: "",
  faculty: "",
  email: "",
  phone: "",
  office: "",
  bio: "",
};

let nextId = 100;
const uid = () => ++nextId;

// ── Decode JWT payload tanpa library tambahan ──────────────────────────────────
function decodeJwt(token) {
  try {
    const base64Payload = token.split(".")[1];
    const json = atob(base64Payload.replace(/-/g, "+").replace(/_/g, "/"));
    return JSON.parse(json);
  } catch {
    return null;
  }
}

/* ───────────────────────── Shared UI (selaras dengan Profil Mahasiswa) ───────────────────────── */

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

function Field({ label, children, hint, required }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[12px] font-semibold text-slate-700 flex items-center gap-1.5">
        {label}
        {required && <span className="text-[#DC2626]">*</span>}
      </label>
      {children}
      {hint && <p className="text-[11px] text-slate-400 m-0">{hint}</p>}
    </div>
  );
}

const inputClass =
  "w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-[13px] text-slate-800 bg-slate-50/60 outline-none transition-colors duration-150 focus:border-[#0A66C2] focus:bg-white focus:ring-2 focus:ring-[#0A66C2]/10 placeholder:text-slate-400";

function TextInput({ value, onChange, placeholder, prefix, type = "text" }) {
  return (
    <div className="relative flex items-center">
      {prefix && <span className="absolute left-3.5 flex items-center text-slate-400">{prefix}</span>}
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`${inputClass} ${prefix ? "pl-9" : ""}`}
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
      {type === "success" ? <CheckCircle size={15} className="text-green-400" /> : <AlertCircle size={15} className="text-white" />}
      <span className="text-[13px] font-medium text-white">{message}</span>
    </div>
  );
}

function ProfileAvatar({ initials, photoUrl, onPhotoChange, size = 88 }) {
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

function InfoRow({ icon, label, value, placeholder = "—" }) {
  return (
    <div className="flex items-start gap-2.5">
      <div className="w-7 h-7 rounded-lg bg-[#EFF6FF] flex items-center justify-center flex-shrink-0 mt-[1px]">{icon}</div>
      <div className="min-w-0 flex-1">
        <p className="text-[9.5px] font-semibold text-slate-400 uppercase tracking-wider m-0">{label}</p>
        <p className={`text-[12px] font-medium m-0 mt-0.5 truncate ${value ? "text-slate-700" : "text-slate-400 italic"}`}>
          {value || placeholder}
        </p>
      </div>
    </div>
  );
}

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

function getInitials(name = "") {
  const clean = name.replace(/^(Dr\.|Prof\.)\s*/i, "");
  const parts = clean.trim().split(" ").filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

/* ───────────────────────────────── Page ───────────────────────────────── */

export default function ProfilDosenPage() {
  const [profile, setProfile] = useState(emptyProfile);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState({ visible: false, message: "", type: "success" });
  const [avatar, setAvatar] = useState(null);
  const [newSkill, setNewSkill] = useState("");
  const [expertise, setExpertise] = useState([]);
  const [userFromToken, setUserFromToken] = useState({ name: "", email: "" });

  const set = (k, v) => setProfile((p) => ({ ...p, [k]: v }));

  const showToast = (message, type = "success") => {
    setToast({ visible: true, message, type });
    setTimeout(() => setToast((t) => ({ ...t, visible: false })), 2800);
  };

  useEffect(() => {
    const fetchProfileDosen = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) { window.location.href = "/login"; return; }

        let userName = "";
        let userEmail = "";
        try {
          const meRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/me`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (meRes.ok) {
            const meData = await meRes.json();
            userName = meData.data?.name || meData.user?.name || meData.name || "";
            userEmail = meData.data?.email || meData.user?.email || meData.email || "";
          }
        } catch {
          const payload = decodeJwt(token);
          userName = payload?.name || "";
          userEmail = payload?.email || "";
        }
        setUserFromToken({ name: userName, email: userEmail });

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/dosen/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const result = await response.json();

        if (!response.ok) {
          setProfile({ ...emptyProfile, name: userName, email: userEmail });
          setExpertise([]);
          setAvatar(null);
          setLoading(false);
          return;
        }

        const data = result.data;
        if (data) {
          setProfile({
            name: data.name || userName || "",
            nip: data.nip || "",
            nidn: data.nidn || "",
            position: data.position || "",
            rank: data.rank || "",
            department: data.department || "",
            faculty: data.faculty || "",
            email: data.email || userEmail || "",
            phone: data.phone || "",
            office: data.office || "",
            bio: data.bio || "",
          });
          setAvatar(data.avatar || null);
          setExpertise(data.expertises || []);
        }
        setLoading(false);
      } catch (error) {
        console.log("Gagal mengambil profil dosen:", error);
        setLoading(false);
      }
    };
    fetchProfileDosen();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/dosen/profile`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ profile, expertise, avatar }),
      });
      const result = await response.json();
      if (!response.ok) { showToast(result.message || "Gagal menyimpan profil dosen", "error"); return; }
      showToast("Profil berhasil diperbarui", "success");
    } catch {
      showToast("Tidak bisa terhubung ke server", "error");
    } finally {
      setSaving(false);
    }
  };

  const addSkill = () => {
    const v = newSkill.trim();
    if (!v || expertise.find((s) => s.tag === v)) { setNewSkill(""); return; }
    setExpertise((prev) => [...prev, { id: uid(), tag: v }]);
    setNewSkill("");
  };
  const removeSkill = (id) => setExpertise((prev) => prev.filter((s) => s.id !== id));

  const initials = getInitials(profile.name || userFromToken.name);
  const profileBelumLengkap = !profile.nip && !profile.nidn && !profile.department;

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
        title="Profil Dosen"
        subtitle="Kelola informasi profil dan data akademik kamu"
        iconBg="bg-[#EFF6FF]"
        iconBorder="border-[#93C5FD]"
        iconColor="text-[#0A66C2]"
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

      <div className="px-6 py-6 flex flex-col gap-5 max-w-[1180px] mx-auto w-full">

        {/* Banner profil belum lengkap */}
        {profileBelumLengkap && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl px-5 py-3.5 flex items-center gap-3 flex-wrap">
            <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
              <AlertCircle size={15} />
            </div>
            <p className="text-[12px] text-amber-800 m-0 flex-1">
              Profil belum lengkap. Lengkapi NIP, NIDN, dan program studi agar fitur <strong>Bimbingan Mahasiswa</strong> dapat digunakan.
            </p>
          </div>
        )}

        <div className="flex gap-5 items-start">

          {/* ── LEFT ── */}
          <div className="flex-1 min-w-0 flex flex-col gap-5">

            {/* Hero card */}
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
                  <ProfileAvatar initials={initials} photoUrl={avatar} onPhotoChange={setAvatar} size={88} />
                </div>
                <div className="flex-1 min-w-0 pt-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-[17px] font-extrabold text-slate-900 m-0 leading-tight truncate">
                      {profile.name || userFromToken.name || <span className="text-slate-400 italic font-normal text-[14px]">Nama belum diisi</span>}
                    </h3>
                    {profile.rank && (
                      <span className="text-[10px] font-bold text-[#0A66C2] bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100 uppercase tracking-wide whitespace-nowrap">
                        {profile.rank}
                      </span>
                    )}
                  </div>
                  <p className="text-[12.5px] text-[#0A66C2] font-semibold m-0 mt-1">{profile.position || "Peran belum diisi"}</p>
                  <p className="text-[12px] text-slate-500 m-0 mt-0.5">
                    {profile.department || "Program studi belum diisi"} · {profile.faculty || "Fakultas belum diisi"}
                  </p>
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
                      reader.onload = (ev) => setAvatar(ev.target.result);
                      reader.readAsDataURL(file);
                    }}
                  />
                  <p className="text-[10px] text-slate-400 m-0">PNG/JPG · maks 2MB</p>
                </div>
              </div>
              {/* Quick stats */}
              <div className="border-t border-slate-100 px-5 py-4 grid grid-cols-2 gap-3">
                <div className="flex items-start gap-2 px-1">
                  <div className="w-7 h-7 rounded-lg bg-[#EFF6FF] flex items-center justify-center flex-shrink-0 mt-[1px]">
                    <IdCard size={13} className="text-[#0A66C2]" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider m-0">NIP</p>
                    <p className={`text-[12.5px] font-semibold m-0 mt-0.5 truncate ${profile.nip ? "text-slate-800" : "text-slate-400 italic"}`}>{profile.nip || "—"}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2 px-1">
                  <div className="w-7 h-7 rounded-lg bg-[#EFF6FF] flex items-center justify-center flex-shrink-0 mt-[1px]">
                    <IdCard size={13} className="text-[#0A66C2]" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider m-0">NIDN</p>
                    <p className={`text-[12.5px] font-semibold m-0 mt-0.5 truncate ${profile.nidn ? "text-slate-800" : "text-slate-400 italic"}`}>{profile.nidn || "—"}</p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Informasi Pribadi */}
            <Card className="p-6">
              <SectionHead title="Informasi Pribadi" sub="Data diri utama yang tampil pada halaman profil" />
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <Field label="Nama Lengkap & Gelar" required>
                    <TextInput value={profile.name} onChange={(v) => set("name", v)} placeholder="Dr. Nama Lengkap, M.Kom." prefix={<User size={13} />} />
                  </Field>
                </div>
                <Field label="Jabatan Fungsional">
                  <TextInput value={profile.rank} onChange={(v) => set("rank", v)} placeholder="Lektor Kepala" prefix={<Award size={13} />} />
                </Field>
                <Field label="Peran">
                  <TextInput value={profile.position} onChange={(v) => set("position", v)} placeholder="Dosen Pembimbing" prefix={<GraduationCap size={13} />} />
                </Field>
              </div>
            </Card>

            {/* Data Akademik */}
            <Card className="p-6">
              <SectionHead title="Data Akademik" sub="Informasi akademik yang disinkronkan dengan sistem kampus" />
              <div className="grid grid-cols-2 gap-4">
                <Field label="NIP">
                  <TextInput value={profile.nip} onChange={(v) => set("nip", v)} placeholder="Nomor Induk Pegawai" prefix={<IdCard size={13} />} />
                </Field>
                <Field label="NIDN">
                  <TextInput value={profile.nidn} onChange={(v) => set("nidn", v)} placeholder="Nomor Induk Dosen Nasional" prefix={<IdCard size={13} />} />
                </Field>
                <Field label="Program Studi">
                  <TextInput value={profile.department} onChange={(v) => set("department", v)} placeholder="Teknik Informatika" prefix={<GraduationCap size={13} />} />
                </Field>
                <Field label="Fakultas">
                  <TextInput value={profile.faculty} onChange={(v) => set("faculty", v)} placeholder="Ilmu Komputer" prefix={<Building size={13} />} />
                </Field>
              </div>
            </Card>

            {/* Tentang */}
            <Card className="p-6">
              <SectionHead title="Tentang Saya" sub="Bio singkat yang tampil di halaman profil publik" />
              <Field label="Bio Singkat" hint="Ceritakan latar belakang, riset, dan fokus pengajaran kamu (maks 500 karakter)">
                <TextArea
                  value={profile.bio}
                  onChange={(v) => set("bio", v)}
                  rows={4}
                  maxLength={500}
                  placeholder="Ceritakan latar belakang akademik, bidang riset, dan minat pengajaran kamu…"
                />
              </Field>
            </Card>

            {/* Bidang Keahlian */}
            <Card className="p-6">
              <SectionHead title="Bidang Keahlian" sub="Tambahkan bidang keahlian yang relevan dengan riset dan pengajaran kamu" />
              <div className="flex gap-1.5 flex-wrap mb-4">
                {expertise.map((ex) => (
                  <Tag key={ex.id} onRemove={() => removeSkill(ex.id)}>{ex.tag}</Tag>
                ))}
                {expertise.length === 0 && <span className="text-[12px] text-slate-400">Belum ada keahlian ditambahkan</span>}
              </div>
              <div className="flex gap-2 max-w-[440px]">
                <input
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addSkill())}
                  placeholder="Tambah bidang keahlian… (tekan Enter)"
                  maxLength={48}
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

            {/* Detail Tambahan (editable) */}
            <SideCard title="Detail Tambahan">
              <MiniField icon={<Mail size={12} />} label="Email" value={profile.email} onChange={(v) => set("email", v)} placeholder="dosen@kampus.ac.id" />
              <MiniField icon={<Phone size={12} />} label="Nomor Telepon" value={profile.phone} onChange={(v) => set("phone", v)} placeholder="+62 812 3456 7890" />
              <MiniField icon={<Building size={12} />} label="Ruang Kerja" value={profile.office} onChange={(v) => set("office", v)} placeholder="Gedung A, Ruang 204" />
            </SideCard>

            {/* Ringkasan Akademik */}
            <SideCard title="Ringkasan Akademik">
              <InfoRow icon={<GraduationCap size={12} className="text-[#0A66C2]" />} label="Program Studi" value={profile.department} />
              <InfoRow icon={<Building size={12} className="text-[#0A66C2]" />} label="Fakultas" value={profile.faculty} />
              <InfoRow icon={<Award size={12} className="text-[#0A66C2]" />} label="Jabatan Fungsional" value={profile.rank} />
              <InfoRow icon={<BookOpen size={12} className="text-[#0A66C2]" />} label="Peran" value={profile.position} />
            </SideCard>

            {/* Tips */}
            <div className="rounded-2xl p-4 border border-[#d6e8f7]" style={{ background: "linear-gradient(160deg, #dbeeff 0%, #e8f3ff 60%, #d4e9fb 100%)" }}>
              <div className="flex items-center gap-2 mb-1.5">
                <Award size={14} className="text-[#0A66C2]" />
                <p className="text-[12px] font-bold text-slate-900 m-0">Tips Profil</p>
              </div>
              <p className="text-[11.5px] text-slate-600 leading-relaxed m-0">
                Lengkapi NIP, NIDN, dan bidang keahlian agar mahasiswa lebih mudah menemukan dosen pembimbing yang sesuai.
              </p>
            </div>
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
              : <><Save size={14} /> Simpan Perubahan</>}
          </button>
        </div>
      </div>
    </div>
  );
}