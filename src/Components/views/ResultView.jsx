import React, { useEffect, useState } from "react";
import { resultApi } from "../api";
import { ChartBarIcon, ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/outline";

const gradeColor = {
  "O":  "text-emerald-600 bg-emerald-50",
  "A+": "text-blue-600 bg-blue-50",
  "A":  "text-blue-500 bg-blue-50",
  "B+": "text-violet-600 bg-violet-50",
  "B":  "text-violet-500 bg-violet-50",
  "C":  "text-amber-600 bg-amber-50",
  "D":  "text-orange-600 bg-orange-50",
  "F":  "text-red-600 bg-red-50",
};

const resultBadge = {
  Pass:     "bg-green-100 text-green-700",
  Fail:     "bg-red-100 text-red-700",
  Detained: "bg-orange-100 text-orange-700",
  Withheld: "bg-gray-100 text-gray-600",
};

export default function ResultView() {
  const [results, setResults] = useState([]);
  const [latestCGPA, setLatestCGPA] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    const ctrl = new AbortController();
    resultApi.getAll(ctrl.signal)
      .then((d) => {
        setResults(d.results || []);
        setLatestCGPA(d.latestCGPA || 0);
        if (d.results?.length > 0) setExpanded(d.results[0]._id);
      })
      .catch((e) => { if (e.name !== "AbortError") setError(e.message); })
      .finally(() => setLoading(false));
    return () => ctrl.abort();
  }, []);

  if (loading) return <Skeleton />;
  if (error)   return <ErrorState msg={error} />;

  const cgpaColor = latestCGPA >= 8 ? "text-emerald-500" : latestCGPA >= 6 ? "text-blue-500" : "text-amber-500";

  return (
    <div className="px-4 pt-4 pb-8 space-y-4">
      {/* CGPA Banner */}
      <div className="bg-white rounded-2xl shadow-sm p-5 text-center"
        style={{ background: "linear-gradient(135deg, #3E4095 0%, #5B5FC7 100%)" }}>
        <p className="text-white/70 text-xs uppercase tracking-wider font-medium">Current CGPA</p>
        <p className="text-5xl font-extrabold text-white mt-1">{latestCGPA.toFixed(2)}</p>
        <p className="text-white/60 text-xs mt-1">out of 10.00</p>
        {results.length > 0 && (
          <span className={`mt-3 inline-block text-xs font-semibold px-3 py-1 rounded-full bg-white/20 text-white`}>
            {results[0].examType} — Sem {results[0].semester}
          </span>
        )}
      </div>

      {/* Results Accordion */}
      {results.length === 0 ? (
        <div className="text-center py-8 text-gray-400 text-sm">No results declared yet.</div>
      ) : (
        results.map((r) => (
          <div key={r._id} className="bg-white rounded-2xl shadow-sm overflow-hidden">
            {/* Accordion Header */}
            <button
              onClick={() => setExpanded(expanded === r._id ? null : r._id)}
              className="w-full flex items-center justify-between px-4 py-3.5 text-left"
            >
              <div>
                <p className="text-sm font-bold text-gray-800">Semester {r.semester}</p>
                <p className="text-xs text-gray-400">{r.examType} • {new Date(r.declaredOn).toLocaleDateString("en-IN", { month: "short", year: "numeric" })}</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="text-sm font-bold text-[#3E4095]">GPA: {r.gpa.toFixed(1)}</p>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${resultBadge[r.result]}`}>
                    {r.result}
                  </span>
                </div>
                {expanded === r._id ? (
                  <ChevronUpIcon className="w-4 h-4 text-gray-400" />
                ) : (
                  <ChevronDownIcon className="w-4 h-4 text-gray-400" />
                )}
              </div>
            </button>

            {/* Expanded: Subject table */}
            {expanded === r._id && (
              <div className="border-t border-gray-100 px-4 pb-4">
                <div className="mt-3 space-y-2">
                  {(r.subjects || []).map((s, i) => {
                    const total = s.internal + s.external;
                    const max = s.maxInternal + s.maxExternal;
                    const pct = Math.round((total / max) * 100);
                    const gc = gradeColor[s.grade] || "text-gray-700 bg-gray-50";
                    return (
                      <div key={i} className="flex items-center gap-3 py-2 border-b border-gray-50 last:border-0">
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-gray-700 leading-snug">{s.subjectName}</p>
                          <p className="text-[10px] text-gray-400">{s.subjectCode} • {s.credits} cr</p>
                        </div>
                        <div className="text-center shrink-0">
                          <p className="text-xs font-bold text-gray-800">{total}/{max}</p>
                          <p className="text-[10px] text-gray-400">{pct}%</p>
                        </div>
                        <span className={`shrink-0 w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold ${gc}`}>
                          {s.grade}
                        </span>
                      </div>
                    );
                  })}
                </div>
                {/* Sem-level stats */}
                <div className="mt-3 flex gap-4 text-xs text-gray-400 justify-end">
                  <span>GPA: <strong className="text-gray-700">{r.gpa.toFixed(2)}</strong></span>
                  <span>CGPA: <strong className="text-[#3E4095]">{r.cgpa.toFixed(2)}</strong></span>
                </div>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}

function Skeleton() {
  return (
    <div className="px-4 pt-4 space-y-3">
      <div className="skeleton h-36 w-full rounded-2xl" />
      {[...Array(2)].map((_, i) => <div key={i} className="skeleton h-20 w-full rounded-2xl" />)}
    </div>
  );
}

function ErrorState({ msg }) {
  return (
    <div className="px-4 pt-8 flex flex-col items-center gap-2 text-center">
      <ChartBarIcon className="w-12 h-12 text-gray-300" />
      <p className="text-sm text-gray-400">{msg}</p>
    </div>
  );
}
