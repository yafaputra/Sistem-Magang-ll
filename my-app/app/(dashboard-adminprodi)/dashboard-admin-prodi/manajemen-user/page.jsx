"use client";

import { useEffect, useState } from "react";

const PAGE_SIZE = 8;

/* ── Fonts — konsisten dengan Kelola Lowongan & Daftar Pelamar ── */
const FONTS = `
@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600;9..144,700&family=IBM+Plex+Mono:wght@400;500;600&display=swap');
.font-display { font-family: 'Fraunces', 'Georgia', serif; }
.font-mono { font-family: 'IBM Plex Mono', 'Courier New', monospace; }
`;

/* ── Icon Component (gaya sama dengan dashboard lain) ── */
function Icon({ name, className = "w-5 h-5", stroke = "currentColor" }) {
  const paths = {
    users:    <><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></>,
    home:     <><path d="M3 9.5L12 3l9 6.5"/><path d="M5 9v11a1 1 0 0 0 1 1h3v-7h6v7h3a1 1 0 0 0 1-1V9"/></>,
    search:   <><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></>,
    edit:     <><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></>,
    trash:    <><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></>,
    x:        <><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>,
    "chev-left":  <><polyline points="15 18 9 12 15 6"/></>,
    "chev-right": <><polyline points="9 18 15 12 9 6"/></>,
  };
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      {paths[name]}
    </svg>
  );
}

/* ── Helpers ── */
function initials(name) {
  return name.split(" ").slice(0, 2).map((w) => w[0] ?? "").join("").toUpperCase();
}

function formatRole(role) {
  if (!role) return "-";
  return role.charAt(0).toUpperCase() + role.slice(1);
}

function roleToBackend(role) {
  return role.toLowerCase();
}

/* ── Warna TIDAK diubah, tetap sama persis seperti sebelumnya ── */
const roleStyle = {
  Admin:      "bg-blue-50 text-blue-700 border-blue-200",
  Dosen:      "bg-emerald-50 text-emerald-700 border-emerald-200",
  Mahasiswa:  "bg-amber-50 text-amber-700 border-amber-200",
  Perusahaan: "bg-violet-50 text-violet-700 border-violet-200",
};

const avatarStyle = {
  Admin:      "bg-blue-50 text-blue-600 border-blue-200",
  Dosen:      "bg-emerald-50 text-emerald-600 border-emerald-200",
  Mahasiswa:  "bg-amber-50 text-amber-600 border-amber-200",
  Perusahaan: "bg-violet-50 text-violet-600 border-violet-200",
};

const statCardStyle = {
  total:      { iconBg: "bg-blue-50",    iconBorder: "border-blue-200",    iconColor: "text-blue-600",    valueClass: "text-slate-800" },
  mahasiswa:  { iconBg: "bg-amber-50",   iconBorder: "border-amber-200",   iconColor: "text-amber-600",   valueClass: "text-amber-600" },
  dosen:      { iconBg: "bg-emerald-50", iconBorder: "border-emerald-200", iconColor: "text-emerald-600", valueClass: "text-emerald-600" },
  admin:      { iconBg: "bg-blue-50",    iconBorder: "border-blue-200",    iconColor: "text-blue-600",    valueClass: "text-blue-600" },
  perusahaan: { iconBg: "bg-violet-50",  iconBorder: "border-violet-200",  iconColor: "text-violet-600",  valueClass: "text-violet-600" },
};

const statusStyle = {
  Aktif:    { dot: "bg-emerald-500", label: "text-emerald-600" },
  Magang:   { dot: "bg-blue-500",    label: "text-blue-600" },
  Pending:  { dot: "bg-amber-500",   label: "text-amber-600" },
  Nonaktif: { dot: "bg-rose-500",    label: "text-rose-600" },
};

const emptyForm = { nama: "", username: "", email: "", role: "Mahasiswa", status: "Aktif", password: "" };

