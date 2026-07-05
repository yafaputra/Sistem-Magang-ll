"use client";

import { useEffect, useState } from "react";
import Topbar from "../../components/topbar";

// ─── Config ───────────────────────────────────────────────────────────────────
const STATUS_CONFIG = {
  disetujui: { label: "Disetujui", dot: "bg-emerald-500", badge: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  menunggu:  { label: "Menunggu",  dot: "bg-amber-400",   badge: "bg-amber-50 text-amber-600 border-amber-200" },
  ditolak:   { label: "Ditolak",   dot: "bg-red-400",     badge: "bg-red-50 text-red-600 border-red-200" },
};

// ─── Avatar Colors (konsisten dengan Dashboard) ───────────────────────────────
const AVATAR_COLORS = [
  { bg: "bg-[#ede9ff]", text: "text-[#6c63ff]" },
  { bg: "bg-emerald-50", text: "text-emerald-700" },
  { bg: "bg-amber-50", text: "text-amber-600" },
  { bg: "bg-pink-50", text: "text-pink-600" },
  { bg: "bg-blue-50", text: "text-blue-600" },
  { bg: "bg-slate-100", text: "text-slate-600" },
];

// ─── Icons ────────────────────────────────────────────────────────────────────
const IconLayers = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/>
  </svg>
);
const IconSearch = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
);
const IconClose = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);
const IconCheck = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);
const IconX = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);
const IconEye = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
  </svg>
);
const IconChevron = ({ open }) => (
  <svg
    width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
    className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`}
  >
    <polyline points="6 9 12 15 18 9"/>
  </svg>
);
const IconInfo = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>
  </svg>
);
const IconClock = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
  </svg>
);
const IconBriefcase = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>
  </svg>
);
const IconUser = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
  </svg>
);

// ─── Helpers ──────────────────────────────────────────────────────────────────
function getInitials(name) {
  return name.split(" ").slice(0, 2).map((n) => n[0]).join("").toUpperCase();
}

// ─── Sub-components ───────────────────────────────────────────────────────────
function Avatar({ name, index = 0, size = "md" }) {
  const c = AVATAR_COLORS[index % AVATAR_COLORS.length];
  const sizeClass =
    size === "lg" ? "w-12 h-12 rounded-xl text-[15px]" :
    size === "sm" ? "w-8 h-8 rounded-[8px] text-[11px]" :
    "w-11 h-11 rounded-xl text-[13px]";
  return (
    <div className={`flex items-center justify-center font-bold flex-shrink-0 tracking-wide ${sizeClass} ${c.bg} ${c.text}`}>
      {getInitials(name)}
    </div>
  );
}

function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status];
  if (!cfg) return null;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border ${cfg.badge}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
}

function MiniStatusSummary({ mataKuliah }) {
  const counts = { menunggu: 0, disetujui: 0, ditolak: 0 };
  mataKuliah.forEach((mk) => { if (counts[mk.status] !== undefined) counts[mk.status]++; });
  return (
    <div className="flex items-center gap-1.5 flex-wrap">
      {counts.menunggu > 0 && (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10.5px] font-semibold bg-amber-50 text-amber-600 border border-amber-200">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />{counts.menunggu} menunggu
        </span>
      )}
      {counts.disetujui > 0 && (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10.5px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />{counts.disetujui} disetujui
        </span>
      )}
      {counts.ditolak > 0 && (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10.5px] font-semibold bg-red-50 text-red-600 border border-red-200">
          <span className="w-1.5 h-1.5 rounded-full bg-red-400" />{counts.ditolak} ditolak
        </span>
      )}
    </div>
  );
}

// ─── Review Modal ─────────────────────────────────────────────────────────────
function ReviewModal({ mhs, mk, onClose, onSetujui, onTolak }) {
  const [keterangan, setKeterangan] = useState(mk?.keterangan || "");
  if (!mhs || !mk) return null;

  const mhsIndex = 0;

  const handleSetujui = () => {
    onSetujui(mhs.id, mk.id, keterangan || "Direkomendasikan oleh dosen pembimbing, menunggu validasi admin prodi.");
    onClose();
  };
  const handleTolak = () => {
    if (!keterangan.trim()) return;
    onTolak(mhs.id, mk.id, keterangan);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl w-full max-w-lg border border-slate-100 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#ede9ff] text-[#6c63ff] flex items-center justify-center">
              <IconEye />
            </div>
            <h2 className="text-[14px] font-bold text-slate-900">Review Pengajuan Konversi</h2>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg border border-slate-200 flex items-center justify-center text-slate-400 hover:bg-slate-50 hover:text-slate-600 transition-colors cursor-pointer"
          >
            <IconClose />
          </button>
        </div>

        <div className="px-5 py-4 space-y-4 max-h-[78vh] overflow-y-auto">

          {/* Profil Mahasiswa */}
          <div className="flex items-center gap-3 px-4 py-3 bg-slate-50 rounded-xl border border-slate-100">
            <Avatar name={mhs.mahasiswa} index={mhsIndex} size="sm" />
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-bold text-slate-900">{mhs.mahasiswa}</p>
              <p className="text-[11px] text-slate-400 mt-0.5">{mhs.nim} · {mhs.prodi}</p>
            </div>
            <StatusBadge status={mk.status} />
          </div>

          {/* Mata Kuliah */}
          <div>
            <p className="text-[10.5px] font-bold uppercase tracking-widest text-slate-400 mb-2">
              Mata Kuliah yang Diajukan
            </p>
            <div className="rounded-xl border border-slate-100 overflow-hidden">
              {[
                { label: "Semester",       value: mhs.semester },
                { label: "Kode MK",        value: <span className="font-mono text-[12px]">{mk.kode}</span> },
                { label: "Nama MK",        value: mk.nama },
                { label: "Jumlah SKS",     value: `${mk.sks} SKS` },
              ].map((row, i, arr) => (
                <div key={row.label} className={`flex justify-between items-center px-4 py-2.5 ${i < arr.length - 1 ? "border-b border-slate-50" : ""}`}>
                  <span className="text-[12px] text-slate-400">{row.label}</span>
                  <span className="text-[13px] font-semibold text-slate-800">{row.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* CPMK — capaian pembelajaran mata kuliah yang diajukan mahasiswa */}
          {mk.cpmk && mk.cpmk.length > 0 && (
            <div>
              <p className="text-[10.5px] font-bold uppercase tracking-widest text-slate-400 mb-2">
                CPMK (Capaian Pembelajaran Mata Kuliah)
              </p>
              <div className="flex flex-wrap gap-1.5">
                {mk.cpmk.map((c, i) => (
                  <span key={i} className="px-2.5 py-1 bg-[#ede9ff] text-[#6c63ff] border border-[#c4bcff] rounded-lg text-[11.5px] font-medium">
                    {c}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Objektif / alasan mahasiswa mengajukan konversi */}
          {mk.objektif && (
            <div>
              <p className="text-[10.5px] font-bold uppercase tracking-widest text-slate-400 mb-2">
                Objektif / Tujuan Konversi
              </p>
              <p className="text-[12.5px] text-slate-700 leading-relaxed bg-slate-50 border border-slate-100 rounded-xl px-3.5 py-3">
                {mk.objektif}
              </p>
            </div>
          )}

          {/* Kegiatan Magang */}
          <div>
            <div className="flex items-center gap-1.5 mb-2">
              <span className="text-[#6c63ff]"><IconBriefcase /></span>
              <p className="text-[10.5px] font-bold uppercase tracking-widest text-slate-400">
                Kegiatan Magang
              </p>
            </div>
            <div className="rounded-xl border border-[#c4bcff] bg-[#f8f8ff] overflow-hidden">
              {[
                { label: "Tempat Magang",    value: mhs.tempatMagang },
                { label: "Posisi / Jabatan", value: mhs.posisi },
                { label: "Durasi Magang",    value: <span className="flex items-center gap-1"><IconClock />{mhs.durasiMagang}</span> },
                { label: "Tanggal Pengajuan",value: mhs.tanggal },
              ].map((row, i, arr) => (
                <div key={row.label} className={`flex justify-between items-center px-4 py-2.5 ${i < arr.length - 1 ? "border-b border-[#ede9ff]" : ""}`}>
                  <span className="text-[12px] text-[#6c63ff]">{row.label}</span>
                  <span className="text-[13px] font-semibold text-[#3C3489]">{row.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Catatan (menunggu) */}
          {mk.status === "menunggu" && (
            <div>
              <label className="block text-[12px] font-semibold text-slate-800 mb-1.5">
                Catatan keputusan
                <span className="text-slate-400 font-normal ml-1">(wajib jika menolak)</span>
              </label>
              <textarea
                rows={3}
                value={keterangan}
                onChange={(e) => setKeterangan(e.target.value)}
                placeholder="Contoh: Kegiatan magang relevan dengan capaian pembelajaran mata kuliah..."
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-[13px] text-slate-800 outline-none resize-none focus:border-[#6c63ff] placeholder:text-slate-300 transition-colors font-sans"
              />
              <div className="text-right text-[11px] text-slate-300 mt-1">{keterangan.length} karakter</div>
            </div>
          )}

          {/* Catatan sudah diproses */}
          {mk.status !== "menunggu" && mk.keterangan && (
            <p className={`text-[12.5px] leading-relaxed rounded-xl px-3.5 py-3 border ${
              mk.status === "disetujui"
                ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                : "bg-red-50 border-red-200 text-red-700"
            }`}>
              {mk.keterangan}
            </p>
          )}

          {/* Action buttons */}
          {mk.status === "menunggu" && (
            <div className="flex gap-2.5 pt-1">
              <button
                onClick={handleTolak}
                disabled={!keterangan.trim()}
                className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-[13px] font-semibold border border-red-300 text-red-500 bg-white hover:bg-red-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
              >
                <IconX /> Tolak
              </button>
              <button
                onClick={handleSetujui}
                className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-[13px] font-semibold bg-[#6c63ff] hover:bg-[#5b52e0] text-white transition-colors cursor-pointer"
              >
                <IconCheck /> Setujui
              </button>
            </div>
          )}

          {mk.status !== "menunggu" && (
            <div className={`flex items-center gap-2 px-4 py-3 rounded-xl border text-[12.5px] font-medium ${
              mk.status === "disetujui"
                ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                : "bg-red-50 border-red-200 text-red-600"
            }`}>
              {mk.status === "disetujui" ? <IconCheck /> : <IconX />}
              {mk.status === "disetujui"
                ? "Direkomendasikan — menunggu validasi final admin prodi."
                : "Pengajuan ini sudah ditolak."}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Accordion Row ────────────────────────────────────────────────────────────
function MahasiswaRow({ mhs, index, onOpenReview }) {
  const [open, setOpen] = useState(false);

  const totalSks = mhs.mataKuliah.reduce((s, mk) => s + mk.sks, 0);
  const menungguCount = mhs.mataKuliah.filter((mk) => mk.status === "menunggu").length;

  return (
    <>
      <tr
        className={`cursor-pointer transition-colors duration-150 border-b border-slate-50 ${
          open ? "bg-[#f8f8ff]" : "hover:bg-slate-50"
        }`}
        onClick={() => setOpen((v) => !v)}
      >
        <td className="px-5 py-3.5">
          <div className="flex items-center gap-2.5">
            <span className="text-slate-400">
              <IconChevron open={open} />
            </span>
            <Avatar name={mhs.mahasiswa} index={index} size="sm" />
            <div>
              <p className="text-[13px] font-bold text-slate-900 leading-tight">{mhs.mahasiswa}</p>
              <p className="text-[11px] text-slate-400 mt-0.5">{mhs.nim}</p>
            </div>
          </div>
        </td>
        <td className="px-4 py-3.5">
          <p className="text-[12.5px] font-medium text-slate-800">{mhs.prodi}</p>
          <p className="text-[11px] text-slate-400 mt-0.5">{mhs.semester}</p>
        </td>
        <td className="px-4 py-3.5">
          <p className="text-[12.5px] font-medium text-slate-800">{mhs.tempatMagang}</p>
          <p className="text-[11px] text-slate-400 mt-0.5">{mhs.posisi}</p>
        </td>
        <td className="px-4 py-3.5 text-center">
          <div className="flex flex-col items-center gap-1">
            <span className="inline-flex items-center justify-center min-w-[28px] px-2 h-7 rounded-lg bg-[#ede9ff] text-[#6c63ff] text-[12px] font-bold">
              {totalSks}
            </span>
            <span className="text-[10px] text-slate-400">{mhs.mataKuliah.length} MK</span>
          </div>
        </td>
        <td className="px-4 py-3.5 text-[12px] text-slate-400 whitespace-nowrap">{mhs.tanggal}</td>
        <td className="px-4 py-3.5">
          <MiniStatusSummary mataKuliah={mhs.mataKuliah} />
        </td>
        <td className="px-4 py-3.5 text-center">
          {menungguCount > 0 && (
            <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-amber-400 text-white text-[10px] font-bold">
              {menungguCount}
            </span>
          )}
        </td>
      </tr>

      {open && (
        <tr className="border-b border-slate-50">
          <td colSpan={7} className="px-0 py-0">
            <div className="mx-5 my-3 rounded-2xl border border-[#c4bcff] overflow-hidden bg-white">
              {/* Sub-table header */}
              <div className="flex items-center justify-between px-4 py-2.5 bg-[#f8f8ff] border-b border-[#ede9ff]">
                <span className="text-[10.5px] font-bold uppercase tracking-widest text-[#6c63ff]">
                  Daftar Mata Kuliah yang Diajukan
                </span>
                <span className="text-[11px] text-[#6c63ff]">
                  {mhs.mataKuliah.length} mata kuliah · {totalSks} SKS total
                </span>
              </div>

              <table className="w-full text-[12.5px]">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50">
                    {["Kode", "Mata Kuliah", "SKS", "Status", "Aksi"].map((col, i) => (
                      <th key={col} className={`py-2.5 px-4 text-[10px] font-bold uppercase tracking-wider text-slate-400 ${i >= 2 ? "text-center" : "text-left"}`}>
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {mhs.mataKuliah.map((mk, i) => (
                    <tr
                      key={mk.id}
                      className={`${i < mhs.mataKuliah.length - 1 ? "border-b border-slate-50" : ""} hover:bg-slate-50 transition-colors`}
                    >
                      <td className="px-4 py-2.5">
                        <span className="font-mono text-[11.5px] text-slate-400">{mk.kode}</span>
                      </td>
                      <td className="px-4 py-2.5 font-medium text-slate-800">{mk.nama}</td>
                      <td className="px-4 py-2.5 text-center">
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-lg bg-[#ede9ff] text-[#6c63ff] text-[11px] font-bold">
                          {mk.sks}
                        </span>
                      </td>
                      <td className="px-4 py-2.5 text-center">
                        <StatusBadge status={mk.status} />
                      </td>
                      <td className="px-4 py-2.5 text-center">
                        {mk.status === "menunggu" ? (
                          <button
                            onClick={(e) => { e.stopPropagation(); onOpenReview(mhs, mk); }}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11.5px] font-semibold bg-[#6c63ff] hover:bg-[#5b52e0] text-white transition-colors cursor-pointer"
                          >
                            <IconEye /> Review
                          </button>
                        ) : (
                          <button
                            onClick={(e) => { e.stopPropagation(); onOpenReview(mhs, mk); }}
                            className="inline-flex items-center gap-1 text-[11.5px] text-[#6c63ff] hover:underline font-semibold cursor-pointer"
                          >
                            <IconEye /> Lihat
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function PersetujuanKonversiPage() {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const [data, setData] = useState([]);
  const [stats, setStats] = useState({ totalMahasiswa: 0, totalMK: 0, menungguMK: 0, disetujuiMK: 0, ditolakMK: 0 });
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("semua");
  const [reviewTarget, setReviewTarget] = useState(null);
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(false);

  const { totalMahasiswa: totalMhs, totalMK, menungguMK, disetujuiMK, ditolakMK } = stats;

  function showToast(msg, type = "success") {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 4000);
  }

  const fetchPengajuan = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await fetch(
        `${API_URL}/api/dosen/persetujuan-konversi?search=${search}&status=${filterStatus}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const result = await res.json();
      if (!res.ok) { showToast(result.message || "Gagal mengambil data", "error"); setData([]); return; }
      setData(result.data || []);
      setStats(result.stats || {});
    } catch {
      showToast("Tidak bisa terhubung ke server", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPengajuan(); }, [filterStatus]);

  async function handleSetujui(mhsId, mkId, keterangan) {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/api/dosen/persetujuan-konversi/${mkId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status: "disetujui", keterangan }),
      });
      const result = await res.json();
      if (!res.ok) { showToast(result.message || "Gagal menyetujui", "error"); return; }
      showToast("Pengajuan berhasil diteruskan ke admin prodi.");
      fetchPengajuan();
    } catch { showToast("Tidak bisa terhubung ke server", "error"); }
  }

  async function handleTolak(mhsId, mkId, keterangan) {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/api/dosen/persetujuan-konversi/${mkId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status: "ditolak", keterangan }),
      });
      const result = await res.json();
      if (!res.ok) { showToast(result.message || "Gagal menolak", "error"); return; }
      showToast("Pengajuan ditolak. Mahasiswa akan menerima notifikasi.", "error");
      fetchPengajuan();
    } catch { showToast("Tidak bisa terhubung ke server", "error"); }
  }

  const filterTabs = ["semua", "menunggu", "disetujui", "ditolak"];
  const selesai = disetujuiMK + ditolakMK;

  return (
    <div className="flex-1 min-h-screen bg-slate-50 flex flex-col gap-6 font-sans">

      {/* ── Toast ── */}
      {toast && (
        <div className={`fixed top-5 right-5 z-[100] flex items-center gap-2.5 px-4 py-3 rounded-xl border text-[13px] font-medium shadow-lg ${
          toast.type === "success"
            ? "bg-emerald-50 border-emerald-200 text-emerald-700"
            : "bg-red-50 border-red-200 text-red-600"
        }`}>
          {toast.type === "success" ? <IconCheck /> : <IconX />}
          {toast.msg}
        </div>
      )}

      <Topbar
        icon={<IconLayers className="w-4.5 h-4.5" />}
        title="Persetujuan Konversi SKS"
        subtitle="Review dan kelola pengajuan konversi kredit mahasiswa"
        iconBg="bg-[#EFF6FF]"
        iconBorder="border-[#93C5FD]"
        iconColor="text-[#0A66C2]"
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

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-4 gap-4 px-8">
        {[
          {
            label: "Total Mahasiswa", value: totalMhs,
            icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
            bgColor: "bg-[#ede9ff]", border: "border border-[#c4bcff]", iconColor: "text-[#6c63ff]", valueColor: "text-[#6c63ff]",
          },
          {
            label: "Menunggu Review", value: menungguMK,
            icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
            bgColor: "bg-amber-50", border: "border border-amber-200", iconColor: "text-amber-500", valueColor: "text-amber-500",
          },
          {
            label: "Disetujui", value: disetujuiMK,
            icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
            bgColor: "bg-emerald-50", border: "border border-emerald-200", iconColor: "text-emerald-600", valueColor: "text-emerald-600",
          },
          {
            label: "Ditolak", value: ditolakMK,
            icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
            bgColor: "bg-red-50", border: "border border-red-200", iconColor: "text-red-500", valueColor: "text-red-500",
          },
        ].map((s) => (
          <div key={s.label} className="bg-white border border-slate-100 rounded-2xl p-5 flex items-center gap-4 hover:shadow-sm transition-shadow">
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${s.bgColor} ${s.border} ${s.iconColor}`}>
              {s.icon}
            </div>
            <div>
              <p className="text-[11.5px] font-medium text-slate-400 mb-1">{s.label}</p>
              <p className={`text-3xl font-bold leading-none ${s.valueColor}`}>{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Progress Bar Card ── */}
      <div className="bg-white border border-slate-100 rounded-2xl px-6 py-5 mx-8">
        <div className="flex items-center justify-between mb-3">
          <p className="text-[13.5px] font-bold text-slate-900">Progres penyelesaian review</p>
          <p className="text-[12px] text-slate-400">{selesai} dari {totalMK} MK selesai direview</p>
        </div>
        <div className="h-2 bg-slate-100 rounded-full overflow-hidden flex">
          <div className="h-full bg-emerald-500 transition-all duration-500" style={{ width: `${totalMK ? (disetujuiMK / totalMK) * 100 : 0}%` }} />
          <div className="h-full bg-red-300 transition-all duration-500"    style={{ width: `${totalMK ? (ditolakMK  / totalMK) * 100 : 0}%` }} />
          <div className="h-full bg-amber-300 transition-all duration-500"  style={{ width: `${totalMK ? (menungguMK / totalMK) * 100 : 0}%` }} />
        </div>
        <div className="flex items-center gap-5 mt-2.5">
          {[
            { color: "bg-emerald-500", label: "Disetujui" },
            { color: "bg-red-300",     label: "Ditolak" },
            { color: "bg-amber-300",   label: "Menunggu" },
          ].map((l) => (
            <div key={l.label} className="flex items-center gap-1.5">
              <span className={`w-2.5 h-2.5 rounded-sm ${l.color}`} />
              <span className="text-[11px] text-slate-400">{l.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Info Banner ── */}
      {menungguMK > 0 && (
        <div className="flex items-start gap-2.5 px-4 py-3 bg-amber-50 rounded-xl border border-amber-200 mx-8">
          <span className="text-amber-500 mt-0.5 flex-shrink-0"><IconInfo /></span>
          <p className="text-[12px] text-amber-700 leading-relaxed">
            Terdapat <strong>{menungguMK} mata kuliah</strong> yang belum direview.
            Klik nama mahasiswa untuk melihat daftar MK, lalu klik <strong>Review</strong> untuk menilai.
          </p>
        </div>
      )}

      {/* ── Table Card ── */}
      <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden mx-8 mb-6">

        {/* Toolbar */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <span className="text-[14px] font-bold text-slate-800">Daftar Pengajuan Konversi</span>
            <span className="text-[12px] text-slate-400 bg-slate-50 border border-slate-100 rounded-full px-2.5 py-0.5">
              {data.length} mahasiswa
            </span>
          </div>
          {/* Search */}
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg px-3 w-64">
            <span className="text-slate-400 flex-shrink-0"><IconSearch /></span>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && fetchPengajuan()}
              placeholder="Cari mahasiswa, MK..."
              className="flex-1 py-1.5 bg-transparent text-[12.5px] text-slate-800 outline-none placeholder:text-slate-300"
            />
            {search && (
              <button onClick={() => { setSearch(""); fetchPengajuan(); }} className="text-slate-400 hover:text-slate-600 flex-shrink-0">
                <IconClose />
              </button>
            )}
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-2 px-5 py-3 border-b border-slate-50 flex-wrap">
          {filterTabs.map((f) => (
            <button
              key={f}
              onClick={() => setFilterStatus(f)}
              className={`px-3.5 py-1.5 rounded-lg text-[12px] font-semibold capitalize transition-colors duration-150 cursor-pointer ${
                filterStatus === f
                  ? "bg-[#6c63ff] text-white"
                  : "bg-slate-50 border border-slate-200 text-slate-500 hover:text-[#6c63ff] hover:border-[#c4bcff]"
              }`}
            >
              {f === "semua" ? "Semua" : f.charAt(0).toUpperCase() + f.slice(1)}
              {f === "menunggu" && menungguMK > 0 && (
                <span className="ml-1.5 inline-flex items-center justify-center w-4 h-4 rounded-full bg-amber-400 text-white text-[9px] font-bold">
                  {menungguMK}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                {["Mahasiswa", "Program Studi", "Tempat Magang", "Total SKS", "Tanggal", "Status MK", "Pending"].map((col, i) => (
                  <th key={col} className={`py-2.5 px-4 text-[10.5px] font-bold uppercase tracking-wider text-slate-400 ${i === 0 ? "pl-5" : ""} ${i >= 3 && i <= 4 ? "text-center" : "text-left"}`}>
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="text-center py-14">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-8 h-8 border-2 border-[#6c63ff] border-t-transparent rounded-full animate-spin" />
                      <p className="text-slate-400 text-[13px]">Memuat data pengajuan...</p>
                    </div>
                  </td>
                </tr>
              ) : data.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-14">
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center text-slate-300">
                        <IconUser />
                      </div>
                      <p className="text-slate-400 text-[13px]">Tidak ada pengajuan ditemukan.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                data.map((mhs, idx) => (
                  <MahasiswaRow
                    key={mhs.id}
                    mhs={mhs}
                    index={idx}
                    onOpenReview={(m, mk) => setReviewTarget({ mhs: m, mk })}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Hint */}
        <div className="px-5 py-3 border-t border-slate-50 flex items-center gap-1.5 text-[11.5px] text-slate-300">
          <IconChevron open={false} />
          Klik baris mahasiswa untuk melihat daftar mata kuliah yang diajukan
        </div>
      </div>

      {/* ── Modal ── */}
      {reviewTarget && (
        <ReviewModal
          mhs={reviewTarget.mhs}
          mk={reviewTarget.mk}
          onClose={() => setReviewTarget(null)}
          onSetujui={handleSetujui}
          onTolak={handleTolak}
        />
      )}
    </div>
  );
}