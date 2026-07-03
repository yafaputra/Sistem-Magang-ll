"use client";

import { useState, useEffect } from "react";
import useAuth from "../../../hooks/useAuth";

// ─── SVG Icons ───────────────────────────────────────────────────────────────

function CalendarIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

function CheckCircleIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
}

function ChevronLeftIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="15 18 9 12 15 6" />
    </svg>
  );
}

function ChevronRightIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}

// ─── Dummy Data ──────────────────────────────────────────────────────────────

const initialHistory = [
  { id: 1, date: "26 Mei", day: "Selasa", checkIn: "08.00", checkOut: "17.00", duration: "9 Jam", status: "Hadir" },
  { id: 2, date: "25 Mei", day: "Senin", checkIn: "08.00", checkOut: "17.00", duration: "9 Jam", status: "Hadir" },
  { id: 3, date: "22 Mei", day: "Jumat", checkIn: "08.15", checkOut: "17.00", duration: "8.75 Jam", status: "Hadir" },
  { id: 4, date: "21 Mei", day: "Kamis", checkIn: "08.00", checkOut: "17.00", duration: "9 Jam", status: "Hadir" },
  { id: 5, date: "20 Mei", day: "Rabu", checkIn: "08.00", checkOut: "17.00", duration: "9 Jam", status: "Hadir" },
  { id: 6, date: "19 Mei", day: "Selasa", checkIn: "07.55", checkOut: "17.00", duration: "9.05 Jam", status: "Hadir" },
  { id: 7, date: "18 Mei", day: "Senin", checkIn: "08.05", checkOut: "17.00", duration: "8.92 Jam", status: "Hadir" },
  { id: 8, date: "15 Mei", day: "Jumat", checkIn: "08.00", checkOut: "17.00", duration: "9 Jam", status: "Hadir" },
  { id: 9, date: "14 Mei", day: "Kamis", checkIn: "08.00", checkOut: "17.00", duration: "9 Jam", status: "Hadir" },
  { id: 10, date: "13 Mei", day: "Rabu", checkIn: "08.10", checkOut: "17.00", duration: "8.83 Jam", status: "Hadir" },
  { id: 11, date: "12 Mei", day: "Selasa", checkIn: "08.00", checkOut: "17.00", duration: "9 Jam", status: "Hadir" },
  { id: 12, date: "11 Mei", day: "Senin", checkIn: "08.00", checkOut: "17.00", duration: "9 Jam", status: "Hadir" },
];