/* ── Stat Card — versi "ledger" seperti Kelola Lowongan, warna tetap sama ── */
function StatCard({ label, value, sub, icon, styleKey, loading, isLast }) {
  const st = statCardStyle[styleKey] ?? statCardStyle.total;
  return (
    <div
      className={`px-6 py-5 flex flex-col gap-2 transition-colors duration-150 hover:bg-slate-50 border-r border-dashed border-slate-200 ${isLast ? "border-r-0" : ""}`}
    >
      <div className="flex items-center gap-1.5">
        <span className={st.iconColor}><Icon name={icon} className="w-4 h-4" /></span>
        <span className={`font-mono text-[10px] uppercase tracking-[0.14em] font-semibold ${st.iconColor}`}>{label}</span>
      </div>
      {loading
        ? <div className="h-8 w-10 bg-slate-100 rounded animate-pulse" />
        : <span className={`font-display text-[30px] font-semibold leading-none tracking-tight ${st.valueClass}`}>{value}</span>}
      <span className="text-[11px] text-slate-400">{sub}</span>
    </div>
  );
}

/* ── Modal wrapper ── */
function Modal({ show, onClose, children }) {
  if (!show) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-800/30 backdrop-blur-[2px]"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-xl border border-slate-200 animate-[pop_0.15s_ease] w-[400px] max-w-[95vw]"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}

/* ── Input helper ── */
function Field({ label, children }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-[11.5px] font-medium text-slate-500">{label}</label>
      {children}
    </div>
  );
}

const inputCls = "w-full px-3 py-[7px] text-[12.5px] border border-slate-200 rounded-lg outline-none focus:border-blue-500 font-sans text-slate-800 bg-white";

