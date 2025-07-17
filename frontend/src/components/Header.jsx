import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTheme } from '../hooks/useTheme';
import { useThemeToggle } from '../hooks/useThemeToggle';
import { useAuth } from '../hooks/useAuth';
import {
  User,
  LogOut,
  Heart,
  Settings,
  Menu,
  X,
  ChevronDown,
  Search,
  Sun,
  Moon
} from 'lucide-react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { isTamil, toggleLanguage } = useTheme();
  const { isDark, toggleTheme } = useThemeToggle();
  const { user, isAuthenticated, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const profileRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    logout();
    setIsProfileOpen(false);
    navigate('/');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  const navItems = [
    { name: 'அறம்', nameEn: 'Virtue', path: '/category/அறம்' },
    { name: 'பொருள்', nameEn: 'Wealth', path: '/category/பொருள்' },
    { name: 'இன்பம்', nameEn: 'Love', path: '/category/இன்பம்' }
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-sandalwood-500/30 bg-manuscript-50/95 backdrop-blur-sm shadow-sm">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">

          {/* Left - Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-sandalwood-500 rounded-lg flex items-center justify-center border border-sandalwood-600 shadow-sm">
              <span className="text-white font-bold text-sm font-catamaran-bold">குறள்</span>
            </div>
            <Link to="/" className={`text-2xl font-bold text-tamil-800 tracking-wider font-catamaran-bold ${isTamil ? 'font-catamaran-bold' : 'font-catamaran-bold'}`}>
              {isTamil ? 'குறள்VERSE' : 'KuralVerse'}
            </Link>
          </div>

          {/* Center - Nav Links and Search */}
          <div className="hidden md:flex items-center space-x-6">
            <nav className="flex items-center space-x-6">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                    isActive(item.path)
                      ? 'text-tamil-800 bg-manuscript-100 border border-sandalwood-300'
                      : 'text-tamil-700 hover:text-sandalwood-500 hover:bg-manuscript-100/50'
                  } ${isTamil ? 'font-catamaran-medium' : 'font-catamaran-medium'}`}
                >
                  <span className="mr-1">
                    {item.name === 'அறம்' && '🪔'}
                    {item.name === 'பொருள்' && '👑'}
                    {item.name === 'இன்பம்' && '❤️'}
                  </span>
                  {isTamil ? item.name : item.nameEn}
                </Link>
              ))}
            </nav>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-sandalwood-600 w-4 h-4 z-10" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={isTamil ? 'குறள் தேடுங்கள்...' : 'Search Kurals...'}
                className="max-w-sm w-80 pl-10 pr-4 py-2 text-sm border-2 border-sandalwood-500 rounded-lg bg-manuscript-50 text-tamil-800 placeholder-sandalwood-600 focus:outline-none focus:ring-2 focus:ring-saffron-500 focus:border-saffron-500 font-catamaran shadow-sm"
                style={{ paddingLeft: '36px', maxWidth: '400px' }}
              />
            </form>
          </div>

          {/* Right - Toggles & Profile */}
          <div className="flex items-center space-x-3">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="hidden sm:flex items-center justify-center w-9 h-9 rounded-md text-sandalwood-600 hover:text-saffron-600 hover:bg-manuscript-100 transition-all duration-200 border border-transparent hover:border-sandalwood-300"
              title={isDark ? (isTamil ? 'வெளிச்ச பயன்முறை' : 'Light Mode') : (isTamil ? 'இருள் பயன்முறை' : 'Dark Mode')}
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Language Toggle */}
            <button
              onClick={toggleLanguage}
              className={`hidden sm:flex items-center px-3 py-2 rounded-md text-sm font-medium text-tamil-700 hover:text-sandalwood-500 hover:bg-manuscript-100 transition-all duration-200 border border-transparent hover:border-sandalwood-300 font-catamaran-medium`}
              title={isTamil ? 'Switch to English' : 'தமிழில் மாற்று'}
            >
              {isTamil ? 'EN' : 'தமிழ்'}
            </button>

            {/* Auth section */}
            {isAuthenticated() ? (
              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center space-x-2 px-3 py-2 rounded-md border border-transparent hover:bg-manuscript-100 hover:border-sandalwood-300 transition-all duration-200"
                >
                  <div className="w-8 h-8 bg-sandalwood-500 rounded-full flex items-center justify-center shadow-sm">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <span className="hidden sm:block text-sm font-medium text-tamil-700 max-w-24 truncate font-catamaran">
                    {user?.name || user?.email}
                  </span>
                  <ChevronDown className={`w-4 h-4 text-tamil-600 ${isProfileOpen ? 'rotate-180' : ''} transition-transform`} />
                </button>

                {isProfileOpen && (
                  <div className="absolute right-0 top-full mt-2 w-48 bg-manuscript-50 rounded-lg shadow-lg border-2 border-sandalwood-500 py-2 z-50" style={{ minWidth: '180px' }}>
                    <Link
                      to="/profile"
                      className={`flex items-center px-4 py-3 text-sm text-tamil-700 hover:bg-sandalwood-100 transition-colors duration-200 font-catamaran`}
                      onClick={() => setIsProfileOpen(false)}
                    >
                      <Settings className="w-4 h-4 mr-3 text-sandalwood-600" />
                      {isTamil ? 'சுயவிவரம்' : 'Profile'}
                    </Link>
                    <Link
                      to="/favorites"
                      className={`flex items-center px-4 py-3 text-sm text-tamil-700 hover:bg-sandalwood-100 transition-colors duration-200 font-catamaran`}
                      onClick={() => setIsProfileOpen(false)}
                    >
                      <Heart className="w-4 h-4 mr-3 text-sandalwood-600" />
                      {isTamil ? 'விருப்பங்கள்' : 'Favorites'}
                    </Link>
                    <hr className="my-2 border-sandalwood-400" />
                    <button
                      onClick={handleLogout}
                      className={`flex items-center w-full px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200 font-catamaran`}
                    >
                      <LogOut className="w-4 h-4 mr-3" />
                      {isTamil ? 'வெளியேறு' : 'Logout'}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className={`px-4 py-2 text-sm font-medium text-tamil-700 hover:text-sandalwood-500 hover:bg-manuscript-100 rounded-md transition-all duration-200 border border-transparent hover:border-sandalwood-300 font-catamaran`}
                >
                  {isTamil ? 'உள்நுழை' : 'Login'}
                </Link>
                <Link
                  to="/register"
                  className={`px-4 py-2 text-sm font-medium bg-sandalwood-500 text-white rounded-md hover:bg-sandalwood-600 transition-all duration-200 shadow-sm hover:shadow-md border border-sandalwood-600 font-catamaran-medium`}
                >
                  {isTamil ? 'பதிவு செய்' : 'Register'}
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-md text-tamil-700 hover:text-sandalwood-500 hover:bg-manuscript-100 transition-colors"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-sandalwood-300 bg-manuscript-50">
            <div className="px-4 py-4 space-y-3">
              {/* Mobile Search */}
              <form onSubmit={handleSearch} className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-sandalwood-600 w-4 h-4 z-10" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={isTamil ? 'குறள் தேடுங்கள்...' : 'Search Kurals...'}
                  className="w-full pl-10 pr-4 py-2 text-sm border-2 border-sandalwood-500 rounded-lg bg-manuscript-50 text-tamil-800 placeholder-sandalwood-600 focus:outline-none focus:ring-2 focus:ring-saffron-500 focus:border-saffron-500 font-catamaran shadow-sm"
                  style={{ paddingLeft: '36px' }}
                />
              </form>

              {/* Mobile Navigation */}
              <nav className="space-y-2">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`block px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive(item.path)
                        ? 'text-tamil-800 bg-manuscript-100 border border-sandalwood-300'
                        : 'text-tamil-700 hover:text-sandalwood-500 hover:bg-manuscript-100/50'
                    } font-catamaran-medium`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <span className="mr-2">
                      {item.name === 'அறம்' && '🪔'}
                      {item.name === 'பொருள்' && '👑'}
                      {item.name === 'இன்பம்' && '❤️'}
                    </span>
                    {isTamil ? item.name : item.nameEn}
                  </Link>
                ))}
              </nav>

              {/* Mobile Toggles */}
              <div className="flex space-x-2">
                <button
                  onClick={toggleTheme}
                  className="flex items-center justify-center w-full px-3 py-2 rounded-md text-sm font-medium text-tamil-700 hover:text-sandalwood-500 hover:bg-manuscript-100 transition-colors font-catamaran-medium"
                >
                  {isDark ? <Sun className="w-4 h-4 mr-2" /> : <Moon className="w-4 h-4 mr-2" />}
                  {isDark ? (isTamil ? 'வெளிச்ச பயன்முறை' : 'Light Mode') : (isTamil ? 'இருள் பயன்முறை' : 'Dark Mode')}
                </button>
                <button
                  onClick={toggleLanguage}
                  className="flex items-center justify-center w-full px-3 py-2 rounded-md text-sm font-medium text-tamil-700 hover:text-sandalwood-500 hover:bg-manuscript-100 transition-colors font-catamaran-medium"
                >
                  {isTamil ? 'Switch to English' : 'தமிழில் மாற்று'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
