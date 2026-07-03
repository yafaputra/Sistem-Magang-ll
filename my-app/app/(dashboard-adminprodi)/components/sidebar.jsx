"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LogOut, X } from "lucide-react";

const navItems = [
  {
    group: "Utama",
    items: [
      {
        label: "Dashboard",
        href: "/dashboard-admin-prodi",
        icon: (
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
            <rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" />
          </svg>
        ),
      },
      {
        label: "Manajemen User",
        href: "/dashboard-admin-prodi/manajemen-user",
        icon: (
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
        ),
      },
      {
        label: "Manajemen Lowongan",
        href: "/dashboard-admin-prodi/manajemen-lowongan",
        icon: (
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="7" width="20" height="14" rx="2" />
            <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
          </svg>
        ),
      },
      {
        label: "Validasi Pendaftaran",
        href: "/dashboard-admin-prodi/validasi-pendaftaran",
        icon: (
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
            <polyline points="10 9 9 9 8 9" />
          </svg>
        ),
      },
    ],
  },
  {
    group: "Akademik",
    items: [
      {
        label: "Penugasan Dosen",
        href: "/dashboard-admin-prodi/penugasan-dosen",
        icon: (
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
        ),
      },
      {
        label: "Konversi SKS",
        href: "/dashboard-admin-prodi/konversi-sks",
        icon: (
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
            <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
          </svg>
        ),
      },
      {
        label: "Statistik Magang",
        href: "/dashboard-admin-prodi/statistik-magang",
        icon: (
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="20" x2="18" y2="10" />
            <line x1="12" y1="20" x2="12" y2="4" />
            <line x1="6" y1="20" x2="6" y2="14" />
            <line x1="2" y1="20" x2="22" y2="20" />
          </svg>
        ),
      },
    ],
  },
  {
    group: "Sistem",
    items: [
      {
        label: "Audit Log",
        href: "/dashboard-admin-prodi/audit-log",
        icon: (
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <path d="M21 21l-4.35-4.35" />
            <line x1="11" y1="8" x2="11" y2="14" />
            <line x1="8" y1="11" x2="14" y2="11" />
          </svg>
        ),
      },
    ],
  },
];

// ─── Spinner ──────────────────────────────────────────────────────────────────

function Spinner({ size = 52, color = "#1a6ef5" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      className="animate-spin"
      style={{ animationDuration: "0.75s" }}
    >
      <circle cx="20" cy="20" r="16" stroke={color} strokeOpacity="0.15" strokeWidth="4" />
      <path d="M36 20a16 16 0 0 0-16-16" stroke={color} strokeWidth="4" strokeLinecap="round" />
    </svg>
  );
}

// ─── Logout Loading Overlay ───────────────────────────────────────────────────

