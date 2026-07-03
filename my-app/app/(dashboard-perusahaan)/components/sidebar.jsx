"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LogOut, X } from "lucide-react";

// ─── Nav Items ────────────────────────────────────────────────────────────────

const navItems = [
  {
    group: "Utama",
    items: [
      {
        label: "Dashboard",
        href: "/dashboard-perusahaan",
        icon: (
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="7" height="7" />
            <rect x="14" y="3" width="7" height="7" />
            <rect x="3" y="14" width="7" height="7" />
            <rect x="14" y="14" width="7" height="7" />
          </svg>
        ),
      },
      {
        label: "Daftar Pelamar",
        href: "/dashboard-perusahaan/daftar-pelamar",
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
        label: "Kelola Lowongan",
        href: "/dashboard-perusahaan/kelola-lowongan",
        icon: (
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
            <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
          </svg>
        ),
      },
    ],
  },
  {
    group: "Manajemen",
    items: [
      {
        label: "Monitoring Peserta",
        href: "/dashboard-perusahaan/monitoring-peserta",
        icon: (
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
          </svg>
        ),
      },
      {
        label: "Evaluasi Akhir",
        href: "/dashboard-perusahaan/evaluasi-akhir",
        icon: (
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
        ),
      },
    ],
  },
  {
    group: "Profil",
    items: [
      {
        label: "Profil Perusahaan",
        href: "/dashboard-perusahaan/profile-perusahaan",
        icon: (
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
          </svg>
        ),
      },
    ],
  },
];

// ─── Helper ───────────────────────────────────────────────────────────────────

function getInitials(name) {
  if (!name) return "PT";
  const words = name.trim().split(/\s+/);
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return (words[0][0] + words[1][0]).toUpperCase();
}

function isLogoUrl(logo) {
  if (!logo) return false;
  return logo.startsWith("http") || logo.startsWith("/") || logo.startsWith("data:");
}

// ─── Sub-komponen ─────────────────────────────────────────────────────────────

function CompanyAvatar({ logo, initials, size = "w-[30px] h-[30px]", textSize = "text-[10.5px]" }) {
  if (isLogoUrl(logo)) {
    return (
      <div className={`${size} rounded-full overflow-hidden border border-[#c7d9fc] flex-shrink-0`}>
        <img src={logo} alt="Logo" className="w-full h-full object-cover" />
      </div>
    );
  }
  return (
    <div className={`${size} rounded-full bg-[#e8f0fe] flex items-center justify-center flex-shrink-0`}>
      <span className={`${textSize} font-bold text-[#1a6ef5]`}>
        {logo || initials || "PT"}
      </span>
    </div>
  );
}

function CompanyInfoSkeleton({ collapsed }) {
  if (collapsed) {
    return <div className="w-[30px] h-[30px] rounded-full bg-[#e8f0fe] animate-pulse flex-shrink-0" />;
  }
  return (
    <div className="flex items-center gap-[9px] w-full">
      <div className="w-[30px] h-[30px] rounded-full bg-[#e8e8f0] animate-pulse flex-shrink-0" />
      <div className="flex flex-col gap-1.5 flex-1 overflow-hidden">
        <div className="h-[10px] bg-[#e8e8f0] rounded animate-pulse w-3/4" />
        <div className="h-[9px] bg-[#e8e8f0] rounded animate-pulse w-1/2" />
      </div>
    </div>
  );
}

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
      <circle
        cx="20" cy="20" r="16"
        stroke={color}
        strokeOpacity="0.15"
        strokeWidth="4"
      />
      <path
        d="M36 20a16 16 0 0 0-16-16"
        stroke={color}
        strokeWidth="4"
        strokeLinecap="round"
      />
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

      <p
        className="text-[14px] font-semibold text-[#2d2d4e]"
        style={{ animation: "slideUpText 0.3s ease-out 0.1s both" }}
      >
        Sedang keluar...
      </p>
      <p
        className="text-[12px] text-[#9898b0] mt-1"
        style={{ animation: "slideUpText 0.3s ease-out 0.2s both" }}
      >
        Mohon tunggu sebentar
      </p>
    </div>
  );
}

// ─── Component Utama ──────────────────────────────────────────────────────────

