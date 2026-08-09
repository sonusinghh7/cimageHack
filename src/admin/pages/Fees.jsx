import React, { useEffect, useState } from 'react';
import { adminFeesApi } from '../api/adminApi';
import { MagnifyingGlassIcon, CreditCardIcon } from '@heroicons/react/24/outline';

export default function Fees() {
  const [fees, setFees] = useState([]);
  const [totalDue, setTotalDue] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    adminFeesApi.getAll()
      .then(d => { setFees(d.fees || []); setTotalDue(d.totalDue || 0); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = fees.filter(f =>
    !search ||
    f.student?.name?.toLowerCase().includes(search.toLowerCase()) ||
    f.student?.studentId?.toLowerCase().includes(search.toLowerCase())
  );

  const totalPaid = fees.reduce((s, f) => s + (f.payments || []).reduce((ps, p) => ps + p.amount, 0), 0);

  return (
    <div className="p-6 space-y-4">
      <div>
        <h2 className="text-lg font-bold text-gray-800">Fee Management</h2>
        <p className="text-xs text-gray-400">Track all student fee records</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-green-50 rounded-2xl p-4 text-center">
          <p className="text-2xl font-extrabold text-green-700">₹{totalPaid.toLocaleString('en-IN')}</p>
          <p className="text-xs text-green-600 font-medium mt-0.5">Total Collected</p>
        </div>
        <div className="bg-red-50 rounded-2xl p-4 text-center">
          <p className="text-2xl font-extrabold text-red-600">₹{totalDue.toLocaleString('en-IN')}</p>
          <p className="text-xs text-red-500 font-medium mt-0.5">Total Outstanding</p>
        </div>
        <div className="bg-blue-50 rounded-2xl p-4 text-center">
          <p className="text-2xl font-extrabold text-blue-700">{fees.length}</p>
          <p className="text-xs text-blue-600 font-medium mt-0.5">Total Fee Records</p>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-xs">
        <MagnifyingGlassIcon className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search student..." className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#3E4095]" />
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase">Student</th>
                <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase">Semester</th>
                <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase">Total Fee</th>
                <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase">Paid</th>
                <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase">Due</th>
                <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase">Status</th>
                <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase">Due Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? [...Array(5)].map((_, i) => (
                <tr key={i}>{[...Array(7)].map((_, j) => <td key={j} className="px-4 py-3"><div className="skeleton h-4 rounded w-full" /></td>)}</tr>
              )) : filtered.length === 0 ? (
                <tr><td colSpan={7} className="text-center py-10 text-gray-400">No fee records found.</td></tr>
              ) : filtered.map((f) => {
                const paid = (f.payments || []).reduce((s, p) => s + p.amount, 0);
                const due = Math.max(0, f.totalFee - paid);
                const status = paid >= f.totalFee ? 'Paid' : paid > 0 ? 'Partial' : 'Due';
                const statusColor = { Paid: 'bg-green-100 text-green-700', Partial: 'bg-amber-100 text-amber-700', Due: 'bg-red-100 text-red-700' };
                return (
                  <tr key={f._id} className="hover:bg-gray-50 transition">
                    <td className="px-4 py-3">
                      <p className="font-semibold text-gray-800">{f.student?.name}</p>
                      <p className="text-xs text-gray-400">{f.student?.studentId}</p>
                    </td>
                    <td className="px-4 py-3 text-gray-600">Sem {f.semester} <span className="text-xs text-gray-400">({f.academicYear})</span></td>
                    <td className="px-4 py-3 font-semibold text-gray-800">₹{f.totalFee?.toLocaleString('en-IN')}</td>
                    <td className="px-4 py-3 text-green-600 font-semibold">₹{paid.toLocaleString('en-IN')}</td>
                    <td className="px-4 py-3 text-red-600 font-semibold">{due > 0 ? `₹${due.toLocaleString('en-IN')}` : '—'}</td>
                    <td className="px-4 py-3"><span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${statusColor[status]}`}>{status}</span></td>
                    <td className="px-4 py-3 text-xs text-gray-500">{new Date(f.dueDate).toLocaleDateString('en-IN')}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
