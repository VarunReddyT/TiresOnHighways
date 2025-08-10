"use client"

import { Link } from "react-router-dom"
import { Car, Shield, Users, BarChart3, ArrowRight, CheckCircle } from "lucide-react"
import Highway from '../assets/highway2.jpg'

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Professional Hero Section */}
      <section 
        className="relative py-24 overflow-hidden"
        style={{
          backgroundImage: `url(${Highway})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-blue-900/80 to-slate-900/90"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              Tires On 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300"> Highways</span>
            </h1>
            <p className="text-xl md:text-2xl text-slate-200 mb-12 max-w-3xl mx-auto leading-relaxed">
              Revolutionizing road safety through intelligent tire health monitoring. 
              Ensuring safer journeys with cutting-edge AI-powered analysis.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link
                to="/guest"
                className="group bg-white text-slate-900 px-8 py-4 rounded-xl font-bold text-lg hover:bg-slate-100 transition-all duration-300 shadow-xl hover:shadow-2xl flex items-center justify-center gap-2"
              >
                Guest Access
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
              <Link
                to="/toll-login"
                className="group border-2 border-white/50 backdrop-blur-sm text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-white/10 hover:border-white transition-all duration-300 flex items-center justify-center gap-2"
              >
                Toll Plaza Login
                <Shield className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
        
      </section>

      {/* Professional Features Section */}
      <section className="py-24 bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
              Advanced Technology Meets 
              <span className="text-blue-600"> Road Safety</span>
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
              Our comprehensive tire monitoring platform combines artificial intelligence, 
              real-time analysis, and user-friendly interfaces to deliver unmatched safety solutions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="group bg-white rounded-2xl p-8 shadow-lg border border-slate-200 hover:shadow-2xl hover:border-blue-300 transition-all duration-300 text-center">
              <div className="h-16 w-16 bg-gradient-to-r from-blue-100 to-blue-200 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <Car className="text-blue-600" size={32} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Smart Vehicle Monitoring</h3>
              <p className="text-slate-600 leading-relaxed">AI-powered real-time tire condition assessment for all vehicle types</p>
            </div>

            <div className="group bg-white rounded-2xl p-8 shadow-lg border border-slate-200 hover:shadow-2xl hover:border-green-300 transition-all duration-300 text-center">
              <div className="h-16 w-16 bg-gradient-to-r from-green-100 to-green-200 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <Shield className="text-green-600" size={32} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Safety First Priority</h3>
              <p className="text-slate-600 leading-relaxed">Preventing accidents through proactive tire health monitoring and instant alerts.</p>
            </div>

            <div className="group bg-white rounded-2xl p-8 shadow-lg border border-slate-200 hover:shadow-2xl hover:border-purple-300 transition-all duration-300 text-center">
              <div className="h-16 w-16 bg-gradient-to-r from-purple-100 to-purple-200 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <Users className="text-purple-600" size={32} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">User-Centric Design</h3>
              <p className="text-slate-600 leading-relaxed">Intuitive interface designed for seamless experience for both guests and operators.</p>
            </div>

            <div className="group bg-white rounded-2xl p-8 shadow-lg border border-slate-200 hover:shadow-2xl hover:border-orange-300 transition-all duration-300 text-center">
              <div className="h-16 w-16 bg-gradient-to-r from-orange-100 to-orange-200 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <BarChart3 className="text-orange-600" size={32} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Advanced Analytics</h3>
              <p className="text-slate-600 leading-relaxed">Comprehensive reporting and real-time statistics for data-driven insights.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Professional CTA Section */}
      <section className="py-24 bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 relative overflow-hidden">
        <div className="absolute inset-0" style={{backgroundImage: "url('data:image/svg+xml,%3Csvg width=\"60\" height=\"60\" viewBox=\"0 0 60 60\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"none\" fill-rule=\"evenodd\"%3E%3Cg fill=\"%23ffffff\" fill-opacity=\"0.05\"%3E%3Ccircle cx=\"30\" cy=\"30\" r=\"1\"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')"}}></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Enhance Your 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300"> Road Safety?</span>
            </h2>
            <p className="text-xl text-slate-300 mb-12 max-w-2xl mx-auto leading-relaxed">
              Join thousands of users who trust Tires On Highways for their tire monitoring needs. 
              Experience the future of road safety today.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Link 
                to="/guest" 
                className="group bg-gradient-to-r from-blue-600 to-blue-700 text-white px-10 py-4 rounded-xl font-bold text-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-xl hover:shadow-2xl flex items-center gap-3"
              >
                Start Monitoring Now
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
              
              <div className="flex items-center gap-4 text-slate-300">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-400" />
                  <span className="text-sm">Free to use</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-400" />
                  <span className="text-sm">Instant results</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
