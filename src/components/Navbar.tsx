import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, LogOut, User, UserPlus, LogIn, Package, LayoutDashboard } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import Logo from './Logo';

const Navbar = () => {
  const { currentUser, isAdmin, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
      setIsMenuOpen(false);
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };

  return (
    <nav className="bg-white sticky top-0 z-50 shadow-sm">
      <div className="container-custom">
        <div className="flex justify-between items-center py-4">
          <Link to="/" className="flex items-center space-x-2">
            <Logo />
            <span className="text-xl font-bold text-primary-500">RentMate</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            <Link to="/browse" className="px-3 py-2 text-slate-700 hover:text-primary-500 transition">
              Browse Items
            </Link>
            
            {currentUser ? (
              <>
                <Link to="/list-item" className="px-3 py-2 text-slate-700 hover:text-primary-500 transition">
                  List an Item
                </Link>
                <Link to="/dashboard" className="px-3 py-2 text-slate-700 hover:text-primary-500 transition">
                  Dashboard
                </Link>
                {isAdmin && (
                  <Link to="/admin" className="px-3 py-2 text-slate-700 hover:text-primary-500 transition">
                    Admin
                  </Link>
                )}
                <button 
                  onClick={handleLogout}
                  className="btn btn-secondary"
                >
                  <LogOut size={18} className="mr-1" />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn btn-secondary">
                  <LogIn size={18} className="mr-1" />
                  Login
                </Link>
                <Link to="/signup" className="btn btn-primary">
                  <UserPlus size={18} className="mr-1" />
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-slate-700 hover:text-primary-500"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-white py-4 border-t border-slate-100 animate-fade-in">
          <div className="container-custom flex flex-col space-y-3">
            <Link 
              to="/browse" 
              className="flex items-center px-3 py-2 text-slate-700 hover:text-primary-500 hover:bg-slate-50 rounded-lg"
              onClick={() => setIsMenuOpen(false)}
            >
              <Package size={18} className="mr-2" />
              Browse Items
            </Link>
            
            {currentUser ? (
              <>
                <Link 
                  to="/list-item" 
                  className="flex items-center px-3 py-2 text-slate-700 hover:text-primary-500 hover:bg-slate-50 rounded-lg"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Package size={18} className="mr-2" />
                  List an Item
                </Link>
                <Link 
                  to="/dashboard" 
                  className="flex items-center px-3 py-2 text-slate-700 hover:text-primary-500 hover:bg-slate-50 rounded-lg"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <LayoutDashboard size={18} className="mr-2" />
                  Dashboard
                </Link>
                {isAdmin && (
                  <Link 
                    to="/admin" 
                    className="flex items-center px-3 py-2 text-slate-700 hover:text-primary-500 hover:bg-slate-50 rounded-lg"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <User size={18} className="mr-2" />
                    Admin
                  </Link>
                )}
                <button 
                  onClick={handleLogout}
                  className="flex items-center px-3 py-2 text-red-500 hover:bg-red-50 rounded-lg"
                >
                  <LogOut size={18} className="mr-2" />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className="flex items-center px-3 py-2 text-slate-700 hover:text-primary-500 hover:bg-slate-50 rounded-lg"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <LogIn size={18} className="mr-2" />
                  Login
                </Link>
                <Link 
                  to="/signup" 
                  className="flex items-center px-3 py-2 text-primary-500 hover:bg-primary-50 rounded-lg"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <UserPlus size={18} className="mr-2" />
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;