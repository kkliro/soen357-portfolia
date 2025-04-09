import React, { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import logo from '../assets/logo.png'
import { AuthContext } from '../context/AuthContext'
import { logoutUser } from '../hooks/auth/logout'

export default function HeaderComponent() {
  const { token, logout } = useContext(AuthContext)
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      await logoutUser(token)
    } catch (error) {
      console.error('Logout error:', error)
    }
    logout()
    navigate('/')
  }

  const navigation = [
    { name: 'Home', href: '/home', current: false },
    { name: 'Markets', href: '/markets', current: false },
    { name: 'Portfolio Management', href: '/portfolio', current: false },
    { name: 'Strategy Management', href: '/strategy', current: false },
  ]

  return (
    <nav className="fixed top-0 w-full bg-black bg-opacity-70 backdrop-blur-lg z-50 border-b border-purple-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          
          {/* Logo + Title */}
          <div className="flex items-center gap-2">
            <img alt="Portfolia Logo" src={logo} className="h-10 w-10" />
            <span className="text-2xl font-bold text-purple-400">Portfolia</span>
          </div>

          {/* Navigation */}
          <div className="hidden sm:flex items-center space-x-4">
            {navigation.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className={`${
                  item.current
                    ? 'bg-indigo-800 text-white'
                    : 'text-white hover:bg-indigo-600 hover:text-white'
                } rounded-md px-4 py-2 text-sm font-medium transition-colors duration-200`}
              >
                {item.name}
              </a>
            ))}
            <button
              onClick={handleLogout}
              className=" hover:bg-indigo-600 text-white rounded-md px-4 py-2 text-sm font-medium transition-colors duration-200"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}