import React, { useEffect, useState } from 'react';
import { adminAttendanceApi } from '../api/adminApi';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

const STATUS_STYLE = {
  Safe:     'bg-green-100 text-green-700',
  Warning:  'bg-amber-100 text-amber-700',
  Critical: 'bg-red-100 text-red-700',
};

export default function AttendanceAdmin() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterBranch, setFilterBranch] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  useEffect(() => {
    const p = new URLSearchParams();
    if (filterBranch) p.set('branch', filterBranch);
    adminAttendanceApi.getAll(`?${p}`)
      .then(d => setData(d.attendance || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [filterBranch]);

  const filtered = data.filter(r => {
    const matchSearch = !search || r.student?.name?.toLowerCase().includes(search.toLowerCase()) || r.student?.studentId?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = !filterStatus || r.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const safe = data.filter(r => r.status === 'Safe').length;
  const warn = data.filter(r => r.status === 'Warning').length;
  const crit = data.filter(r => r.status === 'Critical').length;

  return (
    <div className="p-6 space-y-4">
      <div>
        <h2 className="text-lg font-bold text-gray-800">Attendance Overview</h2>
        <p className="text-xs text-gray-400">Overall attendance status of all students</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        {[{ label: 'Safe (≥75%)', value: safe, cls: 'bg-green-50 text-green-700' },
          { label: 'Warning (≥60%)', value: warn, cls: 'bg-amber-50 text-amber-700' },
          { label: 'Critical (<60%)', value: crit, cls: 'bg-red-50 text-red-700' }
        ].map(s => (
          <div key={s.label} className={`${s.cls} rounded-2xl p-4 text-center`}>
            <p className="text-2xl font-extrabold">{s.value}</p>
            <p className="text-xs font-medium mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-48">
          <MagnifyingGlassIcon className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search student..." className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#3E4095]" />
        </div>
        <select value={filterBranch} onChange={e => setFilterBranch(e.target.value)} className="px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none bg-white">
          <option value="">All Branches</option>
          {['CSE','IT','ECE','ME','CE','EEE'].map(b => <option key={b}>{b}</option>)}
        </select>
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none bg-white">
          <option value="">All Status</option>
          {['Safe','Warning','Critical'].map(s => <option key={s}>{s}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase">Student</th>
                <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase">Branch / Sem</th>
                <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase">Present</th>
                <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase">Total</th>
                <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase">%</th>
                <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? [...Array(5)].map((_, i) => (
                <tr key={i}>{[...Array(6)].map((_, j) => <td key={j} className="px-4 py-3"><div className="skeleton h-4 rounded w-full" /></td>)}</tr>
              )) : filtered.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-10 text-gray-400">No records found.</td></tr>
              ) : filtered.map((r, i) => (
                <tr key={i} className="hover:bg-gray-50 transition">
                  <td className="px-4 py-3">
                    <p className="font-semibold text-gray-800">{r.student?.name}</p>
                    <p className="text-xs text-gray-400">{r.student?.studentId}</p>
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-600">{r.student?.branch} • Sem {r.student?.semester}</td>
                  <td className="px-4 py-3 text-green-600 font-bold">{r.totalPresent}</td>
                  <td className="px-4 py-3 text-gray-600">{r.totalClasses}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden w-16">
                        <div className={`h-full rounded-full ${r.percentage >= 75 ? 'bg-green-500' : r.percentage >= 60 ? 'bg-amber-500' : 'bg-red-500'}`} style={{ width: `${r.percentage}%` }} />
                      </div>
                      <span className="font-bold text-gray-700">{r.percentage}%</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${STATUS_STYLE[r.status] || ''}`}>{r.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
