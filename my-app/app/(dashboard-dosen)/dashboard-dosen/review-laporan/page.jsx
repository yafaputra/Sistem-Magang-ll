"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import Topbar from "../../components/topbar";

// ── Design tokens (tetap konsisten dengan tema Dashboard Mahasiswa) ─────────
const T = {
  blue: "#1a6ef5",
  blueDeep: "#0a58e0",
  blueBg: "#e0f2fe",
  blueBorder: "#7dd3fc",
  green: "#059669",
  greenBg: "#dcfce7",
  greenBorder: "#86efac",
  orange: "#f97316",
  orangeBg: "#ffedd5",
  orangeBorder: "#fdba74",
  red: "#dc2626",
  redBg: "#fee2e2",
  redBorder: "#fca5a5",
  ink: "#1e1e2e",
  mist: "#9898b0",
  paper: "#f7f7fb",
  line: "#e8e8f0",
};

const API_URL = "http://localhost:5000/api";
const FILE_URL = "http://localhost:5000";

const STATUS_OPTIONS = [
  { key: "semua", label: "Semua Status" },
  { key: "pending", label: "Belum Dinilai" },
  { key: "selesai", label: "Sudah Dinilai" },
];

const AV = [
  { bg: T.blueBg, border: T.blueBorder, fg: T.blueDeep },
  { bg: T.orangeBg, border: T.orangeBorder, fg: "#b45309" },
  { bg: "#ede9fe", border: "#a78bfa", fg: "#7c3aed" },
  { bg: T.greenBg, border: T.greenBorder, fg: T.green },
];

// ── Helpers ──────────────────────────────────────────────────────────────
const initials = (name = "") =>
  name.split(" ").slice(0, 2).map((w) => w[0] ?? "").join("").toUpperCase();

function nilaiInfo(n) {
  if (n === null || n === undefined) return null;
  if (n >= 85) return { label: "Sangat Baik", fg: T.green, bg: T.greenBg, border: T.greenBorder };
  if (n >= 70) return { label: "Baik", fg: T.blueDeep, bg: T.blueBg, border: T.blueBorder };
  if (n >= 55) return { label: "Cukup", fg: "#b45309", bg: T.orangeBg, border: T.orangeBorder };
  return { label: "Kurang", fg: T.red, bg: T.redBg, border: T.redBorder };
}

// ── Icons ────────────────────────────────────────────────────────────────
const IconDoc = (p) => (
  <svg width={p.size ?? 17} height={p.size ?? 17} viewBox="0 0 24 24" fill="none" stroke={p.color ?? "currentColor"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" />
  </svg>
);
const IconClock = (p) => (
  <svg width={p.size ?? 17} height={p.size ?? 17} viewBox="0 0 24 24" fill="none" stroke={p.color ?? "currentColor"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
  </svg>
);
const IconCheck = (p) => (
  <svg width={p.size ?? 17} height={p.size ?? 17} viewBox="0 0 24 24" fill="none" stroke={p.color ?? "currentColor"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);
const IconStar = (p) => (
  <svg width={p.size ?? 17} height={p.size ?? 17} viewBox="0 0 24 24" fill="none" stroke={p.color ?? "currentColor"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);
const IconSearch = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);
const IconClose = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);
const IconDownload = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" />
  </svg>
);
const IconAlert = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
  </svg>
);

// ── Small building blocks ──────────────────────────────────────────────────
function Avatar({ nama, index, size = 36 }) {
  const c = AV[index % AV.length];
  return (
    <div
      style={{ width: size, height: size, background: c.bg, color: c.fg, border: `2px solid ${c.border}`, borderRadius: size * 0.32, fontSize: size * 0.32 }}
      className="flex items-center justify-center font-bold flex-shrink-0"
    >
      {initials(nama)}
    </div>
  );
}

