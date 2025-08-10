"use client"

import { Link } from "react-router-dom"
import { Upload, Search, Users, Shield, ArrowRight, Camera, BarChart3 } from "lucide-react"

export default function Guest() {
  return (
    <div className="min-h-screen">
      {/* Professional Hero Section */}
      <section className="relative bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 text-white py-24 overflow-hidden">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              Guest Access 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-300 to-teal-300"> Portal</span>
            </h1>
            <p className="text-xl md:text-2xl text-green-100 mb-12 max-w-3xl mx-auto leading-relaxed">
              Check your vehicle's tire condition instantly without registration. 
              Quick, easy, secure, and completely free to use.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link
                to="/guest-upload"
                className="group bg-white text-green-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-green-50 transition-all duration-300 shadow-xl hover:shadow-2xl flex items-center justify-center gap-2"
              >
                <Upload className="h-5 w-5" />
                Upload Vehicle Images
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
              <Link
                to="/guest-details"
                className="group border-2 border-white/50 backdrop-blur-sm text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-white/10 hover:border-white transition-all duration-300 flex items-center justify-center gap-2"
              >
                <Search className="h-5 w-5" />
                Check Previous Results
              </Link>
            </div>
          </div>
        </div>
        
      </section>

      {/* Professional Features Section */}
      <section className="py-24 bg-gradient-to-br from-slate-50 to-green-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
              Why Use 
              <span className="text-green-600"> Guest Access?</span>
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
              Get professional tire condition analysis without creating an account. 
              Experience our full-featured platform with complete guest access privileges.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="group bg-white rounded-2xl p-8 shadow-lg border border-slate-200 hover:shadow-2xl hover:border-green-300 transition-all duration-300 text-center">
              <div className="h-16 w-16 bg-gradient-to-r from-green-100 to-green-200 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <Upload className="text-green-600" size={32} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Easy Upload</h3>
              <p className="text-slate-600 leading-relaxed">Simply upload your vehicle images and get professional analysis instantly.</p>
            </div>

            <div className="group bg-white rounded-2xl p-8 shadow-lg border border-slate-200 hover:shadow-2xl hover:border-blue-300 transition-all duration-300 text-center">
              <div className="h-16 w-16 bg-gradient-to-r from-blue-100 to-blue-200 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <BarChart3 className="text-blue-600" size={32} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">AI-Powered Analysis</h3>
              <p className="text-slate-600 leading-relaxed">Get detailed tire condition reports powered by advanced AI in seconds.</p>
            </div>

            <div className="group bg-white rounded-2xl p-8 shadow-lg border border-slate-200 hover:shadow-2xl hover:border-purple-300 transition-all duration-300 text-center">
              <div className="h-16 w-16 bg-gradient-to-r from-purple-100 to-purple-200 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <Users className="text-purple-600" size={32} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">No Registration</h3>
              <p className="text-slate-600 leading-relaxed">Access our professional services without creating an account or providing personal data.</p>
            </div>

            <div className="group bg-white rounded-2xl p-8 shadow-lg border border-slate-200 hover:shadow-2xl hover:border-orange-300 transition-all duration-300 text-center">
              <div className="h-16 w-16 bg-gradient-to-r from-orange-100 to-orange-200 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <Shield className="text-orange-600" size={32} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Secure & Private</h3>
              <p className="text-slate-600 leading-relaxed">Your data is processed securely with enterprise-grade privacy protection.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Professional How It Works Section */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="absolute inset-0" style={{backgroundImage: "url('data:image/svg+xml,%3Csvg width=\"60\" height=\"60\" viewBox=\"0 0 60 60\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"none\" fill-rule=\"evenodd\"%3E%3Cg fill=\"%2300ff00\" fill-opacity=\"0.02\"%3E%3Ccircle cx=\"30\" cy=\"30\" r=\"1\"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')"}}></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold mb-4">
              <Camera className="h-4 w-4" />
              Simple Process
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">How It Works</h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
              Three simple steps to get professional tire condition analysis
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center group">
              <div className="relative mb-8">
                <div className="h-20 w-20 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-2xl flex items-center justify-center mx-auto text-2xl font-bold shadow-xl group-hover:scale-110 transition-transform duration-300">
                  1
                </div>
                <div className="absolute -inset-3 bg-green-100 rounded-3xl -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">Upload Images</h3>
              <p className="text-slate-600 leading-relaxed max-w-sm mx-auto">
                Take clear, high-quality photos of your vehicle's tires from multiple angles and upload them securely.
              </p>
            </div>

            <div className="text-center group">
              <div className="relative mb-8">
                <div className="h-20 w-20 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-2xl flex items-center justify-center mx-auto text-2xl font-bold shadow-xl group-hover:scale-110 transition-transform duration-300">
                  2
                </div>
                <div className="absolute -inset-3 bg-blue-100 rounded-3xl -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">AI Analysis</h3>
              <p className="text-slate-600 leading-relaxed max-w-sm mx-auto">
                Our advanced AI system analyzes your tire condition using machine learning algorithms for accurate results.
              </p>
            </div>

            <div className="text-center group">
              <div className="relative mb-8">
                <div className="h-20 w-20 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-2xl flex items-center justify-center mx-auto text-2xl font-bold shadow-xl group-hover:scale-110 transition-transform duration-300">
                  3
                </div>
                <div className="absolute -inset-3 bg-purple-100 rounded-3xl -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">Get Results</h3>
              <p className="text-slate-600 leading-relaxed max-w-sm mx-auto">
                Receive detailed reports with safety recommendations and actionable insights within seconds.
              </p>
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center mt-16">
            <Link 
              to="/guest-upload" 
              className="group inline-flex items-center gap-3 bg-gradient-to-r from-green-600 to-green-700 text-white px-10 py-4 rounded-xl font-bold text-lg hover:from-green-700 hover:to-green-800 transition-all duration-300 shadow-xl hover:shadow-2xl"
            >
              Get Started Now
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
            <p className="text-sm text-slate-500 mt-4">No account required • Free analysis • Instant results</p>
          </div>
        </div>
      </section>
    </div>
  )
}
