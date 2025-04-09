import React, { useState } from 'react'
import logo from '../assets/logo.png'

export default function LoginPopup({ closeModal }) {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log("Logging in with:", formData)
    closeModal()
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black opacity-50" onClick={closeModal}></div>

      {/* Popup container */}
      <div className="relative bg-gray-900 bg-opacity-90 border border-purple-800 rounded-2xl shadow-2xl w-full max-w-md mx-auto z-10 p-6 backdrop-blur-lg">
        {/* Close button */}
        <div className="flex justify-end">
          <button onClick={closeModal} className="text-gray-400 hover:text-purple-400 transition">
            &#x2715;
          </button>
        </div>

        {/* Header */}
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <img alt="Portfolia" src={logo} className="mx-auto h-20 w-auto" />
          <h2 className="mt-6 text-center text-2xl font-bold tracking-tight text-white">
            Log in to your account
          </h2>
        </div>

        {/* Form */}
        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-sm">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-purple-400">
                Email address
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="block w-full rounded-md bg-black bg-opacity-40 border border-purple-700 px-3 py-2 text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-purple-500"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-sm font-medium text-purple-400">
                  Password
                </label>
                <a href="#" className="text-sm text-purple-500 hover:text-purple-400 transition">
                  Forgot password?
                </a>
              </div>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  autoComplete="current-password"
                  value={formData.password}
                  onChange={handleChange}
                  className="block w-full rounded-md bg-black bg-opacity-40 border border-purple-700 px-3 py-2 text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-purple-500"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="w-full flex justify-center rounded-lg bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 px-4 py-2 text-sm font-semibold text-white transition transform hover:scale-105"
              >
                Log in
              </button>
            </div>
          </form>

          <p className="mt-8 text-center text-sm text-gray-400">
            Don't have an account?{' '}
            <a href="#" className="font-semibold text-purple-500 hover:text-purple-400 transition">
              Create Account
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}