function StatCard({ label, value, icon, tone }) {
  const tones = {
    blue: [T.blueBg, T.blueDeep, T.blueBorder],
    orange: [T.orangeBg, T.orange, T.orangeBorder],
    green: [T.greenBg, T.green, T.greenBorder],
    ink: ["#eef0fb", T.ink, "#c7cbf0"],
  };
  const [bg, fg, border] = tones[tone] ?? tones.blue;
  return (
    <div className="bg-white rounded-2xl p-4 flex items-center gap-3.5" style={{ border: `1px solid ${T.line}` }}>
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 border-2"
        style={{ background: bg, color: fg, borderColor: border }}
      >
        {icon}
      </div>
      <div>
        <p className="text-[20px] font-bold leading-none" style={{ color: T.ink }}>{value}</p>
        <p className="text-[11.5px] mt-1" style={{ color: T.mist }}>{label}</p>
      </div>
    </div>
  );
}

function StatusPill({ status }) {
  const pending = status === "Belum Dinilai";
  return (
    <span
      className="inline-flex items-center gap-[6px] px-[10px] py-[4px] rounded-full text-[11px] font-semibold"
      style={{
        background: pending ? T.orangeBg : T.greenBg,
        color: pending ? "#b45309" : T.green,
      }}
    >
      <span className="w-[5px] h-[5px] rounded-full bg-current" />
      {status}
    </span>
  );
}

function EmptyState({ icon, title, sub }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-14 px-4">
      <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-3 border-2" style={{ background: T.blueBg, borderColor: T.blueBorder }}>
        {icon}
      </div>
      <p className="text-[13.5px] font-semibold" style={{ color: T.ink }}>{title}</p>
      {sub && <p className="text-[12px] mt-1" style={{ color: T.mist, maxWidth: 320 }}>{sub}</p>}
    </div>
  );
}

function Toast({ message, type }) {
  const bg = type === "error" ? { background: T.redBg, color: T.red } : { background: T.greenBg, color: T.green };
  return (
    <div className="fixed bottom-6 right-6 z-[70] px-4 py-3 rounded-xl text-[13px] font-semibold shadow-lg max-w-[360px]" style={bg}>
      {message}
    </div>
  );
}

