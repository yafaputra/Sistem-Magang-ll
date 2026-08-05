"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  MapPin, Bookmark, BookmarkCheck, Clock, Users, BriefcaseBusiness,
  CheckCircle2, ChevronRight, Building2, Banknote,
  CalendarDays, ArrowLeft, AlertCircle, Copy, Check, Mail, Home
} from "lucide-react";
import Link from "next/link";
import Topbar from "../../../components/topbar";
import useAuth from "@/hooks/useAuth";

// ─── Social SVG Icons ─────────────────────────────────────────────────────────

function LinkedinIcon({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"/>
      <circle cx="4" cy="4" r="2"/>
    </svg>
  );
}

function FacebookIcon({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/>
    </svg>
  );
}

function TwitterIcon({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
    </svg>
  );
}

function WhatsAppIcon({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
      <path d="M12 0C5.373 0 0 5.373 0 12c0 2.124.558 4.118 1.528 5.845L.057 23.428a.5.5 0 00.609.628l5.79-1.519A11.95 11.95 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22a9.95 9.95 0 01-5.127-1.415l-.368-.218-3.813 1.001.974-3.715-.239-.381A9.944 9.944 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
    </svg>
  );
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const formatRupiah = (val) => {
  if (!val || val === "-") return "-";
  if (typeof val === "string" && val.includes("Rp")) return val;
  if (typeof val === "string" && val.includes("-")) {
    const [min, max] = val.split("-").map((v) => parseInt(v.trim()));
    if (!isNaN(min) && !isNaN(max))
      return `Rp ${min.toLocaleString("id-ID")} – Rp ${max.toLocaleString("id-ID")}`;
  }
  const num = parseInt(val);
  if (!isNaN(num)) return `Rp ${num.toLocaleString("id-ID")}`;
  return val;
};

// ─── Data ─────────────────────────────────────────────────────────────────────

const logoColors = {
  G:  { bg: "#E8F0FE", text: "#1A73E8" },
  T:  { bg: "#FFF3E0", text: "#E65100" },
  GJ: { bg: "#E8F5E9", text: "#2E7D32" },
  TV: { bg: "#E3F2FD", text: "#1565C0" },
  S:  { bg: "#FCE4EC", text: "#C62828" },
  B:  { bg: "#F3E5F5", text: "#6A1B9A" },
};

const typeStyle = {
  "PART-TIME": { bg: "#F0FDF4", text: "#15803D", border: "#86EFAC" },
  "FULL-TIME": { bg: "#EFF6FF", text: "#1D4ED8", border: "#93C5FD" },
};

// ─── Components ───────────────────────────────────────────────────────────────

function CompanyLogo({ logo, size = "md" }) {
  const colors = logoColors[logo] ?? { bg: "#F3F4F6", text: "#374151" };
  const sz =
    size === "lg" ? "w-16 h-16 rounded-2xl text-[16px]"
    : size === "sm" ? "w-8 h-8 rounded-lg text-[10px]"
    : "w-10 h-10 rounded-xl text-[12px]";

  if (logo === "G") {
    return (
      <div className={`${sz} flex items-center justify-center flex-shrink-0`} style={{ backgroundColor: colors.bg }}>
        <svg width={size === "lg" ? 28 : size === "sm" ? 16 : 20} height={size === "lg" ? 28 : size === "sm" ? 16 : 20} viewBox="0 0 24 24" fill="none">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
        </svg>
      </div>
    );
  }

  return (
    <div className={`${sz} flex items-center justify-center font-bold flex-shrink-0`} style={{ backgroundColor: colors.bg, color: colors.text }}>
      {logo}
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-200 bg-slate-50/60">
        <h2 className="text-[16px] font-bold text-slate-900 flex items-center gap-2.5">
          <span className="w-1 h-5 bg-[#0A66C2] rounded-full inline-block" />
          {title}
        </h2>
      </div>
      <div className="p-6">{children}</div>
    </div>
  );
}

function BulletList({ items }) {
  if (!items || items.length === 0) return null;
  return (
    <ul className="flex flex-col gap-2.5">
      {items.map((item) => (
        <li key={item} className="flex items-start gap-2.5 text-[13.5px] text-slate-600 leading-relaxed">
          <CheckCircle2 size={16} className="text-[#0A66C2] mt-0.5 flex-shrink-0" />
          {item}
        </li>
      ))}
    </ul>
  );
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function Skeleton({ className }) {
  return <div className={`animate-pulse bg-slate-200 rounded-lg ${className}`} />;
}

function LoadingSkeleton() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="px-8 pb-4 pt-8">
        <Skeleton className="h-4 w-48" />
      </div>
      <div className="px-8 py-4">
        <div className="flex gap-7 items-start">
          <div className="flex-1 flex flex-col gap-5">
            <div className="bg-white border border-slate-200 rounded-2xl p-6 flex flex-col gap-4">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-8 w-2/3" />
              <Skeleton className="h-4 w-1/3" />
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white border border-slate-200 rounded-2xl p-6 flex flex-col gap-3">
                <Skeleton className="h-5 w-40" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-4 w-4/6" />
              </div>
            ))}
          </div>
          <div className="w-[300px] flex-shrink-0 flex flex-col gap-5">
            <div className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col gap-3">
              <Skeleton className="h-5 w-32" />
              {[1,2,3,4,5,6,7].map((i) => <Skeleton key={i} className="h-8 w-full" />)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function JobDetailDashboardPage() {
  const params   = useParams();
  const router   = useRouter();
  const [job, setJob]       = useState(null);
  const [saved, setSaved]   = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError]   = useState(null);

  useAuth("mahasiswa");

  useEffect(() => {
    // ✅ ambil dari params.slug
    if (!params?.slug) return;

    const fetchDetail = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/lowongan/public/${params.slug}`
        );
        if (!response.ok) throw new Error(`Gagal memuat data (${response.status})`);

        const result = await response.json();
        const item = result.data;

        setJob({
          id:               item.id,
          slug:             item.slug,
          title:            item.posisi,
          type:             item.tipe || "FULL-TIME",
          workType:         item.tipe || "Remote",
          salary:           formatRupiah(item.gaji),
          skills:           item.tags ? JSON.parse(item.tags) : [],
          company:          item.perusahaan?.nama || "Perusahaan",
          location:         item.lokasi || item.perusahaan?.alamat || "-",
          logo:             item.perusahaan?.logo || "P",
          posted:           "Baru Saja",
          deadline:         item.deadline
                              ? new Date(item.deadline).toLocaleDateString("id-ID")
                              : "-",
          opening:          item.kuota,
          applicants:       item.pelamars?.length || 0,
          experience:       item.experience || "-",
          category:         item.departemen || "-",
          description:      item.deskripsi || "",
          responsibilities: item.responsibilities ? JSON.parse(item.responsibilities) : [],
          requirements:     item.requirements     ? JSON.parse(item.requirements)     : [],
          whoYouAre:        item.whoYouAre        ? JSON.parse(item.whoYouAre)        : [],
          niceToHave:       item.niceToHave       ? JSON.parse(item.niceToHave)       : [],
        });
      } catch (err) {
        setError(err.message);
      }
    };

    fetchDetail();
  }, [params?.slug]);

  const handleCopy = () => {
    navigator.clipboard?.writeText(window.location.href).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center p-10">
          <AlertCircle size={40} className="text-red-400 mx-auto mb-3" />
          <p className="text-slate-700 font-semibold mb-1">Gagal memuat lowongan</p>
          <p className="text-slate-400 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  if (!job) return <LoadingSkeleton />;

  const type = typeStyle[job.type] ?? { bg: "#F3F4F6", text: "#374151", border: "#E5E7EB" };

  const summaryRows = [
    { Icon: CalendarDays,      label: "Diposting",  value: job.posted,                deadline: false, badge: false },
    { Icon: Clock,             label: "Tipe Kerja", value: job.type,                  deadline: false, badge: true  },
    { Icon: Building2,         label: "Kategori",   value: job.category,              deadline: false, badge: false },
    { Icon: BriefcaseBusiness, label: "Pengalaman", value: job.experience,            deadline: false, badge: false },
    { Icon: Users,             label: "Pelamar",    value: `${job.applicants} orang`, deadline: false, badge: false },
    { Icon: MapPin,            label: "Lokasi",     value: job.location,              deadline: false, badge: false },
    { Icon: AlertCircle,       label: "Deadline",   value: job.deadline,              deadline: true,  badge: false },
  ];

  const shareItems = [
    {
      label: "Salin Link",
      bg: copied ? "bg-green-50 border border-green-200" : "bg-slate-100 hover:bg-slate-200 border border-slate-200",
      color: copied ? "text-green-600" : "text-slate-500",
      Icon: () => copied ? <Check size={18} className="text-green-600" /> : <Copy size={18} className="text-slate-500" />,
      onClick: handleCopy,
    },
    {
      label: "LinkedIn",
      bg: "bg-[#E8F0FE] hover:bg-[#BFDBFE] border border-[#93C5FD]",
      color: "text-[#0A66C2]",
      Icon: () => <LinkedinIcon size={18} />,
      onClick: () => window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`, "_blank"),
    },
    {
      label: "Facebook",
      bg: "bg-[#EEF2FF] hover:bg-[#C7D2FE] border border-[#A5B4FC]",
      color: "text-[#1877F2]",
      Icon: () => <FacebookIcon size={18} />,
      onClick: () => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`, "_blank"),
    },
    {
      label: "Twitter / X",
      bg: "bg-slate-100 hover:bg-slate-200 border border-slate-200",
      color: "text-slate-800",
      Icon: () => <TwitterIcon size={18} />,
      onClick: () => window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(job.title)}`, "_blank"),
    },
    {
      label: "WhatsApp",
      bg: "bg-[#E8F5E9] hover:bg-[#C8E6C9] border border-[#A5D6A7]",
      color: "text-[#25D366]",
      Icon: () => <WhatsAppIcon size={18} />,
      onClick: () => window.open(`https://wa.me/?text=${encodeURIComponent(job.title + " - " + window.location.href)}`, "_blank"),
    },
    {
      label: "Email",
      bg: "bg-[#FFF3E0] hover:bg-[#FFE0B2] border border-[#FFCC80]",
      color: "text-[#E65100]",
      Icon: () => <Mail size={18} className="text-[#E65100]" />,
      onClick: () => window.open(`mailto:?subject=${encodeURIComponent(job.title)}&body=${encodeURIComponent(window.location.href)}`, "_blank"),
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 font-[Plus_Jakarta_Sans,Segoe_UI,sans-serif]">
      {/* Topbar — konsisten dengan dashboard mahasiswa */}
      <Topbar
        icon={<BriefcaseBusiness className="w-4.5 h-4.5" />}
        title="Detail Lowongan"
        subtitle="Informasi lengkap tentang lowongan magang ini"
        rightSlot={
          <button
            onClick={() => router.push("/")}
            className="flex items-center gap-2 px-4 py-2 border border-[#0A66C2]/40 rounded-xl text-[#0A66C2] text-[12.5px] font-semibold bg-transparent transition-all duration-150 hover:bg-[#0958A8] hover:text-white hover:border-[#0A66C2] cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0A66C2]"
          >
            <div className="w-6 h-6 rounded-lg bg-[#0A66C2]/10 border border-[#0A66C2]/20 flex items-center justify-center flex-shrink-0">
              <Home className="w-3.5 h-3.5" />
            </div>
            Back to homepage
          </button>
        }
      />

      <div className="bg-white border-b border-slate-100 px-8 pb-4 pt-4">
        <div className="flex items-center gap-2 text-[12.5px] text-slate-400">
          <Link href="/dashboard-mahasiswa" className="hover:text-[#0A66C2] transition-colors">Dashboard</Link>
          <ChevronRight size={13} />
          <Link href="/dashboard-mahasiswa/lowongan" className="hover:text-[#0A66C2] transition-colors">Lowongan</Link>
          <ChevronRight size={13} />
          <span className="text-slate-700 font-medium line-clamp-1">{job.title}</span>
        </div>
      </div>

      <div className="px-8 py-8">
        <div className="flex gap-7 items-start max-[960px]:flex-col">
          <div className="flex-1 min-w-0 flex flex-col gap-5">

            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-200 bg-slate-50/60">
                <button
                  onClick={() => router.back()}
                  className="flex items-center gap-1.5 text-[12.5px] text-slate-400 hover:text-[#0A66C2] transition-colors"
                >
                  <ArrowLeft size={14} /> Kembali ke Lowongan
                </button>
              </div>

              <div className="p-6">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div>
                    <h1 className="text-[22px] font-extrabold text-slate-900 leading-snug mb-2">{job.title}</h1>
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <span
                        className="text-[11px] font-bold px-2.5 py-0.5 rounded-full border tracking-wide"
                        style={{ backgroundColor: type.bg, color: type.text, borderColor: type.border }}
                      >
                        {job.type}
                      </span>
                      <span className="flex items-center gap-1 text-[13px] text-sky-700 font-semibold">
                        {job.salary}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => setSaved(!saved)}
                    className="w-10 h-10 rounded-xl flex items-center justify-center border border-slate-200 hover:bg-[#0A66C2]/5 hover:border-[#0A66C2] transition-all duration-150 flex-shrink-0"
                  >
                    {saved
                      ? <BookmarkCheck size={18} className="text-[#0A66C2]" />
                      : <Bookmark size={18} className="text-slate-400" />}
                  </button>
                </div>

                {job.skills.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-5">
                    {job.skills.map((s) => (
                      <span key={s} className="text-[12.5px] font-semibold px-4 py-1.5 rounded-lg border border-green-400 text-green-700 bg-white">
                        {s}
                      </span>
                    ))}
                  </div>
                )}

                <div className="flex items-center gap-3 p-3.5 bg-slate-50 rounded-xl border border-slate-100 mb-5">
                  <CompanyLogo logo={job.logo} size="lg" />
                  <div>
                    <p className="text-[15px] font-bold text-slate-800">{job.company}</p>
                    <span className="flex items-center gap-1 text-[12.5px] text-slate-400 mt-0.5">
                      <MapPin size={12} strokeWidth={2} />{job.location}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-3 pt-4 border-t border-slate-100 flex-wrap">
                  <div className="flex items-center gap-5 flex-wrap">
                    <div className="flex items-center gap-1.5 text-[12.5px] text-slate-500">
                      <CalendarDays size={14} className="text-slate-400" />
                      Diposting {job.posted}
                    </div>
                    <div className="flex items-center gap-1.5 text-[12.5px] text-slate-500">
                      <BriefcaseBusiness size={14} className="text-slate-400" />
                      {job.opening} Posisi Tersedia
                    </div>
                    <div className="flex items-center gap-1.5 text-[12.5px] text-slate-500">
                      <Users size={14} className="text-slate-400" />
                      {job.applicants} Pelamar
                    </div>
                  </div>
                  <button
                    onClick={() => router.push(`/dashboard-mahasiswa/lowongan/${job.slug}/lamar`)}
                    className="text-[#0A66C2] bg-[#0A66C2]/5 border border-[#0A66C2]/20 px-5 py-2 rounded-lg text-[13.5px] font-semibold transition-all duration-150 hover:bg-[#0A66C2] hover:text-white hover:border-[#0A66C2]"
                  >
                    Lamar Sekarang
                  </button>
                </div>
              </div>
            </div>

            {job.description && (
              <Section title="Deskripsi Pekerjaan">
                <p className="text-[13.5px] text-slate-600 leading-relaxed">{job.description}</p>
              </Section>
            )}

            {job.responsibilities.length > 0 && (
              <Section title="Tanggung Jawab">
                <BulletList items={job.responsibilities} />
              </Section>
            )}

            {job.requirements.length > 0 && (
              <Section title="Persyaratan">
                <BulletList items={job.requirements} />
              </Section>
            )}

            {job.whoYouAre.length > 0 && (
              <Section title="Siapa Kamu">
                <BulletList items={job.whoYouAre} />
              </Section>
            )}

            {job.niceToHave.length > 0 && (
              <Section title="Nice To Have">
                <BulletList items={job.niceToHave} />
              </Section>
            )}
          </div>

          <div className="w-[300px] flex-shrink-0 flex flex-col gap-5 max-[960px]:w-full">

            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
              <div className="px-5 py-4 border-b border-slate-200 bg-slate-50/60">
                <h3 className="text-[15px] font-bold text-slate-900 flex items-center gap-2">
                  <span className="w-1 h-5 bg-[#0A66C2] rounded-full inline-block" />
                  Ringkasan Pekerjaan
                </h3>
              </div>
              <div className="px-5 py-3">
                {summaryRows.map(({ Icon, label, value, deadline, badge }, i, arr) => (
                  <div
                    key={label}
                    className={[
                      "flex items-center justify-between gap-3 py-2.5",
                      i < arr.length - 1 ? "border-b border-slate-100" : "",
                      deadline ? "-mx-5 px-5 bg-[#0A66C2]/5 mt-1" : "",
                    ].join(" ")}
                  >
                    <span className="flex items-center gap-2 text-[12px] text-slate-500 shrink-0">
                      <Icon size={13} className="text-[#0A66C2]" />
                      {label}
                    </span>
                    {badge ? (
                      <span
                        className="text-[10.5px] font-bold px-2.5 py-0.5 rounded-full border tracking-wide"
                        style={{
                          backgroundColor: (typeStyle[value] ?? typeStyle["PART-TIME"]).bg,
                          color:           (typeStyle[value] ?? typeStyle["PART-TIME"]).text,
                          borderColor:     (typeStyle[value] ?? typeStyle["PART-TIME"]).border,
                        }}
                      >
                        {value}
                      </span>
                    ) : deadline ? (
                      <span className="flex items-center gap-1 text-[11px] font-bold text-[#1D4ED8] bg-[#0A66C2]/10 border border-[#0A66C2]/20 px-2.5 py-0.5 rounded-full">
                        <Clock size={9} className="text-[#0A66C2]" />
                        {value}
                      </span>
                    ) : (
                      <span className="text-[12px] font-semibold text-slate-700 text-right leading-snug max-w-[150px]">{value}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
              <div className="px-5 py-4 border-b border-slate-200 bg-slate-50/60">
                <h3 className="text-[15px] font-bold text-slate-900 flex items-center gap-2">
                  <span className="w-1 h-5 bg-[#0A66C2] rounded-full inline-block" />
                  Bagikan Lowongan
                </h3>
              </div>
              <div className="p-5">
                <div className="flex items-center gap-2.5 flex-wrap">
                  {shareItems.map(({ label, bg, Icon, onClick }) => (
                    <button
                      key={label}
                      title={label}
                      onClick={onClick}
                      className={`relative flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-150 group ${bg}`}
                    >
                      <Icon />
                      <span className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 text-[10px] font-semibold bg-slate-800 text-white px-2 py-0.5 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                        {label}
                      </span>
                    </button>
                  ))}
                </div>
                {copied && (
                  <p className="text-[11.5px] text-green-600 font-medium mt-3 flex items-center gap-1">
                    <Check size={12} /> Link berhasil disalin!
                  </p>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}