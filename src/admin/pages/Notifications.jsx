import React, { useEffect, useState } from 'react';
import { adminNotificationsApi, adminStudentsApi } from '../api/adminApi';
import { BellIcon, TrashIcon, PaperAirplaneIcon } from '@heroicons/react/24/outline';

const TYPES = ['info', 'warning', 'success', 'error'];
const TYPE_COLORS = { info: 'bg-blue-100 text-blue-700', warning: 'bg-amber-100 text-amber-700', success: 'bg-green-100 text-green-700', error: 'bg-red-100 text-red-700' };

const blankForm = { title: '', message: '', type: 'info', targetType: 'all', targetValue: '' };

function Toast({ msg, type }) {
  if (!msg) return null;
  return <div className={`fixed top-5 right-5 z-[999] px-4 py-3 rounded-xl text-sm font-medium shadow-xl border ${type === 'error' ? 'bg-red-50 text-red-700 border-red-200' : 'bg-green-50 text-green-700 border-green-200'}`}>{msg}</div>;
}

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(blankForm);
  const [sending, setSending] = useState(false);
  const [toast, setToast] = useState({ msg: '', type: 'success' });

  const showToast = (msg, type = 'success') => { setToast({ msg, type }); setTimeout(() => setToast({ msg: '', type: 'success' }), 3000); };

  const load = async () => {
    try {
      const [nd, sd] = await Promise.all([adminNotificationsApi.getAll(), adminStudentsApi.getAll()]);
      setNotifications(nd.notifications || []);
      setStudents(sd.students || []);
    } catch (err) { showToast(err.message, 'error'); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!form.title || !form.message) return showToast('Title and message required', 'error');
    setSending(true);
    try {
      await adminNotificationsApi.send(form);
      showToast('Notification sent successfully! ✓');
      setForm(blankForm);
      load();
    } catch (err) { showToast(err.message, 'error'); }
    finally { setSending(false); }
  };

  const handleDelete = async (id) => {
    try { await adminNotificationsApi.delete(id); showToast('Deleted.'); load(); }
    catch (err) { showToast(err.message, 'error'); }
  };

  const branches = [...new Set(students.map(s => s.branch))];
  const semesters = [...new Set(students.map(s => s.semester))].sort((a,b) => a-b);

  return (
    <div className="p-6 grid grid-cols-1 lg:grid-cols-5 gap-6">
      <Toast {...toast} />

      {/* Compose Form */}
      <div className="lg:col-span-2">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sticky top-6">
          <h3 className="text-sm font-bold text-gray-800 mb-4 flex items-center gap-2">
            <PaperAirplaneIcon className="w-4 h-4 text-[#3E4095]" /> Compose Notification
          </h3>
          <form onSubmit={handleSend} className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Title *</label>
              <input value={form.title} onChange={e => setForm({...form, title: e.target.value})} placeholder="Notification title..." required className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#3E4095]" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Message *</label>
              <textarea value={form.message} onChange={e => setForm({...form, message: e.target.value})} placeholder="Write your message..." required rows={4} className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#3E4095] resize-none" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Type</label>
              <div className="flex gap-2 flex-wrap">
                {TYPES.map(t => (
                  <button key={t} type="button" onClick={() => setForm({...form, type: t})}
                    className={`px-3 py-1 rounded-full text-xs font-semibold capitalize transition ${form.type === t ? TYPE_COLORS[t] + ' ring-2 ring-offset-1 ring-current' : 'bg-gray-100 text-gray-500'}`}>
                    {t}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Send To</label>
              <select value={form.targetType} onChange={e => setForm({...form, targetType: e.target.value, targetValue: ''})} className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#3E4095] bg-white">
                <option value="all">All Students</option>
                <option value="branch">Specific Branch</option>
                <option value="semester">Specific Semester</option>
                <option value="student">Specific Student</option>
              </select>
            </div>
            {form.targetType === 'branch' && (
              <select value={form.targetValue} onChange={e => setForm({...form, targetValue: e.target.value})} className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#3E4095] bg-white">
                <option value="">Select Branch</option>
                {branches.map(b => <option key={b}>{b}</option>)}
              </select>
            )}
            {form.targetType === 'semester' && (
              <select value={form.targetValue} onChange={e => setForm({...form, targetValue: e.target.value})} className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#3E4095] bg-white">
                <option value="">Select Semester</option>
                {semesters.map(s => <option key={s} value={String(s)}>Semester {s}</option>)}
              </select>
            )}
            {form.targetType === 'student' && (
              <select value={form.targetValue} onChange={e => setForm({...form, targetValue: e.target.value})} className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#3E4095] bg-white">
                <option value="">Select Student</option>
                {students.map(s => <option key={s._id} value={String(s._id)}>{s.name} ({s.studentId})</option>)}
              </select>
            )}
            <button type="submit" disabled={sending} className="w-full py-2.5 bg-[#3E4095] text-white rounded-xl text-sm font-semibold hover:bg-[#282A61] transition disabled:opacity-60 flex items-center justify-center gap-2">
              {sending ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Sending...</> : <><PaperAirplaneIcon className="w-4 h-4" /> Send Notification</>}
            </button>
          </form>
        </div>
      </div>

      {/* Notification History */}
      <div className="lg:col-span-3">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100">
            <h3 className="text-sm font-bold text-gray-800">Notification History ({notifications.length})</h3>
          </div>
          {loading ? (
            <div className="p-4 space-y-3">{[...Array(4)].map((_, i) => <div key={i} className="skeleton h-16 rounded-xl" />)}</div>
          ) : notifications.length === 0 ? (
            <div className="py-12 text-center"><BellIcon className="w-10 h-10 text-gray-200 mx-auto mb-2" /><p className="text-sm text-gray-400">No notifications sent yet</p></div>
          ) : (
            <div className="divide-y divide-gray-50 max-h-[calc(100vh-16rem)] overflow-y-auto">
              {notifications.map((n) => (
                <div key={n._id} className="flex items-start gap-3 px-5 py-4">
                  <span className={`shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-full mt-0.5 ${TYPE_COLORS[n.type] || TYPE_COLORS.info}`}>{n.type.toUpperCase()}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-800">{n.title}</p>
                    <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{n.message}</p>
                    <div className="flex items-center gap-3 mt-1.5 text-[10px] text-gray-400">
                      <span>To: <strong>{n.targetType === 'all' ? 'Everyone' : `${n.targetType}: ${n.targetValue}`}</strong></span>
                      <span>•</span>
                      <span>{new Date(n.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                    </div>
                  </div>
                  <button onClick={() => handleDelete(n._id)} className="p-1.5 rounded-lg hover:bg-red-50 text-red-500 transition shrink-0"><TrashIcon className="w-4 h-4" /></button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
