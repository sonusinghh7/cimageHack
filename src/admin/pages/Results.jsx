import React, { useEffect, useState } from 'react';
import { adminResultsApi, adminStudentsApi } from '../api/adminApi';
import { PlusIcon, ChartBarIcon } from '@heroicons/react/24/outline';

function Toast({ msg, type }) {
  if (!msg) return null;
  return <div className={`fixed top-5 right-5 z-[999] px-4 py-3 rounded-xl text-sm font-medium shadow-xl border ${type === 'error' ? 'bg-red-50 text-red-700 border-red-200' : 'bg-green-50 text-green-700 border-green-200'}`}>{msg}</div>;
}

export default function Results() {
  const [results, setResults] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState({ msg: '', type: 'success' });
  const [form, setForm] = useState({ student: '', semester: 5, examType: 'End Semester', gpa: '', cgpa: '', result: 'Pass', subjects: [] });

  const showToast = (msg, type = 'success') => { setToast({ msg, type }); setTimeout(() => setToast({ msg: '', type: 'success' }), 3000); };

  useEffect(() => {
    Promise.all([adminResultsApi.getAll(), adminStudentsApi.getAll()])
      .then(([rd, sd]) => { setResults(rd.results || []); setStudents(sd.students || []); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await adminResultsApi.add(form);
      showToast('Result added successfully!');
      setShowModal(false);
      const d = await adminResultsApi.getAll();
      setResults(d.results || []);
    } catch (err) { showToast(err.message, 'error'); }
    finally { setSaving(false); }
  };

  const gradeColor = { O: 'text-emerald-600', 'A+': 'text-blue-600', A: 'text-blue-500', 'B+': 'text-violet-600', B: 'text-violet-500', C: 'text-amber-600', D: 'text-orange-600', F: 'text-red-600' };

  return (
    <div className="p-6 space-y-4">
      <Toast {...toast} />
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-gray-800">Results ({results.length})</h2>
          <p className="text-xs text-gray-400">Manage semester results</p>
        </div>
        <button onClick={() => setShowModal(true)} className="flex items-center gap-2 px-4 py-2.5 bg-[#3E4095] text-white rounded-xl text-sm font-semibold hover:bg-[#282A61] transition">
          <PlusIcon className="w-4 h-4" /> Add Result
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase">Student</th>
                <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase">Semester</th>
                <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase">Exam Type</th>
                <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase">GPA</th>
                <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase">CGPA</th>
                <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase">Result</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? [...Array(4)].map((_, i) => <tr key={i}>{[...Array(6)].map((_, j) => <td key={j} className="px-4 py-3"><div className="skeleton h-4 rounded" /></td>)}</tr>) :
               results.length === 0 ? <tr><td colSpan={6} className="text-center py-10 text-gray-400">No results found.</td></tr> :
               results.map(r => (
                <tr key={r._id} className="hover:bg-gray-50">
                  <td className="px-4 py-3"><p className="font-semibold text-gray-800">{r.student?.name}</p><p className="text-xs text-gray-400">{r.student?.studentId}</p></td>
                  <td className="px-4 py-3 text-gray-600">Sem {r.semester}</td>
                  <td className="px-4 py-3 text-gray-600">{r.examType}</td>
                  <td className="px-4 py-3 font-bold text-[#3E4095]">{r.gpa?.toFixed(2)}</td>
                  <td className="px-4 py-3 font-bold text-gray-800">{r.cgpa?.toFixed(2)}</td>
                  <td className="px-4 py-3"><span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${r.result === 'Pass' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{r.result}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-gray-100">
              <h3 className="text-base font-bold">Add Result</h3>
              <button onClick={() => setShowModal(false)} className="p-1.5 rounded-full hover:bg-gray-100 text-gray-500">✕</button>
            </div>
            <form onSubmit={handleSave} className="px-6 py-4 space-y-3">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Student *</label>
                <select value={form.student} onChange={e => setForm({...form, student: e.target.value})} required className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#3E4095] bg-white">
                  <option value="">Select student</option>
                  {students.map(s => <option key={s._id} value={s._id}>{s.name} ({s.studentId})</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Semester</label>
                  <select value={form.semester} onChange={e => setForm({...form, semester: Number(e.target.value)})} className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#3E4095] bg-white">
                    {[1,2,3,4,5,6,7,8].map(s => <option key={s} value={s}>Sem {s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Exam Type</label>
                  <select value={form.examType} onChange={e => setForm({...form, examType: e.target.value})} className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#3E4095] bg-white">
                    {['End Semester','Mid Semester','Supplementary'].map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">GPA</label>
                  <input type="number" step="0.01" min="0" max="10" value={form.gpa} onChange={e => setForm({...form, gpa: e.target.value})} required className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#3E4095]" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">CGPA</label>
                  <input type="number" step="0.01" min="0" max="10" value={form.cgpa} onChange={e => setForm({...form, cgpa: e.target.value})} required className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#3E4095]" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Result</label>
                <select value={form.result} onChange={e => setForm({...form, result: e.target.value})} className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#3E4095] bg-white">
                  {['Pass','Fail','Detained','Withheld'].map(r => <option key={r}>{r}</option>)}
                </select>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold text-gray-600">Cancel</button>
                <button type="submit" disabled={saving} className="flex-1 py-2.5 bg-[#3E4095] text-white rounded-xl text-sm font-semibold hover:bg-[#282A61] transition disabled:opacity-60">
                  {saving ? 'Saving...' : 'Add Result'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
