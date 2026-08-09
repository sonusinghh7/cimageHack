import React, { useEffect, useState } from "react";
import { courseApi } from "../api";
import { BookOpenIcon, UserIcon, AcademicCapIcon } from "@heroicons/react/24/outline";

const typeColors = {
  Theory:    "bg-blue-100 text-blue-700",
  Lab:       "bg-emerald-100 text-emerald-700",
  Practical: "bg-violet-100 text-violet-700",
};

export default function CourseView({ student }) {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const ctrl = new AbortController();
    courseApi.getAll(ctrl.signal)
      .then((d) => setCourses(d.courses || []))
      .catch((e) => { if (e.name !== "AbortError") setError(e.message); })
      .finally(() => setLoading(false));
    return () => ctrl.abort();
  }, []);

  if (loading) return <Skeleton />;
  if (error)   return <Error msg={error} />;

  const totalCredits = courses.reduce((s, c) => s + (c.credits || 0), 0);

  return (
    <div className="px-4 pt-4 pb-8 space-y-4">
      {/* Summary bar */}
      <div className="flex gap-3">
        <StatChip label="Subjects" value={courses.length} color="text-blue-600" />
        <StatChip label="Credits"  value={totalCredits}   color="text-purple-600" />
        <StatChip label="Semester" value={`Sem ${student?.semester}`} color="text-orange-500" />
      </div>

      {/* Course Cards */}
      {courses.map((c) => (
        <div key={c._id} className="bg-white rounded-2xl shadow-sm p-4 border-l-4 border-[#3E4095]">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-mono font-bold text-[#3E4095] bg-blue-50 px-2 py-0.5 rounded-md">
                  {c.code}
                </span>
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${typeColors[c.type] || "bg-gray-100 text-gray-600"}`}>
                  {c.type}
                </span>
              </div>
              <h3 className="text-sm font-semibold text-gray-800 leading-snug">{c.name}</h3>
            </div>
            <div className="text-center shrink-0">
              <p className="text-xl font-bold text-gray-800">{c.credits}</p>
              <p className="text-[10px] text-gray-400 uppercase tracking-wider">Credits</p>
            </div>
          </div>

          <div className="mt-2 flex items-center gap-1.5 text-xs text-gray-500">
            <UserIcon className="w-3.5 h-3.5" />
            <span>{c.faculty || "—"}</span>
          </div>

          {c.description && (
            <p className="mt-1.5 text-xs text-gray-400 leading-relaxed">{c.description}</p>
          )}
        </div>
      ))}
    </div>
  );
}

function StatChip({ label, value, color }) {
  return (
    <div className="flex-1 bg-white rounded-xl shadow-sm py-3 text-center">
      <p className={`text-lg font-bold ${color}`}>{value}</p>
      <p className="text-[10px] text-gray-400 uppercase tracking-wide mt-0.5">{label}</p>
    </div>
  );
}

function Skeleton() {
  return (
    <div className="px-4 pt-4 space-y-3">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="skeleton h-24 w-full" />
      ))}
    </div>
  );
}

function Error({ msg }) {
  return (
    <div className="px-4 pt-8 flex flex-col items-center gap-2 text-center">
      <BookOpenIcon className="w-12 h-12 text-gray-300" />
      <p className="text-sm text-gray-400">{msg}</p>
    </div>
  );
}
