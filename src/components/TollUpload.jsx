"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Upload, X, CheckCircle, AlertCircle, Car, Phone, Image, Shield, FileText } from "lucide-react"
import api from "../utils/api"
import Loader from "./Loading"

export default function TollUpload() {
  const [images, setImages] = useState([])
  const [vehicleNumber, setVehicleNumber] = useState("")
  const [userMobileNumber, setUserMobileNumber] = useState("")
  const [loading, setLoading] = useState(false)
  const [uploadStatus, setUploadStatus] = useState(null)
  const [errors, setErrors] = useState({})
  const navigate = useNavigate()

  useEffect(() => {
    // Check authentication
    const token = localStorage.getItem('authToken')
    if (!token) {
      navigate("/toll-login")
    }
  }, [navigate])

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
      newErrors.images = "Please upload at least one image"
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
        date: new Date().toISOString().split("T")[0],
        tollOperator: localStorage.getItem('tollPlaza')
      }

      const response = await api.post("/api/upload/vehicle-data", uploadData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        },
      })

      if (response.data.success) {
        setUploadStatus({ type: "success", message: "Data uploaded successfully!" })

        // Reset form
        setImages([])
        setVehicleNumber("")
        setUserMobileNumber("")

        setTimeout(() => {
          setUploadStatus(null)
        }, 3000)
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {loading && <Loader />}

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
          <form onSubmit={handleSubmit} className="p-8 space-y-8">
            {/* Vehicle Information Section */}
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
                  <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-3">
                    <Car size={16} className="text-blue-500" />
                    Vehicle Registration Number
                  </label>
                  <input
                    type="text"
                    value={vehicleNumber}
                    onChange={(e) => setVehicleNumber(e.target.value.toUpperCase())}
                    placeholder="e.g., AP09BC1234"
                    className={`w-full px-4 py-4 bg-white border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 font-mono text-lg ${
                      errors.vehicleNumber ? "border-red-400 bg-red-50" : "border-slate-300"
                    }`}
                  />
                  {errors.vehicleNumber && (
                    <div className="flex items-center gap-2 mt-2 text-sm text-red-600">
                      <AlertCircle size={16} />
                      {errors.vehicleNumber}
                    </div>
                  )}
                </div>

                {/* Mobile Number */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-3">
                    <Phone size={16} className="text-green-500" />
                    Owner Mobile Number
                  </label>
                  <input
                    type="tel"
                    value={userMobileNumber}
                    onChange={(e) => setUserMobileNumber(e.target.value)}
                    placeholder="10-digit mobile number"
                    className={`w-full px-4 py-4 bg-white border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 font-mono text-lg ${
                      errors.userMobileNumber ? "border-red-400 bg-red-50" : "border-slate-300"
                    }`}
                  />
                  {errors.userMobileNumber && (
                    <div className="flex items-center gap-2 mt-2 text-sm text-red-600">
                      <AlertCircle size={16} />
                      {errors.userMobileNumber}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Image Upload Section */}
            <div className="bg-slate-50 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-green-100 p-2 rounded-xl">
                  <Image className="text-green-600" size={20} />
                </div>
                <h3 className="text-lg font-semibold text-slate-900">Vehicle Images</h3>
                <span className="text-sm text-slate-500 bg-slate-200 px-3 py-1 rounded-full">
                  Required
                </span>
              </div>
              
              <div className="border-2 border-dashed border-slate-300 rounded-2xl p-8 text-center bg-white hover:border-blue-400 hover:bg-blue-50/50 transition-all duration-300 group">
                <div className="bg-blue-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Upload className="text-blue-600" size={28} />
                </div>
                <h4 className="text-lg font-semibold text-slate-900 mb-2">Upload Vehicle Images</h4>
                <p className="text-slate-600 mb-6 max-w-md mx-auto">
                  Click to browse or drag and drop multiple images. Supported formats: JPG, PNG, WEBP
                </p>
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
                  className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold cursor-pointer transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  <Upload size={20} />
                  Select Images
                </label>
                <div className="mt-4 text-xs text-slate-500">
                  Maximum 10 images • Up to 5MB each
                </div>
              </div>
              
              {errors.images && (
                <div className="flex items-center gap-2 mt-4 text-sm text-red-600 bg-red-50 p-3 rounded-xl">
                  <AlertCircle size={16} />
                  {errors.images}
                </div>
              )}
            </div>

            {/* Image Preview Section */}
            {images.length > 0 && (
              <div className="bg-slate-50 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="bg-slate-100 p-2 rounded-xl">
                      <FileText className="text-slate-600" size={20} />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900">
                      Uploaded Images ({images.length})
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => setImages([])}
                    className="text-sm text-red-600 hover:text-red-700 font-medium"
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
                          alt={`Upload ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg"
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
              <div className={`flex items-center gap-3 p-4 rounded-xl border ${
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
                    {uploadStatus.type === "success" ? "Upload Successful" : "Upload Failed"}
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
                className="flex items-center gap-3 bg-gradient-to-r from-blue-600 to-slate-700 hover:from-blue-700 hover:to-slate-800 text-white px-12 py-4 rounded-xl font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent"></div>
                    Processing Upload...
                  </>
                ) : (
                  <>
                    <Upload size={24} />
                    Upload Vehicle Data
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

      </div>
    </div>
  )
}
