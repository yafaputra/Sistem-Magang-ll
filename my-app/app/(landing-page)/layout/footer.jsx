import Link from "next/link";
import { Outfit } from "next/font/google";
import { FaInstagram, FaLinkedin, FaTwitter, FaGithub } from "react-icons/fa";
import { Mail, Phone } from "lucide-react";

const outfit = Outfit({ subsets: ["latin"], weight: ["800"] });

export default function Footer() {
  return (
    <footer className="bg-[#0f172a] text-slate-400 font-[Plus_Jakarta_Sans,Segoe_UI,sans-serif]">
      {/* Main */}
      <div className="max-w-[1200px] mx-auto px-8 py-16 grid grid-cols-4 gap-10 max-[1024px]:grid-cols-2 max-[580px]:grid-cols-1">

        {/* Brand */}
        <div className="flex flex-col gap-5">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-[40px] h-[40px] bg-[#0A66C2] rounded-[8px] flex items-center justify-center flex-shrink-0">
              <span className="font-serif text-[22px] font-bold text-white leading-none">M</span>
            </div>
            <span className={`${outfit.className} text-[24px] font-bold text-white tracking-[-1px] leading-none`}>
              Magang<span className="text-[#6CC1FF]">Ku</span>
            </span>
          </Link>
          <p className="text-sm leading-relaxed text-slate-400">
            Platform magang terpercaya yang menghubungkan mahasiswa dengan perusahaan terbaik di Indonesia.
          </p>
          <div className="flex gap-3 mt-1">
            {[
              { icon: <FaInstagram size={16} />, href: "#" },
              { icon: <FaLinkedin size={16} />,  href: "#" },
              { icon: <FaTwitter size={16} />,   href: "#" },
              { icon: <FaGithub size={16} />,    href: "#" },
            ].map((s, i) => (
              <a
                key={i}
                href={s.href}
                className="w-9 h-9 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-[#6CC1FF] hover:text-white transition-all duration-200"
              >
                {s.icon}
              </a>
            ))}
          </div>
        </div>

        {/* Lowongan */}
        <div className="flex flex-col gap-4">
          <h4 className="text-white font-semibold text-[15px]">Lowongan</h4>
          <ul className="flex flex-col gap-2.5">
            {["Development & IT", "Data & Science", "Digital Marketing", "Graphics & Design", "Finance & Accounting"].map((item) => (
              <li key={item}>
                <Link href="#" className="text-sm text-slate-400 hover:text-[#6CC1FF] transition-colors">
                  {item}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Perusahaan */}
        <div className="flex flex-col gap-4">
          <h4 className="text-white font-semibold text-[15px]">Perusahaan</h4>
          <ul className="flex flex-col gap-2.5">
            {["Daftarkan Perusahaan", "Pasang Lowongan", "Cari Kandidat", "Paket & Harga", "Testimoni"].map((item) => (
              <li key={item}>
                <Link href="#" className="text-sm text-slate-400 hover:text-[#6CC1FF] transition-colors">
                  {item}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Bantuan */}
        <div className="flex flex-col gap-4">
          <h4 className="text-white font-semibold text-[15px]">Bantuan</h4>
          <ul className="flex flex-col gap-2.5">
            {["Tentang Kami", "FAQ", "Kebijakan Privasi", "Syarat & Ketentuan", "Hubungi Kami"].map((item) => (
              <li key={item}>
                <Link href="#" className="text-sm text-slate-400 hover:text-[#6CC1FF] transition-colors">
                  {item}
                </Link>
              </li>
            ))}
          </ul>
          {/* Contact */}
          <div className="mt-2 flex flex-col gap-1.5 text-sm">
            <span className="text-slate-400 flex items-center gap-2">
              <Mail size={14} />
              hello@magangku.id
            </span>
            <span className="text-slate-400 flex items-center gap-2">
              <Phone size={14} />
              +62 812-3456-7890
            </span>
          </div>
        </div>

      </div>

      {/* Divider */}
      <div className="border-t border-slate-800">
        <div className="max-w-[1200px] mx-auto px-8 py-5 flex items-center justify-between gap-4 max-[580px]:flex-col max-[580px]:text-center">
          <p className="text-xs text-slate-500">
            © {new Date().getFullYear()} MagangKu. Semua hak dilindungi.
          </p>
          <div className="flex gap-5">
            {["Privasi", "Ketentuan", "Cookie"].map((item) => (
              <Link key={item} href="#" className="text-xs text-slate-500 hover:text-[#6CC1FF] transition-colors">
                {item}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}