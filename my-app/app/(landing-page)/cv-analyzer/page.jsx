"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import {
  Upload,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Search,
  Loader2,
  TrendingUp,
  Bot,
} from "lucide-react";

// ─── Backend Service URL ─────────────────────────────────────────────────────
// Diambil dari environment variable Vercel (NEXT_PUBLIC_DATA_SCIENCE).
// Fallback ke URL Railway langsung kalau env var belum diset.
const DATA_SCIENCE =
  process.env.NEXT_PUBLIC_DATA_SCIENCE || "https://data-production-b0d6.up.railway.app";

// ─── Predefined Role Requirements Map ────────────────────────────────────────
const ROLE_REQUIREMENTS = {
  "Software Engineer":
    "Kualifikasi:\n- Menguasai bahasa pemrograman seperti JavaScript, TypeScript, Python, atau Java\n- Mengerti framework web modern seperti React, Next.js, Node.js, atau Spring Boot\n- Berpengalaman menggunakan Git/GitHub dan REST API\n- Menguasai database SQL (PostgreSQL, MySQL) atau NoSQL (MongoDB)\n- Memahami konsep clean code, testing, dan cloud deployment (AWS/Docker)",
  "Product Manager":
    "Kualifikasi:\n- Memiliki pemahaman kuat tentang product lifecycle, market research, dan product strategy\n- Berpengalaman dalam merancang Product Requirement Document (PRD) dan roadmap produk\n- Berpengalaman menggunakan metodologi Agile/Scrum\n- Kemampuan komunikasi yang sangat baik untuk kolaborasi lintas divisi\n- Berjiwa leadership dan memiliki analytical skills yang tajam",
  "Data Analyst":
    "Kualifikasi:\n- Menguasai SQL untuk pengambilan data dari database\n- Mahir pemrograman Python (pandas, numpy) atau R untuk analisis data\n- Berpengalaman menggunakan Tableau, PowerBI, atau Looker Studio\n- Memahami analisis statistik, AB testing, dan pengolahan data besar\n- Kemampuan menyajikan insight data secara bisnis",
  "UI/UX Designer":
    "Kualifikasi:\n- Mahir menggunakan Figma untuk wireframing, prototyping, dan design system\n- Memahami user research, usability testing, dan user flow\n- Memiliki pengetahuan tentang design principles dan responsive design\n- Berpengalaman berkolaborasi dengan tim developer\n- Portofolio desain UI/UX yang kuat dan berorientasi pada pengguna",
  "Visual Designer":
    "Kualifikasi:\n- Mahir menggunakan Adobe Photoshop, Illustrator, atau Figma\n- Memiliki selera visual tinggi dalam typography, layout, dan branding\n- Berpengalaman membuat aset visual untuk media sosial dan marketing campaign\n- Mampu menerjemahkan brief kreatif menjadi karya visual yang menarik\n- Portofolio desain grafis/visual yang kreatif",
  "Marketing Specialist":
    "Kualifikasi:\n- Memahami dasar digital marketing, SEO/SEM, dan social media marketing\n- Berpengalaman mengelola campaign iklan (Google Ads, Meta Ads)\n- Terbiasa menggunakan analytics tools seperti Google Analytics\n- Memiliki kemampuan copywriting dan content creation yang baik\n- Mampu menganalisis performa campaign dan ROI pemasaran",
};

function getRequirements(role) {
  // Map Indonesian aliases → English keys
  const aliasMap = {
    "analis data": "Data Analyst",
    "desainer ui/ux": "UI/UX Designer",
    "desainer visual": "Visual Designer",
    "spesialis pemasaran": "Marketing Specialist",
  };
  const normalized = aliasMap[role.toLowerCase().trim()] || role;
  const found = Object.keys(ROLE_REQUIREMENTS).find(
    (k) => k.toLowerCase() === normalized.toLowerCase().trim()
  );
  return (
    ROLE_REQUIREMENTS[found] ||
    `Kualifikasi:\n- Berpengalaman di bidang ${role} atau posisi terkait\n- Menguasai tool dan teknologi standard industri yang relevan\n- Memiliki kemampuan kolaborasi dan pemecahan masalah yang baik`
  );
}

