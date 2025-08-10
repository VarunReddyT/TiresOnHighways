"use client"

import { useState } from "react"
import { Search, Calendar, Phone, Car, CheckCircle, AlertTriangle, XCircle, Clock, ChevronLeft, ChevronRight, Eye, X, FileSearch, Shield, Activity, Filter } from "lucide-react"
import api from "../utils/api"

export default function GuestDetails() {
  const [searchData, setSearchData] = useState({
    vehicleNumber: "",
    mobileNumber: "",
    startDate: "",
    endDate: "",
  })
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [pagination, setPagination] = useState({
    current: 1,
    total: 1,
    count: 0,
    limit: 5
  })
  const [selectedImage, setSelectedImage] = useState(null)
  const [showImageModal, setShowImageModal] = useState(false)

  const handleInputChange = (e) => {
    setSearchData({
      ...searchData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSearch = async (page = 1) => {
    if (!searchData.vehicleNumber || !searchData.mobileNumber) {
      setError("Please enter both vehicle number and mobile number")
      return
    }

    setLoading(true)
    setError("")

    try {
      const params = {
        vehicleNumber: searchData.vehicleNumber,
        mobileNumber: searchData.mobileNumber,
        page,
        limit: pagination.limit,
        includeImages: 'true' // Request images to be included
      }

      // Add date filters if provided
      if (searchData.startDate) {
        params.startDate = searchData.startDate
      }
      if (searchData.endDate) {
        params.endDate = searchData.endDate
      }

      const response = await api.get("/api/data/guest-records", { params })
      
      if (response.data.success) {
        const records = response.data.data.records || response.data.data
        setResults(records)
        setPagination({
          current: page,
          total: response.data.data.totalPages || 1,
          count: response.data.data.count || records.length,
          limit: pagination.limit
        })
        
        if (records.length === 0) {
          setError("No records found for the provided details")
        }
      }
    } catch (error) {
      setError(error.response?.data?.message || "Failed to fetch records")
      setResults([])
    } finally {
      setLoading(false)
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case "safe":
        return <CheckCircle className="text-green-600" size={24} />
      case "warning":
        return <AlertTriangle className="text-yellow-600" size={24} />
      case "danger":
        return <XCircle className="text-red-600" size={24} />
      default:
        return <Clock className="text-gray-600" size={24} />
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "safe":
        return "bg-green-100 text-green-800 border-green-200"
      case "warning":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "danger":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const handleImageClick = (imageData, imageIndex, vehicleNumber) => {
    if (imageData) {
      setSelectedImage({
        data: imageData,
        index: imageIndex,
        vehicle: vehicleNumber
      })
      setShowImageModal(true)
    }
  }

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.total) {
      handleSearch(newPage)
    }
  }

  const resetSearch = () => {
    setSearchData({
      vehicleNumber: "",
      mobileNumber: "",
      startDate: "",
      endDate: "",
    })
    setResults([])
    setError("")
    setPagination({
      current: 1,
      total: 1,
      count: 0,
      limit: 5
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {/* Professional Search Form */}
        <div className="bg-white rounded-2xl p-8 shadow-xl border border-slate-200 mb-8">
          <div className="flex items-center gap-3 mb-8">
            <div className="bg-blue-100 p-2 rounded-xl">
              <Search className="text-blue-600" size={24} />
            </div>
            <h2 className="text-xl font-bold text-slate-900">Search Vehicle Records</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            <div className="lg:col-span-1">
              <label className="block text-sm font-semibold text-slate-700 mb-3">Vehicle Number</label>
              <div className="relative">
                <Car className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="text"
                  name="vehicleNumber"
                  value={searchData.vehicleNumber}
                  onChange={handleInputChange}
                  placeholder="e.g., AP09BC1234"
                  className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 font-medium"
                />
              </div>
            </div>
            
            <div className="lg:col-span-1">
              <label className="block text-sm font-semibold text-slate-700 mb-3">Mobile Number</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="tel"
                  name="mobileNumber"
                  value={searchData.mobileNumber}
                  onChange={handleInputChange}
                  placeholder="10-digit mobile number"
                  className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 font-medium"
                />
              </div>
            </div>
            
            <div className="lg:col-span-1">
              <label className="block text-sm font-semibold text-slate-700 mb-3">From Date</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="date"
                  name="startDate"
                  value={searchData.startDate}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 font-medium"
                />
              </div>
            </div>
            
            <div className="lg:col-span-1">
              <label className="block text-sm font-semibold text-slate-700 mb-3">To Date</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="date"
                  name="endDate"
                  value={searchData.endDate}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 font-medium"
                />
              </div>
            </div>
            
            <div className="lg:col-span-1 flex flex-col justify-end gap-3">
              <button
                onClick={() => handleSearch(1)}
                disabled={loading}
                className="bg-gradient-to-r from-blue-600 to-slate-700 hover:from-blue-700 hover:to-slate-800 text-white py-3 px-6 rounded-xl font-bold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                <Search size={20} />
                {loading ? "Searching..." : "Search Records"}
              </button>
              <button
                onClick={resetSearch}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 py-3 px-6 rounded-xl font-semibold border border-slate-300 hover:border-slate-400 transition-all duration-200"
              >
                <Filter size={18} className="inline mr-2" />
                Reset Filters
              </button>
            </div>
          </div>

          {error && (
            <div className="mt-6 bg-red-50 border border-red-200 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <div className="bg-red-100 p-2 rounded-xl">
                  <AlertTriangle className="text-red-600" size={20} />
                </div>
                <div>
                  <div className="font-semibold text-red-800">Search Error</div>
                  <div className="text-sm text-red-700">{error}</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Professional Results Section */}
        {results.length > 0 && (
          <div className="space-y-8">
            
            {/* Results Header */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="bg-green-100 p-2 rounded-xl">
                    <CheckCircle className="text-green-600" size={24} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900">Analysis Results Found</h2>
                    <p className="text-slate-600">Your vehicle safety assessment reports</p>
                  </div>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-3">
                  <div className="text-sm font-semibold text-blue-800">
                    Showing {((pagination.current - 1) * pagination.limit) + 1} to {Math.min(pagination.current * pagination.limit, pagination.count)} of {pagination.count} records
                  </div>
                </div>
              </div>
            </div>

            {/* Results Cards */}
            {results.map((record, index) => (
              <div key={record._id} className="bg-white rounded-2xl p-8 shadow-xl border border-slate-200 hover:shadow-2xl transition-all duration-300">
                
                {/* Record Header */}
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
                  <div className="flex items-center gap-6 mb-4 lg:mb-0">
                    <div className="flex items-center gap-3 bg-slate-50 rounded-xl p-3">
                      <Car className="text-slate-600" size={24} />
                      <span className="font-bold text-xl text-slate-900">{record.vehicleNumber}</span>
                    </div>
                  </div>
                  
                  {/* Status and Date Section */}
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    <div className="flex items-center gap-3 bg-slate-50 rounded-xl p-3">
                      <Calendar className="text-slate-600" size={20} />
                      <span className="font-semibold text-slate-700">
                        {new Date(record.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </span>
                    </div>
                    <div className={`flex items-center gap-3 px-4 py-2 rounded-xl border-2 ${getStatusColor(record.overallStatus)}`}>
                      {getStatusIcon(record.overallStatus)}
                      <span className="font-bold capitalize text-lg">{record.overallStatus}</span>
                    </div>
                  </div>
                </div>

                {/* Professional Analysis Details */}
                <div className="bg-slate-50 rounded-2xl p-6 mb-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="bg-blue-100 p-2 rounded-xl">
                      <Activity className="text-blue-600" size={20} />
                    </div>
                    <h4 className="text-lg font-bold text-slate-900">Detailed Analysis Report</h4>
                  </div>
                  
                  <div className="space-y-4">
                    {record.images && record.images.map((image, imageIndex) => (
                      <div key={imageIndex} className="bg-white rounded-xl p-4 shadow-md border border-slate-200">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="bg-slate-100 p-2 rounded-lg">
                              <Eye className="text-slate-600" size={16} />
                            </div>
                            <span className="font-semibold text-slate-900">Tire Image {imageIndex + 1}</span>
                          </div>
                          <div className="flex items-center gap-4">
                            <span className={`px-3 py-1 rounded-lg text-sm font-bold ${
                              image.analysis.prediction === 'cracked' 
                                ? 'bg-red-100 text-red-800 border border-red-200' 
                                : 'bg-green-100 text-green-800 border border-green-200'
                            }`}>
                              {image.analysis.prediction} • {Math.round(image.analysis.confidence * 100)}% confidence
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                </div>

                {/* Professional Images Gallery */}
                {record.images && record.images.length > 0 && (
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-3">
                        <div className="bg-slate-100 p-2 rounded-xl">
                          <Eye className="text-slate-600" size={20} />
                        </div>
                        <h4 className="text-lg font-bold text-slate-900">
                          Vehicle Images ({record.images.length} uploaded)
                        </h4>
                      </div>
                      <div className="bg-blue-50 text-blue-700 px-3 py-2 rounded-xl text-sm font-medium border border-blue-200">
                        Analyzed: {new Date(record.analysisTimestamp).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {record.images.slice(0, 4).map((image, imgIndex) => (
                        <div 
                          key={imgIndex} 
                          className="relative group cursor-pointer transform transition-all duration-300 hover:scale-105"
                          onClick={() => image.base64 && handleImageClick(image.base64, imgIndex, record.vehicleNumber)}
                        >
                          {image.base64 ? (
                            <div className="relative rounded-xl overflow-hidden shadow-lg border-2 border-slate-200 hover:border-blue-400 transition-all duration-300">
                              <img
                                src={`data:image/jpeg;base64,${image.base64}`}
                                alt={`Tire Analysis ${imgIndex + 1}`}
                                className="w-full h-32 object-cover"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300">
                                <div className="absolute bottom-2 left-2 right-2">
                                  <div className="text-white text-sm font-semibold">Click to view</div>
                                </div>
                                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                                  <div className="bg-white/20 rounded-full p-2 backdrop-blur-sm">
                                    <Eye className="text-white" size={20} />
                                  </div>
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div className="w-full h-32 bg-slate-100 rounded-xl border-2 border-slate-200 flex items-center justify-center">
                              <span className="text-slate-500 text-sm font-medium">Image {imgIndex + 1}</span>
                            </div>
                          )}
                          
                          {/* Status Badge */}
                          <div className={`absolute -top-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center text-white text-lg shadow-lg ${
                            image.analysis.prediction === 'cracked' ? 'bg-red-500' : 'bg-green-500'
                          }`}>
                            {image.analysis.prediction === 'cracked' ? '⚠️' : '✅'}
                          </div>
                        </div>
                      ))}
                      
                      {record.images.length > 4 && (
                        <div className="w-full h-32 bg-slate-100 rounded-xl border-2 border-dashed border-slate-300 flex items-center justify-center cursor-pointer hover:bg-slate-200 transition-all duration-300 group">
                          <div className="text-center">
                            <div className="text-slate-600 text-sm font-semibold">+{record.images.length - 4} more images</div>
                            <div className="text-xs text-slate-500 mt-1">Click to view all</div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Professional Recommendations */}
                <div className="bg-gradient-to-r from-blue-50 to-slate-50 border border-blue-200 rounded-2xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="bg-blue-100 p-2 rounded-xl">
                      <Shield className="text-blue-600" size={20} />
                    </div>
                    <h4 className="text-lg font-bold text-blue-900">Safety Recommendations</h4>
                  </div>
                  
                  <div className="space-y-3">
                    {record.overallStatus === "safe" && (
                      <div className="flex items-start gap-3 p-3 bg-green-50 rounded-xl border border-green-200">
                        <CheckCircle className="text-green-600 mt-0.5" size={20} />
                        <div>
                          <div className="font-semibold text-green-800">Excellent Condition</div>
                          <div className="text-sm text-green-700">Your tires are in optimal condition. Continue with regular maintenance and periodic inspections.</div>
                        </div>
                      </div>
                    )}
                    {record.overallStatus === "warning" && (
                      <div className="flex items-start gap-3 p-3 bg-yellow-50 rounded-xl border border-yellow-200">
                        <AlertTriangle className="text-yellow-600 mt-0.5" size={20} />
                        <div>
                          <div className="font-semibold text-yellow-800">Attention Required</div>
                          <div className="text-sm text-yellow-700">Minor wear patterns detected. Schedule a professional inspection within the next few weeks.</div>
                        </div>
                      </div>
                    )}
                    {record.overallStatus === "danger" && (
                      <div className="flex items-start gap-3 p-3 bg-red-50 rounded-xl border border-red-200">
                        <XCircle className="text-red-600 mt-0.5" size={20} />
                        <div>
                          <div className="font-semibold text-red-800">Immediate Action Required</div>
                          <div className="text-sm text-red-700">Critical safety concerns detected. Please visit a certified tire service center immediately.</div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {/* Pagination */}
            {pagination.total > 1 && (
              <div className="flex items-center justify-center gap-2 mt-8">
                <button
                  onClick={() => handlePageChange(pagination.current - 1)}
                  disabled={pagination.current === 1}
                  className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  <ChevronLeft size={16} />
                  Previous
                </button>
                
                <div className="flex gap-1">
                  {Array.from({ length: Math.min(5, pagination.total) }, (_, i) => {
                    let pageNum;
                    if (pagination.total <= 5) {
                      pageNum = i + 1;
                    } else if (pagination.current <= 3) {
                      pageNum = i + 1;
                    } else if (pagination.current >= pagination.total - 2) {
                      pageNum = pagination.total - 4 + i;
                    } else {
                      pageNum = pagination.current - 2 + i;
                    }
                    
                    return (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        className={`px-3 py-2 rounded-lg ${
                          pageNum === pagination.current
                            ? 'bg-green-600 text-white'
                            : 'border border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={() => handlePageChange(pagination.current + 1)}
                  disabled={pagination.current === pagination.total}
                  className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Next
                  <ChevronRight size={16} />
                </button>
              </div>
            )}
          </div>
        )}

        {/* Image Modal */}
        {showImageModal && selectedImage && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50" onClick={() => setShowImageModal(false)}>
            <div className="max-w-4xl max-h-full p-4" onClick={(e) => e.stopPropagation()}>
              <div className="relative bg-white rounded-lg overflow-hidden">
                <div className="flex justify-between items-center p-4 border-b">
                  <h3 className="text-lg font-semibold">
                    {selectedImage.vehicle} - Image {selectedImage.index + 1}
                  </h3>
                  <button
                    onClick={() => setShowImageModal(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X size={24} />
                  </button>
                </div>
                <div className="p-4">
                  <img
                    src={`data:image/jpeg;base64,${selectedImage.data}`}
                    alt={`Tire analysis`}
                    className="max-w-full max-h-96 mx-auto rounded-lg"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* No Results State */}
        {!loading && results.length === 0 && !error && (
          <div className="text-center py-12">
            <Search className="mx-auto h-16 w-16 text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No Results Yet</h3>
            <p className="text-gray-600 mb-6">
              Enter your vehicle number and mobile number to search for analysis results.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
