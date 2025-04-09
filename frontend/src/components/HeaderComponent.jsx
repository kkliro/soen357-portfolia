import React, { useContext, useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import ReactDOM from 'react-dom';
import logo from '../assets/logo.png'
import user_icon from '../assets/user_icon.png'
import { AuthContext } from '../context/AuthContext'
import { logoutUser } from '../hooks/auth/logout'

export default function HeaderComponent() {
  const { token, logout } = useContext(AuthContext)
  const navigate = useNavigate()
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [dropdownStyle, setDropdownStyle] = useState({});
  const dropdownRef = useRef(null)

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        !document.getElementById('dropdown-portal')?.contains(event.target)
      ) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('click', handleClickOutside)
    return () => {
      document.removeEventListener('click', handleClickOutside)
    }
  }, [])

  const toggleDropdown = () => {
    const newState = !dropdownOpen;
    setDropdownOpen(newState);
    if (newState && dropdownRef.current) {
      const rect = dropdownRef.current.getBoundingClientRect();
      setDropdownStyle({
        position: 'absolute',
        top: rect.bottom + window.scrollY,
        left: rect.left + rect.width / 2 - 80,
      });
    }
  };

  const handleLogout = async () => {
    console.log('Logout button clicked');
    try {
      console.log('Logging out...');
      await logoutUser(token);
      console.log('Logout successful');
    } catch (error) {
      console.error('Logout error:', error);
    }
    logout();
    console.log('Redirecting to home');
    navigate('/');
  };

  const navigation = [
    { name: 'Home', href: '/home', current: false },
    { name: 'Markets', href: '/markets', current: false },
    { name: 'Portfolio Management', href: '/portfolio', current: false },
    { name: 'Strategy Management', href: '/strategy', current: false },
  ]

  return (
    <nav className="fixed top-0 w-full bg-black bg-opacity-70 backdrop-blur-lg z-50 border-b border-purple-900">
      <div className="mx-auto px-4 sm:px-10 lg:px-14">
        <div className="flex h-16 items-center justify-between">
          
          {/* Logo + Title */}
          <div className="flex items-center gap-2">
            <img alt="Portfolia Logo" src={logo} className="h-12 w-12" />
            <span className="text-3xl font-bold text-purple-400">Portfolia</span>
          </div>

          {/* Navigation */}
          <div className="flex items-center space-x-4 ml-auto">
            {navigation.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className={`${
                  item.current
                    ? 'bg-indigo-800 text-purple-400'
                    : 'text-purple-400 hover:bg-indigo-600 hover:text-white'
                } rounded-md px-4 py-2 text-sm font-medium transition-colors duration-200`}
              >
                {item.name}
              </a>
            ))}
            <div ref={dropdownRef} className="relative flex items-center cursor-pointer" onClick={toggleDropdown}>
              <img
                src={user_icon}
                alt="User"
                className="h-5 w-5"
              />
              <span className={`ml-1 text-xs text-purple-400 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`}>▼</span>
              {dropdownOpen &&
                ReactDOM.createPortal(
                  <div id="dropdown-portal" style={{ ...dropdownStyle, zIndex: 60 }} className="my-4 w-30 bg-black border border-purple-900 rounded-md shadow-lg">
                    <button
                      onClick={() => { navigate('/account'); setDropdownOpen(false); }}
                      className="w-full text-left px-4 py-2 text-purple-400 hover:bg-indigo-600 hover:text-white"
                    >
                      Account
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleLogout(); }}
                      className="w-full text-left px-4 py-2 text-purple-400 hover:bg-indigo-600 hover:text-white"
                    >
                      Logout
                    </button>
                  </div>,
                  document.body
                )
              }
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}