"use client";

import { useState, useEffect, useRef } from "react";
import Topbar from "../../components/topbar";
const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000";
const getToken = () => { try { return localStorage.getItem("token") || ""; } catch { return ""; } };


const STATUS_CONFIG = {
  MENUNGGU_VERIFIKASI_PRODI: {
    label: "Menunggu Verifikasi Prodi",
    badge: "bg-amber-50 text-amber-700 border border-amber-200",
    step: 3,
  },
  MENUNGGU_PERSETUJUAN_DOSEN: {
    label: "Menunggu Persetujuan Dosen",
    badge: "bg-violet-50 text-violet-700 border border-violet-200",
    step: 5,
  },
  BIMBINGAN_AKTIF: {
    label: "Bimbingan Aktif",
    badge: "bg-emerald-50 text-emerald-700 border border-emerald-200",
    step: 6,
  },
  DITOLAK_DOSEN: {
    label: "Ditolak Dosen",
    badge: "bg-red-50 text-red-600 border border-red-200",
    step: 5,
  },
  SELESAI: {
    label: "Magang Selesai",
    badge: "bg-slate-100 text-slate-600 border border-slate-200",
    step: 7,
  },
};

const STEPS = [
  { key: "pengajuan_magang",    label: "Pengajuan Magang" },
  { key: "diterima_perusahaan", label: "Diterima Perusahaan" },
  { key: "pengajuan_dosen",     label: "Pengajuan Dosen" },
  { key: "verifikasi_prodi",    label: "Verifikasi Prodi" },
  { key: "penetapan_dosen",     label: "Penetapan Dosen" },
  { key: "persetujuan_dosen",   label: "Persetujuan Dosen" },
  { key: "bimbingan_aktif",     label: "Bimbingan Aktif" },
  { key: "selesai",             label: "Magang Selesai" },
];

function getActiveStep(lamaran, pengajuan) {
  if (!lamaran) return 0;
  if (!pengajuan) {
    if (lamaran.status === "KONFIRMASI_DITERIMA") return 2;
    if (["DITERIMA_MAGANG"].includes(lamaran.status)) return 1;
    return 0;
  }
  return STATUS_CONFIG[pengajuan.status]?.step ?? 2;
}

