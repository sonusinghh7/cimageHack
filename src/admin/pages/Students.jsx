import React, { useEffect, useState, useRef } from 'react';
import { adminStudentsApi } from '../api/adminApi';
import { MagnifyingGlassIcon, PlusIcon, PencilIcon, TrashIcon, LockClosedIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';

const BRANCHES = ['CSE', 'IT', 'ECE', 'ME', 'CE', 'EEE'];
const SEMESTERS = [1,2,3,4,5,6,7,8];

const blankForm = { name: '', studentId: '', email: '', phone: '', branch: 'CSE', semester: 5, batch: '', gender: 'Male', password: '', category: 'General', address: '', dob: '' };

function Toast({ msg, type }) {
  if (!msg) return null;
  return (
    <div className={`fixed top-5 right-5 z-[999] px-4 py-3 rounded-xl text-sm font-medium shadow-xl border ${type === 'error' ? 'bg-red-50 text-red-700 border-red-200' : 'bg-green-50 text-green-700 border-green-200'}`}>
      {msg}
    </div>
  );
}

export default function Students() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterBranch, setFilterBranch] = useState('');
  const [filterSem, setFilterSem] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editStudent, setEditStudent] = useState(null);
  const [form, setForm] = useState(blankForm);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState({ msg: '', type: 'success' });
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [resetPwModal, setResetPwModal] = useState(null);
  const [newPassword, setNewPassword] = useState('');

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast({ msg: '', type: 'success' }), 3000);
  };

  const loadStudents = async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (filterBranch) params.set('branch', filterBranch);
    if (filterSem) params.set('semester', filterSem);
    if (filterStatus) params.set('status', filterStatus);
    try {
      const d = await adminStudentsApi.getAll(`?${params}`);
      setStudents(d.students || []);
    } catch (err) { showToast(err.message, 'error'); }
    finally { setLoading(false); }
  };

  useEffect(() => { loadStudents(); }, [search, filterBranch, filterSem, filterStatus]);

  const openAdd = () => { setEditStudent(null); setForm(blankForm); setShowModal(true); };
  const openEdit = (s) => { setEditStudent(s); setForm({ ...s, password: '' }); setShowModal(true); };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editStudent) {
        await adminStudentsApi.update(editStudent._id, form);
        showToast('Student updated successfully!');
      } else {
        await adminStudentsApi.create(form);
        showToast('Student created! They can now login.');
      }
      setShowModal(false);
      loadStudents();
    } catch (err) { showToast(err.message, 'error'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    try {
      await adminStudentsApi.delete(id);
      showToast('Student deleted.');
      setDeleteConfirm(null);
      loadStudents();
    } catch (err) { showToast(err.message, 'error'); }
  };

  const handleToggle = async (id) => {
    try {
      const d = await adminStudentsApi.toggle(id);
      showToast(`Account ${d.isActive ? 'activated' : 'deactivated'}`);
      loadStudents();
    } catch (err) { showToast(err.message, 'error'); }
  };

  const handleResetPassword = async () => {
    if (!newPassword || newPassword.length < 6) return showToast('Min 6 characters', 'error');
    try {
      await adminStudentsApi.resetPassword(resetPwModal._id, newPassword);
      showToast('Password reset successfully!');
      setResetPwModal(null);
      setNewPassword('');
    } catch (err) { showToast(err.message, 'error'); }
  };

  return (
    <div className="p-6">
      <Toast {...toast} />

      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-lg font-bold text-gray-800">Students ({students.length})</h2>
          <p className="text-xs text-gray-400">Manage all registered students</p>
        </div>
        <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2.5 bg-[#3E4095] text-white rounded-xl text-sm font-semibold hover:bg-[#282A61] transition active:scale-[0.97]">
          <PlusIcon className="w-4 h-4" /> Add Student
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-4">
        <div className="relative flex-1 min-w-48">
          <MagnifyingGlassIcon className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search name, ID, email..." className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#3E4095]" />
        </div>
        <select value={filterBranch} onChange={e => setFilterBranch(e.target.value)} className="px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#3E4095] bg-white">
          <option value="">All Branches</option>
          {BRANCHES.map(b => <option key={b}>{b}</option>)}
        </select>
        <select value={filterSem} onChange={e => setFilterSem(e.target.value)} className="px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#3E4095] bg-white">
          <option value="">All Semesters</option>
          {SEMESTERS.map(s => <option key={s} value={s}>Sem {s}</option>)}
        </select>
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#3E4095] bg-white">
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wide">Student</th>
                <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wide">Student ID</th>
                <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wide">Branch</th>
                <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wide">Sem</th>
                <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wide">Status</th>
                <th className="text-right px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wide">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i}>
                    {[...Array(6)].map((_, j) => <td key={j} className="px-4 py-3"><div className="skeleton h-4 rounded w-full" /></td>)}
                  </tr>
                ))
              ) : students.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-10 text-gray-400 text-sm">No students found.</td></tr>
              ) : students.map((s) => (
                <tr key={s._id} className="hover:bg-gray-50 transition">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-xs font-bold shrink-0">
                        {s.name?.charAt(0)}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800 text-sm">{s.name}</p>
                        <p className="text-xs text-gray-400">{s.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-600 font-mono text-xs">{s.studentId}</td>
                  <td className="px-4 py-3"><span className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded-lg text-xs font-semibold">{s.branch}</span></td>
                  <td className="px-4 py-3 text-gray-600 text-xs">Sem {s.semester}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${s.isActive !== false ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {s.isActive !== false ? <CheckCircleIcon className="w-3 h-3" /> : <XCircleIcon className="w-3 h-3" />}
                      {s.isActive !== false ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1.5">
                      <button onClick={() => openEdit(s)} className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-600 transition" title="Edit"><PencilIcon className="w-4 h-4" /></button>
                      <button onClick={() => setResetPwModal(s)} className="p-1.5 rounded-lg hover:bg-amber-50 text-amber-600 transition" title="Reset Password"><LockClosedIcon className="w-4 h-4" /></button>
                      <button onClick={() => handleToggle(s._id)} className={`p-1.5 rounded-lg transition ${s.isActive !== false ? 'hover:bg-red-50 text-red-500' : 'hover:bg-green-50 text-green-600'}`} title="Toggle Status">{s.isActive !== false ? <XCircleIcon className="w-4 h-4" /> : <CheckCircleIcon className="w-4 h-4" />}</button>
                      <button onClick={() => setDeleteConfirm(s)} className="p-1.5 rounded-lg hover:bg-red-50 text-red-600 transition" title="Delete"><TrashIcon className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-gray-100">
              <h3 className="text-base font-bold text-gray-800">{editStudent ? 'Edit Student' : 'Add New Student'}</h3>
              <button onClick={() => setShowModal(false)} className="p-1.5 rounded-full hover:bg-gray-100 transition text-gray-500">✕</button>
            </div>
            <form onSubmit={handleSave} className="px-6 py-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Full Name *" value={form.name} onChange={v => setForm({...form, name: v})} required />
              <Field label="Student ID *" value={form.studentId} onChange={v => setForm({...form, studentId: v})} required />
              <Field label="Email *" type="email" value={form.email} onChange={v => setForm({...form, email: v})} required />
              <Field label="Phone" type="tel" value={form.phone} onChange={v => setForm({...form, phone: v})} />
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Branch</label>
                <select value={form.branch} onChange={e => setForm({...form, branch: e.target.value})} className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#3E4095]">
                  {BRANCHES.map(b => <option key={b}>{b}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Semester</label>
                <select value={form.semester} onChange={e => setForm({...form, semester: Number(e.target.value)})} className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#3E4095]">
                  {SEMESTERS.map(s => <option key={s} value={s}>Semester {s}</option>)}
                </select>
              </div>
              <Field label="Batch (e.g. 2022-2026)" value={form.batch} onChange={v => setForm({...form, batch: v})} />
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Gender</label>
                <select value={form.gender} onChange={e => setForm({...form, gender: e.target.value})} className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#3E4095]">
                  {['Male','Female','Other'].map(g => <option key={g}>{g}</option>)}
                </select>
              </div>
              <Field label="Date of Birth" type="date" value={form.dob?.split('T')[0] || ''} onChange={v => setForm({...form, dob: v})} />
              <Field label="Category" value={form.category} onChange={v => setForm({...form, category: v})} />
              {!editStudent && <Field label="Password *" type="password" value={form.password} onChange={v => setForm({...form, password: v})} required />}
              <div className="col-span-full">
                <Field label="Address" value={form.address} onChange={v => setForm({...form, address: v})} />
              </div>
              <div className="col-span-full flex gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50 transition">Cancel</button>
                <button type="submit" disabled={saving} className="flex-1 py-2.5 bg-[#3E4095] text-white rounded-xl text-sm font-semibold hover:bg-[#282A61] transition disabled:opacity-60 flex items-center justify-center gap-2">
                  {saving ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Saving...</> : editStudent ? 'Update Student' : 'Create Student'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl text-center">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3"><TrashIcon className="w-6 h-6 text-red-500" /></div>
            <h3 className="text-base font-bold text-gray-800">Delete Student?</h3>
            <p className="text-sm text-gray-500 mt-1">Are you sure you want to delete <strong>{deleteConfirm.name}</strong>? This cannot be undone.</p>
            <div className="flex gap-3 mt-4">
              <button onClick={() => setDeleteConfirm(null)} className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold">Cancel</button>
              <button onClick={() => handleDelete(deleteConfirm._id)} className="flex-1 py-2.5 bg-red-600 text-white rounded-xl text-sm font-semibold hover:bg-red-700 transition">Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* Reset Password Modal */}
      {resetPwModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl">
            <h3 className="text-base font-bold text-gray-800 mb-1">Reset Password</h3>
            <p className="text-xs text-gray-400 mb-4">Set new password for <strong>{resetPwModal.name}</strong></p>
            <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} placeholder="New password (min 6 chars)" className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#3E4095] mb-4" />
            <div className="flex gap-3">
              <button onClick={() => { setResetPwModal(null); setNewPassword(''); }} className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold">Cancel</button>
              <button onClick={handleResetPassword} className="flex-1 py-2.5 bg-[#3E4095] text-white rounded-xl text-sm font-semibold hover:bg-[#282A61] transition">Reset</button>
            </div>
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
