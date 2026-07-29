"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LogOut, X } from "lucide-react";

const navItems = [
  {
    group: "Utama",
    items: [
      {
        label: "Dashboard",
        href: "/dashboard-mahasiswa",
        badge: null,
        icon: (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="7" height="7" />
            <rect x="14" y="3" width="7" height="7" />
            <rect x="3" y="14" width="7" height="7" />
            <rect x="14" y="14" width="7" height="7" />
          </svg>
        ),
      },
      {
        label: "Lowongan",
        href: "/dashboard-mahasiswa/lowongan",
        badge: null,
        icon: (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
        ),
      },
      {
        label: "Pendaftaran",
        href: "/dashboard-mahasiswa/pendaftaran",
        badge: null,
        icon: (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
            <polyline points="10 9 9 9 8 9" />
          </svg>
        ),
      },
      {
        label: "Jadwal Magang",
        href: "/dashboard-mahasiswa/jadwal-magang",
        badge: null,
        icon: (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
        ),
      },
    ],
  },
  {
    group: "Laporan",
    items: [
      {
        label: "Laporan Harian",
        href: "/dashboard-mahasiswa/laporan-harian",
        badge: null,
        icon: (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
          </svg>
        ),
      },
      {
        label: "Konversi SKS",
        href: "/dashboard-mahasiswa/konversi-sks",
        badge: null,
        icon: (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2L2 7l10 5 10-5-10-5z" />
            <path d="M2 17l10 5 10-5" />
            <path d="M2 12l10 5 10-5" />
          </svg>
        ),
      },
    ],
  },
  {
    group: "Akademik",
    items: [
      {
        label: "Pengajuan Dosen",
        href: "/dashboard-mahasiswa/pengajuan-dosen",
        badge: null,
        icon: (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            {/* Siluet dosen/orang */}
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
            {/* Tanda tambah / pengajuan di pojok kanan atas */}
            <circle cx="19" cy="4" r="3" fill="currentColor" fillOpacity="0.15" stroke="currentColor" strokeWidth="1.5" />
            <line x1="19" y1="2.5" x2="19" y2="5.5" strokeWidth="1.8" />
            <line x1="17.5" y1="4" x2="20.5" y2="4" strokeWidth="1.8" />
          </svg>
        ),
      },
    ],
  },
  {
    group: "Profil",
    items: [
      {
        label: "Profil",
        href: "/dashboard-mahasiswa/profile",
        badge: null,
        icon: (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
        ),
      },
    ],
  },
];

const GraduationIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
    <path d="M6 12v5c3 3 9 3 12 0v-5" />
  </svg>
);

