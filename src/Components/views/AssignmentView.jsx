import React, { useEffect, useState, useRef } from "react";
import { assignmentApi } from "../api";
import { DocumentTextIcon, PaperClipIcon, CheckIcon, ClockIcon, ExclamationTriangleIcon } from "@heroicons/react/24/outline";

const chipStyle = {
  Submitted: "bg-green-100 text-green-700",
  Pending:   "bg-amber-100 text-amber-700",
  Overdue:   "bg-red-100 text-red-700",
};

function getStatus(a) {
  if (a.submitted) return "Submitted";
  if (a.isOverdue)  return "Overdue";
  return "Pending";
}

function daysUntil(dateStr) {
  const diff = new Date(dateStr) - new Date();
  const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
  if (days < 0) return `${Math.abs(days)}d overdue`;
  if (days === 0) return "Due today";
  return `${days}d left`;
}

export default function AssignmentView() {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(null); // assignment _id being uploaded
  const [toast, setToast] = useState("");
  const fileInputRef = useRef();
  const activeUploadId = useRef(null);

  useEffect(() => {
    const ctrl = new AbortController();
    assignmentApi.getAll(ctrl.signal)
      .then((d) => setAssignments(d.assignments || []))
      .catch((e) => { if (e.name !== "AbortError") setError(e.message); })
      .finally(() => setLoading(false));
    return () => ctrl.abort();
  }, []);

  const handleUploadClick = (id) => {
    activeUploadId.current = id;
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !activeUploadId.current) return;
    setUploading(activeUploadId.current);
    const fd = new FormData();
    fd.append("file", file);
    try {
      await assignmentApi.submit(activeUploadId.current, fd);
      setAssignments((prev) =>
        prev.map((a) =>
          a._id === activeUploadId.current
            ? { ...a, submitted: true, isOverdue: false, submission: { fileName: file.name, submittedAt: new Date().toISOString() } }
            : a
        )
      );
      showToast("Assignment submitted! ✓");
    } catch (err) {
      showToast(err.message || "Upload failed");
    } finally {
      setUploading(null);
      e.target.value = "";
    }
  };

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  if (loading) return <Skeleton />;
  if (error)   return <ErrorState msg={error} />;

  const pending   = assignments.filter((a) => !a.submitted && !a.isOverdue);
  const overdue   = assignments.filter((a) => !a.submitted && a.isOverdue);
  const submitted = assignments.filter((a) => a.submitted);

  return (
    <div className="px-4 pt-4 pb-8 space-y-4">
      {/* Toast */}
      {toast && (
        <div className="toast bg-white shadow-lg rounded-xl px-4 py-3 text-sm font-medium text-gray-700 border border-gray-200">
          {toast}
        </div>
      )}

      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept=".pdf,.doc,.docx,.zip,.png,.jpg"
        onChange={handleFileChange}
      />

      {/* Stats */}
      <div className="flex gap-3">
        <MiniStat label="Pending" value={pending.length}   color="text-amber-600" />
        <MiniStat label="Overdue" value={overdue.length}   color="text-red-500"   />
        <MiniStat label="Done"    value={submitted.length} color="text-green-600" />
      </div>

      {/* Overdue */}
      {overdue.length > 0 && (
        <Section title="Overdue" icon={<ExclamationTriangleIcon className="w-4 h-4 text-red-500" />}>
          {overdue.map((a) => <AssignmentCard key={a._id} a={a} onUpload={handleUploadClick} uploading={uploading} />)}
        </Section>
      )}

      {/* Pending */}
      {pending.length > 0 && (
        <Section title="Pending" icon={<ClockIcon className="w-4 h-4 text-amber-500" />}>
          {pending.map((a) => <AssignmentCard key={a._id} a={a} onUpload={handleUploadClick} uploading={uploading} />)}
        </Section>
      )}

      {/* Submitted */}
      {submitted.length > 0 && (
        <Section title="Submitted" icon={<CheckIcon className="w-4 h-4 text-green-500" />}>
          {submitted.map((a) => <AssignmentCard key={a._id} a={a} onUpload={handleUploadClick} uploading={uploading} />)}
        </Section>
      )}

      {assignments.length === 0 && (
        <div className="text-center py-12 text-gray-400 text-sm">No assignments found.</div>
      )}
    </div>
  );
}

function Section({ title, icon, children }) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-2 px-1">
        {icon}
        <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400">{title}</h3>
      </div>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

function AssignmentCard({ a, onUpload, uploading }) {
  const status = getStatus(a);
  const chip = chipStyle[status];
  const isUploading = uploading === a._id;

  return (
    <div className="bg-white rounded-2xl shadow-sm p-4">
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-gray-800 leading-snug">{a.title}</p>
          <p className="text-xs text-gray-500 mt-0.5">{a.course?.name} ({a.course?.code})</p>
        </div>
        <span className={`shrink-0 text-[10px] font-semibold px-2 py-0.5 rounded-full ${chip}`}>
          {status}
        </span>
      </div>

      {a.description && (
        <p className="text-xs text-gray-400 leading-relaxed mb-2 line-clamp-2">{a.description}</p>
      )}

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 text-xs text-gray-400">
          <span>Due: {new Date(a.dueDate).toLocaleDateString("en-IN", { day: "2-digit", month: "short" })}</span>
          <span className={`font-semibold ${status === "Overdue" ? "text-red-500" : status === "Pending" ? "text-amber-600" : "text-green-600"}`}>
            {daysUntil(a.dueDate)}
          </span>
          <span>Max: {a.maxMarks} marks</span>
        </div>
      </div>

      {/* Submission info or Upload button */}
      {a.submitted ? (
        <div className="mt-2 flex items-center gap-1.5 text-xs text-green-600">
          <PaperClipIcon className="w-3.5 h-3.5" />
          <span className="truncate">{a.submission?.fileName || "File submitted"}</span>
          {a.submission?.grade && (
            <span className="ml-auto font-bold text-[#3E4095]">Grade: {a.submission.grade}</span>
          )}
        </div>
      ) : (
        <button
          onClick={() => onUpload(a._id)}
          disabled={isUploading}
          className={`mt-3 w-full py-2 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-2 ${
            isUploading
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-[#3E4095] text-white hover:bg-[#282A61] active:scale-[0.98]"
          }`}
        >
          {isUploading ? (
            <><div className="w-3.5 h-3.5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" /> Uploading...</>
          ) : (
            <><PaperClipIcon className="w-3.5 h-3.5" /> Submit Assignment</>
          )}
        </button>
      )}
    </div>
  );
}

function MiniStat({ label, value, color }) {
  return (
    <div className="flex-1 bg-white rounded-xl shadow-sm py-3 text-center">
      <p className={`text-xl font-bold ${color}`}>{value}</p>
      <p className="text-[10px] text-gray-400 uppercase tracking-wide mt-0.5">{label}</p>
    </div>
  );
}

function Skeleton() {
  return (
    <div className="px-4 pt-4 space-y-3">
      {[...Array(4)].map((_, i) => <div key={i} className="skeleton h-32 w-full rounded-2xl" />)}
    </div>
  );
}

function ErrorState({ msg }) {
  return (
    <div className="px-4 pt-8 flex flex-col items-center gap-2 text-center">
      <DocumentTextIcon className="w-12 h-12 text-gray-300" />
      <p className="text-sm text-gray-400">{msg}</p>
    </div>
  );
}