export default function SidebarPerusahaan() {
  const pathname = usePathname();
  const router   = useRouter();

  const [collapsed,       setCollapsed]       = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [loggingOut,      setLoggingOut]      = useState(false);

  const [company,   setCompany]   = useState(null);
  const [loadError, setLoadError] = useState(false);

  // ── Fetch profil perusahaan saat sidebar mount ────────────────────────────
  useEffect(() => {
    const fetchCompany = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) { router.push("/login"); return; }

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/perusahaan/profile`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (res.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          router.push("/login");
          return;
        }

        const result = await res.json();

        if (res.ok && result.data) {
          const d        = result.data;
          const logoVal  = d.logo || null;
          setCompany({
            name:     d.nama   || "Perusahaan",
            bidang:   d.bidang || "—",
            logo:     logoVal,
            initials: isLogoUrl(logoVal) ? getInitials(d.nama) : (logoVal || getInitials(d.nama)),
          });
        } else {
          setCompany({ name: "Perusahaan", bidang: "—", logo: null, initials: "PT" });
        }
      } catch (err) {
        console.error("Sidebar: gagal mengambil profil perusahaan:", err);
        setLoadError(true);
        setCompany({ name: "Perusahaan", bidang: "—", logo: null, initials: "PT" });
      }
    };

    fetchCompany();
  }, []);

  // ── Re-sync setiap navigasi (kecuali halaman profil itu sendiri) ──────────
  useEffect(() => {
    if (pathname === "/dashboard-perusahaan/profile-perusahaan") return;

    const token = localStorage.getItem("token");
    if (!token) return;

    fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/perusahaan/profile`,
      { headers: { Authorization: `Bearer ${token}` } }
    )
      .then((r) => r.json())
      .then((result) => {
        if (result.data) {
          const d       = result.data;
          const logoVal = d.logo || null;
          setCompany({
            name:     d.nama   || "Perusahaan",
            bidang:   d.bidang || "—",
            logo:     logoVal,
            initials: isLogoUrl(logoVal) ? getInitials(d.nama) : (logoVal || getInitials(d.nama)),
          });
        }
      })
      .catch(() => {/* silent */});
  }, [pathname]);

  // ── Logout dengan delay agar overlay terasa smooth ────────────────────────
  const handleLogoutConfirm = async () => {
    setLoggingOut(true);
    setShowLogoutModal(false);

    await new Promise((r) => setTimeout(r, 800));

    localStorage.removeItem("token");
    localStorage.removeItem("user");
    sessionStorage.clear();
    router.push("/login");
    router.refresh();
  };

  const isLoading = company === null;

  return (
    <>
      {/* ── Loading Overlay Logout ── */}
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
        {/* ── Logo Aplikasi ── */}
        <div
          className={`
            flex items-center gap-[9px] border-b border-[#f0f0f8] min-h-[72px]
            ${collapsed ? "px-0 py-[18px] justify-center" : "px-[20px] pt-[22px] pb-[16px] justify-start"}
          `}
        >
          <div className="w-[36px] h-[36px] bg-[#1a6ef5] rounded-[10px] flex items-center justify-center flex-shrink-0">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
              <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
              <line x1="12" y1="12" x2="12" y2="17" />
              <line x1="9.5" y1="14.5" x2="14.5" y2="14.5" />
            </svg>
          </div>
          {!collapsed && (
            <div className="overflow-hidden whitespace-nowrap">
              <div className="text-[13px] font-bold text-[#1a6ef5] tracking-[-0.2px] leading-tight">
                Perusahaan
              </div>
              <div className="text-[10.5px] text-[#9898b0] font-medium mt-[2px]">
                Sistem Magang Terpadu
              </div>
            </div>
          )}
        </div>

        {/* ── Info Perusahaan ── */}
        <div
          className={`
            flex items-center gap-[9px] border-b border-[#f0f0f8]
            ${collapsed ? "justify-center px-0 py-3" : "px-[20px] py-3"}
          `}
        >
          {isLoading ? (
            <CompanyInfoSkeleton collapsed={collapsed} />
          ) : (
            <>
              <Link
                href="/dashboard-perusahaan/profile-perusahaan"
                title="Lihat profil perusahaan"
                className="flex-shrink-0"
              >
                <CompanyAvatar logo={company.logo} initials={company.initials} />
              </Link>

              {!collapsed && (
                <div className="overflow-hidden whitespace-nowrap flex-1">
                  <p className="text-[12.5px] font-semibold text-[#2d2d4e] truncate leading-tight">
                    {company.name}
                  </p>
                  <p className="text-[10.5px] text-[#9898b0] font-medium mt-[1px] truncate">
                    {company.bidang}
                  </p>
                  {loadError && (
                    <p className="text-[9.5px] text-amber-500 mt-[1px]">Gagal memuat data</p>
                  )}
                </div>
              )}
            </>
          )}
        </div>

        {/* ── Navigasi ── */}
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
                  const isActive =
                    item.href === "/dashboard-perusahaan"
                      ? pathname === "/dashboard-perusahaan"
                      : pathname === item.href || pathname.startsWith(item.href + "/");

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