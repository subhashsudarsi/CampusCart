import { Link } from 'react-router-dom'
import { useState } from 'react'
import useAuth from '../hooks/useAuth'

export default function Navbar() {
  const { user, logout } = useAuth()
  const [showMenu, setShowMenu] = useState(false)
  const isAdmin = user?.role === 'admin'
  const isStudent = user?.role === 'student'

  const handleLogout = () => {
    logout()
    setShowMenu(false)
  }

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <img src="/images/logo.webp" alt="CampusCart Logo" className="h-12 w-12 object-contain" />
              <div className="flex flex-col">
                <span className="text-xl font-bold text-blue-600">CampusCart</span>
                <span className="text-xs text-gray-500">Marketplace</span>
              </div>
            </Link>
          </div>

          {/* Center Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-700 hover:text-blue-600 transition">Home</Link>
            {isStudent && (
              <>
                <Link to="/post-listing" className="text-gray-700 hover:text-blue-600 transition">Sell</Link>
                <Link to="/messages" className="text-gray-700 hover:text-blue-600 transition">Messages</Link>
              </>
            )}
            {isAdmin && (
              <>
                <Link to="/admin" className="text-gray-700 hover:text-blue-600 transition">Admin Dashboard</Link>
                <Link to="/post-listing" className="text-gray-700 hover:text-blue-600 transition">Add Item</Link>
              </>
            )}
          </div>

          {/* Right Side */}
          <div className="flex items-center space-x-4">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setShowMenu(!showMenu)}
                  className="flex items-center space-x-2 text-gray-700 hover:text-blue-600"
                >
                  <span className={`hidden sm:inline text-xs font-semibold px-2 py-1 rounded-full ${isAdmin ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>
                    {isAdmin ? 'Admin' : 'Student'}
                  </span>
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm">
                    {user.name?.charAt(0).toUpperCase()}
                  </div>
                </button>

                {showMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2">
                    {isAdmin && (
                      <Link
                        to="/post-listing"
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                        onClick={() => setShowMenu(false)}
                      >
                        Add Item
                      </Link>
                    )}
                    {isAdmin && (
                      <Link
                        to="/admin"
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                        onClick={() => setShowMenu(false)}
                      >
                        Admin Dashboard
                      </Link>
                    )}
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                      onClick={() => setShowMenu(false)}
                    >
                      Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 border-t"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
