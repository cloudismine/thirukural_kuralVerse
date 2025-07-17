import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('kuralverse_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('kuralverse_token');
      localStorage.removeItem('kuralverse_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Kural API endpoints
export const kuralAPI = {
  // Get all kurals with pagination
  getKurals: (params = {}) => {
    return api.get('/kurals', { params });
  },

  // Get specific kural by number
  getKural: (number) => {
    return api.get(`/kurals/${number}`);
  },

  // Search kurals
  searchKurals: (query, params = {}) => {
    return api.get(`/kurals/search/${encodeURIComponent(query)}`, { params });
  },

  // Get kurals by paal (category)
  getKuralsByPaal: (paal, params = {}) => {
    return api.get(`/kurals/paal/${encodeURIComponent(paal)}`, { params });
  },

  // Get kurals by adhigaram (sub-category)
  getKuralsByAdhigaram: (adhigaram, params = {}) => {
    return api.get(`/kurals/adhigaram/${encodeURIComponent(adhigaram)}`, { params });
  },

  // Get random kural (Kural of the Day)
  getRandomKural: () => {
    return api.get('/kurals/random');
  },

  // Get kural comments
  getKuralComments: (number, params = {}) => {
    return api.get(`/kurals/${number}/comments`, { params });
  },

  // Get overview statistics
  getStats: () => {
    return api.get('/kurals/stats/overview');
  },
};

// Authentication API endpoints
export const authAPI = {
  // User registration
  register: (userData) => {
    return api.post('/auth/register', userData);
  },

  // User login
  login: (credentials) => {
    return api.post('/auth/login', credentials);
  },

  // Get user profile
  getProfile: () => {
    return api.get('/auth/profile');
  },

  // Update user profile
  updateProfile: (profileData) => {
    return api.put('/auth/profile', profileData);
  },

  // Change password
  changePassword: (passwordData) => {
    return api.post('/auth/change-password', passwordData);
  },

  // Logout
  logout: () => {
    return api.post('/auth/logout');
  },

  // Delete account
  deleteAccount: (passwordData) => {
    return api.delete('/auth/account', { data: passwordData });
  },
};

// Chat API endpoints
export const chatAPI = {
  // Chat with Thiruvalluvar AI
  chatWithAI: (message, conversationHistory = [], language = 'tamil') => {
    return api.post('/chat/gemini', { message, conversationHistory, language });
  },

  // Get AI explanation of a specific Kural
  getKuralExplanation: (kuralNumber, context = '', language = 'tamil') => {
    return api.post('/chat/kural-explanation', { kuralNumber, context, language });
  },

  // Get wisdom topics
  getWisdomTopics: () => {
    return api.get('/chat/wisdom-topics');
  },
};

// User API endpoints
export const userAPI = {
  // Favorites
  addFavorite: (kuralNumber) => {
    return api.post('/users/favorites', { kuralNumber });
  },

  removeFavorite: (kuralNumber) => {
    return api.delete(`/users/favorites/${kuralNumber}`);
  },

  getFavorites: (params = {}) => {
    return api.get('/users/favorites', { params });
  },

  // Comments
  addComment: (commentData) => {
    return api.post('/users/comments', commentData);
  },

  getUserComments: (params = {}) => {
    return api.get('/users/comments', { params });
  },

  editComment: (commentId, content) => {
    return api.put(`/users/comments/${commentId}`, { content });
  },

  deleteComment: (commentId) => {
    return api.delete(`/users/comments/${commentId}`);
  },

  // Reading progress
  markKuralAsRead: (kuralNumber) => {
    return api.post('/users/read-kural', { kuralNumber });
  },

  // User statistics
  getUserStats: () => {
    return api.get('/users/stats');
  },
};

// Health check
export const healthAPI = {
  check: () => {
    return api.get('/health');
  },
};

// Helper functions
export const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem('kuralverse_token', token);
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    localStorage.removeItem('kuralverse_token');
    delete api.defaults.headers.common['Authorization'];
  }
};

export const getAuthToken = () => {
  return localStorage.getItem('kuralverse_token');
};

export const isAuthenticated = () => {
  return !!getAuthToken();
};

export const getCurrentUser = () => {
  const userStr = localStorage.getItem('kuralverse_user');
  return userStr ? JSON.parse(userStr) : null;
};

export const setCurrentUser = (user) => {
  if (user) {
    localStorage.setItem('kuralverse_user', JSON.stringify(user));
  } else {
    localStorage.removeItem('kuralverse_user');
  }
};

export const clearAuth = () => {
  localStorage.removeItem('kuralverse_token');
  localStorage.removeItem('kuralverse_user');
  delete api.defaults.headers.common['Authorization'];
};

// Error handling helper
export const handleAPIError = (error) => {
  if (error.response) {
    // Server responded with error status
    const { status, data } = error.response;
    return {
      status,
      message: data.error || data.message || 'An error occurred',
      details: data.details || null,
    };
  } else if (error.request) {
    // Request was made but no response received
    return {
      status: 0,
      message: 'Network error - please check your connection',
      details: null,
    };
  } else {
    // Something else happened
    return {
      status: 0,
      message: error.message || 'An unexpected error occurred',
      details: null,
    };
  }
};

export default api;
