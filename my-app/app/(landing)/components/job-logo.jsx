import Image from "next/image";

const sizeMap = {
  sm: {
    wrapper: "w-8 h-8 rounded-lg text-[10px]",
    image: 24,
    padding: "p-1",
  },
  md: {
    wrapper: "w-11 h-11 rounded-xl text-[12px]",
    image: 34,
    padding: "p-1.5",
  },
  lg: {
    wrapper: "w-16 h-16 rounded-2xl text-[16px]",
    image: 52,
    padding: "p-2",
  },
};

function getInitials(company, fallback = "CO") {
  const words = String(company || fallback)
    .replace(/[^a-zA-Z0-9\s]/g, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (!words.length) return fallback;
  return words
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();
}

export default function JobLogo({ company, logoPath, logoInitials, size = "md" }) {
  const config = sizeMap[size] ?? sizeMap.md;
  const initials = logoInitials || getInitials(company);

  if (logoPath) {
    return (
      <div
        className={`${config.wrapper} ${config.padding} bg-white border border-slate-200 flex items-center justify-center flex-shrink-0 overflow-hidden`}
      >
        <Image
          src={logoPath}
          alt={`${company || "Perusahaan"} logo`}
          width={config.image}
          height={config.image}
          className="h-full w-full object-contain"
        />
      </div>
    );
  }

  return (
    <div
      className={`${config.wrapper} bg-blue-50 border border-blue-100 text-[#0A66C2] flex items-center justify-center font-bold flex-shrink-0`}
    >
      {initials}
    </div>
  );
}
