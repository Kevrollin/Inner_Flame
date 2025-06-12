import { Link } from 'wouter';
import Logo from './logo';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-gradient-to-t from-gray-900 via-purple-900/20 to-transparent border-t border-gray-800/50 mt-20">
      <div className="container mx-auto px-6 py-16">
        {/* Main Footer Content */}
        <div className="grid md:grid-cols-4 gap-8 mb-12">
          {/* Brand Section */}
          <div className="md:col-span-2">
            <div className="flex items-center space-x-3 mb-6">
              <Logo size="md" />
              <h3 className="text-2xl font-bold gradient-text">Inner Flame</h3>
            </div>
            <p className="text-gray-400 mb-6 max-w-md leading-relaxed">
              Transform your inner world through interactive self-discovery experiences. 
              Navigate emotional realms and unlock your potential with guided meditation, 
              educational content, and personal reflection tools.
            </p>
            <div className="flex space-x-4">
              <a 
                href="#" 
                className="w-10 h-10 rounded-full bg-gradient-to-r from-pink-500/20 to-cyan-400/20 border border-pink-500/30 flex items-center justify-center text-gray-400 hover:text-pink-400 transition-colors"
                aria-label="Twitter"
              >
                <i className="fab fa-twitter" />
              </a>
              <a 
                href="#" 
                className="w-10 h-10 rounded-full bg-gradient-to-r from-pink-500/20 to-cyan-400/20 border border-pink-500/30 flex items-center justify-center text-gray-400 hover:text-pink-400 transition-colors"
                aria-label="Instagram"
              >
                <i className="fab fa-instagram" />
              </a>
              <a 
                href="#" 
                className="w-10 h-10 rounded-full bg-gradient-to-r from-pink-500/20 to-cyan-400/20 border border-pink-500/30 flex items-center justify-center text-gray-400 hover:text-pink-400 transition-colors"
                aria-label="Discord"
              >
                <i className="fab fa-discord" />
              </a>
            </div>
          </div>

          {/* Navigation Links */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Journey</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/dashboard" className="text-gray-400 hover:text-pink-400 transition-colors">
                  Mental Realms
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="text-gray-400 hover:text-pink-400 transition-colors">
                  Reflection Journal
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-400 hover:text-pink-400 transition-colors">
                  Progress Tracking
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-400 hover:text-pink-400 transition-colors">
                  Guided Meditation
                </Link>
              </li>
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Support</h4>
            <ul className="space-y-3">
              <li>
                <Link href="#" className="text-gray-400 hover:text-pink-400 transition-colors">
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-400 hover:text-pink-400 transition-colors">
                  Community
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-400 hover:text-pink-400 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-400 hover:text-pink-400 transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800/50 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <p className="text-gray-500 text-sm mb-4 md:mb-0">
              © {currentYear} Inner Flame. All rights reserved. Made with ❤️ for mental wellness.
            </p>
            <div className="flex items-center space-x-6 text-sm">
              <Link href="#" className="text-gray-500 hover:text-pink-400 transition-colors">
                Accessibility
              </Link>
              <Link href="#" className="text-gray-500 hover:text-pink-400 transition-colors">
                Contact Us
              </Link>
              <span className="text-gray-600">|</span>
              <span className="text-gray-500">
                Wellness • Growth • Transformation
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Background decorative elements */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-pink-500/10 to-transparent rounded-full blur-xl" />
        <div className="absolute bottom-0 right-0 w-40 h-40 bg-gradient-to-br from-cyan-400/10 to-transparent rounded-full blur-xl" />
      </div>
    </footer>
  );
}