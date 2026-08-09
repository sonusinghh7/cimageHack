import React, { useEffect, useState } from "react";
import { attendanceApi } from "../api";
import { CheckCircleIcon, XMarkIcon, ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";

const statusStyle = {
  Safe:     { bg: "bg-green-50",  badge: "bg-green-100 text-green-700",  bar: "bg-green-500",  ring: "#22C55E" },
  Warning:  { bg: "bg-amber-50",  badge: "bg-amber-100 text-amber-700",  bar: "bg-amber-500",  ring: "#F59E0B" },
  Critical: { bg: "bg-red-50",    badge: "bg-red-100 text-red-700",      bar: "bg-red-500",    ring: "#EF4444" },
};

// Circle bg for each status
const CIRCLE = {
  Present: { bg: "bg-green-500",  text: "text-white" },
  Absent:  { bg: "bg-red-500",    text: "text-white" },
  Leave:   { bg: "bg-yellow-400", text: "text-white" },
};

const DAY_LABELS = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
const MONTH_NAMES = ["January","February","March","April","May","June",
  "July","August","September","October","November","December"];

function buildCalendar(year, month, records) {
  const map = {};
  (records || []).forEach((r) => {
    const d = new Date(r.date);
    const key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
    map[key] = r.status;
  });
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) {
    const key = `${year}-${month}-${d}`;
    cells.push({ day: d, status: map[key] || null });
  }
  return cells;
}

