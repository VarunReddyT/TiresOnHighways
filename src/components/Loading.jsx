import React from 'react'
import { Activity, Shield, Cog } from 'lucide-react'

export default function Loader() {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-slate-900/80 to-blue-900/80 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-3xl p-10 shadow-2xl border border-slate-200 flex flex-col items-center max-w-sm mx-4">
        
        {/* Professional Loader Animation */}
        <div className="relative mb-8">
          <div className="animate-spin rounded-full h-20 w-20 border-4 border-slate-200"></div>
          <div className="animate-spin rounded-full h-20 w-20 border-4 border-blue-600 border-t-transparent absolute inset-0"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <Activity className="text-blue-600 animate-pulse" size={24} />
          </div>
        </div>

        {/* Loading Text */}
        <div className="text-center">
          <h3 className="text-xl font-bold text-slate-900 mb-2">Processing Request</h3>
          <p className="text-slate-600 mb-4">Please wait while we handle your data securely</p>
          
          {/* Status Indicators */}
          <div className="flex items-center justify-center gap-4 text-sm">
            <div className="flex items-center gap-2 text-green-600">
              <Shield size={16} />
              <span>Secure</span>
            </div>
            <div className="flex items-center gap-2 text-blue-600">
              <Cog size={16} className="animate-spin" />
              <span>Processing</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
