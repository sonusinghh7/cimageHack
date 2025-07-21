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
} from "@heroicons/react/24/outline";

// Dashboard Cards
const dashboardItems = [
  {
    title: "My Course",
    subtitle: "View course details",
    icon: BookOpenIcon,
    color: "bg-blue-500",
  },
  {
    title: "Timetable",
    subtitle: "Check class schedule",
    icon: CalendarDaysIcon,
    color: "bg-sky-500",
  },
  {
    title: "Attendance",
    subtitle: "Track your attendance",
    icon: CheckCircleIcon,
    color: "bg-purple-600",
  },
  {
    title: "Assignments",
    subtitle: "Submit assignments",
    icon: DocumentTextIcon,
    color: "bg-gray-800",
  },
  {
    title: "Admit Card",
    subtitle: "Download admit card",
    icon: CreditCardIcon,
    color: "bg-green-500",
  },
  {
    title: "Result",
    subtitle: "View exam results",
    icon: ChartBarIcon,
    color: "bg-yellow-500",
  },
];

// Sidebar Menu
const menuItems = [
  { title: "Profile", icon: UserIcon },
  { title: "Documents", icon: DocumentTextIcon },
  { title: "Settings", icon: Cog6ToothIcon },
  { title: "Help", icon: BellIcon },
  { title: "Logout", icon: ArrowRightStartOnRectangleIcon },
];

export default function Dashboard({ onLogout }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeView, setActiveView] = useState("dashboard");

  // Static Profile Data (replace with dynamic if needed)
  const student = {
    name: "Sonu Singh",
    studentId: "CIM123456",
    email: "sonu@example.com",
    phone: "+91-9876543210",
    semester: "5th Sem (B.Tech cse)",
    image: "/sonu.jpg",
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-5 shadow bg-white sticky top-0 z-50 h-20">
        <div className="flex items-center gap-3">
          <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? (
              <XMarkIcon className="h-6 w-6 text-gray-700" />
            ) : (
              <Bars3Icon className="h-6 w-6 text-gray-700" />
            )}
          </button>
          <img
            src="/logo2.png"
            alt="College Logo"
            className="h-16 w-auto ml-8"
          />
        </div>
        <div className="relative">
          <BellIcon className="h-6 w-6 text-gray-700" />
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center">
            3
          </span>
        </div>
      </div>

      {/* Sidebar */}
      <div
        className={`fixed top-20 left-0 h-[calc(100%-5rem)] w-64 bg-white shadow-xl z-40 transform transition-transform duration-300 ${
          isMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-6 space-y-4">
          <h2 className="text-xl font-bold">Menu</h2>
          {menuItems.map((item, idx) => (
            <div
              key={idx}
              className="flex items-center gap-3 text-gray-700 cursor-pointer hover:bg-gray-100 p-2 rounded-md"
              onClick={() => {
                setIsMenuOpen(false);
                if (item.title === "Logout") {
                  onLogout();
                } else {
                  setActiveView(item.title.toLowerCase()); // 'profile'
                }
              }}
            >
              <item.icon className="h-5 w-5" />
              <span>{item.title}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="p-4 space-y-4">
        {activeView === "profile" ? (
          <div className="bg-white rounded-xl shadow-md p-6 space-y-4">
            <div className="flex flex-col items-center text-center">
              <img
                src={student.image}
                alt="Profile"
                className="w-24 h-24 rounded-full object-cover mb-4 border-4 border-blue-500"
              />
              <h2 className="text-xl font-bold">{student.name}</h2>
              <p className="text-sm text-gray-600">{student.semester}</p>
            </div>
            <div className="space-y-2">
              <p>
                <span className="font-semibold">Student ID:</span> {student.studentId}
              </p>
              <p>
                <span className="font-semibold">Email:</span> {student.email}
              </p>
              <p>
                <span className="font-semibold">Phone:</span> {student.phone}
              </p>
            </div>
          </div>
        ) : (
          dashboardItems.map((item, idx) => (
            <div
              key={idx}
              className="flex items-center gap-4 p-4 bg-white rounded-xl shadow-sm"
            >
              <div className={`p-3 rounded-xl ${item.color} text-white`}>
                <item.icon className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-base font-semibold">{item.title}</h3>
                <p className="text-sm text-gray-500">{item.subtitle}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