function LogoutOverlay({ visible }) {
  if (!visible) return null;
  return (
    <div
      className="fixed inset-0 z-[999] flex flex-col items-center justify-center"
      style={{
        background: "rgba(255,255,255,0.85)",
        backdropFilter: "blur(6px)",
        WebkitBackdropFilter: "blur(6px)",
        animation: "fadeInOverlay 0.2s ease-out",
      }}
    >
      <style>{`
        @keyframes fadeInOverlay {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes slideUpText {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div className="relative flex items-center justify-center mb-5">
        <Spinner size={52} color="#1a6ef5" />
        <div className="absolute inset-0 flex items-center justify-center">
          <LogOut size={18} className="text-[#1a6ef5]" />
        </div>
      </div>

      <p className="text-[14px] font-semibold text-[#2d2d4e]" style={{ animation: "slideUpText 0.3s ease-out 0.1s both" }}>
        Sedang keluar...
      </p>
      <p className="text-[12px] text-[#9898b0] mt-1" style={{ animation: "slideUpText 0.3s ease-out 0.2s both" }}>
        Mohon tunggu sebentar
      </p>
    </div>
  );
}

// ─── Component Utama ──────────────────────────────────────────────────────────

export default function SidebarAdminProdi() {
  const pathname = usePathname();
  const router   = useRouter();

  const [collapsed,       setCollapsed]       = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [loggingOut,      setLoggingOut]      = useState(false);

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
          flex flex-col flex-shrink-0
          transition-[width] duration-[250ms] ease-[cubic-bezier(0.4,0,0.2,1)]
          overflow-hidden font-sans
        `}
      >
        {/* ── Logo ── */}
        <div
          className={`
            flex items-center gap-[9px] border-b border-[#f0f0f8] min-h-[72px]
            ${collapsed ? "px-0 py-[18px] justify-center" : "px-[20px] pt-[22px] pb-[16px] justify-start"}
          `}
        >
          <div className="w-[36px] h-[36px] bg-[#1a6ef5] rounded-[10px] flex items-center justify-center flex-shrink-0">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
              <path d="M6 12v5c3 3 9 3 12 0v-5" />
            </svg>
          </div>
          {!collapsed && (
            <div className="overflow-hidden whitespace-nowrap">
              <div className="text-[13px] font-bold text-[#1a6ef5] tracking-[-0.2px] leading-tight">
                Admin Prodi
              </div>
              <div className="text-[10.5px] text-[#9898b0] font-medium mt-[2px]">
                Sistem Magang Terpadu
              </div>
            </div>
          )}
        </div>

        {/* ── Nav ── */}
        <nav className="flex-1 overflow-y-auto overflow-x-hidden py-2">
          {navItems.map((section, sectionIndex) => (
            <div key={section.group}>
              {sectionIndex > 0 && (
                <div className="mx-3 my-1 border-t border-[#f0f0f8]" />
              )}
              <div className={`${collapsed ? "px-0 pt-[10px] pb-1" : "px-[10px] pt-[14px] pb-2"}`}>
                {!collapsed && (
                  <div className="text-[10px] font-bold tracking-[0.08em] text-[#b0b0c8] uppercase px-2 pb-[6px]">
                    {section.group}
                  </div>
                )}
                {section.items.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`
                        group relative flex items-center gap-[9px] rounded-[9px] mb-[2px]
                        text-[13px] font-medium whitespace-nowrap no-underline
                        transition-all duration-150 ease-in-out
                        ${collapsed ? "px-0 py-[10px] justify-center" : "px-[11px] py-[8px] justify-start"}
                        ${isActive
                          ? "bg-[#e8f0fe] text-[#1a6ef5] font-semibold"
                          : "text-[#8888a8] hover:bg-[#f0f5ff] hover:text-[#1a6ef5]"
                        }
                      `}
                    >
                      <span className="flex-shrink-0">{item.icon}</span>
                      {!collapsed && (
                        <span className="overflow-hidden text-ellipsis">{item.label}</span>
                      )}
                      {collapsed && (
                        <span className="absolute left-[calc(100%+10px)] bg-[#1e1e2e] text-white text-[11.5px] px-[9px] py-1 rounded-md whitespace-nowrap pointer-events-none z-[100] opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-150 ease-in-out">
                          {item.label}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* ── Tombol Keluar ── */}
        <div className={`border-t border-[#f0f0f8] ${collapsed ? "px-2 py-3" : "px-[10px] py-3"}`}>
          <button
            onClick={() => setShowLogoutModal(true)}
            disabled={loggingOut}
            title="Keluar"
            className={`
              group relative w-full flex items-center gap-[9px] rounded-[9px]
              text-[13px] font-semibold whitespace-nowrap cursor-pointer
              transition-all duration-150 ease-in-out
              border border-[#fca5a5] bg-[#fff5f5] text-[#e53e3e]
              hover:bg-[#fee2e2] hover:border-[#f87171]
              disabled:opacity-50 disabled:cursor-not-allowed
              ${collapsed ? "justify-center px-0 py-[10px]" : "justify-start px-[11px] py-2"}
            `}
          >
            <LogOut size={17} className="flex-shrink-0" />
            {!collapsed && <span>Keluar</span>}
            {collapsed && (
              <span className="absolute left-[calc(100%+10px)] bg-[#1e1e2e] text-white text-[11.5px] px-[9px] py-1 rounded-md whitespace-nowrap pointer-events-none z-[100] opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-150 ease-in-out">
                Keluar
              </span>
            )}
          </button>
        </div>

        {/* ── Toggle Collapse ── */}
        <div
          className={`
            mt-auto border-t border-[#f0f0f8] flex
            ${collapsed ? "px-0 py-[10px] justify-center" : "px-[14px] py-[10px] justify-end"}
          `}
        >
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="w-[30px] h-[30px] rounded-lg border border-[#e8e8f0] bg-white flex items-center justify-center cursor-pointer text-[#9898b0] transition-all duration-150 ease-in-out hover:bg-[#f0f5ff] hover:text-[#1a6ef5] hover:border-[#93c5fd]"
          >
            <svg
              width="13" height="13" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
              className={`transition-transform duration-[250ms] ease-in-out ${collapsed ? "rotate-180" : "rotate-0"}`}
            >
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
            @keyframes fadeInOverlay {
              from { opacity: 0; }
              to   { opacity: 1; }
            }
            @keyframes slideUpModal {
              from { opacity: 0; transform: translateY(12px) scale(0.97); }
              to   { opacity: 1; transform: translateY(0) scale(1); }
            }
          `}</style>

          <div
            className="bg-white rounded-2xl shadow-xl w-[320px] p-6 relative"
            style={{ animation: "slideUpModal 0.2s cubic-bezier(0.4,0,0.2,1)" }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowLogoutModal(false)}
              className="absolute top-3 right-3 text-[#b0b0c8] hover:text-[#1a6ef5] transition-colors"
            >
              <X size={18} />
            </button>

            <div className="w-12 h-12 rounded-full bg-[#fff2f2] flex items-center justify-center mb-4">
              <LogOut size={22} className="text-[#e53e3e]" />
            </div>

            <h3 className="text-[15px] font-bold text-[#1e1e2e] mb-1.5">
              Keluar dari akun?
            </h3>
            <p className="text-[13px] text-[#8888a8] leading-relaxed mb-5">
              Anda akan keluar dari sesi ini dan perlu login kembali untuk mengakses dashboard.
            </p>

            <div className="flex gap-2">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="flex-1 px-4 py-2.5 rounded-lg text-[13px] font-semibold text-[#8888a8] bg-[#f0f5ff] hover:bg-[#e8f0fe] transition-colors"
              >
                Batal
              </button>
              <button
                onClick={handleLogoutConfirm}
                className="flex-1 px-4 py-2.5 rounded-lg text-[13px] font-semibold text-white bg-[#e53e3e] hover:bg-[#d63333] active:scale-[0.98] transition-all duration-150 flex items-center justify-center gap-2"
              >
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