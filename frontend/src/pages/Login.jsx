import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../hooks/useTheme';
import LoadingSpinner from '../components/LoadingSpinner';
import { Eye, EyeOff, Mail, Lock, AlertCircle } from 'lucide-react';

const Login = () => {
  const [formData, setFormData] = useState({
    identifier: '', // email or username
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const { login, loading, error, clearError } = useAuth();
  const { isTamil } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Clear field error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }

    // Clear global error
    if (error) {
      clearError();
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.identifier.trim()) {
      newErrors.identifier = isTamil
        ? 'மின்னஞ்சல் அல்லது பயனர்பெயர் தேவை'
        : 'Email or username is required';
    }

    if (!formData.password) {
      newErrors.password = isTamil
        ? 'கடவுச்சொல் தேவை'
        : 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const result = await login(formData);

    if (result.success) {
      navigate(from, { replace: true });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center space-x-2 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-secondary-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">குறள்</span>
            </div>
            <span className="text-2xl font-bold gradient-text">
              {isTamil ? 'குறள்வெர்ஸ்' : 'KuralVerse'}
            </span>
          </Link>

          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {isTamil ? 'உள்நுழைவு' : 'Welcome Back'}
          </h1>
          <p className="text-muted-foreground">
            {isTamil
              ? 'உங்கள் கணக்கில் உள்நுழைந்து தொடருங்கள்'
              : 'Sign in to your account to continue'
            }
          </p>
        </div>

        {/* Login Form */}
        <div className="card">
          <div className="card-content">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Global Error */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-md p-4">
                  <div className="flex items-center">
                    <AlertCircle className="w-5 h-5 text-red-400 mr-2" />
                    <span className="text-sm text-red-800">{error}</span>
                  </div>
                </div>
              )}

              {/* Email/Username Field */}
              <div>
                <label htmlFor="identifier" className="block text-sm font-medium text-gray-700 mb-2">
                  {isTamil ? 'மின்னஞ்சல் அல்லது பயனர்பெயர்' : 'Email or Username'}
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    id="identifier"
                    name="identifier"
                    type="text"
                    value={formData.identifier}
                    onChange={handleChange}
                    className={`input pl-10 w-full ${errors.identifier ? 'border-red-300' : ''}`}
                    placeholder={isTamil ? 'உங்கள் மின்னஞ்சல் அல்லது பயனர்பெயர்' : 'Your email or username'}
                  />
                </div>
                {errors.identifier && (
                  <p className="mt-1 text-sm text-red-600">{errors.identifier}</p>
                )}
              </div>

              {/* Password Field */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  {isTamil ? 'கடவுச்சொல்' : 'Password'}
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={handleChange}
                    className={`input pl-10 pr-10 w-full ${errors.password ? 'border-red-300' : ''}`}
                    placeholder={isTamil ? 'உங்கள் கடவுச்சொல்' : 'Your password'}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                )}
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                    {isTamil ? 'என்னை நினைவில் வைத்துக்கொள்' : 'Remember me'}
                  </label>
                </div>

                <div className="text-sm">
                  <Link to="/forgot-password" className="font-medium text-primary-600 hover:text-primary-500">
                    {isTamil ? 'கடவுச்சொல் மறந்துவிட்டதா?' : 'Forgot your password?'}
                  </Link>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="btn-primary btn-lg w-full"
              >
                {loading ? (
                  <LoadingSpinner size="sm" />
                ) : (
                  isTamil ? 'உள்நுழை' : 'Sign In'
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Sign Up Link */}
        <div className="text-center mt-6">
          <p className="text-sm text-gray-600">
            {isTamil ? 'கணக்கு இல்லையா? ' : "Don't have an account? "}
            <Link to="/register" className="font-medium text-primary-600 hover:text-primary-500">
              {isTamil ? 'பதிவு செய்யுங்கள்' : 'Sign up'}
            </Link>
          </p>
        </div>

        {/* Guest Access */}
        <div className="text-center mt-4">
          <p className="text-xs text-gray-500 mb-2">
            {isTamil ? 'அல்லது விருந்தினராக தொடருங்கள்' : 'Or continue as guest'}
          </p>
          <Link to="/" className="btn-ghost btn-sm">
            {isTamil ? 'குறள்களை ஆராயுங்கள்' : 'Explore Kurals'}
          </Link>
        </div>

        {/* Info */}
        <div className="mt-8 text-center">
          <p className="text-xs text-gray-500">
            {isTamil ? (
              <>
                உள்நுழைவு தேவையில்லை குறள்களைப் படிக்க.<br />
                கருத்துகள் மற்றும் விருப்பங்களுக்கு மட்டுமே கணக்கு தேவை.
              </>
            ) : (
              <>
                No login required to read Kurals.<br />
                Account needed only for comments and favorites.
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
