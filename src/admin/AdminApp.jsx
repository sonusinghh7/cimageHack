import React, { useEffect, useState } from 'react';
import AdminLogin from './AdminLogin';
import AdminLayout from './AdminLayout';
import AdminDashboard from './pages/AdminDashboard';
import Students from './pages/Students';
import Courses from './pages/Courses';
import AttendanceAdmin from './pages/AttendanceAdmin';
import Assignments from './pages/Assignments';
import Results from './pages/Results';
import Fees from './pages/Fees';
import Notifications from './pages/Notifications';
import { adminAuthApi } from './api/adminApi';

export default function AdminApp() {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activePage, setActivePage] = useState('dashboard');

  useEffect(() => {
    adminAuthApi.me()
      .then(d => setAdmin(d.admin))
      .catch(() => setAdmin(null))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1a1d40] to-[#3e4095]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin" />
          <p className="text-white/60 text-sm">Loading Admin Panel...</p>
        </div>
      </div>
    );
  }

  if (!admin) return <AdminLogin onLogin={setAdmin} />;

  const renderPage = () => {
    switch (activePage) {
      case 'students':     return <Students />;
      case 'courses':      return <Courses />;
      case 'attendance':   return <AttendanceAdmin />;
      case 'assignments':  return <Assignments />;
      case 'results':      return <Results />;
      case 'fees':         return <Fees />;
      case 'notifications':return <Notifications />;
      default:             return <AdminDashboard setActivePage={setActivePage} />;
    }
  };

  return (
    <AdminLayout admin={admin} onLogout={() => setAdmin(null)} activePage={activePage} setActivePage={setActivePage}>
      <div className="page-enter">
        {renderPage()}
      </div>
    </AdminLayout>
  );
}
