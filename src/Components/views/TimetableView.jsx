import React, { useEffect, useState } from "react";
import { timetableApi } from "../api";
import { CalendarDaysIcon } from "@heroicons/react/24/outline";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const typeStyle = {
  Theory:    { bg: "bg-blue-50",    text: "text-blue-700",    border: "border-blue-200"  },
  Lab:       { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200" },
  Practical: { bg: "bg-violet-50",  text: "text-violet-700",  border: "border-violet-200" },
  Break:     { bg: "bg-amber-50",   text: "text-amber-700",   border: "border-amber-200"  },
  Free:      { bg: "bg-gray-50",    text: "text-gray-500",    border: "border-gray-200"   },
};

const todayName = DAYS[new Date().getDay() - 1] || "Monday";

export default function TimetableView() {
  const [timetable, setTimetable] = useState(null);
  const [activeDay, setActiveDay] = useState(todayName);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const ctrl = new AbortController();
    timetableApi.get(ctrl.signal)
      .then((d) => setTimetable(d.timetable))
      .catch((e) => { if (e.name !== "AbortError") setError(e.message); })
      .finally(() => setLoading(false));
    return () => ctrl.abort();
  }, []);

  if (loading) return <Skeleton />;
  if (error)   return <ErrorState msg={error} />;
  if (!timetable) return <ErrorState msg="Timetable not available." />;

  const daySchedule = timetable.schedule?.find((s) => s.day === activeDay);

  return (
    <div className="pb-8">
      {/* Day Tabs */}
      <div className="sticky top-16 bg-white z-10 px-4 pt-3 pb-2 shadow-sm border-b border-gray-100">
        <div className="flex gap-1.5 overflow-x-auto scrollbar-hide">
          {DAYS.map((day) => {
            const isToday = day === todayName;
            const isActive = day === activeDay;
            return (
              <button
                key={day}
                onClick={() => setActiveDay(day)}
                className={`shrink-0 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  isActive
                    ? "bg-[#3E4095] text-white shadow-sm"
                    : "text-gray-500 hover:bg-gray-100"
                }`}
              >
                {day.slice(0, 3)}
                {isToday && !isActive && (
                  <span className="ml-1 w-1 h-1 bg-orange-400 rounded-full inline-block" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Periods */}
      <div className="px-4 pt-4 space-y-3">
        {!daySchedule || daySchedule.periods.length === 0 ? (
          <div className="text-center py-12 text-gray-400 text-sm">No classes on {activeDay}</div>
        ) : (
          daySchedule.periods.map((period, idx) => {
            const style = typeStyle[period.type] || typeStyle.Theory;
            const isBreak = period.type === "Break" || period.type === "Free";
            return (
              <div
                key={idx}
                className={`flex gap-3 rounded-2xl border p-3 ${style.bg} ${style.border}`}
              >
                {/* Time Column */}
                <div className="shrink-0 w-20 text-center">
                  <p className={`text-[10px] font-bold ${style.text} leading-tight`}>
                    {period.time.split(" - ")[0]}
                  </p>
                  <div className={`w-0.5 h-3 mx-auto my-0.5 ${isBreak ? "bg-gray-300" : style.text.replace("text-", "bg-")}`} />
                  <p className={`text-[10px] ${style.text} opacity-70`}>
                    {period.time.split(" - ")[1]}
                  </p>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-semibold leading-snug ${isBreak ? "text-gray-400 italic" : "text-gray-800"}`}>
                    {period.subject}
                  </p>
                  {!isBreak && period.faculty && (
                    <p className="text-xs text-gray-500 mt-0.5">{period.faculty}</p>
                  )}
                  {!isBreak && period.room && (
                    <span className={`mt-1 inline-block text-[10px] font-medium px-2 py-0.5 rounded-full ${style.bg} ${style.text} border ${style.border}`}>
                      {period.room}
                    </span>
                  )}
                </div>

                {/* Type badge */}
                {!isBreak && (
                  <div className="shrink-0">
                    <span className={`text-[9px] font-bold uppercase tracking-wider ${style.text}`}>
                      {period.type}
                    </span>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

function Skeleton() {
  return (
    <div className="px-4 pt-4 space-y-3">
      <div className="skeleton h-10 w-full mb-3" />
      {[...Array(5)].map((_, i) => (
        <div key={i} className="skeleton h-20 w-full" />
      ))}
    </div>
  );
}

function ErrorState({ msg }) {
  return (
    <div className="px-4 pt-8 flex flex-col items-center gap-2 text-center">
      <CalendarDaysIcon className="w-12 h-12 text-gray-300" />
      <p className="text-sm text-gray-400">{msg}</p>
    </div>
  );
}