function AttendanceCalendar({ item, onClose }) {
  const today = new Date();
  const [viewYear, setViewYear]   = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());

  const prevMonth = () => {
    if (viewMonth === 0) { setViewYear(y => y - 1); setViewMonth(11); }
    else setViewMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) { setViewYear(y => y + 1); setViewMonth(0); }
    else setViewMonth(m => m + 1);
  };

  const cells = buildCalendar(viewYear, viewMonth, item.records);
  const s = statusStyle[item.status] || statusStyle.Safe;

  // Count per this month
  const monthCounts = { Present: 0, Absent: 0, Leave: 0 };
  cells.forEach(c => { if (c?.status) monthCounts[c.status] = (monthCounts[c.status] || 0) + 1; });

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col justify-end"
      style={{ background: "rgba(0,0,0,0.5)" }}
      onClick={onClose}
    >
      <div
        className="bg-white rounded-t-3xl sheet-enter"
        style={{ maxHeight: "92vh", overflowY: "auto", WebkitOverflowScrolling: "touch" }}
        onClick={e => e.stopPropagation()}
      >
        {/* Drag handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 bg-gray-300 rounded-full" />
        </div>

        {/* Header */}
        <div className="flex items-start justify-between px-5 pt-2 pb-3 border-b border-gray-100">
          <div>
            <p className="text-base font-bold text-gray-800 leading-snug">{item.course?.name}</p>
            <p className="text-xs text-gray-400 mt-0.5">{item.course?.code} • {item.course?.faculty}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 active:bg-gray-200 transition ml-2 shrink-0"
          >
            <XMarkIcon className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Overall stats */}
        <div className="grid grid-cols-4 gap-2 px-5 pt-4">
          {[
            { label: "Present", value: item.presentCount,  color: "text-green-600",  bg: "bg-green-50" },
            { label: "Absent",  value: item.totalClasses - item.presentCount, color: "text-red-500", bg: "bg-red-50" },
            { label: "Total",   value: item.totalClasses,  color: "text-gray-800",   bg: "bg-gray-50" },
            { label: "Attend.", value: `${item.percentage}%`, color: item.percentage >= 75 ? "text-green-600" : item.percentage >= 60 ? "text-amber-500" : "text-red-500", bg: item.percentage >= 75 ? "bg-green-50" : item.percentage >= 60 ? "bg-amber-50" : "bg-red-50" },
          ].map(({ label, value, color, bg }) => (
            <div key={label} className={`${bg} rounded-2xl py-3 text-center`}>
              <p className={`text-lg font-extrabold ${color}`}>{value}</p>
              <p className="text-[9px] text-gray-400 uppercase tracking-wide mt-0.5">{label}</p>
            </div>
          ))}
        </div>

        {/* Progress bar */}
        <div className="mx-5 mt-3 h-2 bg-gray-100 rounded-full overflow-hidden">
          <div className={`h-full ${s.bar} rounded-full`} style={{ width: `${item.percentage}%` }} />
        </div>

        {/* Month navigator */}
        <div className="flex items-center justify-between px-5 pt-5 pb-2">
          <button
            onClick={prevMonth}
            className="w-9 h-9 flex items-center justify-center rounded-xl bg-gray-100 active:bg-gray-200 transition"
          >
            <ChevronLeftIcon className="w-4 h-4 text-gray-600" />
          </button>
          <div className="text-center">
            <p className="text-sm font-bold text-gray-800">{MONTH_NAMES[viewMonth]} {viewYear}</p>
            {/* Month totals */}
            <div className="flex gap-2 mt-0.5 justify-center text-[10px]">
              <span className="text-green-600 font-semibold">P:{monthCounts.Present}</span>
              <span className="text-red-500 font-semibold">A:{monthCounts.Absent}</span>
              {monthCounts.Leave > 0 && <span className="text-yellow-500 font-semibold">L:{monthCounts.Leave}</span>}
            </div>
          </div>
          <button
            onClick={nextMonth}
            className="w-9 h-9 flex items-center justify-center rounded-xl bg-gray-100 active:bg-gray-200 transition"
          >
            <ChevronRightIcon className="w-4 h-4 text-gray-600" />
          </button>
        </div>

        {/* Day headers */}
        <div className="grid grid-cols-7 px-4 mb-1">
          {DAY_LABELS.map((d) => (
            <div key={d} className={`text-center text-[10px] font-bold py-1 ${d === "Sun" ? "text-red-400" : "text-gray-400"}`}>
              {d}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-7 px-3 pb-2">
          {cells.map((cell, i) => {
            if (!cell) return <div key={i} />;

            const isToday =
              cell.day === today.getDate() &&
              viewMonth === today.getMonth() &&
              viewYear === today.getFullYear();

            const isSunday = (i % 7) === 0;
            const circle = cell.status ? CIRCLE[cell.status] : null;

            return (
              <div key={i} className="flex items-center justify-center py-1">
                <div
                  className={`
                    w-9 h-9 rounded-full flex items-center justify-center relative
                    ${circle ? `${circle.bg} ${circle.text}` : ""}
                    ${!circle && isToday ? "border-2 border-[#3E4095]" : ""}
                    ${!circle && !isToday ? "" : ""}
                  `}
                >
                  <span className={`text-xs font-semibold leading-none
                    ${circle ? "text-white" : isToday ? "text-[#3E4095]" : isSunday ? "text-red-400" : "text-gray-700"}
                  `}>
                    {cell.day}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center gap-4 pb-6 pt-2">
          {[
            { label: "Present", cls: "bg-green-500" },
            { label: "Absent",  cls: "bg-red-500"   },
            { label: "Leave",   cls: "bg-yellow-400" },
          ].map(({ label, cls }) => (
            <div key={label} className="flex items-center gap-1.5 text-xs text-gray-500">
              <span className={`w-3 h-3 rounded-full ${cls}`} />
              {label}
            </div>
          ))}
        </div>

        {/* Safe area bottom padding */}
        <div className="pb-safe" />
      </div>
    </div>
  );
}

export default function AttendanceView() {
  const [data, setData]     = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState("");
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    const ctrl = new AbortController();
    attendanceApi.get(ctrl.signal)
      .then(setData)
      .catch((e) => { if (e.name !== "AbortError") setError(e.message); })
      .finally(() => setLoading(false));
    return () => ctrl.abort();
  }, []);

  if (loading) return <Skeleton />;
  if (error)   return <ErrorState msg={error} />;
  if (!data)   return <ErrorState msg="No attendance data available." />;

  const pct           = data.overallPercentage || 0;
  const overallStatus = pct >= 75 ? "Safe" : pct >= 60 ? "Warning" : "Critical";
  const circumference = 2 * Math.PI * 40;
  const dashOffset    = circumference - (pct / 100) * circumference;
  const ringColor     = statusStyle[overallStatus].ring;

  return (
    <div className="px-4 pt-4 pb-safe space-y-4" style={{ paddingBottom: "calc(env(safe-area-inset-bottom,0px) + 1.5rem)" }}>
      {/* Calendar Modal */}
      {selected && <AttendanceCalendar item={selected} onClose={() => setSelected(null)} />}

      {/* Overall Ring Card */}
      <div className="bg-white rounded-2xl shadow-sm p-5 flex flex-col items-center">
        <svg width="130" height="130" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="40" fill="none" stroke="#F3F4F6" strokeWidth="10" />
          <circle
            cx="50" cy="50" r="40" fill="none"
            stroke={ringColor} strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
            transform="rotate(-90 50 50)"
            style={{ transition: "stroke-dashoffset 1s ease" }}
          />
          <text x="50" y="50" textAnchor="middle" fontSize="18" fontWeight="800" fill="#1A1D2E" dy="0.35em">
            {pct}%
          </text>
        </svg>
        <p className="text-base font-bold text-gray-800 mt-1">Overall Attendance</p>
        <span className={`mt-1.5 px-3 py-0.5 rounded-full text-xs font-semibold ${statusStyle[overallStatus].badge}`}>
          {overallStatus}
        </span>
        <div className="flex gap-6 mt-3 text-center">
          <div><p className="text-lg font-bold text-green-600">{data.overallPresent}</p><p className="text-xs text-gray-400">Present</p></div>
          <div className="w-px bg-gray-100" />
          <div><p className="text-lg font-bold text-gray-800">{data.overallTotal}</p><p className="text-xs text-gray-400">Total</p></div>
          <div className="w-px bg-gray-100" />
          <div><p className="text-lg font-bold text-red-500">{data.overallTotal - data.overallPresent}</p><p className="text-xs text-gray-400">Absent</p></div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex gap-2 flex-wrap">
        {Object.entries(statusStyle).map(([key, val]) => (
          <span key={key} className={`px-2.5 py-1 rounded-full text-xs font-medium ${val.badge}`}>
            {key} {key === "Safe" ? "≥75%" : key === "Warning" ? "≥60%" : "<60%"}
          </span>
        ))}
      </div>

      <p className="text-xs text-gray-400 text-center">📅 Tap any subject to see attendance calendar</p>

      {/* Subject Cards */}
      {(data.attendance || []).map((item) => {
        const s = statusStyle[item.status] || statusStyle.Safe;
        return (
          <button
            key={item._id}
            onClick={() => setSelected(item)}
            className={`w-full text-left ${s.bg} rounded-2xl p-4 active:scale-[0.98] transition-all duration-150 press`}
          >
            <div className="flex items-start justify-between gap-2 mb-2">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-800 leading-snug">{item.course?.name}</p>
                <p className="text-xs text-gray-500 mt-0.5">{item.course?.code} • {item.course?.faculty}</p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-2xl font-extrabold text-gray-800">{item.percentage}%</p>
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${s.badge}`}>{item.status}</span>
              </div>
            </div>
            <div className="h-2 bg-white/60 rounded-full overflow-hidden">
              <div className={`h-full ${s.bar} rounded-full`} style={{ width: `${item.percentage}%` }} />
            </div>
            <div className="flex justify-between mt-1.5 text-[10px] text-gray-400">
              <span>✅ {item.presentCount} present</span>
              <span className="text-[#3E4095] font-semibold">View Calendar →</span>
              <span>📋 {item.totalClasses} total</span>
            </div>
          </button>
        );
      })}
    </div>
  );
}

function Skeleton() {
  return (
    <div className="px-4 pt-4 space-y-3">
      <div className="skeleton h-52 w-full" />
      {[...Array(4)].map((_, i) => <div key={i} className="skeleton h-24 w-full" />)}
    </div>
  );
}

function ErrorState({ msg }) {
  return (
    <div className="px-4 pt-10 flex flex-col items-center gap-2 text-center">
      <CheckCircleIcon className="w-12 h-12 text-gray-300" />
      <p className="text-sm text-gray-400">{msg}</p>
    </div>
  );
}