export default function PresensiPage() {
  useAuth("mahasiswa");

  // Time & Date State
  const [time, setTime] = useState("");
  const [dateStr, setDateStr] = useState("");
  
  // Interactive Attendance States
  const [attendanceStatus, setAttendanceStatus] = useState("Belum Check In"); // "Belum Check In", "Sudah Check In", "Sudah Check Out"
  const [checkInTime, setCheckInTime] = useState("");
  const [checkOutTime, setCheckOutTime] = useState("");
  const [attendanceHistory, setAttendanceHistory] = useState(initialHistory);
  const [toast, setToast] = useState(null);

  // Calendar State
  const [currentDate, setCurrentDate] = useState(new Date(2026, 4, 26)); // Fixed start date as per mockup (Mei 2026)
  
  // Table Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Notification helper
  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Real-time Clock
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      // Format time: hh.mm (as in the mockup) or hh.mm.ss
      const hh = String(now.getHours()).padStart(2, "0");
      const mm = String(now.getMinutes()).padStart(2, "0");
      const ss = String(now.getSeconds()).padStart(2, "0");
      setTime(`${hh}.${mm}.${ss}`);
      
      const options = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
      setDateStr(now.toLocaleDateString("id-ID", options));
    };

    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  // Sync state from localStorage
  useEffect(() => {
    const savedStatus = localStorage.getItem("att_status");
    const savedCheckIn = localStorage.getItem("att_checkin");
    const savedCheckOut = localStorage.getItem("att_checkout");
    const savedHistory = localStorage.getItem("att_history");

    if (savedStatus) setAttendanceStatus(savedStatus);
    if (savedCheckIn) setCheckInTime(savedCheckIn);
    if (savedCheckOut) setCheckOutTime(savedCheckOut);
    if (savedHistory) {
      setAttendanceHistory(JSON.parse(savedHistory));
    } else {
      localStorage.setItem("att_history", JSON.stringify(initialHistory));
    }
  }, []);

  // Handle Check In
  const handleCheckIn = () => {
    if (attendanceStatus !== "Belum Check In") {
      showToast("Anda sudah melakukan check-in hari ini.", "info");
      return;
    }

    const now = new Date();
    const hh = String(now.getHours()).padStart(2, "0");
    const mm = String(now.getMinutes()).padStart(2, "0");
    const formattedTime = `${hh}.${mm}`;

    const dateOptions = { day: 'numeric', month: 'long' };
    const dayOptions = { weekday: 'long' };
    
    const formattedDate = now.toLocaleDateString("id-ID", dateOptions);
    const formattedDay = now.toLocaleDateString("id-ID", dayOptions);

    const newRecord = {
      id: Date.now(),
      date: formattedDate,
      day: formattedDay,
      checkIn: formattedTime,
      checkOut: "-",
      duration: "-",
      status: "Hadir"
    };

    const updatedHistory = [newRecord, ...attendanceHistory];
    
    setAttendanceStatus("Sudah Check In");
    setCheckInTime(formattedTime);
    setAttendanceHistory(updatedHistory);

    localStorage.setItem("att_status", "Sudah Check In");
    localStorage.setItem("att_checkin", formattedTime);
    localStorage.setItem("att_history", JSON.stringify(updatedHistory));

    showToast(`Berhasil Check In pada jam ${formattedTime}`);
  };

  // Handle Check Out
  const handleCheckOut = () => {
    if (attendanceStatus === "Belum Check In") {
      showToast("Anda harus check-in terlebih dahulu.", "error");
      return;
    }
    if (attendanceStatus === "Sudah Check Out") {
      showToast("Anda sudah melakukan check-out hari ini.", "info");
      return;
    }

    const now = new Date();
    const hh = String(now.getHours()).padStart(2, "0");
    const mm = String(now.getMinutes()).padStart(2, "0");
    const formattedTime = `${hh}.${mm}`;

    // Update the first record in history (which is today's check-in)
    const updatedHistory = [...attendanceHistory];
    if (updatedHistory.length > 0 && updatedHistory[0].checkOut === "-") {
      // Calculate duration
      const inTimeParts = updatedHistory[0].checkIn.split(".");
      const inHours = parseInt(inTimeParts[0]) + parseInt(inTimeParts[1]) / 60;
      const outHours = now.getHours() + now.getMinutes() / 60;
      const diff = Math.max(0, outHours - inHours);
      const hours = Math.floor(diff);
      const minutes = Math.round((diff - hours) * 60);
      
      updatedHistory[0].checkOut = formattedTime;
      updatedHistory[0].duration = minutes > 0 ? `${hours} Jam ${minutes} Menit` : `${hours} Jam`;
    }

    setAttendanceStatus("Sudah Check Out");
    setCheckOutTime(formattedTime);
    setAttendanceHistory(updatedHistory);

    localStorage.setItem("att_status", "Sudah Check Out");
    localStorage.setItem("att_checkout", formattedTime);
    localStorage.setItem("att_history", JSON.stringify(updatedHistory));

    showToast(`Berhasil Check Out pada jam ${formattedTime}`);
  };

  // Calendar Helpers
  const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year, month) => {
    // 0 = Sunday, 1 = Monday, etc. Adjust so 0 = Monday, 6 = Sunday as in mockup layout (Mon-Sun)
    const day = new Date(year, month, 1).getDay();
    return day === 0 ? 6 : day - 1;
  };

  const monthNames = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember"
  ];

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const renderCalendar = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const totalDays = getDaysInMonth(year, month);
    const firstDayIndex = getFirstDayOfMonth(year, month);

    const prevMonth = month === 0 ? 11 : month - 1;
    const prevYear = month === 0 ? year - 1 : year;
    const daysInPrevMonth = getDaysInMonth(prevYear, prevMonth);

    const cells = [];

    // Prev month padding days
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      cells.push({
        day: daysInPrevMonth - i,
        isCurrentMonth: false,
        dateObj: new Date(prevYear, prevMonth, daysInPrevMonth - i)
      });
    }

    // Current month days
    for (let i = 1; i <= totalDays; i++) {
      cells.push({
        day: i,
        isCurrentMonth: true,
        dateObj: new Date(year, month, i)
      });
    }

    // Next month padding days
    const remainingCells = 42 - cells.length; // 6 rows * 7 days
    for (let i = 1; i <= remainingCells; i++) {
      const nextMonth = month === 11 ? 0 : month + 1;
      const nextYear = month === 11 ? year + 1 : year;
      cells.push({
        day: i,
        isCurrentMonth: false,
        dateObj: new Date(nextYear, nextMonth, i)
      });
    }

    return cells;
  };

  const calendarDays = renderCalendar();

  // Pagination logic
  const totalPages = Math.ceil(attendanceHistory.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = attendanceHistory.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  // Helper to match custom mockup colors for status badges
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "Hadir":
        return "bg-[#e6f9f4] text-[#0d8c6b] border border-[#7dd8be]";
      case "Terlambat":
        return "bg-[#fef9e6] text-[#92720a] border border-[#f0d07a]";
      case "Izin":
      case "Sakit":
        return "bg-[#ede9ff] text-[#6c63ff] border border-[#c4bcff]";
      case "Alpa":
      default:
        return "bg-[#fdecea] text-[#b33a2b] border border-[#f4a79e]";
    }
  };

  // Check if a calendar day matches any attendance in history (for green dots)
  const hasAttendance = (dateObj) => {
    const dayStr = String(dateObj.getDate());
    const monthStr = monthNames[dateObj.getMonth()].substring(0, 3);
    const target = `${dayStr} ${monthStr}`;

    return attendanceHistory.some(h => h.date.toLowerCase().includes(target.toLowerCase()) && h.status === "Hadir");
  };

  return (
    <div className="min-h-screen bg-[#f5f5fb] font-[Inter,system-ui,sans-serif] pb-12">
      {/* Top Header */}
      <div className="flex items-center justify-between px-8 py-[18px] bg-white border-b border-[#e8e8f0]">
        <div className="flex items-center gap-3">
          <span className="text-[20px] font-bold text-[#1e1e2e] tracking-tight">Dashboard</span>
          <span className="text-xs font-semibold text-[#6c63ff] bg-violet-50 px-2.5 py-1 rounded-full border border-violet-100">
            Aktif
          </span>
        </div>
        <button 
          onClick={() => window.location.href = "/"}
          className="px-4 py-2 border-[1.5px] border-[#6c63ff] rounded-lg text-[#6c63ff] text-[13px] font-semibold hover:bg-[#6c63ff] hover:text-white transition-all duration-150 cursor-pointer"
        >
          Back to homepage
        </button>
      </div>

      {/* Main Content Area */}
      <div className="max-w-[1200px] mx-auto px-8 py-8 flex flex-col gap-8">
        
        {/* Top Cards Grid */}
        <div className="grid grid-cols-[1fr_1.1fr] gap-8 max-[900px]:grid-cols-1">
          
          {/* Card 1: Live Presensi / Clock */}
          <div className="bg-white border border-[#e8e8f0] rounded-2xl p-7 flex flex-col justify-between shadow-sm relative overflow-hidden group">
            {/* Soft decorative background shape */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-violet-50 rounded-full blur-2xl opacity-60 -mr-10 -mt-10 transition-transform duration-500 group-hover:scale-110 pointer-events-none" />

            <div>
              <div className="text-[13px] font-medium text-[#8888a8] mb-1">
                {dateStr || "Selasa, 26 Mei 2026"}
              </div>
              <div className="text-[52px] font-black text-[#1e1e2e] tracking-tight font-mono leading-none mb-6">
                {time ? time.substring(0, 5) : "07.20"}
                <span className="text-[20px] font-bold text-[#9898b0] ml-1 font-sans">
                  {time ? time.substring(5) : ""}
                </span>
              </div>

              {/* Status Badge Box */}
              <div className="border border-[#e0dbff] bg-[#fdfcff] rounded-xl px-4 py-3.5 mb-8 flex items-center gap-3">
                <span className={`w-2.5 h-2.5 rounded-full animate-pulse ${
                  attendanceStatus === "Sudah Check In" ? "bg-[#0d8c6b]" :
                  attendanceStatus === "Sudah Check Out" ? "bg-[#8888a8]" : "bg-[#6c63ff]"
                }`} />
                <span className="text-[13.5px] font-semibold text-[#3e3e5c]">
                  {attendanceStatus}
                </span>
              </div>

              {/* Two buttons */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <button
                  onClick={handleCheckIn}
                  disabled={attendanceStatus !== "Belum Check In"}
                  className={`py-3 px-5 border rounded-xl text-[14px] font-bold transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer
                    ${attendanceStatus === "Belum Check In"
                      ? "border-[#dcdcec] bg-white text-slate-700 hover:border-[#6c63ff] hover:bg-violet-50/30 hover:text-[#6c63ff] active:scale-[0.98]"
                      : "border-[#f0f0f8] bg-[#fafafa] text-[#b0b0c8] cursor-not-allowed"
                    }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                  Check In
                </button>
                <button
                  onClick={handleCheckOut}
                  disabled={attendanceStatus !== "Sudah Check In"}
                  className={`py-3 px-5 border rounded-xl text-[14px] font-bold transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer
                    ${attendanceStatus === "Sudah Check In"
                      ? "border-[#dcdcec] bg-white text-slate-700 hover:border-red-400 hover:bg-red-50/30 hover:text-red-500 active:scale-[0.98]"
                      : "border-[#f0f0f8] bg-[#fafafa] text-[#b0b0c8] cursor-not-allowed"
                    }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                  Check Out
                </button>
              </div>
            </div>

            {/* Bottom Wide Check Out Button */}
            <button
              onClick={handleCheckOut}
              disabled={attendanceStatus !== "Sudah Check In"}
              className={`w-full py-3.5 border rounded-xl text-[13.5px] font-bold tracking-wide transition-all duration-200 cursor-pointer
                ${attendanceStatus === "Sudah Check In"
                  ? "border-[#c4bcff] bg-[#f8f7ff] text-[#6c63ff] hover:bg-[#6c63ff] hover:text-white hover:border-[#6c63ff] active:scale-[0.98]"
                  : "border-[#f0f0f8] bg-[#fbfbfd] text-[#b0b0c8] cursor-not-allowed"
                }`}
            >
              Check Out Sekarang
            </button>
          </div>

          {/* Card 2: Interactive Calendar */}
          <div className="bg-white border border-[#e8e8f0] rounded-2xl p-7 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <span className="text-[15px] font-bold text-[#1e1e2e]">
                {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
              </span>
              <div className="flex gap-2">
                <button 
                  onClick={handlePrevMonth}
                  className="w-8 h-8 rounded-lg border border-[#e8e8f0] bg-white flex items-center justify-center text-[#8888a8] hover:bg-slate-50 hover:text-[#6c63ff] active:scale-95 transition-all cursor-pointer"
                >
                  <ChevronLeftIcon />
                </button>
                <button 
                  onClick={handleNextMonth}
                  className="w-8 h-8 rounded-lg border border-[#e8e8f0] bg-white flex items-center justify-center text-[#8888a8] hover:bg-slate-50 hover:text-[#6c63ff] active:scale-95 transition-all cursor-pointer"
                >
                  <ChevronRightIcon />
                </button>
              </div>
            </div>

            {/* Weekdays */}
            <div className="grid grid-cols-7 gap-y-2 mb-2 text-center">
              {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
                <span key={d} className="text-[11.5px] font-bold text-[#b0b0c8] py-1">
                  {d}
                </span>
              ))}
            </div>

            {/* Days Grid */}
            <div className="grid grid-cols-7 gap-y-1.5 text-center">
              {calendarDays.map((item, idx) => {
                const isToday = 
                  item.dateObj.getDate() === 26 && 
                  item.dateObj.getMonth() === 4 && 
                  item.dateObj.getFullYear() === 2026; // Highlight today based on mockup (26 Mei 2026)
                
                const hasAtt = hasAttendance(item.dateObj);

                return (
                  <div key={idx} className="flex flex-col items-center justify-center py-1">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-[13px] font-medium transition-all relative
                        ${!item.isCurrentMonth ? "text-[#c0c0d6] font-normal" : "text-[#1e1e2e]"}
                        ${isToday ? "border border-[#6c63ff] text-[#6c63ff] font-bold" : ""}
                        ${hasAtt ? "bg-[#e6f9f4] text-[#0d8c6b] font-semibold" : ""}
                      `}
                    >
                      {item.day}
                      {/* Optional check icon or dot under active attendance */}
                      {hasAtt && (
                        <span className="absolute bottom-1 w-1 h-1 rounded-full bg-[#0d8c6b]" />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Bottom Card: Riwayat Kehadiran */}
        <div className="bg-white border border-[#e8e8f0] rounded-2xl p-7 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-[16px] font-extrabold text-[#1e1e2e]">
              Riwayat Kehadiran
            </h2>
          </div>

          {/* Table Container */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#f0f0f8]">
                  <th className="pb-3.5 text-[12px] font-bold text-[#b0b0c8] uppercase tracking-wider">Tanggal</th>
                  <th className="pb-3.5 text-[12px] font-bold text-[#b0b0c8] uppercase tracking-wider">Hari</th>
                  <th className="pb-3.5 text-[12px] font-bold text-[#b0b0c8] uppercase tracking-wider">Check-in</th>
                  <th className="pb-3.5 text-[12px] font-bold text-[#b0b0c8] uppercase tracking-wider">Check-out</th>
                  <th className="pb-3.5 text-[12px] font-bold text-[#b0b0c8] uppercase tracking-wider">Durasi</th>
                  <th className="pb-3.5 text-[12px] font-bold text-[#b0b0c8] uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f5f5fa]">
                {currentItems.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-4 text-[13.5px] font-semibold text-[#3e3e5c]">{item.date}</td>
                    <td className="py-4 text-[13.5px] text-[#8888a8]">{item.day}</td>
                    <td className="py-4 text-[13.5px] text-[#3e3e5c] font-medium">{item.checkIn}</td>
                    <td className="py-4 text-[13.5px] text-[#3e3e5c] font-medium">{item.checkOut}</td>
                    <td className="py-4 text-[13.5px] text-[#8888a8]">{item.duration}</td>
                    <td className="py-4">
                      <span className={`inline-flex items-center gap-1 text-[11.5px] font-bold px-3 py-1 rounded-full ${getStatusBadgeClass(item.status)}`}>
                        {item.status === "Hadir" && <CheckCircleIcon />}
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          <div className="flex items-center justify-end gap-1.5 mt-6">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`w-8 h-8 rounded-lg border flex items-center justify-center text-[#8888a8] transition-all cursor-pointer
                ${currentPage === 1 
                  ? "border-[#f0f0f8] bg-[#fbfbfd] text-[#c0c0d8] cursor-not-allowed" 
                  : "border-[#e8e8f0] bg-white hover:bg-slate-50 hover:text-[#6c63ff] active:scale-95"
                }`}
            >
              <ChevronLeftIcon />
            </button>

            {[...Array(totalPages)].map((_, idx) => {
              const pageNum = idx + 1;
              return (
                <button
                  key={pageNum}
                  onClick={() => handlePageChange(pageNum)}
                  className={`w-8 h-8 rounded-lg text-[13px] font-bold transition-all cursor-pointer
                    ${currentPage === pageNum
                      ? "bg-[#6c63ff] text-white"
                      : "border border-[#e8e8f0] bg-white text-[#8888a8] hover:bg-slate-50 hover:text-[#6c63ff]"
                    }`}
                >
                  {pageNum}
                </button>
              );
            })}

            {totalPages > 3 && (
              <>
                <span className="text-[13px] text-[#b0b0c8] px-1">..</span>
                <button
                  onClick={() => handlePageChange(40)}
                  className="w-8 h-8 rounded-lg border border-[#e8e8f0] bg-white text-[#8888a8] hover:bg-slate-50 hover:text-[#6c63ff] text-[13px] font-bold cursor-pointer"
                >
                  40
                </button>
              </>
            )}

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`w-8 h-8 rounded-lg border flex items-center justify-center text-[#8888a8] transition-all cursor-pointer
                ${currentPage === totalPages 
                  ? "border-[#f0f0f8] bg-[#fbfbfd] text-[#c0c0d8] cursor-not-allowed" 
                  : "border-[#e8e8f0] bg-white hover:bg-slate-50 hover:text-[#6c63ff] active:scale-95"
                }`}
            >
              <ChevronRightIcon />
            </button>
          </div>
        </div>

      </div>

      {/* Floating Toast Notification */}
      {toast && (
        <div className={`fixed bottom-6 right-6 px-5 py-3 rounded-xl text-[13px] font-semibold shadow-lg transition-all duration-300 transform translate-y-0 flex items-center gap-2.5 z-50 animate-bounce
          ${toast.type === "error" ? "bg-[#fdecea] text-[#b33a2b] border border-[#f4a79e]" : 
            toast.type === "info" ? "bg-[#f0f5ff] text-[#0A66C2] border border-[#bfdbfe]" :
            "bg-[#e6f9f4] text-[#0d8c6b] border border-[#7dd8be]"}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${
            toast.type === "error" ? "bg-[#b33a2b]" : 
            toast.type === "info" ? "bg-[#0A66C2]" : "bg-[#0d8c6b]"
          }`} />
          {toast.message}
        </div>
      )}
    </div>
  );
}
