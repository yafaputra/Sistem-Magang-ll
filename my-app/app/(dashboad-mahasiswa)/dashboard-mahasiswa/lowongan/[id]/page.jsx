"use client";

import { useState } from "react";
import { 
  MapPin, Bookmark, BookmarkCheck, Clock, Users, BriefcaseBusiness, 
  CheckCircle2, Link2, Mail, ChevronRight, Building2, Banknote, 
  CalendarDays, ArrowLeft, Share2, Globe, AlertCircle
} from "lucide-react";

// ─── Data ─────────────────────────────────────────────────────────────────────

const job = {
  id: 1,
  title: "Front End Developer",
  type: "PART-TIME",
  workType: "Remote",
  salary: "Rp 8.000.000 – Rp 12.000.000",
  skills: ["React.Js", "Next.Js", "Vue.Js"],
  company: "Google Indonesia",
  location: "Jakarta, Indonesia",
  logo: "G",
  posted: "20 Hari Lalu",
  deadline: "30 Jun 2025",
  opening: 12,
  applicants: 20,
  experience: "Intermediate",
  category: "Software Developer",
  description: "Google Indonesia sedang mencari Front End Developer yang berpengalaman untuk bergabung dengan tim kami yang dinamis. Kamu akan bertanggung jawab dalam membangun antarmuka web yang modern, responsif, dan berperforma tinggi menggunakan teknologi terkini.",
  responsibilities: [
    "Membangun dan memelihara antarmuka web yang responsif dan modern",
    "Berkolaborasi dengan tim desain untuk mengimplementasikan UI/UX",
    "Mengoptimalkan performa aplikasi untuk pengalaman pengguna terbaik",
    "Menulis kode yang bersih, terstruktur, dan mudah dipelihara",
    "Berpartisipasi aktif dalam code review dan sprint planning",
  ],
  requirements: [
    "Menguasai React.js, Next.js, atau Vue.js",
    "Memahami HTML, CSS, dan JavaScript secara mendalam",
    "Berpengalaman dengan RESTful API dan GraphQL",
    "Familiar dengan tools seperti Git, Figma, dan Jira",
    "Mampu bekerja secara kolaboratif dalam tim Agile",
  ],
  whoYouAre: [
    "Kamu antusias dengan teknologi web terbaru",
    "Memiliki perhatian tinggi terhadap detail dan kualitas kode",
    "Mampu bekerja mandiri maupun dalam tim",
    "Berorientasi pada solusi dan problem-solving",
    "Memiliki komunikasi yang baik dalam bahasa Indonesia dan Inggris",
  ],
  niceToHave: [
    "Pengalaman dengan TypeScript",
    "Familiar dengan testing framework seperti Jest atau Cypress",
    "Pernah berkontribusi ke open-source project",
  ],
};

const relatedJobs = [
  { id: 2, title: "UI/UX Designer",    type: "FULL-TIME", salary: "Rp 7.000.000 – Rp 10.000.000",  skills: ["Figma", "Sketch", "Prototyping"],  company: "Tokopedia",       location: "Jakarta, Indonesia", logo: "T"  },
  { id: 3, title: "Backend Developer", type: "FULL-TIME", salary: "Rp 10.000.000 – Rp 15.000.000", skills: ["Node.Js", "Express", "PostgreSQL"], company: "Gojek",           location: "Jakarta, Indonesia", logo: "GJ" },
  { id: 4, title: "Mobile Developer",  type: "FULL-TIME", salary: "Rp 9.000.000 – Rp 14.000.000",  skills: ["Flutter", "React Native", "Swift"], company: "Shopee Indonesia", location: "Jakarta, Indonesia", logo: "S"  },
];

const logoColors = {
  G:  { bg: "#E8F0FE", text: "#1A73E8" },
  T:  { bg: "#FFF3E0", text: "#E65100" },
  GJ: { bg: "#E8F5E9", text: "#2E7D32" },
  S:  { bg: "#FCE4EC", text: "#C62828" },
};

const typeStyle = {
  "PART-TIME": { bg: "#F0FDF4", text: "#15803D", border: "#86EFAC" },
  "FULL-TIME": { bg: "#EFF6FF", text: "#1D4ED8", border: "#93C5FD" },
};


