import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '@/components/ui/Button';
import { AuthContext } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';

const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);
  const { language, changeLanguage } = useLanguage();
  const { t } = useTranslation();

  const toggleLanguage = () => {
    changeLanguage(language === 'en' ? 'hi' : 'en');
  };

  // Common button style for consistent sizing
  const buttonClass = "min-w-[100px] h-[38px] flex items-center justify-center";

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white shadow">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Name */}
          <div
            className="flex items-center cursor-pointer"
            onClick={() => navigate('/')}
          >
            <img
              src="/OP-LOGO-(NAVBAR).png"
              alt="Omniprop Logo"
              className="h-10 w-10 mr-3"
            />
            <span className="font-bold text-xl">OMNIPROP</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-8">
              {[
                { key: 'home', path: '/' },
                { key: 'search', path: '/search' },
                { key: 'features', path: '/features' }
              ].map((item, index) => (
                <span
                  key={index}
                  onClick={() => navigate(item.path)}
                  className="cursor-pointer hover:opacity-75 transition-opacity"
                >
                  {t(`navbar.${item.key}`)}
                </span>
              ))}
            </div>
          </div>

          {/* Call to action buttons */}
          {!user ? (
            <div className="hidden md:block">
              <div className="flex items-center space-x-4">
                <Button 
                  onClick={toggleLanguage}
                  className={`${buttonClass}`}
                >
                  <Globe className="h-4 w-4 mr-1" />
                  {t('common.changeLang')}
                </Button>
                <Button 
                  onClick={() => navigate('/login')}
                  className={buttonClass}
                >
                  {t('navbar.login')}
                </Button>
                <Button
                  onClick={() => navigate('/register')}
                  className={buttonClass}
                >
                  {t('navbar.signup')}
                </Button>
              </div>
            </div>
          ) : (
            <div className="hidden md:block">
              <div className="flex items-center space-x-4">
                <Button 
                  onClick={toggleLanguage}
                  className={`${buttonClass}`}
                >
                  <Globe className="h-4 w-4 mr-1" />
                  {t('common.changeLang')}
                </Button>
                <Button 
                  onClick={() => navigate('/dashboard')}
                  className={buttonClass}
                >
                  {t('navbar.dashboard')}
                </Button>
                <Button
                  onClick={logout}
                  className={buttonClass}
                >
                  {t('navbar.logout')}
                </Button>
              </div>
            </div>
          )}

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button 
              onClick={toggleLanguage}
              className="mr-4 h-[38px] w-[38px] flex items-center justify-center"
            >
              <Globe className="h-5 w-5" />
            </button>
            <button className="hover:opacity-75 h-[38px] w-[38px] flex items-center justify-center">
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