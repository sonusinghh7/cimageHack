// src/Components/LoginPage.jsx
import { useEffect, useState } from 'react'
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/solid'
import { authApi } from './api'

const LoginPage = ({ onLogin }) => {
  const [studentId, setStudentId] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Set --vh variable to handle mobile address bar
  useEffect(() => {
    const setVh = () => {
      const vh = window.innerHeight * 0.01
      document.documentElement.style.setProperty('--vh', `${vh}px`)
    }
    setVh()
    window.addEventListener('resize', setVh)
    return () => window.removeEventListener('resize', setVh)
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const data = await authApi.login(studentId.trim(), password)
      if (data.student) {
        onLogin(data.student)
      }
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="w-full flex items-center justify-center bg-white px-5 overflow-hidden"
      style={{ height: 'calc(var(--vh, 1vh) * 100)' }}
    >
      <div className="w-full max-w-sm flex flex-col justify-between h-full" style={{ paddingTop: 'max(2rem, env(safe-area-inset-top))', paddingBottom: 'max(1rem, env(safe-area-inset-bottom))' }}>
        {/* Logo and Title */}
        <div className="flex flex-col items-center mt-8">
          <div className="w-28 h-28 rounded-full flex items-center justify-center mb-4">
            <img src="/logo1.jpg" alt="Cimage Logo" className="w-full h-full object-contain rounded-full" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 tracking-tight">Welcome Back!</h1>
          <p className="text-sm text-gray-500 mt-1">Sign in to CimageConnect</p>
        </div>

        {/* Error Banner */}
        {error && (
          <div className="mt-4 px-4 py-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
            <svg className="w-4 h-4 text-red-500 shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-5 mt-4">
          {/* Student ID */}
          <div>
            <label className="block mb-1.5 text-sm font-medium text-gray-700">
              Student ID
            </label>
            <input
              id="studentId"
              type="text"
              placeholder="e.g. CIM2024001"
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              required
              disabled={loading}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#3E4095] focus:border-transparent transition disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block mb-1.5 text-sm font-medium text-gray-700">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#3E4095] focus:border-transparent transition pr-11 disabled:opacity-50 disabled:cursor-not-allowed"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-3 flex items-center"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
              >
                {showPassword ? (
                  <EyeSlashIcon className="w-5 h-5 text-gray-400" />
                ) : (
                  <EyeIcon className="w-5 h-5 text-gray-400" />
                )}
              </button>
            </div>
          </div>

          {/* Remember Me & Forgot Password */}
          <div className="flex items-center justify-between text-sm">
            <label className="inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 border-gray-300 rounded accent-[#3E4095]"
              />
              <span className="ml-2 text-gray-600">Remember me</span>
            </label>
            <button type="button" className="text-[#3E4095] font-medium hover:underline">
              Forgot Password?
            </button>
          </div>

          {/* Submit Button */}
          <button
            id="loginBtn"
            type="submit"
            disabled={loading}
            className="w-full bg-[#3E4095] text-white rounded-xl font-semibold text-sm hover:bg-[#282A61] active:scale-[0.98] transition-all duration-150 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            style={{ minHeight: '52px' }}
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Signing in...
              </>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="text-center text-xs text-gray-400 mt-6 mb-3 space-y-0.5">
          <p>Made with ❤️ by Sonu</p>
          <p>Version 1.2.1 | Cimage Group Of Institutions</p>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
