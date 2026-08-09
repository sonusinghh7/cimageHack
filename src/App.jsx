import React, { useState, useEffect } from "react";
import LoginPage from "./Components/LoginPage";
import Dashboard from "./Components/Dashboard";
import { authApi, setUnauthorizedHandler } from "./Components/api";

function App() {
  const [student, setStudent] = useState(null);       // null = not checked yet
  const [loading, setLoading] = useState(true);

  // On mount: check if already logged in via cookie
  useEffect(() => {
    const controller = new AbortController();
    authApi
      .me(controller.signal)
      .then((data) => {
        if (data.student) setStudent(data.student);
      })
      .catch(() => {
        // Not logged in or network error — stay on login page
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, []);

  // Register global unauthorized handler (auto-logout on 401)
  useEffect(() => {
    setUnauthorizedHandler(() => {
      setStudent(null);
    });
  }, []);

  const handleLogin = (studentData) => {
    setStudent(studentData);
  };

  const handleLogout = async () => {
    try {
      await authApi.logout();
    } catch {}
    setStudent(null);
  };

  if (loading) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-4">
          <img src="/logo2.png" alt="Cimage" className="h-14 w-auto animate-pulse" />
          <div className="w-8 h-8 border-4 border-[#3E4095] border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full">
      {student ? (
        <Dashboard student={student} onLogout={handleLogout} />
      ) : (
        <LoginPage onLogin={handleLogin} />
      )}
    </div>
  );
}

export default App;