// ── Detail & Penilaian Modal (satu tempat, dua tab sederhana) ─────────────
function ReviewModal({ row, initialTab = "laporan", onClose, onSave }) {
  const [tab, setTab] = useState(initialTab);
  const [nilai, setNilai] = useState(row.nilai ?? 80);
  const [catatan, setCatatan] = useState(row.catatan ?? "");
  const [saving, setSaving] = useState(false);
  const info = nilaiInfo(nilai);

  async function submit() {
    setSaving(true);
    await onSave({ nilai, catatan });
    setSaving(false);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(30,30,46,0.45)" }} onClick={onClose}>
      <div
        className="bg-white rounded-2xl w-full max-w-[560px] max-h-[88vh] flex flex-col shadow-2xl"
        style={{ animation: "popIn .16s ease-out" }}
        onClick={(e) => e.stopPropagation()}
      >
        <style>{`@keyframes popIn { from { transform: scale(.97); opacity: 0 } to { transform: scale(1); opacity: 1 } }`}</style>

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b flex-shrink-0" style={{ borderColor: T.line }}>
          <div className="flex items-center gap-3 min-w-0">
            <Avatar nama={row.mahasiswaNama} index={row.mahasiswaIndex} size={40} />
            <div className="min-w-0">
              <p className="text-[14px] font-bold truncate" style={{ color: T.ink }}>{row.mahasiswaNama}</p>
              <p className="text-[11.5px]" style={{ color: T.mist }}>Minggu {row.minggu} · {row.status}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full cursor-pointer transition-colors flex-shrink-0 border"
            style={{ color: T.red, background: T.redBg, borderColor: T.redBorder }}
            onMouseEnter={(e) => { e.currentTarget.style.background = T.red; e.currentTarget.style.color = "#fff"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = T.redBg; e.currentTarget.style.color = T.red; }}
          >
            <IconClose />
          </button>
        </div>

        {/* Tabs */}
        <div className="px-6 pt-4 flex-shrink-0">
          <div className="flex gap-1 p-1 rounded-xl" style={{ background: "#f0f0f8" }}>
            {[
              { key: "laporan", label: "Laporan" },
              { key: "nilai", label: "Beri Nilai" },
            ].map((t) => {
              const active = tab === t.key;
              return (
                <button
                  key={t.key}
                  onClick={() => setTab(t.key)}
                  className="flex-1 py-2 rounded-lg text-[12.5px] font-semibold transition-all cursor-pointer"
                  style={{
                    background: active ? "#fff" : "transparent",
                    color: active ? T.ink : T.mist,
                    boxShadow: active ? "0 1px 2px rgba(30,30,46,0.08)" : "none",
                  }}
                >
                  {t.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          {tab === "laporan" ? (
            <div className="flex flex-col gap-4">
              <div>
                <p className="text-[10.5px] font-bold uppercase tracking-widest mb-1" style={{ color: T.mist }}>Minggu ke-{row.minggu}</p>
                <h3 className="text-[15.5px] font-bold leading-snug" style={{ color: T.ink }}>{row.judul}</h3>
                <p className="text-[12px] mt-1" style={{ color: T.mist }}>Dikirim {row.dikirim}</p>
              </div>

              {row.file ? (
                <div className="flex items-center gap-3 p-3.5 rounded-xl border" style={{ borderColor: T.line, background: T.paper }}>
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 border-2" style={{ background: T.redBg, borderColor: T.redBorder }}>
                    <IconDoc size={18} color={T.red} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-semibold truncate" style={{ color: T.ink }}>{row.file.name}</p>
                    <p className="text-[11px]" style={{ color: T.mist }}>{row.file.size} · PDF</p>
                  </div>
                  <a
                    href={row.file?.url ? `${FILE_URL}${row.file.url}` : "#"}
                    download={row.file.name}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-[11.5px] font-semibold text-white flex-shrink-0"
                    style={{ background: T.blue }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = T.blueDeep)}
                    onMouseLeave={(e) => (e.currentTarget.style.background = T.blue)}
                  >
                    <IconDownload /> Unduh
                  </a>
                </div>
              ) : (
                <div className="flex items-center gap-2.5 p-3.5 rounded-xl border border-dashed" style={{ borderColor: T.line, color: T.mist }}>
                  <IconAlert />
                  <p className="text-[12.5px]">Mahasiswa belum mengunggah file untuk laporan ini.</p>
                </div>
              )}

              {row.status === "Sudah Dinilai" && (
                <div className="rounded-xl p-4 border" style={{ background: T.paper, borderColor: T.line }}>
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-[10.5px] font-bold uppercase tracking-widest" style={{ color: T.mist }}>Nilai saat ini</p>
                    {info && (
                      <span className="text-[11px] font-bold px-2.5 py-1 rounded-full border" style={{ background: info.bg, color: info.fg, borderColor: info.border }}>
                        {row.nilai} · {info.label}
                      </span>
                    )}
                  </div>
                  {row.catatan && <p className="text-[12.5px] leading-relaxed" style={{ color: "#4B5563" }}>{row.catatan}</p>}
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col gap-5">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <p className="text-[12px] font-semibold" style={{ color: T.ink }}>Skor</p>
                  {info && (
                    <span className="text-[11px] font-bold px-3 py-1 rounded-full border" style={{ background: info.bg, color: info.fg, borderColor: info.border }}>
                      {info.label}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={nilai}
                    onChange={(e) => {
                      const v = e.target.value === "" ? 0 : Number(e.target.value);
                      setNilai(Math.min(100, Math.max(0, v)));
                    }}
                    className="text-[13px] font-semibold outline-none rounded-xl transition-all"
                    style={{ color: T.ink, width: 90, padding: "10px 12px", border: `1.5px solid ${T.line}`, background: "#fff" }}
                    onFocus={(e) => { e.target.style.borderColor = T.blue; e.target.style.boxShadow = `0 0 0 3px ${T.blueBg}`; }}
                    onBlur={(e) => { e.target.style.borderColor = T.line; e.target.style.boxShadow = "none"; }}
                  />
                  <span className="text-[12px]" style={{ color: T.mist }}>/ 100</span>
                </div>
              </div>

              <div>
                <p className="text-[12px] font-semibold mb-2" style={{ color: T.ink }}>Catatan & masukan</p>
                <textarea
                  value={catatan}
                  onChange={(e) => setCatatan(e.target.value)}
                  placeholder="Tulis masukan yang membangun untuk mahasiswa…"
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl text-[13px] resize-none outline-none transition-all font-sans"
                  style={{ border: `1.5px solid ${T.line}`, color: T.ink }}
                  onFocus={(e) => { e.target.style.borderColor = T.blue; e.target.style.boxShadow = `0 0 0 3px ${T.blueBg}`; }}
                  onBlur={(e) => { e.target.style.borderColor = T.line; e.target.style.boxShadow = "none"; }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer action (hanya tampil di tab Nilai, supaya alur jelas) */}
        {tab === "nilai" && (
          <div className="px-6 py-4 border-t flex-shrink-0" style={{ borderColor: T.line }}>
            <button
              onClick={submit}
              disabled={saving}
              className="w-full py-3 rounded-xl text-[13px] font-bold text-white transition-colors cursor-pointer disabled:opacity-60"
              style={{ background: T.blue }}
              onMouseEnter={(e) => { if (!saving) e.currentTarget.style.background = T.blueDeep; }}
              onMouseLeave={(e) => { if (!saving) e.currentTarget.style.background = T.blue; }}
            >
              {saving ? "Menyimpan…" : row.status === "Sudah Dinilai" ? "Simpan Perubahan Nilai" : "Simpan Penilaian"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Row laporan (satu baris tabel) ──────────────────────────────────────────
function LaporanTableRow({ row, onOpen }) {
  const info = nilaiInfo(row.nilai);

  return (
    <tr className="border-b last:border-b-0 transition-colors hover:bg-[#fafafc]" style={{ borderColor: "#f0f0f8" }}>
      <td className="px-4 py-[13px]">
        <div className="flex items-center gap-[10px]">
          <Avatar nama={row.mahasiswaNama} index={row.mahasiswaIndex} size={32} />
          <div className="min-w-0">
            <p className="text-[13px] font-semibold truncate" style={{ color: T.ink }}>{row.mahasiswaNama}</p>
            <p className="text-[11px]" style={{ color: T.mist }}>{row.mahasiswaNim}</p>
          </div>
        </div>
      </td>
      <td className="px-4 py-[13px] max-w-[240px]">
        <p className="text-[13px] font-medium truncate" style={{ color: T.ink }}>{row.judul}</p>
        <div className="flex items-center gap-1.5 mt-[2px]">
          <span className="text-[11px]" style={{ color: T.mist }}>Minggu {row.minggu}</span>
          {row.file && (
            <span className="text-[10px] font-semibold" style={{ color: T.red }}>· PDF</span>
          )}
        </div>
      </td>
      <td className="px-4 py-[13px] text-[12px]" style={{ color: T.mist }}>{row.dikirim}</td>
      <td className="px-4 py-[13px]">
        {info ? (
          <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full border" style={{ background: info.bg, color: info.fg, borderColor: info.border }}>
            {row.nilai} · {info.label}
          </span>
        ) : (
          <span className="text-[11.5px]" style={{ color: T.mist }}>—</span>
        )}
      </td>
      <td className="px-4 py-[13px]"><StatusPill status={row.status} /></td>
      <td className="px-4 py-[13px]">
        <div className="flex items-center gap-[6px]">
          <button
            onClick={() => onOpen(row, "laporan")}
            className="px-[10px] py-[7px] rounded-lg text-[11px] font-semibold transition-all duration-150 cursor-pointer"
            style={{ background: "#f0f0f8", color: T.ink }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#e4e4f2")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "#f0f0f8")}
          >
            Review Laporan
          </button>
          <button
            onClick={() => onOpen(row, "nilai")}
            className="px-[10px] py-[7px] rounded-lg text-[11px] font-bold transition-all duration-150 cursor-pointer"
            style={{ background: T.blue, color: "#fff" }}
            onMouseEnter={(e) => (e.currentTarget.style.background = T.blueDeep)}
            onMouseLeave={(e) => (e.currentTarget.style.background = T.blue)}
          >
            Upload Nilai
          </button>
        </div>
      </td>
    </tr>
  );
}

// ── Main Page ────────────────────────────────────────────────────────────────
export default function KelolaLaporanPage() {
  const [mahasiswaData, setMahasiswaData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("semua");
  const [activeRow, setActiveRow] = useState(null);
  const [activeTab, setActiveTab] = useState("laporan");
  const [toast, setToast] = useState(null);

  const showToast = useCallback((message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3200);
  }, []);

  async function fetchLaporanDosen() {
    try {
      setLoading(true);
      setError("");
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/laporan-magang/dosen`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || "Gagal mengambil laporan dosen");
      setMahasiswaData(json.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchLaporanDosen();
  }, []);

  // Ratakan data mahasiswa + laporan jadi satu daftar baris, supaya tabel mudah dibaca sekali lihat
  const rows = useMemo(() => {
    const list = [];
    mahasiswaData.forEach((m, idx) => {
      (m.laporan || []).forEach((l) => {
        list.push({
          ...l,
          mahasiswaId: m.id,
          mahasiswaNama: m.nama,
          mahasiswaNim: m.nim,
          mahasiswaIndex: idx,
        });
      });
    });
    // Laporan yang belum dinilai tampil lebih dulu supaya dosen langsung tahu prioritasnya
    return list.sort((a, b) => (a.status === b.status ? 0 : a.status === "Belum Dinilai" ? -1 : 1));
  }, [mahasiswaData]);

  const filteredRows = useMemo(() => {
    const q = search.toLowerCase().trim();
    return rows.filter((r) => {
      const matchSearch =
        !q ||
        r.mahasiswaNama.toLowerCase().includes(q) ||
        r.judul.toLowerCase().includes(q) ||
        r.mahasiswaNim.toLowerCase().includes(q);
      const matchStatus =
        statusFilter === "semua" ||
        (statusFilter === "pending" && r.status === "Belum Dinilai") ||
        (statusFilter === "selesai" && r.status === "Sudah Dinilai");
      return matchSearch && matchStatus;
    });
  }, [rows, search, statusFilter]);

  const stats = useMemo(() => {
    const total = rows.length;
    const pending = rows.filter((r) => r.status === "Belum Dinilai").length;
    const selesai = total - pending;
    const rated = rows.filter((r) => r.nilai !== null && r.nilai !== undefined);
    const avg = rated.length ? Math.round(rated.reduce((a, r) => a + r.nilai, 0) / rated.length) : null;
    return { total, pending, selesai, avg };
  }, [rows]);

  function openRow(row, tab = "laporan") {
    setActiveRow(row);
    setActiveTab(tab);
  }

  async function handleSave({ nilai, catatan }) {
    const row = activeRow;
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/laporan-magang/dosen/${row.id}/review`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ nilai, catatan }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || "Gagal menyimpan penilaian");

      setMahasiswaData((prev) =>
        prev.map((m) =>
          m.id === row.mahasiswaId
            ? {
                ...m,
                laporan: m.laporan.map((l) =>
                  l.id === row.id ? { ...l, status: "Sudah Dinilai", nilai, catatan } : l
                ),
              }
            : m
        )
      );
      setActiveRow(null);
      showToast("Penilaian berhasil disimpan.");
    } catch (err) {
      showToast(err.message, "error");
    }
  }

  return (
    <div className="min-h-screen font-sans" style={{ background: T.paper, color: T.ink }}>
      <Topbar
      icon={<IconDoc size={17} />}
      title="Kelola Laporan Magang"
      subtitle="Semua laporan mahasiswa bimbingan, dalam satu daftar"
      rightSlot={
        <button
          onClick={() => window.history.back()}
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

      <main className="px-8 py-6">
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <p className="text-[13px]" style={{ color: T.mist }}>Memuat laporan...</p>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center py-24">
            <p className="text-[13px]" style={{ color: T.red }}>{error}</p>
          </div>
        ) : rows.length === 0 ? (
          <div className="bg-white rounded-2xl" style={{ border: `1px solid ${T.line}` }}>
            <EmptyState
              icon={<IconDoc size={20} color={T.blue} />}
              title="Belum ada laporan untuk ditinjau"
              sub="Setelah mahasiswa bimbinganmu mengirim laporan, semuanya akan tampil di sini dalam satu daftar."
            />
          </div>
        ) : (
          <>
            {/* Stat cards — ringkasan sekilas */}
            <div className="grid grid-cols-4 gap-[14px] mb-5">
              <StatCard label="Total Laporan" value={stats.total} tone="ink" icon={<IconDoc size={18} />} />
              <StatCard label="Belum Dinilai" value={stats.pending} tone="orange" icon={<IconClock size={18} />} />
              <StatCard label="Sudah Dinilai" value={stats.selesai} tone="green" icon={<IconCheck size={18} />} />
              <StatCard label="Rata-rata Nilai" value={stats.avg ?? "—"} tone="blue" icon={<IconStar size={18} />} />
            </div>

            {/* Search & filter */}
            <div className="flex items-center gap-[10px] mb-4">
              <div className="relative flex-1">
                <span className="absolute left-[11px] top-1/2 -translate-y-1/2" style={{ color: "#b0b0c8" }}><IconSearch /></span>
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Cari nama mahasiswa, NIM, atau judul laporan..."
                  className="w-full pl-[34px] pr-3 py-2 rounded-[8px] text-[13px] outline-none transition-colors"
                  style={{ border: `1px solid ${T.line}`, color: T.ink, background: "#fff" }}
                  onFocus={(e) => (e.target.style.borderColor = T.blue)}
                  onBlur={(e) => (e.target.style.borderColor = T.line)}
                />
              </div>
              <div className="flex items-center gap-1 p-1 rounded-xl flex-shrink-0" style={{ background: "#f0f0f8" }}>
                {STATUS_OPTIONS.map((s) => (
                  <button
                    key={s.key}
                    onClick={() => setStatusFilter(s.key)}
                    className="px-3 py-1.5 rounded-lg text-[11.5px] font-semibold transition-all cursor-pointer whitespace-nowrap"
                    style={{
                      background: statusFilter === s.key ? "#fff" : "transparent",
                      color: statusFilter === s.key ? T.ink : T.mist,
                      boxShadow: statusFilter === s.key ? "0 1px 2px rgba(30,30,46,0.08)" : "none",
                    }}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl overflow-hidden" style={{ border: `1px solid ${T.line}` }}>
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    {["Mahasiswa", "Laporan", "Dikirim", "Nilai", "Status", "Aksi"].map((h) => (
                      <th
                        key={h}
                        className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-[.04em] border-b"
                        style={{ background: "#fafafc", color: T.mist, borderColor: T.line }}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredRows.length > 0 ? (
                    filteredRows.map((row) => (
                      <LaporanTableRow key={row.id} row={row} onOpen={openRow} />
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6}>
                        <EmptyState
                          icon={<IconSearch />}
                          title="Tidak ada laporan yang cocok"
                          sub="Coba ubah kata kunci pencarian atau filter status."
                        />
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>

              <div className="flex items-center justify-between px-4 py-3 border-t" style={{ borderColor: "#f0f0f8" }}>
                <span className="text-[12px]" style={{ color: T.mist }}>
                  Menampilkan {filteredRows.length} dari {rows.length} laporan
                </span>
              </div>
            </div>
          </>
        )}
      </main>

      {activeRow && (
        <ReviewModal
          key={`${activeRow.id}-${activeTab}`}
          row={activeRow}
          initialTab={activeTab}
          onClose={() => setActiveRow(null)}
          onSave={handleSave}
        />
      )}
      {toast && <Toast message={toast.message} type={toast.type} />}
    </div>
  );
}