import React, { useEffect, useState } from 'react';
import { adminStatsApi } from '../api/adminApi';
import {
  UsersIcon, AcademicCapIcon, ExclamationTriangleIcon,
  CreditCardIcon, ClipboardDocumentListIcon, BellIcon,
} from '@heroicons/react/24/outline';

function StatCard({ icon: Icon, label, value, sub, color, bg, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`${bg} rounded-2xl p-5 text-left w-full group hover:shadow-md transition-shadow`}
    >
      <div className="flex items-start justify-between">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color} bg-white/60`}>
          <Icon className="w-5 h-5" />
        </div>
        {onClick && <span className="text-[10px] text-gray-400 group-hover:text-[#3E4095] transition">View →</span>}
      </div>
      <p className="text-3xl font-extrabold text-gray-800 mt-3">{value ?? '—'}</p>
      <p className="text-sm font-semibold text-gray-600 mt-0.5">{label}</p>
      {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
    </button>
  );
}

export default function AdminDashboard({ setActivePage }) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminStatsApi.get()
      .then(d => setStats(d.stats))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <PageLoader />;

  const cards = [
    { icon: UsersIcon,               label: 'Total Students',         value: stats?.totalStudents,      sub: `${stats?.activeStudents} active`,    color: 'text-blue-600',   bg: 'bg-blue-50',   page: 'students' },
    { icon: AcademicCapIcon,         label: 'Total Courses',          value: stats?.totalCourses,        sub: 'All branches',                        color: 'text-violet-600', bg: 'bg-violet-50', page: 'courses' },
    { icon: ExclamationTriangleIcon, label: 'Low Attendance',         value: stats?.lowAttendanceCount,  sub: 'Students below 75%',                  color: 'text-amber-600',  bg: 'bg-amber-50',  page: 'attendance' },
    { icon: CreditCardIcon,          label: 'Total Fee Due',          value: `₹${(stats?.totalDue || 0).toLocaleString('en-IN')}`, sub: 'Across all students', color: 'text-red-600', bg: 'bg-red-50', page: 'fees' },
    { icon: ClipboardDocumentListIcon,label:'Pending Assignments',    value: stats?.pendingAssignments,  sub: 'No submissions yet',                  color: 'text-green-600',  bg: 'bg-green-50',  page: 'assignments' },
    { icon: BellIcon,                label: 'Notifications Sent',     value: stats?.recentNotifications?.length ?? 0, sub: 'Last 5 shown below', color: 'text-pink-600', bg: 'bg-pink-50', page: 'notifications' },
  ];

  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-800">Welcome back! 👋</h2>
        <p className="text-sm text-gray-400 mt-0.5">Here's what's happening across CimageConnect today.</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {cards.map((c) => (
          <StatCard key={c.label} {...c} onClick={() => setActivePage(c.page)} />
        ))}
      </div>

      {/* Recent Notifications */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h3 className="text-sm font-bold text-gray-800">Recent Notifications</h3>
          <button onClick={() => setActivePage('notifications')} className="text-xs text-[#3E4095] font-semibold hover:underline">
            View all →
          </button>
        </div>
        {(stats?.recentNotifications || []).length === 0 ? (
          <div className="py-8 text-center text-sm text-gray-400">No notifications sent yet.</div>
        ) : (
          <div className="divide-y divide-gray-50">
            {(stats?.recentNotifications || []).map((n) => {
              const typeColor = { info: 'bg-blue-100 text-blue-700', warning: 'bg-amber-100 text-amber-700', success: 'bg-green-100 text-green-700', error: 'bg-red-100 text-red-700' };
              return (
                <div key={n._id} className="flex items-start gap-3 px-5 py-3.5">
                  <span className={`shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-full mt-0.5 ${typeColor[n.type] || typeColor.info}`}>
                    {n.type.toUpperCase()}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-800">{n.title}</p>
                    <p className="text-xs text-gray-400 truncate">{n.message}</p>
                  </div>
                  <span className="text-[10px] text-gray-300 shrink-0 mt-0.5">{new Date(n.createdAt).toLocaleDateString('en-IN')}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
        <h3 className="text-sm font-bold text-gray-800 mb-3">Quick Actions</h3>
        <div className="flex flex-wrap gap-2">
          {[
            { label: '+ Add Student', page: 'students' },
            { label: '+ Send Notification', page: 'notifications' },
            { label: '+ Add Course', page: 'courses' },
            { label: '+ Create Assignment', page: 'assignments' },
          ].map((a) => (
            <button
              key={a.label}
              onClick={() => setActivePage(a.page)}
              className="px-4 py-2 bg-[#3E4095] text-white text-xs font-semibold rounded-xl hover:bg-[#282A61] transition active:scale-[0.97]"
            >
              {a.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function PageLoader() {
  return (
    <div className="p-6 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
      {[...Array(6)].map((_, i) => <div key={i} className="skeleton h-32 rounded-2xl" />)}
    </div>
  );
}
