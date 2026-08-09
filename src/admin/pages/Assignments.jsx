import React, { useEffect, useState } from 'react';
import { adminAssignmentsApi, adminCoursesApi } from '../api/adminApi';
import { PlusIcon, TrashIcon, ClipboardDocumentListIcon } from '@heroicons/react/24/outline';

function Toast({ msg, type }) {
  if (!msg) return null;
  return <div className={`fixed top-5 right-5 z-[999] px-4 py-3 rounded-xl text-sm font-medium shadow-xl border ${type === 'error' ? 'bg-red-50 text-red-700 border-red-200' : 'bg-green-50 text-green-700 border-green-200'}`}>{msg}</div>;
}

const blank = { title: '', description: '', course: '', dueDate: '', maxMarks: 100 };

export default function Assignments() {
  const [assignments, setAssignments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(blank);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState({ msg: '', type: 'success' });

  const showToast = (msg, type = 'success') => { setToast({ msg, type }); setTimeout(() => setToast({ msg: '', type: 'success' }), 3000); };

  const load = async () => {
    try {
      const [ad, cd] = await Promise.all([adminAssignmentsApi.getAll(), adminCoursesApi.getAll()]);
      setAssignments(ad.assignments || []);
      setCourses(cd.courses || []);
    } catch (err) { showToast(err.message, 'error'); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await adminAssignmentsApi.create(form);
      showToast('Assignment created!');
      setShowModal(false);
      setForm(blank);
      load();
    } catch (err) { showToast(err.message, 'error'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this assignment?')) return;
    try { await adminAssignmentsApi.delete(id); showToast('Deleted.'); load(); }
    catch (err) { showToast(err.message, 'error'); }
  };

  const now = new Date();

  return (
    <div className="p-6 space-y-4">
      <Toast {...toast} />
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-gray-800">Assignments ({assignments.length})</h2>
          <p className="text-xs text-gray-400">Create and manage assignments</p>
        </div>
        <button onClick={() => setShowModal(true)} className="flex items-center gap-2 px-4 py-2.5 bg-[#3E4095] text-white rounded-xl text-sm font-semibold hover:bg-[#282A61] transition">
          <PlusIcon className="w-4 h-4" /> Create Assignment
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {[...Array(4)].map((_, i) => <div key={i} className="skeleton h-32 rounded-2xl" />)}
        </div>
      ) : assignments.length === 0 ? (
        <div className="text-center py-12 text-gray-400 text-sm">No assignments yet.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {assignments.map(a => {
            const due = new Date(a.dueDate);
            const isOverdue = due < now;
            const daysLeft = Math.ceil((due - now) / (1000 * 60 * 60 * 24));
            return (
              <div key={a._id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-gray-800 leading-snug">{a.title}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{a.course?.name} ({a.course?.code})</p>
                  </div>
                  <button onClick={() => handleDelete(a._id)} className="p-1.5 rounded-lg hover:bg-red-50 text-red-500 transition shrink-0"><TrashIcon className="w-4 h-4" /></button>
                </div>
                {a.description && <p className="text-xs text-gray-500 mb-2 leading-relaxed line-clamp-2">{a.description}</p>}
                <div className="flex flex-wrap gap-1.5 text-[10px]">
                  <span className={`px-2 py-0.5 rounded-full font-semibold ${isOverdue ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                    {isOverdue ? `${Math.abs(daysLeft)}d overdue` : daysLeft === 0 ? 'Due today' : `${daysLeft}d left`}
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">Max: {a.maxMarks}M</span>
                  <span className="px-2 py-0.5 rounded-full bg-violet-100 text-violet-700">{a.submissions?.length || 0} submissions</span>
                </div>
                <p className="text-[10px] text-gray-400 mt-2">Due: {due.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
              </div>
            );
          })}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-gray-100">
              <h3 className="text-base font-bold">Create Assignment</h3>
              <button onClick={() => setShowModal(false)} className="p-1.5 rounded-full hover:bg-gray-100 text-gray-500">✕</button>
            </div>
            <form onSubmit={handleSave} className="px-6 py-4 space-y-3">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Title *</label>
                <input value={form.title} onChange={e => setForm({...form, title: e.target.value})} required className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#3E4095]" placeholder="Assignment title" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Course *</label>
                <select value={form.course} onChange={e => setForm({...form, course: e.target.value})} required className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#3E4095] bg-white">
                  <option value="">Select course</option>
                  {courses.map(c => <option key={c._id} value={c._id}>{c.name} ({c.code})</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Description</label>
                <textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})} rows={3} className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#3E4095] resize-none" placeholder="Assignment instructions..." />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Due Date *</label>
                  <input type="date" value={form.dueDate} onChange={e => setForm({...form, dueDate: e.target.value})} required className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#3E4095]" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Max Marks</label>
                  <input type="number" value={form.maxMarks} onChange={e => setForm({...form, maxMarks: Number(e.target.value)})} className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#3E4095]" />
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold text-gray-600">Cancel</button>
                <button type="submit" disabled={saving} className="flex-1 py-2.5 bg-[#3E4095] text-white rounded-xl text-sm font-semibold hover:bg-[#282A61] transition disabled:opacity-60">
                  {saving ? 'Creating...' : 'Create Assignment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
