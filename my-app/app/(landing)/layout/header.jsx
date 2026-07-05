"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Outfit } from "next/font/google";
import { useEffect, useState, useCallback } from "react";

const outfit = Outfit({ subsets: ["latin"], weight: ["800"] });

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/lowongan", label: "Lowongan" },
  { href: "/perusahaan", label: "Perusahaan" },
  { href: "/cv-analyzer", label: "CV Analyzer" },
];

const Header = () => {
  const [user, setUser] = useState(null);
  const [transitioning, setTransitioning] = useState(false);
  const [overlayVisible, setOverlayVisible] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) setUser(JSON.parse(userData));
  }, []);

  useEffect(() => {
    setOverlayVisible(false);
    setTransitioning(false);
  }, [pathname]);

  const dashboardHref =
    user?.role === "mahasiswa" ? "/dashboard-mahasiswa"
    : user?.role === "dosen" ? "/dashboard-dosen"
    : user?.role === "perusahaan" ? "/dashboard-perusahaan"
    : "/dashboard-admin-prodi";

  const handleAuthNav = useCallback((e, href) => {
    e.preventDefault();
    if (transitioning) return;
    setTransitioning(true);
    setOverlayVisible(true);
    setTimeout(() => router.push(href), 500);
  }, [transitioning, router]);

  return (
    <>
      {/* ── Overlay transisi ── */}
      <div
        className="fixed inset-0 z-[9999] pointer-events-none flex items-center justify-center"
        style={{
          background: "linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%)",
          opacity: overlayVisible ? 1 : 0,
          transition: "opacity 0.45s cubic-bezier(.4,0,.2,1)",
        }}
      >
        <div
          style={{
            opacity: overlayVisible ? 1 : 0,
            transform: overlayVisible ? "scale(1)" : "scale(0.8)",
            transition: "all 0.4s cubic-bezier(.34,1.4,.64,1) 0.1s",
            display: "flex",
            alignItems: "center",
            gap: 10,
          }}
        >
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 12,
              background: "linear-gradient(135deg, #38bdf8 0%, #0284c7 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span style={{ color: "white", fontWeight: 800, fontSize: 22, letterSpacing: -1 }}>M</span>
          </div>
          <span
            className={outfit.className}
            style={{ fontSize: 26, fontWeight: 800, color: "#0f172a", letterSpacing: -0.5 }}
          >
            Magang<span style={{ color: "#38bdf8" }}>Ku</span>
          </span>
        </div>
      </div>

      <header
        className="fixed w-full z-50 border-b"
        style={{
          background: "#f0f7ff",
          borderColor: "#bae6fd",
          fontFamily: "'Plus Jakarta Sans', 'DM Sans', sans-serif",
        }}
      >
        <style>{`@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');`}</style>

        <div className="container mx-auto flex items-center justify-between h-[68px] px-10">
          {/* LOGO */}
          <Link href="/" className="flex items-center gap-[10px]">
            <div
              className="w-[38px] h-[38px] rounded-[10px] flex items-center justify-center relative flex-shrink-0"
              style={{ background: "linear-gradient(135deg, #38bdf8 0%, #0284c7 100%)" }}
            >
              <span
                className="font-serif text-[20px] font-bold text-white leading-none"
                style={{ letterSpacing: "-1px" }}
              >
                M
              </span>
              <span
                className="absolute inset-[2px] rounded-[8px] pointer-events-none"
                style={{ border: "1.5px solid rgba(255,255,255,0.3)" }}
              />
            </div>
            <span
              className={`${outfit.className} text-[22px] font-extrabold text-slate-900`}
              style={{ letterSpacing: "-0.5px" }}
            >
              Magang<span className="text-sky-400">Ku</span>
            </span>
          </Link>

          {/* NAV */}
          <nav className="flex gap-4">
            {NAV_LINKS.map(({ href, label }) => {
              const isActive = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  className="group relative flex flex-col items-center px-3 py-[7px] text-[14px] font-semibold transition-colors duration-150"
                  style={{ color: isActive ? "#0284c7" : "#64748b" }}
                >
                  <span className="group-hover:text-sky-600 transition-colors duration-150">
                    {label}
                  </span>
                  <span
                    className="mt-[2px] h-[2px] rounded-full bg-sky-400 transition-all duration-200"
                    style={{ width: isActive ? "100%" : "0%" }}
                  />
                </Link>
              );
            })}
          </nav>

          {/* AUTH */}
          {!user ? (
            <div className="flex gap-[10px]">
              <a
                href="/masuk?mode=login"
                onClick={(e) => handleAuthNav(e, "/masuk?mode=login")}
                className="px-5 py-[8px] text-[13.5px] font-bold rounded-[9px] transition-all duration-150 cursor-pointer"
                style={{
                  border: "1.5px solid #38bdf8",
                  color: "#0284c7",
                  background: "transparent",
                  textDecoration: "none",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "#e0f2fe")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
              >
                Login
              </a>
              <a
              
                href="/masuk?mode=register"
                onClick={(e) => handleAuthNav(e, "/masuk?mode=register")}
                className="px-5 py-[8px] text-[13.5px] font-bold text-white rounded-[9px] transition-all duration-150 cursor-pointer"
                style={{
                  background: "#38bdf8",
                  border: "1.5px solid #38bdf8",
                  textDecoration: "none",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#0ea5e9";
                  e.currentTarget.style.borderColor = "#0ea5e9";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "#38bdf8";
                  e.currentTarget.style.borderColor = "#38bdf8";
                }}
              >
                Register
              </a>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                href={dashboardHref}
                className="px-4 py-[7px] text-[13.5px] font-bold text-white rounded-[9px] transition-colors"
                style={{ background: "#0284c7" }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "#0369a1")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "#0284c7")}
              >
                Dashboard
              </Link>
            </div>
          )}
         </div>
      </header>
    </>
  );
};

export default Header;