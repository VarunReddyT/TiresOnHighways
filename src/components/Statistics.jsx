"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { BarChart3, TrendingUp, Users, CheckCircle, AlertTriangle, XCircle, Clock, Shield, FileText} from "lucide-react"
import api from "../utils/api"

export default function Statistics() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const navigate = useNavigate()

  useEffect(() => {
    // Check if user is authenticated and is admin
    const authToken = localStorage.getItem('authToken')
    const userRole = localStorage.getItem('userRole')
    
    if (!authToken) {
      navigate("/toll-login")
      return
    }

    // Only allow admin access to full statistics
    if (userRole !== 'admin') {
      navigate("/no-access")
      return
    }

    fetchStatistics()
  }, [navigate])

  const fetchStatistics = async () => {
    try {
      const response = await api.get("/api/data/statistics", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        },
      })

      if (response.data.success) {
        setStats(response.data.data)
      }
    } catch (error) {
      setError(error.response?.data?.message || "Failed to fetch statistics")
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 flex items-center justify-center">
        <div className="text-center bg-white rounded-2xl p-8 shadow-xl border border-slate-200">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent mx-auto mb-6"></div>
          <h3 className="text-lg font-semibold text-slate-900 mb-2">Loading Analytics Dashboard</h3>
          <p className="text-slate-600">Gathering comprehensive statistics...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 flex items-center justify-center">
        <div className="text-center bg-white rounded-2xl p-8 shadow-xl border border-red-200">
          <div className="bg-red-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <AlertTriangle className="text-red-600" size={32} />
          </div>
          <h3 className="text-lg font-semibold text-slate-900 mb-2">Unable to Load Statistics</h3>
          <p className="text-red-600 mb-6">{error}</p>
          <button 
            onClick={fetchStatistics} 
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            Retry Loading
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="bg-white rounded-3xl p-8 shadow-xl border border-slate-200 backdrop-blur-lg">
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="bg-gradient-to-r from-blue-600 to-slate-700 p-3 rounded-2xl">
                <BarChart3 className="text-white" size={32} />
              </div>
              <div className="text-left">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-slate-700 bg-clip-text text-transparent">
                  Analytics Dashboard
                </h1>
                <p className="text-lg text-slate-600 font-medium">Comprehensive Vehicle Safety Analytics</p>
              </div>
            </div>
          </div>
        </div>

        {stats && (
          <>
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              
              {/* Total Records */}
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200 hover:shadow-xl transition-all duration-300 group">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm font-semibold text-slate-600 uppercase tracking-wide">Total Records</p>
                    <p className="text-3xl font-bold text-slate-900 mt-1">{stats.totalRecords?.toLocaleString() || 0}</p>
                  </div>
                  <div className="bg-gradient-to-r from-blue-100 to-blue-50 p-3 rounded-2xl group-hover:from-blue-200 group-hover:to-blue-100 transition-all duration-300">
                    <BarChart3 className="text-blue-600" size={28} />
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Clock size={14} className="text-slate-600" />
                  <span className="text-slate-600 font-medium">Overall Records</span>
                </div>
              </div>

              {/* Toll Records */}
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200 hover:shadow-xl transition-all duration-300 group">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm font-semibold text-slate-600 uppercase tracking-wide">Official Uploads</p>
                    <p className="text-3xl font-bold text-slate-900 mt-1">{stats.tollRecords?.toLocaleString() || 0}</p>
                  </div>
                  <div className="bg-gradient-to-r from-green-100 to-green-50 p-3 rounded-2xl group-hover:from-green-200 group-hover:to-green-100 transition-all duration-300">
                    <Shield className="text-green-600" size={28} />
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <TrendingUp size={14} className="text-green-600" />
                  <span className="text-green-600 font-medium">Toll Operator Records</span>
                </div>
              </div>

              {/* Guest Records */}
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200 hover:shadow-xl transition-all duration-300 group">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm font-semibold text-slate-600 uppercase tracking-wide">Public Access</p>
                    <p className="text-3xl font-bold text-slate-900 mt-1">{stats.guestRecords?.toLocaleString() || 0}</p>
                  </div>
                  <div className="bg-gradient-to-r from-slate-100 to-slate-50 p-3 rounded-2xl group-hover:from-slate-200 group-hover:to-slate-100 transition-all duration-300">
                    <Users className="text-slate-600" size={28} />
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Users size={14} className="text-slate-600" />
                  <span className="text-slate-600 font-medium">Guest Submissions</span>
                </div>
              </div>
            </div>

            {/* Status Distribution & Daily Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-1 gap-8 mb-12">
              
              {/* Tire Condition Status */}
              <div className="bg-white rounded-2xl p-8 shadow-lg border border-slate-200">
                <div className="flex items-center gap-3 mb-8">
                  <div className="bg-slate-100 p-2 rounded-xl">
                    <Shield className="text-slate-600" size={24} />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">Safety Assessment Overview</h3>
                </div>
                
                <div className="space-y-6">
                  <div className="flex items-center justify-between group hover:bg-green-50 p-3 rounded-xl transition-all duration-200">
                    <div className="flex items-center gap-4">
                      <div className="bg-green-100 p-2 rounded-xl">
                        <CheckCircle className="text-green-600" size={20} />
                      </div>
                      <div>
                        <span className="font-semibold text-slate-900">Safe Condition</span>
                        <p className="text-sm text-slate-600">Excellent tire condition</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-32 bg-slate-200 rounded-full h-3">
                        <div
                          className="bg-green-600 h-3 rounded-full transition-all duration-500"
                          style={{
                            width: `${stats.statusDistribution?.safe && stats.totalRecords ? 
                              (stats.statusDistribution.safe / stats.totalRecords) * 100 : 0}%`,
                          }}
                        ></div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-slate-900">{stats.statusDistribution?.safe || 0}</div>
                        <div className="text-xs text-slate-500">
                          {stats.statusDistribution?.safe && stats.totalRecords ? 
                            Math.round((stats.statusDistribution.safe / stats.totalRecords) * 100) : 0}%
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between group hover:bg-yellow-50 p-3 rounded-xl transition-all duration-200">
                    <div className="flex items-center gap-4">
                      <div className="bg-yellow-100 p-2 rounded-xl">
                        <AlertTriangle className="text-yellow-600" size={20} />
                      </div>
                      <div>
                        <span className="font-semibold text-slate-900">Needs Attention</span>
                        <p className="text-sm text-slate-600">Minor wear detected</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-32 bg-slate-200 rounded-full h-3">
                        <div
                          className="bg-yellow-600 h-3 rounded-full transition-all duration-500"
                          style={{
                            width: `${stats.statusDistribution?.warning && stats.totalRecords ? 
                              (stats.statusDistribution.warning / stats.totalRecords) * 100 : 0}%`,
                          }}
                        ></div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-slate-900">{stats.statusDistribution?.warning || 0}</div>
                        <div className="text-xs text-slate-500">
                          {stats.statusDistribution?.warning && stats.totalRecords ? 
                            Math.round((stats.statusDistribution.warning / stats.totalRecords) * 100) : 0}%
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between group hover:bg-red-50 p-3 rounded-xl transition-all duration-200">
                    <div className="flex items-center gap-4">
                      <div className="bg-red-100 p-2 rounded-xl">
                        <XCircle className="text-red-600" size={20} />
                      </div>
                      <div>
                        <span className="font-semibold text-slate-900">Critical Risk</span>
                        <p className="text-sm text-slate-600">Immediate replacement needed</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-32 bg-slate-200 rounded-full h-3">
                        <div
                          className="bg-red-600 h-3 rounded-full transition-all duration-500"
                          style={{
                            width: `${stats.statusDistribution?.danger && stats.totalRecords ? 
                              (stats.statusDistribution.danger / stats.totalRecords) * 100 : 0}%`,
                          }}
                        ></div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-slate-900">{stats.statusDistribution?.danger || 0}</div>
                        <div className="text-xs text-slate-500">
                          {stats.statusDistribution?.danger && stats.totalRecords ? 
                            Math.round((stats.statusDistribution.danger / stats.totalRecords) * 100) : 0}%
                        </div>
                      </div>
                    </div>
                  </div>

                </div>
              </div>

            </div>

            {/* Key Insights */}
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-slate-200">
              <div className="flex items-center gap-3 mb-8">
                <div className="bg-gradient-to-r from-blue-600 to-slate-700 p-2 rounded-xl">
                  <FileText className="text-white" size={24} />
                </div>
                <h3 className="text-xl font-bold text-slate-900">Performance Insights</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-2xl p-6 hover:shadow-lg transition-all duration-300 group">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="bg-green-200 p-2 rounded-xl group-hover:bg-green-300 transition-colors duration-300">
                      <CheckCircle className="text-green-700" size={20} />
                    </div>
                    <h4 className="font-bold text-green-800">Safety Compliance</h4>
                  </div>
                  <p className="text-3xl font-bold text-green-700 mb-2">
                    {stats.statusDistribution?.safe && stats.totalRecords ? 
                      Math.round((stats.statusDistribution.safe / stats.totalRecords) * 100) : 0}%
                  </p>
                  <p className="text-sm text-green-700 font-medium">
                    of vehicles meet safety standards
                  </p>
                </div>

                <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 border border-yellow-200 rounded-2xl p-6 hover:shadow-lg transition-all duration-300 group">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="bg-yellow-200 p-2 rounded-xl group-hover:bg-yellow-300 transition-colors duration-300">
                      <AlertTriangle className="text-yellow-700" size={20} />
                    </div>
                    <h4 className="font-bold text-yellow-800">Requires Attention</h4>
                  </div>
                  <p className="text-3xl font-bold text-yellow-700 mb-2">
                    {(stats.statusDistribution?.warning || 0) + (stats.statusDistribution?.danger || 0)}
                  </p>
                  <p className="text-sm text-yellow-700 font-medium">
                    vehicles need maintenance or replacement
                  </p>
                </div>

                <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-2xl p-6 hover:shadow-lg transition-all duration-300 group">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="bg-blue-200 p-2 rounded-xl group-hover:bg-blue-300 transition-colors duration-300">
                      <Users className="text-blue-700" size={20} />
                    </div>
                    <h4 className="font-bold text-blue-800">Public Engagement</h4>
                  </div>
                  <p className="text-3xl font-bold text-blue-700 mb-2">
                    {stats.guestRecords && stats.totalRecords ? 
                      Math.round((stats.guestRecords / stats.totalRecords) * 100) : 0}%
                  </p>
                  <p className="text-sm text-blue-700 font-medium">
                    of submissions from public users
                  </p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
