import React, { useEffect, useState, useRef } from "react";
import { admitCardApi } from "../api";
import { CreditCardIcon, PrinterIcon } from "@heroicons/react/24/outline";

export default function AdmitCardView({ student }) {
  const [admitCard, setAdmitCard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const printRef = useRef();

  useEffect(() => {
    const ctrl = new AbortController();
    admitCardApi.get(ctrl.signal)
      .then((d) => setAdmitCard(d.admitCard))
      .catch((e) => { if (e.name !== "AbortError") setError(e.message); })
      .finally(() => setLoading(false));
    return () => ctrl.abort();
  }, []);

  const handlePrint = () => window.print();

  if (loading) return <Skeleton />;
  if (error)   return <ErrorState msg={error} />;
  if (!admitCard) return <ErrorState msg="Admit card not available. Contact admin." />;

  const s = admitCard.student || student;

  return (
    <div className="px-4 pt-4 pb-8 space-y-4">
      {/* Eligibility Banner */}
      {!admitCard.isEligible && (
        <div className="bg-red-50 border border-red-200 rounded-2xl px-4 py-3 text-sm text-red-600 font-medium">
          ⚠️ Not eligible: {admitCard.ineligibilityReason || "Contact admin"}
        </div>
      )}

      {/* Admit Card */}
      <div
        ref={printRef}
        className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-200"
      >
        {/* Header */}
        <div className="p-4 text-white text-center"
          style={{ background: "linear-gradient(135deg, #3E4095 0%, #5B5FC7 100%)" }}>
          <img src="/logo2.png" alt="Cimage" className="h-10 w-auto mx-auto mb-2" onError={(e) => e.target.style.display = "none"} />
          <h2 className="text-base font-bold">Cimage Group of Institutions</h2>
          <p className="text-xs text-white/70 mt-0.5">Hall Ticket / Admit Card</p>
          <p className="text-xs text-white/60">{admitCard.examType} Examination — {admitCard.academicYear}</p>
        </div>

        {/* Student Info */}
        <div className="p-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-16 h-16 rounded-xl bg-gray-100 overflow-hidden border-2 border-[#3E4095]/20 shrink-0">
              {s?.photo ? (
                <img src={s.photo} alt="Photo" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-2xl font-bold text-gray-400">
                  {s?.name?.charAt(0) || "S"}
                </div>
              )}
            </div>
            <div>
              <p className="text-base font-bold text-gray-800">{s?.name}</p>
              <p className="text-xs text-gray-500 mt-0.5">Student ID: <strong>{s?.studentId}</strong></p>
              <p className="text-xs text-gray-500">Branch: {s?.branch} | Semester: {s?.semester}</p>
              <p className="text-xs text-gray-500">Batch: {s?.batch} | Gender: {s?.gender}</p>
            </div>
          </div>

          <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
            <InfoRow label="Exam Center" value={admitCard.examCenter} />
            <InfoRow label="Center Code" value={admitCard.examCenterCode} />
            <InfoRow label="Issue Date" value={new Date(admitCard.issueDate).toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" })} />
            <InfoRow label="Status" value={admitCard.isEligible ? "✅ Eligible" : "❌ Not Eligible"} />
          </div>
        </div>

        {/* Exam Schedule */}
        <div className="p-4">
          <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">Examination Schedule</p>
          <div className="space-y-2">
            {(admitCard.subjects || []).map((sub, i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0 gap-2">
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-gray-800 leading-snug">{sub.subjectName}</p>
                  <p className="text-[10px] text-gray-400">{sub.subjectCode}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-xs font-bold text-gray-700">
                    {new Date(sub.examDate).toLocaleDateString("en-IN", { day: "2-digit", month: "short" })}
                  </p>
                  <p className="text-[10px] text-gray-400">{sub.examTime}</p>
                  <p className="text-[10px] text-gray-400">{sub.duration} | {sub.maxMarks}M</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="px-4 pb-4 pt-2 border-t border-gray-100 text-center">
          <p className="text-[10px] text-gray-400">
            This is a computer-generated admit card. Carry a valid photo ID on the day of examination.
          </p>
          <div className="mt-3 flex items-end justify-between">
            <div className="text-left">
              <div className="h-8 w-24 border-b border-gray-400" />
              <p className="text-[9px] text-gray-400 mt-0.5">Candidate Signature</p>
            </div>
            <div className="text-right">
              <div className="h-8 w-24 border-b border-gray-400" />
              <p className="text-[9px] text-gray-400 mt-0.5">Controller of Exams</p>
            </div>
          </div>
        </div>
      </div>

      {/* Print button */}
      <button
        onClick={handlePrint}
        className="w-full flex items-center justify-center gap-2 py-3.5 bg-[#3E4095] text-white rounded-2xl font-semibold text-sm hover:bg-[#282A61] active:scale-[0.98] transition-all"
      >
        <PrinterIcon className="w-5 h-5" />
        Download / Print Admit Card
      </button>
    </div>
  );
}

function InfoRow({ label, value }) {
  return (
    <div>
      <p className="text-[10px] text-gray-400 uppercase tracking-wide">{label}</p>
      <p className="text-xs font-semibold text-gray-700 mt-0.5">{value}</p>
    </div>
  );
}

function Skeleton() {
  return (
    <div className="px-4 pt-4 space-y-3">
      <div className="skeleton h-32 w-full rounded-2xl" />
      <div className="skeleton h-64 w-full rounded-2xl" />
    </div>
  );
}

function ErrorState({ msg }) {
  return (
    <div className="px-4 pt-8 flex flex-col items-center gap-2 text-center">
      <CreditCardIcon className="w-12 h-12 text-gray-300" />
      <p className="text-sm text-gray-400">{msg}</p>
    </div>
  );
}
