import React, { useState } from "react";
import {
  Bars3Icon,
  XMarkIcon,
  BellIcon,
  BookOpenIcon,
  CalendarDaysIcon,
  DocumentTextIcon,
  CreditCardIcon,
  ChartBarIcon,
  CheckCircleIcon,
  UserIcon,
  Cog6ToothIcon,
  ArrowRightStartOnRectangleIcon,
  ChevronLeftIcon,
  ExclamationCircleIcon,
  InformationCircleIcon,
  CheckBadgeIcon,
} from "@heroicons/react/24/outline";

const INITIAL_NOTIFICATIONS = [
  {
    id: 1,
    type: "warning",
    title: "Attendance Alert",
    message: "Your attendance in Software Engineering is below 60%. Attend classes to avoid detention.",
    time: "2 hours ago",
    read: false,
  },
  {
    id: 2,
    type: "info",
    title: "Assignment Due Soon",
    message: "TOC — DFA Construction assignment is due in 3 days. Submit before the deadline.",
    time: "5 hours ago",
    read: false,
  },
  {
    id: 3,
    type: "success",
    title: "Fee Payment Confirmed",
    message: "Your partial fee payment of ₹25,000 for Semester 5 has been received. Receipt No: REC-5001.",
    time: "1 day ago",
    read: false,
  },
];

// View components
import CourseView from "./views/CourseView";
import TimetableView from "./views/TimetableView";
import AttendanceView from "./views/AttendanceView";
import AssignmentView from "./views/AssignmentView";
import ResultView from "./views/ResultView";
import FeeView from "./views/FeeView";
import AdmitCardView from "./views/AdmitCardView";
import ProfileView from "./views/ProfileView";

const dashboardItems = [
  {
    id: "course",
    title: "My Course",
    subtitle: "View enrolled subjects",
    icon: BookOpenIcon,
    gradient: "from-blue-500 to-blue-600",
    bg: "bg-blue-50",
  },
  {
    id: "timetable",
    title: "Timetable",
    subtitle: "Weekly class schedule",
    icon: CalendarDaysIcon,
    gradient: "from-sky-400 to-cyan-500",
    bg: "bg-sky-50",
  },
  {
    id: "attendance",
    title: "Attendance",
    subtitle: "Track your presence",
    icon: CheckCircleIcon,
    gradient: "from-violet-500 to-purple-600",
    bg: "bg-violet-50",
  },
  {
    id: "assignments",
    title: "Assignments",
    subtitle: "Pending & submitted tasks",
    icon: DocumentTextIcon,
    gradient: "from-gray-700 to-gray-900",
    bg: "bg-gray-50",
  },
  {
    id: "admitcard",
    title: "Admit Card",
    subtitle: "Download exam hall ticket",
    icon: CreditCardIcon,
    gradient: "from-emerald-500 to-green-600",
    bg: "bg-emerald-50",
  },
  {
    id: "result",
    title: "Result",
    subtitle: "Semester-wise marks",
    icon: ChartBarIcon,
    gradient: "from-amber-400 to-orange-500",
    bg: "bg-amber-50",
  },
];

const menuItems = [
  { id: "profile", title: "Profile", icon: UserIcon },
  { id: "settings", title: "Settings", icon: Cog6ToothIcon },
  { id: "logout", title: "Logout", icon: ArrowRightStartOnRectangleIcon, danger: true },
];

const VIEW_TITLES = {
  dashboard: "Dashboard",
  course: "My Course",
  timetable: "Timetable",
  attendance: "Attendance",
  assignments: "Assignments",
  admitcard: "Admit Card",
  result: "Results",
  profile: "Profile",
  fee: "Fee Details",
};

