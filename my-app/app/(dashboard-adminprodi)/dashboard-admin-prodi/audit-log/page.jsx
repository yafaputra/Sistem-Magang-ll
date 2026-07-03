"use client";

import { useState, useEffect, useCallback } from "react";
import {
  FaSignInAlt,
  FaSignOutAlt,
  FaPlus,
  FaEdit,
  FaTrash,
  FaCheckCircle,
  FaFileExport,
  FaUser,
  FaLock,
  FaBook,
  FaClipboardList,
  FaTimesCircle,
  FaCalendarDay,
} from "react-icons/fa";
import Topbar from "../../components/topbar";
const PAGE_SIZE = 10;

const actionMeta = {
  LOGIN:          { pill: "bg-emerald-50 text-emerald-500",  icon: <FaSignInAlt /> },
  LOGOUT:         { pill: "bg-gray-100 text-gray-400",       icon: <FaSignOutAlt /> },
  CREATE:         { pill: "bg-blue-100 text-blue-500",       icon: <FaPlus /> },
  UPDATE:         { pill: "bg-blue-50 text-blue-600",        icon: <FaEdit /> },
  DELETE:         { pill: "bg-red-50 text-red-500",          icon: <FaTrash /> },
  VALIDASI:       { pill: "bg-blue-50 text-blue-600",        icon: <FaCheckCircle /> },
  EXPORT:         { pill: "bg-green-50 text-green-600",      icon: <FaFileExport /> },
  ASSIGN:         { pill: "bg-blue-50 text-blue-600",        icon: <FaUser /> },
  RESET_PASSWORD: { pill: "bg-blue-50 text-blue-600",        icon: <FaLock /> },
  KONVERSI_SKS:   { pill: "bg-blue-100 text-blue-500",       icon: <FaBook /> },
};

const modules  = ["Semua Modul", "Auth", "Mahasiswa", "Dosen", "Lowongan", "Pendaftaran", "Laporan", "Akademik", "User"];
const statuses = ["Semua Status", "BERHASIL", "GAGAL"];

// ─── Stat card config — masing-masing warna berbeda ──────────────────────────
const STAT_CONFIG = [
  {
    key: "total",
    label: "Total Aktivitas",
    icon: <FaClipboardList />,
    iconBg:     "bg-[#dbeafe]",
    iconBorder: "border border-[#bfdbfe]",
    iconColor:  "text-[#2563eb]",
    valueColor: "text-[#2563eb]",
  },
  {
    key: "berhasil",
    label: "Berhasil",
    icon: <FaCheckCircle />,
    iconBg:     "bg-emerald-50",
    iconBorder: "border border-emerald-200",
    iconColor:  "text-emerald-600",
    valueColor: "text-emerald-600",
  },
  {
    key: "gagal",
    label: "Gagal",
    icon: <FaTimesCircle />,
    iconBg:     "bg-red-50",
    iconBorder: "border border-red-200",
    iconColor:  "text-red-500",
    valueColor: "text-red-500",
  },
  {
    key: "today",
    label: "Hari Ini",
    icon: <FaCalendarDay />,
    iconBg:     "bg-amber-50",
    iconBorder: "border border-amber-200",
    iconColor:  "text-amber-500",
    valueColor: "text-amber-500",
  },
];

