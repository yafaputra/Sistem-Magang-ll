"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Topbar from "../../components/topbar";
const API_URL = `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api`;
const FILE_URL = process.env.NEXT_PUBLIC_FILE_URL || "http://localhost:5000";

// ─── Helper: safe fetch JSON ──────────────────────────────────────────────────
async function fetchJSON(url, options = {}) {
  const res = await fetch(url, options);

  if (res.status === 401) {
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    throw new Error("Sesi berakhir. Silakan login ulang.");
  }

  const contentType = res.headers.get("Content-Type") || "";
  if (!contentType.includes("application/json")) {
    const text = await res.text();
    throw new Error(
      `Server mengembalikan bukan JSON (status ${res.status}). Cek koneksi atau URL API.`
    );
  }

  const json = await res.json();
  if (!res.ok) throw new Error(json.message || `Error ${res.status}`);
  return json;
}

// ─── Status config (disamakan dengan gaya badge "DISETUJUI" di Dashboard) ───────
const STATUS_CONFIG = {
  MENUNGGU_REVIEW: {
    badgeCls: "bg-white text-amber-600 border border-amber-300",
    badgeIcon: "⏳",
    badgeText: "Menunggu Review",
  },
  SUDAH_DINILAI: {
    badgeCls: "bg-white text-emerald-600 border border-emerald-300",
    badgeIcon: "✓",
    badgeText: "Disetujui",
  },
};

const REPORT_PER_PAGE = 3;

function formatSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

