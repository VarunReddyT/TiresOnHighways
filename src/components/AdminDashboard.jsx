"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Users, Plus, Trash2, Eye, ChevronLeft, ChevronRight, Search, Car, Database, X, Shield, UserCheck, UserPlus, User } from "lucide-react"
import api from "../utils/api"
import Loader from "./Loading"

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("users")
  const [users, setUsers] = useState([])
  const [tollData, setTollData] = useState([])
  const [guestData, setGuestData] = useState([])
  const [tollOperators, setTollOperators] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedTollOperator, setSelectedTollOperator] = useState("")
  const [hasSearched, setHasSearched] = useState(false)
  const [showAddUser, setShowAddUser] = useState(false)
  const [showViewModal, setShowViewModal] = useState(false)
  const [selectedItem, setSelectedItem] = useState(null)
  const navigate = useNavigate()

  // Form state for adding new user
  const [newUser, setNewUser] = useState({
    username: "",
    password: "",
    role: "toll_operator",
    tollPlaza: ""
  })

  useEffect(() => {
    // Check if user is admin
    const token = localStorage.getItem('authToken')
    if (!token) {
      navigate("/toll-login")
      return
    }

    fetchCurrentUser()

    // Only fetch users by default and toll operators for dropdown
    if (activeTab === "users") {
      fetchUsers()
    }

    // Load toll operators for dropdown
    fetchTollOperators()
  }, [navigate])

  // Handle tab changes - clear data and reset states
  useEffect(() => {
    setCurrentPage(1)
    setSearchTerm("")
    setSelectedTollOperator("")
    setHasSearched(false)
    setTotalPages(1)

    // Only auto-fetch users, others require search
    if (activeTab === "users") {
      fetchUsers()
    } else {
      // Clear data for other tabs
      setTollData([])
      setGuestData([])
    }
  }, [activeTab])

  const fetchCurrentUser = async () => {
    try {
      const response = await api.get("/api/auth/profile")
      if (response.data.user.role !== 'admin') {
        navigate("/toll-start")
      }
    } catch (error) {
      navigate("/toll-login")
    }
  }

  const fetchTollOperators = async () => {
    try {
      const response = await api.get("/api/admin/toll-operators")
      if (response.data.success) {
        setTollOperators(response.data.operators)
      }
    } catch (error) {
      console.error("Failed to fetch toll operators:", error)
    }
  }

  const fetchUsers = async (page = 1) => {
    setLoading(true)
    try {
      const response = await api.get("/api/admin/users", {
        params: { page, search: searchTerm, limit: 10 }
      })
      if (response.data.success) {
        setUsers(response.data.users)
        setTotalPages(response.data.totalPages)
        setCurrentPage(page)
      }
    } catch (error) {
      setError("Failed to fetch users")
    } finally {
      setLoading(false)
    }
  }

  // Search functions
  const handleSearch = () => {
    setError("")
    setCurrentPage(1)

    if (activeTab === "users") {
      fetchUsers(1)
    } else if (activeTab === "toll-data") {
      fetchTollData(1, true)
    } else if (activeTab === "guest-data") {
      fetchGuestData(1, true)
    }
  }

  const handleClearSearch = () => {
    setSearchTerm("")
    setSelectedTollOperator("")
    setHasSearched(false)
    setCurrentPage(1)
    setTotalPages(1)

    if (activeTab === "toll-data") {
      setTollData([])
    } else if (activeTab === "guest-data") {
      setGuestData([])
    } else if (activeTab === "users") {
      fetchUsers(1)
    }
  }

  // Pagination handler
  const handlePageChange = (page) => {
    if (activeTab === "users") {
      fetchUsers(page)
    } else if (activeTab === "toll-data") {
      fetchTollData(page)
    } else if (activeTab === "guest-data") {
      fetchGuestData(page)
    }
  }

  const fetchTollData = async (page = 1, searchOnly = false) => {
    // Require either toll operator selection or search term
    if (searchOnly && !selectedTollOperator && !searchTerm) {
      setError("Please select a toll operator or enter search criteria")
      return
    }

    setLoading(true)
    try {
      const params = {
        page,
        limit: 10
      }

      if (selectedTollOperator) {
        params.tollOperator = selectedTollOperator
      }

      if (searchTerm) {
        params.search = searchTerm
      }

      const response = await api.get("/api/admin/toll-data", { params })
      if (response.data.success) {
        setTollData(response.data.data)
        setTotalPages(response.data.totalPages)
        setCurrentPage(page)
        setHasSearched(true)
      }
    } catch (error) {
      setError("Failed to fetch toll data")
    } finally {
      setLoading(false)
    }
  }

  const fetchGuestData = async (page = 1, searchOnly = false) => {
    // Require search term for guest data
    if (searchOnly && !searchTerm) {
      setError("Please enter vehicle number or mobile number to search")
      return
    }

    setLoading(true)
    try {
      const response = await api.get("/api/admin/guest-data", {
        params: { page, search: searchTerm, limit: 10 }
      })
      if (response.data.success) {
        setGuestData(response.data.data)
        setTotalPages(response.data.totalPages)
        setCurrentPage(page)
        setHasSearched(true)
      }
    } catch (error) {
      setError("Failed to fetch guest data")
    } finally {
      setLoading(false)
    }
  }

  const handleAddUser = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const response = await api.post("/api/auth/register", newUser)
      if (response.data.success) {
        setSuccess("User created successfully")
        setShowAddUser(false)
        setNewUser({ username: "", password: "", role: "toll_operator", tollPlaza: "" })
        fetchUsers()
      }
    } catch (error) {
      setError(error.response?.data?.message || "Failed to create user")
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteUser = async (userId) => {
    if (!confirm("Are you sure you want to delete this user?")) return

    setLoading(true)
    try {
      const response = await api.delete(`/api/admin/users/${userId}`)
      if (response.data.success) {
        setSuccess("User deleted successfully")
        fetchUsers()
      }
    } catch (error) {
      setError("Failed to delete user")
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('authToken')
    navigate("/")
  }

  const handleViewDetails = (item) => {
    setSelectedItem(item)
    setShowViewModal(true)
  }

  const renderPagination = () => (
    <div className="flex items-center justify-between px-6 py-3 bg-white border-t">
      <div className="flex items-center text-sm text-gray-500">
        Page {currentPage} of {totalPages}
      </div>
      <div className="flex items-center space-x-2">
        <button
          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50"
        >
          <ChevronLeft size={20} />
        </button>
        <button
          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50"
        >
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
      {loading && <Loader />}

      {/* Professional Header */}
      <div className="bg-white shadow-xl border-b border-slate-200 backdrop-blur-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center gap-4">
              <div className="bg-gradient-to-r from-blue-600 to-slate-700 p-3 rounded-2xl">
                <Shield className="text-white" size={28} />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-slate-700 bg-clip-text text-transparent">
                  Admin Dashboard
                </h1>
                <p className="text-sm text-slate-600 font-medium">System Management & Control Panel</p>
              </div>
            </div>

          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Professional Alerts */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4 shadow-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-red-100 p-2 rounded-xl">
                  <X className="text-red-600" size={20} />
                </div>
                <div>
                  <div className="font-semibold text-red-800">Error</div>
                  <div className="text-sm text-red-700">{error}</div>
                </div>
              </div>
              <button
                onClick={() => setError("")}
                className="text-red-500 hover:text-red-700 p-1 rounded-lg hover:bg-red-100 transition-colors"
              >
                <X size={18} />
              </button>
            </div>
          </div>
        )}

        {success && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-xl p-4 shadow-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-green-100 p-2 rounded-xl">
                  <UserCheck className="text-green-600" size={20} />
                </div>
                <div>
                  <div className="font-semibold text-green-800">Success</div>
                  <div className="text-sm text-green-700">{success}</div>
                </div>
              </div>
              <button
                onClick={() => setSuccess("")}
                className="text-green-500 hover:text-green-700 p-1 rounded-lg hover:bg-green-100 transition-colors"
              >
                <X size={18} />
              </button>
            </div>
          </div>
        )}

        {/* Professional Tab Navigation */}
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
          <div className="border-b border-slate-200 bg-slate-50">
            <nav className="flex px-6" aria-label="Tabs">
              {[
                { id: "users", name: "User Management", icon: Users, color: "blue" },
                { id: "toll-data", name: "Toll Operations", icon: Car, color: "green" },
                { id: "guest-data", name: "Public Records", icon: Database, color: "slate" },
              ].map((tab) => {
                const Icon = tab.icon
                const isActive = activeTab === tab.id
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id)
                      setCurrentPage(1)
                      setSearchTerm("")
                    }}
                    className={`relative py-4 px-6 font-semibold text-sm flex items-center gap-3 transition-all duration-300 ${isActive
                        ? `text-${tab.color || 'blue'}-600 border-b-2 border-${tab.color || 'blue'}-500 bg-${tab.color || 'blue'}-50`
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 border-b-2 border-transparent'
                      }`}
                  >
                    <div className={`p-1.5 rounded-lg ${isActive
                        ? `bg-${tab.color || 'blue'}-100`
                        : 'bg-slate-200 group-hover:bg-slate-300'
                      }`}>
                      <Icon size={18} />
                    </div>
                    <span>{tab.name}</span>
                    {isActive && (
                      <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-blue-500 to-slate-600"></div>
                    )}
                  </button>
                )
              })}
            </nav>
          </div>

          {/* Professional Content Area */}
          <div className="p-8">

            {/* Search and Actions Bar */}
            <div className="flex flex-col gap-4 mb-8">

              {/* Search Controls */}
              <div className="flex flex-col sm:flex-row gap-4">

                {/* Toll Operator Dropdown - Only for toll-data tab */}
                {activeTab === "toll-data" && (
                  <div className="flex-1 max-w-xs">
                    <select
                      value={selectedTollOperator}
                      onChange={(e) => setSelectedTollOperator(e.target.value)}
                      className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white shadow-sm"
                    >
                      <option value="">All Toll Operators</option>
                      {tollOperators.map((operator) => (
                        <option key={operator._id} value={operator.tollPlaza}>
                          {operator.username} ({operator.tollPlaza})
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Search Input */}
                <div className="relative flex-1 max-w-md">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder={
                      activeTab === "users" ? "Search users..." :
                        activeTab === "toll-data" ? "Search by vehicle/mobile number..." :
                          "Search by vehicle/mobile number..."
                    }
                    className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white shadow-sm"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        handleSearch()
                      }
                    }}
                  />
                </div>

                {/* Search Buttons */}
                <div className="flex gap-2">
                  <button
                    onClick={handleSearch}
                    disabled={loading}
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50"
                  >
                    <Search size={18} />
                    Search
                  </button>

                  {(hasSearched || searchTerm || selectedTollOperator) && (
                    <button
                      onClick={handleClearSearch}
                      className="inline-flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-3 rounded-xl font-semibold transition-all duration-200"
                    >
                      <X size={18} />
                      Clear
                    </button>
                  )}
                </div>
              </div>

              {/* Add User Button */}
              {activeTab === "users" && (
                <div className="flex justify-end">
                  <button
                    onClick={() => setShowAddUser(true)}
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl"
                  >
                    <Plus size={20} />
                    Add New User
                  </button>
                </div>
              )}
            </div>

            {/* Professional Users Tab */}
            {activeTab === "users" && (
              <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
                <div className="divide-y divide-slate-200">
                  {users.map((user) => (
                    <div key={user._id} className="p-6 hover:bg-slate-50 transition-all duration-200">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="relative">
                            <div className="h-12 w-12 rounded-2xl bg-gradient-to-r from-blue-100 to-slate-100 flex items-center justify-center shadow-md">
                              <Users className="h-6 w-6 text-blue-600" />
                            </div>
                            <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${user.isActive ? 'bg-green-500' : 'bg-red-500'
                              }`}></div>
                          </div>
                          <div>
                            <div className="text-lg font-bold text-slate-900">{user.username}</div>
                            <div className="text-sm text-slate-600 flex items-center gap-2">
                              <span className="capitalize">{user.role}</span>
                              {user.tollPlaza && (
                                <>
                                  <span>•</span>
                                  <span>{user.tollPlaza}</span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-4">
                          <span className={`inline-flex items-center px-3 py-1 rounded-xl text-xs font-bold border ${user.isActive
                              ? 'bg-green-50 text-green-700 border-green-200'
                              : 'bg-red-50 text-red-700 border-red-200'
                            }`}>
                            {user.isActive ? '● Active' : '● Inactive'}
                          </span>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleViewDetails(user)}
                              className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-all duration-200"
                              title="View Details"
                            >
                              <Eye size={18} />
                            </button>
                            {user.role !== 'admin' && (
                              <button
                                onClick={() => handleDeleteUser(user._id)}
                                className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all duration-200"
                                title="Delete User"
                              >
                                <Trash2 size={18} />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Professional Pagination */}
                <div className="bg-slate-50 px-6 py-4 border-t border-slate-200">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-slate-600">
                      Page <span className="font-semibold">{currentPage}</span> of <span className="font-semibold">{totalPages}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className="p-2 text-slate-400 hover:text-slate-600 disabled:opacity-50 hover:bg-white rounded-lg transition-all duration-200"
                      >
                        <ChevronLeft size={20} />
                      </button>
                      <button
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className="p-2 text-slate-400 hover:text-slate-600 disabled:opacity-50 hover:bg-white rounded-lg transition-all duration-200"
                      >
                        <ChevronRight size={20} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Professional Toll Data Tab */}
            {activeTab === "toll-data" && (
              <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
                {tollData.length > 0 ? (
                  <>
                    <div className="divide-y divide-slate-200">
                      {tollData.map((data) => (
                        <div key={data._id} className="p-6 hover:bg-slate-50 transition-all duration-200">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className="h-12 w-12 rounded-2xl bg-gradient-to-r from-green-100 to-blue-100 flex items-center justify-center shadow-md">
                                <Car className="h-6 w-6 text-green-600" />
                              </div>
                              <div className="flex-1">
                                <div className="font-semibold text-slate-900 text-lg">{data.vehicleNumber}</div>
                                <div className="text-sm text-slate-600 mt-1">
                                  Mobile: <span className="font-medium">{data.userMobileNumber}</span> |
                                  Date: <span className="font-medium">{new Date(data.createdAt).toLocaleDateString()}</span> |
                                  Operator: <span className="font-medium">{data.tollOperator}</span>
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center gap-3">
                              <span className={`inline-flex items-center px-4 py-2 rounded-xl text-sm font-bold border ${data.overallStatus === 'safe' ? 'bg-green-50 text-green-700 border-green-200' :
                                  data.overallStatus === 'warning' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                                    'bg-red-50 text-red-700 border-red-200'
                                }`}>
                                {data.overallStatus?.charAt(0).toUpperCase() + data.overallStatus?.slice(1) || 'Processing'}
                              </span>
                              <button
                                onClick={() => handleViewDetails(data)}
                                className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-all duration-200"
                                title="View Details"
                              >
                                <Eye size={18} />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Pagination for Toll Data */}
                    {totalPages > 1 && (
                      <div className="bg-slate-50 px-6 py-4 border-t border-slate-200">
                        <div className="flex items-center justify-between">
                          <div className="text-sm text-slate-600">
                            Showing <span className="font-semibold">{tollData.length}</span> of {totalPages * 10} toll records
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handlePageChange(currentPage - 1)}
                              disabled={currentPage === 1}
                              className="px-3 py-1 text-sm font-medium text-slate-600 hover:text-slate-900 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <ChevronLeft size={16} />
                            </button>
                            <span className="px-3 py-1 text-sm font-medium text-slate-900">
                              {currentPage} of {totalPages}
                            </span>
                            <button
                              onClick={() => handlePageChange(currentPage + 1)}
                              disabled={currentPage === totalPages}
                              className="px-3 py-1 text-sm font-medium text-slate-600 hover:text-slate-900 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <ChevronRight size={16} />
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="p-16 text-center">
                    <div className="h-20 w-20 mx-auto rounded-2xl bg-gradient-to-r from-slate-100 to-slate-200 flex items-center justify-center shadow-lg mb-6">
                      <Search className="h-10 w-10 text-slate-400" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-3">
                      {hasSearched ? "No Toll Records Found" : "Search Toll Records"}
                    </h3>
                    <p className="text-slate-600 mb-8 max-w-md mx-auto">
                      {hasSearched
                        ? "No records match your search criteria. Try adjusting your search terms or selecting a different toll operator."
                        : "Select a toll operator or enter search criteria to view toll records."
                      }
                    </p>
                    {hasSearched && (
                      <button
                        onClick={handleClearSearch}
                        className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl transition-all duration-200"
                      >
                        Clear Search
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Professional Guest Data Tab */}
            {activeTab === "guest-data" && (
              <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
                {guestData.length > 0 ? (
                  <>
                    <div className="divide-y divide-slate-200">
                      {guestData.map((data) => (
                        <div key={data._id} className="p-6 hover:bg-slate-50 transition-all duration-200">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className="h-12 w-12 rounded-2xl bg-gradient-to-r from-purple-100 to-indigo-100 flex items-center justify-center shadow-md">
                                <Database className="h-6 w-6 text-purple-600" />
                              </div>
                              <div className="flex-1">
                                <div className="font-semibold text-slate-900 text-lg">{data.vehicleNumber}</div>
                                <div className="text-sm text-slate-600 mt-1">
                                  Mobile: <span className="font-medium">{data.userMobileNumber}</span> |
                                  Date: <span className="font-medium">{new Date(data.createdAt || data.date).toLocaleDateString()}</span>
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center gap-3">
                              <span className={`inline-flex items-center px-4 py-2 rounded-xl text-sm font-bold border ${data.overallStatus === 'safe' ? 'bg-green-50 text-green-700 border-green-200' :
                                  data.overallStatus === 'warning' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                                    'bg-red-50 text-red-700 border-red-200'
                                }`}>
                                {data.overallStatus?.charAt(0).toUpperCase() + data.overallStatus?.slice(1) || 'Processing'}
                              </span>
                              <button
                                onClick={() => handleViewDetails(data)}
                                className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-all duration-200"
                                title="View Details"
                              >
                                <Eye size={18} />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Pagination for Guest Data */}
                    {totalPages > 1 && (
                      <div className="bg-slate-50 px-6 py-4 border-t border-slate-200">
                        <div className="flex items-center justify-between">
                          <div className="text-sm text-slate-600">
                            Showing <span className="font-semibold">{guestData.length}</span> of {totalPages * 10} guest records
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handlePageChange(currentPage - 1)}
                              disabled={currentPage === 1}
                              className="px-3 py-1 text-sm font-medium text-slate-600 hover:text-slate-900 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <ChevronLeft size={16} />
                            </button>
                            <span className="px-3 py-1 text-sm font-medium text-slate-900">
                              {currentPage} of {totalPages}
                            </span>
                            <button
                              onClick={() => handlePageChange(currentPage + 1)}
                              disabled={currentPage === totalPages}
                              className="px-3 py-1 text-sm font-medium text-slate-600 hover:text-slate-900 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <ChevronRight size={16} />
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="p-16 text-center">
                    <div className="h-20 w-20 mx-auto rounded-2xl bg-gradient-to-r from-slate-100 to-slate-200 flex items-center justify-center shadow-lg mb-6">
                      <Search className="h-10 w-10 text-slate-400" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-3">
                      {hasSearched ? "No Guest Records Found" : "Search Guest Records"}
                    </h3>
                    <p className="text-slate-600 mb-8 max-w-md mx-auto">
                      {hasSearched
                        ? "No records match your search criteria. Try adjusting your search terms."
                        : "Enter a vehicle number or mobile number to search for guest records."
                      }
                    </p>
                    {hasSearched && (
                      <button
                        onClick={handleClearSearch}
                        className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl transition-all duration-200"
                      >
                        Clear Search
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}

          </div>
        </div>
      </div>

      {/* Professional Add User Modal */}
      {showAddUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
          <div className="relative bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md transform transition-all">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-gradient-to-r from-blue-100 to-indigo-100 flex items-center justify-center">
                    <UserPlus className="h-5 w-5 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">Add New User</h3>
                </div>
                <button
                  onClick={() => setShowAddUser(false)}
                  className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all duration-200"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleAddUser} className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Username</label>
                  <input
                    type="text"
                    required
                    value={newUser.username}
                    onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    placeholder="Enter username"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Password</label>
                  <input
                    type="password"
                    required
                    value={newUser.password}
                    onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    placeholder="Enter secure password"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Role</label>
                  <select
                    value={newUser.role}
                    onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  >
                    <option value="toll_operator">Toll Operator</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>

                {newUser.role === 'toll_operator' && (
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Toll Plaza</label>
                    <input
                      type="text"
                      required
                      value={newUser.tollPlaza}
                      onChange={(e) => setNewUser({ ...newUser, tollPlaza: e.target.value })}
                      className="w-full px-4 py-3 border border-slate-300 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                      placeholder="Enter toll plaza name"
                    />
                  </div>
                )}

                <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
                  <button
                    type="button"
                    onClick={() => setShowAddUser(false)}
                    className="px-6 py-3 border border-slate-300 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-all duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl text-sm font-semibold hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transition-all duration-200"
                  >
                    {loading ? 'Creating...' : 'Create User'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Professional View Details Modal */}
      {showViewModal && selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
          <div className="relative bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-4xl max-h-[90vh] overflow-y-auto transform transition-all">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-gradient-to-r from-blue-100 to-indigo-100 flex items-center justify-center">
                    {activeTab === 'users' ? (
                      <User className="h-5 w-5 text-blue-600" />
                    ) : (
                      <Car className="h-5 w-5 text-blue-600" />
                    )}
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">
                    {activeTab === 'users' ? 'User Details' : 'Vehicle Data Details'}
                  </h3>
                </div>
                <button
                  onClick={() => setShowViewModal(false)}
                  className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all duration-200"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-slate-50 rounded-xl p-6 space-y-4">
                  <h4 className="font-bold text-slate-900 text-lg mb-4">Basic Information</h4>
                  {activeTab === 'users' ? (
                    <>
                      <div className="flex justify-between items-center py-2 border-b border-slate-200">
                        <span className="font-medium text-slate-600">Username:</span>
                        <span className="text-slate-900 font-semibold">{selectedItem.username}</span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-slate-200">
                        <span className="font-medium text-slate-600">Role:</span>
                        <span className="capitalize text-slate-900 font-semibold">{selectedItem.role}</span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-slate-200">
                        <span className="font-medium text-slate-600">Status:</span>
                        <span className={`inline-flex items-center px-3 py-1 rounded-xl text-sm font-bold ${selectedItem.isActive
                            ? 'bg-green-50 text-green-700 border border-green-200'
                            : 'bg-red-50 text-red-700 border border-red-200'
                          }`}>
                          {selectedItem.isActive ? '● Active' : '● Inactive'}
                        </span>
                      </div>
                      {selectedItem.tollPlaza && (
                        <div className="flex justify-between items-center py-2 border-b border-slate-200">
                          <span className="font-medium text-slate-600">Toll Plaza:</span>
                          <span className="text-slate-900 font-semibold">{selectedItem.tollPlaza}</span>
                        </div>
                      )}
                      <div className="flex justify-between items-center py-2 border-b border-slate-200">
                        <span className="font-medium text-slate-600">Created:</span>
                        <span className="text-slate-900 font-semibold">{new Date(selectedItem.createdAt).toLocaleDateString()}</span>
                      </div>
                      {selectedItem.lastLogin && (
                        <div className="flex justify-between items-center py-2">
                          <span className="font-medium text-slate-600">Last Login:</span>
                          <span className="text-slate-900 font-semibold">{new Date(selectedItem.lastLogin).toLocaleDateString()}</span>
                        </div>
                      )}
                    </>
                  ) : (
                    <>
                      <div className="flex justify-between items-center py-2 border-b border-slate-200">
                        <span className="font-medium text-slate-600">Vehicle Number:</span>
                        <span className="text-slate-900 font-semibold">{selectedItem.vehicleNumber}</span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-slate-200">
                        <span className="font-medium text-slate-600">Mobile Number:</span>
                        <span className="text-slate-900 font-semibold">{selectedItem.userMobileNumber}</span>
                      </div>

                      <div className="flex justify-between items-center py-2 border-b border-slate-200">
                        <span className="font-medium text-slate-600">Date:</span>
                        <span className="text-slate-900 font-semibold">
                          {activeTab === 'toll-data' ? (
                            <>{new Date(selectedItem.date).toLocaleDateString()}</>
                          ) : (
                            <>{new Date(selectedItem.createdAt).toLocaleDateString()}</>
                          )}
                        </span>
                      </div>
                      {selectedItem.tollOperator && (
                        <div className="flex justify-between items-center py-2 border-b border-slate-200">
                          <span className="font-medium text-slate-600">Operator:</span>
                          <span className="text-slate-900 font-semibold">{selectedItem.tollPlaza}</span>
                        </div>
                      )}
                      {selectedItem.result && (
                        <>
                          <div className="flex justify-between items-center py-2 border-b border-slate-200">
                            <span className="font-medium text-slate-600">Tire Condition:</span>
                            <span className={`inline-flex items-center px-4 py-2 rounded-xl text-sm font-bold border ${selectedItem.result.tireCondition === 'Good' ? 'bg-green-50 text-green-700 border-green-200' :
                                selectedItem.result.tireCondition === 'Warning' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                                  'bg-red-50 text-red-700 border-red-200'
                              }`}>
                              {selectedItem.result.tireCondition}
                            </span>
                          </div>
                          {selectedItem.result.confidence && (
                            <div className="flex justify-between items-center py-2 border-b border-slate-200">
                              <span className="font-medium text-slate-600">Confidence:</span>
                              <span className="text-slate-900 font-semibold">{(selectedItem.result.confidence * 100).toFixed(1)}%</span>
                            </div>
                          )}
                          {selectedItem.result.recommendations && (
                            <div className="py-2">
                              <span className="font-medium text-slate-600 block mb-2">Recommendations:</span>
                              <div className="text-slate-900 bg-blue-50 p-3 rounded-lg border border-blue-200">
                                {selectedItem.result.recommendations}
                              </div>
                            </div>
                          )}
                        </>
                      )}
                    </>
                  )}
                </div>

                {selectedItem.images && selectedItem.images.length > 0 && (
                  <div className="bg-slate-50 rounded-xl p-6">
                    <h4 className="font-bold text-slate-900 text-lg mb-4">Vehicle Images</h4>
                    <div className="grid grid-cols-2 gap-4">
                      {selectedItem.images.map((image, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={`data:image/jpeg;base64,${image.base64}`}
                            alt={`Vehicle ${index + 1}`}
                            className="w-full h-32 object-cover rounded-lg border border-slate-200 shadow-sm group-hover:shadow-md transition-all duration-200"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-end pt-6 border-t border-slate-200 mt-6">
                <button
                  onClick={() => setShowViewModal(false)}
                  className="px-6 py-3 bg-gradient-to-r from-slate-600 to-slate-700 text-white rounded-xl text-sm font-semibold hover:from-slate-700 hover:to-slate-800 shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
