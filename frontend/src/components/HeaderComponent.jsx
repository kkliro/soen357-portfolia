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
    <nav className="bg-neutral-800 w-full">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <img alt="Portfolia Logo" src={logo} className="h-14 w-auto" />
            <span className="text-white text-2xl font-semibold ml-4">Portfolia</span>
          </div>

          {/* Navigation */}
          <div className="hidden sm:flex items-center space-x-4">
            {navigation.map((item) => (
              <a
                key={item.name}
                href={item.href}
                aria-current={item.current ? 'page' : undefined}
                className={`${
                  item.current
                    ? 'bg-indigo-900 text-white'
                    : 'text-white hover:bg-indigo-500 hover:text-white'
                } rounded-md px-4 py-3 text-sm font-medium`}
              >
                {item.name}
              </a>
            ))}
            <button
              onClick={handleLogout}
              className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-md px-4 py-3 text-sm font-medium"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}