"use client";

import { useEffect, useState } from "react";
import Topbar from "../../components/topbar";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// ─── Fonts — same pairing as Dashboard Mahasiswa ────────────────────────────
const FONTS = `
@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600;9..144,700&family=IBM+Plex+Mono:wght@400;500;600&display=swap');
.font-display { font-family: 'Fraunces', 'Georgia', serif; }
.font-mono { font-family: 'IBM Plex Mono', 'Courier New', monospace; }
`;

// ─── Palette (matches dashboard) ────────────────────────────────────────────
// primary #2563EB (blue-600) · emerald #059669 · amber #D97706 · rose #E11D48
// paper #F8FAFC · card #FFFFFF · line #E2E8F0 · ink #1E293B · ink-60 #64748B

const STATUS_CONFIG = {
  disetujui: { label: "Disetujui", dot: "bg-emerald-500", cls: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  menunggu:  { label: "Menunggu",  dot: "bg-amber-500",   cls: "bg-amber-50 text-amber-700 border-amber-200" },
  ditolak:   { label: "Ditolak",   dot: "bg-rose-400",    cls: "bg-rose-50 text-rose-700 border-rose-200" },
};

const KATEGORI_CONFIG = {
  wajib:   { label: "Wajib",   cls: "bg-[#0A66C2]/5 text-[#0958A8] border-[#0A66C2]/20" },
  pilihan: { label: "Pilihan", cls: "bg-slate-100 text-slate-600 border-slate-200" },
};

// ─── Icons ────────────────────────────────────────────────────────────────────
function Icon({ name, className = "w-4 h-4", stroke = "currentColor" }) {
  const paths = {
    home:      <><path d="M3 9.5L12 3l9 6.5"/><path d="M5 9v11a1 1 0 0 0 1 1h3v-7h6v7h3a1 1 0 0 0 1-1V9"/></>,
    layers:    <><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></>,
    plus:      <><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></>,
    close:     <><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>,
    list:      <><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></>,
    send:      <><path d="M22 2L11 13"/><path d="M22 2L15 22l-4-9-9-4 20-7z"/></>,
    info:      <><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></>,
    check:     <><polyline points="20 6 9 17 4 12"/></>,
    alert:     <><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></>,
    clock:     <><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></>,
    clipboard: <><rect x="9" y="2" width="6" height="4" rx="1"/><path d="M9 4H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-3"/><path d="M9 12h6"/><path d="M9 16h4"/></>,
  };
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      {paths[name]}
    </svg>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────
function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status];
  return (
    <span className={`font-mono inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wide border ${cfg.cls}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
}

function KategoriBadge({ kategori }) {
  const cfg = KATEGORI_CONFIG[kategori];
  return (
    <span className={`font-mono inline-block px-2 py-0.5 rounded-md text-[10px] font-semibold uppercase tracking-wide border ${cfg.cls}`}>
      {cfg.label}
    </span>
  );
}

// Ledger-strip stat card — same anatomy as the Dashboard Mahasiswa stats row:
// mono icon+label eyebrow, big Fraunces number, quiet subtext, dashed divider.
function StatCell({ label, value, suffix, sub, icon, accent, last }) {
  return (
    <div
      className={[
        "px-6 py-5 flex flex-col gap-2 transition-colors duration-150 hover:bg-slate-50",
        "border-r border-dashed border-slate-200",
        last ? "sm:border-r-0" : "",
        "max-[700px]:border-r-0 max-[700px]:border-b max-[700px]:border-dashed",
      ].join(" ")}
    >
      <div className="flex items-center gap-1.5">
        <Icon name={icon} className="w-3.5 h-3.5" stroke={accent} />
        <span className="font-mono text-[10px] uppercase tracking-[0.14em] font-semibold" style={{ color: accent }}>
          {label}
        </span>
      </div>
      <div className="flex items-end gap-1">
        <span className="font-display text-[30px] font-semibold leading-none tracking-tight text-slate-800">{value}</span>
        {suffix && <span className="text-[12px] text-slate-400 font-medium mb-1">{suffix}</span>}
      </div>
      <span className="text-[11px] text-slate-400">{sub}</span>
    </div>
  );
}

function DetailModal({ mk, onClose }) {
  if (!mk) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/30 backdrop-blur-sm px-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-xl w-full max-w-md border border-slate-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-dashed border-slate-200">
          <h2 className="font-display text-[17px] font-semibold text-slate-800">Detail mata kuliah</h2>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-400 transition-colors"
          >
            <Icon name="close" className="w-3 h-3" />
          </button>
        </div>
        <div className="px-5 py-4 space-y-0">
          {[
            { label: "Kode MK",          value: <span className="font-mono text-[12px]">{mk.kode}</span> },
            { label: "Nama mata kuliah", value: mk.nama },
            { label: "Jumlah SKS",       value: `${mk.sks} SKS` },
            { label: "Kategori",         value: <KategoriBadge kategori={mk.kategori} /> },
            { label: "Status",           value: <StatusBadge status={mk.status} /> },
          ].map((row) => (
            <div key={row.label} className="flex justify-between items-center py-2.5 border-b border-dashed border-slate-100 last:border-0">
              <span className="font-mono text-[10.5px] uppercase tracking-wide text-slate-400">{row.label}</span>
              <span className="text-[13px] font-semibold text-slate-800 text-right max-w-[60%]">{row.value}</span>
            </div>
          ))}

          {mk.cpmk && mk.cpmk.length > 0 && (
            <div className="py-2.5 border-b border-dashed border-slate-100">
              <p className="font-mono text-[10.5px] uppercase tracking-wide text-slate-400 mb-1.5">CPMK</p>
              <div className="flex flex-wrap gap-1.5">
                {mk.cpmk.map((c, i) => (
                  <span key={i} className="px-2 py-0.5 bg-[#0A66C2]/5 text-[#0958A8] border border-[#0A66C2]/20 rounded-md text-[11px] font-medium">
                    {c}
                  </span>
                ))}
              </div>
            </div>
          )}

          {mk.objektif && (
            <div className="py-2.5 border-b border-dashed border-slate-100">
              <p className="font-mono text-[10.5px] uppercase tracking-wide text-slate-400 mb-1.5">Objektif</p>
              <p className="text-[13px] text-slate-700 leading-relaxed bg-slate-50 rounded-xl px-3 py-2.5 border border-slate-100">
                {mk.objektif}
              </p>
            </div>
          )}

          <div className="pt-2">
            <p className="font-mono text-[10.5px] uppercase tracking-wide text-slate-400 mb-1.5">Keterangan</p>
            <p className="text-[13px] text-slate-700 leading-relaxed bg-slate-50 rounded-xl px-3 py-2.5 border border-slate-100">
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
  const inputCls = "w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-[13px] text-slate-800 outline-none focus:border-blue-400 focus:bg-white placeholder:text-slate-300 transition-colors";
  const labelCls = "block font-mono text-[10.5px] font-semibold uppercase tracking-wide text-slate-400 mb-1.5";

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
    <div className="flex flex-col gap-3.5">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={labelCls}>Kode mata kuliah</label>
          <input type="text" value={kode} onChange={(e) => setKode(e.target.value)} placeholder="Contoh: IF4099" className={inputCls} />
        </div>
        <div>
          <label className={labelCls}>Jumlah SKS</label>
          <input type="number" value={sks} onChange={(e) => setSks(e.target.value)} min={1} max={6} placeholder="1–6" className={inputCls} />
        </div>
      </div>

      <div>
        <label className={labelCls}>Nama mata kuliah</label>
        <input type="text" value={nama} onChange={(e) => setNama(e.target.value)} placeholder="Contoh: Keamanan Jaringan" className={inputCls} />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={labelCls}>Kategori</label>
          <select value={kategori} onChange={(e) => setKategori(e.target.value)} className={`${inputCls} appearance-none cursor-pointer`}>
            <option value="pilihan">Pilihan</option>
            <option value="wajib">Wajib</option>
          </select>
        </div>
        <div>
          <label className={labelCls}>Program studi asal</label>
          <input type="text" value={prodi} onChange={(e) => setProdi(e.target.value)} placeholder="Contoh: Teknik Informatika" className={inputCls} />
        </div>
      </div>

      <div>
        <label className={labelCls}>CPMK (Capaian Pembelajaran Mata Kuliah)</label>

        {cpmkList.length > 0 && (
          <div className="flex flex-col gap-1.5 mb-2">
            {cpmkList.map((c, i) => (
              <div key={i} className="flex items-center gap-2 px-3 py-1.5 bg-[#0A66C2]/5 border border-[#0A66C2]/20 rounded-xl">
                <span className="flex-1 text-[12px] text-[#0958A8] truncate">{c}</span>
                <button onClick={() => removeCPMK(i)} className="text-[#0A66C2] hover:text-rose-500 transition-colors flex-shrink-0">
                  <Icon name="close" className="w-3 h-3" />
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
            className={`flex-1 ${inputCls}`}
          />
          <button
            onClick={addCPMK}
            className="w-8 h-8 flex items-center justify-center rounded-xl bg-[#0A66C2] text-white hover:bg-[#0958A8] flex-shrink-0 transition-colors"
          >
            <Icon name="plus" className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div>
        <label className={labelCls}>Objektif / tujuan konversi</label>
        <textarea
          rows={3}
          value={objektif}
          onChange={(e) => setObjektif(e.target.value)}
          placeholder="Contoh: Mata kuliah ini mencakup materi yang relevan dengan pekerjaan saya di bidang keamanan siber selama magang, meliputi..."
          className={`${inputCls} resize-none py-2.5`}
        />
      </div>

      <button
        onClick={handleSubmit}
        disabled={!isValid}
        className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-[13px] font-semibold transition-all duration-150
          disabled:bg-slate-100 disabled:text-slate-300 disabled:cursor-not-allowed
          enabled:bg-[#0A66C2] enabled:text-white enabled:hover:bg-[#0958A8]"
      >
        <Icon name="send" className="w-3.5 h-3.5" />
        Ajukan Konversi
      </button>
    </div>
  );
}

// ─── Skeleton Loader ──────────────────────────────────────────────────────────
function SkeletonRow() {
  return (
    <tr className="border-b border-dashed border-slate-100">
      {[...Array(6)].map((_, i) => (
        <td key={i} className="px-5 py-3.5">
          <div className="h-4 bg-slate-100 rounded-lg animate-pulse" style={{ width: i === 1 ? "80%" : "50%" }} />
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
    <div className="font-sans bg-slate-50 min-h-screen">
      <style>{FONTS}</style>

      <Topbar
        icon={<Icon name="layers" className="w-4 h-4" />}
        title="Konversi SKS"
        subtitle="Pengajuan konversi kredit akademik"
        rightSlot={
          <button
            onClick={() => window.location.href = "/"}
            className="flex items-center gap-2 px-4 py-2 border border-[#0A66C2]/40 rounded-xl text-[#0A66C2] text-[12.5px] font-semibold bg-transparent transition-all duration-150 hover:bg-[#0958A8] hover:text-white hover:border-[#0A66C2] cursor-pointer"
          >
            <div className="w-6 h-6 rounded-lg bg-[#0A66C2]/10 border border-[#0A66C2]/20 flex items-center justify-center flex-shrink-0">
              <Icon name="home" className="w-3.5 h-3.5" />
            </div>
            Back to homepage
          </button>
        }
      />

      <div className="px-8 py-6 flex flex-col gap-5">

        {/* ── Not eligible banner ── */}
        {!eligible && message && (
          <div className="flex items-start gap-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-2xl px-5 py-4">
            <span className="mt-0.5 flex-shrink-0"><Icon name="alert" className="w-3.5 h-3.5" /></span>
            <p className="text-[13px] font-medium leading-relaxed">{message}</p>
          </div>
        )}

        {/* Stats — ledger strip, same anatomy as Dashboard Mahasiswa */}
        <div className="grid grid-cols-4 max-[900px]:grid-cols-1 bg-white border border-slate-200 rounded-2xl overflow-hidden">
          <StatCell label="Total Diajukan" value={totalSks} suffix=" SKS" sub={`${stats.jumlahPengajuan || 0} mata kuliah`} icon="clipboard" accent="#2563EB" />
          <StatCell label="Disetujui"      value={sksDisetujui} sub="SKS diakui"        icon="check" accent="#059669" />
          <StatCell label="Menunggu"       value={sksMenunggu}  sub="SKS dalam review"  icon="clock" accent="#D97706" />
          <StatCell label="Ditolak"        value={sksDitolak}   sub="SKS tidak diakui"  icon="alert" accent="#E11D48" last />
        </div>

        {/* Progress */}
        <div className="bg-white rounded-2xl border border-slate-200 px-6 py-5">
          <div className="flex items-center justify-between mb-2.5">
            <span className="font-display text-[15px] font-semibold text-slate-800">Progres konversi SKS</span>
            <span className="font-mono text-[11px] text-slate-400">{sksDisetujui} DARI {totalSks} SKS DISETUJUI</span>
          </div>
          <div className="h-2 bg-slate-100 rounded-full overflow-hidden flex">
            <div className="h-full bg-[#0A66C2] transition-all duration-500" style={{ width: `${progSet}%` }} />
            <div className="h-full bg-amber-400"                            style={{ width: `${progMng}%` }} />
            <div className="h-full bg-rose-300"                             style={{ width: `${progTol}%` }} />
          </div>
          <div className="flex items-center gap-5 mt-3">
            {[
              { color: "bg-[#0A66C2]",  label: "Disetujui" },
              { color: "bg-amber-400", label: "Menunggu" },
              { color: "bg-rose-300",  label: "Ditolak" },
            ].map((l) => (
              <div key={l.label} className="flex items-center gap-1.5">
                <span className={`w-2 h-2 rounded-sm ${l.color}`} />
                <span className="font-mono text-[10px] uppercase tracking-wide text-slate-400">{l.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Ajukan Konversi ── */}
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
          <div className="flex items-center gap-2.5 px-6 py-4 border-b border-dashed border-slate-200">
            <Icon name="plus" className="w-4 h-4 text-[#0A66C2]" />
            <span className="font-display text-[15px] font-semibold text-slate-800">Ajukan konversi mata kuliah</span>
          </div>

          <div className="px-6 py-5">
            {successMsg && (
              <div className="flex items-center gap-2.5 px-4 py-3 bg-emerald-50 border border-emerald-200 rounded-xl mb-4">
                <Icon name="check" className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-[13px] text-emerald-700 font-medium">{successMsg}</span>
              </div>
            )}

            {eligible ? (
              <ManualInputForm onSubmit={handleSubmitManual} />
            ) : (
              <p className="text-[13px] text-slate-400 py-2">
                Kamu belum bisa mengajukan konversi SKS karena belum mengkonfirmasi penerimaan magang atau belum mendapat dosen pembimbing.
              </p>
            )}
          </div>
        </div>

        {/* Status Pengajuan */}
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
          <div className="flex items-center gap-2.5 px-6 py-4 border-b border-dashed border-slate-200">
            <Icon name="list" className="w-4 h-4 text-[#0A66C2]" />
            <span className="font-display text-[15px] font-semibold text-slate-800">Status pengajuan konversi</span>
          </div>

          <div className="mx-6 mt-4 mb-3 flex items-start gap-2.5 px-4 py-3 bg-[#0A66C2]/5 rounded-xl border border-[#0A66C2]/20">
            <span className="text-[#0A66C2] mt-0.5 flex-shrink-0"><Icon name="info" className="w-3.5 h-3.5" /></span>
            <p className="text-[12px] text-[#0958A8] leading-relaxed">
              Konversi SKS diproses oleh koordinator program studi. Pastikan portofolio kegiatan magang Anda sudah lengkap sebelum mengajukan konversi.
            </p>
          </div>

          <div className="flex items-center gap-2 px-6 pb-3 flex-wrap">
            {filterTabs.map((f) => (
              <button
                key={f}
                onClick={() => setFilterStatus(f)}
                className={`font-mono px-3.5 py-1.5 rounded-lg text-[11px] font-semibold uppercase tracking-wide transition-colors duration-150
                  ${filterStatus === f
                    ? "bg-[#0A66C2] text-white"
                    : "bg-slate-50 border border-slate-200 text-slate-400 hover:text-[#0A66C2] hover:border-[#0A66C2]/40"
                  }`}
              >
                {f === "semua" ? "Semua" : f}
              </button>
            ))}
            <span className="ml-auto font-mono text-[10.5px] text-slate-400 tracking-wide">{tableRows.length} MATA KULIAH</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-[13px]">
              <thead>
                <tr className="border-y border-slate-200 bg-slate-50">
                  <th className="text-left px-6 py-3 font-mono text-[10px] font-semibold uppercase tracking-wider text-slate-400">Kode</th>
                  <th className="text-left px-5 py-3 font-mono text-[10px] font-semibold uppercase tracking-wider text-slate-400">Mata kuliah</th>
                  <th className="text-center px-4 py-3 font-mono text-[10px] font-semibold uppercase tracking-wider text-slate-400">SKS</th>
                  <th className="text-center px-4 py-3 font-mono text-[10px] font-semibold uppercase tracking-wider text-slate-400">Kategori</th>
                  <th className="text-center px-4 py-3 font-mono text-[10px] font-semibold uppercase tracking-wider text-slate-400">Status</th>
                  <th className="text-center px-4 py-3 font-mono text-[10px] font-semibold uppercase tracking-wider text-slate-400">Detail</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  [...Array(3)].map((_, i) => <SkeletonRow key={i} />)
                ) : tableRows.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-10 text-slate-300 text-[13px]">
                      Tidak ada data untuk filter ini.
                    </td>
                  </tr>
                ) : (
                  tableRows.map((mk, i) => (
                    <tr
                      key={mk.id}
                      className={`hover:bg-[#0A66C2]/5/40 transition-colors duration-100 ${i < tableRows.length - 1 ? "border-b border-dashed border-slate-100" : ""}`}
                    >
                      <td className="px-6 py-3.5">
                        <span className="font-mono text-[12px] text-slate-400">{mk.kode}</span>
                      </td>
                      <td className="px-5 py-3.5 font-medium text-slate-800">{mk.nama}</td>
                      <td className="px-4 py-3.5 text-center">
                        <span className="font-mono inline-flex items-center justify-center w-7 h-7 rounded-lg bg-[#0A66C2]/5 text-[#0958A8] text-[12px] font-semibold">
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
                          className="text-[12px] text-[#0A66C2] hover:text-[#0958A8] hover:underline font-semibold"
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