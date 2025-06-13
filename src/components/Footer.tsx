import { Link } from 'react-router-dom';
import Logo from './Logo';
import { Instagram, Twitter, Facebook, Mail } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-white pt-12 pb-6">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <Logo />
              <span className="text-xl font-bold text-white">RentMate</span>
            </div>
            <p className="text-slate-400 mb-4">
              Connecting students and bachelors to share and rent items locally across India.
            </p>
            <div className="flex space-x-4">
              <a href="https://instagram.com" className="text-slate-400 hover:text-white transition" aria-label="Instagram">
                <Instagram size={20} />
              </a>
              <a href="https://twitter.com" className="text-slate-400 hover:text-white transition" aria-label="Twitter">
                <Twitter size={20} />
              </a>
              <a href="https://facebook.com" className="text-slate-400 hover:text-white transition" aria-label="Facebook">
                <Facebook size={20} />
              </a>
              <a href="mailto:info@rentmate.com" className="text-slate-400 hover:text-white transition" aria-label="Email">
                <Mail size={20} />
              </a>
            </div>
          </div>
          
          {/* Quick Links */}
          <div className="col-span-1">
            <h4 className="text-lg font-semibold mb-4 text-white">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-slate-400 hover:text-white transition">Home</Link>
              </li>
              <li>
                <Link to="/browse" className="text-slate-400 hover:text-white transition">Browse Items</Link>
              </li>
              <li>
                <Link to="/list-item" className="text-slate-400 hover:text-white transition">List an Item</Link>
              </li>
              <li>
                <Link to="/dashboard" className="text-slate-400 hover:text-white transition">Dashboard</Link>
              </li>
            </ul>
          </div>
          
          {/* Support */}
          <div className="col-span-1">
            <h4 className="text-lg font-semibold mb-4 text-white">Support</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/help" className="text-slate-400 hover:text-white transition">Help Center</Link>
              </li>
              <li>
                <Link to="/safety" className="text-slate-400 hover:text-white transition">Safety Tips</Link>
              </li>
              <li>
                <Link to="/contact" className="text-slate-400 hover:text-white transition">Contact Us</Link>
              </li>
              <li>
                <Link to="/faq" className="text-slate-400 hover:text-white transition">FAQs</Link>
              </li>
            </ul>
          </div>
          
          {/* Legal */}
          <div className="col-span-1">
            <h4 className="text-lg font-semibold mb-4 text-white">Legal</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/terms" className="text-slate-400 hover:text-white transition">Terms of Service</Link>
              </li>
              <li>
                <Link to="/privacy" className="text-slate-400 hover:text-white transition">Privacy Policy</Link>
              </li>
              <li>
                <Link to="/cookies" className="text-slate-400 hover:text-white transition">Cookie Policy</Link>
              </li>
              <li>
                <Link to="/refund" className="text-slate-400 hover:text-white transition">Refund Policy</Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-slate-800 mt-8 pt-6 text-slate-400 text-sm flex flex-col md:flex-row justify-between">
          <p>&copy; {new Date().getFullYear()} RentMate. All rights reserved.</p>
          <p className="mt-2 md:mt-0">Made with ❤️ for students across India</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;