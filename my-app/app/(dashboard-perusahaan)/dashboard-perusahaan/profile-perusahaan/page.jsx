"use client";

import { useEffect, useState, useRef } from "react";
import {
  Globe, Building2, MapPin, Users, Briefcase, Calendar, Award,
  Star, Image as ImageIcon, Save, Plus, Trash2, X, Pencil,
  CheckCircle, AlertCircle, Camera, Upload, ChevronDown, Phone, User,
} from "lucide-react";
import Topbar from "../../components/topbar";

// ── Icons ────────────────────────────────────────────────────────────────────
function LinkedInIcon({ size = 12, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

function InstagramIcon({ size = 12, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
    </svg>
  );
}

// ── Initial Data ─────────────────────────────────────────────────────────────
const initialCompany = {
  name: "",
  descriptionShort: "",
  logo: "MT",
  location: "",
  industry: "",
  size: "1–10 karyawan",
  founded: "",
  website: "",
  linkedin: "",
  instagram: "",
  telepon: "",
  namaCP: "",
  jabatanCP: "",
  description: "",
  culture: "",
  cultureValues: [],
};

const SIZES = ["1–10 karyawan", "11–50 karyawan", "51–200 karyawan", "201–500 karyawan", "500+ karyawan"];

const TABS = [
  { id: "umum",    label: "Informasi Umum",      icon: Building2 },
  { id: "detail",  label: "Deskripsi & Kultur",  icon: Users },
  { id: "kontak",  label: "Kontak & Sosial",     icon: Globe },
  { id: "cp",      label: "Contact Person",      icon: User },
  { id: "galeri",  label: "Galeri",              icon: ImageIcon },
];

// ── Primitives ────────────────────────────────────────────────────────────────
function Card({ children, className = "" }) {
  return (
    <div className={`bg-white border border-slate-200 rounded-2xl p-6 ${className}`}>
      {children}
    </div>
  );
}

function SectionHead({ title, sub, action }) {
  return (
    <div className="mb-4 pb-3.5 border-b border-slate-100 flex items-start justify-between gap-3">
      <div>
        <h2 className="text-sm font-bold text-slate-900 m-0 flex items-center gap-2">
          <span className="w-1 h-4 bg-[#0A66C2] rounded-full inline-block" />
          {title}
        </h2>
        {sub && <p className="text-xs text-slate-400 mt-0.5 ml-3">{sub}</p>}
      </div>
      {action}
    </div>
  );
}

function Field({ label, children, hint, required }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[12px] font-semibold text-slate-700 flex items-center gap-1">
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

function TextInput({ value, onChange, placeholder, maxLength, prefix, type = "text" }) {
  return (
    <div className="relative flex items-center">
      {prefix && (
        <span className="absolute left-3.5 flex items-center text-slate-400">{prefix}</span>
      )}
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        maxLength={maxLength}
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

function Select({ value, onChange, options }) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`${inputClass} appearance-none pr-9 cursor-pointer`}
      >
        {options.map((o) => (
          <option key={o} value={o}>{o}</option>
        ))}
      </select>
      <ChevronDown size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
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

// ── VerificationBadge: badge status verifikasi yang dinamis ──────────────────
// Mengikuti nilai statusVerifikasi dari backend: "DITERIMA" | "MENUNGGU" | "DITOLAK"
function VerificationBadge({ status, size = "default" }) {
  const config = {
    DITERIMA: {
      label: "Terverifikasi",
      bg: "bg-green-50",
      border: "border-green-100",
      text: "text-green-700",
      Icon: CheckCircle,
      iconClass: "fill-green-700",
    },
    MENUNGGU: {
      label: "Menunggu Verifikasi",
      bg: "bg-amber-50",
      border: "border-amber-100",
      text: "text-amber-700",
      Icon: AlertCircle,
      iconClass: "",
    },
    DITOLAK: {
      label: "Verifikasi Ditolak",
      bg: "bg-red-50",
      border: "border-red-100",
      text: "text-red-700",
      Icon: X,
      iconClass: "",
    },
  };

  const c = config[status] || config.MENUNGGU;
  const isSmall = size === "sm";
  const iconSize = isSmall ? 8 : 11;
  const textSize = isSmall ? "text-[9.5px]" : "text-[11px]";
  const padding = isSmall ? "px-1.5 py-0.5" : "px-2.5 py-1.5";

  return (
    <span
      className={`inline-flex items-center gap-1 ${c.bg} border ${c.border} ${c.text} ${textSize} font-semibold ${padding} rounded-lg shrink-0 whitespace-nowrap`}
    >
      <c.Icon size={iconSize} className={c.iconClass} />
      {c.label}
    </span>
  );
}

// ── LogoDisplay: tampilkan logo (inisial teks atau URL gambar) ────────────────
function LogoDisplay({ logo, size = "w-20 h-20", textSize = "text-2xl" }) {
  const isUrl = logo && (logo.startsWith("http") || logo.startsWith("/") || logo.startsWith("data:"));
  if (isUrl) {
    return (
      <div className={`${size} rounded-2xl overflow-hidden border border-[#0A66C2]/10 bg-[#E8F0FE] shrink-0`}>
        <img src={logo} alt="Logo" className="w-full h-full object-cover" />
      </div>
    );
  }
  return (
    <div className={`${size} rounded-2xl bg-[#E8F0FE] flex items-center justify-center font-extrabold text-[#1A73E8] ${textSize} border border-[#0A66C2]/10 shrink-0`}>
      {logo || "CO"}
    </div>
  );
}

// ── Gallery Item ──────────────────────────────────────────────────────────────
function GalleryItem({ item, onUpdate, onRemove }) {
  const [editing, setEditing] = useState(false);
  const [draftLabel, setDraftLabel] = useState(item.label);
  const fileRef = useRef(null);

  const handleReplace = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => onUpdate(item.id, { image: reader.result });
    reader.readAsDataURL(file);
  };

  return (
    <div className="rounded-2xl border border-slate-200 overflow-hidden group bg-white">
      <div className="aspect-[4/3] relative bg-slate-100">
        <img src={item.image} alt={item.label} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/0 to-transparent" />
        <div className="absolute top-2 right-2 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
          <button
            onClick={() => fileRef.current?.click()}
            className="w-7 h-7 rounded-lg bg-white/90 flex items-center justify-center text-slate-600 hover:text-[#0A66C2] cursor-pointer"
            title="Ganti foto"
          >
            <Camera size={13} />
          </button>
          <button
            onClick={() => onRemove(item.id)}
            className="w-7 h-7 rounded-lg bg-white/90 flex items-center justify-center text-slate-500 hover:text-red-600 cursor-pointer"
            title="Hapus"
          >
            <Trash2 size={13} />
          </button>
        </div>
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleReplace} />
        <div className="absolute bottom-2 left-2 right-2">
          <span className="text-[11px] font-semibold text-white/95 drop-shadow">{item.label}</span>
        </div>
      </div>
      <div className="p-2.5">
        {editing ? (
          <div className="flex gap-1.5">
            <input
              value={draftLabel}
              onChange={(e) => setDraftLabel(e.target.value)}
              className="flex-1 px-2 py-1.5 rounded-lg border border-slate-200 text-[11.5px] outline-none focus:border-[#0A66C2]"
              autoFocus
            />
            <button
              onClick={() => { onUpdate(item.id, { label: draftLabel }); setEditing(false); }}
              className="px-2.5 py-1.5 rounded-lg bg-[#0A66C2] text-white text-[11px] font-semibold cursor-pointer"
            >
              OK
            </button>
          </div>
        ) : (
          <button
            onClick={() => setEditing(true)}
            className="flex items-center justify-center gap-1.5 text-[11px] font-medium text-slate-500 hover:text-[#0A66C2] py-1 cursor-pointer w-full"
          >
            <Pencil size={10} /> Ubah label
          </button>
        )}
      </div>
    </div>
  );
}

function AddGalleryTile({ onAdd }) {
  const fileRef = useRef(null);

  const handleFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => { onAdd(reader.result); };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  return (
    <button
      onClick={() => fileRef.current?.click()}
      className="aspect-[4/3] rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center gap-2 text-slate-400 hover:border-[#0A66C2] hover:text-[#0A66C2] hover:bg-[#0A66C2]/5/40 transition-colors duration-150 cursor-pointer"
    >
      <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
      <Upload size={20} />
      <span className="text-[12px] font-semibold">Tambah Foto</span>
    </button>
  );
}

// ── Logo Inisial helper ───────────────────────────────────────────────────────
function getInitials(name) {
  if (!name) return "CO";
  const words = name.trim().split(/\s+/);
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return (words[0][0] + words[1][0]).toUpperCase();
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function CompanyProfileDashboard() {
  const [activeTab, setActiveTab] = useState("umum");
  const [company, setCompany] = useState(initialCompany);
  const [gallery, setGallery] = useState([]);
  const [newValue, setNewValue] = useState("");
  const [toast, setToast] = useState({ visible: false, message: "", type: "success" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef(null);

  // ── Status verifikasi: ikut data dari backend (DITERIMA | MENUNGGU | DITOLAK) ──
  const [statusVerifikasi, setStatusVerifikasi] = useState("MENUNGGU");
  const [catatanVerifikasi, setCatatanVerifikasi] = useState("");

  const set = (key, value) => setCompany((c) => ({ ...c, [key]: value }));

  // ── Auto-generate logo inisial saat nama berubah (hanya jika logo masih berupa inisial) ──
  const handleNameChange = (v) => {
    set("name", v);
    const isUrl = company.logo && (company.logo.startsWith("http") || company.logo.startsWith("data:") || company.logo.startsWith("/"));
    if (!isUrl) {
      set("logo", getInitials(v));
    }
  };

  const showToast = (message, type = "success") => {
    setToast({ visible: true, message, type });
    setTimeout(() => setToast((t) => ({ ...t, visible: false })), 2800);
  };

  const validate = () => {
    const e = {};
    if (!company.name.trim()) e.name = "Nama perusahaan wajib diisi";
    if (!company.location.trim()) e.location = "Lokasi wajib diisi";
    if (!company.industry.trim()) e.industry = "Industri wajib diisi";
    if (company.descriptionShort.length > 180) e.descriptionShort = "Maksimal 180 karakter";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  // ── Fetch profil saat mount ───────────────────────────────────────────────
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) { window.location.href = "/login"; return; }

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/perusahaan/profile`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const result = await res.json();

        if (!res.ok) { console.warn(result.message); return; }

        const d = result.data;
        if (d) {
          setCompany({
            name:             d.nama             || "",
            descriptionShort: d.deskripsiSingkat || "",
            logo:             d.logo             || getInitials(d.nama),
            location:         d.alamat           || "",
            industry:         d.bidang           || "",
            size:             d.ukuran           || "1–10 karyawan",
            founded:          d.tahunBerdiri     || "",
            website:          d.website          || "",
            linkedin:         d.linkedin         || "",
            instagram:        d.instagram        || "",
            telepon:          d.telepon          || "",
            namaCP:           d.namaCP           || "",
            jabatanCP:        d.jabatanCP        || "",
            description:      d.deskripsi        || "",
            culture:          d.kultur           || "",
            cultureValues:    Array.isArray(d.nilaiKultur) ? d.nilaiKultur : [],
          });

          // ── Set status verifikasi dari data backend ──
          setStatusVerifikasi(d.statusVerifikasi || "MENUNGGU");
          setCatatanVerifikasi(d.catatanVerifikasi || "");

          if (d.galeri?.length > 0) {
            setGallery(
              d.galeri.map((item) => ({
                id:    item.id.toString(),
                image: item.image,
                label: item.label,
              }))
            );
          }
        }
      } catch (err) {
        console.error("Gagal mengambil profil:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // ── Save ──────────────────────────────────────────────────────────────────
  const handleSave = async () => {
    if (!validate()) { setActiveTab("umum"); return; }

    setSaving(true);
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/perusahaan/profile`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            nama:             company.name,
            deskripsiSingkat: company.descriptionShort,
            logo:             company.logo,
            bidang:           company.industry,
            alamat:           company.location,
            telepon:          company.telepon,
            ukuran:           company.size,
            tahunBerdiri:     company.founded,
            website:          company.website,
            linkedin:         company.linkedin,
            instagram:        company.instagram,
            namaCP:           company.namaCP,
            jabatanCP:        company.jabatanCP,
            deskripsi:        company.description,
            kultur:           company.culture,
            nilaiKultur:      company.cultureValues,
            galeri:           gallery,
          }),
        }
      );

      const result = await res.json();
      if (!res.ok) {
        showToast(result.message || "Gagal menyimpan profil", "error");
        return;
      }

      // ── Sinkronkan ulang status verifikasi setelah simpan (kalau backend mengembalikannya) ──
      if (result.data?.statusVerifikasi) {
        setStatusVerifikasi(result.data.statusVerifikasi);
      }
      if (result.data?.catatanVerifikasi !== undefined) {
        setCatatanVerifikasi(result.data.catatanVerifikasi || "");
      }

      showToast("Profil perusahaan berhasil disimpan", "success");
    } catch (err) {
      showToast("Tidak bisa terhubung ke server", "error");
    } finally {
      setSaving(false);
    }
  };

  // ── Logo upload ───────────────────────────────────────────────────────────
  const handleLogoFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => set("logo", reader.result);
    reader.readAsDataURL(file);
  };

  // ── Culture values ────────────────────────────────────────────────────────
  const addCultureValue = () => {
    const v = newValue.trim();
    if (!v || company.cultureValues.includes(v)) { setNewValue(""); return; }
    set("cultureValues", [...company.cultureValues, v]);
    setNewValue("");
  };
  const removeCultureValue = (v) =>
    set("cultureValues", company.cultureValues.filter((x) => x !== v));

  // ── Gallery ───────────────────────────────────────────────────────────────
  const addGalleryItem = (imageUrl) =>
    setGallery((g) => [...g, { id: `g${Date.now()}`, image: imageUrl, label: "Foto baru" }]);
  const updateGalleryItem = (id, patch) =>
    setGallery((g) => g.map((it) => (it.id === id ? { ...it, ...patch } : it)));
  const removeGalleryItem = (id) =>
    setGallery((g) => g.filter((it) => it.id !== id));

  // ── Error tab indicator ───────────────────────────────────────────────────
  const tabHasError = (tabId) => {
    if (tabId === "umum") return !!(errors.name || errors.location || errors.industry || errors.descriptionShort);
    return false;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-[#0A66C2] border-t-transparent animate-spin" />
          <p className="text-[13px] text-slate-500">Memuat profil perusahaan…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-[#0A66C2]/5/20 to-white font-sans text-slate-900">

     <Topbar
        icon={<Building2 size={17} />}
        title="Profil Perusahaan"
        subtitle="Kelola informasi dan tampilan profil perusahaan kamu"
        iconBg="bg-[#E8F0FE]"
        iconBorder="border-[#93C5FD]"
        iconColor="text-[#0A66C2]"
        rightSlot={
          <button className="flex items-center gap-2 px-4 py-2 border border-[#0A66C2]/40 rounded-xl text-[#0A66C2] text-[12.5px] font-semibold bg-transparent transition-all duration-150 hover:bg-[#0958A8] hover:text-white hover:border-[#0A66C2] cursor-pointer">
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
      {statusVerifikasi === "DITOLAK" && (
        <div className="px-6 pt-4">
          <div className="rounded-xl p-4 bg-red-50 border border-red-100 flex gap-3">
            <AlertCircle size={16} className="text-red-500 shrink-0 mt-0.5" />
            <div>
              <p className="text-[12.5px] font-semibold text-red-700 m-0 mb-1">Verifikasi Ditolak</p>
              <p className="text-[12px] text-red-600 m-0 leading-relaxed">
                {catatanVerifikasi || "Profil perusahaan Anda ditolak oleh admin. Silakan perbarui data dan hubungi admin untuk verifikasi ulang."}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ── Tabs ── */}
      <div className="sticky top-0 z-40 bg-white/98 backdrop-blur-xl border-b border-slate-200">
        <div className="px-6 flex items-center justify-between gap-4 flex-wrap">
          <div className="flex overflow-x-auto [&::-webkit-scrollbar]:hidden -mb-px">
            {TABS.map((tab) => {
              const isActive = activeTab === tab.id;
              const Icon = tab.icon;
              const hasError = tabHasError(tab.id);
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-5 py-3.5 text-[13px] whitespace-nowrap border-none bg-transparent cursor-pointer transition-all duration-150 border-b-[2.5px] -mb-px
                    ${isActive
                      ? "font-semibold text-[#0A66C2] border-[#0A66C2]"
                      : "font-medium text-slate-500 border-transparent hover:text-slate-800 hover:border-slate-300"
                    }`}
                >
                  <Icon size={15} className={isActive ? "text-[#0A66C2]" : "text-slate-400"} />
                  {tab.label}
                  {hasError && <AlertCircle size={12} className="text-red-500" />}
                </button>
              );
            })}
          </div>
          <span className="hidden sm:flex">
            <VerificationBadge status={statusVerifikasi} />
          </span>
        </div>
      </div>

      {/* ── Body ── */}
      <div className="px-6 py-6 flex gap-5 items-start">
        {/* Left: forms */}
        <div className="flex-1 min-w-0 flex flex-col gap-5">

          {/* ── Tab: Informasi Umum ── */}
          {activeTab === "umum" && (
            <>
              {/* Logo */}
              <Card>
                <SectionHead title="Logo Perusahaan" sub="Logo tampil di profil publik dan daftar lowongan" />
                <div className="flex items-center gap-5">
                  <LogoDisplay logo={company.logo} />
                  <div className="flex flex-col gap-2.5">
                    <div className="flex gap-2">
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="px-4 py-2 rounded-xl text-[12.5px] font-semibold cursor-pointer bg-white border border-slate-200 text-slate-700 hover:border-[#0A66C2] hover:text-[#0A66C2] transition-colors flex items-center gap-1.5"
                      >
                        <Upload size={13} /> Unggah Gambar
                      </button>
                    </div>
                    <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleLogoFile} />
                    <div className="flex flex-col gap-1">
                      <p className="text-[11px] text-slate-400 m-0">PNG atau JPG, rasio 1:1, maks 2MB</p>
                      <p className="text-[11px] text-slate-400 m-0">
                        Inisial saat ini: <span className="font-semibold text-slate-600">{getInitials(company.name)}</span>
                        {" "}— digunakan jika tidak ada logo gambar
                      </p>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Informasi Dasar */}
              <Card>
                <SectionHead title="Informasi Dasar" sub="Data utama yang tampil di halaman profil perusahaan" />
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <Field label="Nama Perusahaan" required>
                      <TextInput
                        value={company.name}
                        onChange={handleNameChange}
                        placeholder="Contoh: PT Mitra Teknologi Pradana"
                      />
                      {errors.name && <p className="text-[11px] text-red-600 m-0 mt-1">{errors.name}</p>}
                    </Field>
                  </div>

                  <div className="col-span-2">
                    <Field label="Deskripsi Singkat" required hint="Ringkasan 1–2 kalimat, tampil di bawah nama perusahaan (maks 180 karakter)">
                      <TextArea
                        value={company.descriptionShort}
                        onChange={(v) => set("descriptionShort", v)}
                        rows={2}
                        maxLength={180}
                        placeholder="Jelaskan secara singkat bidang usaha perusahaan Anda"
                      />
                      {errors.descriptionShort && <p className="text-[11px] text-red-600 m-0 mt-1">{errors.descriptionShort}</p>}
                    </Field>
                  </div>

                  <Field label="Lokasi / Alamat" required>
                    <TextInput
                      value={company.location}
                      onChange={(v) => set("location", v)}
                      placeholder="Kota, Provinsi"
                      prefix={<MapPin size={13} />}
                    />
                    {errors.location && <p className="text-[11px] text-red-600 m-0 mt-1">{errors.location}</p>}
                  </Field>

                  <Field label="Industri / Bidang" required>
                    <TextInput
                      value={company.industry}
                      onChange={(v) => set("industry", v)}
                      placeholder="Contoh: Information Technology & Services"
                      prefix={<Briefcase size={13} />}
                    />
                    {errors.industry && <p className="text-[11px] text-red-600 m-0 mt-1">{errors.industry}</p>}
                  </Field>

                  <Field label="Ukuran Perusahaan">
                    <Select value={company.size} onChange={(v) => set("size", v)} options={SIZES} />
                  </Field>

                  <Field label="Tahun Berdiri">
                    <TextInput
                      value={company.founded}
                      onChange={(v) => set("founded", v.replace(/\D/g, "").slice(0, 4))}
                      placeholder="2019"
                      prefix={<Calendar size={13} />}
                    />
                  </Field>
                </div>
              </Card>
            </>
          )}

          {/* ── Tab: Deskripsi & Kultur ── */}
          {activeTab === "detail" && (
            <>
              <Card>
                <SectionHead title="Tentang Perusahaan" sub="Profil lengkap yang tampil pada tab Deskripsi di halaman publik" />
                <Field label="Deskripsi Perusahaan" hint="Pisahkan paragraf dengan baris kosong">
                  <TextArea
                    value={company.description}
                    onChange={(v) => set("description", v)}
                    rows={8}
                    placeholder="Ceritakan tentang perusahaan Anda, visi, misi, dan layanan yang ditawarkan…"
                  />
                </Field>
              </Card>

              <div
                className="rounded-2xl p-6 border border-[#d6e8f7]"
                style={{ background: "linear-gradient(160deg, #dbeeff 0%, #e8f3ff 60%, #d4e9fb 100%)" }}
              >
                <SectionHead title="Kultur Perusahaan" sub="Ceritakan budaya kerja dan nilai-nilai tim Anda" />
                <Field label="Deskripsi Kultur">
                  <TextArea
                    value={company.culture}
                    onChange={(v) => set("culture", v)}
                    rows={4}
                    placeholder="Deskripsikan lingkungan kerja, budaya, dan nilai yang dijunjung perusahaan…"
                  />
                </Field>

                <div className="mt-4">
                  <Field label="Nilai-Nilai Perusahaan" hint="Tag pendek yang menggambarkan budaya kerja, contoh: Inovatif, Kolaboratif">
                    <div className="flex gap-1.5 flex-wrap mb-2.5">
                      {company.cultureValues.map((v) => (
                        <Tag key={v} onRemove={() => removeCultureValue(v)}>{v}</Tag>
                      ))}
                      {company.cultureValues.length === 0 && (
                        <span className="text-[12px] text-slate-400">Belum ada nilai ditambahkan</span>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <input
                        value={newValue}
                        onChange={(e) => setNewValue(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addCultureValue())}
                        placeholder="Tambah nilai baru… (tekan Enter)"
                        maxLength={24}
                        className="flex-1 px-3.5 py-2 rounded-xl border border-[#bfdbfe] bg-white/80 text-[13px] outline-none focus:border-[#0A66C2]"
                      />
                      <button
                        onClick={addCultureValue}
                        className="px-4 py-2 rounded-xl bg-white border border-[#bfdbfe] text-[#0A66C2] text-[12.5px] font-semibold cursor-pointer hover:bg-[#0A66C2]/5 transition-colors flex items-center gap-1.5"
                      >
                        <Plus size={13} /> Tambah
                      </button>
                    </div>
                  </Field>
                </div>
              </div>
            </>
          )}

          {/* ── Tab: Kontak & Sosial ── */}
          {activeTab === "kontak" && (
            <Card>
              <SectionHead title="Kontak & Media Sosial" sub="Tautan ini akan tampil pada tab Kontak halaman profil publik" />
              <div className="grid grid-cols-1 gap-4 max-w-[520px]">
                <Field label="Nomor Telepon">
                  <TextInput
                    value={company.telepon}
                    onChange={(v) => set("telepon", v)}
                    placeholder="+62 812 3456 7890"
                    prefix={<Phone size={13} />}
                    type="tel"
                  />
                </Field>
                <Field label="Website">
                  <TextInput
                    value={company.website}
                    onChange={(v) => set("website", v)}
                    placeholder="www.namaperusahaan.co.id"
                    prefix={<Globe size={13} />}
                  />
                </Field>
                <Field label="LinkedIn">
                  <TextInput
                    value={company.linkedin}
                    onChange={(v) => set("linkedin", v)}
                    placeholder="linkedin.com/company/nama-perusahaan"
                    prefix={<LinkedInIcon size={13} />}
                  />
                </Field>
                <Field label="Instagram">
                  <TextInput
                    value={company.instagram}
                    onChange={(v) => set("instagram", v)}
                    placeholder="@namaperusahaan"
                    prefix={<InstagramIcon size={13} />}
                  />
                </Field>
              </div>
            </Card>
          )}

          {/* ── Tab: Contact Person ── */}
          {activeTab === "cp" && (
            <Card>
              <SectionHead
                title="Contact Person"
                sub="Informasi penanggung jawab yang dapat dihubungi oleh pelamar atau tim admin"
              />
              <div className="grid grid-cols-1 gap-4 max-w-[520px]">
                <Field label="Nama Penanggung Jawab">
                  <TextInput
                    value={company.namaCP}
                    onChange={(v) => set("namaCP", v)}
                    placeholder="Contoh: Budi Santoso"
                    prefix={<User size={13} />}
                  />
                </Field>
                <Field label="Jabatan">
                  <TextInput
                    value={company.jabatanCP}
                    onChange={(v) => set("jabatanCP", v)}
                    placeholder="Contoh: HR Manager"
                    prefix={<Briefcase size={13} />}
                  />
                </Field>
              </div>

              {/* Info card */}
              <div className="mt-5 p-4 rounded-xl bg-[#0A66C2]/5 border border-[#0A66C2]/10 flex gap-3">
                <AlertCircle size={16} className="text-[#0A66C2] shrink-0 mt-0.5" />
                <p className="text-[12px] text-slate-600 m-0 leading-relaxed">
                  Data contact person hanya digunakan untuk keperluan komunikasi internal antara perusahaan dengan tim
                  admin platform. Informasi ini <strong>tidak ditampilkan</strong> di halaman profil publik.
                </p>
              </div>
            </Card>
          )}

          {/* ── Tab: Galeri ── */}
          {activeTab === "galeri" && (
            <Card>
              <SectionHead
                title="Galeri Perusahaan"
                sub={`${gallery.length} foto — Tampil pada tab Galeri di halaman profil publik`}
              />
              {gallery.length === 0 && (
                <div className="mb-4 p-4 rounded-xl bg-amber-50 border border-amber-100 flex gap-3">
                  <AlertCircle size={15} className="text-amber-500 shrink-0 mt-0.5" />
                  <p className="text-[12px] text-amber-700 m-0">
                    Belum ada foto galeri. Tambahkan foto kegiatan atau suasana kantor untuk menarik lebih banyak pelamar.
                  </p>
                </div>
              )}
              <div className="grid grid-cols-[repeat(auto-fill,minmax(180px,1fr))] gap-3">
                {gallery.map((item) => (
                  <GalleryItem key={item.id} item={item} onUpdate={updateGalleryItem} onRemove={removeGalleryItem} />
                ))}
                <AddGalleryTile onAdd={addGalleryItem} />
              </div>
            </Card>
          )}
        </div>

        {/* ── Sidebar: Live Preview ── */}
        <div className="w-[280px] shrink-0 flex flex-col gap-3 sticky top-[114px]">
          <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest m-0 ml-1">
            Pratinjau Halaman Profil
          </p>
          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
            {/* Banner */}
            <div
              className="h-24"
              style={{ background: "linear-gradient(160deg, #dbeeff 0%, #e8f3ff 50%, #d4e9fb 100%)" }}
            />
            <div className="px-4 pb-4 -mt-7">
              {/* Logo preview */}
              <div className="mb-2">
                <LogoDisplay logo={company.logo} size="w-14 h-14" textSize="text-lg" />
              </div>

              <div className="flex items-center gap-1.5 flex-wrap mb-1">
                <h3 className="text-[13px] font-extrabold text-slate-900 m-0 leading-tight">
                  {company.name || "Nama Perusahaan"}
                </h3>
              </div>

              <div className="mb-2">
                <VerificationBadge status={statusVerifikasi} size="sm" />
              </div>

              <p className="text-[11px] text-slate-500 leading-relaxed m-0 mb-2.5 line-clamp-3">
                {company.descriptionShort || "Deskripsi singkat perusahaan akan tampil di sini."}
              </p>
              <div className="flex flex-col gap-1.5 text-[11px] text-slate-500">
                <span className="flex items-center gap-1.5">
                  <MapPin size={11} className="text-[#0A66C2]" />
                  {company.location || "—"}
                </span>
                <span className="flex items-center gap-1.5">
                  <Briefcase size={11} className="text-[#0A66C2]" />
                  {company.industry || "—"}
                </span>
                <span className="flex items-center gap-1.5">
                  <Users size={11} className="text-[#0A66C2]" />
                  {company.size}
                </span>
                <span className="flex items-center gap-1.5">
                  <Calendar size={11} className="text-[#0A66C2]" />
                  Berdiri {company.founded || "—"}
                </span>
                {company.telepon && (
                  <span className="flex items-center gap-1.5">
                    <Phone size={11} className="text-[#0A66C2]" />
                    {company.telepon}
                  </span>
                )}
                {company.website && (
                  <span className="flex items-center gap-1.5">
                    <Globe size={11} className="text-[#0A66C2]" />
                    {company.website}
                  </span>
                )}
              </div>

              {company.cultureValues.length > 0 && (
                <div className="flex gap-1 flex-wrap mt-3 pt-3 border-t border-slate-100">
                  {company.cultureValues.map((v) => (
                    <span key={v} className="px-2 py-0.5 rounded-full text-[9.5px] font-semibold bg-[#0A66C2]/5 border border-[#0A66C2]/10 text-[#1D4ED8]">
                      {v}
                    </span>
                  ))}
                </div>
              )}

              {/* Galeri mini preview */}
              {gallery.length > 0 && (
                <div className="mt-3 pt-3 border-t border-slate-100">
                  <p className="text-[9.5px] font-semibold text-slate-400 uppercase tracking-wide mb-1.5 m-0">Galeri</p>
                  <div className="grid grid-cols-3 gap-1">
                    {gallery.slice(0, 3).map((item) => (
                      <div key={item.id} className="aspect-square rounded-lg overflow-hidden bg-slate-100">
                        <img src={item.image} alt={item.label} className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                  {gallery.length > 3 && (
                    <p className="text-[10px] text-slate-400 mt-1 m-0">+{gallery.length - 3} foto lainnya</p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Tips card */}
          <div className="rounded-2xl p-4 border border-[#d6e8f7]" style={{ background: "linear-gradient(160deg, #dbeeff 0%, #e8f3ff 60%, #d4e9fb 100%)" }}>
            <div className="flex items-center gap-2 mb-1.5">
              <Award size={14} className="text-[#0A66C2]" />
              <p className="text-[12px] font-bold text-slate-900 m-0">Tips Profil</p>
            </div>
            <p className="text-[11.5px] text-slate-600 leading-relaxed m-0">
              Lengkapi semua bagian profil untuk meningkatkan kepercayaan pelamar. Profil dengan galeri dan kultur perusahaan terisi mendapat 2× lebih banyak pelamar.
            </p>
          </div>

          {/* Completion meter */}
          {(() => {
            const fields = [
              company.name, company.descriptionShort, company.location, company.industry,
              company.founded, company.telepon, company.website, company.description,
              company.culture, company.namaCP,
            ];
            const filled = fields.filter(Boolean).length;
            const pct = Math.round((filled / fields.length) * 100);
            return (
              <div className="rounded-2xl p-4 bg-white border border-slate-200">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-[12px] font-bold text-slate-700 m-0">Kelengkapan Profil</p>
                  <span className="text-[12px] font-extrabold text-[#0A66C2]">{pct}%</span>
                </div>
                <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-[#0A66C2] transition-all duration-500"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <p className="text-[10.5px] text-slate-400 mt-2 m-0">{filled} dari {fields.length} field terisi</p>
              </div>
            );
          })()}
        </div>
      </div>

      <Toast message={toast.message} visible={toast.visible} type={toast.type} />

      {/* ── Bottom save bar ── */}
      <div className="z-30 bg-white/95 backdrop-blur-xl border-t border-slate-200">
        <div className="px-6 py-3.5 flex items-center justify-end gap-3">
          <span className="text-[12px] text-slate-400 mr-auto hidden sm:inline">
            Pastikan semua field wajib (
            <span className="text-red-500">*</span>
            ) sudah terisi sebelum menyimpan
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