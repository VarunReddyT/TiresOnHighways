import React from "react"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import {
  Search,
  Calendar,
  Phone,
  Car,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Clock,
  ChevronLeft,
  ChevronRight,
  Eye,
  ChevronDown,
  ChevronUp,
} from "lucide-react"
import api from "../utils/api"

export default function CheckRecords() {
  const [records, setRecords] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [hasSearched, setHasSearched] = useState(false)
  const [expandedRecord, setExpandedRecord] = useState(null)
  const [imageLoadingStates, setImageLoadingStates] = useState({})
  const [pagination, setPagination] = useState({
    current: 1,
    total: 1,
    count: 0,
  })
  const navigate = useNavigate()

  useEffect(() => {
    // Check if user is authenticated
    if (!localStorage.getItem('authToken')) {
      navigate("/toll-login")
      return
    }
    // Don't fetch records automatically
  }, [navigate])

  const fetchRecords = async (page = 1, search = "") => {
    if (!search.trim()) {
      setError("Please enter a vehicle number or mobile number to search")
      return
    }
    
    setLoading(true)
    setError("")
    try {
      const response = await api.get("/api/data/toll-records", {
        params: {
          page,
          limit: 10,
          search: search.trim(),
        },
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        },
      })

      if (response.data.success) {
        setRecords(response.data.data.records || response.data.data)
        setPagination({
          current: response.data.data.pagination?.current || page,
          total: response.data.data.pagination?.total || response.data.totalPages || 1,
          count: response.data.data.pagination?.count || response.data.total || 0,
        })
        setHasSearched(true)
        
        if ((response.data.data.records || response.data.data).length === 0) {
          setError("No records found for the provided vehicle number or mobile number")
        }
      }
    } catch (error) {
      setError("Failed to fetch records. Please check your search criteria.")
      console.error("Fetch records error:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()
    fetchRecords(1, searchTerm)
  }

  const handlePageChange = (newPage) => {
    fetchRecords(newPage, searchTerm)
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case "safe":
        return <CheckCircle className="text-green-600" size={20} />
      case "warning":
        return <AlertTriangle className="text-yellow-600" size={20} />
      case "danger":
        return <XCircle className="text-red-600" size={20} />
      default:
        return <Clock className="text-gray-600" size={20} />
    }
  }

  // Lazy loading image component with API call
  const LazyImage = ({ image, imgIndex, recordId }) => {
    const [imageLoaded, setImageLoaded] = useState(false)
    const [imageError, setImageError] = useState(false)
    const [imageData, setImageData] = useState(null)
    const [loading, setLoading] = useState(false)
    
    const loadImage = async () => {
      if (imageData || loading || imageError) return;
      
      setLoading(true);
      try {
        // If image already has base64, use it
        if (image.base64) {
          setImageData(image.base64);
          setImageLoaded(true);
          return;
        }
        
        // Otherwise, fetch from API
        const response = await api.get(`/api/data/toll-record-images/${recordId}`);
        if (response.data.success && response.data.data.images[imgIndex]) {
          const imageBase64 = response.data.data.images[imgIndex].base64;
          setImageData(imageBase64);
          setImageLoaded(true);
        } else {
          setImageError(true);
        }
      } catch (error) {
        console.error('Error loading image:', error);
        setImageError(true);
      } finally {
        setLoading(false);
      }
    };

    return (
      <div className="relative group">
        <div className="w-full h-32 bg-slate-100 rounded-xl border border-slate-200 shadow-sm group-hover:shadow-md transition-all duration-200 overflow-hidden">
          {!imageLoaded && !imageError && !loading && (
            <div 
              className="w-full h-full flex items-center justify-center cursor-pointer"
              onClick={loadImage}
            >
              <div className="text-center">
                <Eye className="h-8 w-8 text-blue-600 mx-auto mb-1" />
                <div className="text-xs text-slate-600">Click to load</div>
              </div>
            </div>
          )}
          
          {loading && (
            <div className="w-full h-full flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          )}
          
          {imageData && !imageError ? (
            <img 
              src={`data:image/jpeg;base64,${imageData}`}
              alt={`Tire analysis ${imgIndex + 1}`}
              className={`w-full h-full object-cover transition-opacity duration-200 ${
                imageLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageError(true)}
            />
          ) : imageError ? (
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-center">
                <XCircle className="h-8 w-8 text-red-500 mx-auto mb-1" />
                <div className="text-xs text-slate-600">Failed to load</div>
              </div>
            </div>
          ) : null}
        </div>
        <div className={`absolute top-2 right-2 w-4 h-4 rounded-full border-2 border-white shadow-md ${
          image.analysis?.prediction === 'normal' ? 'bg-green-500' : 
          image.analysis?.prediction === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
        }`}></div>
        <div className="absolute bottom-2 left-2 right-2 bg-black bg-opacity-75 text-white text-xs rounded px-2 py-1">
          <div className="font-medium">
            {image.analysis?.prediction || 'Analyzed'}
          </div>
          <div className="font-bold">
            {Math.round((image.analysis?.confidence || 0) * 100)}%
          </div>
        </div>
      </div>
    )
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative mb-8">
            <div className="h-20 w-20 mx-auto rounded-2xl bg-gradient-to-r from-blue-100 to-indigo-100 flex items-center justify-center shadow-lg">
              <div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-600 border-t-transparent"></div>
            </div>
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">Searching Records</h3>
          <p className="text-slate-600">Please wait while we search for your data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">


      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Professional Search Form */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 mb-8">
          <form onSubmit={handleSearch} className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by vehicle number or mobile number..."
                className="w-full pl-12 pr-4 py-4 border border-slate-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2"
            >
              <Search size={20} />
              Search
            </button>
          </form>

          {error && (
            <div className="mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-center gap-2">
              <XCircle size={20} />
              {error}
            </div>
          )}
        </div>

        {/* Professional Records Table */}
        {records.length > 0 ? (
          <div className="space-y-6">
            <div className="flex justify-between items-center bg-white rounded-xl p-4 shadow-sm border border-slate-200">
              <p className="text-slate-600 font-medium">
                Showing <span className="font-bold text-slate-900">{records.length}</span> of <span className="font-bold text-slate-900">{pagination.count}</span> records
              </p>
            </div>

            {/* Records Table */}
            <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-bold text-slate-900">Vehicle Details</th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-slate-900">Contact</th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-slate-900">Analysis Date</th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-slate-900">Status</th>
                      <th className="px-6 py-4 text-center text-sm font-bold text-slate-900">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {records.map((record) => (
                      <React.Fragment key={record._id}>
                        <tr className="hover:bg-slate-50 transition-colors duration-200">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="h-10 w-10 rounded-lg bg-gradient-to-r from-blue-100 to-indigo-100 flex items-center justify-center">
                                <Car className="text-blue-600" size={18} />
                              </div>
                              <div>
                                <div className="font-bold text-slate-900">{record.vehicleNumber}</div>
                                <div className="text-sm text-slate-600">ID: {record._id.slice(-8)}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <Phone className="text-slate-400" size={14} />
                              <span className="text-slate-700">{record.userMobileNumber}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <Calendar className="text-slate-400" size={14} />
                              <span className="text-slate-700">{new Date(record.createdAt).toLocaleDateString()}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div
                              className={`inline-flex items-center gap-2 px-3 py-1 rounded-lg border font-medium text-sm ${getStatusColor(record.overallStatus)}`}
                            >
                              {getStatusIcon(record.overallStatus)}
                              <span className="capitalize">{record.overallStatus}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <button
                              onClick={() => setExpandedRecord(expandedRecord === record._id ? null : record._id)}
                              className="inline-flex items-center gap-2 px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg font-medium transition-colors duration-200"
                            >
                              <Eye size={16} />
                              {expandedRecord === record._id ? (
                                <>Hide <ChevronUp size={16} /></>
                              ) : (
                                <>View <ChevronDown size={16} /></>
                              )}
                            </button>
                          </td>
                        </tr>
                        
                        {/* Expanded Details Row */}
                        {expandedRecord === record._id && (
                          <tr>
                            <td colSpan="5" className="px-6 py-6 bg-slate-50">
                              <div className="space-y-6">
                                {/* Professional Analysis Details */}
                                <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
                                  <h4 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                                    <CheckCircle className="h-5 w-5 text-green-600" />
                                    Analysis Report
                                  </h4>
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                      <p className="text-slate-700 mb-4 leading-relaxed">
                                        Analysis completed on {new Date(record.analysisTimestamp).toLocaleString()}. 
                                        Overall tire condition assessed as <strong>{record.overallStatus}</strong> based on image analysis.
                                      </p>
                                      <div className="flex items-center justify-between">
                                        <div className="text-sm text-slate-600">
                                          <span className="font-medium">Operator:</span> <span className="font-bold text-slate-900">{record.tollOperator}</span>
                                        </div>
                                      </div>
                                    </div>
                                    {record.images && record.images.length > 0 && (
                                      <div>
                                        <div className="flex items-center gap-2 mb-2">
                                          <span className="text-sm font-medium text-slate-600">Average Confidence:</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                          <div className="w-32 h-3 bg-slate-200 rounded-full">
                                            <div 
                                              className="h-3 bg-gradient-to-r from-green-500 to-blue-500 rounded-full transition-all duration-300"
                                              style={{ 
                                                width: `${Math.round(
                                                  record.images.reduce((sum, img) => sum + (img.analysis?.confidence || 0), 0) / record.images.length * 100
                                                )}%` 
                                              }}
                                            ></div>
                                          </div>
                                          <span className="text-lg font-bold text-slate-900">
                                            {Math.round(
                                              record.images.reduce((sum, img) => sum + (img.analysis?.confidence || 0), 0) / record.images.length * 100
                                            )}%
                                          </span>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                </div>

                                {/* Professional Images Section */}
                                {record.images && record.images.length > 0 && (
                                  <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
                                    <h4 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                                      <Car className="h-5 w-5 text-blue-600" />
                                      Analysis Results ({record.images.length} images)
                                    </h4>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                      {record.images.slice(0, 4).map((image, imgIndex) => (
                                        <LazyImage 
                                          key={image._id || imgIndex}
                                          image={image}
                                          imgIndex={imgIndex}
                                          recordId={record._id}
                                        />
                                      ))}
                                      {record.images.length > 4 && (
                                        <div className="w-full h-32 bg-gradient-to-r from-slate-100 to-slate-200 rounded-xl border border-slate-200 flex items-center justify-center shadow-sm cursor-pointer hover:bg-gradient-to-r hover:from-slate-200 hover:to-slate-300 transition-all duration-200"
                                             onClick={() => {
                                               // You can implement a modal or expand more images here
                                               console.log('Show more images for record:', record._id)
                                             }}>
                                          <div className="text-center">
                                            <Eye className="h-6 w-6 text-slate-600 mx-auto mb-1" />
                                            <span className="text-slate-600 text-sm font-semibold">
                                              +{record.images.length - 4} more
                                            </span>
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                )}
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Professional Pagination */}
            {pagination.total > 1 && (
              <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
                <div className="flex items-center justify-center gap-3">
                  <button
                    onClick={() => handlePageChange(pagination.current - 1)}
                    disabled={pagination.current === 1 || loading}
                    className="flex items-center gap-2 px-4 py-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                  >
                    <ChevronLeft size={16} />
                    Previous
                  </button>

                  <div className="flex items-center gap-1">
                    {Array.from({ length: Math.min(5, pagination.total) }, (_, i) => {
                      const page = i + 1
                      return (
                        <button
                          key={page}
                          onClick={() => handlePageChange(page)}
                          disabled={loading}
                          className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                            page === pagination.current
                              ? "bg-blue-600 text-white shadow-lg"
                              : "text-slate-700 hover:bg-slate-100"
                          } disabled:opacity-50`}
                        >
                          {page}
                        </button>
                      )
                    })}
                  </div>

                  <button
                    onClick={() => handlePageChange(pagination.current + 1)}
                    disabled={pagination.current === pagination.total || loading}
                    className="flex items-center gap-2 px-4 py-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                  >
                    Next
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-16">
            <div className="text-center">
              <div className="h-20 w-20 mx-auto rounded-2xl bg-gradient-to-r from-slate-100 to-slate-200 flex items-center justify-center shadow-lg mb-6">
                <Search className="h-10 w-10 text-slate-400" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">
                {hasSearched ? "No Records Found" : "Search Vehicle Records"}
              </h3>
              <p className="text-slate-600 mb-8 max-w-md mx-auto">
                {hasSearched 
                  ? "No records match your search criteria. Try adjusting your search terms." 
                  : "Enter a vehicle number or mobile number above to search for inspection records."
                }
              </p>
              {hasSearched && (
                <button
                  onClick={() => {
                    setSearchTerm("")
                    setHasSearched(false)
                    setRecords([])
                  }}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  Clear Search
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
