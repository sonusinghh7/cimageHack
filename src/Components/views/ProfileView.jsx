import React, { useState } from "react";
import {
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  AcademicCapIcon,
  CalendarIcon,
  MapPinIcon,
  ShieldCheckIcon,
  ArrowRightStartOnRectangleIcon,
  LockClosedIcon,
} from "@heroicons/react/24/outline";
import { studentApi } from "../api";

export default function ProfileView({ student, onLogout }) {
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [pwLoading, setPwLoading] = useState(false);
  const [pwError, setPwError] = useState("");
  const [pwSuccess, setPwSuccess] = useState("");

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPwError("");
    setPwSuccess("");
    if (newPassword !== confirmPassword) {
      setPwError("New passwords do not match.");
      return;
    }
    if (newPassword.length < 6) {
      setPwError("Password must be at least 6 characters.");
      return;
    }
    setPwLoading(true);
    try {
      await studentApi.changePassword(currentPassword, newPassword);
      setPwSuccess("Password changed successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setTimeout(() => {
        setShowPasswordForm(false);
        setPwSuccess("");
      }, 2000);
    } catch (err) {
      setPwError(err.message || "Failed to change password.");
    } finally {
      setPwLoading(false);
    }
  };

  if (!student) {
    return (
      <div className="px-4 pt-8 flex flex-col items-center gap-2 text-center">
        <UserIcon className="w-12 h-12 text-gray-300" />
        <p className="text-sm text-gray-400">No profile data available.</p>
      </div>
    );
  }

  return (
    <div className="px-4 pt-4 pb-8 space-y-4">
      {/* Avatar Card */}
      <div
        className="rounded-2xl p-6 flex flex-col items-center text-center"
        style={{ background: "linear-gradient(135deg, #3E4095 0%, #5B5FC7 100%)" }}
      >
        <div className="w-24 h-24 rounded-full bg-white/20 border-4 border-white/40 overflow-hidden flex items-center justify-center text-4xl font-bold text-white mb-3">
          {student.photo ? (
            <img src={student.photo} alt="Profile" className="w-full h-full object-cover" />
          ) : (
            student.name?.charAt(0).toUpperCase() || "S"
          )}
        </div>
        <h2 className="text-xl font-bold text-white">{student.name}</h2>
        <p className="text-white/70 text-sm">{student.studentId}</p>
        <div className="flex gap-2 mt-3">
          <span className="bg-white/20 text-white text-xs font-semibold px-3 py-1 rounded-full">
            {student.branch}
          </span>
          <span className="bg-white/20 text-white text-xs font-semibold px-3 py-1 rounded-full">
            Sem {student.semester}
          </span>
          {student.batch && (
            <span className="bg-white/20 text-white text-xs font-semibold px-3 py-1 rounded-full">
              {student.batch}
            </span>
          )}
        </div>
      </div>

      {/* Info Card */}
      <div className="bg-white rounded-2xl shadow-sm p-4 space-y-0">
        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-3">Personal Information</p>
        <InfoRow icon={<EnvelopeIcon className="w-4 h-4" />} label="Email" value={student.email} />
        <InfoRow icon={<PhoneIcon className="w-4 h-4" />} label="Phone" value={student.phone || "Not set"} />
        <InfoRow icon={<CalendarIcon className="w-4 h-4" />} label="Date of Birth"
          value={student.dob ? new Date(student.dob).toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" }) : "Not set"} />
        <InfoRow icon={<MapPinIcon className="w-4 h-4" />} label="Address" value={student.address || "Not set"} />
        <InfoRow icon={<ShieldCheckIcon className="w-4 h-4" />} label="Category" value={student.category || "General"} last />
      </div>

      {/* Guardian Card */}
      {(student.guardianName || student.guardianPhone) && (
        <div className="bg-white rounded-2xl shadow-sm p-4 space-y-0">
          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-3">Guardian Information</p>
          <InfoRow icon={<UserIcon className="w-4 h-4" />} label="Guardian Name" value={student.guardianName || "—"} />
          <InfoRow icon={<PhoneIcon className="w-4 h-4" />} label="Guardian Phone" value={student.guardianPhone || "—"} last />
        </div>
      )}

      {/* Change Password */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <button
          onClick={() => { setShowPasswordForm(!showPasswordForm); setPwError(""); setPwSuccess(""); }}
          className="w-full flex items-center justify-between px-4 py-3.5 text-left"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-blue-50 rounded-xl flex items-center justify-center">
              <LockClosedIcon className="w-4 h-4 text-blue-600" />
            </div>
            <p className="text-sm font-semibold text-gray-800">Change Password</p>
          </div>
          <span className="text-xs text-[#3E4095] font-semibold">{showPasswordForm ? "Cancel" : "Change"}</span>
        </button>

        {showPasswordForm && (
          <form onSubmit={handleChangePassword} className="border-t border-gray-100 px-4 pb-4 pt-3 space-y-3">
            {pwError && <p className="text-xs text-red-500 bg-red-50 px-3 py-2 rounded-lg">{pwError}</p>}
            {pwSuccess && <p className="text-xs text-green-600 bg-green-50 px-3 py-2 rounded-lg">✓ {pwSuccess}</p>}

            <InputField label="Current Password" value={currentPassword} onChange={setCurrentPassword} type="password" />
            <InputField label="New Password" value={newPassword} onChange={setNewPassword} type="password" />
            <InputField label="Confirm New Password" value={confirmPassword} onChange={setConfirmPassword} type="password" />

            <button
              type="submit"
              disabled={pwLoading}
              className="w-full py-2.5 bg-[#3E4095] text-white rounded-xl text-sm font-semibold flex items-center justify-center gap-2 disabled:opacity-60 transition"
            >
              {pwLoading ? (
                <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Saving...</>
              ) : "Update Password"}
            </button>
          </form>
        )}
      </div>

      {/* Logout */}
      <button
        onClick={onLogout}
        className="w-full flex items-center justify-center gap-2 py-3.5 bg-red-50 text-red-600 border border-red-200 rounded-2xl font-semibold text-sm hover:bg-red-100 active:scale-[0.98] transition-all"
      >
        <ArrowRightStartOnRectangleIcon className="w-5 h-5" />
        Logout
      </button>
    </div>
  );
}

function InfoRow({ icon, label, value, last }) {
  return (
    <div className={`flex items-start gap-3 py-2.5 ${!last ? "border-b border-gray-50" : ""}`}>
      <div className="w-8 h-8 bg-gray-50 rounded-lg flex items-center justify-center shrink-0 text-gray-400 mt-0.5">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[10px] text-gray-400 uppercase tracking-wide">{label}</p>
        <p className="text-sm font-medium text-gray-700 mt-0.5 truncate">{value}</p>
      </div>
    </div>
  );
}

function InputField({ label, value, onChange, type = "text" }) {
  return (
    <div>
      <label className="text-xs font-medium text-gray-600 mb-1 block">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required
        className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#3E4095] transition"
      />
    </div>
  );
}
