"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  FileText,
  Star,
  ClipboardCheck,
  UserCircle,
  LogOut,
  X,
} from "lucide-react";

const navItems = [
  {
    group: "Utama",
    items: [
      { label: "Dashboard",           href: "/dashboard-dosen",               icon: LayoutDashboard },
      { label: "Bimbingan",           href: "/dashboard-dosen/bimbingan",      icon: Users },
      { label: "Review Laporan",      href: "/dashboard-dosen/review-laporan", icon: FileText },
    ],
  },
  {
    group: "Akademik",
    items: [
      { label: "Konversi SKS", href: "/dashboard-dosen/konversi-sks", icon: ClipboardCheck },
    ],
  },
  {
    group: "Profil",
    items: [
      { label: "Profil", href: "/dashboard-dosen/profile-dosen", icon: UserCircle },
    ],
  },
];

function getInitials(name = "") {
  const clean = name.replace(/^(Dr\.|Prof\.|Ir\.)\s*/i, "").trim();
  const parts  = clean.split(" ").filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function decodeJwt(token) {
  try {
    const base64 = token.split(".")[1];
    const json   = atob(base64.replace(/-/g, "+").replace(/_/g, "/"));
    return JSON.parse(json);
  } catch {
    return null;
  }
}

function Skeleton({ className }) {
  return <div className={`animate-pulse bg-[#eef0f8] rounded ${className}`} />;
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

export default function SidebarDosen() {
  const pathname = usePathname();
  const router   = useRouter();

  const [collapsed,       setCollapsed]       = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [loggingOut,      setLoggingOut]      = useState(false);

  const [namaDisplay, setNamaDisplay] = useState("");
  const [nidnDisplay, setNidnDisplay] = useState("");
  const [fotoUrl,     setFotoUrl]     = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) { setLoadingUser(false); return; }

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/dosen/profile`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (res.ok) {
          const result = await res.json();
          const data   = result?.data;
          if (data) {
            setNamaDisplay(data.name || "");
            setNidnDisplay(data.nidn || "");
            if (data.avatar) setFotoUrl(data.avatar);
            setLoadingUser(false);
            return;
          }
        }

        try {
          const meRes = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/auth/me`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          if (meRes.ok) {
            const meData = await meRes.json();
            setNamaDisplay(meData.data?.name || meData.user?.name || meData.name || "");
          }
        } catch {
          const payload = decodeJwt(token);
          setNamaDisplay(payload?.name || "");
        }
      } catch (err) {
        console.error("SidebarDosen: gagal ambil profil", err);
      } finally {
        setLoadingUser(false);
      }
    };

    fetchProfile();
  }, []);

  const initials = getInitials(namaDisplay);

  // ── Logout dengan delay agar overlay terasa smooth ────────────────────────
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
        {/* ── Logo ── */}
        <div
          className={`
            flex items-center gap-2.5 border-b border-[#f0f0f8] min-h-[64px]
            ${collapsed ? "px-0 py-5 justify-center" : "px-5 pt-6 pb-4 justify-start"}
          `}
        >
          <div className="w-9 h-9 bg-[#1a6ef5] rounded-[10px] flex items-center justify-center flex-shrink-0">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
              <path d="M6 12v5c3 3 9 3 12 0v-5" />
            </svg>
          </div>

          {!collapsed && (
            <div className="overflow-hidden whitespace-nowrap">
              <div className="text-[13px] font-bold text-[#1a6ef5] tracking-tight leading-tight">
                Portal Dosen
              </div>
              <div className="text-[10.5px] text-[#9898b0] font-medium mt-px">
                Sistem Magang Terpadu
              </div>
            </div>
          )}
        </div>

        {/* ── User Info ── */}
        <div
          className={`
            border-b border-[#f0f0f8]
            ${collapsed ? "flex justify-center px-0 py-4" : "flex items-center gap-3 px-4 py-4"}
          `}
        >
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
                  <Skeleton className="h-3 w-28 mb-1.5" />
                  <Skeleton className="h-2.5 w-20" />
                </>
              ) : (
                <>
                  <div
                    className="text-[13px] font-semibold text-[#2d2d4e] truncate"
                    title={namaDisplay}
                  >
                    {namaDisplay || "—"}
                  </div>
                  <div className="text-[11px] text-[#9898b0] truncate">
                    {nidnDisplay ? `NIDN: ${nidnDisplay}` : "Dosen"}
                  </div>
                </>
              )}
            </div>
          )}

          {collapsed && !loadingUser && (
            <span className="absolute left-[calc(100%+10px)] z-50 bg-[#1e1e2e] text-white text-xs px-2.5 py-1 rounded-md whitespace-nowrap pointer-events-none opacity-0 group-hover:opacity-100 transition-all duration-150">
              {namaDisplay}
            </span>
          )}
        </div>

        {/* ── Nav ── */}
        <nav className="flex-1 overflow-y-auto overflow-x-hidden">
          {navItems.map((section, sectionIndex) => (
            <div key={section.group}>
              {sectionIndex > 0 && (
                <div className="mx-3 my-1 border-t border-[#f0f0f8]" />
              )}
              <div className={`${collapsed ? "py-3 px-0" : "py-4 px-3"} pb-1`}>
                {!collapsed && (
                  <div className="text-[10px] font-bold tracking-[0.08em] text-[#b0b0c8] uppercase px-2 pb-1.5">
                    {section.group}
                  </div>
                )}

                {section.items.map(({ label, href, icon: Icon }) => {
                  const isActive =
                    href === "/dashboard-dosen"
                      ? pathname === "/dashboard-dosen"
                      : pathname === href || pathname.startsWith(href + "/");

                  return (
                    <Link
                      key={href}
                      href={href}
                      className={`
                        group relative flex items-center gap-2.5 rounded-[9px] mb-0.5
                        text-[13.5px] font-medium whitespace-nowrap no-underline cursor-pointer
                        transition-all duration-150 ease-in-out
                        ${collapsed ? "px-0 py-2.5 justify-center" : "px-3 py-[9px] justify-start"}
                        ${isActive
                          ? "bg-[#e8f0fe] text-[#1a6ef5] font-semibold"
                          : "text-[#8888a8] hover:bg-[#f0f5ff] hover:text-[#1a6ef5]"}
                      `}
                    >
                      <Icon size={18} className="flex-shrink-0" />

                      {!collapsed && (
                        <span className="flex-1 overflow-hidden text-ellipsis">{label}</span>
                      )}

                      {collapsed && (
                        <span className="absolute left-[calc(100%+10px)] z-50 bg-[#1e1e2e] text-white text-xs px-2.5 py-1 rounded-md whitespace-nowrap pointer-events-none opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-150 ease-in-out">
                          {label}
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
            <LogOut size={18} className="flex-shrink-0" />

            {!collapsed && <span>Keluar</span>}

            {collapsed && (
              <span className="absolute left-[calc(100%+10px)] z-50 bg-[#1e1e2e] text-white text-xs px-2.5 py-1 rounded-md whitespace-nowrap pointer-events-none opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-150 ease-in-out">
                Keluar
              </span>
            )}
          </button>
        </div>

        {/* ── Collapse Toggle ── */}
        <div
          className={`
            border-t border-[#f0f0f8] flex
            ${collapsed ? "px-0 py-3 justify-center" : "px-4 py-3 justify-end"}
          `}
        >
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="w-[30px] h-[30px] rounded-lg border border-[#e8e8f0] bg-white flex items-center justify-center cursor-pointer text-[#9898b0] transition-all duration-150 ease-in-out hover:bg-[#f0f5ff] hover:text-[#1a6ef5] hover:border-[#93c5fd]"
          >
            <svg
              width="14" height="14" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2.5"
              strokeLinecap="round" strokeLinejoin="round"
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
                className="flex-1 px-4 py-2.5 rounded-lg text-[13px] font-semibold text-[#8888a8] bg-[#f4f3ff] hover:bg-[#ede9ff] transition-colors"
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