// ─── Stepper ──────────────────────────────────────────────────────────────────
function Stepper({ activeStep }) {
  return (
    <div className="overflow-x-auto pb-1">
      <div className="flex items-start min-w-max gap-0">
        {STEPS.map((step, i) => {
          const state = i < activeStep ? "done" : i === activeStep ? "active" : "pending";
          const circle = {
            done:    "bg-[#e0f2fe] border-[#0A66C2] text-[#0A66C2]",
            active:  "bg-[#0A66C2] border-[#0A66C2] text-white",
            pending: "bg-white border-[#e0e8f0] text-[#9898b0]",
          }[state];
          const labelCls = {
            done:    "text-[#0A66C2]",
            active:  "text-[#0A66C2] font-bold",
            pending: "text-[#9898b0]",
          }[state];
          const lineColor = state === "done" ? "bg-[#7dd3fc]" : "bg-[#e8eef5]";
          const icon = state === "done" ? "✓" : state === "active" ? String(i + 1) : String(i + 1);

          return (
            <div key={step.key} className="flex items-start">
              <div className="flex flex-col items-center gap-2 w-[76px]">
                <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-bold flex-shrink-0 transition-all ${circle}`}>
                  {icon}
                </div>
                <span className={`text-[9px] text-center leading-tight tracking-wide uppercase ${labelCls}`}>
                  {step.label}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div className={`w-6 h-0.5 mt-4 flex-shrink-0 ${lineColor}`} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Card Shell ───────────────────────────────────────────────────────────────
function Card({ children, className = "" }) {
  return (
    <div className={`bg-white border border-[#e8e8f0] rounded-2xl overflow-hidden ${className}`}>
      {children}
    </div>
  );
}

// CardHead sekarang punya garis aksen biru di depan judul, dan opsi link "Lihat semua"
function CardHead({ title, right, viewAllHref, viewAllLabel = "Lihat semua" }) {
  return (
    <div className="flex items-center justify-between px-6 py-4 border-b border-[#e8eef5]">
      <div className="flex items-center gap-3">
        <span className="w-1 h-5 rounded-full bg-[#0A66C2] flex-shrink-0" />
        <span className="text-sm font-bold text-[#1e1e2e] tracking-tight">{title}</span>
      </div>
      {right}
      {!right && viewAllHref && (
        <a
          href={viewAllHref}
          className="text-sm font-semibold text-[#0A66C2] hover:underline flex items-center gap-1"
        >
          {viewAllLabel} <span aria-hidden="true">→</span>
        </a>
      )}
    </div>
  );
}

function CardBody({ children, className = "" }) {
  return <div className={`px-6 py-5 ${className}`}>{children}</div>;
}

// ─── Info Row ─────────────────────────────────────────────────────────────────
function InfoRow({ label, value }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-[10px] font-semibold uppercase tracking-widest text-[#9898b0]">{label}</span>
      <span className="text-sm font-semibold text-[#1e1e2e]">{value || "—"}</span>
    </div>
  );
}

// ─── Timeline ─────────────────────────────────────────────────────────────────
function RiwayatTimeline({ riwayat }) {
  if (!riwayat?.length) return null;
  return (
    <div>
      {riwayat.map((r, i) => (
        <div key={r.id} className="flex gap-3">
          <div className="flex flex-col items-center pt-0.5">
            <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${i === 0 ? "bg-[#0A66C2]" : "bg-[#d0d8f0]"}`} />
            {i < riwayat.length - 1 && <div className="w-px bg-[#e8eef5] flex-1 mt-1 min-h-[28px]" />}
          </div>
          <div className="pb-4">
            <p className="text-sm font-semibold text-[#1e1e2e]">
              {STATUS_CONFIG[r.status]?.label || r.status}
            </p>
            {r.keterangan && <p className="text-xs text-[#6b7280] mt-0.5">{r.keterangan}</p>}
            <p className="text-[11px] text-[#9898b0] mt-0.5">
              {new Date(r.createdAt).toLocaleDateString("id-ID", {
                day: "numeric", month: "short", year: "numeric",
                hour: "2-digit", minute: "2-digit",
              })}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Form Label ───────────────────────────────────────────────────────────────
function FieldLabel({ children }) {
  return (
    <label className="block text-[10px] font-bold uppercase tracking-widest text-[#6b7280] mb-2">
      {children}
    </label>
  );
}

// ─── Custom Dosen Select ────────────────────────────────────────────────────
function initials(name = "") {
  return name.split(" ").filter(Boolean).slice(0, 2).map((w) => w[0]).join("").toUpperCase();
}

function DosenSelect({ dosenList, value, onChange }) {
  const [open, setOpen]   = useState(false);
  const [query, setQuery] = useState("");
  const ref = useRef(null);

  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const selected = dosenList.find((d) => String(d.id) === String(value));
  const filtered = dosenList.filter((d) => {
    const name = d.user?.name || d.name || "";
    const dept = d.department || "";
    return (name + " " + dept).toLowerCase().includes(query.toLowerCase());
  });

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={`w-full flex items-center justify-between gap-3 border rounded-xl px-4 py-3 text-left transition-colors bg-white
          ${open ? "border-[#0A66C2] ring-2 ring-[#0A66C2]/10" : "border-[#e8e8f0] hover:border-[#c7d2e0]"}`}
      >
        <div className="flex items-center gap-3 min-w-0">
          {selected ? (
            <>
              <div className="w-8 h-8 rounded-full bg-[#e0f2fe] text-[#0A66C2] flex items-center justify-center text-xs font-bold flex-shrink-0">
                {initials(selected.user?.name || selected.name)}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-[#1e1e2e] truncate">
                  {selected.user?.name || selected.name}
                </p>
                {selected.department && (
                  <p className="text-xs text-[#9898b0] truncate">{selected.department}</p>
                )}
              </div>
            </>
          ) : (
            <>
              <div className="w-8 h-8 rounded-full bg-[#f1f2f6] text-[#9898b0] flex items-center justify-center flex-shrink-0">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                </svg>
              </div>
              <span className="text-sm text-[#9898b0]">Tidak ada usulan / terserah prodi</span>
            </>
          )}
        </div>
        <svg
          viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
          className={`w-4 h-4 text-[#9898b0] flex-shrink-0 transition-transform ${open ? "rotate-180" : ""}`}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {open && (
        <div className="absolute z-20 mt-2 w-full bg-white border border-[#e8e8f0] rounded-xl shadow-lg overflow-hidden">
          <div className="p-2 border-b border-[#e8eef5]">
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Cari nama dosen..."
              className="w-full text-sm px-3 py-2 rounded-lg bg-[#f7f7fb] focus:outline-none focus:ring-2 focus:ring-[#0A66C2]/20"
            />
          </div>

          <div className="max-h-56 overflow-y-auto py-1">
            <button
              type="button"
              onClick={() => { onChange(""); setOpen(false); setQuery(""); }}
              className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-[#f7f7fb] text-left transition-colors"
            >
              <div className="w-7 h-7 rounded-full bg-[#f1f2f6] text-[#9898b0] flex items-center justify-center flex-shrink-0">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-3.5 h-3.5">
                  <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </div>
              <span className="text-sm text-[#6b7280]">Tidak ada usulan / terserah prodi</span>
            </button>

            {filtered.length ? filtered.map((d) => {
              const name = d.user?.name || d.name || "—";
              const isSelected = String(d.id) === String(value);
              return (
                <button
                  key={d.id}
                  type="button"
                  onClick={() => { onChange(d.id); setOpen(false); setQuery(""); }}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors ${
                    isSelected ? "bg-[#e0f2fe]" : "hover:bg-[#f7f7fb]"
                  }`}
                >
                  <div className="w-7 h-7 rounded-full bg-[#e0f2fe] text-[#0A66C2] flex items-center justify-center text-[11px] font-bold flex-shrink-0">
                    {initials(name)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-[#1e1e2e] truncate">{name}</p>
                    {d.department && <p className="text-xs text-[#9898b0] truncate">{d.department}</p>}
                  </div>
                  {isSelected && (
                    <svg viewBox="0 0 24 24" fill="none" stroke="#0A66C2" strokeWidth="3" className="w-4 h-4 flex-shrink-0">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                </button>
              );
            }) : (
              <p className="text-sm text-[#9898b0] px-4 py-3">Dosen tidak ditemukan.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Form Pengajuan ───────────────────────────────────────────────────────────
function FormPengajuan({ lamaran, dosenList, onSubmit, loading }) {
  const [form, setForm] = useState({ dosenUsulanId: "", alasanMemilih: "", catatanTambahan: "" });
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  const valid = form.alasanMemilih.trim().length >= 10;
  const charLen = form.alasanMemilih.length;

  return (
    <Card>
      <CardHead title="Form Pengajuan Dosen Pembimbing" />
      <CardBody className="space-y-5">

        {/* Dosen Usulan */}
        <div>
          <FieldLabel>
            Dosen Pembimbing Usulan{" "}
            <span className="normal-case font-normal text-[#9898b0] tracking-normal">(opsional)</span>
          </FieldLabel>
          <DosenSelect
            dosenList={dosenList}
            value={form.dosenUsulanId}
            onChange={(id) => set("dosenUsulanId", id)}
          />
          <p className="text-xs text-[#9898b0] mt-1.5">
            Kamu bisa mengusulkan dosen, namun keputusan akhir ada di tangan prodi.
          </p>
        </div>

        {/* Alasan */}
        <div>
          <FieldLabel>
            Alasan Memilih Dosen <span className="text-red-400 normal-case tracking-normal">*</span>
          </FieldLabel>
          <textarea
            value={form.alasanMemilih}
            onChange={(e) => set("alasanMemilih", e.target.value)}
            rows={4}
            placeholder="Jelaskan alasan kamu memilih dosen ini, atau alasan kamu membutuhkan dosen pembimbing yang sesuai bidang magang..."
            className="w-full border border-[#e8e8f0] rounded-xl px-4 py-3 text-sm text-[#1e1e2e] focus:outline-none focus:border-[#0A66C2] resize-none transition-colors placeholder:text-[#b0b8d0]"
          />
          <div className="flex justify-between mt-1.5">
            <p className="text-xs text-[#9898b0]">Minimal 10 karakter</p>
            <p className={`text-xs font-semibold ${charLen < 10 ? "text-red-400" : "text-emerald-600"}`}>
              {charLen} karakter
            </p>
          </div>
        </div>

        {/* Catatan */}
        <div>
          <FieldLabel>
            Catatan Tambahan{" "}
            <span className="normal-case font-normal text-[#9898b0] tracking-normal">(opsional)</span>
          </FieldLabel>
          <textarea
            value={form.catatanTambahan}
            onChange={(e) => set("catatanTambahan", e.target.value)}
            rows={3}
            placeholder="Informasi tambahan yang perlu diketahui prodi..."
            className="w-full border border-[#e8e8f0] rounded-xl px-4 py-3 text-sm text-[#1e1e2e] focus:outline-none focus:border-[#0A66C2] resize-none transition-colors placeholder:text-[#b0b8d0]"
          />
        </div>

        <button
          disabled={!valid || loading}
          onClick={() => onSubmit({ ...form, lamaranId: lamaran.id })}
          className="w-full py-3 rounded-xl text-sm font-bold bg-[#0A66C2] text-white hover:bg-[#0958a8] disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Mengirim...</span>
            </>
          ) : (
            <>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4">
                <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
              <span>Kirim Pengajuan</span>
            </>
          )}
        </button>
      </CardBody>
    </Card>
  );
}

// ─── Status Card ──────────────────────────────────────────────────────────────
function StatusCard({ pengajuan }) {
  const sc          = STATUS_CONFIG[pengajuan.status] || {};
  const dosenNama   = pengajuan.dosenDitetapkan?.user?.name || pengajuan.dosenDitetapkan?.name || null;
  const dosenUsulan = pengajuan.dosenUsulan?.user?.name     || pengajuan.dosenUsulan?.name     || null;

  return (
    <Card>
      <CardHead
        title="Status Pengajuan"
        right={
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${sc.badge}`}>
            {sc.label}
          </span>
        }
      />
      <CardBody className="space-y-6">
        {/* Info Dosen */}
        <div className="grid grid-cols-2 gap-x-8 gap-y-5">
          <InfoRow label="Dosen Usulan"     value={dosenUsulan || "Tidak ada usulan"} />
          <InfoRow label="Dosen Ditetapkan" value={dosenNama   || "Belum ditetapkan"} />
          <InfoRow label="Alasan Memilih"   value={pengajuan.alasanMemilih} />
          {pengajuan.catatanTambahan && (
            <InfoRow label="Catatan" value={pengajuan.catatanTambahan} />
          )}
          {pengajuan.alasanPenolakan && (
            <div className="col-span-2 bg-red-50 border border-red-100 rounded-xl p-4">
              <p className="text-[10px] font-bold uppercase tracking-widest text-red-400 mb-1">
                Alasan Penolakan Dosen
              </p>
              <p className="text-sm text-red-700">{pengajuan.alasanPenolakan}</p>
            </div>
          )}
        </div>

        {/* Riwayat */}
        <div className="border-t border-[#e8eef5] pt-5">
          <p className="text-sm font-bold text-[#1e1e2e] mb-4">Riwayat Status</p>
          <RiwayatTimeline riwayat={[...(pengajuan.riwayatStatus || [])].reverse()} />
        </div>
      </CardBody>
    </Card>
  );
}

// ─── Daftar Mahasiswa (contoh section dengan header bar biru + "Lihat semua") ──
function DaftarMahasiswaCard({ mahasiswa = [], viewAllHref = "#" }) {
  return (
    <Card>
      <CardHead title="Daftar Mahasiswa" viewAllHref={viewAllHref} />
      <CardBody>
        {mahasiswa.length ? (
          <div className="divide-y divide-[#e8eef5]">
            {mahasiswa.map((m) => (
              <div key={m.id} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
                <div>
                  <p className="text-sm font-semibold text-[#1e1e2e]">{m.name}</p>
                  <p className="text-xs text-[#9898b0]">{m.nim} {m.major ? `· ${m.major}` : ""}</p>
                </div>
                {m.status && (
                  <span className="text-xs font-semibold text-[#0A66C2] bg-[#e0f2fe] px-3 py-1 rounded-full">
                    {m.status}
                  </span>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-[#9898b0]">Belum ada data mahasiswa.</p>
        )}
      </CardBody>
    </Card>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function PengajuanDosenPembimbingPage() {
  const [lamarans,   setLamarans]   = useState([]);
  const [pengajuan,  setPengajuan]  = useState(null);
  const [dosenList,  setDosenList]  = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error,      setError]      = useState("");
  const [toast,      setToast]      = useState("");

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(""), 3500); };

  useEffect(() => {
    async function fetchAll() {
      const token = getToken();
      try {
        const [resLamaran, resDosen, resPengajuan] = await Promise.all([
          fetch(`${API_BASE}/api/lamaran/mahasiswa`,    { headers: { Authorization: `Bearer ${token}` } }),
          fetch(`${API_BASE}/api/dosen`,                { headers: { Authorization: `Bearer ${token}` } }),
          fetch(`${API_BASE}/api/pengajuan-dosen/saya`, { headers: { Authorization: `Bearer ${token}` } }),
        ]);
        const dLamaran   = await resLamaran.json();
        const dDosen     = await resDosen.json();
        const dPengajuan = await resPengajuan.json();
        setLamarans(dLamaran.data   || []);
        setDosenList(dDosen.data    || []);
        setPengajuan((dPengajuan.data || [])[0] || null);
      } catch (e) {
        setError("Gagal memuat data: " + e.message);
      } finally {
        setLoading(false);
      }
    }
    fetchAll();
  }, []);

  const lamaranKonfirmasi = lamarans.find((l) => l.status === "KONFIRMASI_DITERIMA") || null;
  const activeStep        = getActiveStep(lamaranKonfirmasi, pengajuan);

  const handleSubmit = async (formData) => {
    setSubmitting(true);
    try {
      const token = getToken();
      const res = await fetch(`${API_BASE}/api/pengajuan-dosen`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, dosenUsulanId: formData.dosenUsulanId || null }),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.message || "Gagal mengirim");
      setPengajuan(result.data);
      showToast("Pengajuan dosen pembimbing berhasil dikirim!");
      const r = await fetch(`${API_BASE}/api/pengajuan-dosen/saya`, { headers: { Authorization: `Bearer ${token}` } });
      const d = await r.json();
      setPengajuan((d.data || [])[0] || null);
    } catch (e) {
      showToast("Gagal: " + e.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-screen bg-[#f7f7fb] gap-3">
      <div className="w-8 h-8 border-2 border-[#0A66C2] border-t-transparent rounded-full animate-spin" />
      <p className="text-sm text-[#9898b0]">Memuat data...</p>
    </div>
  );

  if (error) return (
    <div className="flex flex-col items-center justify-center h-screen bg-[#f7f7fb]">
      <p className="text-sm text-red-500">{error}</p>
    </div>
  );

  const canApply   = !!lamaranKonfirmasi && (!pengajuan || pengajuan.status === "DITOLAK_DOSEN");
  const perusahaan = lamaranKonfirmasi?.lowongan?.perusahaan?.nama || "—";
  const posisi     = lamaranKonfirmasi?.lowongan?.posisi           || "—";

  return (
    <div className="min-h-screen bg-[#f7f7fb] font-sans">

      {/* Toast */}
      {toast && (
        <div className="fixed top-4 right-4 z-50 bg-[#1e1e2e] text-white text-sm font-medium px-4 py-3 rounded-xl shadow-lg">
          {toast}
        </div>
      )}

   <Topbar
      icon={
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M22 11l-3 3-1.5-1.5" />
        </svg>
      }
      title="Pengajuan Dosen Pembimbing"
      subtitle="Ajukan dosen pembimbing untuk magang kamu"
      rightSlot={
        <button
          onClick={() => window.location.href = "/"}
          className="flex items-center gap-2 px-4 py-2 border border-blue-300 rounded-xl text-blue-600 text-[12.5px] font-semibold bg-transparent transition-all duration-150 hover:bg-blue-500 hover:text-white hover:border-blue-500 cursor-pointer"
        >
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

      {/* Body */}
      <div className="px-8 py-6 flex flex-col gap-5">

        {/* Stepper */}
        <Card>
          <CardHead title="Progress Magang" />
          <CardBody>
            <Stepper activeStep={activeStep} />
          </CardBody>
        </Card>

        {/* Informasi Magang */}
        {lamaranKonfirmasi ? (
          <Card>
            <CardHead title="Informasi Magang" />
            <CardBody>
              <div className="grid grid-cols-3 gap-x-8 gap-y-5">
                <InfoRow label="Perusahaan"   value={perusahaan} />
                <InfoRow label="Posisi"        value={posisi} />
                <InfoRow label="Durasi"        value={lamaranKonfirmasi.duration} />
                <InfoRow label="Universitas"   value={lamaranKonfirmasi.university} />
                <InfoRow label="Program Studi" value={lamaranKonfirmasi.major} />
                <InfoRow label="Semester"      value={lamaranKonfirmasi.semester ? `Semester ${lamaranKonfirmasi.semester}` : "—"} />
              </div>
            </CardBody>
          </Card>
        ) : (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center flex-shrink-0 mt-0.5">
              <svg viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2" className="w-5 h-5">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                <line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-bold text-amber-800">Belum Dapat Mengajukan</p>
              <p className="text-sm text-amber-700 mt-1 leading-relaxed">
                Pengajuan dosen pembimbing hanya dapat dilakukan setelah status magang kamu menjadi{" "}
                <strong>Terkonfirmasi</strong>. Silakan konfirmasi penerimaan magang kamu terlebih dahulu.
              </p>
              <button disabled className="mt-3 px-4 py-2 rounded-lg text-xs font-semibold bg-amber-200 text-amber-700 cursor-not-allowed opacity-60">
                Ajukan Dosen Pembimbing
              </button>
            </div>
          </div>
        )}

        {/* Status atau Form */}
        {pengajuan && pengajuan.status !== "DITOLAK_DOSEN" ? (
          <StatusCard pengajuan={pengajuan} />
        ) : canApply ? (
          <>
            {pengajuan?.status === "DITOLAK_DOSEN" && (
              <div className="bg-red-50 border border-red-200 rounded-2xl p-5 flex items-start gap-3">
                <svg viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" className="w-5 h-5 flex-shrink-0 mt-0.5">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                <div>
                  <p className="text-sm font-bold text-red-700">Dosen Menolak Permohonan</p>
                  <p className="text-sm text-red-600 mt-0.5">Alasan: {pengajuan.alasanPenolakan}</p>
                  <p className="text-xs text-red-400 mt-1">Kamu dapat mengajukan ulang dengan dosen usulan yang berbeda.</p>
                </div>
              </div>
            )}
            <FormPengajuan
              lamaran={lamaranKonfirmasi}
              dosenList={dosenList}
              onSubmit={handleSubmit}
              loading={submitting}
            />
          </>
        ) : null}

        {/* Contoh section "Daftar Mahasiswa" dengan header bar biru + link "Lihat semua" */}
        {/* Hapus/ganti data ini sesuai kebutuhan, atau hubungkan ke API yang sesuai */}
        {/* <DaftarMahasiswaCard mahasiswa={mahasiswaList} viewAllHref="/mahasiswa" /> */}

      </div>
    </div>
  );
}