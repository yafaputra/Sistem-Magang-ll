"use client";

import { useState, useMemo, useEffect } from "react";
import Topbar from "../../components/topbar";

/* ── Helpers ── */
function initials(name) {
  return name.split(" ").slice(0, 2).map((w) => w[0] ?? "").join("").toUpperCase();
}

const avatarStyle = {
  pending:  "bg-[#FAEEDA] text-[#854F0B]",
  review:   "bg-[#dbeafe] text-[#2563eb]",
  approved: "bg-[#E1F5EE] text-[#0F6E56]",
  rejected: "bg-[#FCEBEB] text-[#A32D2D]",
};

const statusConfig = {
  pending:  { label: "Menunggu",  cls: "bg-[#FAEEDA] text-[#854F0B]"  },
  review:   { label: "Direview",  cls: "bg-[#dbeafe] text-[#2563eb]"  },
  approved: { label: "Disetujui", cls: "bg-[#E1F5EE] text-[#0F6E56]"  },
  rejected: { label: "Ditolak",   cls: "bg-[#FCEBEB] text-[#A32D2D]"  },
};

const TABS = [
  { key: "semua",    label: "Semua"           },
  { key: "pending",  label: "Menunggu"        },
  { key: "review",   label: "Sedang Direview" },
  { key: "approved", label: "Disetujui"       },
  { key: "rejected", label: "Ditolak"         },
];

/* ── Badge ── */
function StatusBadge({ status }) {
  const { label, cls } = statusConfig[status];
  return (
    <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full flex-shrink-0 ${cls}`}>
      {label}
    </span>
  );
}

/* ── Stat Card ── */
function StatCard({ label, value, valueClass, icon, iconBg, iconBorder, iconColor }) {
  return (
    <div className="bg-white border border-[#e8e8f0] rounded-xl p-4 flex items-center justify-between">
      <div>
        <div className="text-[11px] text-[#9898b0] font-medium mb-1">{label}</div>
        <div className={`text-[24px] font-semibold ${valueClass}`}>{value}</div>
      </div>
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 border ${iconBg} ${iconBorder} ${iconColor}`}>
        {icon}
      </div>
    </div>
  );
}

