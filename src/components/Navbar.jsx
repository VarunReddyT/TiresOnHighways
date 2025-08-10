"use client"

import { useState, useEffect } from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import { Menu, X, LogOut } from "lucide-react"

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [userRole, setUserRole] = useState("")
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const checkAuthStatus = () => {
      const token = localStorage.getItem('authToken')
      const role = localStorage.getItem('userRole')
      setIsAuthenticated(!!token)
      setUserRole(role || "")
    }

    // Check auth status on mount
    checkAuthStatus()

    // Listen for storage changes (for auth updates)
    window.addEventListener('storage', checkAuthStatus)
    
    // Custom event listener for auth changes
    window.addEventListener('authChange', checkAuthStatus)

    return () => {
      window.removeEventListener('storage', checkAuthStatus)
      window.removeEventListener('authChange', checkAuthStatus)
    }
  }, [location]) // Re-check on location change

  const handleLogout = () => {
    localStorage.removeItem('authToken')
    localStorage.removeItem('userRole')
    setIsAuthenticated(false)
    setUserRole("")
    
    // Dispatch custom event for auth change
    window.dispatchEvent(new Event('authChange'))
    
    navigate("/")
  }

  return (
    <nav className="bg-white shadow-lg border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <span className="text-2xl font-bold text-gray-800">Tires On Highways</span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium">
              Home
            </Link>
            <Link to="/guest" className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium">
              Guest
            </Link>
            
            {/* Show Statistics based on user role */}
            {isAuthenticated && userRole === 'admin' ? (
              <Link
                to="/statistics"
                className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium"
              >
                Statistics
              </Link>
            ) : (
              <Link
                to="/home-statistics"
                className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium"
              >
                Safety Overview
              </Link>
            )}
            
            {isAuthenticated && (
              <>
                {userRole === 'admin' ? (
                  <Link
                    to="/admin-dashboard"
                    className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Admin Dashboard
                  </Link>
                ) : (
                  <Link
                    to="/toll-start"
                    className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Toll Dashboard
                  </Link>
                )}
                <Link
                  to="/check-records"
                  className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Check Records
                </Link>
              </>
            )}

            <Link to="/about" className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium">
              About Us
            </Link>
            {!isAuthenticated ? (
              <Link to="/toll-login" className="btn-primary">
                Sign In
              </Link>
            ) : (
              <button onClick={handleLogout} className="btn-secondary flex items-center gap-2">
                <LogOut size={16} />
                Logout
              </button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 hover:text-primary-600 focus:outline-none focus:text-primary-600"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-gray-50">
              <Link to="/" className="block px-3 py-2 text-gray-700 hover:text-primary-600">
                Home
              </Link>
              <Link to="/about" className="block px-3 py-2 text-gray-700 hover:text-primary-600">
                About Us
              </Link>
              <Link to="/guest" className="block px-3 py-2 text-gray-700 hover:text-primary-600">
                Guest
              </Link>
              
              {/* Show Statistics based on user role in mobile */}
              {isAuthenticated && userRole === 'admin' ? (
                <Link to="/statistics" className="block px-3 py-2 text-gray-700 hover:text-primary-600">
                  Statistics
                </Link>
              ) : (
                <Link to="/home-statistics" className="block px-3 py-2 text-gray-700 hover:text-primary-600">
                  Safety Overview
                </Link>
              )}
              
              {isAuthenticated && (
                <>
                  {userRole === 'admin' ? (
                    <Link to="/admin-dashboard" className="block px-3 py-2 text-gray-700 hover:text-primary-600">
                      Admin Dashboard
                    </Link>
                  ) : (
                    <Link to="/toll-start" className="block px-3 py-2 text-gray-700 hover:text-primary-600">
                      Toll Dashboard
                    </Link>
                  )}
                  <Link to="/check-records" className="block px-3 py-2 text-gray-700 hover:text-primary-600">
                    Check Records
                  </Link>
                </>
              )}
              {!isAuthenticated ? (
                <Link to="/toll-login" className="block px-3 py-2 text-primary-600 font-medium">
                  Sign In
                </Link>
              ) : (
                <button onClick={handleLogout} className="block px-3 py-2 text-red-600 font-medium">
                  Logout
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
