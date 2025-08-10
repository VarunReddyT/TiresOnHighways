"use client"

import { useState, useEffect } from "react"
import { BarChart3, CheckCircle, AlertTriangle, XCircle, Shield} from "lucide-react"
import api from "../utils/api"

export default function HomeStatistics() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    fetchPublicStatistics()
  }, [])

  const fetchPublicStatistics = async () => {
    try {
      const response = await api.get("/api/data/public-statistics")

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
          <h3 className="text-lg font-semibold text-slate-900 mb-2">Loading Safety Overview</h3>
          <p className="text-slate-600">Gathering tire safety statistics...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 flex items-center justify-center">
        <div className="text-center bg-white rounded-2xl p-8 shadow-xl border border-red-200">
          <XCircle className="text-red-600 mx-auto mb-4" size={48} />
          <h3 className="text-lg font-semibold text-slate-900 mb-2">Error Loading Statistics</h3>
          <p className="text-red-600">{error}</p>
          <button
            onClick={fetchPublicStatistics}
            className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  const getPercentage = (value) => {
    if (!stats?.totalRecords || stats.totalRecords === 0) return 0
    return Math.round((value / stats.totalRecords) * 100)
  }

  const safePercentage = getPercentage(stats?.statusDistribution?.safe || 0)
  const warningPercentage = getPercentage(stats?.statusDistribution?.warning || 0)
  const dangerPercentage = getPercentage(stats?.statusDistribution?.danger || 0)

  // Calculate pie chart segments
  const total = safePercentage + warningPercentage + dangerPercentage
  const safeAngle = total > 0 ? (safePercentage / total) * 360 : 0
  const warningAngle = total > 0 ? (warningPercentage / total) * 360 : 0
  const dangerAngle = total > 0 ? (dangerPercentage / total) * 360 : 0

  const createPieSlice = (startAngle, angle, color, radius = 100) => {
    if (angle === 0) return null

    const centerX = 120
    const centerY = 120
    const startAngleRad = (startAngle * Math.PI) / 180
    const endAngleRad = ((startAngle + angle) * Math.PI) / 180

    const x1 = centerX + radius * Math.cos(startAngleRad)
    const y1 = centerY + radius * Math.sin(startAngleRad)
    const x2 = centerX + radius * Math.cos(endAngleRad)
    const y2 = centerY + radius * Math.sin(endAngleRad)

    const largeArcFlag = angle > 180 ? 1 : 0

    return (
      <path
        d={`M ${centerX} ${centerY} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`}
        fill={color}
        className="transition-all duration-300 hover:opacity-80"
      />
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Tire Safety Overview</h1>
          <p className="text-lg text-slate-600 font-medium">Public Tire Safety Statistics</p>
        </div>

        {stats && (
          <>
            {/* Total Records Summary */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">

              {/* Total Inspected */}
              <div className="bg-white rounded-2xl p-8 shadow-lg border border-slate-200 hover:shadow-xl transition-all duration-300">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <p className="text-sm font-semibold text-slate-600 uppercase tracking-wide">Total Inspected</p>
                    <p className="text-4xl font-bold text-slate-900 mt-2">{stats.totalRecords?.toLocaleString() || 0}</p>
                  </div>
                  <div className="bg-gradient-to-r from-blue-100 to-blue-50 p-4 rounded-2xl">
                    <BarChart3 className="text-blue-600" size={32} />
                  </div>
                </div>
                <p className="text-slate-600">Vehicles analyzed for tire safety</p>
              </div>

              {/* Safety Rate */}
              <div className="bg-white rounded-2xl p-8 shadow-lg border border-slate-200 hover:shadow-xl transition-all duration-300">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <p className="text-sm font-semibold text-slate-600 uppercase tracking-wide">Safety Rate</p>
                    <p className="text-4xl font-bold text-green-600 mt-2">{getPercentage(stats.statusDistribution?.safe || 0)}%</p>
                  </div>
                  <div className="bg-gradient-to-r from-green-100 to-green-50 p-4 rounded-2xl">
                    <CheckCircle className="text-green-600" size={32} />
                  </div>
                </div>
                <p className="text-slate-600">Tires with safe condition</p>
              </div>
            </div>

            {/* Pie Chart Distribution */}
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-slate-200 mb-12">
              <div className="flex items-center gap-3 mb-8">
                <div className="bg-slate-100 p-2 rounded-xl">
                  <Shield className="text-slate-600" size={24} />
                </div>
                <h3 className="text-2xl font-bold text-slate-900">Tire Safety Distribution</h3>
                <p className="text-sm text-slate-600">Based on our analysis of {stats.totalRecords?.toLocaleString() || 0} vehicles</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">

                {/* Pie Chart */}
                <div className="flex justify-center">
                  <div className="relative">
                    <svg width="240" height="240" className="transform -rotate-90">
                      {/* Safe slice */}
                      {createPieSlice(0, safeAngle, "#22c55e")}
                      {/* Warning slice */}
                      {createPieSlice(safeAngle, warningAngle, "#f59e0b")}
                      {/* Danger slice */}
                      {createPieSlice(safeAngle + warningAngle, dangerAngle, "#ef4444")}
                    </svg>
                  </div>
                </div>

                {/* Legend */}
                <div className="space-y-4">

                  {/* Safe */}
                  <div className="flex items-center justify-between p-3 rounded-xl bg-green-50 border border-green-200">
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="text-green-600" size={18} />
                        <span className="font-semibold text-green-800">Safe</span>
                      </div>
                    </div>
                    <div className="text-xl font-bold text-green-700">{safePercentage}%</div>
                  </div>

                  {/* Warning */}
                  <div className="flex items-center justify-between p-3 rounded-xl bg-yellow-50 border border-yellow-200">
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="text-yellow-600" size={18} />
                        <span className="font-semibold text-yellow-800">Warning</span>
                      </div>
                    </div>
                    <div className="text-xl font-bold text-yellow-700">{warningPercentage}%</div>
                  </div>

                  {/* Danger */}
                  <div className="flex items-center justify-between p-3 rounded-xl bg-red-50 border border-red-200">
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                      <div className="flex items-center gap-2">
                        <XCircle className="text-red-600" size={18} />
                        <span className="font-semibold text-red-800">Danger</span>
                      </div>
                    </div>
                    <div className="text-xl font-bold text-red-700">{dangerPercentage}%</div>
                  </div>

                </div>
              </div>
            </div>

          </>
        )}
      </div>
    </div>
  )
}
