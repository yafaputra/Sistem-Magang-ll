"use client";

import { useEffect, useState } from "react";
import Topbar from "../../components/topbar";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const STATUS_CONFIG = {
  disetujui: { label: "Disetujui", dot: "bg-green-500", badge: "bg-green-50 text-green-700" },
  menunggu:  { label: "Menunggu",  dot: "bg-amber-500", badge: "bg-amber-50 text-amber-700" },
  ditolak:   { label: "Ditolak",   dot: "bg-red-400",   badge: "bg-red-50 text-red-700" },
};

const KATEGORI_CONFIG = {
  wajib:   { label: "Wajib",   cls: "bg-violet-100 text-violet-800" },
  pilihan: { label: "Pilihan", cls: "bg-sky-100 text-sky-800" },
};

// ─── Icons ────────────────────────────────────────────────────────────────────
const IconClose = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);
const IconLayers = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" />
  </svg>
);
const IconPlus = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);
const IconList = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" />
    <line x1="3" y1="6" x2="3.01" y2="6" /><line x1="3" y1="12" x2="3.01" y2="12" /><line x1="3" y1="18" x2="3.01" y2="18" />
  </svg>
);
const IconSend = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
  </svg>
);
const IconInfo = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" />
  </svg>
);
const IconCheck = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);
const IconAlert = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
    <line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
);
const IconClock = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
  </svg>
);
const IconClipboard = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="9" y="2" width="6" height="4" rx="1" />
    <path d="M9 4H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-3" />
    <path d="M9 12h6" /><path d="M9 16h4" />
  </svg>
);

// ─── Sub-components ───────────────────────────────────────────────────────────
function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status];
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11.5px] font-semibold ${cfg.badge}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
}

function KategoriBadge({ kategori }) {
  const cfg = KATEGORI_CONFIG[kategori];
  return (
    <span className={`inline-block px-2 py-0.5 rounded-md text-[11px] font-medium ${cfg.cls}`}>
      {cfg.label}
    </span>
  );
}