export default function Dashboard({ student, onLogout }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeView, setActiveView] = useState("dashboard");
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);
  const [showNotifications, setShowNotifications] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllRead = () => setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  const dismissNotification = (id) => setNotifications((prev) => prev.filter((n) => n.id !== id));
  const markRead = (id) => setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, read: true } : n));

  const navigateTo = (id) => {
    setActiveView(id);
    setIsMenuOpen(false);
  };

  const renderView = () => {
    switch (activeView) {
      case "course":      return <CourseView student={student} />;
      case "timetable":   return <TimetableView student={student} />;
      case "attendance":  return <AttendanceView student={student} />;
      case "assignments": return <AssignmentView student={student} />;
      case "result":      return <ResultView student={student} />;
      case "fee":         return <FeeView student={student} />;
      case "admitcard":   return <AdmitCardView student={student} />;
      case "profile":     return <ProfileView student={student} onLogout={onLogout} />;
      default:            return null;
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--surface)' }}>
      {/* Header — accounts for iOS status bar via padding-top in #root */}
      <div className="flex items-center justify-between px-4 bg-white shadow-sm sticky top-0 z-50" style={{ height: '60px' }}>
        <div className="flex items-center gap-3">
          {activeView !== "dashboard" ? (
            <button
              onClick={() => setActiveView("dashboard")}
              className="w-10 h-10 flex items-center justify-center rounded-xl active:bg-gray-100 transition"
            >
              <ChevronLeftIcon className="h-5 w-5 text-gray-700" />
            </button>
          ) : (
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="w-10 h-10 flex items-center justify-center rounded-xl active:bg-gray-100 transition"
            >
              {isMenuOpen ? (
                <XMarkIcon className="h-6 w-6 text-gray-700" />
              ) : (
                <Bars3Icon className="h-6 w-6 text-gray-700" />
              )}
            </button>
          )}
          {activeView === "dashboard" ? (
            <img src="/logo2.png" alt="College Logo" className="h-10 w-auto" />
          ) : (
            <h2 className="text-base font-bold text-gray-800">{VIEW_TITLES[activeView]}</h2>
          )}
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <button
              onClick={() => { setShowNotifications(true); }}
              className="w-10 h-10 flex items-center justify-center rounded-xl active:bg-gray-100 transition relative"
            >
              <BellIcon className="h-6 w-6 text-gray-600" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[9px] rounded-full w-4 h-4 flex items-center justify-center font-bold animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>
          </div>
          <button
            onClick={() => navigateTo("profile")}
            className="w-8 h-8 rounded-full bg-[#3E4095] text-white text-sm font-bold flex items-center justify-center overflow-hidden"
          >
            {student?.photo ? (
              <img src={student.photo} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              student?.name?.charAt(0).toUpperCase() || "S"
            )}
          </button>
        </div>
      </div>

      {/* Sidebar Overlay */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-30"
          onClick={() => setIsMenuOpen(false)}
        />
      )}

      {/* Notifications Panel */}
      {showNotifications && (
        <div className="fixed inset-0 z-50 flex flex-col" style={{ background: "rgba(0,0,0,0.45)" }}
          onClick={() => setShowNotifications(false)}>
          <div className="mt-auto bg-white rounded-t-3xl overflow-hidden max-h-[85vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}>
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-4 border-b border-gray-100">
              <div>
                <h3 className="text-base font-bold text-gray-800">Notifications</h3>
                {unreadCount > 0 && (
                  <p className="text-xs text-gray-400">{unreadCount} unread</p>
                )}
              </div>
              <div className="flex items-center gap-3">
                {unreadCount > 0 && (
                  <button onClick={markAllRead} className="text-xs text-[#3E4095] font-semibold">
                    Mark all read
                  </button>
                )}
                <button onClick={() => setShowNotifications(false)}
                  className="p-1.5 rounded-full hover:bg-gray-100">
                  <XMarkIcon className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </div>

            {/* Notification List */}
            <div className="overflow-y-auto pb-6">
              {notifications.length === 0 ? (
                <div className="py-12 text-center">
                  <BellIcon className="w-10 h-10 text-gray-200 mx-auto mb-2" />
                  <p className="text-sm text-gray-400">No notifications</p>
                </div>
              ) : (
                notifications.map((n) => {
                  const Icon = n.type === "warning" ? ExclamationCircleIcon
                    : n.type === "success" ? CheckBadgeIcon
                    : InformationCircleIcon;
                  const iconColor = n.type === "warning" ? "text-amber-500 bg-amber-50"
                    : n.type === "success" ? "text-green-500 bg-green-50"
                    : "text-blue-500 bg-blue-50";
                  return (
                    <div
                      key={n.id}
                      onClick={() => markRead(n.id)}
                      className={`flex gap-3 px-4 py-3.5 border-b border-gray-50 cursor-pointer transition ${
                        n.read ? "bg-white" : "bg-blue-50/30"
                      }`}
                    >
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${iconColor}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <p className={`text-sm font-semibold leading-snug ${ n.read ? "text-gray-600" : "text-gray-800" }`}>
                            {n.title}
                          </p>
                          <button
                            onClick={(e) => { e.stopPropagation(); dismissNotification(n.id); }}
                            className="shrink-0 p-0.5 rounded-full hover:bg-gray-200 transition">
                            <XMarkIcon className="w-3.5 h-3.5 text-gray-400" />
                          </button>
                        </div>
                        <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{n.message}</p>
                        <p className="text-[10px] text-gray-400 mt-1">{n.time}</p>
                      </div>
                      {!n.read && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full shrink-0 mt-1.5" />
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-16 left-0 h-[calc(100%-4rem)] w-64 bg-white shadow-2xl z-40 transform transition-transform duration-300 ease-in-out ${
          isMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Student mini-profile in sidebar */}
        <div className="px-5 py-4 border-b border-gray-100" style={{ background: 'linear-gradient(135deg, #3E4095 0%, #5B5FC7 100%)' }}>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-white/20 overflow-hidden border-2 border-white/40 flex items-center justify-center text-white font-bold text-lg">
              {student?.photo ? (
                <img src={student.photo} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                student?.name?.charAt(0).toUpperCase() || "S"
              )}
            </div>
            <div>
              <p className="text-white font-semibold text-sm leading-tight">{student?.name || "Student"}</p>
              <p className="text-white/70 text-xs">{student?.studentId}</p>
              <p className="text-white/60 text-xs">{student?.branch} • Sem {student?.semester}</p>
            </div>
          </div>
        </div>

        <div className="py-3 px-3">
          {menuItems.map((item) => (
            <button
              key={item.id}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl mb-1 text-sm font-medium transition-all ${
                item.danger
                  ? "text-red-500 hover:bg-red-50"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
              onClick={() => {
                if (item.id === "logout") {
                  setIsMenuOpen(false);
                  onLogout();
                } else {
                  navigateTo(item.id);
                }
              }}
            >
              <item.icon className="h-5 w-5 shrink-0" />
              <span>{item.title}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-lg mx-auto">
        {activeView === "dashboard" ? (
          <div className="page-enter">
            {/* Welcome Banner */}
            <div className="mx-4 mt-4 mb-3 rounded-2xl p-4 text-white overflow-hidden relative"
              style={{ background: 'linear-gradient(135deg, #3E4095 0%, #5B5FC7 100%)' }}>
              <div className="absolute -right-4 -top-4 w-24 h-24 rounded-full bg-white/10" />
              <div className="absolute -right-2 bottom-0 w-16 h-16 rounded-full bg-white/10" />
              <p className="text-xs font-medium text-white/70 uppercase tracking-wider">Good {getGreeting()}</p>
              <h2 className="text-lg font-bold mt-0.5 leading-snug">
                {student?.name?.split(" ")[0] || "Student"} 👋
              </h2>
              <p className="text-sm text-white/80 mt-1">{student?.branch} | Semester {student?.semester}</p>
              <p className="text-xs text-white/60 mt-0.5">{student?.batch}</p>
            </div>

            {/* Dashboard Grid */}
          <div className="px-4 pb-8 space-y-3" style={{ paddingBottom: 'calc(env(safe-area-inset-bottom,0px) + 2rem)' }}>
              {dashboardItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => navigateTo(item.id)}
                  className="w-full flex items-center gap-4 p-4 bg-white rounded-2xl shadow-sm hover:shadow-md active:scale-[0.98] transition-all duration-150 text-left"
                >
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.gradient} flex items-center justify-center shadow-sm shrink-0`}>
                    <item.icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-gray-800">{item.title}</h3>
                    <p className="text-xs text-gray-500 mt-0.5">{item.subtitle}</p>
                  </div>
                  <ChevronLeftIcon className="h-4 w-4 text-gray-400 rotate-180 shrink-0" />
                </button>
              ))}

              {/* Fee card (separate because not in main dashboardItems) */}
              <button
                onClick={() => navigateTo("fee")}
                className="w-full flex items-center gap-4 p-4 bg-white rounded-2xl shadow-sm hover:shadow-md active:scale-[0.98] transition-all duration-150 text-left"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center shadow-sm shrink-0">
                  <CreditCardIcon className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold text-gray-800">Fee Details</h3>
                  <p className="text-xs text-gray-500 mt-0.5">View payments & dues</p>
                </div>
                <ChevronLeftIcon className="h-4 w-4 text-gray-400 rotate-180 shrink-0" />
              </button>
            </div>
          </div>
        ) : (
          <div className="page-enter">
            {renderView()}
          </div>
        )}
      </div>
    </div>
  );
}

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "morning";
  if (h < 17) return "afternoon";
  return "evening";
}