function getInitials(nama = "") {
  const parts = nama.trim().split(" ").filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function Skeleton({ className }) {
  return <div className={`animate-pulse bg-[#eef0f8] rounded ${className}`} />;
}

function Spinner({ size = 40, color = "#1a6ef5" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" className="animate-spin" style={{ animationDuration: "0.75s" }}>
      <circle cx="20" cy="20" r="16" stroke={color} strokeOpacity="0.15" strokeWidth="4" />
      <path d="M36 20a16 16 0 0 0-16-16" stroke={color} strokeWidth="4" strokeLinecap="round" />
    </svg>
  );
}

function LogoutOverlay({ visible }) {
  if (!visible) return null;
  return (
    <div
      className="fixed inset-0 z-[999] flex flex-col items-center justify-center"
      style={{ background: "rgba(255,255,255,0.85)", backdropFilter: "blur(6px)", WebkitBackdropFilter: "blur(6px)", animation: "fadeInOverlay 0.2s ease-out" }}
    >
      <style>{`
        @keyframes fadeInOverlay { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUpText { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
      <div className="relative flex items-center justify-center mb-5">
        <Spinner size={52} color="#1a6ef5" />
        <div className="absolute inset-0 flex items-center justify-center">
          <LogOut size={18} className="text-[#1a6ef5]" />
        </div>
      </div>
      <p className="text-[14px] font-semibold text-[#2d2d4e]" style={{ animation: "slideUpText 0.3s ease-out 0.1s both" }}>Sedang keluar...</p>
      <p className="text-[12px] text-[#9898b0] mt-1" style={{ animation: "slideUpText 0.3s ease-out 0.2s both" }}>Mohon tunggu sebentar</p>
    </div>
  );
}

export default function SidebarMahasiswa() {
  const pathname = usePathname();
  const router   = useRouter();

  const [collapsed,       setCollapsed]       = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [loggingOut,      setLoggingOut]      = useState(false);

  const [namaDisplay, setNamaDisplay] = useState("");
  const [nimDisplay,  setNimDisplay]  = useState("");
  const [fotoUrl,     setFotoUrl]     = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/mahasiswa/profile`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (!res.ok) return;
        const result = await res.json();
        const data   = result?.data;
        if (!data) return;
        setNamaDisplay(data.nama || data.user?.name || "");
        setNimDisplay(data.nim || data.user?.email || "");
        if (data.fotoProfil) setFotoUrl(data.fotoProfil);
      } catch (err) {
        console.error("Sidebar: gagal ambil profil", err);
      } finally {
        setLoadingUser(false);
      }
    };
    fetchProfile();
  }, []);

  const initials = getInitials(namaDisplay);

  const handleLogoutConfirm = async () => {
    setLoggingOut(true);
    setShowLogoutModal(false);
    await new Promise((r) => setTimeout(r, 800));
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    sessionStorage.clear();
    router.push("/masuk?mode=login");
    router.refresh();
  };

  return (
    <>
      <LogoutOverlay visible={loggingOut} />

      <aside
        className={`
          ${collapsed ? "w-[72px]" : "w-[220px]"}
          min-h-screen bg-white border-r border-[#e8e8f0]
          flex flex-col shrink-0 overflow-hidden
          transition-[width] duration-[250ms] ease-[cubic-bezier(0.4,0,0.2,1)]
          font-sans
        `}
      >
        {/* ── Logo ── */}
        <div className={`flex items-center gap-2.5 border-b border-[#f0f0f8] min-h-[64px] ${collapsed ? "px-0 py-5 justify-center" : "px-5 pt-6 pb-4 justify-start"}`}>
          <div className="w-9 h-9 bg-[#1a6ef5] rounded-[10px] flex items-center justify-center shrink-0">
            <GraduationIcon />
          </div>
          {!collapsed && (
            <div className="overflow-hidden whitespace-nowrap">
              <div className="text-[13px] font-bold text-[#1a6ef5] tracking-tight leading-tight">Mahasiswa</div>
              <div className="text-[10.5px] text-[#9898b0] font-medium mt-px">Sistem Magang Terpadu</div>
            </div>
          )}
        </div>

        {/* ── User Info ── */}
        <div className={`border-b border-[#f0f0f8] ${collapsed ? "flex justify-center px-0 py-4" : "flex items-center gap-3 px-4 py-4"}`}>
          <div className="w-9 h-9 rounded-full bg-[#e8f0fe] flex items-center justify-center shrink-0 overflow-hidden">
            {loadingUser ? (
              <Skeleton className="w-9 h-9 rounded-full" />
            ) : fotoUrl ? (
              <img src={fotoUrl} alt="Foto profil" className="w-full h-full object-cover" />
            ) : (
              <span className="text-[12px] font-bold text-[#1a6ef5]">{initials}</span>
            )}
          </div>
          {!collapsed && (
            <div className="overflow-hidden flex-1 min-w-0">
              {loadingUser ? (
                <>
                  <Skeleton className="h-3 w-24 mb-1.5" />
                  <Skeleton className="h-2.5 w-16" />
                </>
              ) : (
                <>
                  <div className="text-[13px] font-semibold text-[#2d2d4e] truncate" title={namaDisplay}>{namaDisplay || "—"}</div>
                  <div className="text-[11px] text-[#9898b0] truncate">{nimDisplay || "—"}</div>
                </>
              )}
            </div>
          )}
        </div>

        {/* ── Nav ── */}
        <nav className="flex-1 overflow-y-auto overflow-x-hidden">
          {navItems.map((section, sectionIndex) => (
            <div key={section.group}>
              {sectionIndex > 0 && <div className="mx-3 my-1 border-t border-[#f0f0f8]" />}
              <div className={`${collapsed ? "py-3 px-0" : "py-4 px-3"} pb-1`}>
                {!collapsed && (
                  <div className="text-[10px] font-bold tracking-[0.08em] text-[#b0b0c8] uppercase px-2 pb-1.5">
                    {section.group}
                  </div>
                )}
                {section.items.map((item) => {
                  const isActive =
                    item.href === "/dashboard-mahasiswa"
                      ? pathname === "/dashboard-mahasiswa"
                      : pathname === item.href || pathname.startsWith(item.href + "/");

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`
                        group relative flex items-center mb-1.5 cursor-pointer
                        text-[13.5px] font-medium no-underline whitespace-nowrap
                        transition-all duration-200 ease-in-out
                        ${collapsed 
                          ? "justify-center w-10 h-10 mx-auto rounded-full" 
                          : "justify-start pl-1.5 pr-4 py-1.5 rounded-full"
                        }
                        ${isActive
                          ? "bg-[#e07a3f] text-white font-semibold"
                          : "text-[#8888a8] hover:bg-[#f8f9fa] hover:text-[#e07a3f]"
                        }
                      `}
                    >
                      <span className={`
                        shrink-0 flex items-center justify-center transition-all duration-200
                        ${isActive
                          ? "w-8 h-8 rounded-full bg-white text-[#e07a3f]"
                          : "w-8 h-8 rounded-full bg-transparent text-[#8888a8] group-hover:text-[#e07a3f]"
                        }
                      `}>
                        {item.icon}
                      </span>

                      {!collapsed && (
                        <span className={`
                          flex-1 overflow-hidden text-ellipsis ml-2.5 transition-colors duration-200
                          ${isActive ? "text-white" : "text-[#8888a8] group-hover:text-[#e07a3f]"}
                        `}>
                          {item.label}
                        </span>
                      )}

                      {!collapsed && item.badge && (
                        <span className={`
                          ml-auto shrink-0 min-w-[20px] h-5 px-1.5 flex items-center justify-center rounded-full text-[10px] font-bold transition-all duration-200
                          ${isActive ? "bg-white text-[#e07a3f]" : "bg-[#e07a3f] text-white"}
                        `}>
                          {item.badge}
                        </span>
                      )}

                      {collapsed && item.badge && (
                        <span className={`absolute top-1 right-1 w-2.5 h-2.5 rounded-full border border-white ${isActive ? "bg-white" : "bg-[#e07a3f]"}`} />
                      )}

                      {collapsed && (
                        <span className="absolute left-[calc(100%+10px)] z-50 bg-[#1e1e2e] text-white text-xs px-2.5 py-1 rounded-md whitespace-nowrap pointer-events-none opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-150 ease-in-out">
                          {item.label}{item.badge ? ` (${item.badge})` : ""}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* ── Logout Button ── */}
        <div className={`border-t border-[#f0f0f8] ${collapsed ? "px-2 py-3" : "px-3 py-3"}`}>
          <button
            onClick={() => setShowLogoutModal(true)}
            disabled={loggingOut}
            title="Keluar"
            className={`
              group relative w-full flex items-center gap-2.5 rounded-[9px] cursor-pointer
              text-[13.5px] font-semibold whitespace-nowrap
              transition-all duration-150 ease-in-out
              border border-[#fca5a5] bg-[#fff5f5] text-[#e53e3e]
              hover:bg-[#fee2e2] hover:border-[#f87171]
              disabled:opacity-50 disabled:cursor-not-allowed
              ${collapsed ? "justify-center px-0 py-2.5" : "justify-start px-3 py-[9px]"}
            `}
          >
            <LogOut size={18} className="shrink-0" />
            {!collapsed && <span>Keluar</span>}
            {collapsed && (
              <span className="absolute left-[calc(100%+10px)] z-50 bg-[#1e1e2e] text-white text-xs px-2.5 py-1 rounded-md whitespace-nowrap pointer-events-none opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-150 ease-in-out">
                Keluar
              </span>
            )}
          </button>
        </div>

        {/* ── Collapse Toggle ── */}
        <div className={`border-t border-[#f0f0f8] ${collapsed ? "flex justify-center py-3 px-0" : "flex justify-end py-3 px-4"}`}>
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="w-[30px] h-[30px] rounded-lg border border-[#e8e8f0] bg-white flex items-center justify-center cursor-pointer text-[#9898b0] transition-all duration-150 ease-in-out hover:bg-[#f0f5ff] hover:text-[#1a6ef5] hover:border-[#93c5fd]"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
              className={`transition-transform duration-[250ms] ease-in-out ${collapsed ? "rotate-180" : "rotate-0"}`}>
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
        </div>
      </aside>

      {/* ── Modal Konfirmasi Logout ── */}
      {showLogoutModal && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/40 backdrop-blur-[2px]"
          style={{ animation: "fadeInOverlay 0.15s ease-out" }}
          onClick={() => setShowLogoutModal(false)}
        >
          <style>{`
            @keyframes fadeInOverlay { from { opacity: 0; } to { opacity: 1; } }
            @keyframes slideUpModal { from { opacity: 0; transform: translateY(12px) scale(0.97); } to { opacity: 1; transform: translateY(0) scale(1); } }
          `}</style>
          <div
            className="bg-white rounded-2xl shadow-xl w-[320px] p-6 relative"
            style={{ animation: "slideUpModal 0.2s cubic-bezier(0.4,0,0.2,1)" }}
            onClick={(e) => e.stopPropagation()}
          >
            <button onClick={() => setShowLogoutModal(false)} className="absolute top-3 right-3 text-[#b0b0c8] hover:text-[#1a6ef5] transition-colors">
              <X size={18} />
            </button>
            <div className="w-12 h-12 rounded-full bg-[#fff2f2] flex items-center justify-center mb-4">
              <LogOut size={22} className="text-[#e53e3e]" />
            </div>
            <h3 className="text-[15px] font-bold text-[#1e1e2e] mb-1.5">Keluar dari akun?</h3>
            <p className="text-[13px] text-[#8888a8] leading-relaxed mb-5">
              Anda akan keluar dari sesi ini dan perlu login kembali untuk mengakses dashboard.
            </p>
            <div className="flex gap-2">
              <button onClick={() => setShowLogoutModal(false)}
                className="flex-1 px-4 py-2.5 rounded-lg text-[13px] font-semibold text-[#8888a8] bg-[#f0f5ff] hover:bg-[#e8f0fe] transition-colors">
                Batal
              </button>
              <button onClick={handleLogoutConfirm}
                className="flex-1 px-4 py-2.5 rounded-lg text-[13px] font-semibold text-white bg-[#e53e3e] hover:bg-[#d63333] active:scale-[0.98] transition-all duration-150 flex items-center justify-center gap-2">
                <LogOut size={14} />
                Ya, Keluar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}