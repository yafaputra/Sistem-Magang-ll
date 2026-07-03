"use client";

import { useState } from "react";
import Image from "next/image";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Login gagal");
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      alert("Login berhasil");

      if (data.user.role === "mahasiswa") {
        window.location.href = "/dashboard-mahasiswa/";
      } else if (data.user.role === "dosen") {
        window.location.href = "/dashboard-dosen/";
      } else if (data.user.role === "admin") {
        window.location.href = "/dashboard-admin-prodi/";
      } else if (data.user.role === "perusahaan") {
        window.location.href = "/dashboard-perusahaan/";
      } else {
        window.location.href = "/";
      }
    } catch (error) {
      alert("Tidak bisa terhubung ke server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      className="flex items-center justify-center min-h-screen bg-blue-50 px-6"
      style={{ fontFamily: "'Plus Jakarta Sans', 'DM Sans', sans-serif" }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,400;0,500;0,600;0,700;0,800;1,400;1,600;1,700&display=swap');
      `}</style>

      <div className="w-full max-w-[1050px] flex items-center gap-12 bg-white py-2 px-10 rounded-2xl border-2 border-blue-300">
        <div className="flex-1 flex flex-col justify-center py-6">
          <div
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-3"
            style={{
              background: "#e0f2fe",
              border: "1px solid #bae6fd",
              width: "fit-content",
            }}
          >
            <span
              style={{
                width: 7,
                height: 7,
                borderRadius: "50%",
                background: "#38bdf8",
                display: "inline-block",
                flexShrink: 0,
              }}
            />
            <span
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: "#0284c7",
                letterSpacing: "0.10em",
                textTransform: "uppercase",
              }}
            >
              Portal Masuk
            </span>
          </div>

          <h2 className="text-[26px] font-extrabold text-slate-900 leading-snug mb-1.5">
            Halo, selamat{" "}
            <em className="not-italic italic font-bold text-sky-500">
              kembali
            </em>
          </h2>

          <p className="text-[13.5px] text-slate-400 font-normal mb-5">
            Masuk untuk melanjutkan — semua yang kamu tinggalkan masih ada di
            sini.
          </p>

          <form onSubmit={handleLogin}>
            <div className="mb-3.5">
              <label className="block text-[13px] font-semibold text-slate-700 mb-1.5">
                Email
              </label>
              <input
                type="email"
                placeholder="nama@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-[11px] text-[13.5px] border border-slate-200 rounded-lg outline-none text-slate-800 bg-white placeholder-slate-300 focus:border-sky-300 focus:ring-2 focus:ring-sky-100 transition-all"
              />
            </div>

            <div className="mb-2.5">
              <label className="block text-[13px] font-semibold text-slate-700 mb-1.5">
                Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3.5 py-[11px] text-[13.5px] border border-slate-200 rounded-lg outline-none text-slate-800 bg-white placeholder-slate-300 focus:border-sky-300 focus:ring-2 focus:ring-sky-100 transition-all"
              />
            </div>

            <div className="flex justify-between items-center mb-[18px] mt-1">
              <label className="flex items-center gap-1.5 text-[13px] text-slate-500 cursor-pointer select-none">
                <input
                  type="checkbox"
                  className="w-[15px] h-[15px] accent-sky-400 cursor-pointer"
                />
                Ingat saya
              </label>
              <a
                href="#"
                className="text-[13px] text-slate-600 font-medium no-underline hover:text-sky-400 transition-colors"
              >
                Lupa password?
              </a>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-[11px] bg-sky-400 hover:bg-sky-500 active:scale-[0.99] text-white font-bold text-sm rounded-lg border-none cursor-pointer tracking-wide transition-all disabled:opacity-60"
            >
              {loading ? "Memproses..." : "Masuk sekarang"}
            </button>
          </form>

          <div className="flex items-center gap-2.5 text-slate-300 text-xs my-3.5">
            <span className="flex-1 h-px bg-slate-100" />
            atau masuk dengan
            <span className="flex-1 h-px bg-slate-100" />
          </div>

          <button className="w-full py-2.5 bg-white hover:bg-slate-50 text-slate-800 font-bold text-[13.5px] border border-slate-200 hover:border-slate-300 rounded-lg cursor-pointer flex items-center justify-center gap-2.5 transition-all">
            <GoogleIcon />
            Lanjutkan dengan Google
          </button>

          <p className="text-[13px] text-slate-400 text-center mt-5">
            Belum punya akun?{" "}
            <a
              href="/register"
              className="text-sky-400 font-bold no-underline hover:text-sky-500 transition-colors"
            >
              Daftar sekarang
            </a>
          </p>
        </div>

        <div className="w-[500px] min-h-[500px] bg-gradient-to-br from-sky-300 to-sky-400 rounded-[36px_8px_36px_8px] flex items-center justify-center p-8 relative overflow-hidden flex-shrink-0">
          <Image
            src="/Register-image.png"
            alt="Ilustrasi daftar"
            width={650}
            height={650}
            className="object-contain w-full h-auto relative z-10"
          />
        </div>
      </div>
    </section>
  );
};

const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
    <path
      d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 01-1.796 2.717v2.258h2.908C16.658 14.251 17.64 11.943 17.64 9.2z"
      fill="#4285F4"
    />
    <path
      d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z"
      fill="#34A853"
    />
    <path
      d="M3.964 10.707A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.707V4.961H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.039l3.007-2.332z"
      fill="#FBBC05"
    />
    <path
      d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.961L3.964 7.293C4.672 5.166 6.656 3.58 9 3.58z"
      fill="#EA4335"
    />
  </svg>
);

export default LoginPage;