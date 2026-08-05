"use client";

import { useState, useRef, use, useEffect } from "react";
import Link from "next/link";
import {
  MapPin,
  CheckCircle2,
  ChevronRight,
  Upload,
  X,
  AlertCircle,
  Clock,
  FileText,
  User,
  ClipboardCheck,
  Loader2,
  Banknote,
  Sparkles,
} from "lucide-react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
import formatRupiah from "@/utils/price-formatter";


const SEMESTERS = [
  "Semester 1", "Semester 2", "Semester 3", "Semester 4",
  "Semester 5", "Semester 6", "Semester 7", "Semester 8+",
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function parseJsonArray(value) {
  if (Array.isArray(value)) return value;
  if (!value) return [];
  try { return JSON.parse(value); } catch { return []; }
}

function normalizeLowongan(item) {
  if (!item) return null;
  return {
    ...item,
    skills:           parseJsonArray(item.tags),
    gaji:             item.gaji || null,
    tipeKerja:        item.tipeKerja || item.tipe || null,
    responsibilities: parseJsonArray(item.responsibilities),
    requirements:     parseJsonArray(item.requirements),
    whoYouAre:        parseJsonArray(item.whoYouAre),
    niceToHave:       parseJsonArray(item.niceToHave),
  };
}

// ─── Google logo ──────────────────────────────────────────────────────────────

function GoogleLogo({ size = 28 }) {
  return (
    <div
      className="rounded-xl flex items-center justify-center flex-shrink-0"
      style={{ width: size + 16, height: size + 16, backgroundColor: "#E8F0FE" }}
    >
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
      </svg>
    </div>
  );
}

function CompanyLogo({ nama, size = 28 }) {
  const isGoogle = nama?.toLowerCase().includes("google");
  if (isGoogle) return <GoogleLogo size={size} />;
  const initial = nama?.[0]?.toUpperCase() || "?";
  return (
    <div
      className="rounded-xl flex items-center justify-center flex-shrink-0 bg-slate-100 border border-slate-200"
      style={{ width: size + 16, height: size + 16 }}
    >
      <span className="font-bold text-slate-600" style={{ fontSize: size * 0.6 }}>
        {initial}
      </span>
    </div>
  );
}

// ─── Step Indicator ───────────────────────────────────────────────────────────

const STEPS = [
  { id: 1, label: "Data diri",  Icon: User },
  { id: 2, label: "Dokumen",    Icon: FileText },
  { id: 3, label: "Konfirmasi", Icon: ClipboardCheck },
];

function StepBar({ current }) {
  return (
    <div className="flex items-center w-full">
      {STEPS.map((step, i) => {
        const done   = current > step.id;
        const active = current === step.id;
        const last   = i === STEPS.length - 1;
        return (
          <div key={step.id} className="flex items-center flex-1 last:flex-none">
            <div className="flex items-center gap-2.5">
              <div
                className={[
                  "w-7 h-7 rounded-full flex items-center justify-center text-[12px] font-bold flex-shrink-0 transition-all duration-300",
                  done   ? "bg-emerald-500 text-white" : "",
                  active ? "bg-[#0A66C2] text-white ring-4 ring-[#0A66C2]/20" : "",
                  !done && !active ? "bg-slate-100 text-slate-400 border border-slate-200" : "",
                ].join(" ")}
              >
                {done ? <CheckCircle2 size={14} /> : step.id}
              </div>
              <span
                className={[
                  "text-[13px] font-semibold whitespace-nowrap transition-colors",
                  active ? "text-slate-900" : "",
                  done   ? "text-emerald-600" : "",
                  !done && !active ? "text-slate-400" : "",
                ].join(" ")}
              >
                {step.label}
              </span>
            </div>
            {!last && (
              <div className="flex-1 mx-3 h-px relative">
                <div className="absolute inset-0 bg-slate-200" />
                <div
                  className="absolute inset-y-0 left-0 bg-[#0A66C2] transition-all duration-500"
                  style={{ width: done ? "100%" : "0%" }}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── JobDetailCard ────────────────────────────────────────────────────────────

function JobDetailCard({ job }) {
  const skills = Array.isArray(job.skills) ? job.skills : [];
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 mb-8">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div className="flex flex-col gap-3 flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <h1 className="text-[18px] font-extrabold text-slate-900">{job.posisi}</h1>
            {job.tipeKerja && (
              <span className="text-[11.5px] font-semibold text-slate-500 border border-slate-200 px-3 py-1 rounded-lg">
                {job.tipeKerja}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {job.tipe && (
              <span className="text-[11px] font-bold px-2.5 py-1 rounded-md border-2 border-emerald-500 text-emerald-600 tracking-wide uppercase">
                {job.tipe}
              </span>
            )}
            {job.gaji && (
              <span className="flex items-center gap-1.5 text-[13px] text-slate-500">
                <span className="text-slate-700">{formatRupiah(job.gaji)}</span>
              </span>
            )}
          </div>
          {skills.length > 0 && (
            <div className="flex items-center gap-2 flex-wrap">
              {skills.map((skill) => (
                <span key={skill} className="text-[12px] font-medium text-slate-600 border border-slate-200 px-3 py-1 rounded-lg">
                  {skill}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
      <div className="border-t border-slate-100 my-4" />
      <div className="flex items-center gap-3">
        <CompanyLogo nama={job.perusahaan?.nama} size={20} />
        <div>
          <p className="text-[13.5px] font-bold text-slate-800">{job.perusahaan?.nama || "—"}</p>
          <p className="flex items-center gap-1 text-[12px] text-slate-400 mt-0.5">
            <MapPin size={11} strokeWidth={2} /> {job.lokasi || "—"}
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── Auto-fill Banner ─────────────────────────────────────────────────────────

function AutoFillBanner({ profileName, onDismiss }) {
  return (
    <div className="flex items-start gap-3 bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3 mb-5">
      <Sparkles size={15} className="text-emerald-600 mt-0.5 flex-shrink-0" />
      <p className="text-[12.5px] text-emerald-800 flex-1 leading-relaxed">
        Data dari profil <strong>{profileName}</strong> otomatis diisi. Periksa kembali dan sesuaikan jika perlu.
      </p>
      <button onClick={onDismiss} className="text-emerald-400 hover:text-emerald-600 transition-colors flex-shrink-0">
        <X size={13} />
      </button>
    </div>
  );
}

// ─── Field components ─────────────────────────────────────────────────────────

function Label({ children, required }) {
  return (
    <label className="block text-[12.5px] font-semibold text-slate-700 mb-1.5">
      {children}
      {required && <span className="text-red-400 ml-0.5">*</span>}
    </label>
  );
}

function Input({ placeholder, value, onChange, type = "text", error }) {
  return (
    <>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={[
          "w-full bg-slate-50 border rounded-xl px-4 py-2.5 text-[13.5px] text-slate-800 placeholder:text-slate-400 outline-none transition-all",
          "focus:bg-white focus:border-[#0A66C2] focus:ring-2 focus:ring-[#0A66C2]/20",
          error ? "border-red-300" : "border-slate-200 hover:border-slate-300",
        ].join(" ")}
      />
      {error && (
        <p className="text-[11.5px] text-red-400 mt-1 flex items-center gap-1">
          <AlertCircle size={11} /> {error}
        </p>
      )}
    </>
  );
}

function Select({ value, onChange, options, placeholder, error }) {
  return (
    <>
      <select
        value={value}
        onChange={onChange}
        className={[
          "w-full bg-slate-50 border rounded-xl px-4 py-2.5 text-[13.5px] outline-none transition-all appearance-none cursor-pointer",
          value ? "text-slate-800" : "text-slate-400",
          "focus:bg-white focus:border-[#0A66C2] focus:ring-2 focus:ring-[#0A66C2]/20",
          error ? "border-red-300" : "border-slate-200 hover:border-slate-300",
        ].join(" ")}
      >
        <option value="" disabled>{placeholder}</option>
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
      {error && (
        <p className="text-[11.5px] text-red-400 mt-1 flex items-center gap-1">
          <AlertCircle size={11} /> {error}
        </p>
      )}
    </>
  );
}

// ─── Skill tag input ──────────────────────────────────────────────────────────

function SkillInput({ skills, setSkills }) {
  const [input, setInput] = useState("");

  const add = (val) => {
    const trimmed = val.trim();
    if (trimmed && !skills.includes(trimmed) && skills.length < 10) {
      setSkills([...skills, trimmed]);
    }
    setInput("");
  };

  const remove = (s) => setSkills(skills.filter((x) => x !== s));

  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      add(input);
    }
  };

  return (
    <div>
      <div className="min-h-[44px] w-full bg-slate-50 border border-slate-200 hover:border-slate-300 focus-within:bg-white focus-within:border-[#0A66C2] focus-within:ring-2 focus-within:ring-[#0A66C2]/20 rounded-xl px-3 py-2 flex flex-wrap gap-1.5 transition-all">
        {skills.map((s) => (
          <span key={s} className="inline-flex items-center gap-1 text-[12px] font-semibold px-2.5 py-0.5 rounded-lg bg-[#EFF6FF] text-[#1D4ED8] border border-[#93C5FD]">
            {s}
            <button onClick={() => remove(s)} className="hover:text-[#0A66C2] transition-colors">
              <X size={10} />
            </button>
          </span>
        ))}
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={() => add(input)}
          placeholder={skills.length === 0 ? "Ketik skill, tekan Enter..." : ""}
          className="flex-1 min-w-[120px] bg-transparent text-[13.5px] text-slate-800 placeholder:text-slate-400 outline-none"
          disabled={skills.length >= 10}
        />
      </div>
      <p className="text-[11px] text-slate-400 mt-1.5">Maksimal 10 skill. Tekan Enter atau koma untuk menambahkan.</p>
    </div>
  );
}

// ─── File upload ──────────────────────────────────────────────────────────────

function FileUpload({ label, hint, accept, file, onFile, error }) {
  const ref = useRef();

  const handleDrop = (e) => {
    e.preventDefault();
    const f = e.dataTransfer.files?.[0];
    if (f) onFile(f);
  };

  return (
    <div>
      <input ref={ref} type="file" accept={accept} className="hidden" onChange={(e) => e.target.files?.[0] && onFile(e.target.files[0])} />
      <div
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        onClick={() => ref.current?.click()}
        className={[
          "w-full border-2 border-dashed rounded-xl p-6 flex flex-col items-center gap-3 cursor-pointer transition-all group",
          file  ? "border-emerald-300 bg-emerald-50"
               : error ? "border-red-300 bg-red-50"
               : "border-slate-200 hover:border-[#0A66C2]/60 hover:bg-blue-50/30",
        ].join(" ")}
      >
        {file ? (
          <>
            <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
              <CheckCircle2 size={20} className="text-emerald-600" />
            </div>
            <div className="text-center">
              <p className="text-[13px] font-semibold text-emerald-700">{file.name}</p>
              <p className="text-[11.5px] text-slate-400 mt-0.5">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
            </div>
            <button onClick={(e) => { e.stopPropagation(); onFile(null); }} className="text-[11.5px] text-slate-400 hover:text-red-500 flex items-center gap-1 transition-colors">
              <X size={11} /> Hapus file
            </button>
          </>
        ) : (
          <>
            <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center group-hover:border-[#0A66C2]/40 transition-colors">
              <Upload size={18} className="text-slate-400 group-hover:text-[#0A66C2] transition-colors" />
            </div>
            <div className="text-center">
              <p className="text-[13px] font-semibold text-slate-600 group-hover:text-slate-800 transition-colors">{label}</p>
              <p className="text-[11.5px] text-slate-400 mt-0.5">{hint}</p>
            </div>
          </>
        )}
      </div>
      {error && (
        <p className="text-[11.5px] text-red-400 mt-1.5 flex items-center gap-1">
          <AlertCircle size={11} /> {error}
        </p>
      )}
    </div>
  );
}

// ─── Card wrapper ─────────────────────────────────────────────────────────────

function Card({ title, children }) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 flex flex-col gap-5">
      <div className="flex items-center gap-2.5">
        <span className="w-1 h-5 bg-[#0A66C2] rounded-full" />
        <h2 className="text-[15px] font-bold text-slate-900">{title}</h2>
      </div>
      {children}
    </div>
  );
}

function Row({ children }) {
  return <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">{children}</div>;
}

// ─── Step 1: Data Diri ────────────────────────────────────────────────────────

function Step1({ data, setData, errors, autoFilled, onDismissBanner }) {
  const set = (key) => (e) => setData((prev) => ({ ...prev, [key]: e.target.value }));

  return (
    <div className="flex flex-col gap-5">
      {/* Banner: data diisi dari profil */}
      {autoFilled && (
        <AutoFillBanner profileName={data.name} onDismiss={onDismissBanner} />
      )}

      <Card title="Informasi pribadi">
        <Row>
          <div>
            <Label required>Nama lengkap</Label>
            <Input placeholder="cth. Budi Santoso" value={data.name} onChange={set("name")} error={errors.name} />
          </div>
          <div>
            <Label required>Email aktif</Label>
            <Input placeholder="cth. budi@email.com" type="email" value={data.email} onChange={set("email")} error={errors.email} />
          </div>
        </Row>
        <Row>
          <div>
            <Label required>Nomor WhatsApp</Label>
            <Input placeholder="cth. 08123456789" value={data.phone} onChange={set("phone")} error={errors.phone} />
          </div>
          <div>
            <Label required>Universitas / Institusi</Label>
            <Input placeholder="cth. Universitas Gadjah Mada" value={data.university} onChange={set("university")} error={errors.university} />
          </div>
        </Row>
        <Row>
          <div>
            <Label>Jurusan / Program studi</Label>
            <Input placeholder="cth. Teknik Informatika" value={data.major} onChange={set("major")} />
          </div>
          <div>
            <Label>Semester / Tingkat</Label>
            <Select value={data.semester} onChange={set("semester")} options={SEMESTERS} placeholder="Pilih semester" />
          </div>
        </Row>
      </Card>

      <Card title="Portofolio & keahlian">
        <div>
          <Label>LinkedIn / GitHub / Portofolio</Label>
          <Input placeholder="cth. https://github.com/budisantoso" value={data.portfolio} onChange={set("portfolio")} />
          <p className="text-[11px] text-slate-400 mt-1.5">Sertakan tautan profil atau portofolio terbaikmu.</p>
        </div>
        <div>
          <Label>Keahlian / Skill</Label>
          <SkillInput skills={data.skills} setSkills={(skills) => setData((prev) => ({ ...prev, skills }))} />
        </div>
        <div>
          <Label required>Motivasi melamar</Label>
          <textarea
            value={data.motivation}
            onChange={set("motivation")}
            placeholder="Ceritakan mengapa kamu tertarik dengan posisi ini..."
            maxLength={500}
            rows={5}
            className={[
              "w-full bg-slate-50 border rounded-xl px-4 py-3 text-[13.5px] text-slate-800 placeholder:text-slate-400 outline-none transition-all resize-none",
              "focus:bg-white focus:border-[#0A66C2] focus:ring-2 focus:ring-[#0A66C2]/20",
              errors.motivation ? "border-red-300" : "border-slate-200 hover:border-slate-300",
            ].join(" ")}
          />
          <div className="flex items-center justify-between mt-1">
            {errors.motivation ? (
              <p className="text-[11.5px] text-red-400 flex items-center gap-1">
                <AlertCircle size={11} /> {errors.motivation}
              </p>
            ) : <span />}
            <span className="text-[11px] text-slate-400">{data.motivation.length} / 500 karakter</span>
          </div>
        </div>
      </Card>
    </div>
  );
}

// ─── Step 2: Dokumen ──────────────────────────────────────────────────────────

function Step2({ data, setData, errors }) {
  const setFile = (key) => (f) => setData((prev) => ({ ...prev, [key]: f }));

  return (
    <div className="flex flex-col gap-5">
      <Card title="Unggah dokumen">
        <div className="bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 flex items-start gap-3">
          <AlertCircle size={15} className="text-[#0A66C2] mt-0.5 flex-shrink-0" />
          <p className="text-[12.5px] text-slate-600 leading-relaxed">
            Pastikan semua dokumen dalam format <strong className="text-slate-900">PDF</strong> dan berukuran maks.{" "}
            <strong className="text-slate-900">5 MB</strong>.
          </p>
        </div>
        <div>
          <Label required>Curriculum Vitae (CV)</Label>
          <FileUpload label="Klik atau seret file CV di sini" hint="PDF · Maks. 5 MB" accept=".pdf" file={data.cv} onFile={setFile("cv")} error={errors.cv} />
        </div>
        <div>
          <Label>Surat Lamaran</Label>
          <FileUpload label="Klik atau seret file surat lamaran" hint="PDF · Maks. 5 MB (opsional)" accept=".pdf" file={data.coverLetter} onFile={setFile("coverLetter")} />
        </div>
        <div>
          <Label>Transkrip Nilai</Label>
          <FileUpload label="Klik atau seret file transkrip" hint="PDF · Maks. 5 MB (opsional)" accept=".pdf" file={data.transcript} onFile={setFile("transcript")} />
        </div>
      </Card>

      <Card title="Ketersediaan">
        <Row>
          <div>
            <Label required>Tanggal mulai magang</Label>
            <Input type="date" value={data.startDate} onChange={(e) => setData((prev) => ({ ...prev, startDate: e.target.value }))} error={errors.startDate} />
          </div>
          <div>
            <Label required>Durasi magang</Label>
            <Select
              value={data.duration}
              onChange={(e) => setData((prev) => ({ ...prev, duration: e.target.value }))}
              options={["1 bulan", "2 bulan", "3 bulan", "4 bulan", "5 bulan", "6 bulan"]}
              placeholder="Pilih durasi"
              error={errors.duration}
            />
          </div>
        </Row>
      </Card>
    </div>
  );
}

// ─── Step 3: Konfirmasi ───────────────────────────────────────────────────────

function SummaryRow({ label, value }) {
  return (
    <div className="flex items-start justify-between gap-4 py-2.5 border-b border-slate-100 last:border-0">
      <span className="text-[12px] text-slate-400 flex-shrink-0 w-[140px]">{label}</span>
      <span className="text-[13px] font-semibold text-slate-700 text-right flex-1">{value || "—"}</span>
    </div>
  );
}

function Step3({ step1, step2, job }) {
  return (
    <div className="flex flex-col gap-5">
      {job && (
        <div className="bg-blue-50 border border-blue-100 rounded-2xl px-5 py-4 flex items-center gap-3">
          <CompanyLogo nama={job.perusahaan?.nama} size={18} />
          <div>
            <p className="text-[13.5px] font-bold text-slate-900">{job.posisi}</p>
            <p className="text-[12px] text-slate-500">
              {job.perusahaan?.nama} · {job.lokasi || "—"}{job.gaji && ` · ${job.gaji}`}
            </p>
          </div>
        </div>
      )}

      <Card title="Ringkasan data diri">
        <SummaryRow label="Nama lengkap" value={step1.name} />
        <SummaryRow label="Email"        value={step1.email} />
        <SummaryRow label="WhatsApp"     value={step1.phone} />
        <SummaryRow label="Universitas"  value={step1.university} />
        <SummaryRow label="Jurusan"      value={step1.major} />
        <SummaryRow label="Semester"     value={step1.semester} />
        <SummaryRow label="Portofolio"   value={step1.portfolio} />
        {step1.skills.length > 0 && (
          <div className="flex items-start justify-between gap-4 py-2.5 border-b border-slate-100">
            <span className="text-[12px] text-slate-400 w-[140px] flex-shrink-0">Skill</span>
            <div className="flex flex-wrap gap-1.5 justify-end flex-1">
              {step1.skills.map((s) => (
                <span key={s} className="text-[11.5px] font-semibold px-2 py-0.5 rounded-md bg-[#EFF6FF] text-[#1D4ED8] border border-[#93C5FD]">{s}</span>
              ))}
            </div>
          </div>
        )}
        <SummaryRow label="Motivasi" value={step1.motivation.slice(0, 80) + (step1.motivation.length > 80 ? "…" : "")} />
      </Card>

      <Card title="Ringkasan dokumen">
        {[
          { label: "CV",              file: step2.cv },
          { label: "Surat Lamaran",   file: step2.coverLetter },
          { label: "Transkrip Nilai", file: step2.transcript },
        ].map(({ label, file }) => (
          <div key={label} className="flex items-center justify-between py-2.5 border-b border-slate-100 last:border-0">
            <span className="text-[12px] text-slate-400">{label}</span>
            {file ? (
              <span className="flex items-center gap-1.5 text-[12.5px] font-semibold text-emerald-600">
                <CheckCircle2 size={13} /> {file.name}
              </span>
            ) : (
              <span className="text-[12px] text-slate-400">Tidak diunggah</span>
            )}
          </div>
        ))}
        <div className="flex items-center justify-between py-2.5 border-b border-slate-100">
          <span className="text-[12px] text-slate-400">Tanggal mulai</span>
          <span className="text-[12.5px] font-semibold text-slate-700">
            {step2.startDate ? new Date(step2.startDate).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }) : "—"}
          </span>
        </div>
        <div className="flex items-center justify-between py-2.5">
          <span className="text-[12px] text-slate-400">Durasi magang</span>
          <span className="text-[12.5px] font-semibold text-slate-700">{step2.duration || "—"}</span>
        </div>
      </Card>

      <div className="bg-white border border-slate-200 rounded-2xl px-5 py-4 flex items-start gap-3">
        <input type="checkbox" id="agree" className="mt-0.5 accent-[#0A66C2] w-4 h-4 cursor-pointer flex-shrink-0" />
        <label htmlFor="agree" className="text-[12.5px] text-slate-500 leading-relaxed cursor-pointer">
          Dengan mengirim lamaran ini, saya menyatakan bahwa semua informasi yang diberikan adalah{" "}
          <strong className="text-slate-800">benar dan akurat</strong>. Saya menyetujui syarat dan ketentuan platform serta bersedia dihubungi untuk proses seleksi lebih lanjut.
        </label>
      </div>
    </div>
  );
}

// ─── Success Screen ───────────────────────────────────────────────────────────

function SuccessScreen({ job }) {
  const posisi     = job?.posisi           || "posisi ini";
  const perusahaan = job?.perusahaan?.nama || "perusahaan";
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-6">
      <div className="relative">
        <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center">
          <CheckCircle2 size={40} className="text-emerald-500" />
        </div>
        <div className="absolute inset-0 rounded-full border-2 border-emerald-300 animate-ping" />
      </div>
      <div className="text-center">
        <h2 className="text-[22px] font-extrabold text-slate-900 mb-2">Lamaran Terkirim!</h2>
        <p className="text-[14px] text-slate-500 max-w-[380px] leading-relaxed">
          Lamaranmu untuk posisi <strong className="text-slate-900">{posisi}</strong> di {perusahaan} telah berhasil dikirim. Tim rekruter akan menghubungimu melalui email atau WhatsApp.
        </p>
      </div>
      <div className="flex items-center gap-3 flex-wrap justify-center mt-2">
        <Link href="/lowongan" className="text-[13.5px] font-semibold text-slate-500 border border-slate-200 px-5 py-2.5 rounded-xl hover:text-slate-800 hover:border-slate-300 transition-colors">
          Lihat lowongan lain
        </Link>
        <Link href="/dashboard-mahasiswa/pendaftaran" className="text-[13.5px] font-semibold text-white bg-[#0A66C2] px-5 py-2.5 rounded-xl hover:bg-[#0958A8] transition-colors">
          Pantau status lamaran →
        </Link>
      </div>
    </div>
  );
}

// ─── Error Banner ─────────────────────────────────────────────────────────────

function ErrorBanner({ message, onClose }) {
  if (!message) return null;
  return (
    <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 flex items-start gap-3 mb-5">
      <AlertCircle size={16} className="text-red-500 mt-0.5 flex-shrink-0" />
      <p className="text-[13px] text-red-700 flex-1">{message}</p>
      <button onClick={onClose} className="text-red-400 hover:text-red-600"><X size={14} /></button>
    </div>
  );
}

// ─── Helper: mapping semester angka → label ────────────────────────────────────
function semesterLabel(angka) {
  if (!angka) return "";
  const n = Number(angka);
  if (n >= 8) return "Semester 8+";
  if (n >= 1 && n <= 7) return `Semester ${n}`;
  return "";
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function LamarPage({ params }) {
  const resolvedParams = use(params);
  // ✅ ganti dari resolvedParams?.id menjadi resolvedParams?.slug
  const lowonganSlug = resolvedParams?.slug || null;

  const [job, setJob]               = useState(null);
  const [step, setStep]             = useState(1);
  const [submitted, setSubmitted]   = useState(false);
  const [loading, setLoading]       = useState(false);
  const [errors, setErrors]         = useState({});
  const [apiError, setApiError]     = useState("");
  const [autoFilled, setAutoFilled] = useState(false);

  const [step1, setStep1] = useState({
    name: "", email: "", phone: "", university: "",
    major: "", semester: "", portfolio: "",
    skills: [], motivation: "",
  });

  const [step2, setStep2] = useState({
    cv: null, coverLetter: null, transcript: null,
    startDate: "", duration: "",
  });

  // ── 1. Fetch lowongan (pakai slug) ─────────────────────────────────────────
  useEffect(() => {
    if (!lowonganSlug) return;
    const fetchLowongan = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/lowongan/public/${lowonganSlug}`);
        const result = await res.json();
        if (res.ok) setJob(normalizeLowongan(result.data));
      } catch (err) {
        console.error("Gagal mengambil data lowongan:", err);
      }
    };
    fetchLowongan();
  }, [lowonganSlug]);

  // ── 2. Fetch profil mahasiswa → auto-fill Step 1 ───────────────────────────
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const res = await fetch(`${API_BASE}/api/mahasiswa/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const result = await res.json();
        if (!res.ok) return;

        const data = result.data;
        if (!data) return;

        const profileSkills = Array.isArray(data.skills)
          ? data.skills.map((s) => (typeof s === "string" ? s : s.name)).filter(Boolean)
          : [];

        const semStr = semesterLabel(data.semester);

        setStep1((prev) => ({
          ...prev,
          name:       data.nama          || data.user?.name  || prev.name,
          email:      data.user?.email   || prev.email,
          phone:      data.telepon       || prev.phone,
          university: data.prodi
                        ? prev.university
                        : prev.university,
          major:      data.prodi         || prev.major,
          semester:   semStr             || prev.semester,
          portfolio:  data.sosialMedia?.github
                        ? `https://github.com/${data.sosialMedia.github}`
                        : data.sosialMedia?.website
                        ? data.sosialMedia.website
                        : prev.portfolio,
          skills:     profileSkills.length > 0 ? profileSkills : prev.skills,
        }));

        if (data.nama || data.user?.name) setAutoFilled(true);

      } catch (err) {
        console.error("Gagal mengambil profil untuk auto-fill:", err);
      }
    };

    fetchProfile();
  }, []);

  // ── Validation ─────────────────────────────────────────────────────────────

  const validateStep1 = () => {
    const e = {};
    if (!step1.name.trim())       e.name       = "Nama lengkap wajib diisi";
    if (!step1.email.trim())      e.email      = "Email wajib diisi";
    else if (!/\S+@\S+\.\S+/.test(step1.email)) e.email = "Format email tidak valid";
    if (!step1.phone.trim())      e.phone      = "Nomor WhatsApp wajib diisi";
    if (!step1.university.trim()) e.university = "Universitas wajib diisi";
    if (!step1.motivation.trim()) e.motivation = "Motivasi wajib diisi";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const validateStep2 = () => {
    const e = {};
    if (!step2.cv)        e.cv        = "CV wajib diunggah";
    if (!step2.startDate) e.startDate = "Tanggal mulai wajib diisi";
    if (!step2.duration)  e.duration  = "Durasi magang wajib dipilih";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleNext = () => {
    setErrors({});
    setApiError("");
    if (step === 1 && !validateStep1()) return;
    if (step === 2 && !validateStep2()) return;
    setStep((s) => s + 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBack = () => {
    setErrors({});
    setApiError("");
    setStep((s) => s - 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // ── Submit ─────────────────────────────────────────────────────────────────

  const handleSubmit = async () => {
    setApiError("");
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setApiError("Sesi login tidak ditemukan. Silakan login ulang.");
        setLoading(false);
        return;
      }

      // ✅ pastikan job sudah ter-fetch sebelum submit, karena kita butuh id asli (numerik)
      if (!job?.id) {
        setApiError("Data lowongan belum termuat. Coba muat ulang halaman.");
        setLoading(false);
        return;
      }

      const formData = new FormData();
      formData.append("name",       step1.name);
      formData.append("email",      step1.email);
      formData.append("phone",      step1.phone);
      formData.append("university", step1.university);
      formData.append("major",      step1.major);
      formData.append("semester",   step1.semester);
      formData.append("portfolio",  step1.portfolio);
      formData.append("skills",     JSON.stringify(step1.skills));
      formData.append("motivation", step1.motivation);
      formData.append("startDate",  step2.startDate);
      formData.append("duration",   step2.duration);
      if (step2.cv)          formData.append("cv",          step2.cv);
      if (step2.coverLetter) formData.append("coverLetter", step2.coverLetter);
      if (step2.transcript)  formData.append("transcript",  step2.transcript);
      // ✅ kirim id numerik asli (job.id), bukan slug dari URL
      formData.append("lowonganId", job.id);

      const res = await fetch(`${API_BASE}/api/lamaran`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        setApiError(data.message || "Gagal mengirim lamaran. Coba lagi.");
        setLoading(false);
        return;
      }

      setSubmitted(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      setApiError("Tidak dapat terhubung ke server. Pastikan backend berjalan.");
    } finally {
      setLoading(false);
    }
  };

  const headerTitle    = job?.posisi || "Memuat lowongan...";
  const headerDeadline = job?.deadline
    ? new Date(job.deadline).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })
    : "";

  return (
    <div className="min-h-screen font-[Plus_Jakarta_Sans,Segoe_UI,sans-serif] bg-gradient-to-br from-slate-50 via-blue-50/20 to-white">

      {/* Sticky job header */}
      <div className="border-b sticky top-0 z-30 backdrop-blur-md pt-20" style={{ backgroundColor: "rgba(255,255,255,0.92)", borderColor: "#e2e8f0" }}>
        <div className="max-w-[760px] mx-auto px-6 py-3.5 flex items-center justify-between gap-4 flex-wrap">
          {headerDeadline && (
            <div className="flex items-center gap-1.5 text-[12px] text-red-400 font-semibold">
              <Clock size={13} /> Deadline {headerDeadline}
            </div>
          )}
        </div>
        {!submitted && (
          <div className="border-t border-slate-100">
            <div className="max-w-[760px] mx-auto px-6 py-2 flex items-center gap-1.5 text-[12px]">
              <Link href="/" className="text-slate-400 hover:text-[#0A66C2] transition-colors">Beranda</Link>
              <ChevronRight size={12} className="text-slate-300 flex-shrink-0" />
              <Link href="/lowongan" className="text-slate-400 hover:text-[#0A66C2] transition-colors">Lowongan</Link>
              <ChevronRight size={12} className="text-slate-300 flex-shrink-0" />
              <span className="text-slate-700 font-semibold truncate">{headerTitle}</span>
            </div>
          </div>
        )}
      </div>

      {/* Main content */}
      <div className="max-w-[760px] mx-auto px-6 py-8 pb-28">
        {!submitted && (
          <>
            {job && <JobDetailCard job={job} />}
            <div className="mb-8"><StepBar current={step} /></div>
          </>
        )}

        {!submitted && <ErrorBanner message={apiError} onClose={() => setApiError("")} />}

        {submitted ? (
          <SuccessScreen job={job} />
        ) : step === 1 ? (
          <Step1
            data={step1}
            setData={setStep1}
            errors={errors}
            autoFilled={autoFilled}
            onDismissBanner={() => setAutoFilled(false)}
          />
        ) : step === 2 ? (
          <Step2 data={step2} setData={setStep2} errors={errors} />
        ) : (
          <Step3 step1={step1} step2={step2} job={job} />
        )}
      </div>

      {/* Sticky bottom nav */}
      {!submitted && (
        <div className="sticky bottom-0 border-t backdrop-blur-md z-30" style={{ backgroundColor: "rgba(255,255,255,0.92)", borderColor: "#e2e8f0" }}>
          <div className="max-w-[760px] mx-auto px-6 py-4 flex items-center justify-between gap-4">
            {step > 1 ? (
              <button onClick={handleBack} className="text-[13.5px] font-semibold text-slate-500 hover:text-slate-900 border border-slate-200 px-5 py-2.5 rounded-xl transition-all hover:border-slate-300">
                ← Kembali
              </button>
            ) : (
              <Link href="/lowongan" className="text-[13.5px] font-semibold text-slate-400 hover:text-slate-700 transition-colors">Batal</Link>
            )}

            <div className="flex items-center gap-3">
              <div className="flex gap-1.5">
                {STEPS.map((s) => (
                  <div
                    key={s.id}
                    className={[
                      "rounded-full transition-all duration-300",
                      step === s.id ? "w-5 h-2 bg-[#0A66C2]"  : "",
                      step >  s.id ? "w-2 h-2 bg-emerald-500" : "",
                      step <  s.id ? "w-2 h-2 bg-slate-200"   : "",
                    ].join(" ")}
                  />
                ))}
              </div>

              {step < 3 ? (
                <button onClick={handleNext} className="flex items-center gap-2 text-[13.5px] font-bold text-white bg-[#0A66C2] px-6 py-2.5 rounded-xl hover:bg-[#0958A8] transition-colors">
                  Selanjutnya <ChevronRight size={15} />
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="flex items-center gap-2 text-[13.5px] font-bold text-white bg-[#0A66C2] px-6 py-2.5 rounded-xl hover:bg-[#0958A8] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading ? <><Loader2 size={15} className="animate-spin" /> Mengirim...</> : <><CheckCircle2 size={15} /> Kirim Lamaran</>}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}