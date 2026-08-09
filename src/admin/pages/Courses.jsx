import React, { useEffect, useState } from 'react';
import { adminCoursesApi } from '../api/adminApi';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';

const BRANCHES = ['CSE', 'IT', 'ECE', 'ME', 'CE', 'EEE'];
const TYPES = ['Theory', 'Lab', 'Elective'];
const blank = { name: '', code: '', branch: 'CSE', semester: 5, faculty: '', credits: 4, type: 'Theory', description: '' };

function Toast({ msg, type }) {
  if (!msg) return null;
  return <div className={`fixed top-5 right-5 z-[999] px-4 py-3 rounded-xl text-sm font-medium shadow-xl border ${type === 'error' ? 'bg-red-50 text-red-700 border-red-200' : 'bg-green-50 text-green-700 border-green-200'}`}>{msg}</div>;
}

export default function Courses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterBranch, setFilterBranch] = useState('');
  const [filterSem, setFilterSem] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editCourse, setEditCourse] = useState(null);
  const [form, setForm] = useState(blank);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState({ msg: '', type: 'success' });

  const showToast = (msg, type = 'success') => { setToast({ msg, type }); setTimeout(() => setToast({ msg: '', type: 'success' }), 3000); };

  const load = async () => {
    setLoading(true);
    const p = new URLSearchParams();
    if (filterBranch) p.set('branch', filterBranch);
    if (filterSem) p.set('semester', filterSem);
    try {
      const d = await adminCoursesApi.getAll(`?${p}`);
      setCourses(d.courses || []);
    } catch (err) { showToast(err.message, 'error'); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, [filterBranch, filterSem]);

  const openAdd = () => { setEditCourse(null); setForm(blank); setShowModal(true); };
  const openEdit = (c) => { setEditCourse(c); setForm(c); setShowModal(true); };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editCourse) { await adminCoursesApi.update(editCourse._id, form); showToast('Course updated!'); }
      else { await adminCoursesApi.create(form); showToast('Course created!'); }
      setShowModal(false);
      load();
    } catch (err) { showToast(err.message, 'error'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this course?')) return;
    try { await adminCoursesApi.delete(id); showToast('Course deleted.'); load(); }
    catch (err) { showToast(err.message, 'error'); }
  };

  return (
    <div className="p-6">
      <Toast {...toast} />
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-lg font-bold text-gray-800">Courses ({courses.length})</h2>
          <p className="text-xs text-gray-400">Manage course catalogue</p>
        </div>
        <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2.5 bg-[#3E4095] text-white rounded-xl text-sm font-semibold hover:bg-[#282A61] transition">
          <PlusIcon className="w-4 h-4" /> Add Course
        </button>
      </div>

      <div className="flex gap-3 mb-4 flex-wrap">
        <select value={filterBranch} onChange={e => setFilterBranch(e.target.value)} className="px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#3E4095] bg-white">
          <option value="">All Branches</option>
          {BRANCHES.map(b => <option key={b}>{b}</option>)}
        </select>
        <select value={filterSem} onChange={e => setFilterSem(e.target.value)} className="px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#3E4095] bg-white">
          <option value="">All Semesters</option>
          {[1,2,3,4,5,6,7,8].map(s => <option key={s} value={s}>Sem {s}</option>)}
        </select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {loading ? [...Array(6)].map((_, i) => <div key={i} className="skeleton h-36 rounded-2xl" />) :
         courses.length === 0 ? <div className="col-span-full text-center py-10 text-gray-400">No courses found.</div> :
         courses.map(c => (
          <div key={c._id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
            <div className="flex items-start justify-between gap-2 mb-2">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-gray-800 leading-snug">{c.name}</p>
                <p className="text-xs text-gray-400 mt-0.5">{c.code}</p>
              </div>
              <div className="flex gap-1 shrink-0">
                <button onClick={() => openEdit(c)} className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-600 transition"><PencilIcon className="w-3.5 h-3.5" /></button>
                <button onClick={() => handleDelete(c._id)} className="p-1.5 rounded-lg hover:bg-red-50 text-red-600 transition"><TrashIcon className="w-3.5 h-3.5" /></button>
              </div>
            </div>
            <div className="flex flex-wrap gap-1.5 text-[10px]">
              <span className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full font-semibold">{c.branch}</span>
              <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full">Sem {c.semester}</span>
              <span className="px-2 py-0.5 bg-violet-50 text-violet-700 rounded-full">{c.type}</span>
              <span className="px-2 py-0.5 bg-green-50 text-green-700 rounded-full">{c.credits} cr</span>
            </div>
            {c.faculty && <p className="text-xs text-gray-400 mt-2">👤 {c.faculty}</p>}
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-gray-100">
              <h3 className="text-base font-bold text-gray-800">{editCourse ? 'Edit Course' : 'Add Course'}</h3>
              <button onClick={() => setShowModal(false)} className="p-1.5 rounded-full hover:bg-gray-100 text-gray-500">✕</button>
            </div>
            <form onSubmit={handleSave} className="px-6 py-4 grid grid-cols-2 gap-4">
              <div className="col-span-full"><Field label="Course Name *" value={form.name} onChange={v => setForm({...form, name: v})} required /></div>
              <Field label="Course Code *" value={form.code} onChange={v => setForm({...form, code: v})} required />
              <Field label="Faculty" value={form.faculty} onChange={v => setForm({...form, faculty: v})} />
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Branch</label>
                <select value={form.branch} onChange={e => setForm({...form, branch: e.target.value})} className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#3E4095]">
                  {BRANCHES.map(b => <option key={b}>{b}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Semester</label>
                <select value={form.semester} onChange={e => setForm({...form, semester: Number(e.target.value)})} className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#3E4095]">
                  {[1,2,3,4,5,6,7,8].map(s => <option key={s} value={s}>Sem {s}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Type</label>
                <select value={form.type} onChange={e => setForm({...form, type: e.target.value})} className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#3E4095]">
                  {TYPES.map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
              <Field label="Credits" type="number" value={form.credits} onChange={v => setForm({...form, credits: Number(v)})} />
              <div className="col-span-full flex gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold text-gray-600">Cancel</button>
                <button type="submit" disabled={saving} className="flex-1 py-2.5 bg-[#3E4095] text-white rounded-xl text-sm font-semibold hover:bg-[#282A61] transition disabled:opacity-60">
                  {saving ? 'Saving...' : editCourse ? 'Update' : 'Create Course'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function Field({ label, value, onChange, type = 'text', required }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-600 mb-1">{label}</label>
      <input type={type} value={value || ''} onChange={e => onChange(e.target.value)} required={required}
        className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#3E4095]" />
    </div>
  );
}