/* ══════════════════════════════════════════
   MAIN PAGE
══════════════════════════════════════════ */
export default function ManajemenUserPage() {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    mahasiswa: 0,
    dosen: 0,
    admin: 0,
    perusahaan: 0,
  });

  const [search, setSearch]         = useState("");
  const [filterRole, setFilterRole] = useState("Semua");
  const [page, setPage]             = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading]       = useState(false);

  /* Modal states */
  const [showForm, setShowForm]     = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [editId, setEditId]         = useState(null);
  const [deleteId, setDeleteId]     = useState(null);
  const [form, setForm]             = useState(emptyForm);

  /* ── Fetch users from API ── */
  const fetchUsers = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const res = await fetch(
        `${API_URL}/api/users?search=${search}&role=${filterRole}&page=${page}&limit=${PAGE_SIZE}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const result = await res.json();

      if (!res.ok) {
        alert(result.message || "Gagal mengambil user");
        return;
      }

      const mappedUsers = result.data.map((u) => ({
        id: u.id,
        nama: u.name,
        username: u.username || "-",
        email: u.email,
        role: formatRole(u.role),
        status: u.status || "Aktif",
        lastLogin: u.lastLogin ? new Date(u.lastLogin).toLocaleString("id-ID") : "-",
      }));

      setUsers(mappedUsers);
      setStats(result.stats);
      setTotalPages(result.meta.totalPages);
    } catch (error) {
      alert("Tidak bisa terhubung ke server");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [search, filterRole, page]);

  /* ── Derived data (from API, pagination handled server-side) ── */
  const filtered  = users;
  const paginated = users;
  const safePage  = page;

  /* ── Pagination helper ── */
  function pageNums() {
    if (totalPages <= 5) return Array.from({ length: totalPages }, (_, i) => i + 1);
    if (safePage <= 3)  return [1, 2, 3, "…", totalPages];
    if (safePage >= totalPages - 2) return [1, "…", totalPages - 2, totalPages - 1, totalPages];
    return [1, "…", safePage - 1, safePage, safePage + 1, "…", totalPages];
  }

  /* ── Handlers ── */
  function openAdd() {
    setEditId(null);
    setForm(emptyForm);
    setShowForm(true);
  }

  function openEdit(u) {
    setEditId(u.id);
    setForm({ nama: u.nama, username: u.username, email: u.email, role: u.role, status: u.status, password: "" });
    setShowForm(true);
  }

  async function saveUser() {
    if (!form.nama.trim() || !form.username.trim() || !form.email.trim()) {
      alert("Nama, username, dan email wajib diisi");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      const payload = {
        name: form.nama,
        username: form.username,
        email: form.email,
        role: roleToBackend(form.role),
        status: form.status,
      };

      if (!editId) {
        payload.password = form.password;
      }

      const res = await fetch(
        editId ? `${API_URL}/api/users/${editId}` : `${API_URL}/api/users`,
        {
          method: editId ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      const result = await res.json();

      if (!res.ok) {
        alert(result.message || "Gagal menyimpan user");
        return;
      }

      alert(result.message);
      setShowForm(false);
      fetchUsers();
    } catch (error) {
      alert("Tidak bisa terhubung ke server");
    }
  }

  function openDelete(id) {
    setDeleteId(id);
    setShowDelete(true);
  }

  async function confirmDelete() {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`${API_URL}/api/users/${deleteId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await res.json();

      if (!res.ok) {
        alert(result.message || "Gagal menghapus user");
        return;
      }

      alert(result.message);
      setShowDelete(false);
      setDeleteId(null);
      fetchUsers();
    } catch (error) {
      alert("Tidak bisa terhubung ke server");
    }
  }

  const deleteTarget = users.find((u) => u.id === deleteId);

  /* ── Role filter tabs ── */
  const roleTabs = ["Semua", "Mahasiswa", "Dosen", "Admin", "Perusahaan"];

  function changeRole(r) {
    setFilterRole(r);
    setPage(1);
  }

  return (
    <>
      <style>{FONTS}</style>
      <style>{`@keyframes pop{from{transform:scale(.94);opacity:0}to{transform:scale(1);opacity:1}}`}</style>

      <div className="flex-1 bg-slate-50 min-h-screen font-sans">

        {/* ── Top bar ── */}
        <div className="flex items-center justify-between px-8 py-4 bg-white border-b border-slate-200">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center flex-shrink-0">
              <Icon name="users" className="w-4.5 h-4.5" />
            </div>
            <div>
              <div className="text-[18px] font-bold text-slate-800 tracking-tight leading-snug font-display">Manajemen User</div>
              <div className="text-[11.5px] text-slate-400 mt-0.5">Kelola akun mahasiswa, dosen, dan admin sistem</div>
            </div>
          </div>

          <button className="flex items-center gap-2 px-4 py-2 border border-blue-300 rounded-xl text-blue-600 text-[12.5px] font-semibold bg-transparent transition-all duration-150 hover:bg-blue-500 hover:text-white hover:border-blue-500 cursor-pointer">
            <div className="w-6 h-6 rounded-lg bg-blue-100 border border-blue-200 flex items-center justify-center flex-shrink-0">
              <Icon name="home" className="w-3.5 h-3.5" />
            </div>
            Back to homepage
          </button>
        </div>

        <div className="px-8 py-6 flex flex-col gap-5">

          {/* ── Stat strip — model "ledger", warna per-role tetap sama ── */}
          <div className="grid grid-cols-5 max-[900px]:grid-cols-2 bg-white border border-slate-200 rounded-2xl overflow-hidden">
            <StatCard label="Total User"  value={stats.total}      sub="Semua role"        icon="users" styleKey="total"      loading={loading} />
            <StatCard label="Mahasiswa"   value={stats.mahasiswa}  sub="Terdaftar"         icon="users" styleKey="mahasiswa"  loading={loading} />
            <StatCard label="Dosen"       value={stats.dosen}      sub="Aktif mengajar"    icon="users" styleKey="dosen"      loading={loading} />
            <StatCard label="Admin"       value={stats.admin}      sub="Pengelola sistem"  icon="users" styleKey="admin"      loading={loading} />
            <StatCard label="Perusahaan"  value={stats.perusahaan} sub="Mitra magang"      icon="users" styleKey="perusahaan" loading={loading} isLast />
          </div>

          {/* ── Table card ── */}
          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">

            {/* Toolbar */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 gap-3">
              <div className="flex items-center gap-2.5">
                <span className="text-[14px] font-bold text-slate-800 font-display">Daftar User</span>
                <span className="text-[11px] text-slate-400 bg-slate-100 px-2.5 py-0.5 rounded-full font-medium font-mono">
                  {stats.total} user
                </span>
              </div>
              <div className="flex items-center gap-2">
                {/* Role tabs */}
                <div className="flex gap-1 bg-slate-100 p-1 rounded-lg">
                  {roleTabs.map((r) => (
                    <button
                      key={r}
                      onClick={() => changeRole(r)}
                      className={`px-3 py-1 rounded-md text-[12px] font-medium transition-all cursor-pointer ${
                        filterRole === r
                          ? "bg-white text-blue-600 shadow-sm border border-slate-200"
                          : "text-slate-400 hover:text-blue-600"
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
                {/* Search */}
                <div className="flex items-center gap-2 bg-slate-100 border border-slate-100 focus-within:border-blue-300 focus-within:bg-white rounded-lg px-3 py-1.5 w-[220px] transition-colors">
                  <Icon name="search" className="w-3 h-3 text-slate-400 flex-shrink-0" stroke="currentColor" />
                  <input
                    className="bg-transparent outline-none text-[12px] text-slate-700 placeholder:text-slate-300 w-full font-sans"
                    placeholder="Cari nama, email, username…"
                    value={search}
                    onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                  />
                </div>
              </div>
            </div>

            {/* Table */}
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  {["User", "Username", "Role", "Status", "Terakhir Login", "Aksi"].map((h) => (
                    <th key={h} className="text-left text-[10.5px] font-bold tracking-[0.07em] uppercase text-slate-400 px-4 py-3 bg-slate-50 border-b border-slate-100 font-mono">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={6} className="text-center py-12 text-[13px] text-slate-400">
                      Memuat data…
                    </td>
                  </tr>
                ) : paginated.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-12 text-[13px] text-slate-400">
                      Tidak ada user ditemukan.
                    </td>
                  </tr>
                ) : (
                  paginated.map((u) => {
                    const ss = statusStyle[u.status] ?? { dot: "bg-slate-400", label: "text-slate-400" };
                    return (
                      <tr key={u.id} className="group hover:bg-slate-50 transition-colors">
                        {/* User */}
                        <td className="px-4 py-3 border-b border-slate-50">
                          <div className="flex items-center gap-2.5">
                            <div className={`w-9 h-9 rounded-xl border flex items-center justify-center text-[11.5px] font-bold flex-shrink-0 ${avatarStyle[u.role] ?? "bg-slate-50 text-slate-400 border-slate-200"}`}>
                              {initials(u.nama)}
                            </div>
                            <div>
                              <div className="text-[13px] font-semibold text-slate-800">{u.nama}</div>
                              <div className="text-[11px] text-slate-400">{u.email}</div>
                            </div>
                          </div>
                        </td>
                        {/* Username */}
                        <td className="px-4 py-3 border-b border-slate-50 text-[12px] text-slate-400 font-mono">
                          @{u.username}
                        </td>
                        {/* Role */}
                        <td className="px-4 py-3 border-b border-slate-50">
                          <span className={`inline-block px-2.5 py-0.5 rounded-full text-[11.5px] font-bold border ${roleStyle[u.role] ?? "bg-slate-50 text-slate-500 border-slate-200"}`}>
                            {u.role}
                          </span>
                        </td>
                        {/* Status */}
                        <td className="px-4 py-3 border-b border-slate-50">
                          <div className="flex items-center gap-1.5">
                            <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${ss.dot}`} />
                            <span className={`text-[12.5px] font-medium ${ss.label}`}>{u.status}</span>
                          </div>
                        </td>
                        {/* Last login */}
                        <td className="px-4 py-3 border-b border-slate-50 text-[12px] text-slate-400 font-mono">
                          {u.lastLogin}
                        </td>
                        {/* Actions */}
                        <td className="px-4 py-3 border-b border-slate-50">
                          <div className="flex gap-1.5">
                            <button
                              onClick={() => openEdit(u)}
                              className="w-8 h-8 rounded-lg border border-slate-200 bg-white flex items-center justify-center text-slate-400 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-all cursor-pointer"
                              title="Edit"
                            >
                              <Icon name="edit" className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => openDelete(u.id)}
                              className="w-8 h-8 rounded-lg border border-slate-200 bg-white flex items-center justify-center text-slate-400 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 transition-all cursor-pointer"
                              title="Hapus"
                            >
                              <Icon name="trash" className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-6 py-3.5 border-t border-slate-100">
                <span className="text-[12px] text-slate-400 font-mono">
                  Halaman {safePage} dari {totalPages}
                </span>
                <div className="flex gap-1.5 items-center">
                  <button
                    className="w-8 h-8 rounded-lg border border-slate-200 bg-white flex items-center justify-center text-slate-400 hover:border-blue-200 hover:text-blue-600 disabled:opacity-40 disabled:cursor-default transition-all cursor-pointer"
                    disabled={safePage === 1}
                    onClick={() => setPage(safePage - 1)}
                  >
                    <Icon name="chev-left" className="w-3 h-3" stroke="currentColor" />
                  </button>
                  {pageNums().map((n, i) =>
                    n === "…" ? (
                      <span key={`d${i}`} className="w-8 text-center text-[12px] text-slate-300">…</span>
                    ) : (
                      <button
                        key={n}
                        onClick={() => setPage(n)}
                        className={`w-8 h-8 rounded-lg border text-[12.5px] font-medium transition-all cursor-pointer ${
                          safePage === n
                            ? "bg-blue-500 text-white border-blue-500 font-bold"
                            : "border-slate-200 bg-white text-slate-500 hover:border-blue-200 hover:text-blue-600"
                        }`}
                      >
                        {n}
                      </button>
                    )
                  )}
                  <button
                    className="w-8 h-8 rounded-lg border border-slate-200 bg-white flex items-center justify-center text-slate-400 hover:border-blue-200 hover:text-blue-600 disabled:opacity-40 disabled:cursor-default transition-all cursor-pointer"
                    disabled={safePage === totalPages}
                    onClick={() => setPage(safePage + 1)}
                  >
                    <Icon name="chev-right" className="w-3 h-3" stroke="currentColor" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ══ Modal: Add / Edit ══ */}
      <Modal show={showForm} onClose={() => setShowForm(false)}>
        <div className="px-6 py-5">
          <div className="flex items-center justify-between mb-5">
            <div className="text-[15px] font-bold text-slate-800 font-display">
              {editId ? "Edit User" : "Tambah User Baru"}
            </div>
            <button
              onClick={() => setShowForm(false)}
              className="w-7 h-7 rounded-lg border border-slate-200 flex items-center justify-center text-slate-400 hover:bg-slate-50 transition-colors cursor-pointer"
            >
              <Icon name="x" className="w-3 h-3" />
            </button>
          </div>

          <div className="flex flex-col gap-3">
            <div className="grid grid-cols-2 gap-3">
              <Field label="Nama Lengkap">
                <input className={inputCls} placeholder="Nama lengkap" value={form.nama} onChange={(e) => setForm({ ...form, nama: e.target.value })} />
              </Field>
              <Field label="Username">
                <input className={inputCls} placeholder="username" value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} />
              </Field>
            </div>
            <Field label="Email">
              <input className={inputCls} type="email" placeholder="email@example.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Role">
                <select className={inputCls} value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
                  <option>Mahasiswa</option>
                  <option>Dosen</option>
                  <option>Admin</option>
                  <option>Perusahaan</option>
                </select>
              </Field>
              <Field label="Status">
                <select className={inputCls} value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                  <option>Aktif</option>
                  <option>Magang</option>
                  <option>Nonaktif</option>
                  <option>Pending</option>
                </select>
              </Field>
            </div>
            {!editId && (
              <Field label="Password">
                <input className={inputCls} type="password" placeholder="••••••••" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
              </Field>
            )}
          </div>

          <div className="flex gap-2.5 mt-5">
            <button
              onClick={() => setShowForm(false)}
              className="flex-1 py-2 border border-slate-200 rounded-lg text-[13px] font-medium text-slate-500 hover:bg-slate-50 transition-colors cursor-pointer"
            >
              Batal
            </button>
            <button
              onClick={saveUser}
              className="flex-1 py-2 bg-blue-500 hover:bg-blue-600 text-white text-[13px] font-semibold rounded-lg transition-colors cursor-pointer"
            >
              {editId ? "Simpan Perubahan" : "Tambah User"}
            </button>
          </div>
        </div>
      </Modal>

      {/* ══ Modal: Delete ══ */}
      <Modal show={showDelete} onClose={() => setShowDelete(false)}>
        <div className="px-6 py-5">
          <div className="w-11 h-11 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-center mb-3">
            <Icon name="trash" className="w-4.5 h-4.5 text-rose-600" />
          </div>
          <div className="text-[15px] font-bold text-slate-800 mb-1 font-display">Hapus User?</div>
          <div className="text-[12.5px] text-slate-400 leading-relaxed mb-5">
            User <strong className="text-slate-700">{deleteTarget?.nama}</strong> ({deleteTarget?.email}) akan dihapus permanen dan tidak bisa dikembalikan.
          </div>
          <div className="flex gap-2.5">
            <button
              onClick={() => setShowDelete(false)}
              className="flex-1 py-2 border border-slate-200 rounded-lg text-[13px] font-medium text-slate-500 hover:bg-slate-50 transition-colors cursor-pointer"
            >
              Batal
            </button>
            <button
              onClick={confirmDelete}
              className="flex-1 py-2 bg-rose-500 hover:bg-rose-600 text-white text-[13px] font-semibold rounded-lg transition-colors cursor-pointer"
            >
              Ya, Hapus
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}