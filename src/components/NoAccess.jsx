"use client"

import { Link } from "react-router-dom"
import { Lock, Home, LogIn, Shield, AlertTriangle } from "lucide-react"

export default function NoAccess() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-red-50 to-slate-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-lg w-full">
        
        {/* Main Error Card */}
        <div className="bg-white rounded-3xl p-8 shadow-2xl border border-red-200 text-center backdrop-blur-lg">
          
          {/* Error Icon */}
          <div className="relative mb-8">
            <div className="bg-gradient-to-br from-red-100 to-red-200 w-24 h-24 rounded-2xl flex items-center justify-center mx-auto shadow-lg">
              <Lock className="text-red-600" size={48} />
            </div>
            <div className="absolute -top-2 -right-2 bg-red-500 w-8 h-8 rounded-full flex items-center justify-center">
              <AlertTriangle className="text-white" size={16} />
            </div>
          </div>

          {/* Error Message */}
          <h1 className="text-3xl font-bold bg-gradient-to-r from-red-600 to-slate-700 bg-clip-text text-transparent mb-4">
            Access Restricted
          </h1>
          <p className="text-slate-600 mb-8 leading-relaxed">
            This area requires proper authentication credentials. Please sign in with your authorized account 
            or return to the public sections of the application.
          </p>

          {/* Security Notice */}
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-8">
            <div className="flex items-center gap-3 mb-2">
              <Shield className="text-red-600" size={20} />
              <span className="font-semibold text-red-800">Security Notice</span>
            </div>
            <p className="text-sm text-red-700">
              This attempt has been logged for security monitoring purposes.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-4">
            <Link 
              to="/toll-login" 
              className="w-full bg-gradient-to-r from-blue-600 to-slate-700 hover:from-blue-700 hover:to-slate-800 text-white px-6 py-4 rounded-xl font-bold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center gap-3"
            >
              <LogIn size={20} />
              Sign In to Continue
            </Link>

            <Link 
              to="/" 
              className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 px-6 py-4 rounded-xl font-semibold transition-all duration-300 border border-slate-300 hover:border-slate-400 flex items-center justify-center gap-3"
            >
              <Home size={20} />
              Return to Home
            </Link>
          </div>
        </div>

        {/* Help Section */}
        <div className="mt-8 text-center">
          <p className="text-sm text-slate-500 mb-4">
            Need help accessing this system?
          </p>
          <div className="bg-white rounded-xl p-4 shadow-md border border-slate-200">
            <p className="text-sm text-slate-600">
              Contact your system administrator or visit the guest portal for public tire analysis services.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