// Redesigned to match the icon-badge stat card style: label + icon chip on top,
// a bold headline number, and a colored status line underneath.
function StatCard({ label, value, sub, icon, tint }) {
  return (
    <div className="bg-white rounded-2xl border border-[#e8e8f0] px-5 py-4 flex flex-col gap-2.5 transition-all duration-150 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-violet-100/60">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-bold uppercase tracking-wider text-[#a5a5bd]">{label}</span>
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${tint.iconBg}`}>
          <span className={tint.iconColor}>{icon}</span>
        </div>
      </div>
      <div>
        <div className="text-[26px] font-bold text-[#1e1e2e] leading-none">{value}</div>
        <div className={`text-[12px] font-semibold mt-1.5 ${tint.subColor}`}>{sub}</div>
      </div>
    </div>
  );
}

function DetailModal({ mk, onClose }) {
  if (!mk) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm px-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-xl w-full max-w-md border border-[#e8e8f0] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#f0f0f8]">
          <h2 className="text-[15px] font-bold text-[#1e1e2e]">Detail mata kuliah</h2>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-[#f4f3ff] hover:bg-[#ede9ff] flex items-center justify-center text-[#9898b0] transition-colors"
          >
            <IconClose />
          </button>
        </div>
        <div className="px-5 py-4 space-y-0">
          {[
            { label: "Kode MK",         value: <span className="font-mono text-[12px]">{mk.kode}</span> },
            { label: "Nama mata kuliah", value: mk.nama },
            { label: "Jumlah SKS",       value: `${mk.sks} SKS` },
            { label: "Kategori",         value: <KategoriBadge kategori={mk.kategori} /> },
            { label: "Status",           value: <StatusBadge status={mk.status} /> },
          ].map((row) => (
            <div key={row.label} className="flex justify-between items-center py-2.5 border-b border-[#f4f3ff] last:border-0">
              <span className="text-[12px] text-[#9898b0]">{row.label}</span>
              <span className="text-[13px] font-semibold text-[#1e1e2e] text-right max-w-[60%]">{row.value}</span>
            </div>
          ))}

          {mk.cpmk && mk.cpmk.length > 0 && (
            <div className="py-2.5 border-b border-[#f4f3ff]">
              <p className="text-[12px] text-[#9898b0] mb-1.5">CPMK</p>
              <div className="flex flex-wrap gap-1.5">
                {mk.cpmk.map((c, i) => (
                  <span key={i} className="px-2 py-0.5 bg-violet-100 text-violet-800 rounded-md text-[11px] font-medium">
                    {c}
                  </span>
                ))}
              </div>
            </div>
          )}

          {mk.objektif && (
            <div className="py-2.5 border-b border-[#f4f3ff]">
              <p className="text-[12px] text-[#9898b0] mb-1.5">Objektif</p>
              <p className="text-[13px] text-[#1e1e2e] leading-relaxed bg-[#fafafd] rounded-xl px-3 py-2.5 border border-[#f0f0f8]">
                {mk.objektif}
              </p>
            </div>
          )}

          <div className="pt-2">
            <p className="text-[12px] text-[#9898b0] mb-1.5">Keterangan</p>
            <p className="text-[13px] text-[#1e1e2e] leading-relaxed bg-[#fafafd] rounded-xl px-3 py-2.5 border border-[#f0f0f8]">
              {mk.keterangan}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Manual Input Form ────────────────────────────────────────────────────────
function ManualInputForm({ onSubmit }) {
  const [kode, setKode]           = useState("");
  const [nama, setNama]           = useState("");
  const [sks, setSks]             = useState("");
  const [kategori, setKategori]   = useState("pilihan");
  const [prodi, setProdi]         = useState("");
  const [cpmkList, setCpmkList]   = useState([]);
  const [cpmkInput, setCpmkInput] = useState("");
  const [objektif, setObjektif]   = useState("");

  const isValid = kode.trim() && nama.trim() && Number(sks) > 0;

  function addCPMK() {
    const v = cpmkInput.trim();
    if (!v) return;
    setCpmkList((p) => [...p, v]);
    setCpmkInput("");
  }

  function removeCPMK(i) {
    setCpmkList((p) => p.filter((_, idx) => idx !== i));
  }

  function handleSubmit() {
    if (!isValid) return;
    onSubmit({ kode: kode.trim(), nama: nama.trim(), sks: parseInt(sks), kategori, prodi: prodi.trim(), cpmk: cpmkList, objektif: objektif.trim() });
    setKode(""); setNama(""); setSks(""); setKategori("pilihan");
    setProdi(""); setCpmkList([]); setCpmkInput(""); setObjektif("");
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-[11.5px] font-semibold text-[#6b6b8a] mb-1">Kode mata kuliah</label>
          <input
            type="text"
            value={kode}
            onChange={(e) => setKode(e.target.value)}
            placeholder="Contoh: IF4099"
            className="w-full px-3 py-2 bg-[#fafafd] border border-[#e8e8f0] rounded-xl text-[13px] text-[#1e1e2e] outline-none focus:border-violet-400 placeholder:text-[#c0c0d8] transition-colors"
          />
        </div>
        <div>
          <label className="block text-[11.5px] font-semibold text-[#6b6b8a] mb-1">Jumlah SKS</label>
          <input
            type="number"
            value={sks}
            onChange={(e) => setSks(e.target.value)}
            min={1} max={6}
            placeholder="1–6"
            className="w-full px-3 py-2 bg-[#fafafd] border border-[#e8e8f0] rounded-xl text-[13px] text-[#1e1e2e] outline-none focus:border-violet-400 placeholder:text-[#c0c0d8] transition-colors"
          />
        </div>
      </div>

      <div>
        <label className="block text-[11.5px] font-semibold text-[#6b6b8a] mb-1">Nama mata kuliah</label>
        <input
          type="text"
          value={nama}
          onChange={(e) => setNama(e.target.value)}
          placeholder="Contoh: Keamanan Jaringan"
          className="w-full px-3 py-2 bg-[#fafafd] border border-[#e8e8f0] rounded-xl text-[13px] text-[#1e1e2e] outline-none focus:border-violet-400 placeholder:text-[#c0c0d8] transition-colors"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-[11.5px] font-semibold text-[#6b6b8a] mb-1">Kategori</label>
          <select
            value={kategori}
            onChange={(e) => setKategori(e.target.value)}
            className="w-full px-3 py-2 bg-[#fafafd] border border-[#e8e8f0] rounded-xl text-[13px] text-[#1e1e2e] outline-none focus:border-violet-400 transition-colors appearance-none"
          >
            <option value="pilihan">Pilihan</option>
            <option value="wajib">Wajib</option>
          </select>
        </div>
        <div>
          <label className="block text-[11.5px] font-semibold text-[#6b6b8a] mb-1">Program studi asal</label>
          <input
            type="text"
            value={prodi}
            onChange={(e) => setProdi(e.target.value)}
            placeholder="Contoh: Teknik Informatika"
            className="w-full px-3 py-2 bg-[#fafafd] border border-[#e8e8f0] rounded-xl text-[13px] text-[#1e1e2e] outline-none focus:border-violet-400 placeholder:text-[#c0c0d8] transition-colors"
          />
        </div>
      </div>

      <div>
        <label className="block text-[11.5px] font-semibold text-[#6b6b8a] mb-1">
          CPMK (Capaian Pembelajaran Mata Kuliah)
        </label>

        {cpmkList.length > 0 && (
          <div className="flex flex-col gap-1.5 mb-2">
            {cpmkList.map((c, i) => (
              <div key={i} className="flex items-center gap-2 px-3 py-1.5 bg-[#f4f3ff] border border-violet-200 rounded-xl">
                <span className="flex-1 text-[12px] text-violet-700 truncate">{c}</span>
                <button onClick={() => removeCPMK(i)} className="text-violet-400 hover:text-red-500 transition-colors flex-shrink-0">
                  <IconClose />
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="flex items-center gap-2">
          <input
            type="text"
            value={cpmkInput}
            onChange={(e) => setCpmkInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addCPMK(); } }}
            placeholder="Tambah CPMK, lalu Enter..."
            className="flex-1 px-3 py-2 bg-[#fafafd] border border-[#e8e8f0] rounded-xl text-[13px] text-[#1e1e2e] outline-none focus:border-violet-400 placeholder:text-[#c0c0d8] transition-colors"
          />
          <button
            onClick={addCPMK}
            className="w-8 h-8 flex items-center justify-center rounded-xl bg-violet-500 text-white hover:bg-violet-700 flex-shrink-0 transition-colors"
          >
            <IconPlus />
          </button>
        </div>
      </div>

      <div>
        <label className="block text-[11.5px] font-semibold text-[#6b6b8a] mb-1">
          Objektif / tujuan konversi
        </label>
        <textarea
          rows={3}
          value={objektif}
          onChange={(e) => setObjektif(e.target.value)}
          placeholder="Contoh: Mata kuliah ini mencakup materi yang relevan dengan pekerjaan saya di bidang keamanan siber selama magang, meliputi..."
          className="w-full px-3 py-2.5 bg-[#fafafd] border border-[#e8e8f0] rounded-xl text-[13px] text-[#1e1e2e] outline-none resize-none focus:border-violet-400 placeholder:text-[#c0c0d8] transition-colors"
        />
      </div>

      <button
        onClick={handleSubmit}
        disabled={!isValid}
        className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-[13px] font-semibold transition-all duration-150
          disabled:bg-[#f0f0f8] disabled:text-[#c0c0d8] disabled:cursor-not-allowed
          enabled:bg-violet-500 enabled:text-white enabled:hover:bg-violet-700"
      >
        <IconSend />
        Ajukan Konversi
      </button>
    </div>
  );
}

// ─── Skeleton Loader ──────────────────────────────────────────────────────────
function SkeletonRow() {
  return (
    <tr className="border-b border-[#f7f7fb]">
      {[...Array(6)].map((_, i) => (
        <td key={i} className="px-5 py-3.5">
          <div className="h-4 bg-[#f0f0f8] rounded-lg animate-pulse" style={{ width: i === 1 ? "80%" : "50%" }} />
        </td>
      ))}
    </tr>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function KonversiSKSPage() {
  const [pengajuan, setPengajuan] = useState([]);
  const [stats, setStats] = useState({
    totalSks: 0,
    sksDisetujui: 0,
    sksMenunggu: 0,
    sksDitolak: 0,
    jumlahPengajuan: 0,
  });
  const [eligible, setEligible]     = useState(true);
  const [message, setMessage]       = useState("");
  const [filterStatus, setFilterStatus] = useState("semua");
  const [detailMK, setDetailMK]     = useState(null);
  const [successMsg, setSuccessMsg] = useState("");
  const [loading, setLoading]       = useState(false);

  // ── Fetch ──────────────────────────────────────────────────────────────────
  const fetchKonversiSks = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${API_URL}/api/konversi-sks?status=${filterStatus}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const result = await response.json();

      if (!response.ok) {
        setEligible(false);
        setMessage(result.message || "Gagal mengambil data konversi SKS");
        setPengajuan([]);
        return;
      }

      const mappedData = result.data.map((item) => ({
        id: item.id,
        kode: item.kode,
        nama: item.nama,
        sks: item.sks,
        kategori: item.kategori,
        status: item.status,
        keterangan: item.keterangan,
        cpmk: item.cpmk ? JSON.parse(item.cpmk) : [],
        objektif: item.objektif || "",
      }));

      setEligible(result.eligible);
      setMessage("");
      setPengajuan(mappedData);
      setStats(result.stats);
    } catch {
      setMessage("Tidak bisa terhubung ke backend");
      setEligible(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKonversiSks();
  }, [filterStatus]);

  // ── Computed stats ─────────────────────────────────────────────────────────
  const totalSks     = stats.totalSks     || 0;
  const sksDisetujui = stats.sksDisetujui || 0;
  const sksMenunggu  = stats.sksMenunggu  || 0;
  const sksDitolak   = stats.sksDitolak   || 0;

  const progSet = totalSks ? Math.round((sksDisetujui / totalSks) * 100) : 0;
  const progMng = totalSks ? Math.round((sksMenunggu  / totalSks) * 100) : 0;
  const progTol = totalSks ? Math.round((sksDitolak   / totalSks) * 100) : 0;

  // ── Helpers ────────────────────────────────────────────────────────────────
  function showSuccess(msg) {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(""), 5000);
  }

  async function handleSubmitManual(data) {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/api/konversi-sks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });
      const result = await response.json();

      if (!response.ok) {
        alert(result.message || "Gagal mengajukan konversi SKS");
        return;
      }

      showSuccess(`"${data.nama}" (${data.sks} SKS) berhasil diajukan. Menunggu review koordinator.`);
      fetchKonversiSks();
    } catch {
      alert("Tidak bisa terhubung ke backend");
    }
  }

  const tableRows  = pengajuan;
  const filterTabs = ["semua", "disetujui", "menunggu", "ditolak"];

  return (
    <div className="min-h-screen bg-[#f7f7fb] font-sans">
      <Topbar
        icon={<IconLayers />}
        title="Konversi SKS"
        subtitle="Pengajuan konversi kredit akademik"
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

      <div className="px-6 py-6 max-w-4xl mx-auto">

        {/* ── Not eligible banner ── */}
        {!eligible && message && (
          <div className="flex items-start gap-3 bg-red-50 border border-red-200 text-red-700 rounded-2xl px-5 py-4 mb-6">
            <span className="mt-0.5 flex-shrink-0"><IconAlert /></span>
            <p className="text-[13px] font-medium leading-relaxed">{message}</p>
          </div>
        )}

        {/* Stat Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          <StatCard
            label="Total Diajukan"
            value={totalSks}
            sub={`${stats.jumlahPengajuan || 0} mata kuliah`}
            icon={<IconClipboard />}
            tint={{ iconBg: "bg-violet-50", iconColor: "text-violet-600", subColor: "text-violet-600" }}
          />
          <StatCard
            label="Disetujui"
            value={sksDisetujui}
            sub="SKS diakui"
            icon={<IconCheck />}
            tint={{ iconBg: "bg-emerald-50", iconColor: "text-emerald-600", subColor: "text-emerald-600" }}
          />
          <StatCard
            label="Menunggu"
            value={sksMenunggu}
            sub="SKS dalam review"
            icon={<IconClock />}
            tint={{ iconBg: "bg-amber-50", iconColor: "text-amber-600", subColor: "text-amber-600" }}
          />
          <StatCard
            label="Ditolak"
            value={sksDitolak}
            sub="SKS tidak diakui"
            icon={<IconAlert />}
            tint={{ iconBg: "bg-red-50", iconColor: "text-red-500", subColor: "text-red-500" }}
          />
        </div>

        {/* Progress Bar */}
        <div className="bg-white rounded-2xl border border-[#e8e8f0] px-5 py-4 mb-6">
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-[13px] font-semibold text-[#1e1e2e]">Progres konversi SKS</span>
            <span className="text-[12px] text-[#9898b0]">{sksDisetujui} dari {totalSks} SKS disetujui</span>
          </div>
          <div className="h-2.5 bg-[#f0f0f8] rounded-full overflow-hidden flex">
            <div className="h-full bg-violet-500 transition-all duration-500" style={{ width: `${progSet}%` }} />
            <div className="h-full bg-amber-400"                              style={{ width: `${progMng}%` }} />
            <div className="h-full bg-red-300"                                style={{ width: `${progTol}%` }} />
          </div>
          <div className="flex items-center gap-5 mt-2.5">
            {[
              { color: "bg-violet-500", label: "Disetujui" },
              { color: "bg-amber-400",  label: "Menunggu" },
              { color: "bg-red-300",    label: "Ditolak" },
            ].map((l) => (
              <div key={l.label} className="flex items-center gap-1.5">
                <span className={`w-2.5 h-2.5 rounded-sm ${l.color}`} />
                <span className="text-[11px] text-[#9898b0]">{l.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Ajukan Konversi ── */}
        <div className="bg-white rounded-2xl border border-[#e8e8f0] mb-6 overflow-hidden">
          <div className="flex items-center gap-2 px-5 py-3.5 border-b border-[#f0f0f8]">
            <span className="text-violet-500"><IconPlus /></span>
            <span className="text-[14px] font-bold text-[#1e1e2e]">Ajukan konversi mata kuliah</span>
          </div>

          <div className="px-5 py-4">
            {successMsg && (
              <div className="flex items-center gap-2.5 px-4 py-3 bg-green-50 border border-green-200 rounded-xl mb-4">
                <span className="text-green-600"><IconCheck /></span>
                <span className="text-[13px] text-green-700 font-medium">{successMsg}</span>
              </div>
            )}

            {eligible ? (
              <ManualInputForm onSubmit={handleSubmitManual} />
            ) : (
              <p className="text-[13px] text-[#9898b0] py-2">
                Kamu belum bisa mengajukan konversi SKS karena belum mengkonfirmasi penerimaan magang atau belum mendapat dosen pembimbing.
              </p>
            )}
          </div>
        </div>

        {/* Status Pengajuan */}
        <div className="bg-white rounded-2xl border border-[#e8e8f0] overflow-hidden">
          <div className="flex items-center gap-2 px-5 py-3.5 border-b border-[#f0f0f8]">
            <span className="text-violet-500"><IconList /></span>
            <span className="text-[14px] font-bold text-[#1e1e2e]">Status pengajuan konversi</span>
          </div>

          <div className="mx-5 mt-4 mb-3 flex items-start gap-2.5 px-4 py-3 bg-[#f4f3ff] rounded-xl border border-violet-200">
            <span className="text-violet-500 mt-0.5 flex-shrink-0"><IconInfo /></span>
            <p className="text-[12px] text-violet-700 leading-relaxed">
              Konversi SKS diproses oleh koordinator program studi. Pastikan portofolio kegiatan magang Anda sudah lengkap sebelum mengajukan konversi.
            </p>
          </div>

          <div className="flex items-center gap-2 px-5 pb-3 flex-wrap">
            {filterTabs.map((f) => (
              <button
                key={f}
                onClick={() => setFilterStatus(f)}
                className={`px-3.5 py-1.5 rounded-lg text-[12.5px] font-semibold capitalize transition-colors duration-150
                  ${filterStatus === f
                    ? "bg-violet-500 text-white"
                    : "bg-[#f4f3ff] border border-[#e0deff] text-[#8888a8] hover:text-violet-600 hover:border-violet-300"
                  }`}
              >
                {f === "semua" ? "Semua" : f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
            <span className="ml-auto text-[12px] text-[#b0b0c8]">{tableRows.length} mata kuliah</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-[13px]">
              <thead>
                <tr className="border-y border-[#f0f0f8] bg-[#fafafd]">
                  <th className="text-left px-5 py-3 text-[11px] font-bold uppercase tracking-wider text-[#b0b0c8]">Kode</th>
                  <th className="text-left px-5 py-3 text-[11px] font-bold uppercase tracking-wider text-[#b0b0c8]">Mata kuliah</th>
                  <th className="text-center px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-[#b0b0c8]">SKS</th>
                  <th className="text-center px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-[#b0b0c8]">Kategori</th>
                  <th className="text-center px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-[#b0b0c8]">Status</th>
                  <th className="text-center px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-[#b0b0c8]">Detail</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  [...Array(3)].map((_, i) => <SkeletonRow key={i} />)
                ) : tableRows.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-10 text-[#b0b0c8] text-[13px]">
                      Tidak ada data untuk filter ini.
                    </td>
                  </tr>
                ) : (
                  tableRows.map((mk, i) => (
                    <tr
                      key={mk.id}
                      className={`hover:bg-[#fafafd] transition-colors duration-100 ${i < tableRows.length - 1 ? "border-b border-[#f7f7fb]" : ""}`}
                    >
                      <td className="px-5 py-3.5">
                        <span className="font-mono text-[12px] text-[#9898b0]">{mk.kode}</span>
                      </td>
                      <td className="px-5 py-3.5 font-medium text-[#1e1e2e]">{mk.nama}</td>
                      <td className="px-4 py-3.5 text-center">
                        <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-violet-100 text-violet-700 text-[12px] font-bold">
                          {mk.sks}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-center">
                        <KategoriBadge kategori={mk.kategori} />
                      </td>
                      <td className="px-4 py-3.5 text-center">
                        <StatusBadge status={mk.status} />
                      </td>
                      <td className="px-4 py-3.5 text-center">
                        <button
                          onClick={() => setDetailMK(mk)}
                          className="text-[12px] text-violet-600 hover:text-violet-800 hover:underline font-semibold"
                        >
                          Lihat
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <DetailModal mk={detailMK} onClose={() => setDetailMK(null)} />
    </div>
  );
}