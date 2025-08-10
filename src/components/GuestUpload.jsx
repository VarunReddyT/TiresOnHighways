"use client"

import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Upload, X, CheckCircle, AlertCircle, Camera, Car, Phone, Calendar, ArrowLeft, Shield, FileText, Image, Activity } from "lucide-react"
import api from "../utils/api"
import Loader from "./Loading"

export default function GuestUpload() {
  const [images, setImages] = useState([])
  const [vehicleNumber, setVehicleNumber] = useState("")
  const [userMobileNumber, setUserMobileNumber] = useState("")
  const [loading, setLoading] = useState(false)
  const [uploadStatus, setUploadStatus] = useState(null)
  const [errors, setErrors] = useState({})
  const [analysisResult, setAnalysisResult] = useState(null)
  const [showResults, setShowResults] = useState(false)
  const navigate = useNavigate()

  const validateVehicleNumber = (number) => {
    const vehicleRegex = /^([A-Z]{2}[0-9]{2}[A-Z]{2}[0-9]{4})$/
    return vehicleRegex.test(number)
  }

  const validatePhoneNumber = (number) => {
    const phoneRegex = /^([0-9]{10})$/
    return phoneRegex.test(number)
  }

  const handleImageChange = (event) => {
    const files = Array.from(event.target.files)
    const newImages = []

    files.forEach((file) => {
      if (file.type.startsWith("image/")) {
        const reader = new FileReader()
        reader.onload = (e) => {
          newImages.push({
            file,
            preview: e.target.result,
            base64: e.target.result.split(",")[1],
          })
          if (newImages.length === files.length) {
            setImages((prev) => [...prev, ...newImages])
          }
        }
        reader.readAsDataURL(file)
      }
    })
  }

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index))
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case "safe":
        return <CheckCircle className="text-green-600" size={24} />
      case "warning":
        return <AlertCircle className="text-yellow-600" size={24} />
      case "danger":
        return <X className="text-red-600" size={24} />
      default:
        return <Upload className="text-gray-600" size={24} />
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

  const handleNewUpload = () => {
    setShowResults(false)
    setAnalysisResult(null)
    setUploadStatus(null)
    setImages([])
    setVehicleNumber("")
    setUserMobileNumber("")
    setErrors({})
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setErrors({})
    setUploadStatus(null)

    // Validation
    const newErrors = {}
    if (!validateVehicleNumber(vehicleNumber)) {
      newErrors.vehicleNumber = "Invalid vehicle number format (e.g., AP09BC1234)"
    }
    if (!validatePhoneNumber(userMobileNumber)) {
      newErrors.userMobileNumber = "Invalid phone number (10 digits required)"
    }
    if (images.length === 0) {
      newErrors.images = "Please upload at least one tire image"
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      setLoading(false)
      return
    }

    try {
      const uploadData = {
        vehicleNumber: vehicleNumber.toUpperCase(),
        userMobileNumber,
        images: images.map((img) => img.base64),
      }

      const response = await api.post("/api/upload/guest-data", uploadData)

      if (response.data.success) {
        setUploadStatus({
          type: "success",
          message: "Images uploaded successfully! Analysis completed.",
        })

        // Set analysis results to display
        setAnalysisResult({
          id: response.data.data.id,
          vehicleNumber: response.data.data.vehicleNumber,
          userMobileNumber,
          overallStatus: response.data.data.overallStatus,
          analysisResults: response.data.data.analysisResults,
          uploadedAt: response.data.data.uploadedAt,
          images: images
        })

        // Show results section
        setShowResults(true)
      }
    } catch (error) {
      setUploadStatus({
        type: "error",
        message: error.response?.data?.message || "Upload failed. Please try again.",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-slate-100">
      {loading && <Loader />}

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {!showResults ? (
          <>
            {/* Professional Upload Form */}
            <div className="bg-white rounded-2xl p-8 shadow-xl border border-slate-200">
              <form onSubmit={handleSubmit} className="space-y-8">
                
                {/* Vehicle Details Section */}
                <div className="bg-slate-50 rounded-2xl p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="bg-blue-100 p-2 rounded-xl">
                      <Car className="text-blue-600" size={20} />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900">Vehicle Information</h3>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Vehicle Number */}
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-3">
                        Vehicle Number <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Car className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
                        <input
                          type="text"
                          value={vehicleNumber}
                          onChange={(e) => setVehicleNumber(e.target.value.toUpperCase())}
                          placeholder="e.g., AP09BC1234"
                          className={`w-full pl-10 pr-4 py-4 border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 font-medium ${
                            errors.vehicleNumber ? "border-red-500 bg-red-50" : "border-slate-300 bg-white"
                          }`}
                        />
                      </div>
                      {errors.vehicleNumber && (
                        <div className="flex items-center gap-2 mt-2 text-sm text-red-600">
                          <AlertCircle size={16} />
                          {errors.vehicleNumber}
                        </div>
                      )}
                    </div>

                    {/* Mobile Number */}
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-3">
                        Mobile Number <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
                        <input
                          type="tel"
                          value={userMobileNumber}
                          onChange={(e) => setUserMobileNumber(e.target.value)}
                          placeholder="10-digit mobile number"
                          className={`w-full pl-10 pr-4 py-4 border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 font-medium ${
                            errors.userMobileNumber ? "border-red-500 bg-red-50" : "border-slate-300 bg-white"
                          }`}
                        />
                      </div>
                      {errors.userMobileNumber && (
                        <div className="flex items-center gap-2 mt-2 text-sm text-red-600">
                          <AlertCircle size={16} />
                          {errors.userMobileNumber}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Professional Image Upload Section */}
                <div className="bg-slate-50 rounded-2xl p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="bg-green-100 p-2 rounded-xl">
                      <Image className="text-green-600" size={20} />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900">Tire Images</h3>
                    <span className="text-sm bg-red-100 text-red-700 px-3 py-1 rounded-full font-medium">
                      Required
                    </span>
                  </div>
                  
                  <div className="border-2 border-dashed border-slate-300 rounded-2xl p-8 text-center bg-white hover:border-green-400 hover:bg-green-50/50 transition-all duration-300 group">
                    <div className="bg-green-100 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                      <Camera className="text-green-600" size={32} />
                    </div>
                    <h4 className="text-xl font-semibold text-slate-900 mb-3">Upload Tire Images</h4>
                    <p className="text-slate-600 mb-2 text-lg">Take clear photos of each tire for accurate analysis</p>
                    <p className="text-slate-500 text-sm mb-6">Multiple angles recommended • JPG, PNG supported</p>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                      id="image-upload"
                    />
                    <label
                      htmlFor="image-upload"
                      className="inline-flex items-center gap-2 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white px-8 py-4 rounded-xl font-bold cursor-pointer transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                    >
                      <Upload size={20} />
                      Select Images
                    </label>
                  </div>
                  {errors.images && (
                    <div className="flex items-center gap-2 mt-4 text-sm text-red-600 bg-red-50 p-3 rounded-xl">
                      <AlertCircle size={16} />
                      {errors.images}
                    </div>
                  )}
                </div>

                {/* Professional Image Preview */}
                {images.length > 0 && (
                  <div className="bg-slate-50 rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-3">
                        <div className="bg-blue-100 p-2 rounded-xl">
                          <FileText className="text-blue-600" size={20} />
                        </div>
                        <h3 className="text-lg font-semibold text-slate-900">
                          Selected Images ({images.length})
                        </h3>
                      </div>
                      <button
                        type="button"
                        onClick={() => setImages([])}
                        className="text-sm text-red-600 hover:text-red-700 font-medium bg-red-50 hover:bg-red-100 px-3 py-2 rounded-lg transition-colors"
                      >
                        Clear All
                      </button>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {images.map((image, index) => (
                        <div key={index} className="relative group">
                          <div className="bg-white rounded-xl p-2 shadow-md border border-slate-200 group-hover:shadow-lg transition-all duration-200">
                            <img
                              src={image.preview || "/placeholder.svg"}
                              alt={`Tire Analysis ${index + 1}`}
                              className="w-full h-28 object-cover rounded-lg"
                            />
                            <div className="mt-2 text-xs text-slate-500 text-center truncate">
                              Image {index + 1}
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5 shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-200"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Status Message */}
                {uploadStatus && (
                  <div className={`flex items-center gap-3 p-6 rounded-xl border ${
                    uploadStatus.type === "success" 
                      ? "bg-green-50 text-green-700 border-green-200" 
                      : "bg-red-50 text-red-700 border-red-200"
                  }`}>
                    {uploadStatus.type === "success" ? (
                      <CheckCircle size={24} className="text-green-600" />
                    ) : (
                      <AlertCircle size={24} className="text-red-600" />
                    )}
                    <div>
                      <div className="font-semibold">
                        {uploadStatus.type === "success" ? "Analysis Complete!" : "Upload Failed"}
                      </div>
                      <div className="text-sm">{uploadStatus.message}</div>
                    </div>
                  </div>
                )}

                {/* Submit Button */}
                <div className="flex justify-center pt-6">
                  <button
                    type="submit"
                    disabled={loading || images.length === 0 || !vehicleNumber || !userMobileNumber}
                    className="flex items-center gap-3 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white px-16 py-4 rounded-xl font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent"></div>
                        Analyzing Images...
                      </>
                    ) : (
                      <>
                        <Upload size={24} />
                        Start Free Analysis
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
           

            {/* Professional Tips Section */}
            <div className="bg-gradient-to-r from-blue-50 to-slate-50 border border-blue-200 rounded-2xl p-6 mt-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-blue-100 p-2 rounded-xl">
                  <Camera className="text-blue-600" size={20} />
                </div>
                <h4 className="text-lg font-bold text-blue-900">Photography Guidelines</h4>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="text-green-600" size={16} />
                    <span className="text-blue-700 text-sm">Take photos in bright, natural lighting</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="text-green-600" size={16} />
                    <span className="text-blue-700 text-sm">Capture all four tires from multiple angles</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="text-green-600" size={16} />
                    <span className="text-blue-700 text-sm">Focus on tire treads and sidewall details</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="text-green-600" size={16} />
                    <span className="text-blue-700 text-sm">Ensure images are sharp and not blurry</span>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          // Results Display Section
          <>
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">Analysis Results</h1>
              <p className="text-gray-600">Your tire analysis has been completed</p>
            </div>

            <div className="card p-6 mb-6">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
                <div className="flex items-center gap-4 mb-4 lg:mb-0">
                  <div className="flex items-center gap-2">
                    <Car className="text-gray-600" size={20} />
                    <span className="font-semibold text-lg">{analysisResult.vehicleNumber}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="text-gray-600" size={16} />
                    <span className="text-gray-600">{analysisResult.userMobileNumber}</span>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="text-gray-600" size={16} />
                    <span className="text-gray-600">{new Date(analysisResult.uploadedAt).toLocaleDateString()}</span>
                  </div>
                  <div
                    className={`flex items-center gap-2 px-3 py-1 rounded-full border ${getStatusColor(analysisResult.overallStatus)}`}
                  >
                    {getStatusIcon(analysisResult.overallStatus)}
                    <span className="font-medium capitalize">{analysisResult.overallStatus}</span>
                  </div>
                </div>
              </div>

              {/* Analysis Details */}
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <h4 className="font-semibold text-gray-800 mb-2">Analysis Report</h4>
                <div className="space-y-2">
                  {analysisResult.analysisResults && analysisResult.analysisResults.map((result, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <span className="text-gray-700">Image {index + 1}:</span>
                      <span className={`px-2 py-1 rounded text-sm ${result.prediction === 'cracked' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                        {result.prediction} ({Math.round(result.confidence * 100)}% confidence)
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Images */}
              {analysisResult.images && analysisResult.images.length > 0 && (
                <div className="mb-4">
                  <h4 className="font-semibold text-gray-800 mb-3">Uploaded Images</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {analysisResult.images.slice(0, 4).map((image, imgIndex) => (
                      <div key={imgIndex} className="relative">
                        <img
                          src={image.preview || "/placeholder.svg"}
                          alt={`Tire ${imgIndex + 1}`}
                          className="w-full h-24 object-cover rounded-lg border border-gray-200"
                        />
                      </div>
                    ))}
                    {analysisResult.images.length > 4 && (
                      <div className="w-full h-24 bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center">
                        <span className="text-gray-600 text-sm">+{analysisResult.images.length - 4} more</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Recommendations */}
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-2">Safety Recommendations</h4>
                <div className="text-blue-700 text-sm space-y-1">
                  {analysisResult.overallStatus === "safe" && (
                    <p>✅ Your tires are in good condition. Continue regular maintenance.</p>
                  )}
                  {analysisResult.overallStatus === "warning" && (
                    <p>⚠️ Some wear detected. Consider inspection by a professional soon.</p>
                  )}
                  {analysisResult.overallStatus === "danger" && (
                    <p>🚨 Immediate attention required. Please visit a tire service center.</p>
                  )}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={handleNewUpload}
                className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                <ArrowLeft size={20} />
                Upload Another Vehicle
              </button>
              <button
                onClick={() => navigate("/guest-details")}
                className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                View Previous Records
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
