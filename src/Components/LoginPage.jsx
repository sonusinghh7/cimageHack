// src/Components/LoginPage.jsx
import { useEffect, useState } from 'react'
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/solid'

const LoginPage = ({ onLogin }) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)

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

  const handleSubmit = (e) => {
    e.preventDefault()
    onLogin()
  }

  return (
    <div
      className="w-full flex items-center justify-center bg-white px-4 overflow-hidden"
      style={{ height: 'calc(var(--vh, 1vh) * 100)' }}
    >
      <div className="w-full max-w-sm flex flex-col justify-between h-full py-4">
        {/* Logo and Title */}
        <div className="flex flex-col items-center mt-8">
          <div className="w-28 h-28 rounded-full  flex items-center justify-center mb-4">
            <img src="/logo1.jpg" alt="logo" />
          </div>
          <h2 className="text-xl font-bold text-gray-800">Welcome Back !</h2>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-5 mt-6">
          {/* Email */}
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              User Name
            </label>
            <input
              type="text"
              placeholder="Enter User Name"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 pr-10"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-3 flex items-center"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeSlashIcon className="w-5 h-5 text-gray-500" />
                ) : (
                  <EyeIcon className="w-5 h-5 text-gray-500" />
                )}
              </button>
            </div>
          </div>

          {/* Remember Me & Forgot Password */}
          <div className="flex items-center justify-between text-sm">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 border-gray-300 rounded"
              />
              <span className="ml-2 text-gray-600">Remember me</span>
            </label>
            <button type="button" className="text-red-500">
              Forgot Password?
            </button>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 bg-[#3E4095] text-white rounded-md hover:bg-[#282A61] transition"
          >
            Sign In
          </button>
        </form>

        {/* Footer */}
        <div className="text-center text-xs text-gray-400 mt-6 mb-3 space-y-0.5">
            <p>Made by Sonu with love</p>
            <p>Version 1.2.2 | Cimage Group Of Institutions</p>
        </div>

      </div>
    </div>
  )
}

export default LoginPage
