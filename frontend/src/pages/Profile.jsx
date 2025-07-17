import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../hooks/useTheme';
import { userAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import {
  User,
  Mail,
  Calendar,
  Heart,
  MessageCircle,
  BookOpen,
  Settings,
  Edit3,
  Save,
  X,
  Shield
} from 'lucide-react';

const Profile = () => {
  const { user, updateProfile, loading: authLoading } = useAuth();
  const { isTamil } = useTheme();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    bio: '',
    preferredLanguage: 'english',
    dailyKuralNotification: true,
    emailNotifications: true,
    theme: 'auto'
  });

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.profile?.firstName || '',
        lastName: user.profile?.lastName || '',
        bio: user.profile?.bio || '',
        preferredLanguage: user.profile?.preferredLanguage || 'english',
        dailyKuralNotification: user.preferences?.dailyKuralNotification ?? true,
        emailNotifications: user.preferences?.emailNotifications ?? true,
        theme: user.preferences?.theme || 'auto'
      });
      fetchUserStats();
    }
  }, [user]);

  const fetchUserStats = async () => {
    try {
      const response = await userAPI.getUserStats();
      setStats(response.data.data);
    } catch (error) {
      console.error('Failed to fetch user stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSave = async () => {
    const result = await updateProfile(formData);
    if (result.success) {
      setEditing(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      firstName: user.profile?.firstName || '',
      lastName: user.profile?.lastName || '',
      bio: user.profile?.bio || '',
      preferredLanguage: user.profile?.preferredLanguage || 'english',
      dailyKuralNotification: user.preferences?.dailyKuralNotification ?? true,
      emailNotifications: user.preferences?.emailNotifications ?? true,
      theme: user.preferences?.theme || 'auto'
    });
    setEditing(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" text={isTamil ? 'ஏற்றுகிறது...' : 'Loading...'} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold gradient-text mb-4">
            {isTamil ? 'சுயவிவரம்' : 'Profile'}
          </h1>
          <p className="text-muted-foreground">
            {isTamil ? 'உங்கள் கணக்கு மற்றும் விருப்பங்களை நிர்வகிக்கவும்' : 'Manage your account and preferences'}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Info Card */}
            <div className="card">
              <div className="card-header">
                <div className="flex justify-between items-center">
                  <h2 className="card-title flex items-center">
                    <User className="w-5 h-5 mr-2" />
                    {isTamil ? 'அடிப்படை தகவல்' : 'Basic Information'}
                  </h2>
                  {!editing ? (
                    <button
                      onClick={() => setEditing(true)}
                      className="btn-ghost btn-sm"
                    >
                      <Edit3 className="w-4 h-4 mr-2" />
                      {isTamil ? 'திருத்து' : 'Edit'}
                    </button>
                  ) : (
                    <div className="flex space-x-2">
                      <button
                        onClick={handleSave}
                        disabled={authLoading}
                        className="btn-primary btn-sm"
                      >
                        <Save className="w-4 h-4 mr-2" />
                        {isTamil ? 'சேமி' : 'Save'}
                      </button>
                      <button
                        onClick={handleCancel}
                        className="btn-ghost btn-sm"
                      >
                        <X className="w-4 h-4 mr-2" />
                        {isTamil ? 'ரத்து' : 'Cancel'}
                      </button>
                    </div>
                  )}
                </div>
              </div>
              <div className="card-content">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Username (Read-only) */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      {isTamil ? 'பயனர்பெயர்' : 'Username'}
                    </label>
                    <div className="input bg-gray-50 text-gray-500">
                      {user?.username}
                    </div>
                  </div>

                  {/* Email (Read-only) */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      {isTamil ? 'மின்னஞ்சல்' : 'Email'}
                    </label>
                    <div className="input bg-gray-50 text-gray-500 flex items-center">
                      <Mail className="w-4 h-4 mr-2" />
                      {user?.email}
                    </div>
                  </div>

                  {/* First Name */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      {isTamil ? 'முதல் பெயர்' : 'First Name'}
                    </label>
                    {editing ? (
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        className="input w-full"
                        placeholder={isTamil ? 'முதல் பெயர்' : 'First name'}
                      />
                    ) : (
                      <div className="input bg-gray-50">
                        {user?.profile?.firstName || '-'}
                      </div>
                    )}
                  </div>

                  {/* Last Name */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      {isTamil ? 'கடைசி பெயர்' : 'Last Name'}
                    </label>
                    {editing ? (
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        className="input w-full"
                        placeholder={isTamil ? 'கடைசி பெயர்' : 'Last name'}
                      />
                    ) : (
                      <div className="input bg-gray-50">
                        {user?.profile?.lastName || '-'}
                      </div>
                    )}
                  </div>
                </div>

                {/* Bio */}
                <div className="mt-6">
                  <label className="block text-sm font-medium mb-2">
                    {isTamil ? 'சுயவிவரம்' : 'Bio'}
                  </label>
                  {editing ? (
                    <textarea
                      name="bio"
                      value={formData.bio}
                      onChange={handleChange}
                      rows="3"
                      className="textarea w-full"
                      placeholder={isTamil ? 'உங்களைப் பற்றி சொல்லுங்கள்...' : 'Tell us about yourself...'}
                    />
                  ) : (
                    <div className="input bg-gray-50 min-h-[80px]">
                      {user?.profile?.bio || (isTamil ? 'சுயவிவரம் இல்லை' : 'No bio added')}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Preferences Card */}
            <div className="card">
              <div className="card-header">
                <h2 className="card-title flex items-center">
                  <Settings className="w-5 h-5 mr-2" />
                  {isTamil ? 'விருப்பங்கள்' : 'Preferences'}
                </h2>
              </div>
              <div className="card-content space-y-6">
                {/* Language Preference */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    {isTamil ? 'விருப்பமான மொழி' : 'Preferred Language'}
                  </label>
                  {editing ? (
                    <select
                      name="preferredLanguage"
                      value={formData.preferredLanguage}
                      onChange={handleChange}
                      className="input w-full"
                    >
                      <option value="english">{isTamil ? 'ஆங்கிலம்' : 'English'}</option>
                      <option value="tamil">{isTamil ? 'தமிழ்' : 'Tamil'}</option>
                    </select>
                  ) : (
                    <div className="input bg-gray-50">
                      {user?.profile?.preferredLanguage === 'tamil'
                        ? (isTamil ? 'தமிழ்' : 'Tamil')
                        : (isTamil ? 'ஆங்கிலம்' : 'English')
                      }
                    </div>
                  )}
                </div>

                {/* Theme Preference */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    {isTamil ? 'தீம்' : 'Theme'}
                  </label>
                  {editing ? (
                    <select
                      name="theme"
                      value={formData.theme}
                      onChange={handleChange}
                      className="input w-full"
                    >
                      <option value="light">{isTamil ? 'வெளிச்சம்' : 'Light'}</option>
                      <option value="dark">{isTamil ? 'இருள்' : 'Dark'}</option>
                      <option value="auto">{isTamil ? 'தானியங்கி' : 'Auto'}</option>
                    </select>
                  ) : (
                    <div className="input bg-gray-50">
                      {user?.preferences?.theme === 'light'
                        ? (isTamil ? 'வெளிச்சம்' : 'Light')
                        : user?.preferences?.theme === 'dark'
                        ? (isTamil ? 'இருள்' : 'Dark')
                        : (isTamil ? 'தானியங்கி' : 'Auto')
                      }
                    </div>
                  )}
                </div>

                {/* Notifications */}
                <div className="space-y-4">
                  <h3 className="font-medium">
                    {isTamil ? 'அறிவிப்புகள்' : 'Notifications'}
                  </h3>

                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-sm">
                        {isTamil ? 'தினசரி குறள்' : 'Daily Kural'}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {isTamil ? 'தினசரி குறள் அறிவிப்புகள் பெறுங்கள்' : 'Receive daily Kural notifications'}
                      </div>
                    </div>
                    {editing ? (
                      <input
                        type="checkbox"
                        name="dailyKuralNotification"
                        checked={formData.dailyKuralNotification}
                        onChange={handleChange}
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                      />
                    ) : (
                      <div className={`w-4 h-4 rounded ${user?.preferences?.dailyKuralNotification ? 'bg-primary-600' : 'bg-gray-300'}`} />
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-sm">
                        {isTamil ? 'மின்னஞ்சல் அறிவிப்புகள்' : 'Email Notifications'}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {isTamil ? 'புதிய அம்சங்கள் மற்றும் புதுப்பிப்புகள்' : 'New features and updates'}
                      </div>
                    </div>
                    {editing ? (
                      <input
                        type="checkbox"
                        name="emailNotifications"
                        checked={formData.emailNotifications}
                        onChange={handleChange}
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                      />
                    ) : (
                      <div className={`w-4 h-4 rounded ${user?.preferences?.emailNotifications ? 'bg-primary-600' : 'bg-gray-300'}`} />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Account Stats */}
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">
                  {isTamil ? 'கணக்கு புள்ளிவிவரங்கள்' : 'Account Stats'}
                </h3>
              </div>
              <div className="card-content space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Heart className="w-4 h-4 text-red-500 mr-2" />
                    <span className="text-sm">{isTamil ? 'விருப்பங்கள்' : 'Favorites'}</span>
                  </div>
                  <span className="font-semibold">{stats?.totalFavorites || 0}</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <MessageCircle className="w-4 h-4 text-blue-500 mr-2" />
                    <span className="text-sm">{isTamil ? 'கருத்துகள்' : 'Comments'}</span>
                  </div>
                  <span className="font-semibold">{stats?.totalComments || 0}</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <BookOpen className="w-4 h-4 text-green-500 mr-2" />
                    <span className="text-sm">{isTamil ? 'படித்த குறள்கள்' : 'Read Kurals'}</span>
                  </div>
                  <span className="font-semibold">{stats?.totalReadKurals || 0}</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 text-purple-500 mr-2" />
                    <span className="text-sm">{isTamil ? 'உள்நுழைவுகள்' : 'Logins'}</span>
                  </div>
                  <span className="font-semibold">{stats?.loginCount || 0}</span>
                </div>
              </div>
            </div>

            {/* Member Since */}
            <div className="card">
              <div className="card-content text-center">
                <Calendar className="w-12 h-12 text-primary-600 mx-auto mb-3" />
                <h4 className="font-semibold mb-2">
                  {isTamil ? 'உறுப்பினர் ஆன தேதி' : 'Member Since'}
                </h4>
                <p className="text-sm text-muted-foreground">
                  {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : '-'}
                </p>
              </div>
            </div>

            {/* Reading Progress */}
            {stats?.readingProgress && (
              <div className="card">
                <div className="card-header">
                  <h3 className="card-title">
                    {isTamil ? 'வாசிப்பு முன்னேற்றம்' : 'Reading Progress'}
                  </h3>
                </div>
                <div className="card-content space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>{isTamil ? 'அறம்' : 'Virtue'}</span>
                      <span>{stats.readingProgress.aram}/380</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-500 h-2 rounded-full"
                        style={{ width: `${(stats.readingProgress.aram / 380) * 100}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>{isTamil ? 'பொருள்' : 'Wealth'}</span>
                      <span>{stats.readingProgress.porul}/700</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-yellow-500 h-2 rounded-full"
                        style={{ width: `${(stats.readingProgress.porul / 700) * 100}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>{isTamil ? 'இன்பம்' : 'Love'}</span>
                      <span>{stats.readingProgress.inbam}/250</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-pink-500 h-2 rounded-full"
                        style={{ width: `${(stats.readingProgress.inbam / 250) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
