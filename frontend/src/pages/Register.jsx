import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../hooks/useTheme';
import LoadingSpinner from '../components/LoadingSpinner';
import { Eye, EyeOff, Mail, Lock, User, AlertCircle, CheckCircle } from 'lucide-react';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    preferredLanguage: 'english'
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [passwordStrength, setPasswordStrength] = useState(0);

  const { register, loading, error, clearError } = useAuth();
  const { isTamil } = useTheme();
  const navigate = useNavigate();

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

    // Check password strength
    if (name === 'password') {
      setPasswordStrength(calculatePasswordStrength(value));
    }
  };

  const calculatePasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 6) strength++;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    return Math.min(strength, 4);
  };

  const getPasswordStrengthText = () => {
    const texts = {
      0: { en: 'Very Weak', ta: 'மிகவும் பலவீனம்', color: 'text-red-600' },
      1: { en: 'Weak', ta: 'பலவீனம்', color: 'text-red-500' },
      2: { en: 'Fair', ta: 'சராசரி', color: 'text-yellow-500' },
      3: { en: 'Good', ta: 'நல்லது', color: 'text-blue-500' },
      4: { en: 'Strong', ta: 'வலுவானது', color: 'text-green-500' }
    };
    return texts[passwordStrength] || texts[0];
  };

  const validateForm = () => {
    const newErrors = {};

    // Username validation
    if (!formData.username.trim()) {
      newErrors.username = isTamil ? 'பயனர்பெயர் தேவை' : 'Username is required';
    } else if (formData.username.length < 3) {
      newErrors.username = isTamil ? 'பயனர்பெயர் குறைந்தது 3 எழுத்துகள் இருக்க வேண்டும்' : 'Username must be at least 3 characters';
    } else if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
      newErrors.username = isTamil ? 'பயனர்பெயரில் எழுத்துகள், எண்கள் மற்றும் _ மட்டுமே அனுமதிக்கப்படும்' : 'Username can only contain letters, numbers, and underscores';
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = isTamil ? 'மின்னஞ்சல் தேவை' : 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = isTamil ? 'சரியான மின்னஞ்சல் முகவரியை உள்ளிடவும்' : 'Please enter a valid email address';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = isTamil ? 'கடவுச்சொல் தேவை' : 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = isTamil ? 'கடவுச்சொல் குறைந்தது 6 எழுத்துகள் இருக்க வேண்டும்' : 'Password must be at least 6 characters';
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = isTamil ? 'கடவுச்சொல் உறுதிப்படுத்தல் தேவை' : 'Password confirmation is required';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = isTamil ? 'கடவுச்சொற்கள் பொருந்தவில்லை' : 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const result = await register({
      username: formData.username,
      email: formData.email,
      password: formData.password,
      firstName: formData.firstName,
      lastName: formData.lastName,
      preferredLanguage: formData.preferredLanguage
    });

    if (result.success) {
      navigate('/');
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
            {isTamil ? 'கணக்கு உருவாக்கம்' : 'Create Account'}
          </h1>
          <p className="text-muted-foreground">
            {isTamil
              ? 'திருக்குறள் பயணத்தைத் தொடங்குங்கள்'
              : 'Start your Thirukkural journey'
            }
          </p>
        </div>

        {/* Registration Form */}
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

              {/* Name Fields */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                    {isTamil ? 'முதல் பெயர்' : 'First Name'}
                  </label>
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    value={formData.firstName}
                    onChange={handleChange}
                    className="input w-full"
                    placeholder={isTamil ? 'முதல் பெயர்' : 'First name'}
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                    {isTamil ? 'கடைசி பெயர்' : 'Last Name'}
                  </label>
                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    value={formData.lastName}
                    onChange={handleChange}
                    className="input w-full"
                    placeholder={isTamil ? 'கடைசி பெயர்' : 'Last name'}
                  />
                </div>
              </div>

              {/* Username Field */}
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                  {isTamil ? 'பயனர்பெயர்' : 'Username'} *
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    id="username"
                    name="username"
                    type="text"
                    value={formData.username}
                    onChange={handleChange}
                    className={`input pl-10 w-full ${errors.username ? 'border-red-300' : ''}`}
                    placeholder={isTamil ? 'உங்கள் பயனர்பெயர்' : 'Your username'}
                  />
                </div>
                {errors.username && (
                  <p className="mt-1 text-sm text-red-600">{errors.username}</p>
                )}
              </div>

              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  {isTamil ? 'மின்னஞ்சல்' : 'Email'} *
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`input pl-10 w-full ${errors.email ? 'border-red-300' : ''}`}
                    placeholder={isTamil ? 'உங்கள் மின்னஞ்சல்' : 'Your email'}
                  />
                </div>
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                )}
              </div>

              {/* Password Field */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  {isTamil ? 'கடவுச்சொல்' : 'Password'} *
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

                {/* Password Strength */}
                {formData.password && (
                  <div className="mt-2">
                    <div className="flex items-center space-x-2">
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all duration-300 ${
                            passwordStrength === 0 ? 'bg-red-500 w-1/4' :
                            passwordStrength === 1 ? 'bg-red-400 w-2/4' :
                            passwordStrength === 2 ? 'bg-yellow-400 w-3/4' :
                            passwordStrength === 3 ? 'bg-blue-400 w-full' :
                            'bg-green-500 w-full'
                          }`}
                        />
                      </div>
                      <span className={`text-xs ${getPasswordStrengthText().color}`}>
                        {isTamil ? getPasswordStrengthText().ta : getPasswordStrengthText().en}
                      </span>
                    </div>
                  </div>
                )}

                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                )}
              </div>

              {/* Confirm Password Field */}
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                  {isTamil ? 'கடவுச்சொல் உறுதிப்படுத்தல்' : 'Confirm Password'} *
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={`input pl-10 pr-10 w-full ${errors.confirmPassword ? 'border-red-300' : ''}`}
                    placeholder={isTamil ? 'கடவுச்சொல் மீண்டும்' : 'Confirm your password'}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>

                {/* Password Match Indicator */}
                {formData.confirmPassword && (
                  <div className="mt-1 flex items-center">
                    {formData.password === formData.confirmPassword ? (
                      <div className="flex items-center text-green-600">
                        <CheckCircle className="w-4 h-4 mr-1" />
                        <span className="text-xs">
                          {isTamil ? 'கடவுச்சொற்கள் பொருந்துகின்றன' : 'Passwords match'}
                        </span>
                      </div>
                    ) : (
                      <div className="flex items-center text-red-600">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        <span className="text-xs">
                          {isTamil ? 'கடவுச்சொற்கள் பொருந்தவில்லை' : 'Passwords do not match'}
                        </span>
                      </div>
                    )}
                  </div>
                )}

                {errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
                )}
              </div>

              {/* Language Preference */}
              <div>
                <label htmlFor="preferredLanguage" className="block text-sm font-medium text-gray-700 mb-2">
                  {isTamil ? 'விருப்பமான மொழி' : 'Preferred Language'}
                </label>
                <select
                  id="preferredLanguage"
                  name="preferredLanguage"
                  value={formData.preferredLanguage}
                  onChange={handleChange}
                  className="input w-full"
                >
                  <option value="english">{isTamil ? 'ஆங்கிலம்' : 'English'}</option>
                  <option value="tamil">{isTamil ? 'தமிழ்' : 'Tamil'}</option>
                </select>
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
                  isTamil ? 'கணக்கு உருவாக்கு' : 'Create Account'
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Sign In Link */}
        <div className="text-center mt-6">
          <p className="text-sm text-gray-600">
            {isTamil ? 'ஏற்கனவே கணக்கு உள்ளதா? ' : 'Already have an account? '}
            <Link to="/login" className="font-medium text-primary-600 hover:text-primary-500">
              {isTamil ? 'உள்நுழைய' : 'Sign in'}
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
      </div>
    </div>
  );
};

export default Register;
