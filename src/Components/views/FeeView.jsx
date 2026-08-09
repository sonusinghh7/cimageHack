import React, { useEffect, useState } from "react";
import { feeApi } from "../api";
import { CreditCardIcon, CheckIcon, ExclamationTriangleIcon } from "@heroicons/react/24/outline";

const statusStyle = {
  Paid:    { badge: "bg-green-100 text-green-700",  bg: "bg-green-50",  bar: "bg-green-500"  },
  Partial: { badge: "bg-amber-100 text-amber-700",  bg: "bg-amber-50",  bar: "bg-amber-500"  },
  Due:     { badge: "bg-red-100 text-red-700",      bg: "bg-red-50",    bar: "bg-red-500"    },
};

export default function FeeView() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    const ctrl = new AbortController();
    feeApi.get(ctrl.signal)
      .then((d) => {
        setData(d);
        if (d.fees?.length > 0) setExpanded(d.fees[0]._id);
      })
      .catch((e) => { if (e.name !== "AbortError") setError(e.message); })
      .finally(() => setLoading(false));
    return () => ctrl.abort();
  }, []);

  if (loading) return <Skeleton />;
  if (error)   return <ErrorState msg={error} />;
  if (!data)   return <ErrorState msg="No fee data available." />;

  const totalDue = data.totalDue || 0;

  return (
    <div className="px-4 pt-4 pb-8 space-y-4">
      {/* Total Due Banner */}
      {totalDue > 0 ? (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center shrink-0">
            <ExclamationTriangleIcon className="w-5 h-5 text-red-500" />
          </div>
          <div>
            <p className="text-sm font-bold text-red-700">Outstanding Due</p>
            <p className="text-lg font-extrabold text-red-600">₹{totalDue.toLocaleString("en-IN")}</p>
          </div>
        </div>
      ) : (
        <div className="bg-green-50 border border-green-200 rounded-2xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center shrink-0">
            <CheckIcon className="w-5 h-5 text-green-500" />
          </div>
          <div>
            <p className="text-sm font-bold text-green-700">All fees paid</p>
            <p className="text-xs text-green-600">No outstanding dues</p>
          </div>
        </div>
      )}

      {/* Semester Fee Cards */}
      {(data.fees || []).map((fee) => {
        const paid = fee.paidAmount ?? fee.payments?.reduce((s, p) => s + p.amount, 0) ?? 0;
        const due  = fee.dueAmount  ?? Math.max(0, fee.totalFee - paid);
        const pct  = fee.totalFee > 0 ? Math.round((paid / fee.totalFee) * 100) : 0;
        const status = paid >= fee.totalFee ? "Paid" : paid > 0 ? "Partial" : "Due";
        const s = statusStyle[status];
        const isExpanded = expanded === fee._id;

        return (
          <div key={fee._id} className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <button
              onClick={() => setExpanded(isExpanded ? null : fee._id)}
              className="w-full px-4 py-3.5 flex items-center justify-between text-left"
            >
              <div>
                <p className="text-sm font-bold text-gray-800">Semester {fee.semester}</p>
                <p className="text-xs text-gray-400">{fee.academicYear} • Due: {new Date(fee.dueDate).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="text-sm font-bold text-gray-800">₹{fee.totalFee.toLocaleString("en-IN")}</p>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${s.badge}`}>{status}</span>
                </div>
              </div>
            </button>

            {/* Progress bar */}
            <div className="px-4 pb-3">
              <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div className={`h-full ${s.bar} rounded-full`} style={{ width: `${pct}%` }} />
              </div>
              <div className="flex justify-between text-[10px] text-gray-400 mt-1">
                <span>Paid: ₹{paid.toLocaleString("en-IN")}</span>
                {due > 0 && <span className="text-red-500">Due: ₹{due.toLocaleString("en-IN")}</span>}
              </div>
            </div>

            {/* Expanded breakdown */}
            {isExpanded && (
              <div className="border-t border-gray-100 px-4 pb-4">
                <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold mt-3 mb-2">Fee Breakdown</p>
                {fee.feeBreakdown && (
                  <div className="space-y-1.5">
                    {Object.entries(fee.feeBreakdown).map(([key, val]) =>
                      val > 0 ? (
                        <div key={key} className="flex justify-between text-xs">
                          <span className="text-gray-500 capitalize">{key.replace(/([A-Z])/g, " $1")}</span>
                          <span className="font-semibold text-gray-700">₹{val.toLocaleString("en-IN")}</span>
                        </div>
                      ) : null
                    )}
                    <div className="border-t pt-1.5 flex justify-between text-xs font-bold">
                      <span>Total</span>
                      <span>₹{fee.totalFee.toLocaleString("en-IN")}</span>
                    </div>
                  </div>
                )}

                {fee.payments?.length > 0 && (
                  <>
                    <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold mt-3 mb-2">Payments</p>
                    {fee.payments.map((p, i) => (
                      <div key={i} className="flex justify-between items-center text-xs py-1.5 border-b border-gray-50 last:border-0">
                        <div>
                          <p className="font-semibold text-gray-700">₹{p.amount.toLocaleString("en-IN")}</p>
                          <p className="text-gray-400">{p.mode} • {p.transactionId}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-gray-500">{new Date(p.paidOn).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}</p>
                          <p className="text-[10px] text-gray-400">{p.receiptNo}</p>
                        </div>
                      </div>
                    ))}
                  </>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function Skeleton() {
  return (
    <div className="px-4 pt-4 space-y-3">
      <div className="skeleton h-20 w-full rounded-2xl" />
      {[...Array(2)].map((_, i) => <div key={i} className="skeleton h-28 w-full rounded-2xl" />)}
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