// ─── Components ───────────────────────────────────────────────────────────────

function CompanyLogo({ logo, size = "md" }) {
  const colors = logoColors[logo] ?? { bg: "#F3F4F6", text: "#374151" };
  const sz = size === "lg"
    ? "w-16 h-16 rounded-2xl text-[16px]"
    : size === "sm"
    ? "w-8 h-8 rounded-lg text-[10px]"
    : "w-10 h-10 rounded-xl text-[12px]";

  if (logo === "G") {
    return (
      <div className={`${sz} flex items-center justify-center flex-shrink-0`} style={{ backgroundColor: colors.bg }}>
        <svg width={size === "lg" ? 28 : size === "sm" ? 16 : 20} height={size === "lg" ? 28 : size === "sm" ? 16 : 20} viewBox="0 0 24 24" fill="none">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
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
    <div className="bg-white border border-slate-200 rounded-2xl p-6">
      <h2 className="text-[18px] font-bold text-slate-900 mb-4 flex items-center gap-2">
        <span className="w-1 h-5 bg-[#0A66C2] rounded-full inline-block" />
        {title}
      </h2>
      {children}
    </div>
  );
}

function BulletList({ items }) {
  return (
    <ul className="flex flex-col gap-2.5">
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-2.5 text-[13.5px] text-slate-600 leading-relaxed">
          <CheckCircle2 size={16} className="text-[#0A66C2] mt-0.5 flex-shrink-0" />
          {item}
        </li>
      ))}
    </ul>
  );
}

function RelatedJobCard({ job: j }) {
  return (
    <div className="p-4 border border-slate-100 rounded-xl hover:border-[#6CC1FF] hover:bg-blue-50/30 transition-all duration-150 cursor-pointer group">
      <h4 className="text-[13.5px] font-bold text-slate-800 mb-1.5 group-hover:text-[#0A66C2] transition-colors">{j.title}</h4>
      <div className="flex items-center gap-2 mb-2.5 flex-wrap">
        <span className="text-[10px] font-bold px-2 py-0.5 rounded-sm border tracking-wide bg-[#EFF6FF] text-[#1D4ED8] border-[#93C5FD]">
          {j.type}
        </span>
        <span className="text-[11.5px] text-slate-400">{j.salary}</span>
      </div>
      <div className="flex flex-wrap gap-1.5 mb-3">
        {j.skills.map(s => {
          return (
            <span key={s} className="text-[10.5px] font-semibold px-2.5 py-0.5 rounded-md border bg-[#F8FAFC] text-[#334155] border-[#CBD5E1]">
              {s}
            </span>
          );
        })}
      </div>
      <div className="flex items-center gap-2">
        <CompanyLogo logo={j.logo} size="sm" />
        <div>
          <p className="text-[12px] font-semibold text-slate-700 leading-tight">{j.company}</p>
          <span className="flex items-center gap-0.5 text-[11px] text-slate-400">
            <MapPin size={10} strokeWidth={2} />{j.location}
          </span>
        </div>
      </div>
    </div>
  );
}