// ─── Toast ──────────────────────────────────────────────────────────────────────
function Toast({ toast }) {
  if (!toast) return null;
  const isError = toast.type === "error";
  return (
    <div className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-4 py-2.5 rounded-xl text-[13px] font-semibold shadow-lg border
      ${isError ? "bg-white border-red-200 text-red-600" : "bg-white border-[#7dd3fc] text-[#1a6ef5]"}`}>
      {isError ? (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
          <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
      ) : (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
        </svg>
      )}
      {toast.msg}
    </div>
  );
}

// ─── File Item ───────────────────────────────────────────────────────────────────
function FileItem({ file, onRemove }) {
  const isUploading = file.uploadStatus === "uploading";
  const isSuccess = file.uploadStatus === "success";
  const isError = file.uploadStatus === "error";

  return (
    <div className={`flex items-center gap-2 px-3 py-2 rounded-xl border transition-all
      ${isError ? "bg-red-50 border-red-200" : isSuccess ? "bg-emerald-50 border-emerald-200" : "bg-[#e0f2fe]/40 border-[#7dd3fc]"}`}>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
        stroke={isError ? "#ef4444" : isSuccess ? "#10b981" : "#1a6ef5"}
        strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" /><polyline points="13 2 13 9 20 9" />
      </svg>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className={`flex-1 truncate text-[12px] font-medium
            ${isError ? "text-red-600" : isSuccess ? "text-emerald-700" : "text-[#1a6ef5]"}`}>
            {file.name}
          </span>
          <span className="text-[10.5px] text-[#9898b0] shrink-0">{formatSize(file.size)}</span>
        </div>
        {isUploading && (
          <div className="mt-1 h-1 bg-[#dbeafe] rounded-full overflow-hidden">
            <div className="h-full bg-[#1a6ef5] rounded-full transition-all duration-300" style={{ width: `${file.progress ?? 0}%` }} />
          </div>
        )}
        {isSuccess && <div className="text-[10.5px] text-emerald-600 mt-0.5 font-medium">✓ Berhasil diupload</div>}
        {isError && <div className="text-[10.5px] text-red-500 mt-0.5">{file.errorMsg || "Gagal diupload"}</div>}
      </div>
      {!isUploading && (
        <button onClick={() => onRemove(file.id)}
          className={`shrink-0 transition-colors ${isError ? "text-red-300 hover:text-red-500" : "text-[#7dd3fc] hover:text-red-400"}`}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      )}
    </div>
  );
}

// ─── Report Item (disamakan dengan card "Status Laporan" di Dashboard) ─────────
// - aksen garis biru di kiri
// - kotak ikon biru muda (bukan warna per-status)
// - tanggal mono uppercase kecil
// - badge status outline bulat mono uppercase, mirip pill "✓ DISETUJUI"
function ReportItem({ report }) {
  const cfg = STATUS_CONFIG[report.status] || STATUS_CONFIG.MENUNGGU_REVIEW;
  const tanggal = report.tanggal
    ? new Date(report.tanggal)
        .toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })
        .toUpperCase()
    : "-";

  return (
    <div className="relative flex items-center gap-3.5 pl-5 pr-4 py-3.5 bg-white border border-[#f0f0f8] rounded-xl hover:border-[#7dd3fc] hover:bg-[#e0f2fe]/30 transition-all duration-150 group overflow-hidden">
      <span className="absolute left-0 top-0 bottom-0 w-1 bg-[#1a6ef5]" />
      <div className="w-10 h-10 rounded-lg bg-[#eff6ff] border border-[#bfdbfe] flex items-center justify-center shrink-0">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1a6ef5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" /><polyline points="13 2 13 9 20 9" />
        </svg>
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-[13.5px] font-bold text-[#1e1e2e] group-hover:text-[#1a6ef5] transition-colors duration-150 truncate">
          {report.judul}
        </div>
        <div className="text-[10.5px] font-mono text-[#9898b0] tracking-wide mt-0.5">
          {tanggal}
        </div>
        {report.status === "SUDAH_DINILAI" && (
          <div className="flex items-center gap-2 mt-1">
            <span className="text-[11px] font-bold text-[#1a6ef5]">Nilai: {report.nilai}</span>
            {report.feedback && (
              <span className="text-[11px] text-[#9898b0] truncate max-w-[200px]">— {report.feedback}</span>
            )}
          </div>
        )}
      </div>
      <span className={`shrink-0 px-3 py-1.5 rounded-full text-[10.5px] font-mono font-bold uppercase tracking-wide ${cfg.badgeCls}`}>
        {cfg.badgeIcon} {cfg.badgeText}
      </span>
    </div>
  );
}

// ─── Compact Pagination (dipakai di header, tombol kecil "‹ ›") ─────────────────
function CompactPagination({ page, totalPages, onChange }) {
  if (totalPages <= 1) return null;
  return (
    <div className="flex items-center gap-1 mr-1">
      <button
        onClick={() => onChange(page - 1)}
        disabled={page === 1}
        aria-label="Halaman sebelumnya"
        title="Sebelumnya"
        className={`w-7 h-7 rounded-lg border flex items-center justify-center transition-all
          ${page === 1
            ? "border-[#eef2f7] text-[#cbd5e1] cursor-not-allowed"
            : "border-[#e8e8f0] text-[#64748b] hover:border-[#1a6ef5] hover:text-[#1a6ef5] hover:bg-[#e0f2fe]/40 cursor-pointer"}`}
      >
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="15 18 9 12 15 6" />
        </svg>
      </button>
      <span className="text-[11px] font-mono text-[#9898b0] px-0.5 tabular-nums">
        {page}/{totalPages}
      </span>
      <button
        onClick={() => onChange(page + 1)}
        disabled={page === totalPages}
        aria-label="Halaman berikutnya"
        title="Berikutnya"
        className={`w-7 h-7 rounded-lg border flex items-center justify-center transition-all
          ${page === totalPages
            ? "border-[#eef2f7] text-[#cbd5e1] cursor-not-allowed"
            : "border-[#e8e8f0] text-[#64748b] hover:border-[#1a6ef5] hover:text-[#1a6ef5] hover:bg-[#e0f2fe]/40 cursor-pointer"}`}
      >
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </button>
    </div>
  );
}

// ─── Pagination bergaya titik-titik (mirip dot pagination "Status Laporan") ─────
function ArrowPagination({ page, totalPages, onChange }) {
  if (totalPages <= 1) return null;
  return (
    <div className="flex items-center justify-between mt-4 pt-4 border-t border-[#f0f0f8]">
      <span className="text-[10.5px] font-mono uppercase tracking-wide text-[#9898b0]">
        Hal {page} dari {totalPages}
      </span>
      <div className="flex items-center gap-2">
        <button
          onClick={() => onChange(page - 1)}
          disabled={page === 1}
          aria-label="Halaman sebelumnya"
          className={`w-8 h-8 rounded-lg border flex items-center justify-center transition-all
            ${page === 1
              ? "border-[#eef2f7] text-[#cbd5e1] cursor-not-allowed"
              : "border-[#e8e8f0] text-[#64748b] hover:border-[#1a6ef5] hover:text-[#1a6ef5] hover:bg-[#e0f2fe]/40 cursor-pointer"}`}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
        <div className="flex items-center gap-1.5">
          {Array.from({ length: totalPages }).map((_, i) => (
            <span
              key={i}
              className={`rounded-full transition-all ${i + 1 === page ? "w-4 h-1.5 bg-[#1a6ef5]" : "w-1.5 h-1.5 bg-[#dbeafe]"}`}
            />
          ))}
        </div>
        <button
          onClick={() => onChange(page + 1)}
          disabled={page === totalPages}
          aria-label="Halaman berikutnya"
          className={`w-8 h-8 rounded-lg border flex items-center justify-center transition-all
            ${page === totalPages
              ? "border-[#eef2f7] text-[#cbd5e1] cursor-not-allowed"
              : "border-[#e8e8f0] text-[#64748b] hover:border-[#1a6ef5] hover:text-[#1a6ef5] hover:bg-[#e0f2fe]/40 cursor-pointer"}`}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </div>
    </div>
  );
}

// ─── Info Dosen Banner ────────────────────────────────────────────────────────────
function DosenBanner({ info }) {
  if (!info) return null;

  if (!info.sudahAdaDosen) {
    const isWaitingDosen = info.statusPengajuan === "MENUNGGU_PERSETUJUAN_DOSEN";
    const isWaitingProdi = info.statusPengajuan === "MENUNGGU_VERIFIKASI_PRODI";
    const isDitolak      = info.statusPengajuan === "DITOLAK_DOSEN";

    let pesanDetail = "Selesaikan pengajuan dosen pembimbing sebelum mengirim laporan.";
    if (isWaitingProdi) pesanDetail = "Pengajuan sedang menunggu verifikasi dari admin prodi.";
    if (isWaitingDosen) pesanDetail = "Pengajuan sudah ditetapkan, menunggu persetujuan dari dosen.";
    if (isDitolak)      pesanDetail = "Pengajuan ditolak dosen. Silakan ajukan ulang melalui menu pengajuan dosen.";

    return (
      <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-amber-50 border border-amber-200">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2" strokeLinecap="round">
          <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
        <div>
          <p className="text-[12px] font-semibold text-amber-700">Bimbingan dosen belum aktif</p>
          <p className="text-[11px] text-amber-600">{pesanDetail}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[#e0f2fe] border border-[#7dd3fc]">
      <div className="w-9 h-9 rounded-lg bg-[#1a6ef5] flex items-center justify-center shrink-0">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
        </svg>
      </div>
      <div>
        <p className="text-[11px] font-mono text-[#1a6ef5] font-bold uppercase tracking-wide">Dosen Pembimbing</p>
        <p className="text-[13px] font-bold text-[#1e1e2e]">{info.dosenPembimbing?.nama}</p>
        <p className="text-[11px] text-[#9898b0]">
          {info.perusahaan} · {info.posisi}
        </p>
      </div>
    </div>
  );
}

// ─── Main ──────────────────────────────────────────────────────────────────────────
export default function LaporanHarian() {
  const [tanggal, setTanggal]           = useState("");
  const [judul, setJudul]               = useState("");
  const [catatan, setCatatan]           = useState("");
  const [file, setFile]                 = useState(null);
  const [dragging, setDragging]         = useState(false);
  const [history, setHistory]           = useState([]);
  const [historyPage, setHistoryPage]   = useState(1);
  const [infoAktif, setInfoAktif]       = useState(null);
  const [loadingInfo, setLoadingInfo]   = useState(true);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [toast, setToast]               = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fileRef       = useRef();
  const toastTimerRef = useRef();

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const showToast = useCallback((msg, type = "success") => {
    clearTimeout(toastTimerRef.current);
    setToast({ msg, type });
    toastTimerRef.current = setTimeout(() => setToast(null), 2800);
  }, []);

  const fetchInfoAktif = useCallback(async () => {
    try {
      setLoadingInfo(true);
      const json = await fetchJSON(`${API_URL}/laporan-magang/info-aktif`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setInfoAktif(json.data);
    } catch (err) {
      setInfoAktif(null);
      if (!err.message.includes("404") && !err.message.includes("belum ada")) {
        showToast(err.message, "error");
      }
    } finally {
      setLoadingInfo(false);
    }
  }, [token, showToast]);

  const fetchHistory = useCallback(async () => {
    try {
      setLoadingHistory(true);
      const json = await fetchJSON(`${API_URL}/laporan-magang/mahasiswa`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setHistory(json.data || []);
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setLoadingHistory(false);
    }
  }, [token, showToast]);

  useEffect(() => {
    fetchInfoAktif();
    fetchHistory();
  }, [fetchInfoAktif, fetchHistory]);

  const MAX_SIZE = 10 * 1024 * 1024;
  const ALLOWED_TYPES = [
    "application/pdf",
    "image/jpeg", "image/png", "image/jpg",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  ];

  const pickFile = (f) => {
    if (!f) return;
    if (f.size > MAX_SIZE)          { showToast("File melebihi batas 10 MB.", "error"); return; }
    if (!ALLOWED_TYPES.includes(f.type)) { showToast("Tipe file tidak didukung.", "error"); return; }
    setFile({ id: `${Date.now()}`, name: f.name, size: f.size, rawFile: f, uploadStatus: "pending", progress: 0 });
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    pickFile(e.dataTransfer.files[0]);
  };

  const handleKirim = async () => {
    if (!infoAktif)               { showToast("Tidak ada magang aktif.", "error"); return; }
    if (!infoAktif.sudahAdaDosen) { showToast("Bimbingan dosen belum aktif.", "error"); return; }
    if (!tanggal)                 { showToast("Pilih tanggal laporan.", "error"); return; }
    if (!judul.trim())            { showToast("Isi judul terlebih dahulu.", "error"); return; }
    if (!file)                    { showToast("Pilih file laporan terlebih dahulu.", "error"); return; }

    setIsSubmitting(true);
    setFile((prev) => prev ? { ...prev, uploadStatus: "uploading", progress: 0 } : prev);

    try {
      const fd = new FormData();
      fd.append("file", file.rawFile);
      fd.append("lamaranId", String(infoAktif.lamaranId));
      fd.append("tanggal", tanggal);
      fd.append("judul", judul.trim());
      if (catatan.trim()) fd.append("catatan", catatan.trim());

      const result = await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();

        xhr.upload.addEventListener("progress", (e) => {
          if (e.lengthComputable)
            setFile((prev) => prev ? { ...prev, progress: Math.round((e.loaded / e.total) * 100) } : prev);
        });

        xhr.addEventListener("load", () => {
          const contentType = xhr.getResponseHeader("Content-Type") || "";

          if (xhr.status === 401) {
            if (typeof window !== "undefined") {
              localStorage.removeItem("token");
              window.location.href = "/login";
            }
            return reject(new Error("Sesi berakhir. Silakan login ulang."));
          }

          if (!contentType.includes("application/json")) {
            return reject(
              new Error(
                `Server error (${xhr.status}). Pastikan URL API benar dan server berjalan.`
              )
            );
          }

          let json;
          try {
            json = JSON.parse(xhr.responseText || "{}");
          } catch {
            return reject(new Error("Respons server tidak valid."));
          }

          if (xhr.status >= 200 && xhr.status < 300) resolve(json);
          else reject(new Error(json.message || `Error ${xhr.status}`));
        });

        xhr.addEventListener("error", () => reject(new Error("Koneksi gagal. Periksa jaringan.")));
        xhr.addEventListener("timeout", () => reject(new Error("Request timeout. Coba lagi.")));

        xhr.timeout = 60000;
        xhr.open("POST", `${API_URL}/laporan-magang/upload`);
        xhr.setRequestHeader("Authorization", `Bearer ${token}`);
        xhr.send(fd);
      });

      setFile((prev) => prev ? { ...prev, uploadStatus: "success", progress: 100 } : prev);
      showToast(result.message || "Laporan berhasil dikirim!");

      await fetchHistory();
      setHistoryPage(1); // tampilkan laporan terbaru
      setTimeout(() => {
        setTanggal("");
        setJudul("");
        setCatatan("");
        setFile(null);
      }, 1200);
    } catch (err) {
      setFile((prev) => prev ? { ...prev, uploadStatus: "error", errorMsg: err.message } : prev);
      showToast(err.message || "Terjadi kesalahan. Coba lagi.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  // ─ Stats (disamakan dengan gaya card statistik di Dashboard: label mono uppercase + angka serif) ─
  const totalLaporan  = history.length;
  const totalDinilai  = history.filter((r) => r.status === "SUDAH_DINILAI").length;
  const totalMenunggu = history.filter((r) => r.status === "MENUNGGU_REVIEW").length;

  const stats = [
    {
      label: "Total Laporan",
      value: totalLaporan,
      accent: "text-[#1a6ef5]",
      subtitle: "Semua laporan dikirim",
      icon: (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#1a6ef5" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round">
          <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" /><polyline points="13 2 13 9 20 9" />
        </svg>
      ),
    },
    {
      label: "Sudah Dinilai",
      value: totalDinilai,
      accent: "text-emerald-600",
      subtitle: "Sudah disetujui dosen",
      icon: (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
        </svg>
      ),
    },
    {
      label: "Menunggu Review",
      value: totalMenunggu,
      accent: "text-amber-600",
      subtitle: "Menuju penilaian",
      icon: (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
        </svg>
      ),
    },
  ];

  const canSubmit = !isSubmitting && infoAktif?.sudahAdaDosen && !!file && !!tanggal && !!judul.trim();

  // ─ Pagination riwayat laporan ─────────────────────────────────────────────
  const historyTotalPages = Math.max(1, Math.ceil(history.length / REPORT_PER_PAGE));
  const safeHistoryPage   = Math.min(historyPage, historyTotalPages);
  const historyPageItems  = history.slice(
    (safeHistoryPage - 1) * REPORT_PER_PAGE,
    safeHistoryPage * REPORT_PER_PAGE
  );

  return (
    <div className="min-h-screen bg-[#f7f7fb] font-sans">

      <Topbar
        icon={
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" />
            <polyline points="13 2 13 9 20 9" />
          </svg>
        }
        title="Laporan Harian"
        subtitle="Buat dan pantau laporan kegiatan magang"
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

      <div className="px-8 py-7 flex flex-col gap-6">

        {/* ── Stats (disamakan persis dengan gaya stat card Dashboard) ── */}
        <div className="grid grid-cols-3 gap-3.5 max-[900px]:grid-cols-1">
          {stats.map((s, i) => (
            <div
              key={i}
              className="bg-white border border-slate-200 rounded-2xl p-5 transition-all duration-150 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-blue-100/60"
            >
              <div className="flex items-center gap-1.5 mb-2">
                {s.icon}
                <span className={`text-[10.5px] font-mono font-bold uppercase tracking-widest ${s.accent}`}>
                  {s.label}
                </span>
              </div>
              {loadingHistory ? (
                <div className="h-[30px] w-14 bg-[#f0f0f8] rounded-lg animate-pulse" />
              ) : (
                <span className="text-[30px] font-serif font-bold leading-none tracking-tight text-[#1e1e2e]">
                  {s.value}
                </span>
              )}
              <div className="text-[11px] text-slate-400 mt-1.5">{s.subtitle}</div>
            </div>
          ))}
        </div>

        {/* ── Main Grid ── */}
        <div className="grid grid-cols-[1fr_1.4fr] gap-5 items-start max-[900px]:grid-cols-1">

          {/* ── Form Card ── */}
          <div className="bg-white border border-[#e8e8f0] rounded-2xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-5 border-b border-[#e8e8f0]">
              <div>
                <div className="flex items-center gap-2.5">
                  <span className="w-1 h-4 rounded-full bg-[#1a6ef5] flex-shrink-0" />
                  <span className="text-[15px] font-bold text-[#1e1e2e]">Buat Laporan Baru</span>
                </div>
                <div className="text-[11.5px] text-[#9898b0] mt-0.5 ml-3.5">Kirim laporan ke dosen pembimbing</div>
              </div>
              <div className="w-9 h-9 rounded-[10px] border-2 border-[#7dd3fc] bg-[#e0f2fe] flex items-center justify-center">
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#1a6ef5" strokeWidth="2.5" strokeLinecap="round">
                  <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                </svg>
              </div>
            </div>

            <div className="p-6 flex flex-col gap-5">

              {loadingInfo ? (
                <div className="h-[60px] rounded-xl bg-[#f0f0f8] animate-pulse" />
              ) : (
                <DosenBanner info={infoAktif} />
              )}

              {/* Tanggal */}
              <div>
                <label className="block text-[11px] font-mono font-bold uppercase tracking-wide text-[#1e1e2e] mb-1.5">Tanggal Laporan</label>
                <div className="relative">
                  <input type="date" value={tanggal} onChange={(e) => setTanggal(e.target.value)}
                    disabled={isSubmitting}
                    className="w-full pl-3 pr-9 py-2.5 border border-[#e8e8f0] rounded-xl text-[13px] text-[#1e1e2e] bg-white outline-none focus:border-[#1a6ef5] focus:ring-2 focus:ring-[#e0f2fe] transition-all disabled:opacity-50" />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9898b0] pointer-events-none">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" />
                      <line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
                    </svg>
                  </span>
                </div>
              </div>

              {/* Judul */}
              <div>
                <label className="block text-[11px] font-mono font-bold uppercase tracking-wide text-[#1e1e2e] mb-1.5">Judul Laporan</label>
                <input type="text" value={judul} onChange={(e) => setJudul(e.target.value)}
                  placeholder="Contoh: Laporan Minggu 12" disabled={isSubmitting}
                  className="w-full px-3 py-2.5 border border-[#e8e8f0] rounded-xl text-[13px] text-[#1e1e2e] bg-white outline-none focus:border-[#1a6ef5] focus:ring-2 focus:ring-[#e0f2fe] transition-all placeholder:text-[#c0c0d8] disabled:opacity-50" />
              </div>

              {/* Upload */}
              <div>
                <label className="block text-[11px] font-mono font-bold uppercase tracking-wide text-[#1e1e2e] mb-1.5">
                  File Laporan <span className="text-red-400">*</span>
                  <span className="ml-1 text-[#9898b0] font-normal normal-case tracking-normal">PDF, Word, Excel, JPG, PNG · maks. 10 MB</span>
                </label>

                {!file ? (
                  <div
                    onClick={() => !isSubmitting && fileRef.current?.click()}
                    onDragOver={(e) => { e.preventDefault(); if (!isSubmitting) setDragging(true); }}
                    onDragLeave={() => setDragging(false)}
                    onDrop={handleDrop}
                    className={`min-h-[90px] border-2 border-dashed rounded-xl flex flex-col items-center justify-center gap-1.5 transition-all
                      ${isSubmitting ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
                      ${dragging ? "border-[#1a6ef5] bg-[#e0f2fe]" : "border-[#e8e8f0] bg-[#fafafa] hover:border-[#7dd3fc] hover:bg-[#e0f2fe]/30"}`}>
                    <svg width="26" height="26" viewBox="0 0 24 24" fill="none"
                      stroke={dragging ? "#1a6ef5" : "#c0c0d8"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="16 16 12 12 8 16" /><line x1="12" y1="12" x2="12" y2="21" />
                      <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" />
                    </svg>
                    <span className="text-[12px] text-[#9898b0]">
                      <span className="text-[#1a6ef5] font-semibold">Klik untuk unggah</span> atau seret file ke sini
                    </span>
                    <input ref={fileRef} type="file"
                      accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png"
                      className="hidden"
                      onChange={(e) => pickFile(e.target.files?.[0])} />
                  </div>
                ) : (
                  <div className="mt-1">
                    <FileItem
                      file={file}
                      onRemove={() => { setFile(null); if (fileRef.current) fileRef.current.value = ""; }}
                    />
                  </div>
                )}
              </div>

              {/* Catatan */}
              <div>
                <label className="block text-[11px] font-mono font-bold uppercase tracking-wide text-[#1e1e2e] mb-1.5">Catatan Tambahan</label>
                <textarea value={catatan} onChange={(e) => setCatatan(e.target.value)} rows={3}
                  disabled={isSubmitting}
                  placeholder="Tuliskan catatan atau kendala yang dihadapi..."
                  className="w-full px-3 py-2.5 border border-[#e8e8f0] rounded-xl text-[13px] text-[#1e1e2e] bg-white outline-none focus:border-[#1a6ef5] focus:ring-2 focus:ring-[#e0f2fe] transition-all resize-none placeholder:text-[#c0c0d8] disabled:opacity-50" />
              </div>

              {/* Tombol kirim */}
              <button onClick={handleKirim} disabled={!canSubmit}
                className="w-full py-2.5 bg-[#1a6ef5] rounded-xl text-white text-[13px] font-semibold hover:bg-[#1557c8] transition-all flex items-center justify-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed">
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                    </svg>
                    Mengirim…
                  </>
                ) : (
                  <>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
                    </svg>
                    Kirim ke Dosen Pembimbing
                  </>
                )}
              </button>

              {!infoAktif?.sudahAdaDosen && !loadingInfo && (
                <p className="text-[11px] text-center text-amber-600">
                  Pengiriman laporan memerlukan bimbingan dosen yang sudah aktif (disetujui dosen).
                </p>
              )}
            </div>
          </div>

          {/* ── History Card ── */}
          <div className="bg-white border border-[#e8e8f0] rounded-2xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-5 border-b border-[#e8e8f0]">
              <div>
                <div className="flex items-center gap-2.5">
                  <span className="w-1 h-4 rounded-full bg-[#1a6ef5] flex-shrink-0" />
                  <span className="text-[15px] font-bold text-[#1e1e2e]">Riwayat Laporan</span>
                </div>
                <div className="text-[11.5px] text-[#9898b0] mt-0.5 ml-3.5">Semua laporan yang telah dikirim ke dosen</div>
              </div>

              <span className="text-[11px] font-mono font-bold text-[#1a6ef5] bg-[#e0f2fe] px-2.5 py-1 rounded-full border border-[#7dd3fc]">
                {history.length}
              </span>
            </div>

            <div className="p-5">
              {loadingHistory ? (
                <div className="flex flex-col gap-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-[72px] rounded-xl bg-[#f0f0f8] animate-pulse" />
                  ))}
                </div>
              ) : history.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-[#c0c0d8]">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mb-3 opacity-50">
                    <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                  </svg>
                  <p className="text-[13px]">Belum ada laporan yang dikirim.</p>
                </div>
              ) : (
                <>
                  <div className="flex flex-col gap-3">
                    {historyPageItems.map((r) => <ReportItem key={r.id} report={r} />)}
                  </div>

                  <ArrowPagination
                    page={safeHistoryPage}
                    totalPages={historyTotalPages}
                    onChange={setHistoryPage}
                  />
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <Toast toast={toast} />
    </div>
  );
}