
import { Link } from 'react-router-dom';

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-50 border-t">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center">
              <span className="text-xl font-bold text-hotel-primary">Wanderlust</span>
            </Link>
            <p className="mt-4 text-sm text-gray-500">
              Discover the world's most extraordinary places, one stay at a time.
            </p>
          </div>
          <div className="md:col-span-1">
            <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">
              Company
            </h3>
            <ul className="mt-4 space-y-4">
              <li>
                <Link to="/about" className="text-base text-gray-500 hover:text-gray-900">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/careers" className="text-base text-gray-500 hover:text-gray-900">
                  Careers
                </Link>
              </li>
              <li>
                <Link to="/press" className="text-base text-gray-500 hover:text-gray-900">
                  Press
                </Link>
              </li>
            </ul>
          </div>
          <div className="md:col-span-1">
            <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">
              Support
            </h3>
            <ul className="mt-4 space-y-4">
              <li>
                <Link to="/help" className="text-base text-gray-500 hover:text-gray-900">
                  Help Center
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-base text-gray-500 hover:text-gray-900">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-base text-gray-500 hover:text-gray-900">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>
          <div className="md:col-span-1">
            <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">
              Legal
            </h3>
            <ul className="mt-4 space-y-4">
              <li>
                <Link to="/privacy" className="text-base text-gray-500 hover:text-gray-900">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-base text-gray-500 hover:text-gray-900">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/cookie-policy" className="text-base text-gray-500 hover:text-gray-900">
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-12 border-t border-gray-200 pt-8">
          <p className="text-sm text-gray-400 text-center">
            &copy; {currentYear} Wanderlust Hotels. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