export default function AuditLog() {
  const [logs,       setLogs]       = useState([]);
  const [stats,      setStats]      = useState({ total: 0, berhasil: 0, gagal: 0, today: 0 });
  const [totalPages, setTotalPages] = useState(1);
  const [totalEntri, setTotalEntri] = useState(0);
  const [loading,    setLoading]    = useState(false);
  const [error,      setError]      = useState(null);

  const [search, setSearch] = useState("");
  const [module, setModule] = useState("Semua Modul");
  const [status, setStatus] = useState("Semua Status");
  const [page,   setPage]   = useState(1);
  const [detail, setDetail] = useState(null);

  /* ── Fetch dari API ── */
  const fetchLogs = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");

      const params = new URLSearchParams({ page, limit: PAGE_SIZE });
      if (search)                    params.set("search", search);
      if (module !== "Semua Modul")  params.set("module", module);
      if (status !== "Semua Status") params.set("status", status);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/audit-logs?${params}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Gagal mengambil data");
      }

      const data = await res.json();

      const normalised = data.data.map((l) => ({
        id:     l.id,
        user:   l.userName  ?? "-",
        role:   l.role      ?? "-",
        action: l.action,
        desc:   l.description,
        module: l.module,
        ip:     l.ipAddress ?? "-",
        time:   new Date(l.createdAt).toLocaleString("id-ID", {
                  day: "2-digit", month: "short", year: "numeric",
                  hour: "2-digit", minute: "2-digit",
                }),
        status: l.status,
      }));

      setLogs(normalised);
      setStats(data.stats);
      setTotalPages(data.meta.totalPages);
      setTotalEntri(data.meta.total);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [page, search, module, status]);

  useEffect(() => { fetchLogs(); }, [fetchLogs]);

  const handleSearch = (val) => { setSearch(val); setPage(1); };
  const handleModule = (val) => { setModule(val); setPage(1); };
  const handleStatus = (val) => { setStatus(val); setPage(1); };

  /* ── Pagination numbers ── */
  const pageNums = () => {
    if (totalPages <= 6) return Array.from({ length: totalPages }, (_, i) => i + 1);
    if (page <= 3)              return [1, 2, 3, "...", totalPages];
    if (page >= totalPages - 2) return [1, "...", totalPages - 2, totalPages - 1, totalPages];
    return [1, "...", page - 1, page, page + 1, "...", totalPages];
  };

  /* ── Export CSV ── */
  const handleExport = async () => {
    try {
      const token = localStorage.getItem("token");
      const params = new URLSearchParams({ page: 1, limit: 99999 });
      if (search)                    params.set("search", search);
      if (module !== "Semua Modul")  params.set("module", module);
      if (status !== "Semua Status") params.set("status", status);

      const res  = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/audit-logs?${params}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const data = await res.json();

      const header = ["ID", "Pengguna", "Role", "Aksi", "Deskripsi", "Modul", "IP Address", "Waktu", "Status"];
      const csv = [
        header.join(","),
        ...data.data.map((l) =>
          [
            l.id,
            `"${l.userName ?? ""}"`,
            l.role ?? "",
            l.action,
            `"${l.description}"`,
            l.module,
            l.ipAddress ?? "",
            new Date(l.createdAt).toLocaleString("id-ID"),
            l.status,
          ].join(",")
        ),
      ].join("\n");

      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const url  = URL.createObjectURL(blob);
      const a    = document.createElement("a");
      a.href     = url;
      a.download = `audit-log-${Date.now()}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      alert("Gagal export CSV");
    }
  };

  return (
    <div className="font-sans">

      {/* ── Header ── */}
      <Topbar
        icon={
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <path d="M21 21l-4.35-4.35" />
            <line x1="11" y1="8" x2="11" y2="14" />
            <line x1="8" y1="11" x2="14" y2="11" />
          </svg>
        }
        title="Audit Log"
        subtitle="Rekam jejak aktivitas sistem"
        iconBg="bg-[#dbeafe]"
        iconBorder="border-[#bfdbfe]"
        iconColor="text-[#2563eb]"
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

      <div className="p-7 flex flex-col gap-5">

        {/* ── Stat Cards — tiap icon beda warna ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
          {STAT_CONFIG.map((s) => (
            <div
              key={s.key}
              className="bg-white border border-gray-200 rounded-xl p-4 flex items-center gap-3.5 hover:-translate-y-0.5 hover:shadow-md transition-all"
            >
              {/* icon dengan bg + border senada, warna berbeda tiap card */}
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-lg flex-shrink-0 ${s.iconBg} ${s.iconBorder} ${s.iconColor}`}>
                {s.icon}
              </div>
              <div>
                <div className={`text-2xl font-extrabold leading-none ${s.valueColor}`}>
                  {stats[s.key]}
                </div>
                <div className="text-xs text-gray-400 mt-1 font-medium">{s.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* ── Toolbar ── */}
        <div className="bg-white rounded-xl border border-gray-200 px-4 py-3.5 flex items-center gap-2.5 flex-wrap">
          {/* Search */}
          <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 flex-1 min-w-[200px] focus-within:border-[#2563eb] focus-within:bg-white transition-colors">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#b0b0c8" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
            <input
              className="border-none outline-none text-xs text-gray-700 bg-transparent w-full placeholder-gray-300 font-sans"
              placeholder="Cari pengguna, aksi, IP address..."
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>

          {/* Module filter */}
          <select
            className="px-3 py-2 pr-8 border border-gray-200 rounded-lg text-xs text-gray-700 bg-white font-sans cursor-pointer outline-none focus:border-[#2563eb] appearance-none transition-colors"
            value={module}
            onChange={(e) => handleModule(e.target.value)}
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='12' height='8' viewBox='0 0 12 8' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L6 6L11 1' stroke='%239898B0' stroke-width='1.5' stroke-linecap='round'/%3E%3C/svg%3E")`,
              backgroundRepeat: "no-repeat",
              backgroundPosition: "right 10px center",
            }}
          >
            {modules.map((m) => <option key={m}>{m}</option>)}
          </select>

          {/* Status filter */}
          <select
            className="px-3 py-2 pr-8 border border-gray-200 rounded-lg text-xs text-gray-700 bg-white font-sans cursor-pointer outline-none focus:border-[#2563eb] appearance-none transition-colors"
            value={status}
            onChange={(e) => handleStatus(e.target.value)}
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='12' height='8' viewBox='0 0 12 8' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L6 6L11 1' stroke='%239898B0' stroke-width='1.5' stroke-linecap='round'/%3E%3C/svg%3E")`,
              backgroundRepeat: "no-repeat",
              backgroundPosition: "right 10px center",
            }}
          >
            {statuses.map((s) => <option key={s}>{s}</option>)}
          </select>

          {/* Export */}
          <button
            onClick={handleExport}
            className="flex items-center gap-1.5 px-4 py-2 bg-white text-[#2563eb] border border-blue-200 rounded-lg text-xs font-semibold cursor-pointer hover:bg-blue-50 transition-colors whitespace-nowrap"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="7 10 12 15 17 10"/>
              <line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
            Export CSV
          </button>
        </div>

        {/* ── Table Card ── */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-5 py-3.5 border-b border-gray-100 flex items-center justify-between">
            <span className="text-sm font-bold text-gray-900">Log Aktivitas</span>
            <span className="text-xs text-gray-400">{totalEntri} entri ditemukan</span>
          </div>

          {loading && (
            <div className="py-12 text-center text-sm text-gray-300 animate-pulse">
              Memuat data...
            </div>
          )}

          {!loading && error && (
            <div className="py-12 text-center text-sm text-red-400">
              {error}
              <button onClick={fetchLogs} className="ml-3 text-[#2563eb] underline text-xs">
                Coba lagi
              </button>
            </div>
          )}

          {!loading && !error && logs.length === 0 && (
            <div className="py-12 text-center text-sm text-gray-300">
              Tidak ada log yang cocok dengan filter.
            </div>
          )}

          {!loading && !error && logs.length > 0 && (
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  {["#", "Pengguna", "Aksi", "Deskripsi", "Modul", "IP Address", "Waktu", "Status", ""].map((h) => (
                    <th
                      key={h}
                      className="text-left text-[10.5px] font-bold uppercase tracking-wider text-gray-300 px-4 py-3 bg-gray-50 border-b border-gray-100"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {logs.map((log) => {
                  const am = actionMeta[log.action] || { pill: "bg-gray-100 text-gray-500", icon: "⚙️" };
                  const isGagal = log.status === "GAGAL";
                  return (
                    <tr
                      key={log.id}
                      className="cursor-pointer hover:[&>td]:bg-gray-50 border-b border-gray-50 last:border-0 transition-colors"
                      onClick={() => setDetail(log)}
                    >
                      <td className="px-4 py-3 text-[11.5px] text-gray-300 align-middle">{log.id}</td>
                      <td className="px-4 py-3 align-middle">
                        <div className="flex flex-col gap-0.5">
                          <span className="text-xs font-semibold text-gray-900">{log.user}</span>
                          <span className="text-[10.5px] text-gray-400">{log.role}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 align-middle">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold whitespace-nowrap ${am.pill}`}>
                          {am.icon} {log.action}
                        </span>
                      </td>
                      <td className="px-4 py-3 align-middle max-w-[200px]">
                        <span className="text-xs text-gray-500 leading-snug">{log.desc}</span>
                      </td>
                      <td className="px-4 py-3 align-middle">
                        <span className="text-[11.5px] font-semibold text-[#2563eb] bg-[#dbeafe] px-2.5 py-0.5 rounded-md">
                          {log.module}
                        </span>
                      </td>
                      <td className="px-4 py-3 align-middle">
                        <span className="text-[11.5px] text-gray-400 font-mono">{log.ip}</span>
                      </td>
                      <td className="px-4 py-3 align-middle">
                        <span className="text-[11.5px] text-gray-500 whitespace-nowrap">{log.time}</span>
                      </td>
                      <td className="px-4 py-3 align-middle">
                        <span className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold ${isGagal ? "bg-red-50 text-red-500" : "bg-emerald-50 text-emerald-500"}`}>
                          {log.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 align-middle">
                        <button
                          className="px-2.5 py-1 rounded-md border border-gray-200 bg-white text-[#2563eb] text-[11px] font-semibold cursor-pointer hover:bg-[#dbeafe] hover:border-blue-300 transition-colors"
                          onClick={(e) => { e.stopPropagation(); setDetail(log); }}
                        >
                          Detail
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}

          {/* ── Pagination ── */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-5 py-3 border-t border-gray-100">
              <span className="text-xs text-gray-400">
                {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, totalEntri)} dari {totalEntri} entri
              </span>
              <div className="flex items-center gap-1">
                <button
                  className="w-8 h-8 rounded-lg border border-gray-200 bg-white text-gray-500 flex items-center justify-center hover:border-blue-300 hover:text-[#2563eb] disabled:opacity-35 disabled:cursor-default transition-colors"
                  disabled={page === 1}
                  onClick={() => setPage(page - 1)}
                >
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="15 18 9 12 15 6"/>
                  </svg>
                </button>
                {pageNums().map((n, i) =>
                  n === "..." ? (
                    <span key={`d${i}`} className="w-8 text-center text-xs text-gray-300">…</span>
                  ) : (
                    <button
                      key={n}
                      onClick={() => setPage(n)}
                      className={`w-8 h-8 rounded-lg border text-xs font-medium flex items-center justify-center transition-colors ${
                        page === n
                          ? "bg-[#2563eb] text-white border-[#2563eb] font-bold"
                          : "bg-white border-gray-200 text-gray-600 hover:border-blue-300 hover:text-[#2563eb]"
                      }`}
                    >
                      {n}
                    </button>
                  )
                )}
                <button
                  className="w-8 h-8 rounded-lg border border-gray-200 bg-white text-gray-500 flex items-center justify-center hover:border-blue-300 hover:text-[#2563eb] disabled:opacity-35 disabled:cursor-default transition-colors"
                  disabled={page === totalPages}
                  onClick={() => setPage(page + 1)}
                >
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="9 18 15 12 9 6"/>
                  </svg>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Detail Modal ── */}
      {detail && (
        <div
          className="fixed inset-0 bg-gray-900/30 backdrop-blur-sm flex items-center justify-center z-[999]"
          onClick={() => setDetail(null)}
        >
          <div
            className="bg-white rounded-2xl w-[480px] max-w-[94vw] shadow-2xl overflow-hidden"
            style={{ animation: "pop 0.17s ease" }}
            onClick={(e) => e.stopPropagation()}
          >
            <style>{`@keyframes pop { from { transform: scale(0.94); opacity: 0; } to { transform: scale(1); opacity: 1; } }`}</style>

            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <span className="text-sm font-bold text-gray-900">Detail Log #{detail.id}</span>
              <button
                className="w-7 h-7 rounded-lg border border-gray-200 bg-white flex items-center justify-center text-gray-400 hover:bg-red-50 hover:text-red-500 hover:border-red-200 transition-colors"
                onClick={() => setDetail(null)}
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>

            <div className="px-6 py-5 flex flex-col gap-3.5">
              {[
                { label: "Pengguna",   val: `${detail.user} (${detail.role})` },
                { label: "Aksi",       val: detail.action },
                { label: "Deskripsi",  val: detail.desc },
                { label: "Modul",      val: detail.module },
                { label: "IP Address", val: detail.ip },
                { label: "Waktu",      val: detail.time },
                { label: "Status",     val: detail.status },
              ].map((r, i) => (
                <div key={i}>
                  <div className="flex gap-3 items-start">
                    <span className="w-32 text-[11.5px] font-bold text-gray-300 uppercase tracking-wide flex-shrink-0 pt-0.5">
                      {r.label}
                    </span>
                    <span className={`text-[13px] font-medium leading-relaxed ${
                      r.label === "Status"
                        ? detail.status === "GAGAL" ? "text-red-500 font-bold" : "text-emerald-500 font-bold"
                        : r.label === "IP Address"
                        ? "font-mono text-gray-500"
                        : "text-gray-900"
                    }`}>
                      {r.val}
                    </span>
                  </div>
                  {i < 6 && <div className="h-px bg-gray-100 mt-3" />}
                </div>
              ))}
            </div>

            <div className="px-6 py-3.5 border-t border-gray-100 flex justify-end">
              <button
                className="px-5 py-2 bg-[#2563eb] text-white rounded-lg text-sm font-semibold hover:bg-blue-600 transition-colors"
                onClick={() => setDetail(null)}
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}