// ─── Suggested Roles ─────────────────────────────────────────────────────────
const SUGGESTED_ROLES = [
  "Software Engineer",
  "Product Manager",
  "Analis Data",
  "Desainer UI/UX",
  "Desainer Visual",
  "Spesialis Pemasaran",
];

// ─── Mascot SVG ──────────────────────────────────────────────────────────────
function MascotSVG() {
  return (
    <svg
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full"
      style={{ animation: "float 4s ease-in-out infinite" }}
    >
      <style>{`
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
        @keyframes blink { 0%,90%,100%{ry:9} 95%{ry:2} }
        .eye { animation: blink 3s ease-in-out infinite; }
      `}</style>
      {/* Glow */}
      <circle cx="100" cy="110" r="65" fill="url(#bg)" opacity="0.18" />
      {/* Antenna */}
      <rect x="97" y="22" width="6" height="22" rx="3" fill="#2563EB" />
      <circle cx="100" cy="18" r="8" fill="#1E1B4B" />
      <circle cx="100" cy="18" r="4" fill="#6CC1FF" />
      {/* Ears */}
      <rect x="42" y="76" width="8" height="28" rx="4" fill="#2563EB" />
      <rect x="150" y="76" width="8" height="28" rx="4" fill="#2563EB" />
      {/* Neck + Body */}
      <path d="M85 130H115L110 155H90L85 130Z" fill="#1E1B4B" />
      <path d="M60 155H140L130 185H70L60 155Z" fill="url(#body)" />
      {/* Head */}
      <rect x="50" y="46" width="100" height="88" rx="30" fill="url(#head)" stroke="#2563EB" strokeWidth="3" />
      {/* Screen */}
      <rect x="63" y="58" width="74" height="62" rx="16" fill="#F0F7FF" stroke="#BFDBFE" strokeWidth="1.5" />
      {/* Eyes */}
      <ellipse className="eye" cx="84" cy="84" rx="7" ry="9" fill="#2563EB" />
      <ellipse className="eye" cx="116" cy="84" rx="7" ry="9" fill="#2563EB" />
      <ellipse cx="86" cy="81" rx="2" ry="2.5" fill="white" />
      <ellipse cx="118" cy="81" rx="2" ry="2.5" fill="white" />
      {/* Smile */}
      <path d="M85 106 Q100 116 115 106" stroke="#2563EB" strokeWidth="3" strokeLinecap="round" fill="none" />
      {/* Floating Badges */}
      <g transform="translate(136,26)">
        <rect width="56" height="24" rx="7" fill="#2563EB" />
        <text x="28" y="16" fill="white" fontSize="8.5" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">ATS +73%</text>
      </g>
      <g transform="translate(8,108)">
        <circle cx="15" cy="15" r="15" fill="#1E1B4B" />
        <path d="M9 15L13 19L21 11" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      </g>
      <defs>
        <radialGradient id="bg" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#6CC1FF" />
          <stop offset="100%" stopColor="#6CC1FF" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="head" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#EFF6FF" />
          <stop offset="100%" stopColor="#DBEAFE" />
        </linearGradient>
        <linearGradient id="body" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1E1B4B" />
          <stop offset="100%" stopColor="#312E81" />
        </linearGradient>
      </defs>
    </svg>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────────────
export default function CVAnalyzerPage() {
  const [file, setFile] = useState(null);
  const [role, setRole] = useState("");
  const [selectedRole, setSelectedRole] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [state, setState] = useState("idle"); // idle | loading | results
  const [loadingText, setLoadingText] = useState("");
  const [results, setResults] = useState(null);
  const [cvData, setCvData] = useState(null);
  const fileInputRef = useRef(null);

  // ── Drag & Drop ──
  const onDragOver = (e) => { e.preventDefault(); setDragging(true); };
  const onDragLeave = () => setDragging(false);
  const onDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) setFile(f);
  };
  const onFileChange = (e) => { if (e.target.files[0]) setFile(e.target.files[0]); };

  // ── Role select ──
  const selectRole = (r) => {
    setRole(r);
    setSelectedRole(r);
  };

  // ── Review flow ──
  const handleReview = async () => {
    if (!file) return alert("Mohon unggah file CV terlebih dahulu.");
    const target = role.trim();
    if (!target) return alert("Mohon pilih atau ketik Target Role.");

    setState("loading");
    setLoadingText("Mengekstrak data dari CV Anda...");

    try {
      // Step 1 – analyze
      const formData = new FormData();
      formData.append("file", file);
      const analyzeRes = await fetch(`${DATA_SCIENCE}/analyze`, {
        method: "POST",
        body: formData,
      });
      if (!analyzeRes.ok) {
        const err = await analyzeRes.json();
        throw new Error(err.detail || "Gagal mengekstrak CV.");
      }
      const cv = await analyzeRes.json();
      setCvData(cv);

      // Step 2 – match
      setLoadingText(`Mencocokkan profil Anda untuk posisi ${target}...`);
      const matchRes = await fetch(`${DATA_SCIENCE}/match`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cv_skills: cv.skills_flat,
          cv_education: cv.education,
          job_title: target,
          job_requirements: getRequirements(target),
        }),
      });
      if (!matchRes.ok) {
        const err = await matchRes.json();
        throw new Error(err.detail || "Gagal mencocokkan data.");
      }
      const match = await matchRes.json();
      setResults(match);
      setState("results");
    } catch (err) {
      setState("idle");
      alert("Error: " + err.message);
    }
  };

  // ── Reset ──
  const handleReset = () => {
    setState("idle");
    setFile(null);
    setRole("");
    setSelectedRole(null);
    setResults(null);
    setCvData(null);
  };

  // ── Score color ──
  const scoreColor = (s) => {
    if (s >= 80) return { ring: "#16A34A", text: "text-emerald-600", bg: "bg-emerald-50 border-emerald-200", catText: "text-emerald-700" };
    if (s >= 60) return { ring: "#D97706", text: "text-amber-600", bg: "bg-amber-50 border-amber-200", catText: "text-amber-700" };
    return { ring: "#DC2626", text: "text-red-600", bg: "bg-red-50 border-red-200", catText: "text-red-700" };
  };

  const circumference = 2 * Math.PI * 54;
  const offset = results ? circumference - (results.match_percentage / 100) * circumference : circumference;
  const colors = results ? scoreColor(results.match_percentage) : null;

  return (
    <div
      className="min-h-screen pt-24 pb-16"
      style={{ background: "linear-gradient(160deg, #f0f7ff 0%, #e8f4ff 50%, #dbeeff 100%)" }}
    >
      {/* ── Page width container ── */}
      <div className="max-w-6xl mx-auto px-5">
        {/* ── Two-column layout ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">

          {/* ════════ LEFT COLUMN ════════ */}
          <section className="lg:col-span-6 flex flex-col gap-8">
            {/* Hero Text */}
            <div>
              <span
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold mb-5 shadow-sm"
                style={{ background: "rgba(255,255,255,0.85)", color: "#1E1B4B", border: "1px solid rgba(255,255,255,0.6)" }}
              >
                <span className="w-2 h-2 rounded-full bg-[#6CC1FF] inline-block" />
                Akselerasi Karir Bersama AI
              </span>

              <h1
                className="text-5xl font-extrabold text-[#0f172a] leading-[1.12] tracking-tight mb-4"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
              >
                Tingkatkan Peluangmu <br /> Lolos{" "}
                <span className="relative inline-block" style={{ color: "#2563EB" }}>
                  Seleksi ATS CV
                  <svg className="absolute -bottom-1 left-0 w-full" height="6" viewBox="0 0 200 6" preserveAspectRatio="none" fill="none">
                    <path d="M0 5 Q50 1 100 4 Q150 7 200 3" stroke="#6CC1FF" strokeWidth="3" strokeLinecap="round" />
                  </svg>
                </span>{" "}
                hingga 73%
              </h1>

              <p className="text-slate-500 text-base leading-relaxed">
                Analisis CV kamu dengan AI dan dapatkan rekomendasi spesifik untuk meningkatkan peluang lolos seleksi ATS perusahaan.
              </p>
            </div>

            {/* Form Card */}
            <div
              className="rounded-3xl p-8 flex flex-col gap-6"
              style={{
                background: "rgba(255,255,255,0.85)",
                boxShadow: "0 8px 40px rgba(30,27,75,0.10)",
                border: "1.5px solid rgba(255,255,255,0.9)",
                backdropFilter: "blur(12px)",
              }}
            >
              {/* Upload Zone */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                  Unggah CV Kamu <span className="text-red-500">*</span>
                </label>
                <div
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={onDragOver}
                  onDragLeave={onDragLeave}
                  onDrop={onDrop}
                  className="rounded-2xl p-8 flex flex-col items-center justify-center gap-3 cursor-pointer transition-all duration-300"
                  style={{
                    border: `2px dashed ${dragging ? "#2563EB" : file ? "#2563EB" : "#CBD5E1"}`,
                    background: dragging ? "#EFF6FF" : file ? "#F0F7FF" : "rgba(241,245,249,0.7)",
                  }}
                >
                  <input ref={fileInputRef} type="file" className="hidden" accept=".pdf,.txt" onChange={onFileChange} />
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300"
                    style={{ background: file ? "#EFF6FF" : "#F1F5F9" }}
                  >
                    <Upload size={22} color={file ? "#2563EB" : "#94A3B8"} />
                  </div>
                  <span className="text-sm font-bold" style={{ color: file ? "#2563EB" : "#64748B" }}>
                    {file ? file.name : "Klik untuk unggah atau seret & lepas"}
                  </span>
                  <span className="text-[11px] text-slate-400 font-semibold">PDF atau TXT (Maks. 5MB)</span>
                </div>
              </div>

              {/* Target Role Input */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                  Target Posisi <span className="text-red-500">*</span>
                </label>
                <div className="relative mb-3">
                  <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={role}
                    onChange={(e) => { setRole(e.target.value); setSelectedRole(null); }}
                    placeholder="Cari posisi (contoh: Product Designer, Data Analyst)"
                    className="w-full pl-10 pr-4 py-3 text-sm rounded-xl outline-none transition-all"
                    style={{
                      background: "#F8FAFC",
                      border: "1.5px solid #E2E8F0",
                      color: "#0f172a",
                    }}
                    onFocus={(e) => { e.target.style.borderColor = "#2563EB"; e.target.style.boxShadow = "0 0 0 3px rgba(37,99,235,0.08)"; }}
                    onBlur={(e) => { e.target.style.borderColor = "#E2E8F0"; e.target.style.boxShadow = "none"; }}
                  />
                </div>

                {/* Suggested roles */}
                <div>
                  <span className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Disarankan untuk kamu</span>
                  <div className="flex flex-wrap gap-2">
                    {SUGGESTED_ROLES.map((r) => (
                      <button
                        key={r}
                        onClick={() => selectRole(r)}
                        className="px-3 py-1.5 rounded-lg text-[11.5px] font-bold transition-all duration-150 cursor-pointer"
                        style={
                          selectedRole === r
                            ? { background: "#1E1B4B", color: "#fff", border: "1.5px solid #1E1B4B" }
                            : { background: "rgba(255,255,255,0.9)", color: "#475569", border: "1.5px solid #E2E8F0" }
                        }
                        onMouseEnter={(e) => {
                          if (selectedRole !== r) {
                            e.currentTarget.style.background = "#EFF6FF";
                            e.currentTarget.style.color = "#2563EB";
                            e.currentTarget.style.borderColor = "#BFDBFE";
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (selectedRole !== r) {
                            e.currentTarget.style.background = "rgba(255,255,255,0.9)";
                            e.currentTarget.style.color = "#475569";
                            e.currentTarget.style.borderColor = "#E2E8F0";
                          }
                        }}
                      >
                        + {r}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Submit */}
              <button
                onClick={handleReview}
                disabled={state === "loading"}
                className="w-full py-4 rounded-[14px] text-white text-sm font-bold tracking-tight transition-all duration-200 flex items-center justify-center gap-2"
                style={{
                  background: "linear-gradient(135deg, #1E1B4B 0%, #2563EB 100%)",
                  boxShadow: "0 4px 20px rgba(30,27,75,0.28), 0 1px 3px rgba(30,27,75,0.18)",
                  opacity: state === "loading" ? 0.75 : 1,
                }}
              >
                {state === "loading" ? (
                  <><Loader2 size={16} className="animate-spin" /> Memproses...</>
                ) : (
                  <><Sparkles size={16} /> Analisis Sekarang</>
                )}
              </button>
            </div>
          </section>

          {/* ════════ RIGHT COLUMN ════════ */}
          <section className="lg:col-span-6 lg:sticky lg:top-24">

            {/* ── IDLE: Mascot panel ── */}
            {state === "idle" && (
              <div
                className="rounded-3xl p-8 flex flex-col items-center text-center"
                style={{
                  background: "rgba(255,255,255,0.80)",
                  boxShadow: "0 8px 40px rgba(30,27,75,0.10)",
                  border: "1.5px solid rgba(255,255,255,0.9)",
                }}
              >
                <div className="w-56 h-56 mb-4">
                  <MascotSVG />
                </div>
                <h2
                  className="text-xl font-extrabold mb-2"
                  style={{ color: "#1E1B4B", fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                >
                  BisaKerja Statistics Mascot
                </h2>
                <p className="text-sm text-slate-500 leading-relaxed max-w-xs mb-7">
                  Mascot AI kami siap menganalisis CV Anda secara real-time. Unggah file dan pilih target posisi untuk memulai.
                </p>
                <div
                  className="grid grid-cols-3 gap-6 w-full border-t pt-6"
                  style={{ borderColor: "#E2E8F0" }}
                >
                  {[
                    { value: "73%", label: "Rata-rata Peningkatan" },
                    { value: "< 3 detik", label: "Kecepatan" },
                    { value: "100%", label: "Aman & Privat" },
                  ].map((s) => (
                    <div key={s.label}>
                      <p className="text-xl font-bold text-[#1E1B4B]">{s.value}</p>
                      <p className="text-[10px] text-slate-400 uppercase font-bold mt-1 tracking-wider">{s.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── LOADING panel ── */}
            {state === "loading" && (
              <div
                className="rounded-3xl p-10 flex flex-col items-center justify-center min-h-[400px] text-center"
                style={{
                  background: "rgba(255,255,255,0.80)",
                  boxShadow: "0 8px 40px rgba(30,27,75,0.10)",
                  border: "1.5px solid rgba(255,255,255,0.9)",
                }}
              >
                <div
                  className="w-20 h-20 rounded-full flex items-center justify-center mb-6 relative"
                  style={{ background: "linear-gradient(135deg, #1E1B4B 0%, #2563EB 100%)", boxShadow: "0 8px 32px rgba(37,99,235,0.3)" }}
                >
                  <Bot size={36} color="white" />
                  <span
                    className="absolute inset-0 rounded-full border-4 border-[#6CC1FF] border-t-transparent animate-spin"
                    style={{ boxSizing: "border-box" }}
                  />
                </div>
                <h3 className="text-lg font-bold text-[#1E1B4B] mb-2">Sedang Menganalisis...</h3>
                <p className="text-sm text-slate-500 max-w-xs leading-relaxed">{loadingText}</p>
              </div>
            )}

            {/* ── RESULTS dashboard ── */}
            {state === "results" && results && cvData && (
              <div
                className="rounded-3xl p-7 flex flex-col gap-5"
                style={{
                  background: "rgba(255,255,255,0.85)",
                  boxShadow: "0 8px 40px rgba(30,27,75,0.10)",
                  border: "1.5px solid rgba(255,255,255,0.9)",
                }}
              >
                {/* Card header */}
                <div className="flex justify-between items-center border-b pb-4" style={{ borderColor: "#E2E8F0" }}>
                  <div>
                    <h3 className="text-base font-extrabold text-[#1E1B4B]">Analisis Kecocokan ATS</h3>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-[#2563EB] mt-0.5">{role}</p>
                  </div>
                  <button
                    onClick={handleReset}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer"
                    style={{ background: "#F1F5F9", color: "#475569", border: "1.5px solid #E2E8F0" }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = "#EFF6FF"; e.currentTarget.style.color = "#2563EB"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = "#F1F5F9"; e.currentTarget.style.color = "#475569"; }}
                  >
                    <RotateCcw size={13} /> Audit Ulang
                  </button>
                </div>

                {/* Score + Insights */}
                <div className="grid grid-cols-12 gap-5 items-center">
                  {/* Radial ring */}
                  <div className="col-span-5 flex flex-col items-center">
                    <div className="relative w-28 h-28 flex items-center justify-center">
                      <svg className="w-full h-full -rotate-90">
                        <circle cx="56" cy="56" r="48" stroke="#E2E8F0" strokeWidth="7" fill="transparent" />
                        <circle
                          cx="56" cy="56" r="48"
                          stroke={colors.ring}
                          strokeWidth="7"
                          fill="transparent"
                          strokeDasharray={`${2 * Math.PI * 48}`}
                          strokeDashoffset={`${2 * Math.PI * 48 - (results.match_percentage / 100) * 2 * Math.PI * 48}`}
                          strokeLinecap="round"
                          style={{ transition: "stroke-dashoffset 1s ease-in-out" }}
                        />
                      </svg>
                      <div className="absolute text-center">
                        <span className={`text-2xl font-black ${colors.text}`}>{results.match_percentage}%</span>
                        <div className="text-[9px] text-slate-400 uppercase tracking-widest font-bold">Skor</div>
                      </div>
                    </div>
                    <span
                      className={`mt-3 px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider border ${colors.bg} ${colors.catText}`}
                    >
                      {results.match_category}
                    </span>
                  </div>

                  {/* Strengths + Recs */}
                  <div className="col-span-7 flex flex-col gap-4">
                    <div>
                      <h4 className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 mb-1.5">
                        <CheckCircle2 size={14} /> Kekuatan Utama
                      </h4>
                      <ul className="list-disc pl-5 text-[11.5px] text-slate-600 flex flex-col gap-0.5 leading-relaxed">
                        {results.strengths.length ? results.strengths.map((s, i) => <li key={i}>{s}</li>) : <li>Tidak terdeteksi</li>}
                      </ul>
                    </div>
                    <div>
                      <h4 className="flex items-center gap-1.5 text-xs font-bold text-amber-700 mb-1.5">
                        <AlertTriangle size={14} /> Rekomendasi AI
                      </h4>
                      <ul className="list-disc pl-5 text-[11.5px] text-slate-600 flex flex-col gap-0.5 leading-relaxed">
                        {results.recommendations.length ? results.recommendations.map((r, i) => <li key={i}>{r}</li>) : <li>Kualifikasi sudah sangat sesuai.</li>}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Parsed Profile */}
                <div
                  className="rounded-2xl p-4"
                  style={{ background: "#F8FAFF", border: "1.5px solid #DBEAFE" }}
                >
                  <h4 className="text-[10px] font-bold uppercase tracking-wider text-[#2563EB] mb-3">Profil Terdeteksi</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {[
                      { label: "Nama", value: cvData.name },
                      { label: "Email", value: cvData.email },
                      { label: "Telepon", value: cvData.phone },
                      { label: "Pendidikan", value: cvData.education },
                    ].map((f) => (
                      <div key={f.label}>
                        <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">{f.label}</p>
                        <p className="text-xs font-bold text-[#0f172a] mt-0.5 truncate">{f.value || "-"}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Skill pills */}
                <div
                  className="grid grid-cols-2 gap-4 pt-4 border-t"
                  style={{ borderColor: "#E2E8F0" }}
                >
                  <div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-2">Keahlian Terpenuhi</p>
                    <div className="flex flex-wrap gap-1.5">
                      {results.matched_skills.length
                        ? results.matched_skills.map((s) => (
                            <span key={s} className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">{s}</span>
                          ))
                        : <span className="text-xs text-slate-400">Tidak ada</span>}
                    </div>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-2">Perlu Ditambahkan</p>
                    <div className="flex flex-wrap gap-1.5">
                      {results.missing_skills.length
                        ? results.missing_skills.map((s) => (
                            <span key={s} className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-50 text-red-700 border border-red-200">{s}</span>
                          ))
                        : <span className="text-xs text-slate-400">Semua terpenuhi ✓</span>}
                    </div>
                  </div>
                </div>
              </div>
            )}

          </section>
        </div>
      </div>
    </div>
  );
}