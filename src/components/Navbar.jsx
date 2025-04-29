import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '@/components/ui/Button';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md shadow-sm">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Name */}
          <div
            className="flex items-center cursor-pointer"
            onClick={() => navigate('/')}
          >
            <img
              src={"../src/assets/OP-LOGO-(NAVBAR).png"}
              alt="Ominiprop Logo"
              className="h-10 w-10 mr-3" // Adjust size and spacing
            />
            <span className="text-primary text-xl font-bold">OMNIPROP</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-8">
              {['Home', 'Search', 'Features' ].map((item, index) => (
                <span
                  key={index}
                  onClick={() => navigate(item === 'Home' ? '/' : `/${item.toLowerCase()}`)}
                  className="cursor-pointer text-gray-600 hover:text-secondary transition-colors"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>

          {/* Call to action buttons */}
          {!user ? (
            <div className="hidden md:block">
              <div className="flex items-center space-x-4">
                <Button variant="ghost" onClick={() => navigate('/login')}>
                  Login
                </Button>
                <Button
                  onClick={() => navigate('/register')}
                  className="bg-primary hover:bg-primary/90 text-white"
                >
                  Sign up
                </Button>
              </div>
            </div>
          ) : (
            <div className="hidden md:block">
              <div className="flex items-center space-x-4">
                <Button variant="ghost" onClick={() => navigate('/dashboard')}>
                  My Dashboard
                </Button>
                <Button
                  onClick={logout}
                  className="bg-primary hover:bg-primary/90 text-white"
                >
                  Logout
                </Button>
              </div>
            </div>
          )}

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button className="text-gray-600 hover:text-estate-primary">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="h-6 w-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;