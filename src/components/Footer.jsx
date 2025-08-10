import { Link } from "react-router-dom"
import { Instagram, Github, Linkedin } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-gray-100 border-t mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Company Info */}
          <div className="text-center md:text-left">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Tires On Highways</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Stay safe on the road with TiresOnHighways,
              <br />
              Your partner in tire health awareness.
              <br />
              Together, let's drive towards safer journeys.
            </p>
          </div>

          {/* Social Links */}
          <div className="text-center">
            <h4 className="text-lg font-semibold text-gray-800 mb-4">Follow Us</h4>
            <div className="flex justify-center space-x-6">
              <Link
                to="https://www.instagram.com/varun.t__19/"
                target="_blank"
                className="text-gray-600 hover:text-primary-600 transition-colors"
              >
                <Instagram size={24} />
              </Link>
              <Link
                to="https://github.com/VarunReddyT"
                target="_blank"
                className="text-gray-600 hover:text-primary-600 transition-colors"
              >
                <Github size={24} />
              </Link>
              <Link
                to="https://www.linkedin.com/in/varun-reddy-231244253/"
                target="_blank"
                className="text-gray-600 hover:text-primary-600 transition-colors"
              >
                <Linkedin size={24} />
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div className="text-center md:text-right">
            <h4 className="text-lg font-semibold text-gray-800 mb-4">Quick Links</h4>
            <div className="space-y-2">
              <Link to="/" className="block text-gray-600 hover:text-primary-600 transition-colors">
                Home
              </Link>
              <Link to="/about" className="block text-gray-600 hover:text-primary-600 transition-colors">
                About Us
              </Link>
              <Link to="/guest" className="block text-gray-600 hover:text-primary-600 transition-colors">
                Guest Access
              </Link>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 mt-8 pt-6 text-center">
          <p className="text-gray-600 text-sm">© 2024 Tires On Highways. All rights reserved. | Team G81</p>
        </div>
      </div>
    </footer>
  )
}
