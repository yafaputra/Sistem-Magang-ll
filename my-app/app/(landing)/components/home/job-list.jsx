
"use client";

const jobs = [
  {
    title: "Front End Developer",
    type: "PART-TIME",
    salary: "Rp 8.000.000 – Rp 12.000.000",
    skills: ["React.Js", "Next.Js", "Vue.Js"],
    company: "Google Indonesia",
    location: "Jakarta, Indonesia",
    logo: "G",
  },
  {
    title: "UI/UX Designer",
    type: "FULL-TIME",
    salary: "Rp 7.000.000 – Rp 10.000.000",
    skills: ["Figma", "Sketch", "Prototyping"],
    company: "Tokopedia",
    location: "Jakarta, Indonesia",
    logo: "T",
  },
  {
    title: "Backend Developer",
    type: "FULL-TIME",
    salary: "Rp 10.000.000 – Rp 15.000.000",
    skills: ["Node.Js", "Express", "PostgreSQL"],
    company: "Gojek",
    location: "Jakarta, Indonesia",
    logo: "GJ",
  },
  {
    title: "Data Analyst",
    type: "PART-TIME",
    salary: "Rp 6.000.000 – Rp 9.000.000",
    skills: ["Python", "SQL", "Tableau"],
    company: "Traveloka",
    location: "Bali, Indonesia",
    logo: "TV",
  },
  {
    title: "Mobile Developer",
    type: "FULL-TIME",
    salary: "Rp 9.000.000 – Rp 14.000.000",
    skills: ["Flutter", "React Native", "Swift"],
    company: "Shopee Indonesia",
    location: "Jakarta, Indonesia",
    logo: "S",
  },
  {
    title: "DevOps Engineer",
    type: "FULL-TIME",
    salary: "Rp 12.000.000 – Rp 18.000.000",
    skills: ["Docker", "Kubernetes", "AWS"],
    company: "Bukalapak",
    location: "Bandung, Indonesia",
    logo: "B",
  },
];

const logoColors = {
  G: { bg: "#F1F3F4", text: "#1A73E8" },
  T: { bg: "#FFF3E0", text: "#E65100" },
  GJ: { bg: "#E8F5E9", text: "#2E7D32" },
  TV: { bg: "#E3F2FD", text: "#1565C0" },
  S: { bg: "#FCE4EC", text: "#C62828" },
  B: { bg: "#F3E5F5", text: "#6A1B9A" },
};

function CompanyLogo({ logo }) {
  const colors = logoColors[logo] ?? {
    bg: "#F3F4F6",
    text: "#374151",
  };

  if (logo === "G") {
    return (
      <div
        className="w-[42px] h-[42px] rounded-[12px] flex items-center justify-center flex-shrink-0"
        style={{ backgroundColor: colors.bg }}
      >
        <svg
          viewBox="0 0 48 48"
          width="22"
          height="22"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill="#EA4335"
            d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.08 17.74 9.5 24 9.5z"
          />
          <path
            fill="#4285F4"
            d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
          />
          <path
            fill="#FBBC05"
            d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
          />
          <path
            fill="#34A853"
            d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.31-8.16 2.31-6.26 0-11.57-3.59-13.46-8.83l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
          />
        </svg>
      </div>
    );
  }

  return (
    <div
      className="w-[42px] h-[42px] rounded-[12px] flex items-center justify-center font-bold text-[12px] flex-shrink-0"
      style={{
        backgroundColor: colors.bg,
        color: colors.text,
      }}
    >
      {logo}
    </div>
  );
}

function JobCard({ job }) {
  return (
    <div className="bg-white border-2 border-blue-300 rounded-[20px] p-5 flex flex-col gap-3.5 cursor-pointer transition-all duration-200 hover:shadow-[0_12px_36px_rgba(14,165,233,0.15)] hover:border-sky-400 hover:-translate-y-1">
      <p className="text-[15px] font-extrabold text-slate-900 leading-snug">
        {job.title}
      </p>

      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-[10.5px] font-bold px-2.5 py-1 rounded-lg border-[1.5px] border-blue-300 bg-blue-50 text-blue-700 tracking-wide whitespace-nowrap">
          {job.type}
        </span>

        <span className="text-[12px] font-semibold text-sky-700">
          {job.salary}
        </span>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {job.skills.map((skill) => (
          <span
            key={skill}
            className="text-[10px] font-bold px-2.5 py-1 rounded-md border-[1.5px] border-green-400 text-green-700 bg-green-50"
          >
            {skill}
          </span>
        ))}
      </div>

      <div className="border-t-2 border-blue-100" />

      <div className="flex items-center gap-2.5">
        <CompanyLogo logo={job.logo} />

        <div className="flex-1 min-w-0">
          <p className="text-[12px] font-bold text-slate-800 truncate">
            {job.company}
          </p>
          <p className="text-[11px] text-slate-400 mt-0.5">
            {job.location}
          </p>
        </div>

        <button className="text-[12px] font-bold text-sky-500 bg-sky-50 border-[1.5px] border-sky-300 px-3.5 py-1.5 rounded-[10px] transition-all duration-150 hover:bg-sky-500 hover:text-white hover:border-sky-500 whitespace-nowrap">
          Lamar
        </button>
      </div>
    </div>
  );
}

export default function JobList() {
  return (
    <section
      className="py-16 px-8 border-y-2 border-blue-300"
      style={{
        background:
          "linear-gradient(135deg, #e0f2fe 0%, #f0f9ff 50%, #bae6fd 100%)",
        fontFamily: "'Plus Jakarta Sans', sans-serif",
      }}
    >
      <div className="max-w-[1200px] mx-auto">
        <h2 className="text-center text-[2rem] font-extrabold text-slate-900 mb-2 leading-tight">
          Temukan Peluang <span className="text-sky-500">Karirmu</span>
        </h2>

        <p className="text-center text-[14px] text-slate-500 mb-10">
          {jobs.length} lowongan tersedia untuk kamu
        </p>

        <div className="grid grid-cols-3 gap-[18px] mb-10 max-[1024px]:grid-cols-2 max-[600px]:grid-cols-1">
          {jobs.map((job, index) => (
            <JobCard key={index} job={job} />
          ))}
        </div>

        <div className="flex justify-center">
          <button
            className="text-white px-12 py-3.5 rounded-[14px] font-bold text-[14px] transition-all duration-200 hover:-translate-y-0.5 hover:brightness-110 border-[1.5px] border-blue-300"
            style={{
              background:
                "linear-gradient(135deg, #38bdf8 0%, #0ea5e9 100%)",
              boxShadow: "0 4px 16px rgba(14,165,233,0.35)",
            }}
          >
            Lihat Lebih Banyak
          </button>
        </div>
      </div>
    </section>
  );
}

