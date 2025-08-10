import {Users, Target, Heart, Award, Star, Zap, Shield } from "lucide-react"

import VarunImg from "../assets/Varun.jpg"
import ShivaImg from "../assets/Shiva.jpg"
import CharanImg from "../assets/Charan.jpg"
import DeepakImg from "../assets/Deepak.jpg"
import ManojImg from "../assets/Manoj.jpg"
import GargeyImg from "../assets/Gargey.jpg"

export default function AboutUs() {

  return (
    <div className="min-h-screen">
      {/* Professional Hero Section */}
      <section className="relative bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white py-24 overflow-hidden">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              Team 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-pink-300"> G81</span>
            </h1>
            <p className="text-xl md:text-2xl text-indigo-100 max-w-3xl mx-auto leading-relaxed">
              Passionate innovators creating cutting-edge solutions for road safety and intelligent tire monitoring systems.
            </p>
          </div>
        </div>

      </section>

      {/* Professional Team Section */}
      <section className="py-24 bg-gradient-to-br from-slate-50 to-indigo-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
              The Minds Behind 
              <span className="text-indigo-600"> Innovation</span>
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
              Meet the talented developers and engineers who are revolutionizing tire safety technology through advanced AI and modern web solutions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Varun */}
            <div className="group bg-white rounded-2xl p-6 shadow-lg border border-slate-200 hover:shadow-2xl hover:border-indigo-300 transition-all duration-300 text-center">
              <div className="relative mb-4">
                <div className="h-24 w-24 rounded-full mx-auto overflow-hidden shadow-lg group-hover:scale-110 transition-transform duration-300 border-4 border-white">
                  <img 
                    src={VarunImg} 
                    alt="Varun"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -top-1 -right-1 h-6 w-6 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                  <Award className="h-3 w-3 text-white" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-1">Varun</h3>
              <p className="text-indigo-600 font-semibold mb-2 text-sm">Full Stack Developer</p>
              <p className="text-slate-600 leading-relaxed mb-3 text-sm">
                Expert in Frontend & Backend Development, specializing in React, Node.js, and modern web technologies.
              </p>
            </div>

            {/* Shiva */}
            <div className="group bg-white rounded-2xl p-6 shadow-lg border border-slate-200 hover:shadow-2xl hover:border-purple-300 transition-all duration-300 text-center">
              <div className="relative mb-4">
                <div className="h-24 w-24 rounded-full mx-auto overflow-hidden shadow-lg group-hover:scale-110 transition-transform duration-300 border-4 border-white">
                  <img 
                    src={ShivaImg} 
                    alt="Shiva"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -top-1 -right-1 h-6 w-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                  <Star className="h-3 w-3 text-white" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-1">Shiva</h3>
              <p className="text-purple-600 font-semibold mb-2 text-sm">Backend Developer</p>
              <p className="text-slate-600 leading-relaxed mb-3 text-sm">
                Specializing in RESTful APIs, ensuring seamless communication between frontend and backend systems.
              </p>
            </div>

            {/* Charan */}
            <div className="group bg-white rounded-2xl p-6 shadow-lg border border-slate-200 hover:shadow-2xl hover:border-green-300 transition-all duration-300 text-center">
              <div className="relative mb-4">
                <div className="h-24 w-24 rounded-full mx-auto overflow-hidden shadow-lg group-hover:scale-110 transition-transform duration-300 border-4 border-white">
                  <img 
                    src={CharanImg} 
                    alt="Charan"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -top-1 -right-1 h-6 w-6 bg-gradient-to-r from-green-500 to-teal-500 rounded-full flex items-center justify-center">
                  <Target className="h-3 w-3 text-white" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-1">Charan</h3>
              <p className="text-green-600 font-semibold mb-2 text-sm">AI/ML Engineer</p>
              <p className="text-slate-600 leading-relaxed mb-3 text-sm">
                Specializing in machine learning algorithms and data analysis for predictive modeling.
              </p>
            </div>

            {/* Deepak */}
            <div className="group bg-white rounded-2xl p-6 shadow-lg border border-slate-200 hover:shadow-2xl hover:border-blue-300 transition-all duration-300 text-center">
              <div className="relative mb-4">
                <div className="h-24 w-24 rounded-full mx-auto overflow-hidden shadow-lg group-hover:scale-110 transition-transform duration-300 border-4 border-white">
                  <img 
                    src={DeepakImg} 
                    alt="Deepak"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -top-1 -right-1 h-6 w-6 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center">
                  <Zap className="h-3 w-3 text-white" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-1">Deepak</h3>
              <p className="text-blue-600 font-semibold mb-2 text-sm">AI/ML Engineer</p>
              <p className="text-slate-600 leading-relaxed mb-3 text-sm">
                Specializes in machine learning and deep learning techniques, focusing on natural language processing and computer vision.
              </p>
            </div>

            {/* Manoj */}
            <div className="group bg-white rounded-2xl p-6 shadow-lg border border-slate-200 hover:shadow-2xl hover:border-orange-300 transition-all duration-300 text-center">
              <div className="relative mb-4">
                <div className="h-24 w-24 rounded-full mx-auto overflow-hidden shadow-lg group-hover:scale-110 transition-transform duration-300 border-4 border-white">
                  <img 
                    src={ManojImg} 
                    alt="Manoj"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -top-1 -right-1 h-6 w-6 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center">
                  <Shield className="h-3 w-3 text-white" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-1">Manoj</h3>
              <p className="text-orange-600 font-semibold mb-2 text-sm">Backend Developer</p>
              <p className="text-slate-600 leading-relaxed mb-3 text-sm">
                Specializes in building server-side applications and APIs, ensuring high performance and scalability.
              </p>
            </div>

            {/* Gargey */}
            <div className="group bg-white rounded-2xl p-6 shadow-lg border border-slate-200 hover:shadow-2xl hover:border-cyan-300 transition-all duration-300 text-center">
              <div className="relative mb-4">
                <div className="h-24 w-24 rounded-full mx-auto overflow-hidden shadow-lg group-hover:scale-110 transition-transform duration-300 border-4 border-white">
                  <img 
                    src={GargeyImg} 
                    alt="Gargey"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -top-1 -right-1 h-6 w-6 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full flex items-center justify-center">
                  <Users className="h-3 w-3 text-white" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-1">Gargey</h3>
              <p className="text-cyan-600 font-semibold mb-2 text-sm">Frontend Developer</p>
              <p className="text-slate-600 leading-relaxed mb-3 text-sm">
                Specializes in building responsive and user-friendly web applications using modern frameworks.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Professional Mission Section */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="absolute inset-0" style={{backgroundImage: "url('data:image/svg+xml,%3Csvg width=\"60\" height=\"60\" viewBox=\"0 0 60 60\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"none\" fill-rule=\"evenodd\"%3E%3Cg fill=\"%235555ff\" fill-opacity=\"0.02\"%3E%3Ccircle cx=\"30\" cy=\"30\" r=\"1\"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')"}}></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold mb-6">
                <Heart className="h-4 w-4" />
                Our Mission
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-8 leading-tight">
                Making Roads 
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600"> Safer</span>
              </h2>
              <p className="text-lg text-slate-600 mb-6 leading-relaxed">
                At Tires On Highways, we're committed to revolutionizing road safety through innovative tire monitoring
                technology. Our mission is to prevent accidents caused by tire-related issues by providing accessible,
                accurate, and real-time tire condition analysis.
              </p>
              <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                We believe that everyone deserves to travel safely, and our technology makes professional-grade tire
                analysis available to everyone, from individual vehicle owners to large toll plaza operations.
              </p>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="h-12 w-12 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-xl flex items-center justify-center shadow-md">
                    <Zap className="text-blue-600" size={24} />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-slate-900 mb-2">Innovation First</h4>
                    <p className="text-slate-600 leading-relaxed">Cutting-edge AI technology for accurate tire analysis and predictive maintenance.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="h-12 w-12 bg-gradient-to-r from-green-100 to-emerald-100 rounded-xl flex items-center justify-center shadow-md">
                    <Users className="text-green-600" size={24} />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-slate-900 mb-2">Universal Accessibility</h4>
                    <p className="text-slate-600 leading-relaxed">Making tire safety monitoring available to everyone, regardless of technical expertise.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="h-12 w-12 bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl flex items-center justify-center shadow-md">
                    <Shield className="text-purple-600" size={24} />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-slate-900 mb-2">Safety Excellence</h4>
                    <p className="text-slate-600 leading-relaxed">Uncompromising commitment to road safety through continuous monitoring and alerts.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="lg:text-center">
              <div className="bg-gradient-to-r from-blue-100 to-purple-100 rounded-3xl p-12 shadow-2xl">
                <div className="h-64 w-full bg-gradient-to-r from-blue-200 to-purple-200 rounded-2xl flex items-center justify-center">
                  <div className="text-center">
                    <Target className="h-20 w-20 text-blue-600 mx-auto mb-4" />
                    <h3 className="text-2xl font-bold text-slate-900 mb-2">Our Vision</h3>
                    <p className="text-slate-600">Zero tire-related accidents on highways worldwide</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}