export default function JobDetailPage() {
  const [saved, setSaved]   = useState(false);
  const [copied, setCopied] = useState(false);
  const type = typeStyle[job.type] ?? { bg: "#F3F4F6", text: "#374151", border: "#E5E7EB" };

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/20 to-white font-[Plus_Jakarta_Sans,Segoe_UI,sans-serif] ">
      {/* Top Header */}
      <div className="flex items-center justify-between px-[30px] py-4 bg-white border-b border-[#e8e8f0]">
        <div className="flex items-center gap-[14px]">
          <div className="w-[38px] h-[38px] rounded-[10px] bg-[#EFF6FF] text-[#0A66C2] flex items-center justify-center flex-shrink-0">
            <BriefcaseBusiness size={17} />
          </div>
          <div>
            <div className="text-[19px] font-bold text-[#1e1e2e] tracking-tight leading-none">Detail Lowongan</div>
            <div className="text-[12px] text-slate-400 mt-[3px]">Informasi lengkap posisi yang kamu lamar</div>
          </div>
        </div>

        <button className="px-4 py-[7px] border-[1.5px] border-[#0A66C2] rounded-[7px] text-[#0A66C2] text-[12.5px] font-semibold bg-transparent flex items-center gap-[6px] transition-all duration-150 hover:bg-[#0A66C2] hover:text-white">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 9.5L12 3l9 6.5" />
            <path d="M5 9v11a1 1 0 0 0 1 1h3v-7h6v7h3a1 1 0 0 0 1-1V9" />
          </svg>
          Back to homepage
        </button>
      </div>


      {/* Breadcrumb */}
      <div className="bg-white border-b border-slate-100 px-8 py-4">
        <div className="max-w-[1200px] mx-auto flex items-center gap-2 text-[12.5px] text-slate-400">
          <span className="hover:text-[#0A66C2] cursor-pointer transition-colors">Beranda</span>
          <ChevronRight size={13} />
          <span className="hover:text-[#0A66C2] cursor-pointer transition-colors">Lowongan</span>
          <ChevronRight size={13} />
          <span className="text-slate-700 font-medium">{job.title}</span>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-8 py-8">
        <div className="flex gap-7 items-start max-[960px]:flex-col">

          {/* ── LEFT COLUMN ── */}
          <div className="flex-1 min-w-0 flex flex-col gap-5">

            {/* Job Header Card */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6">
              <button className="flex items-center gap-1.5 text-[12.5px] text-slate-400 hover:text-[#0A66C2] transition-colors mb-5">
                <ArrowLeft size={14} /> Kembali ke Lowongan
              </button>

              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <h1 className="text-[22px] font-extrabold text-slate-900 leading-snug mb-2">{job.title}</h1>
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full border tracking-wide"
                      style={{ backgroundColor: type.bg, color: type.text, borderColor: type.border }}>
                      {job.type}
                    </span>
                    <span className="flex items-center gap-1 text-[13px] text-slate-500 font-medium">
                      <Banknote size={14} className="text-slate-400" />
                      {job.salary}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setSaved(!saved)}
                  className="w-10 h-10 rounded-xl flex items-center justify-center border border-slate-200 hover:bg-blue-50 hover:border-[#0A66C2] transition-all duration-150 flex-shrink-0"
                >
                  {saved
                    ? <BookmarkCheck size={18} className="text-[#0A66C2]" />
                    : <Bookmark size={18} className="text-slate-400" />
                  }
                </button>
              </div>

              <div className="flex flex-wrap gap-2 mb-5">
                {job.skills.map(s => (
                  <span key={s} className="text-[12.5px] font-semibold px-4 py-1.5 rounded-lg border border-green-400 text-green-700 bg-white">
                    {s}
                  </span>
                ))}
              </div>

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
                <button className="text-[#0A66C2] bg-blue-50 border border-blue-200 px-4 py-2 rounded-sm transition-all duration-150 hover:bg-[#0A66C2] hover:text-white hover:border-[#0A66C2]">
                  Lamar Sekarang
                </button>
              </div>
            </div>

            <Section title="Deskripsi Pekerjaan">
              <p className="text-[13.5px] text-slate-600 leading-relaxed">{job.description}</p>
            </Section>

            <Section title="Tanggung Jawab">
              <BulletList items={job.responsibilities} />
            </Section>

            <Section title="Persyaratan">
              <BulletList items={job.requirements} />
            </Section>

            <Section title="Siapa Kamu">
              <BulletList items={job.whoYouAre} />
            </Section>

            <Section title="Nice To Have">
              <BulletList items={job.niceToHave} />
            </Section>

          </div>

          {/* ── RIGHT COLUMN ── */}
          <div className="w-[300px] flex-shrink-0 flex flex-col gap-5 max-[960px]:w-full">

            {/* Ringkasan Pekerjaan */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5">
              <h3 className="text-[15px] font-bold text-slate-900 mb-4 flex items-center gap-2">
                <span className="w-1 h-5 bg-[#0A66C2] rounded-full inline-block" />
                Ringkasan Pekerjaan
              </h3>
              <div className="flex flex-col gap-0">
                {[
                  { Icon: CalendarDays,      label: "Diposting",  value: job.posted,                deadline: false, badge: false },
                  { Icon: Clock,             label: "Tipe Kerja", value: job.type,                   deadline: false, badge: true  },
                  { Icon: Building2,         label: "Kategori",   value: job.category,              deadline: false, badge: false },
                  { Icon: BriefcaseBusiness, label: "Pengalaman", value: job.experience,             deadline: false, badge: false },
                  { Icon: Users,             label: "Pelamar",    value: `${job.applicants} orang`,  deadline: false, badge: false },
                  { Icon: MapPin,            label: "Lokasi",     value: job.location,               deadline: false, badge: false },
                  { Icon: AlertCircle,       label: "Deadline",   value: job.deadline,               deadline: true,  badge: false },
                ].map(({ Icon, label, value, deadline, badge }, i, arr) => (
                  <div
                    key={label}
                    className={`flex items-center justify-between gap-3 py-2.5 ${i < arr.length - 1 ? "border-b border-slate-100" : ""} ${deadline ? "-mx-5 px-5 bg-blue-50 mt-1" : ""}`}
                  >
                    <span className="flex items-center gap-2 text-[12px] text-slate-500 shrink-0">
                      <Icon size={13} className={deadline ? "text-[#0A66C2]" : "text-[#0A66C2]"} />
                      {label}
                    </span>
                    {badge ? (
                      <span className="text-[10.5px] font-bold px-2.5 py-0.5 rounded-full border tracking-wide"
                        style={{
                          backgroundColor: (typeStyle[value] ?? typeStyle["PART-TIME"]).bg,
                          color:            (typeStyle[value] ?? typeStyle["PART-TIME"]).text,
                          borderColor:      (typeStyle[value] ?? typeStyle["PART-TIME"]).border,
                        }}>
                        {value}
                      </span>
                    ) : deadline ? (
                      <span className="flex items-center gap-1 text-[11px] font-bold text-[#1D4ED8] bg-blue-100 border border-blue-200 px-2.5 py-0.5 rounded-full">
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

            {/* Bagikan Lowongan */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5">
              <h3 className="text-[15px] font-bold text-slate-900 mb-4 flex items-center gap-2">
                <span className="w-1 h-5 bg-[#0A66C2] rounded-full inline-block" />
                Bagikan Lowongan
              </h3>
              <div className="flex items-center gap-2 flex-wrap">
                {[
                  { Icon: Link2,  label: "Salin Link", color: "text-slate-500",  bg: "bg-slate-100 hover:bg-slate-200", onClick: handleCopy },
                  { Icon: Share2, label: "LinkedIn",   color: "text-[#0A66C2]", bg: "bg-blue-50 hover:bg-blue-100",    onClick: undefined  },
                  { Icon: Globe,  label: "Facebook",   color: "text-[#1877F2]", bg: "bg-blue-50 hover:bg-blue-100",    onClick: undefined  },
                  { Icon: Globe,  label: "Twitter",    color: "text-[#1DA1F2]", bg: "bg-sky-50 hover:bg-sky-100",      onClick: undefined  },
                  { Icon: Mail,   label: "Email",      color: "text-slate-500",  bg: "bg-slate-100 hover:bg-slate-200", onClick: undefined  },
                ].map(({ Icon, label, color, bg, onClick }) => (
                  <button
                    key={label}
                    title={label}
                    onClick={onClick}
                    className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${bg} relative`}
                  >
                    <Icon size={16} className={color} />
                    {label === "Salin Link" && copied && (
                      <span className="absolute -top-7 left-1/2 -translate-x-1/2 text-[10px] font-semibold bg-slate-800 text-white px-2 py-0.5 rounded whitespace-nowrap">
                        Tersalin!
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Lowongan Serupa */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5">
              <h3 className="text-[15px] font-bold text-slate-900 mb-4 flex items-center gap-2">
                <span className="w-1 h-5 bg-[#0A66C2] rounded-full inline-block" />
                Lowongan Serupa
              </h3>
              <div className="flex flex-col gap-3">
                {relatedJobs.map(j => (
                  <RelatedJobCard key={j.id} job={j} />
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}