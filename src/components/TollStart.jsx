"use client"

import { useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Upload, FileSearch} from "lucide-react"

export default function TollStart() {
  const navigate = useNavigate()

  useEffect(() => {
    // Check authentication
    const token = localStorage.getItem('authToken')
    if (!token) {
      navigate("/toll-login")
    }
  }, [navigate])

  const handleLogout = () => {
    localStorage.removeItem('authToken')
    navigate("/")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-900">Welcome {localStorage.getItem('tollPlaza')}</h2>
        </div>
        {/* Main Navigation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 mb-16">
          
          {/* Upload Vehicle Data */}
          <Link to="/toll-upload" className="group transform transition-all duration-300 hover:scale-105">
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-slate-200 hover:shadow-2xl hover:border-blue-300 transition-all duration-300 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10 text-center">
                <div className="bg-gradient-to-r from-blue-100 to-blue-50 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:from-blue-200 group-hover:to-blue-100 transition-all duration-300 shadow-lg">
                  <Upload className="text-blue-600" size={40} />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-4 group-hover:text-blue-600 transition-colors duration-300">
                  Upload Vehicle Data
                </h3>
                <p className="text-slate-600 leading-relaxed mb-6">
                  Upload and analyze vehicle tire images for comprehensive safety assessment and compliance monitoring
                </p>
                <div className="inline-flex items-center gap-2 text-blue-600 font-semibold group-hover:gap-3 transition-all duration-300">
                  <span>Start Upload</span>
                  <Upload size={16} className="transform group-hover:translate-x-1 transition-transform duration-300" />
                </div>
              </div>
            </div>
          </Link>

          {/* Check Records */}
          <Link to="/check-records" className="group transform transition-all duration-300 hover:scale-105">
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-slate-200 hover:shadow-2xl hover:border-slate-400 transition-all duration-300 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-slate-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10 text-center">
                <div className="bg-gradient-to-r from-slate-100 to-slate-50 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:from-slate-200 group-hover:to-slate-100 transition-all duration-300 shadow-lg">
                  <FileSearch className="text-slate-600" size={40} />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-4 group-hover:text-slate-600 transition-colors duration-300">
                  Records Database
                </h3>
                <p className="text-slate-600 leading-relaxed mb-6">
                  Search and review historical vehicle inspection records with advanced filtering and export capabilities
                </p>
                <div className="inline-flex items-center gap-2 text-slate-600 font-semibold group-hover:gap-3 transition-all duration-300">
                  <span>Browse Records</span>
                  <FileSearch size={16} className="transform group-hover:translate-x-1 transition-transform duration-300" />
                </div>
              </div>
            </div>
          </Link>
        </div>

      </div>
    </div>
  )
}
