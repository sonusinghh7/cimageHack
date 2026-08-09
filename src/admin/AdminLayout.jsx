import React, { useState } from 'react';
import { adminAuthApi } from './api/adminApi';
import {
  ChartBarIcon, UsersIcon, BookOpenIcon, BellIcon, CreditCardIcon,
  ClipboardDocumentListIcon, AcademicCapIcon, CalendarDaysIcon,
  ChartPieIcon, Bars3Icon, XMarkIcon, ArrowRightStartOnRectangleIcon,
  ShieldCheckIcon, ChevronRightIcon,
} from '@heroicons/react/24/outline';

const navItems = [
  { id: 'dashboard',    label: 'Dashboard',    icon: ChartPieIcon },
  { id: 'students',     label: 'Students',     icon: UsersIcon },
  { id: 'courses',      label: 'Courses',      icon: BookOpenIcon },
  { id: 'attendance',   label: 'Attendance',   icon: ChartBarIcon },
  { id: 'assignments',  label: 'Assignments',  icon: ClipboardDocumentListIcon },
  { id: 'results',      label: 'Results',      icon: AcademicCapIcon },
  { id: 'fees',         label: 'Fees',         icon: CreditCardIcon },
  { id: 'notifications',label: 'Notifications',icon: BellIcon },
];

export default function AdminLayout({ admin, onLogout, activePage, setActivePage, children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    try { await adminAuthApi.logout(); } catch (_) {}
    onLogout();
  };

  const NavLink = ({ item }) => (
    <button
      onClick={() => { setActivePage(item.id); setSidebarOpen(false); }}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
        activePage === item.id
          ? 'bg-white text-[#3E4095] shadow-sm font-semibold'
          : 'text-white/70 hover:bg-white/10 hover:text-white'
      }`}
    >
      <item.icon className="w-5 h-5 shrink-0" />
      {item.label}
      {activePage === item.id && <ChevronRightIcon className="w-4 h-4 ml-auto text-[#3E4095]" />}
    </button>
  );

  const Sidebar = () => (
    <div className="flex flex-col h-full" style={{ background: 'linear-gradient(180deg, #1a1d40 0%, #282a61 100%)' }}>
      {/* Brand */}
      <div className="px-5 py-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-white/10 rounded-xl flex items-center justify-center border border-white/20">
            <ShieldCheckIcon className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-white font-bold text-sm leading-none">CimageConnect</p>
            <p className="text-white/50 text-[10px] mt-0.5">Admin Portal</p>
          </div>
        </div>
      </div>

      {/* Admin info */}
      <div className="px-5 py-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-gradient-to-br from-blue-400 to-purple-500 rounded-xl flex items-center justify-center text-white font-bold text-sm shrink-0">
            {admin?.name?.charAt(0) || 'A'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white text-xs font-semibold truncate">{admin?.name}</p>
            <p className="text-white/50 text-[10px] capitalize">{admin?.role}</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => <NavLink key={item.id} item={item} />)}
      </nav>

      {/* Logout */}
      <div className="px-3 py-4 border-t border-white/10">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-red-400 hover:bg-red-500/10 transition font-medium"
        >
          <ArrowRightStartOnRectangleIcon className="w-5 h-5" />
          Logout
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:flex-col w-64 shrink-0 border-r border-gray-200">
        <Sidebar />
      </aside>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div className="fixed inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
          <div className="relative w-64 h-full z-10">
            <Sidebar />
          </div>
        </div>
      )}

      {/* Main area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Topbar */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 shrink-0">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition"
            >
              <Bars3Icon className="w-5 h-5 text-gray-600" />
            </button>
            <div>
              <h1 className="text-base font-bold text-gray-900 capitalize">
                {navItems.find(n => n.id === activePage)?.label || 'Admin Panel'}
              </h1>
              <p className="text-xs text-gray-400 hidden sm:block">
                {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-1.5 text-xs text-[#3E4095] font-semibold px-3 py-1.5 rounded-lg border border-[#3E4095]/30 hover:bg-[#3E4095]/5 transition"
            >
              View Student App ↗
            </a>
            <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
              {admin?.name?.charAt(0) || 'A'}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
