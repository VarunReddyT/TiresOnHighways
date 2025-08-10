import React from "react"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Home from "./components/Home"
import TollLogin from "./components/TollLogin"
import TollStart from "./components/TollStart"
import TollUpload from "./components/TollUpload"
import Guest from "./components/Guest"
import GuestUpload from "./components/GuestUpload"
import GuestDetails from "./components/GuestDetails"
import AboutUs from "./components/AboutUs"
import Statistics from "./components/Statistics"
import HomeStatistics from "./components/HomeStatistics"
import CheckRecords from "./components/CheckRecords"
import NoAccess from "./components/NoAccess"
import AdminDashboard from "./components/AdminDashboard"
import Navbar from "./components/Navbar"
import Footer from "./components/Footer"

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/toll-login" element={<TollLogin />} />
            <Route path="/toll-start" element={<TollStart />} />
            <Route path="/toll-upload" element={<TollUpload />} />
            <Route path="/admin-dashboard" element={<AdminDashboard />} />
            <Route path="/guest" element={<Guest />} />
            <Route path="/guest-upload" element={<GuestUpload />} />
            <Route path="/guest-details" element={<GuestDetails />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/statistics" element={<Statistics />} />
            <Route path="/home-statistics" element={<HomeStatistics />} />
            <Route path="/check-records" element={<CheckRecords />} />
            <Route path="/no-access" element={<NoAccess />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  )
}

const NotFound = () => (
  <div className="flex items-center justify-center min-h-[400px]">
    <h1 className="text-2xl font-bold text-gray-800">404 Error. The page you are looking for does not exist</h1>
  </div>
)

export default App