/* ── Confirm Modal ── */
function ConfirmModal({ show, onClose, onConfirm, type, nama }) {
  if (!show) return null;
  const isApprove = type === "approve";
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#1e1e2e]/30 backdrop-blur-[2px]"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-xl w-[380px] max-w-[95vw] px-6 py-5"
        onClick={(e) => e.stopPropagation()}
      >
        <div className={`w-[42px] h-[42px] rounded-xl flex items-center justify-center mb-3 ${isApprove ? "bg-[#E1F5EE]" : "bg-[#fff1f0]"}`}>
          {isApprove ? (
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="#0F6E56" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
          ) : (
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          )}
        </div>
        <div className="text-[15px] font-bold text-[#1e1e2e] mb-1">
          {isApprove ? "Setujui Pendaftaran?" : "Tolak Pendaftaran?"}
        </div>
        <div className="text-[12.5px] text-[#9898b0] leading-relaxed mb-5">
          {isApprove
            ? <>Perusahaan <strong className="text-[#1e1e2e]">{nama}</strong> akan disetujui dan admin akan mendapat notifikasi.</>
            : <>Perusahaan <strong className="text-[#1e1e2e]">{nama}</strong> akan ditolak. Tindakan ini tidak bisa dibatalkan.</>
          }
        </div>
        <div className="flex gap-2.5">
          <button
            onClick={onClose}
            className="flex-1 py-2 border border-[#e8e8f0] rounded-lg text-[13px] font-medium text-[#555] hover:bg-[#f5f5fb] transition-colors"
          >
            Batal
          </button>
          <button
            onClick={onConfirm}
            className={`flex-1 py-2 text-white text-[13px] font-semibold rounded-lg transition-colors ${
              isApprove ? "bg-[#1D9E75] hover:bg-[#0F6E56]" : "bg-[#ef4444] hover:bg-[#dc2626]"
            }`}
          >
            {isApprove ? "Ya, Setujui" : "Ya, Tolak"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════
   MAIN PAGE
══════════════════════════════════════════ */
export default function ValidasiPerusahaanPage() {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("semua");
  const [search, setSearch] = useState("");
  const [expandedId, setExpandedId] = useState(null);
  const [modal, setModal] = useState(null);

  /* ── Fetch data dari backend ── */
  const fetchPerusahaan = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const response = await fetch(`${API_URL}/api/verifikasi-perusahaan`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.json();

      if (!response.ok) {
        alert(result.message || "Gagal mengambil data perusahaan");
        return;
      }

      const mappedData = result.data.map((item) => ({
        id: item.id,
        nama: item.nama || "-",
        email: item.user?.email || "-",
        bidang: item.bidang || "-",
        telepon: item.telepon || "-",
        website: item.website || "-",
        namaCP: item.namaCP || item.user?.name || "-",
        jabatanCP: item.jabatanCP || "-",
        tanggal: new Date(item.createdAt).toLocaleDateString("id-ID", {
          year: "numeric",
          month: "short",
          day: "numeric",
        }),
        status:
          item.statusVerifikasi === "DITERIMA"
            ? "approved"
            : item.statusVerifikasi === "DITOLAK"
            ? "rejected"
            : "pending",
      }));

      setRecords(mappedData);
    } catch (error) {
      console.error(error);
      alert("Tidak bisa terhubung ke server");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPerusahaan();
  }, []);

  /* ── Derived ── */
  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return records.filter((r) => {
      const matchTab = activeTab === "semua" || r.status === activeTab;
      const matchQ =
        r.nama.toLowerCase().includes(q) ||
        r.email.toLowerCase().includes(q) ||
        r.bidang.toLowerCase().includes(q);
      return matchTab && matchQ;
    });
  }, [records, search, activeTab]);

  const stats = {
    total:    records.length,
    pending:  records.filter((r) => r.status === "pending").length,
    approved: records.filter((r) => r.status === "approved").length,
    rejected: records.filter((r) => r.status === "rejected").length,
  };

  /* ── Handlers ── */
  async function changeStatus(id, newStatus) {
    try {
      const token = localStorage.getItem("token");

      const statusVerifikasi =
        newStatus === "approved" ? "DITERIMA" : "DITOLAK";

      const response = await fetch(
        `${API_URL}/api/verifikasi-perusahaan/${id}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            statusVerifikasi,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        alert(result.message || "Gagal mengubah status perusahaan");
        return;
      }

      await fetchPerusahaan();
      setExpandedId(null);
      setModal(null);
    } catch (error) {
      console.error(error);
      alert("Tidak bisa terhubung ke server");
    }
  }

  function openModal(type, id, e) {
    e.stopPropagation();
    setModal({ type, id });
  }

  const modalTarget = records.find((r) => r.id === modal?.id);

  return (
    <>
      <div className="flex-1 bg-[#f5f5fb] min-h-screen font-sans">

        {/* ── Top Bar ── */}
        <Topbar
          icon={
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 11l3 3L22 4" />
              <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
            </svg>
          }
          title="Validasi Perusahaan"
          subtitle="Kelola dan validasi pendaftaran perusahaan"
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

        <div className="px-7 py-6 flex flex-col gap-5">

          {/* ── Stat Cards ── */}
          {/* ── Stat Cards ── */}
          <div className="grid grid-cols-4 gap-4">
            <StatCard
              label="Total Masuk"
              value={stats.total}
              valueClass="text-[#1e1e2e]"
              iconBg="bg-[#eef2ff]"
              iconBorder="border-[#c7d2fe]"
              iconColor="text-[#4f46e5]"
              icon={
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              }
            />
            <StatCard
              label="Menunggu"
              value={stats.pending}
              valueClass="text-[#854F0B]"
              iconBg="bg-[#FAEEDA]"
              iconBorder="border-[#F3D9A4]"
              iconColor="text-[#854F0B]"
              icon={
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="9" />
                  <polyline points="12 7 12 12 15 15" />
                </svg>
              }
            />
            <StatCard
              label="Disetujui"
              value={stats.approved}
              valueClass="text-[#0F6E56]"
              iconBg="bg-[#E1F5EE]"
              iconBorder="border-[#9FE1CB]"
              iconColor="text-[#0F6E56]"
              icon={
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
              }
            />
            <StatCard
              label="Ditolak"
              value={stats.rejected}
              valueClass="text-[#A32D2D]"
              iconBg="bg-[#FCEBEB]"
              iconBorder="border-[#F7C1C1]"
              iconColor="text-[#A32D2D]"
              icon={
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="9" />
                  <line x1="15" y1="9" x2="9" y2="15" />
                  <line x1="9" y1="9" x2="15" y2="15" />
                </svg>
              }
            />
          </div>

          {/* ── Table Card ── */}
          <div className="bg-white border border-[#e8e8f0] rounded-xl overflow-hidden">

            {/* Toolbar */}
            <div className="px-5 py-3.5 border-b border-[#f0f0f8] flex flex-col gap-3">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-[13.5px] font-bold text-[#1e1e2e]">Daftar Perusahaan</span>
                  <span className="text-[11px] text-[#9898b0] bg-[#f5f5fb] px-2.5 py-0.5 rounded-full font-medium">
                    {filtered.length} data
                  </span>
                </div>
                {/* Search */}
                <div className="flex items-center gap-2 bg-[#f5f5fb] border border-[#eeeef6] focus-within:border-[#2563eb] focus-within:bg-white rounded-lg px-3 py-1.5 w-[260px] transition-colors">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#b0b0c8" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                  </svg>
                  <input
                    className="bg-transparent outline-none text-[12px] text-[#3a3a5c] placeholder:text-[#c4c4d8] w-full font-sans"
                    placeholder="Cari nama, email, atau bidang…"
                    value={search}
                    onChange={(e) => { setSearch(e.target.value); setExpandedId(null); }}
                  />
                </div>
              </div>

              {/* Tab bar */}
              <div className="flex gap-1 bg-[#f5f5fb] p-1 rounded-lg w-fit">
                {TABS.map((t) => (
                  <button
                    key={t.key}
                    onClick={() => { setActiveTab(t.key); setExpandedId(null); }}
                    className={`px-3 py-1 rounded-md text-[12px] font-medium transition-all ${
                      activeTab === t.key
                        ? "bg-white text-[#2563eb] shadow-sm border border-[#e8e8f0]"
                        : "text-[#9898b0] hover:text-[#2563eb]"
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Table */}
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  {["Perusahaan", "Kontak", "Bidang", "Tgl Daftar", "Status", "Aksi"].map((h) => (
                    <th
                      key={h}
                      className="text-left text-[10.5px] font-bold tracking-[0.07em] uppercase text-[#b0b0c8] px-4 py-3 bg-[#fafafe] border-b border-[#f0f0f8]"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={6} className="text-center py-12 text-[13px] text-[#b0b0c8]">
                      Memuat data...
                    </td>
                  </tr>
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-12 text-[13px] text-[#b0b0c8]">
                      Tidak ada data ditemukan.
                    </td>
                  </tr>
                ) : (
                  filtered.map((r) => {
                    const isExpanded = expandedId === r.id;
                    const canAct = r.status === "pending" || r.status === "review";
                    return (
                      <>
                        {/* ── Main Row ── */}
                        <tr
                          key={r.id}
                          className="group hover:bg-[#fafafe] transition-colors cursor-pointer"
                          onClick={() => setExpandedId(isExpanded ? null : r.id)}
                        >
                          {/* Perusahaan */}
                          <td className="px-4 py-3 border-b border-[#f8f8fc]">
                            <div className="flex items-center gap-2.5">
                              <div className={`w-[34px] h-[34px] rounded-full flex items-center justify-center text-[11.5px] font-bold flex-shrink-0 ${avatarStyle[r.status]}`}>
                                {initials(r.nama)}
                              </div>
                              <div>
                                <div className="text-[13px] font-semibold text-[#1e1e2e]">{r.nama}</div>
                                <div className="text-[11px] text-[#9898b0]">{r.website}</div>
                              </div>
                            </div>
                          </td>
                          {/* Kontak */}
                          <td className="px-4 py-3 border-b border-[#f8f8fc]">
                            <div className="text-[13px] font-semibold text-[#1e1e2e]">{r.namaCP}</div>
                            <div className="text-[11px] text-[#9898b0] mt-0.5">{r.email}</div>
                          </td>
                          {/* Bidang */}
                          <td className="px-4 py-3 border-b border-[#f8f8fc] text-[12px] text-[#1e1e2e]">
                            {r.bidang}
                          </td>
                          {/* Tanggal */}
                          <td className="px-4 py-3 border-b border-[#f8f8fc] text-[12px] text-[#9898b0]">
                            {r.tanggal}
                          </td>
                          {/* Status */}
                          <td className="px-4 py-3 border-b border-[#f8f8fc]">
                            <StatusBadge status={r.status} />
                          </td>
                          {/* Aksi */}
                          <td className="px-4 py-3 border-b border-[#f8f8fc]">
                            <div className="flex gap-1.5 items-center">
                              {canAct && (
                                <>
                                  <button
                                    onClick={(e) => openModal("approve", r.id, e)}
                                    className="flex items-center gap-1 px-3 py-1.5 bg-[#E1F5EE] text-[#0F6E56] border border-[#9FE1CB] rounded-lg text-[11.5px] font-semibold hover:bg-[#9FE1CB] transition-colors"
                                  >
                                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                      <polyline points="20 6 9 17 4 12"/>
                                    </svg>
                                    Setujui
                                  </button>
                                  <button
                                    onClick={(e) => openModal("reject", r.id, e)}
                                    className="flex items-center gap-1 px-3 py-1.5 bg-[#FCEBEB] text-[#A32D2D] border border-[#F7C1C1] rounded-lg text-[11.5px] font-semibold hover:bg-[#F7C1C1] transition-colors"
                                  >
                                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                      <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                                    </svg>
                                    Tolak
                                  </button>
                                </>
                              )}
                              {/* Expand chevron */}
                              <button
                                onClick={(e) => { e.stopPropagation(); setExpandedId(isExpanded ? null : r.id); }}
                                className="w-[28px] h-[28px] rounded-lg border border-[#e8e8f0] bg-white flex items-center justify-center text-[#9898b0] hover:bg-[#f5f5fb] transition-colors ml-auto"
                              >
                                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                  {isExpanded
                                    ? <polyline points="18 15 12 9 6 15"/>
                                    : <polyline points="6 9 12 15 18 9"/>
                                  }
                                </svg>
                              </button>
                            </div>
                          </td>
                        </tr>

                        {/* ── Detail Row ── */}
                        {isExpanded && (
                          <tr key={`${r.id}-detail`}>
                            <td colSpan={6} className="border-b border-[#f8f8fc] bg-[#fafafe] px-6 py-4">
                              <div className="grid grid-cols-3 gap-4">
                                {[
                                  { label: "ID Perusahaan", value: r.id },
                                  { label: "Nama Perusahaan", value: r.nama },
                                  { label: "Email", value: r.email },
                                  { label: "Bidang Industri", value: r.bidang },
                                  { label: "Telepon", value: r.telepon },
                                  { label: "Website", value: r.website },
                                  { label: "Nama CP", value: r.namaCP },
                                  { label: "Jabatan CP", value: r.jabatanCP },
                                  { label: "Tanggal Daftar", value: r.tanggal },
                                ].map(({ label, value }) => (
                                  <div key={label}>
                                    <div className="text-[10.5px] font-bold uppercase tracking-widest text-[#b0b0c8] mb-0.5">{label}</div>
                                    <div className="text-[13px] font-medium text-[#1e1e2e]">{value}</div>
                                  </div>
                                ))}
                              </div>
                              {canAct && (
                                <div className="flex gap-2 mt-4 pt-4 border-t border-[#ebebf4]">
                                  <button
                                    onClick={(e) => openModal("approve", r.id, e)}
                                    className="flex items-center gap-1.5 px-4 py-2 bg-[#E1F5EE] text-[#0F6E56] border border-[#9FE1CB] rounded-lg text-[12px] font-semibold hover:bg-[#9FE1CB] transition-colors"
                                  >
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                      <polyline points="20 6 9 17 4 12"/>
                                    </svg>
                                    Setujui Pendaftaran
                                  </button>
                                  <button
                                    onClick={(e) => openModal("reject", r.id, e)}
                                    className="flex items-center gap-1.5 px-4 py-2 bg-[#FCEBEB] text-[#A32D2D] border border-[#F7C1C1] rounded-lg text-[12px] font-semibold hover:bg-[#F7C1C1] transition-colors"
                                  >
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                      <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                                    </svg>
                                    Tolak Pendaftaran
                                  </button>
                                </div>
                              )}
                            </td>
                          </tr>
                        )}
                      </>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ── Confirm Modal ── */}
      <ConfirmModal
        show={!!modal}
        type={modal?.type}
        nama={modalTarget?.nama}
        onClose={() => setModal(null)}
        onConfirm={() => changeStatus(modal.id, modal.type === "approve" ? "approved" : "rejected")}
      />
    </>
  );
}